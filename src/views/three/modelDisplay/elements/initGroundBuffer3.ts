// 涟漪效果

import * as THREE from 'three';
import drivingLane from '@/assets/images/textures/ground/drivingLane.jpg';
import grass from '@/assets/images/textures/grass2.jpg';
import roughness from '@/assets/images/textures/ground/rain/可连续1.png';

import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { getIndex } from '@/utils';
import * as mock from './mock';
import noise from '@/assets/images/textures/noise/noise.png'

export function initGroundBuffer({
    scene,
    gui
}: {
    scene: THREE.Scene,
    gui: GUI
}) {
    const textureLoader = new THREE.TextureLoader(); //纹理 被加载管理器统一管理
    const colorMap = textureLoader.load(grass);
    colorMap.wrapS = THREE.RepeatWrapping;
    colorMap.wrapT = THREE.RepeatWrapping;
    // colorMap.repeat.set( 10, 1 );
    const driving = textureLoader.load(drivingLane);
    driving.wrapS = THREE.RepeatWrapping;
    driving.wrapT = THREE.RepeatWrapping;

    const roughnessMap = textureLoader.load(roughness);
    roughnessMap.wrapS = THREE.RepeatWrapping;
    roughnessMap.wrapT = THREE.RepeatWrapping;
    // roughnessMap.flipY = false

    // colorMap.rotation = Math.PI / 4;
    const material = new THREE.MeshStandardMaterial({ color: 0xffdd99, side: THREE.FrontSide });

    material.map = colorMap;

    const materialDriving = new THREE.MeshStandardMaterial(
        {
            side: THREE.FrontSide,
            map: driving,
            roughnessMap: roughnessMap,
            roughness: 1,
            metalness: 1,
            // color: new THREE.Color('red')
        }
    );
    // 使用噪声贴图
    const gu = {
        iTime: { value: 0 },
    };
    // 插入自定义的 shader 代码
    materialDriving.onBeforeCompile = (shader) => {
        // 将噪声贴图传递给片段着色器
        shader.uniforms.iTime = gu.iTime;

        // 在顶点着色器中插入自定义变量
        shader.vertexShader = `
            varying vec2 vUv;
            ${shader.vertexShader}
        `;

        // 修改顶点着色器的 main 函数，传递纹理坐标
        shader.vertexShader = shader.vertexShader.replace(
            '#include <uv_vertex>',
            `
            #include <uv_vertex>
            vUv = uv;
            `
        );

        // 在片段着色器中插入噪声函数
        shader.fragmentShader = `
            // Maximum number of cells a ripple can cross.
            #define MAX_RADIUS 2

            // Set to 1 to hash twice. Slower, but less patterns.
            #define DOUBLE_HASH 0
            #define HASHSCALE1 .1031
            #define HASHSCALE3 vec3(.1031, .1030, .0973)

            float hash12(vec2 p)
            {
                vec3 p3  = fract(vec3(p.xyx) * HASHSCALE1);
                p3 += dot(p3, p3.yzx + 19.19);
                return fract((p3.x + p3.y) * p3.z);
            }

            vec2 hash22(vec2 p)
            {
                vec3 p3 = fract(vec3(p.xyx) * HASHSCALE3);
                p3 += dot(p3, p3.yzx+19.19);
                return fract((p3.xx+p3.yz)*p3.zy);

            }

            varying vec2 vUv;
            uniform float iTime;
            

            ${shader.fragmentShader}
        `;

        // 修改片段着色器中的 roughness 计算逻辑，在现有逻辑中加入噪声
        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <dithering_fragment>',  // 在 roughness 计算部分插入自定义代码
            `
            #include <dithering_fragment>
            vec2 uv = vUv * 10.;
            vec2 p0 = floor(uv);

            vec2 circles = vec2(0.);
            for (int j = -MAX_RADIUS; j <= MAX_RADIUS; ++j)
            {
                for (int i = -MAX_RADIUS; i <= MAX_RADIUS; ++i)
                {
                    vec2 pi = p0 + vec2(i, j);
                    #if DOUBLE_HASH
                    vec2 hsh = hash22(pi);
                    #else
                    vec2 hsh = pi;
                    #endif
                    vec2 p = pi + hash22(hsh);

                    float t = fract(0.3*iTime + hash12(hsh));
                    vec2 v = p - uv;
                    float d = length(v) - (float(MAX_RADIUS) + 1.)*t - t * 1.;

                    float h = 1e-3;
                    float d1 = d - h;
                    float d2 = d + h;
                    float p1 = sin(31.*d1) * smoothstep(-0.6, -0.3, d1) * smoothstep(0., -0.3, d1);
                    float p2 = sin(31.*d2) * smoothstep(-0.6, -0.3, d2) * smoothstep(0., -0.3, d2);
                    circles += 0.5 * normalize(v) * ((p2 - p1) / (2. * h) * (1. - t) * (1. - t));
                }
            }
            circles /= float((MAX_RADIUS*2+1)*(MAX_RADIUS*2+1));

            float intensity = mix(0.01, 0.15, smoothstep(0.1, 0.6, abs(fract(0.05*iTime + 0.5)*2.-1.)));
            vec3 n = vec3(circles, sqrt(1. - dot(circles, circles)));
            vec3 color = gl_FragColor.rgb + 5.* pow(clamp(dot(n, normalize(vec3(1., 0.7, 0.5))), 0., 1.), 6.);
            gl_FragColor = vec4(color, 1.0);
            
            `
        );
    };


    // gui.add(materialDriving, 'metalness', 0, 2);
    // gui.add(materialDriving, 'roughness', 0, 2);

    const geometry = new THREE.BufferGeometry();
    // 创建顶点
    // const points = [
    //     new THREE.Vector3(-1.0, -1.0, 0.0),
    //     new THREE.Vector3(1.0, -1.0, 0.0),
    //     new THREE.Vector3(1.0, 1.0, 0.0),
    //     new THREE.Vector3(-1.0, 1.0, 0.0),
    // ]
    // const points = [
    //     new THREE.Vector3(-1.0, -1.0, 0.0),
    //     new THREE.Vector3(10.0, -1.0, 0.0),
    //     new THREE.Vector3(10.0, 1.0, 0.0),
    //     new THREE.Vector3(-1.0, 1.0, 0.0),
    // ]
    // points.reverse()
    const points = mock.points2;
    const position: number[] = [];
    points.forEach((item) => {
        position.push(item.x),
        position.push(item.y);
        position.push(item.z);
    });
    const vertices = new Float32Array(position);

    // 创建 UV 坐标
    const uv: number[] = [];
    points.forEach((item) => {
        uv.push(item.x / 3),
        uv.push(item.y / 3);
    });
    const uvs = new Float32Array(uv);

    // 创建索引
    const index = getIndex(points.length / 2);
    const indices = new Uint16Array(index);

    // 设置顶点、UV 坐标和索引
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
    geometry.setIndex(new THREE.BufferAttribute(indices, 1));
    geometry.computeVertexNormals();
    // const plane = new THREE.Mesh(geometry, material);
    const plane = new THREE.Mesh(geometry, materialDriving);

    console.log('plane', plane);
    plane.scale.set(10, 10, 10);
    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.position.set(
        0, 0, -5
    );
    scene.add(plane);

    function animationMesh(delta) {
        // materialDriving.uniforms.iTime.value =  materialDriving.uniforms.iTime.value + delta
        gu.iTime.value = gu.iTime.value + delta
    }
    return {
        animationMesh
    }


}



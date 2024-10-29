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
    const noiseTexture = new THREE.TextureLoader().load(noise);

    // 插入自定义的 shader 代码
    materialDriving.onBeforeCompile = (shader) => {
        // 将噪声贴图传递给片段着色器
        shader.uniforms.noiseTexture = { value: noiseTexture };
        shader.uniforms.noiseScale = { value: 10.0 };

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
            uniform float noiseScale;
            varying vec2 vUv;

            vec2 random2(vec2 st){
                st = vec2( dot(st,vec2(127.1,311.7)),
                        dot(st,vec2(269.5,183.3)) );
                return -1.0 + 2.0*fract(sin(st)*43758.5453123);
            }

            // Gradient Noise by Inigo Quilez - iq/2013
            // https://www.shadertoy.com/view/XdXGW8
            float noise(vec2 st) {
                vec2 i = floor(st);
                vec2 f = fract(st);

                vec2 u = f*f*(3.0-2.0*f);

                return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                                dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                            mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                                dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
            }

            ${shader.fragmentShader}
        `;

        // 修改片段着色器中的 roughness 计算逻辑，在现有逻辑中加入噪声
        shader.fragmentShader = shader.fragmentShader.replace(
            '#include <roughnessmap_fragment>',  // 在 roughness 计算部分插入自定义代码
            `

            // #include <roughnessmap_fragment>
            float roughnessFactor = roughness;
            vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv / 10. );

            // reads channel G, compatible with a combined OcclusionRoughnessMetallic (RGB) texture
            roughnessFactor *= texelRoughness.g;
            // 生成基于 UV 坐标的噪声
            // float noiseValue = noise(vUv * noiseScale);  // 取噪声值
    
            // // 将噪声和贴图值结合，调制粗糙度，使得其不那么重复
            // // roughnessFactor = texelRoughness.g * 0. + (noiseValue / 4.0 + 0.8) * 1.;  // 调整噪声影响力度
            // // roughnessFactor = noiseValue;
            // roughnessFactor = texelRoughness.g * (noiseValue * 2.0) - 0.0;  // 调整噪声影响力度    
            
            `
        );
    };


    gui.add(materialDriving, 'metalness', 0, 2);
    gui.add(materialDriving, 'roughness', 0, 2);

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
        uv.push(item.x / 1),
        uv.push(item.y / 1);
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

    // const buffer1 = createBufferGeometry()
    // buffer1.computeVertexNormals()

    // const ground3 = new THREE.Mesh(buffer1, planeMaterial);
    // ground3.scale.set(1000, 1000, 10);
    // ground3.castShadow = false;
    // ground3.receiveShadow = true;


    // scene.add(ground2);


}



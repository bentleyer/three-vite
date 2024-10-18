import * as THREE from 'three';
import drivingLane from '@/assets/images/textures/ground/drivingLane.jpg';
import grass from '@/assets/images/textures/grass2.jpg';
import roughness from '@/assets/images/textures/ground/rain/可连续1.png';

import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { getIndex } from '@/utils';
import * as mock from './mock';
import { vertex, fragment } from '../shader/ripple/index'


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
    const gu = {
        iTime: { value: 0 },
    };
    const materialDriving = new THREE.ShaderMaterial({
        uniforms:{
            iTime: gu.iTime
        },

        // vertexShader: defaultSkyboxVertexShader,
        vertexShader: vertex,
        fragmentShader: fragment,

    });
    // 使用噪声贴图

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



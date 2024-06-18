import * as THREE from 'three';
import grass from '@/assets/images/textures/grass2.jpg';
import grass_normal from '@/assets/images/textures/grass_normal.jpg';
import grass_displacement from '@/assets/images/textures/grass_displacement.jpg';
import grass_AO from '@/assets/images/textures/grass_AO.jpg';
import grass_roughness from '@/assets/images/textures/grass_roughness.jpg';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';
export function initGround({
    scene,
    gui
}: {
    scene: THREE.Scene,
    gui: GUI
}) {
    const textureLoader = new THREE.TextureLoader(); //纹理 被加载管理器统一管理
    const normalMap = textureLoader.load(grass_normal);
    const AOMap = textureLoader.load(grass_AO);
    const roughnessMap = textureLoader.load(grass_roughness);
    const colorMap = textureLoader.load(grass);
    const displacementMap = textureLoader.load(grass_displacement);
    colorMap.wrapS = THREE.RepeatWrapping;
    colorMap.wrapT = THREE.RepeatWrapping;
    // colorMap.repeat.set( 10, 1 );

    // colorMap.rotation = Math.PI / 4;
    const material = new THREE.MeshStandardMaterial({ color: 0xffdd99, side: THREE.FrontSide });

    material.map = colorMap;
    gui.add(
        colorMap.repeat,
        'x',
        1, 10, 0.1
    ).onChange(() => {
        material.map = colorMap;
    });
    gui.add(
        colorMap.repeat,
        'y',
        1, 10, 0.1
    ).onChange(() => {
        material.map = colorMap;
    });

    const geometry = new THREE.PlaneGeometry(200, 200, 64, 64); // 增加细分以提高细节

    // 添加一些随机高度（高度图）
    for (let i = 0; i < geometry.attributes.position.count; i++) {
        const z = geometry.attributes.position.getZ(i) + Math.random() * 2 - 1.5;
        geometry.attributes.position.setZ(i, z);
    }

    // 更新法线
    geometry.computeVertexNormals();

    // 创建地形网格并应用材质
    const terrain = new THREE.Mesh(geometry, material);
    scene.add(terrain);

    // const buffer1 = createBufferGeometry()
    // buffer1.computeVertexNormals()

    // const ground3 = new THREE.Mesh(buffer1, planeMaterial);
    // ground3.scale.set(1000, 1000, 10);
    // ground3.castShadow = false;
    // ground3.receiveShadow = true;


    // scene.add(ground2);


}
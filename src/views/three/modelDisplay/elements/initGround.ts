import * as THREE from 'three';
import grass from '@/assets/images/textures/grass.jpg';
import grass_normal from '@/assets/images/textures/grass_normal.jpg';
import grass_displacement from '@/assets/images/textures/grass_displacement.jpg';
import grass_AO from '@/assets/images/textures/grass_AO.jpg';
import grass_roughness from '@/assets/images/textures/grass_roughness.jpg';

export function initGround({
    scene
}: {
    scene: THREE.Scene
}) {
    const textureLoader = new THREE.TextureLoader(); //纹理 被加载管理器统一管理
    const normalMap = textureLoader.load(grass_normal);
    const AOMap = textureLoader.load(grass_AO);
    const roughnessMap = textureLoader.load(grass_roughness);
    const colorMap = textureLoader.load(grass);
    const displacementMap = textureLoader.load(grass_displacement);
    // const geometry = new THREE.PlaneGeometry(100, 100);
    // const geometry = new THREE.BoxGeometry(100, 100, 1);

    // const planeMaterial = new THREE.MeshPhongMaterial({ color: 0xffdd99 });
    // const material = new THREE.ShadowMaterial({ color: 'red' });
    // // material.opacity = 0.2;

    // const ground = new THREE.Mesh(geometry, material);
    // const ground2 = new THREE.Mesh(geometry, planeMaterial);

    // ground2.position.set(0, 0, -5);
    // // ground2.rotation.x = -Math.PI / 2;
    // ground2.scale.set(10, 10, 10);
    // ground2.castShadow = false;
    // ground2.receiveShadow = true;

    const geometry = new THREE.PlaneGeometry(100, 100);
    const material = new THREE.MeshStandardMaterial({ color: 0xffdd99, side: THREE.FrontSide });
    // material.aoMap = AOMap;
    // material.displacementMap = displacementMap;
    // material.map = colorMap;
    // material.normalMap = normalMap;
    // material.roughnessMap = roughnessMap;
    // material.metalnessMap = metalnessMap
    const plane = new THREE.Mesh(geometry, material);
    plane.scale.set(10, 10, 10);
    plane.castShadow = false;
    plane.receiveShadow = true;
    plane.position.set(
        0, 0, -5
    )
    scene.add(plane);

    // const buffer1 = createBufferGeometry()
    // buffer1.computeVertexNormals()

    // const ground3 = new THREE.Mesh(buffer1, planeMaterial);
    // ground3.scale.set(1000, 1000, 10);
    // ground3.castShadow = false;
    // ground3.receiveShadow = true;


    // scene.add(ground2);


}
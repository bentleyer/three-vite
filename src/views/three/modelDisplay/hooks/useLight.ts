import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { ref } from 'vue';
const SHADOW_MAP_WIDTH = 8192;
const SHADOW_MAP_HEIGHT = 8192;


export function useLight({
    scene,
}: {
    scene: THREE.Scene
}) {
    const color = 0xFFFFFF;
    const intensity = 6;
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(40, 80, 100);
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.top = 1000;
    directionalLight.shadow.camera.bottom = -1000;
    directionalLight.shadow.camera.left = -1000;
    directionalLight.shadow.camera.right = 1000;
    directionalLight.shadow.camera.near = 3;
    directionalLight.shadow.camera.far = 8000;
    directionalLight.shadow.bias = 0.001;
    directionalLight.shadow.radius = 4;
    scene.add(directionalLight.target);
    directionalLight.userData.direction = directionalLight.target.position.clone().sub(directionalLight.position);

    directionalLight.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    directionalLight.shadow.mapSize.height = SHADOW_MAP_HEIGHT;
    scene.add(directionalLight);
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    // let samlldirectionalLightt = new THREE.directionalLightt(0xffffff);
    // this.smallScene.add(samlldirectionalLightt);
    return {
        light: directionalLight
    };

}
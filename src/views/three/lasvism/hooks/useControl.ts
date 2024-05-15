import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ref } from 'vue';

export function useControl({
    scene,
    camera,
    renderer
}) {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target = new THREE.Vector3(0, 0, 0);
    controls.mouseButtons = {
        //左键平移
        LEFT: THREE.MOUSE.PAN,
        //滚轮滑动
        MIDDLE: THREE.MOUSE.DOLLY,
        //右键旋转
        RIGHT: THREE.MOUSE.ROTATE
    };
    controls.listenToKeyEvents(window);
    controls.minDistance = 8;
    controls.maxDistance = 10000;
    controls.screenSpacePanning = false; //摄像机将在与摄像机向上方向垂直的平面中平移
    controls.minPolarAngle = 0; // radians
    controls.maxPolarAngle = 1.5;
    return {
        controls
    };
}


import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { useInit } from './hooks/useInit';
import { makeInstance } from './hooks/useInstance';
// 构建目标路径

const {
    stats,
    scene,
    camera,
    renderer,
    controls,
    ambientLight,
    directionalLights,
    directionalLight
} = useInit();

window.onresize = function () {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

};

const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;

const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

const cubes = [
    makeInstance({
        geometry,
        color: 0x44aa88, 
        x:0,
        scene
    }),
    makeInstance({
        geometry,
        color: 0x8844aa, 
        x: -2,
        scene
    }),
    makeInstance({
        geometry,
        color: 0xaa8844, 
        x: 2,
        scene
    }),
];

function animate() {
    controls.update();
    stats.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

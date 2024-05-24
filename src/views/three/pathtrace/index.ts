

import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { useInit } from './hooks/useInit';
import { makeInstance } from './hooks/useInstance';
import { initLoader } from './elements/initLoader';
import { initGround } from './elements/initGround';
import { WebGLPathTracer } from 'three-gpu-pathtracer';

export function getScaledSettings() {

    let tiles = 3;
    let renderScale = Math.max(1 / window.devicePixelRatio, 0.5);

    // adjust performance parameters for mobile
    const aspectRatio = window.innerWidth / window.innerHeight;
    if (aspectRatio < 0.65) {

        tiles = 4;
        renderScale = 0.5 / window.devicePixelRatio;

    }

    return { tiles, renderScale };

}


// 构建目标路径

const {
    stats,
    scene,
    camera,
    renderer,
    controls,
} = await useInit();


await initLoader({
    scene
});
// initGround({
//     scene
// });



window.onresize = function () {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

};

const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;

const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

/* const cubes = [
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
]; */
const { tiles, renderScale } = getScaledSettings();

let pathTracer;
pathTracer = new WebGLPathTracer(renderer);
pathTracer.filterGlossyFactor = 0.5;
pathTracer.renderScale = renderScale;
pathTracer.tiles.set(tiles, tiles);
pathTracer.setScene(scene, camera);

controls.addEventListener('change', () => pathTracer.updateCamera());
controls.update();

function animate() {
    // controls.update();
    // stats.update();
    // renderer.render(scene, camera);
    pathTracer.renderSample();
    requestAnimationFrame(animate);
}

animate();

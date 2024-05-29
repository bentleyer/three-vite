

import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { useInit } from './hooks/useInit';
import { makeInstance } from './hooks/useInstance';
import { initLoader } from './elements/initLoader';
import { initGround } from './elements/initGround';
import { WebGLPathTracer } from 'three-gpu-pathtracer';
import { ParallelMeshBVHWorker } from './workers/ParallelMeshBVHWorker.js';

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

let pathTracer;
pathTracer = new WebGLPathTracer(renderer);
pathTracer.bounces = 5
// pathTracer.filterGlossyFactor = 0.5;
// pathTracer.renderScale = renderScale;
// pathTracer.tiles.set(tiles, tiles);
pathTracer.setBVHWorker( new ParallelMeshBVHWorker() );

pathTracer.setSceneAsync(scene, camera);


const { animationMesh } = await initLoader({
    scene
});

// initGround({
//     scene
// });
let progress = 0

pathTracer.setSceneAsync(scene, camera, {
    onProgress: (v) => {
        progress = v
        console.log('onProgress', v)
    }
} );


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


controls.addEventListener('change', () => pathTracer.updateCamera());
controls.update();

function animate() {
    controls.update();
    stats.update();
    animationMesh()
    let flag = false
    // renderer.render(scene, camera);
    // console.log('start', new Date().getTime())
    // console.log('start', performance.now())
    if  (progress === 1) {
        if (flag) {
            pathTracer.renderSample();
            flag = !flag
        } else {
            renderer.render(scene, camera);
            flag = !flag
        }
    } else {
        renderer.render(scene, camera);
    }
    // console.log('end', performance.now())

    requestAnimationFrame(animate);
}

animate();


export function handleClick() {
    initGround({
        scene
    });
}
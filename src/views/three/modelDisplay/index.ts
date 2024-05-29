

import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { useInit } from './hooks/useInit';
import { makeInstance } from './hooks/useInstance';
import { initLoader } from './elements/initLoader';
import { initGround } from './elements/initGround';
// import { initLoader } from './elements/initLoader2';

// 构建目标路径

const {
    stats,
    scene,
    camera,
    renderer,
    controls,
    light
} = useInit();

window.onresize = function () {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

};

initLoader({
    scene
});

initGround({
    scene
});


function animate() {
    controls.update();
    stats.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

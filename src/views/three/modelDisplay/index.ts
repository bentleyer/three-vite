

import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { useInit } from './hooks/useInit';
import { makeInstance } from './hooks/useInstance';
// import { initLoader } from './elements/initLoader';
// import { initGround } from './elements/initGround';
// import { initGround as initGroundBuffer } from './elements/initGroundBuffer';
import { initGround } from './elements/initGround';

// import { initGround } from './elements/initGroundTerrain';

// import { initLoader } from './elements/initLoader2';
// import { initLoader } from './elements/initLoader3';
// import { initLoader } from './elements/initLoaderBuilding1';
// import { initLoader } from './elements/initLoaderBuilding2';
// import { initLoader } from './elements/initLoaderMainCar';
// import { initLoader } from './elements/initLoaderTree1';
// import { initLoader } from './elements/initLoaderTreePine';

// import { initLoader } from './elements/initLoaderPeople';
// import { initLoader } from './elements/initLoaderPeopleColor';
// import { initLoader } from './elements/initLoaderSuv';
// import { initLoader } from './elements/initLoaderBus';
import { initLoader } from './elements/initLoaderLexus';


// 构建目标路径

const {
    stats,
    scene,
    camera,
    renderer,
    controls,
    light,
    gui
} = useInit();

window.onresize = function () {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

};

initLoader({
    scene,
    gui
});

initGround({
    scene,
    gui
});

// initGroundBuffer({
//     scene,
//     gui
// });

console.log('scene', scene, )


function animate() {
    controls.update();
    stats.update();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
}

animate();

function handleClick() {
    //   state.camera.rotation.set(0, 0, baseDate.main_vehicle.phi - Math.PI / 2)
    console.log('handleClick', camera, scene)
}

export {
    handleClick
}

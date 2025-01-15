

import * as THREE from 'three';
import Stats from 'three/addons/libs/stats.module.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { useInit } from './hooks/useInit';
import { makeInstance } from './hooks/useInstance';
// import { initLoader } from './elements/initLoader';
// import { initGround } from './elements/initGround';
// import { initGround as initGroundBuffer } from './elements/initGroundBuffer';
import { usePostProcessing } from './hooks/usePostprocessing';
import { initGround } from './elements/initGround';
import { initGroundBuffer } from './elements/initGroundBuffer';
// import { initGroundBuffer } from './elements/initGroundBuffer3';


// import { initGround } from './elements/initGroundTerrain';

// import { initLoader } from './elements/initLoader2';
// import { initLoader } from './elements/initLoader3';
// import { initLoader } from './elements/initLoaderBuilding1';
// import { initLoader } from './elements/initLoaderBuilding2';
// import { initLoader } from './elements/initLoaderBuilding3';

// import { initLoader } from './elements/initLoaderBuilding5';

// import { initLoader } from './elements/initLoaderMainCar';
// import { initLoader } from './elements/initLoaderTree1';
// import { initLoader } from './elements/initLoaderTreePine';
// import { initLoader } from './elements/initLoaderTreeBush1';


// import { initLoader } from './elements/initLoaderPeople';
// import { initLoader } from './elements/initLoaderPeopleColor';
import { initLoader } from './elements/initLoaderSuv';
// import { initLoader } from './elements/initLoaderSuvOld';
// import { initLoader } from './elements/initLoaderSuvLight';


// import { initLoader } from './elements/initLoaderBus';
// import { initLoader } from './elements/initLoaderTruck';
// import { initLoader } from './elements/initLoaderLexus';
// import { initLoader } from './elements/initLoaderLexusDongFeng';

import { initLoader as initLoaderLight } from './elements/initLoaderTrafficlight';
// import { initLoader } from './elements/initLoaderMinivan';
// import { initLoader } from './elements/initLoaderMini';


// streen
// import { initLoader } from './elements/initLoaderStreetLamp';


// weather
import { initRain } from './elements/initRain';
import { initParticles } from './elements/initParticles';
import { initCloud  } from './elements/initCloud';
import { initSnow  } from './elements/weather/initSnow';
import {  useFog  } from './elements/weather/fog/useFog';


const clock = new THREE.Clock();

// 构建目标路径

const {
    stats,
    scene,
    camera,
    renderer,
    controls,
    // light,
    gui,
    envMap,
    animation: animationEnv
} = useInit();

window.onresize = function () {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

};

const {
    animationMesh,
} = await initLoader({
    scene,
    gui
});

// const {
    
// } = await initLoader2({
//     scene,
//     gui
// });

// initLoaderLight({
//     scene,
//     gui
// });



// 天气

// const {
//     animationMesh: animationMesh2
// } = initRain({
//     scene,
//     gui
// });


// const {
//     animationMesh: animationMesh2,
//     handleClick: handleClickSnow,
//     handleClick2: handleClickSnow2
// } = initSnow({
//     scene,
//     gui,
//     camera
// });

// useFog({
//     scene,
//     gui,
// });

// const {
//     animationMesh: animationMesh2
// } = initParticles({
//     scene,
//     gui,
//     camera
// });

//  await initCloud({
//     scene,
//     gui,
//     camera
// });

// 地面

initGround({
    scene,
    gui
});

// const {
//     animationMesh: animationMesh3
// } = initGroundBuffer({
//     scene,
//     gui,
// });

initGroundBuffer({
    scene,
    gui,
});

console.log('scene', scene,);

// const {
//     composer,
//     bloomComposer,
//     finalComposer,
//     bloomLayer
// } = usePostProcessing({
//     scene,
//     gui,
//     renderer,
//     camera
// });

function animate() {
    const delta = clock.getDelta();
    // animationMesh(delta)
    // animationMesh2(delta)
    // animationMesh3(delta)
    // animationMesh2(delta)
    controls.update();
    stats.update();
    renderer.render(scene, camera);
    // scene.environment = null;
    // scene.background = new THREE.Color('black')

    // scene.traverse(darkenNonBloomed);
    // bloomComposer.render();
    // scene.traverse(restoreMaterial);
    // scene.environment = envMap;
    // scene.background = envMap;

    // render the entire scene, then render bloom scene on top
    // finalComposer.render();
    requestAnimationFrame(animate);
}

const materials = new Map()
const darkMaterial = new THREE.MeshBasicMaterial( { color: 'black' } );



function darkenNonBloomed( obj ) {

    if ( obj.isMesh && bloomLayer.test( obj.layers ) === false ) {
        materials.set(obj.uuid, obj.material)
        // materials[ obj.uuid ] = obj.material;
        obj.material = darkMaterial;

    }

}

function restoreMaterial( obj ) {

    if ( materials.has(obj.uuid) ) {

        obj.material = materials.get(obj.uuid);
        // delete materials[ obj.uuid ];
        materials.delete(obj.uuid)
    }

}

animate();

function handleClick() {
    //   state.camera.rotation.set(0, 0, baseDate.main_vehicle.phi - Math.PI / 2)
    console.log('handleClick', camera, scene);
    handleClickSnow()
}

function handleClick2() {
    //   state.camera.rotation.set(0, 0, baseDate.main_vehicle.phi - Math.PI / 2)
    handleClickSnow2()
}

export {
    handleClick,
    handleClick2
};


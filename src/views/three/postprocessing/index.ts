

import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { BloomPass } from 'three/addons/postprocessing/BloomPass.js';
import { FilmPass } from 'three/addons/postprocessing/FilmPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { useInit } from './hooks/useInit';
import { makeInstance } from './hooks/useInstance';
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
    }).cube,
    makeInstance({
        geometry,
        color: 0x8844aa, 
        x: -2,
        scene
    }).cube,
    makeInstance({
        geometry,
        color: 0xaa8844, 
        x: 2,
        scene
    }).cube,
];


const composer = new EffectComposer( renderer );
composer.addPass( new RenderPass( scene, camera ) );

const bloomPass = new BloomPass(
    1, // strength
    25, // kernel size
    4, // sigma ?
    256, // blur render target resolution
);
composer.addPass( bloomPass );

const filmPass = new FilmPass(
    0.5, // intensity
    false, // grayscale
);
composer.addPass( filmPass );

const outputPass = new OutputPass();
composer.addPass( outputPass );
let then = 0;

function render( now ) {

    now *= 0.001; // convert to seconds
    const deltaTime = now - then;
    then = now;

    // if ( resizeRendererToDisplaySize( renderer ) ) {

    //     const canvas = renderer.domElement;
    //     camera.aspect = canvas.clientWidth / canvas.clientHeight;
    //     camera.updateProjectionMatrix();
    //     composer.setSize( canvas.width, canvas.height );

    // }

    cubes.forEach( ( cube, ndx ) => {

        const speed = 1 + ndx * .1;
        const rot = now * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;

    } );

    composer.render(  );

    requestAnimationFrame( render );

}

requestAnimationFrame( render );

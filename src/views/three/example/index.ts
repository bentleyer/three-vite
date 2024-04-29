

import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import myModel from '@/assets/models/gltf/LittlestTokyo.glb?url'
import { dracePath } from '@/utils';
// 构建目标路径
// const targetPath = srcPath + '/assets/libs/draco/gltf/';

let mixer;
const mixers: THREE.AnimationMixer[] = [];

const clock = new THREE.Clock();
// const container = document.getElementById('container');

const stats = new Stats();
document.body.appendChild(stats.dom);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const pmremGenerator = new THREE.PMREMGenerator(renderer);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xbfe3dd);
scene.environment = pmremGenerator.fromScene(new RoomEnvironment(renderer), 0.04).texture;

const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
camera.position.set(50, 20, 80);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0.5, 0);
controls.update();
// controls.enablePan = false;
// controls.enableDamping = true;

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/src/assets/libs/draco/gltf/');

const loader = new GLTFLoader();
loader.setDRACOLoader(dracoLoader);
loader.load(myModel, function (gltf) {

    const model = gltf.scene;
    model.position.set(1, 1, 0);
    model.scale.set(0.01, 0.01, 0.01);
    for (let i = 0; i < 10; i++) {

        const model2 = model.clone();
        model2.position.set(Math.random() * 50, Math.random() * 50, 0);

        scene.add(model2);
        const mixer = new THREE.AnimationMixer(model2);
        mixer.clipAction(gltf.animations[0]).play();
        mixers.push(mixer);
    }

    scene.add(model);
    console.log('gltf', gltf);

    mixer = new THREE.AnimationMixer(model);
    mixer.clipAction(gltf.animations[0]).play();
    mixers.push(mixer);

    animate();

}, undefined, function (e) {

    console.error(e);

});


window.onresize = function () {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

};


function animate() {

    requestAnimationFrame(animate);

    const delta = clock.getDelta();

    // mixer.update( delta );
    for (const mixer of mixers) {
        mixer.update(delta);
    }


    controls.update();

    stats.update();

    renderer.render(scene, camera);

}



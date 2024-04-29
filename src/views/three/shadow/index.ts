

import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// 构建目标路径
const SHADOW_MAP_WIDTH = 2048, SHADOW_MAP_HEIGHT = 1024;

let renderer;
let camera;
let scene;
let controls;
let stats

function initControl() {
    controls = new OrbitControls(camera, renderer.domElement);

    controls.update();
}

function initCamera() {

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.set(0, -100, 50);
}

function initRender() {
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.autoClear = true;
    renderer.sortObjects = true;

    renderer.shadowMap.enabled = true;
    // renderer.shadowMap.type = THREE.BasicShadowMap
    // renderer.shadowMap.type = THREE.VSMShadowMap

}

function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
}

function initState() {
    stats = new Stats();
    document.body.appendChild(stats.dom);
}


const clock = new THREE.Clock();
// const container = document.getElementById('container');


initScene();

initRender();

initCamera();

initControl();
// renderer.setClearColor(new THREE.Color('red'));
initState();

// const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
// camera.position.set(50, 20, 80);


// controls.enablePan = false;


// renderer.shadowMap.type;

function initLight() {
    const ambient = new THREE.AmbientLight(0xffffff);
    scene.add(ambient);

    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(-100, -100, 200);
    light.castShadow = true;
    light.shadow.camera.top = 2000;
    light.shadow.camera.bottom = -2000;
    light.shadow.camera.left = -2000;
    light.shadow.camera.right = 2000;
    light.shadow.camera.near = 0;
    light.shadow.camera.far = 1000;
    light.shadow.bias = -0.001;
    light.shadow.radius = 1;

    light.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    light.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    scene.add(light);
}

initLight()


const geometry = new THREE.PlaneGeometry(100, 100);
const planeMaterial = new THREE.MeshPhongMaterial({ color: 0xffdd99 });
const material = new THREE.ShadowMaterial({ color: 'red' });
// material.opacity = 0.2;

const ground = new THREE.Mesh(geometry, material);
const ground2 = new THREE.Mesh(geometry, planeMaterial);

ground2.position.set(0, 0, 0);
// ground2.rotation.x = -Math.PI / 2;
ground2.scale.set(10, 10, 10);
ground2.castShadow = false;
ground2.receiveShadow = true;
scene.add(ground2);


ground.position.set(0, 0, 5);
// ground.rotation.x = -Math.PI / 2;
ground.scale.set(10, 10, 10);

ground.castShadow = false;
ground.receiveShadow = true;
// scene.add(ground);

const cubeGeometry = new THREE.CapsuleGeometry( 10, 10, 40, 88 ); 

const cubes1 = new THREE.Mesh(cubeGeometry, planeMaterial);

cubes1.position.y = 0;
cubes1.position.z = 3;

cubes1.castShadow = true;
cubes1.receiveShadow = false;

scene.add(cubes1);


window.onresize = function () {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

};

const axesHelper = new THREE.AxesHelper(500);
scene.add(axesHelper);


function animate() {

    requestAnimationFrame(animate);

    const delta = clock.getDelta();


    controls.update();

    stats.update();

    renderer.render(scene, camera);

}

animate();

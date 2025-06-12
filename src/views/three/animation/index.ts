import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
// import myModel from '@/assets/models/gltf/Audibm_min.glb?url';
// import myModel from '@/assets/models/gltf/Audi.glb?url';
// import myModel from '@/assets/models/gltf/ferrari.glb?url';
import myModel from '@/assets/models/door/door.glb?url';


// 构建目标路径
const SHADOW_MAP_WIDTH = 4096, SHADOW_MAP_HEIGHT = 4096;

let renderer: any;
let camera: any;
let scene: any;
let controls: any;
let grid: any;
let stats: any;
const sceneModel = new THREE.Group();
const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff0000, metalness: 1.0, roughness: 0.5, clearcoat: 1.0, clearcoatRoughness: 0.03
});

const detailsMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff, metalness: 1.0, roughness: 0.5
});

const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, metalness: 0.25, roughness: 0, transmission: 1.0
});

function initControl() {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();
}

function initCamera() {

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
    camera.up = new THREE.Vector3(0, 0, 1);
    camera.position.set(0, 10, 5);
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
    // renderer.shadowMap.type = THREE.VSMShadowMap;

}

function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.matrixWorldAutoUpdate = false;
}

function initState() {
    stats = new Stats();
    document.body.appendChild(stats.dom);
}

function initGrid() {
    grid = new THREE.GridHelper(200, 200, 0x000000, 0x000000);
    grid.rotation.x = Math.PI / 2;
    grid.material.opacity = 0.2;
    grid.material.depthWrite = false;
    grid.material.transparent = true;
    scene.add(grid);
}
export function changeBody(type:string, event: any) {
    if (type === 'body') {
        bodyMaterial.color.set(event?.target?.value);
    }
    if (type === 'details') {
        detailsMaterial.color.set(event?.target?.value);
    }
    if (type === 'glass') {
        glassMaterial.color.set(event?.target?.value);
    }
}
function initLight() {
    // const ambient = new THREE.AmbientLight(0xffffff);
    // scene.add(ambient);

    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(-100, -100, 100);
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

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    scene.add(light);
}


function animationMesh() {

    sceneModel.children.forEach((child) => {
        const rotationSpeed = {
            x: 0,
            y: 0.01,
            z: 0
        };
        child.rotation.set(
            child.rotation.x + rotationSpeed.x,
            child.rotation.y + rotationSpeed.y,
            child.rotation.z + rotationSpeed.z
        );
        // child.position = new THREE.Vector3(
        //     child.position.x + Math.sin(0 * rotationSpeed.x),
        //     child.position.y + Math.sin(100 * rotationSpeed.y),
        //     child.position.z + Math.sin(rotationSpeed.z)
        // )
        // child.position.set(
        //     child.position.x + Math.sin(0 * rotationSpeed.x),
        //     child.position.y + Math.sin(100 * rotationSpeed.y),
        //     child.position.z + Math.sin(rotationSpeed.z)
        // );
    });
}
let open: any;
let close: any;
let mixer: any;
function initLoader() {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/src/assets/libs/draco/gltf/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    loader.load(myModel, function (gltf: any) {


        const model = gltf.scene;

        // 动画

        const animations = gltf.animations;

        mixer = new THREE.AnimationMixer(model);
        // close = mixer.clipAction(animations[0]);
        open = mixer.clipAction(animations[1]);
        console.log(mixer, close, open, 'animations');
        console.log(open.getClip().duration, 'open duration');
        open.enabled = true;
        open.clampWhenFinished = true;
        open.play();
        open.weight = 1;
        // open.timeScale = 0.5;

        // model.castShadow = true;
        // model.traverse((obj) => {
        //     if (obj.isObject3D) {
        //         obj.castShadow = true;
        //     }
        // });
        // const carModel: any = gltf.scene.children[0];

        // carModel.getObjectByName('body').material = bodyMaterial;

        // carModel.getObjectByName('rim_fl').material = detailsMaterial;
        // carModel.getObjectByName('rim_fr').material = detailsMaterial;
        // carModel.getObjectByName('rim_rr').material = detailsMaterial;
        // carModel.getObjectByName('rim_rl').material = detailsMaterial;
        // carModel.getObjectByName('trim').material = detailsMaterial;

        // carModel.getObjectByName('glass').material = glassMaterial;
        model.rotation.x = Math.PI / 2;

        // makeBatch(model)
        // makeInstance(model);
        // makeMerge(model);
        // makeMergeAll(model)

        scene.add(model);

        console.log('gltf', gltf, scene);

        // mixer = new THREE.AnimationMixer(model);
        // mixer.clipAction(gltf.animations[0]).play();
        // mixers.push(mixer);
        scene.updateMatrixWorld();
        animate();

    }, undefined, function (e) {

        console.error(e);

    });
}


const clock = new THREE.Clock();
// const container = document.getElementById('container');


initScene();

initRender();

initGrid();
initCamera();

initControl();
// renderer.setClearColor(new THREE.Color('red'));
initState();


initLight();
// initInput();
// initBatch()
initLoader();


window.onresize = function () {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

};

const axesHelper = new THREE.AxesHelper(500);
scene.add(axesHelper);


function animate() {
    requestAnimationFrame(animate);
    // scene.updateMatrixWorld();
    // scene.updateMatrixWorld()
    const delta = clock.getDelta();
    // sceneModel.updateMatrixWorld();
    mixer.update(delta);

    animationMesh();

    controls.update();

    stats.update();

    renderer.render(scene, camera);
}

// animate();

export const playAnimation = (type:string) => {

    console.log(234);

    if (type === 'open') {
        open.weight = 1;
        close.weight = 0;
        open.play();
    } else if (type === 'close') {
        close.play();
    }
};
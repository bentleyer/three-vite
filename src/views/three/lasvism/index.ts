

import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import myModel from '@/assets/models/gltf/Audibm_min.glb?url';
// import myModel from '@/assets/models/gltf/Audi.glb?url';

import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import { useInit } from './hooks/useInit'
import { initLoader } from './elements/initLoader';

// 构建目标路径
const SHADOW_MAP_WIDTH = 4096, SHADOW_MAP_HEIGHT = 4096;

const mixers: THREE.AnimationMixer[] = [];
const count = 100;
const sceneModel = new THREE.Group();
const modelArr = [];
let stats

const {
    scene,
    camera,
    renderer,
    controls,
    ambientLight,
    directionalLights,
    directionalLight
} = useInit()


function initState() {
    stats = new Stats();
    document.body.appendChild(stats.dom);
}


function initBatch() {
    const box = new THREE.BoxGeometry(10, 10, 10);
    const sphere = new THREE.BoxGeometry(100, 1, 3);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

    // initialize and add geometries into the batched mesh
    const batchedMesh = new THREE.BatchedMesh(10, 5000, 10000, material);
    const boxId = batchedMesh.addGeometry(box);
    const sphereId = batchedMesh.addGeometry(sphere);
    scene.add(batchedMesh);
}


function animationMesh() {
    /* modelArr.forEach((child) => {
        const rotationSpeed = {
            x: 0,
            y: 0.01,
            z: 0
        }
        child.rotation.set(
            child.rotation.x + rotationSpeed.x,
            child.rotation.y + rotationSpeed.y,
            child.rotation.z + rotationSpeed.z
        );
    }) */
    sceneModel.position.set(
        sceneModel.position.x + 0.1,
        sceneModel.position.y + 0.1,
        sceneModel.position.z
    );

    /* sceneModel.children.forEach((child) => {
        const rotationSpeed = {
            x: 0,
            y: 0.01,
            z: 0
        }
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
    }) */
}

const clock = new THREE.Clock();
// const container = document.getElementById('container');


// renderer.setClearColor(new THREE.Color('red'));
initState();

// initBatch()
initLoader({
    scene
});

function createBufferGeometry() {
    const geometry = new THREE.BufferGeometry();
    // 创建一个简单的矩形. 在这里我们左上和右下顶点被复制了两次。
    // 因为在两个三角面片里，这两个顶点都需要被用到。
    const vertices = new Float32Array([
        -1.0, -1.0, 1.0,
	    1.0, -1.0, 1.0,
	    1.0, 1.0, 1.0,

	    1.0, 1.0, 1.0,
        -1.0, 1.0, 1.0,
        -1.0, -1.0, 1.0
    ]);

    // itemSize = 3 因为每个顶点都是一个三元组。
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    return geometry
}


// const geometry = new THREE.PlaneGeometry(100, 100);
const geometry = new THREE.BoxGeometry(100, 100, 1);

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

// const buffer1 = createBufferGeometry()
// buffer1.computeVertexNormals()

// const ground3 = new THREE.Mesh(buffer1, planeMaterial);
// ground3.scale.set(1000, 1000, 10);
// ground3.castShadow = false;
// ground3.receiveShadow = true;


scene.add(ground2);


window.onresize = function () {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

};

const axesHelper = new THREE.AxesHelper(500);
scene.add(axesHelper);

console.log('scene', scene);

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    sceneModel.updateMatrixWorld();

    // animationMesh()

    // mixer.update( delta );
    for (const mixer of mixers) {
        mixer.update(delta);
    }

    controls.update();

    stats.update();

    renderer.render(scene, camera);
}

animate();

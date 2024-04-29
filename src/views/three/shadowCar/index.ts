

import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import myModel from '@/assets/models/gltf/Audibm_min.glb?url';
// import myModel from '@/assets/models/gltf/Audi.glb?url';

import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';


// 构建目标路径
const SHADOW_MAP_WIDTH = 4096, SHADOW_MAP_HEIGHT = 4096;

let renderer;
let camera;
let scene;
let controls;
let stats;
const mixers: THREE.AnimationMixer[] = [];
let count = 1000;
const sceneModel = new THREE.Group()
const modelArr = []


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
    // renderer.shadowMap.type = THREE.VSMShadowMap;
    console.log('renderer', renderer)

}

function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.matrixWorldAutoUpdate = false
}

function initState() {
    stats = new Stats();
    document.body.appendChild(stats.dom);
}

function initLight() {
    const ambient = new THREE.AmbientLight(0xffffff);
    scene.add(ambient);

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

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    scene.add(light);
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

function makeBatch(model) {
    // 两个高模车就把顶点用完了，不行
    const geometryCount = 100;
    const vertexCount = 20000000;
    const indexCount = 20000000;
    const material = new THREE.MeshPhongMaterial({
        color: '#ffffff',
    });
    const ids = [];
    const mesh = new THREE.BatchedMesh(geometryCount, vertexCount, indexCount, material);


    for (let i = 0; i < 2; i++) {

        const model2 = model.clone();
        // model2.position.set(Math.random() * 500, Math.random() * 500, 0);
        // group.add(model2);
        model2.position.set(0, 0, 50);
        // model2.position.set(Math.random() * 500, Math.random() * 500, 10);
        // model2.rotation.Y = Math.PI / 2;
        model2.traverse((obj) => {
            if (obj.geometry) {
                const newGeometry = obj.geometry.clone();
                const matrix = new THREE.Matrix4();

                const quaternion = new THREE.Quaternion();
                obj.getWorldQuaternion(quaternion);

                const position = new THREE.Vector3();
                obj.getWorldPosition(position);
                const scale = new THREE.Vector3(1, 1, 1);

                obj.getWorldScale(scale);

                matrix.compose(position.clone(), quaternion, scale.clone());
                const id = mesh.addGeometry(newGeometry);
                mesh.setMatrixAt(id, matrix);
                ids.push(id);

            }
        });
    }
    mesh.castShadow = true;
    scene.add(mesh);

}

function makeInstance (model) {

    for (let i = 0; i < count; i++) {

        const model2 = model.clone();
        model2.position.set(Math.random() * 500, Math.random() * 500, 10);
        // model2.rotation.Y = Math.PI / 2;

        model2.traverse((obj) => {
            if (obj.geometry) {
                const newGeometry = obj.geometry.clone();
                const material = obj.material;
                const mesh = new THREE.InstancedMesh(newGeometry, material, 1);

                const matrix = new THREE.Matrix4();

                const quaternion = new THREE.Quaternion();
                obj.getWorldQuaternion(quaternion);

                const position = new THREE.Vector3();
                obj.getWorldPosition(position);
                const scale = new THREE.Vector3(1, 1, 1);

                obj.getWorldScale(scale);

                matrix.compose(position.clone(), quaternion, scale.clone());
                mesh.setMatrixAt(0, matrix);
                mesh.castShadow = true;
                scene.add(mesh);

            }
        });
    }


}

function makeMerge(model) {

    for (let i = 0; i < count; i++) {
        const geometries = [];
        let material;

        const model2 = model.clone();

        model2.traverse((obj) => {
            if (obj instanceof THREE.Mesh) {
                const newGeometry = obj.geometry.clone();

                const matrix = new THREE.Matrix4();

                const quaternion = new THREE.Quaternion();
                obj.getWorldQuaternion(quaternion);

                const position = new THREE.Vector3();
                obj.getWorldPosition(position);
                const scale = new THREE.Vector3(1, 1, 1);

                obj.getWorldScale(scale);

                matrix.compose(position.clone(), quaternion, scale.clone());
                newGeometry.applyMatrix4(matrix);
                geometries.push(newGeometry);
                if (!material) {
                    material = new THREE.MeshStandardMaterial({
                        ...obj.material,
                        color: '#ffffff',
                    });
                }

            }
        });
        const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries, true);
        const mergedMesh = new THREE.Mesh(mergedGeometry, material);
        mergedMesh.position.set(Math.random() * 1000 - 500, Math.random() * 1000 - 500, 10);

        mergedMesh.castShadow = true;

        scene.add(mergedMesh);
    }


}

function makeMergeAll(model) {
    const mergedGeometries = []
    let material;

    for (let i = 0; i < count; i++) {
        const geometries = [];
        const model2 = model.clone();
        model2.position.set(Math.random() * 1000 - 500, Math.random() * 1000 - 500, 10);

        model2.traverse((obj) => {
            if (obj instanceof THREE.Mesh) {
                const newGeometry = obj.geometry.clone();

                const matrix = new THREE.Matrix4();

                const quaternion = new THREE.Quaternion();
                obj.getWorldQuaternion(quaternion);

                const position = new THREE.Vector3();
                obj.getWorldPosition(position);
                const scale = new THREE.Vector3(1, 1, 1);

                obj.getWorldScale(scale);

                matrix.compose(position.clone(), quaternion, scale.clone());
                newGeometry.applyMatrix4(matrix);
                geometries.push(newGeometry);
                if (!material) {
                    material = new THREE.MeshStandardMaterial({
                        ...obj.material,
                        color: '#ffffff',
                    });
                }

            }
        });
        const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries, true);
        mergedGeometries.push(mergedGeometry)

    }
    const mergedAllGeo = BufferGeometryUtils.mergeGeometries(mergedGeometries, true);

    const mergedMesh = new THREE.Mesh(mergedAllGeo, material);

    mergedMesh.castShadow = true;

    scene.add(mergedMesh);
}


function makeNaive(model) {
    for (let i = 0; i < count; i++) {
        const model2 = model.clone()
        model2.position.set(Math.random() * 1000 - 500, Math.random() * 1000 - 500, 0);
        sceneModel.add(model2)
        modelArr.push(model2)
    }
    scene.add(sceneModel)

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
    )

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

function initLoader() {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/src/assets/libs/draco/gltf/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    loader.load(myModel, function (gltf) {


        const model = gltf.scene;
        console.log('model', model)
        model.castShadow = true;
        model.traverse((obj) => {
            if (obj.isObject3D) {
                obj.castShadow = true;
            }
        });
        model.rotation.x = Math.PI / 2;
        model.scale.set(10, 10, 10);

        // makeBatch(model)
        // makeInstance(model);
        // makeMerge(model)
        // makeMergeAll(model)

        makeNaive(model)
        // scene.add(model);

        console.log('gltf', gltf);

        // mixer = new THREE.AnimationMixer(model);
        // mixer.clipAction(gltf.animations[0]).play();
        // mixers.push(mixer);
        scene.updateMatrixWorld()
        animate();

    }, undefined, function (e) {

        console.error(e);

    });
}


const clock = new THREE.Clock();
// const container = document.getElementById('container');


initScene();

initRender();

initCamera();

initControl();
// renderer.setClearColor(new THREE.Color('red'));
initState();


initLight();

// initBatch()
initLoader();


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


// ground.position.set(0, 0, 5);
// // ground.rotation.x = -Math.PI / 2;
// ground.scale.set(10, 10, 10);

// ground.castShadow = false;
// ground.receiveShadow = true;
// scene.add(ground);

// const cubeGeometry = new THREE.CapsuleGeometry(10, 10, 40, 88);

// const cubes1 = new THREE.Mesh(cubeGeometry, planeMaterial);

// cubes1.position.y = 0;
// cubes1.position.z = 3;

// cubes1.castShadow = true;
// cubes1.receiveShadow = false;

// scene.add(cubes1);


window.onresize = function () {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

};

const axesHelper = new THREE.AxesHelper(500);
scene.add(axesHelper);

console.log('scene', scene)

function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    // console.log('render', renderer.info.render);
    let sceneObjCount = 0
    scene.traverse((obj) => {
        if (obj.isObject3D) {
          sceneObjCount++
        }
    })
    console.log('render', sceneObjCount)
    // scene.updateMatrixWorld()
    sceneModel.updateMatrixWorld()
    // scene.children.forEach((model) => {
    //     if (model.isLight || model.isGroup || model.isMesh) {
    //         model.updateMatrixWorld()
    //     }
    // })

    animationMesh()

    // mixer.update( delta );
    for (const mixer of mixers) {
        mixer.update(delta);
    }

    controls.update();

    stats.update();

    renderer.render(scene, camera);
}

// animate();

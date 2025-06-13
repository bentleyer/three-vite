import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { useHdr } from '../modelDisplay/hooks/initHdr';
import { useLight } from '../modelDisplay/hooks/useLight';

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

/** 门框（骨架）——深炭黑灰 */
const doorFrameMat = new THREE.MeshPhysicalMaterial({
    color: 0x25282b,
    metalness: 0.85,
    roughness: 0.4,
    clearcoat: 0.9,
    clearcoatRoughness: 0.05,
});

/** 铰链 / 细节结合处——哑光钛银灰 */
const doorMullionMat = new THREE.MeshStandardMaterial({
    color: 0xa3a9af,
    metalness: 1.0,
    roughness: 0.4,
});

/** 中间部分（mid）——中性金属灰 */
const doorMidMat = new THREE.MeshStandardMaterial({
    color: 0x7c8187, // 中性灰，不偏蓝
    metalness: 1.0,
    roughness: 0.35,
});

/** 左右（left/right）——统一用稍暗钛银灰 */
const doorSideMat = new THREE.MeshStandardMaterial({
    color: 0x5f6468,
    metalness: 1.0,
    roughness: 0.45,
});

/** 带玻璃——淡蓝防爆玻璃 */
const doorGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x9fd4ff, // 玻璃蓝色调，也可以纯白或淡灰
    metalness: 0.25,
    roughness: 0.0, // 越低越光滑
    transmission: 1.0, // 透光度，1 表示完全透明
    transparent: true, // 必须开启透明，否则看不到透光效果
    opacity: 0.5, // 你可以调整透明度（0 ~ 1），1 不透明，0 完全透明
    ior: 1.45, // 折射率，物理真实玻璃约 1.45
    clearcoat: 1.0, // 表面清漆反光效果
    clearcoatRoughness: 0.03
});

function initControl() {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();
}

function initCamera() {

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
    camera.up = new THREE.Vector3(0, 0, 1);
    camera.position.set(0, 8, 2);
}

function initRender() {
    const gui = new GUI();
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    renderer.autoClear = true;
    renderer.sortObjects = true;

    renderer.shadowMap.enabled = true;
    // renderer.shadowMap.type = THREE.BasicShadowMap
    // renderer.shadowMap.type = THREE.VSMShadowMap;
    scene.background = new THREE.Color(0xbfe3dd);
    useHdr({
        scene,
        renderer,
        gui
    });
    useLight({
        scene,
        gui
    });

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
    if (type === 'border') {
        doorFrameMat.color.set(event?.target?.value);
    }
    if (type === 'mullion') {
        doorMullionMat.color.set(event?.target?.value);
    }
    if (type === 'mid') {
        doorMidMat.color.set(event?.target?.value);
    }
    if (type === 'left' || type === 'right') {
        doorSideMat.color.set(event?.target?.value);
    }
}
function initLight() {
    const sunLight = new THREE.DirectionalLight(0xffffff, 4);
    sunLight.position.set(10, 100, 0);
    sunLight.castShadow = true;
    scene.add(sunLight);
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
    });
}
let open: any;
let close: any;
let mixer: any;
let model: any;
function initLoader() {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/src/assets/libs/draco/gltf/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    loader.load(myModel, function (gltf: any) {


        model = gltf.scene;

        // 动画

        const animations = gltf.animations;

        mixer = new THREE.AnimationMixer(model);
        close = mixer.clipAction(animations[0]);
        open = mixer.clipAction(animations[1]);

        model.castShadow = true;
        model.traverse((obj) => {
            if (obj.isObject3D) {
                obj.castShadow = true;
            }
        });

        model.rotation.set(Math.PI / 2, Math.PI, 0); // Y轴旋转180°，正面朝向摄像机

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


initScene();
initRender();
initGrid();
initCamera();
initControl();
initState();
initLight();
initLoader();


window.onresize = function () {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

};

const axesHelper = new THREE.AxesHelper(500);
scene.add(axesHelper);


function animate() {
    scene.matrixWorldAutoUpdate = true;
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

export const playAnimation = (type: string) => {
    // 确保对两个动画的切换干净
    open.stop();
    close.stop();

    if (type === 'open') {
        open.reset();
        open.enabled = true;
        open.setLoop(THREE.LoopOnce, 1); // 播放一次
        open.clampWhenFinished = true;
        open.weight = 1;
        open.play();
        console.log('▶️ 播放 open');
    } else if (type === 'close') {
        close.reset();
        close.enabled = true;
        close.setLoop(THREE.LoopOnce, 1); // 播放一次
        close.clampWhenFinished = true;
        close.weight = 1;
        close.play();
        console.log('▶️ 播放 close');
    }
};

export function changeColor() {
    /** 名称 → 材质 的映射 */
    const doorMaterialMap: Record<string, THREE.Material> = {
        'door-border':  doorFrameMat, // 整个门外边框
        'door-mullion': doorMullionMat, // 竖向/横向竖梃（Mullion）
        'door-mid':     doorMidMat, //
        'door-left':    doorSideMat, // 左侧细节/窗框
        'door-right':   doorSideMat, // 右侧细节/窗框
        'door-glass-r' : doorGlassMat, // 玻璃面板
        'door-glass-l' : doorGlassMat, // 玻璃面板
        'door-glass-top' : doorGlassMat, // 玻璃面板
        'door-glass-mid' : doorGlassMat, // 玻璃面板
    };

    /** 批量替换：一行代码搞定 */
    Object.entries(doorMaterialMap).forEach(([ name, mat ]) =>
        applyMaterialByName(model, name, mat)
    );
}

/**
 * 按名字给模型或模型组批量替换材质
 * @param root      整个加载好的 glTF 场景或子树
 * @param name      getObjectByName 要找的节点名
 * @param material  想替换成的材质
 */
function applyMaterialByName(
    root: THREE.Object3D,
    name: string,
    material: THREE.Material
) {
    const target = root.getObjectByName(name);
    if (!target) {
        console.warn(`未找到节点 "${name}"`);
        return;
    }

    // 1️⃣ 目标本身就是 Mesh
    if ((target as any).isMesh) {
        (target as THREE.Mesh).material = material;
        return;
    }

    // 2️⃣ 目标是 Group / Object3D —— 递归替换所有子 Mesh
    target.traverse(child => {
        if ((child as any).isMesh) {
            (child as THREE.Mesh).material = material;
        }
    });
}

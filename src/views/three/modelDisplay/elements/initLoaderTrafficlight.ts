import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import * as THREE from 'three';
// import myModel from '@/assets/models/gltf/Audibm_min.glb?url';
import myModel from '@/assets/models/traffic/trafficlight.glb?url';
// import myModel from '@/assets/models/gltf/tree_min.glb?url';
// import myModel from '@/assets/models/gltf/tree.glb?url';
// import myModel from '@/assets/models/gltf/tree_mini.glb?url';
// import myModel from '@/assets/models/gltf/bwm330bm_black.glb?url';
import redOnMap from '@/assets/images/textures/traffic/Texture_trafficlight_redON_basecolor_358.jpg';
import redOffMap from '@/assets/images/textures/traffic/Texture_trafficlight_redOFF_basecolor_358.jpg';
import greenOnMap from '@/assets/images/textures/traffic/Texture_trafficlight_greenON_basecolor_358.jpg';
import greenOffMap from '@/assets/images/textures/traffic/Texture_trafficlight_greenOFF_basecolor_358.jpg';
import yellowOnMap from '@/assets/images/textures/traffic/Texture_trafficlight_amberON_basecolor_358.jpg';
import yellowOffMap from '@/assets/images/textures/traffic/Texture_trafficlight_amberOFF_basecolor_358.jpg';
import type GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';

export async function initLoader({
    scene,
    gui
}: {
    gui: GUI
}) {
    const textureLoader = new THREE.TextureLoader(); //纹理 被加载管理器统一管理

    const redOnColorMap
     = textureLoader.load(redOnMap);
    const redOffColorMap
     = textureLoader.load(redOffMap);
    const greenOnColorMap
     = textureLoader.load(greenOnMap);
    const greenOffColorMap
     = textureLoader.load(greenOffMap);
    const yellowOnColorMap
     = textureLoader.load(yellowOnMap);
    const yellowOffColorMap
     = textureLoader.load(yellowOffMap);

    redOnColorMap.flipY = false;
    redOffColorMap.flipY = false;
    greenOnColorMap.flipY = false;
    greenOffColorMap.flipY = false;
    yellowOnColorMap.flipY = false;
    yellowOffColorMap.flipY = false;

    const sceneModel = new THREE.Group();
    const modelArr = [];
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/src/assets/libs/draco/gltf/');
    const count = 10;

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    function makeNaive(model) {
        for (let i = 0; i < count; i++) {
            const model2 = model.clone();
            model2.position.set(Math.random() * 200 - 100, Math.random() * 200 - 100, 0);
            sceneModel.add(model2);
            modelArr.push(model2);
        }
        scene.add(sceneModel);

    }

    const params = {
        greenOn: false,
        redOn: true,
        yellowOn: false
    }

    const [ gltf ] = await Promise.all([
        loader.loadAsync(myModel),
    ]);
    const model = gltf.scene;

    model.castShadow = true;
    console.log('gltf', model);
    model.traverse((obj) => {
        if (obj.isMesh) {
            obj.material = obj.material.clone();

            // 绿
            if (obj.name.includes('_4')) {
                // obj.material.map = greenOnColorMap;
                obj.material.map = greenOffColorMap
                obj.material.emissiveIntensity = 0
                const greenFolder = gui.addFolder('greenFolder');

                greenFolder.add(obj.material, 'emissiveIntensity', 0, 3, 0.1);
                greenFolder.addColor(obj.material, 'emissive');
                greenFolder.add(params, 'greenOn').onChange((val) => {
                    if (val) {
                        // obj.material.emissive = new THREE.Color('green')
                        obj.material.map = greenOnColorMap
                        obj.material.emissiveIntensity = 1
                    } else {
                        // obj.material.emissive = null
                        obj.material.map = greenOffColorMap
                        obj.material.emissiveIntensity = 0
                    }
                })
                obj.layers.toggle( 2 )

                // gui.addColor(obj.material, 'color')
            }
            // 黄
            if (obj.name.includes('_5')) {
                // obj.material.map = yellowOnColorMap;
                obj.material.map = yellowOffColorMap;

                obj.material.emissiveIntensity = 0
                const yellowFolder = gui.addFolder('yellowFolder');

                yellowFolder.add(obj.material, 'emissiveIntensity', 0, 3, 0.1);
                yellowFolder.addColor(obj.material, 'emissive');
                // gui.addColor(obj.material, 'color')
                yellowFolder.add(params, 'yellowOn').onChange((val) => {
                    if (val) {
                        obj.material.map = yellowOnColorMap
                        obj.material.emissiveIntensity = 1
                    } else {
                        obj.material.map = yellowOffColorMap
                        obj.material.emissiveIntensity = 0
                    }
                })
                obj.layers.toggle( 2 )

            }
            // 红
            if (obj.name.includes('_6')) {
                obj.material.map = redOnColorMap;
                obj.material.emissiveIntensity = 1
                const redFolder = gui.addFolder('redFolder');

                redFolder.add(obj.material, 'emissiveIntensity', 0, 3, 0.1);
                redFolder.addColor(obj.material, 'emissive');
                // gui.addColor(obj.material, 'color')
                redFolder.add(params, 'redOn').onChange((val) => {
                    if (val) {
                        obj.material.map = redOnColorMap
                        obj.material.emissiveIntensity = 1
                    } else {
                        obj.material.map = redOffColorMap
                        obj.material.emissiveIntensity = 0
                    }
                })
                obj.layers.toggle( 2 )
            }

            // obj.material = obj.material.clone();
            // obj.material.map = greenOffColorMap;
            // obj.material.emissiveIntensity = 0

            obj.castShadow = true;
        }
    });
    model.rotation.x = Math.PI / 2;
    model.scale.set(10, 10, 10);
    model.position.set(0, 0, 10);
    // makeNaive(model)
    // console.log('model', model.clone(), model, model.clone())

    scene.add(model);
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
    return {
        animationMesh
    };
}
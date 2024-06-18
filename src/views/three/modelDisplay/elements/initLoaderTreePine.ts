import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import * as THREE from 'three';
// import myModel from '@/assets/models/gltf/Audibm_min.glb?url';
import myModel from '@/assets/models/gltf/tree/tree2pine.glb?url';
// import myModel from '@/assets/models/gltf/tree_min.glb?url';
// import myModel from '@/assets/models/gltf/tree.glb?url';
// import myModel from '@/assets/models/gltf/tree_mini.glb?url';
// import myModel from '@/assets/models/gltf/bwm330bm_black.glb?url';
import trunkNrmal from '@/assets/images/textures/tree/Texture_tree2pine_Trank_Normal_OpenGL.png';
import trunkMap from '@/assets/images/textures/tree/Texture_tree2pine_Trank_Base_Color.png';

import leafMap from '@/assets/images/textures/tree/Texture_tree2pine_Leavs_Base_Color.png';
import leafAlpha from '@/assets/images/textures/tree/Texture_tree2pine_Leavs_Opacity.png';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';

export async function initLoader({
    scene,
    gui
}: {
    scene: THREE.Scene
    gui: GUI
}) {
    const textureLoader = new THREE.TextureLoader(); //纹理 被加载管理器统一管理

    const trunkColorMap = textureLoader.load(trunkMap);
    const trunkNormalMap = textureLoader.load(trunkNrmal);
    const leafColorMap = textureLoader.load(leafMap);
    const leafAlphaMap = textureLoader.load(leafAlpha);

    trunkColorMap.flipY = false;
    trunkNormalMap.flipY = false;
    leafColorMap.flipY = false;
    leafAlphaMap.flipY = false;

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

    const [ gltf ] = await Promise.all([
        loader.loadAsync(myModel),
    ]);
    const model = gltf.scene;

    model.castShadow = true;
    console.log('gltf', model);
    model.traverse((obj) => {
        if (obj.isMesh) {
            if (obj.name.includes('Trank')) {
                obj.material = obj.material.clone();
                obj.material.map = trunkColorMap;
                obj.material.normalMap = trunkNormalMap;
            } else {
                obj.material = obj.material.clone();
                obj.material.metalness = 1;
                obj.material.map = leafColorMap;
                obj.material.alphaMap = leafAlphaMap;
                obj.material.side = THREE.DoubleSide;
                obj.material.depthWrite = false;
                obj.material.depthTest = true;
                obj.material.transparent = true;
                // 不知道为什么设置color和实际不相同
                obj.material.color = new THREE.Color('#b7f5d5')
                // obj.material.color = new THREE.Color('#b7f5d5').multiplyScalar(123 / 136);

                gui.add(obj.material, 'depthWrite', [ true, false ]);
                gui.add(obj.material, 'depthTest', [ true, false ]);
                gui.add(obj.material, 'metalness', 0, 5, 0.1);
                gui.add(obj.material, 'roughness', 0, 5, 0.1);
                gui.addColor(obj.material, 'color');


                // obj.material = obj.material.clone();
                // // obj.material.map = leafColorMap;
                // obj.material.color = new THREE.Color('red')
                // // obj.material.alphaMap = leafAlphaMap;
                // obj.material.opacity = 0.5
                // obj.material.side = THREE.DoubleSide;
                // obj.material.depthWrite = false;
                // obj.material.depthTest = false;
                // obj.material.transparent = true;
            }
            // obj.material.envMap = hdrJpgEquirectangularMap
            obj.castShadow = true;
        }
    });
    model.rotation.x = Math.PI / 2;
    model.scale.set(10, 10, 10);
    // makeNaive(model)
    console.log('model', model);

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
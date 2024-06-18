import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import * as THREE from 'three';
// import myModel from '@/assets/models/gltf/Audibm_min.glb?url';
import myModel from '@/assets/models/gltf/tree/tree1.glb?url';
// import myModel from '@/assets/models/gltf/tree_min.glb?url';
// import myModel from '@/assets/models/gltf/tree.glb?url';
// import myModel from '@/assets/models/gltf/tree_mini.glb?url';
// import myModel from '@/assets/models/gltf/bwm330bm_black.glb?url';
import treeMap from '@/assets/images/textures/tree/Texture_tree1_trunk_basecolor_1024.jpeg';
import leafMap from '@/assets/images/textures/tree/Texture_tree1_leaves_basecolor_1024.png';
import leafAlpha from '@/assets/images/textures/tree/Texture_tree1_leaves_opacity_1024.jpg';


export async function initLoader({
    scene,
    gui
}) {
    const textureLoader = new THREE.TextureLoader(); //纹理 被加载管理器统一管理

    const treeColorMap = textureLoader.load(treeMap);
    const leafColorMap = textureLoader.load(leafMap);
    const leafAlphaMap = textureLoader.load(leafAlpha);

    treeColorMap.flipY = false;
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
    console.log('gltf', model)
    model.traverse((obj) => {
        if (obj.isMesh) {
            if (obj.name.includes('tree_trunk')) {
                obj.material = obj.material.clone();
                obj.material.map = treeColorMap;
            } else {
                obj.material = obj.material.clone();
                obj.material.metalness = 1
                obj.material.map = leafColorMap;
                obj.material.alphaMap = leafAlphaMap;
                obj.material.side = THREE.DoubleSide;
                obj.material.depthWrite = false;
                obj.material.depthTest = true;
                obj.material.transparent = true;
                obj.material.color = new THREE.Color('#bef4ce')
                gui.add( obj.material, 'depthWrite', [true, false])
                gui.add( obj.material, 'depthTest', [true, false])
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
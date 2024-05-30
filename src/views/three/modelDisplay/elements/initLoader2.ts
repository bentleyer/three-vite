import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import * as THREE from 'three';
// import myModel from '@/assets/models/gltf/Audibm_min.glb?url';
import myModel from '@/assets/models/gltf/tree_test.glb?url';
// import myModel from '@/assets/models/gltf/tree_min.glb?url';
// import myModel from '@/assets/models/gltf/tree.glb?url';
// import myModel from '@/assets/models/gltf/tree_mini.glb?url';
// import myModel from '@/assets/models/gltf/bwm330bm_black.glb?url';
import treeMap from '@/assets/images/textures/tree/tree_map.png';
import leafMap from '@/assets/images/textures/tree/leaf_map.png';
import leafAlpha from '@/assets/images/textures/tree/leaf_alpha.png';


export async function initLoader({
    scene,
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
    model.traverse((obj) => {
        if (obj.isMesh) {
            if (obj.name.includes('tree')) {
                obj.material = obj.material.clone();
                obj.material.map = treeColorMap;
            } else {
                obj.material = obj.material.clone();
                obj.material.map = leafColorMap;
                obj.material.alphaMap = leafAlphaMap;
                obj.material.side = THREE.DoubleSide;
                obj.material.depthWrite = false;
                obj.material.depthTest = false;
                obj.material.transparent = true;
            }
            // obj.material.envMap = hdrJpgEquirectangularMap
            obj.castShadow = true;
        }
    });
    model.rotation.x = Math.PI / 2;
    model.scale.set(10, 10, 10);
    // makeNaive(model)

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
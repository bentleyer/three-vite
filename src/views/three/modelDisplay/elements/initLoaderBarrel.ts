import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import * as THREE from 'three';
// import myModel from '@/assets/models/gltf/Audibm_min.glb?url';
import myModel from '@/assets/models/misc/barrel.glb?url';
// import myModel from '@/assets/models/gltf/tree_min.glb?url';
// import myModel from '@/assets/models/gltf/tree.glb?url';
// import myModel from '@/assets/models/gltf/tree_mini.glb?url';
// import myModel from '@/assets/models/gltf/bwm330bm_black.glb?url';
import treeMap from '@/assets/images/textures/misc/barrel.png';


export async function initLoader({
    scene,
    gui
}) {
    const textureLoader = new THREE.TextureLoader(); //纹理 被加载管理器统一管理

    const treeColorMap = textureLoader.load(treeMap);

    treeColorMap.flipY = false;

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
            if (obj.name.includes('Material_polySurface14002')) {
                obj.material = obj.material.clone();
                obj.material.map = treeColorMap;
                console.log('model', obj)

            } else {
                obj.material = obj.material.clone();
                

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
            console.log('model obj', obj)

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
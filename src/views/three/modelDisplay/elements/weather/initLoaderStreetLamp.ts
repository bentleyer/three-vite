import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import * as THREE from 'three';
// import myModel from '@/assets/models/gltf/Audibm_min.glb?url';
import myModel from '@/assets/models/env/streetLamp3.glb?url';
// import myModel from '@/assets/models/gltf/tree_min.glb?url';
// import myModel from '@/assets/models/gltf/tree.glb?url';
// import myModel from '@/assets/models/gltf/tree_mini.glb?url';
// import myModel from '@/assets/models/gltf/bwm330bm_black.glb?url';
import textureBaseColor from '@/assets/images/textures/env/streetLamp/lamp.png';
import type GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';


export async function initLoader({
    scene,
    gui
}: {
    gui: GUI
}) {
    const params = {
        punctualLightsEnabled: true
    };
    // const hdrJpgEquirectangularMap = new THREE.CubeTextureLoader().load([ hdr_p_x, hdr_n_x, hdr_p_y, hdr_n_y, hdr_p_z, hdr_n_z ]);
    const textureLoader = new THREE.TextureLoader(); //纹理 被加载管理器统一管理

    const baseColorMap = textureLoader.load(textureBaseColor);

    baseColorMap.flipY = false;
    const sceneModel = new THREE.Group();
    const modelArr = [];
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/src/assets/libs/draco/gltf/');
    const count = 100;
    const range = 400

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    function makeNaive(model) {
        for (let i = 0; i < count; i++) {
            const model2 = model.clone();
            model2.position.set(Math.random() * range - range / 2, Math.random() * range - range / 2, 0);
            sceneModel.add(model2);
            modelArr.push(model2);
        }
        scene.add(sceneModel);

    }

    const [ gltf ] = await Promise.all([
        loader.loadAsync(myModel),
    ]);
    const model = gltf.scene;
    model.traverse((obj) => {
        if (obj.isMesh) {
            if (obj.name.includes('Cone003002')) {
                obj.material.map = baseColorMap;
                obj.material.alphaMap = baseColorMap;
                obj.material.transparent = true
                obj.material.side = THREE.DoubleSide;
                obj.material.depthWrite = false;
                obj.material.depthTest = true;

                console.log('obj.material', obj);

            }
            // obj.castShadow = true;
        }
    });
    console.log('model', model);
    model.rotation.x = Math.PI / 2;
    // gui.add( model.rotation, 'y', 0.0, Math.PI * 2, 0.01 )
    model.scale.set(10, 10, 10);
    // makeNaive(model)
    const group = new THREE.Group();
    group.rotateZ( Math.PI / 2) 

    // gui.add(group.position, 'y', -50, 50)
    // gui.add(group.position, 'x', -50, 30)

    group.add(model);
    scene.add(group);
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
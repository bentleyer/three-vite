import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import * as THREE from 'three';
// import myModel from '@/assets/models/gltf/Audibm_min.glb?url';
import myModel from '@/assets/models/car/lexus.glb?url';
// import myModel from '@/assets/models/gltf/tree_min.glb?url';
// import myModel from '@/assets/models/gltf/tree.glb?url';
// import myModel from '@/assets/models/gltf/tree_mini.glb?url';
// import myModel from '@/assets/models/gltf/bwm330bm_black.glb?url';
import textureBaseColor from '@/assets/images/textures/car/Texture_lexus_basecolor_1024.png';
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

    const building2BaseColor = textureLoader.load(textureBaseColor);

    building2BaseColor.flipY = false;
    const sceneModel = new THREE.Group();
    const modelArr = [];
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/src/assets/libs/draco/gltf/');
    const count = 10;
    const range = 200

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    function makeNaive(model) {
        for (let i = 0; i < count; i++) {
            const model2 = model.clone();
            console.log('makeNaive', model2)
            model2.updateMatrixWorld()
            model2.position.set(Math.random() * range - range / 2, Math.random() * range - range / 2, 0);
            sceneModel.add(model2);
            model2.traverse((obj) => {
                if (obj.isSpotLight) {
                    // obj.target.position.z = -500
                    obj.add(obj.target)
                    obj.intensity = 1
                    obj.distance = 10
                    const folder = gui.addFolder('spotLight' + obj.name + 1)
                    folder.add( obj, 'intensity', 0, 100000 )
                    folder.add( obj, 'distance', 0, 500 )
                    folder.add( obj, 'angle', 0, 10 )
                    folder.add( obj, 'power', 0, 3000 )
                }
            })
            // modelArr.push(model2);
            const folder = gui.addFolder('lexus' + i)
            folder.add( model2.position, 'x', -1000.0, 1000 )
            folder.add( model2.position, 'y', -1000.0, 1000 )
        }
        scene.add(sceneModel);
        const folder = gui.addFolder('lexus' + 'scene')
        folder.add( sceneModel.position, 'x', -1000.0, 1000 )
        folder.add( sceneModel.position, 'y', -1000.0, 1000 )

    }

    const [ gltf ] = await Promise.all([
        loader.loadAsync(myModel),
    ]);
    const model = gltf.scene;
    model.traverse((obj) => {
        if (obj.isMesh) {
            if (obj.name === 'carlight_license') {
                obj.material.color = new THREE.Color('white');
                obj.material.map = building2BaseColor;
                // obj.material.emissive = new THREE.Color('red');
                // obj.material.emissiveMap = building2BaseColor;

                // console.log('obj.material', obj);
                // gui.addColor(obj.material, 'emissive');
                // gui.add(obj.material, 'emissiveIntensity', 0, 1, 0.1);

                // gui.add(params, 'punctualLightsEnabled').onChange(
                //     (val) => {
                //         if (!val) {
                //             obj.material.emissiveIntensity = 0;
                //         } else {
                //             obj.material.emissiveIntensity = 1;
                //             // obj.material.emissive = new THREE.Color('red');
                //         }
                //         console.log('obj.material', obj.material);
                //     }
                // );
                // obj.layers.toggle(2);


            }
            if (obj.name.includes('lexus_car_2')) {
                obj.material.color = new THREE.Color('white');
            }
            obj.castShadow = true;
        }
        if (obj.isLight) {
            obj.castShadow = false;
        }
    });

    model.traverse((obj) => {
        if (obj.isSpotLight) {
            // obj.target.position.z = -500
            obj.intensity = 1
            obj.distance = 10
            const folder = gui.addFolder('spotLight' + obj.name + 1)
            folder.add( obj, 'intensity', 0, 100000 )
            folder.add( obj, 'distance', 0, 500 )
            folder.add( obj, 'angle', 0, 10 )
            folder.add( obj, 'power', 0, 3000 )
        }
    })
 
    console.log('model lexus', model);
    model.rotation.x = Math.PI / 2;
    // gui.add( model.rotation, 'y', 0.0, Math.PI * 2, 0.01 )
    model.scale.set(10, 10, 10);
    // makeNaive(model)
    const group = new THREE.Group();
    // scene.add(model)
    group.add(model);
    scene.add(group);
    group.traverse((obj) => {
        if (obj.isMesh) {
            if (obj.name.includes('lexus_back_left') ) {
                console.log('obj', obj)
                // obj.rotateX = Math.PI / 4
                // obj.rotateY = Math.PI / 4
                // obj.rotateZ = Math.PI / 4
                obj.rotation.x = Math.PI / 4
                // gui.add(obj.rotation, 'x', 0, Math.PI, 0.1);

                // obj.rotation.y = Math.PI / 2
                // obj.rotation.z = Math.PI / 2
                // obj.scale.set(10, 10, 10);
            }
        }
    });
    const folder = gui.addFolder('lexus')
    folder.add( model.position, 'x', -1000.0, 1000 )
    folder.add( model.position, 'y', -1000.0, 1000 )
    console.log('lexus.children[1].target', model.children[1].target, scene)

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
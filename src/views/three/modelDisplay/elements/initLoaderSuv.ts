import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import * as THREE from 'three';
// import myModel from '@/assets/models/gltf/Audibm_min.glb?url';
import myModel from '@/assets/models/car/3008.glb?url';
// import myModel from '@/assets/models/gltf/tree_min.glb?url';
// import myModel from '@/assets/models/gltf/tree.glb?url';
// import myModel from '@/assets/models/gltf/tree_mini.glb?url';
// import myModel from '@/assets/models/gltf/bwm330bm_black.glb?url';
import textureBaseColor from '@/assets/images/textures/car/Texture_suv_basecolor_1024.jpg'

// import textureEmissiveColor from '@/assets/images/textures/car/suv_emissive.jpg'
import textureEmissiveColor from '@/assets/images/textures/car/suv-emission2.jpeg'
// import textureEmissiveColor from '@/assets/images/textures/car/suv-emission.jpeg'
// import textureEmissiveColor from '@/assets/images/textures/car/suv-emission3.jpeg'



export async function initLoader({
    scene,
    gui
}) {
    const params = {
        punctualLightsEnabled: true,
        frontRight: true,
        frontLeft: true,
        backRight: true,
        backLeft: true
    };
    // const hdrJpgEquirectangularMap = new THREE.CubeTextureLoader().load([ hdr_p_x, hdr_n_x, hdr_p_y, hdr_n_y, hdr_p_z, hdr_n_z ]);
    const textureLoader = new THREE.TextureLoader(); 
    //纹理 被加载管理器统一管理

    const building2BaseColor= textureLoader.load(textureBaseColor);
    const emissiveColor= textureLoader.load(textureEmissiveColor);

    building2BaseColor.flipY = false;
    emissiveColor.flipY = false;
    emissiveColor.colorSpace = THREE.SRGBColorSpace

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
    function getLocation(name) {
        if (name.includes('back')) {
            if (name.includes('right')) {
                return 'backRight'
            }
            if (name.includes('left')) {
                return 'backLeft'
            }
        }
        if (name.includes('front')) {
            if (name.includes('right')) {
                return 'frontRight'
            }
            if (name.includes('left')) {
                return 'frontLeft'
            }
        }
        return 'default'
    }
    const [gltf] = await Promise.all([
        loader.loadAsync(myModel),
    ]);
    const model = gltf.scene;
    model.traverse((obj) => {
        if (obj.isMesh) {
            // obj.material =  new THREE.MeshPhysicalMaterial()
            obj.material = obj.material.clone()
            if (obj.name.includes('carlight') || obj.name.includes('license') ) {
                obj.material.color = new THREE.Color('white')
                obj.material.map = building2BaseColor
                obj.material.emissive = new THREE.Color('#ffc800');
                // obj.material.emissiveMap = building2BaseColor;
                obj.material.emissiveMap = emissiveColor;
                if (getLocation(obj.name) !== 'default') {
                    const folder = gui.addFolder(getLocation(obj.name));
                    folder.addColor(obj.material, 'emissive');
                    folder.addColor(obj.material, 'color');

                    folder.add(obj.material, 'roughness', 0, 10, 0.1);
                    folder.add(obj.material, 'metalness', 0, 10, 0.1);

                    folder.add(obj.material, 'emissiveIntensity', 0, 10, 0.1);
                    console.log('obj', obj)
                    folder.add(params, getLocation(obj.name)).onChange(
                        (val) => {
                            if (!val) {
                                // obj.material.color  = new THREE.Color('white')
                                obj.material.emissiveIntensity = 0;
                            } else {
                                // obj.material.color  = new THREE.Color('black')
                                obj.material.emissiveIntensity = 1;
                                // obj.material.emissive = new THREE.Color('red');
                            }
                        }
                    );
                    obj.layers.toggle(2);
                }
            }
            if (obj.name === 'maincar2_suv_car_1') {
                // obj.material.color = new THREE.Color('black');
            }
            obj.castShadow = true
        }
    });
    console.log('model', model)
    model.rotation.x = Math.PI / 2;
    // gui.add( model.rotation, 'y', 0.0, Math.PI * 2, 0.01 )
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
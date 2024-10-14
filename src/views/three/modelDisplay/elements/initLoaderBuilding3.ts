import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import * as THREE from 'three';
// import myModel from '@/assets/models/gltf/Audibm_min.glb?url';
import myModel from '@/assets/models/building/building3.glb?url';
// import myModel from '@/assets/models/gltf/tree_min.glb?url';
// import myModel from '@/assets/models/gltf/tree.glb?url';
// import myModel from '@/assets/models/gltf/tree_mini.glb?url';
// import myModel from '@/assets/models/gltf/bwm330bm_black.glb?url';
import textureBuilding1BaseColor from '@/assets/images/textures/building/Texture_building1_night_basecolor_1024.png'
// import textureBuilding1BaseColor from '@/assets/images/textures/building/Texture_building3_basecolor_1024.png'

// import textureBuilding1Height from '@/assets/images/textures/building/Texture_building1_glossiness_1024.png'
import textureBuilding1Height from '@/assets/images/textures/building/Texture_building3_height_1024.png'
import textureBuilding1Metallic from '@/assets/images/textures/building/Texture_building3_metallic_1024.png'
// import textureBuilding1Normal from '@/assets/images/textures/building/Texture_building3_normal_1024.png'
import textureBuilding1Roughness from '@/assets/images/textures/building/Texture_building3_roughness_1024.png'



export async function initLoader({
    scene,
    gui
}) {
    // const hdrJpgEquirectangularMap = new THREE.CubeTextureLoader().load([ hdr_p_x, hdr_n_x, hdr_p_y, hdr_n_y, hdr_p_z, hdr_n_z ]);
    const textureLoader = new THREE.TextureLoader(); //纹理 被加载管理器统一管理
    const buildingHeight = textureLoader.load(textureBuilding1Height);
    const buildingMetallic = textureLoader.load(textureBuilding1Metallic);
    const buildingBaseColor= textureLoader.load(textureBuilding1BaseColor);
    const buildingRoughness = textureLoader.load(textureBuilding1Roughness);
    // const buildingNormal = textureLoader.load(textureBuilding1Normal);


    buildingHeight.flipY = false;
    buildingMetallic.flipY = false;
    buildingBaseColor.flipY = false;
    buildingRoughness.flipY = false;
    // buildingNormal.flipY = false;
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

    const [gltf] = await Promise.all([
        loader.loadAsync(myModel),
    ]);
    const model = gltf.scene;
    model.traverse((obj) => {
        if (obj.isMesh) {
            // obj.material = new THREE.MeshBasicMaterial({
            //     color: new THREE.Color('#fef')
            // })
            obj.material = new THREE.MeshStandardMaterial()
            obj.material.color = new THREE.Color('black')

            // obj.material.map = buildingBaseColor
            obj.material.roughnessMap = buildingRoughness
            obj.material.displacementMap = buildingHeight
            // obj.material.bumpMap = buildingHeight
            // obj.material.displacementScale = 1
            obj.material.metalnessMap = buildingMetallic
            // obj.material.normalMap = buildingNormal
            obj.material.emissiveMap = buildingBaseColor
            obj.material.emissiveIntensity = 1
            obj.material.emissive = new THREE.Color('white')


            obj.material.metalness = 1
            gui.add( obj.material, 'metalness', 0.0, 4.0, 0.01 )
            gui.add( obj.material, 'roughness', 0.0, 4.0, 0.01 )
            gui.add( obj.material, 'displacementScale', 0.0, 4.0, 0.01 )
            gui.add( obj.material, 'displacementBias', -4.0, 4.0, 0.01 )
            gui.add( obj.material, 'emissiveIntensity', 0, 10.0, 0.1 )
            gui.addColor( obj.material, 'emissive')
            gui.addColor( obj.material, 'color')

            // obj.material.transparent = false
        }
    });
    model.rotation.x = Math.PI / 2;
    model.scale.set(0.5, 0.5, 0.5);
    makeNaive(model)
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
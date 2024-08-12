import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import * as THREE from 'three';
// import myModel from '@/assets/models/gltf/Audibm_min.glb?url';
import myModel from '@/assets/models/building/building6.glb?url';
// import myModel from '@/assets/models/gltf/tree_min.glb?url';
// import myModel from '@/assets/models/gltf/tree.glb?url';
// import myModel from '@/assets/models/gltf/tree_mini.glb?url';
// import myModel from '@/assets/models/gltf/bwm330bm_black.glb?url';
import textureBuildingBaseColor from '@/assets/images/textures/building/Texture_buildings_basecolor_6000.jpeg'
import textureBuildingHeight from '@/assets/images/textures/building/Texture_buildings_specular_6000.jpg'
import textureBuildingMetallic from '@/assets/images/textures/building/Texture_buildings_metalic_6000.jpg'
import textureBuildingRoughness from '@/assets/images/textures/building/Texture_buildings_roughness_6000.jpg'


export async function initLoader({
    scene,
    gui
}) {
    // const hdrJpgEquirectangularMap = new THREE.CubeTextureLoader().load([ hdr_p_x, hdr_n_x, hdr_p_y, hdr_n_y, hdr_p_z, hdr_n_z ]);
    const textureLoader = new THREE.TextureLoader(); //纹理 被加载管理器统一管理
    const buildingHeight = textureLoader.load(textureBuildingHeight);
    const buildingMetallic = textureLoader.load(textureBuildingMetallic);
    const buildingBaseColor= textureLoader.load(textureBuildingBaseColor);
    const buildingRoughness = textureLoader.load(textureBuildingRoughness);

    buildingHeight.flipY = false;
    buildingMetallic.flipY = false;
    buildingBaseColor.flipY = false;
    buildingRoughness.flipY = false;
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
            obj.material.map = buildingBaseColor
            obj.material.roughnessMap = buildingRoughness
            // obj.material.displacementMap = buildingHeight
            // obj.material.bumpMap = buildingHeight
            // obj.material.displacementScale = 1
            obj.material.metalnessMap = buildingMetallic
            obj.material.metalness = 1
            gui.add( obj.material, 'metalness', 0.0, 4.0, 0.01 )
            gui.add( obj.material, 'roughness', 0.0, 4.0, 0.01 )

            // obj.material.transparent = false
        }
    });
    model.rotation.x = Math.PI / 2;
    // model.scale.set(3, 3, 3);
    console.log('gltf', gltf)
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
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import * as THREE from 'three';
// import myModel from '@/assets/models/gltf/Audibm_min.glb?url';
import myModel from '@/assets/models/gltf/building1test.glb?url';
// import myModel from '@/assets/models/gltf/tree_min.glb?url';
// import myModel from '@/assets/models/gltf/tree.glb?url';
// import myModel from '@/assets/models/gltf/tree_mini.glb?url';
// import myModel from '@/assets/models/gltf/bwm330bm_black.glb?url';
import grass from '@/assets/images/textures/building/lambert1_Base_Color.png';
import grass_normal from '@/assets/images/textures/building/lambert1_Normal_OpenGL.png';
import grass_displacement from '@/assets/images/textures/building/lambert1_Height.png';
import grass_AO from '@/assets/images/textures/building/lambert1_Mixed_AO.png';
import grass_roughness from '@/assets/images/textures/building/lambert1_Roughness.png';
import grass_metalness from '@/assets/images/textures/building/lambert1_Metallic.png';
import hdr_n_z from '@/assets/images/textures/hdr/hdr_n_z.jpg';
import hdr_n_y from '@/assets/images/textures/hdr/hdr_n_y.jpg';
import hdr_n_x from '@/assets/images/textures/hdr/hdr_n_x.jpg';
import hdr_p_z from '@/assets/images/textures/hdr/hdr_p_z.jpg';
import hdr_p_y from '@/assets/images/textures/hdr/hdr_p_y.jpg';
import hdr_p_x from '@/assets/images/textures/hdr/hdr_p_x.jpg';


export async function initLoader({
    scene,
}) {
    // const hdrJpgEquirectangularMap = new THREE.CubeTextureLoader().load([ hdr_p_x, hdr_n_x, hdr_p_y, hdr_n_y, hdr_p_z, hdr_n_z ]);
    const textureLoader = new THREE.TextureLoader(); //纹理 被加载管理器统一管理
    const normalMap = textureLoader.load(grass_normal);
    const AOMap = textureLoader.load(grass_AO);
    const roughnessMap = textureLoader.load(grass_roughness);
    const colorMap = textureLoader.load(grass);
    const displacementMap = textureLoader.load(grass_displacement);
    const metalnessMap = textureLoader.load(grass_metalness);
    normalMap.flipY = false
    AOMap.flipY = false
    roughnessMap.flipY = false
    displacementMap.flipY = false
    colorMap.flipY = false
    metalnessMap.flipY = false
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
    console.log('gltf', model, colorMap);
    // const mesh = model.children[0]
    // const uvAttribute = mesh.geometry.getAttribute('uv')
    // const uvs = [];
    // for (let i = 0; i < uvAttribute.count; i++) {
    //     const vector = new THREE.Vector2(
    //         uvAttribute.getX(i),
    //         uvAttribute.getY(i),
    //     );
    //     uvs.push(vector);
    // }
    // const positionAttribute = mesh.geometry.getAttribute('position')
    // const positions = [];
    // for (let i = 0; i < positionAttribute.count; i++) {
    //     const vector = new THREE.Vector3(
    //         positionAttribute.getX(i),
    //         positionAttribute.getY(i),
    //         positionAttribute.getZ(i)
    //     );
    //     positions.push(vector);
    // }
    // const matrix = mesh.matrixWorld
    // const globalPosition = positions.map((position) => {
    //     return position.applyMatrix4(matrix)
    // })

    // console.log('gltf', model, uvs, matrix, globalPosition);
    // model.castShadow = true;
    model.traverse((obj) => {
        if (obj.isMesh) {
            obj.material.aoMap = AOMap;
            obj.material.displacementMap = displacementMap;
            obj.material.map = colorMap;
            obj.material.normalMap = normalMap;
            obj.material.roughnessMap = roughnessMap;
            obj.material.metalnessMap = metalnessMap;
            // obj.material.envMap = hdrJpgEquirectangularMap
            obj.castShadow = true;
        }
    });
    model.rotation.x = Math.PI / 2;
    model.scale.set(3, 3, 3);
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
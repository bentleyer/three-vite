import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import * as THREE from 'three';
// import myModel from '@/assets/models/gltf/Audibm_min.glb?url';
// import myModel from '@/assets/models/car/Audibm_min.glb?url';
import myModel from '@/assets/models/car/Audi.glb?url';

export async function initLoader({
    scene,
    gui
}) {
    // const hdrJpgEquirectangularMap = new THREE.CubeTextureLoader().load([ hdr_p_x, hdr_n_x, hdr_p_y, hdr_n_y, hdr_p_z, hdr_n_z ]);

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
            // obj.material.map = building2BaseColor
            // obj.material.roughnessMap = building2Roughness
            // // obj.material.displacementMap = building2Height
            // obj.material.bumpMap = building2Height
            // // obj.material.displacementScale = 1
            // obj.material.metalnessMap = building2Metallic
            // gui.add( obj.material, 'metalness', 0.0, 4.0, 0.01 )

            // obj.material.transparent = false
            obj.castShadow = true
        }
    });
    console.log('model', model)
    // model.rotation.x = Math.PI / 2;
    // gui.add( model.rotation, 'y', 0.0, Math.PI * 2, 0.01 )
    model.scale.set(10, 10, 10);
    model.position.set(30, 0, 0);

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
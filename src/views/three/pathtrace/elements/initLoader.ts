import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import * as THREE from 'three';
// import myModel from '@/assets/models/gltf/Audibm_min.glb?url';
import myModel from '@/assets/models/gltf/Audi.glb?url';
// import myModel from '@/assets/models/gltf/tree_min.glb?url';
// import myModel from '@/assets/models/gltf/tree.glb?url';
// import myModel from '@/assets/models/gltf/tree_mini.glb?url';
import myModel2 from '@/assets/models/gltf/bwm330bm.glb?url';
// import myModel from '@/assets/models/gltf/bwm330bm_black.glb?url';


export async function initLoader({
    scene,
}) {
    const sceneModel = new THREE.Group();
    const modelArr = [];
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/src/assets/libs/draco/gltf/');
    const count = 10;

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    function makeMerge(model) {

        for (let i = 0; i < count; i++) {
            const geometries = [];
            // let material;
            let material = new THREE.MeshPhongMaterial({
                color: 'white',
                side: THREE.FrontSide
            });

            const model2 = model.clone();

            model2.traverse((obj) => {

                if (obj.isMesh) {
                    const newGeometry = obj.geometry.clone();

                    const matrix = new THREE.Matrix4();

                    const quaternion = new THREE.Quaternion();
                    obj.getWorldQuaternion(quaternion);

                    const position = new THREE.Vector3();
                    obj.getWorldPosition(position);
                    const scale = new THREE.Vector3(1, 1, 1);

                    obj.getWorldScale(scale);

                    matrix.compose(position.clone(), quaternion, scale.clone());
                    newGeometry.applyMatrix4(matrix);

                    geometries.push(newGeometry);
                    if (!material) {
                        material = new THREE.MeshStandardMaterial({
                            ...obj.material,
                            color: '#ffffff',
                        });
                    }

                }
            });
            const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries, true);
            const mergedMesh = new THREE.Mesh(mergedGeometry, material);
            mergedMesh.position.set(Math.random() * 1000 - 500, Math.random() * 1000 - 500, 10);

            mergedMesh.castShadow = true;

            scene.add(mergedMesh);
        }


    }

    function makeMergeAll(model) {
        const mergedGeometries = [];
        let material;

        for (let i = 0; i < count; i++) {
            const geometries = [];
            const model2 = model.clone();
            model2.position.set(Math.random() * 1000 - 500, Math.random() * 1000 - 500, 10);

            model2.traverse((obj) => {
                if (obj instanceof THREE.Mesh) {
                    const newGeometry = obj.geometry.clone();

                    const matrix = new THREE.Matrix4();

                    const quaternion = new THREE.Quaternion();
                    obj.getWorldQuaternion(quaternion);

                    const position = new THREE.Vector3();
                    obj.getWorldPosition(position);
                    const scale = new THREE.Vector3(1, 1, 1);

                    obj.getWorldScale(scale);

                    matrix.compose(position.clone(), quaternion, scale.clone());
                    newGeometry.applyMatrix4(matrix);
                    geometries.push(newGeometry);
                    if (!material) {
                        material = new THREE.MeshStandardMaterial({
                            ...obj.material,
                            color: '#ffffff',
                        });
                    }

                }
            });
            const mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries, true);
            mergedGeometries.push(mergedGeometry);

        }
        const mergedAllGeo = BufferGeometryUtils.mergeGeometries(mergedGeometries, true);

        const mergedMesh = new THREE.Mesh(mergedAllGeo, material);

        mergedMesh.castShadow = true;

        scene.add(mergedMesh);
    }
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
    const [ gltf2 ] = await Promise.all([
        loader.loadAsync(myModel2),
    ]);
    console.log('gltf', gltf, gltf2)
    const model = gltf.scene;
    model.castShadow = true;
    model.traverse((obj) => {
        if (obj.isObject3D) {
            obj.castShadow = true;
        }
    });
    model.rotation.x = Math.PI / 2;
    model.scale.set(10, 10, 10);
    makeNaive(model)

    scene.add(model)
    function animationMesh() {

        sceneModel.children.forEach((child) => {
            const rotationSpeed = {
                x: 0,
                y: 0.01,
                z: 0
            }
            child.rotation.set(
                child.rotation.x + rotationSpeed.x,
                child.rotation.y + rotationSpeed.y,
                child.rotation.z + rotationSpeed.z
            );
        })
    }
    return {
        animationMesh
    }
}
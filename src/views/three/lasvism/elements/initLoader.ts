import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import myModel from '@/assets/models/gltf/Audibm_min.glb?url';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import * as THREE from 'three';


export function initLoader({
    scene,

}) {
    const sceneModel = new THREE.Group();
    const modelArr = [];
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/src/assets/libs/draco/gltf/');
    const count = 100;

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    function makeBatch(model) {
        // 两个高模车就把顶点用完了，不行
        const geometryCount = 100;
        const vertexCount = 20000000;
        const indexCount = 20000000;
        const material = new THREE.MeshPhongMaterial({
            color: '#ffffff',
        });
        const ids = [];
        const mesh = new THREE.BatchedMesh(geometryCount, vertexCount, indexCount, material);


        for (let i = 0; i < 2; i++) {

            const model2 = model.clone();
            // model2.position.set(Math.random() * 500, Math.random() * 500, 0);
            // group.add(model2);
            model2.position.set(0, 0, 50);
            // model2.position.set(Math.random() * 500, Math.random() * 500, 10);
            // model2.rotation.Y = Math.PI / 2;
            model2.traverse((obj) => {
                if (obj.geometry) {
                    const newGeometry = obj.geometry.clone();
                    const matrix = new THREE.Matrix4();

                    const quaternion = new THREE.Quaternion();
                    obj.getWorldQuaternion(quaternion);

                    const position = new THREE.Vector3();
                    obj.getWorldPosition(position);
                    const scale = new THREE.Vector3(1, 1, 1);

                    obj.getWorldScale(scale);

                    matrix.compose(position.clone(), quaternion, scale.clone());
                    const id = mesh.addGeometry(newGeometry);
                    mesh.setMatrixAt(id, matrix);
                    ids.push(id);

                }
            });
        }
        mesh.castShadow = true;
        scene.add(mesh);

    }

    function makeInstance (model) {

        for (let i = 0; i < count; i++) {

            const model2 = model.clone();
            model2.position.set(Math.random() * 500, Math.random() * 500, 10);
            // model2.rotation.Y = Math.PI / 2;

            model2.traverse((obj) => {
                if (obj.geometry) {
                    const newGeometry = obj.geometry.clone();
                    const material = obj.material;
                    const mesh = new THREE.InstancedMesh(newGeometry, material, 1);

                    const matrix = new THREE.Matrix4();

                    const quaternion = new THREE.Quaternion();
                    obj.getWorldQuaternion(quaternion);

                    const position = new THREE.Vector3();
                    obj.getWorldPosition(position);
                    const scale = new THREE.Vector3(1, 1, 1);

                    obj.getWorldScale(scale);

                    matrix.compose(position.clone(), quaternion, scale.clone());
                    mesh.setMatrixAt(0, matrix);
                    mesh.castShadow = true;
                    scene.add(mesh);

                }
            });
        }


    }

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
            model2.position.set(Math.random() * 1000 - 500, Math.random() * 1000 - 500, 0);
            sceneModel.add(model2);
            modelArr.push(model2);
        }
        scene.add(sceneModel);

    }
  
    loader.load(myModel, function (gltf) {


        const model = gltf.scene;
        console.log('model', model);
        model.castShadow = true;
        model.traverse((obj) => {
            if (obj.isObject3D) {
                obj.castShadow = true;
            }
        });
        model.rotation.x = Math.PI / 2;
        model.scale.set(10, 10, 10);

        // makeBatch(model)
        // makeInstance(model);
        makeMerge(model);
        // makeMergeAll(model)

        // makeNaive(model)
        // scene.add(model);

        console.log('gltf', gltf, scene);

        // mixer = new THREE.AnimationMixer(model);
        // mixer.clipAction(gltf.animations[0]).play();
        // mixers.push(mixer);
        scene.updateMatrixWorld();
        // animate();

    }, undefined, function (e) {

        console.error(e);

    });
}
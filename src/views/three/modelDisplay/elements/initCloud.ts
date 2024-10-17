import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import myModel from '@/assets/models/env/cloud.glb?url'
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';
export async function initCloud({
    camera,
    scene,
    gui
}: {
    scene: THREE.Scene,
    gui: GUI,
    camera: THREE.Camera
}) {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/src/assets/libs/draco/gltf/');
    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    const [gltf] = await Promise.all([
        loader.loadAsync(myModel),
    ]);
    const model = gltf.scene;
    model.traverse((obj) => {
        if (obj.isMesh) {
            if (obj.name === 'bus_car_light') {
                obj.material.color = new THREE.Color('white')
                obj.material.map = building2BaseColor
                console.log('obj.material', obj)
            }
            if (obj.name.includes('bus_car_1')) {
                obj.material.color = new THREE.Color('#5D98BB')
            }
            obj.castShadow = true
        }
    });
    model.scale.set(100, 100, 100)
    model.rotation.x = Math.PI / 2
    // model.position.copy(camera.position)
    // model.position.z += 300
    // gui.add( model.rotation, 'y', 0.0, Math.PI * 2, 0.01 )
    // makeNaive(model)
    scene.add(model);

}
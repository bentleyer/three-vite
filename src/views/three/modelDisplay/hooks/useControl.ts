import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ref } from 'vue';

export function useControl({
    camera,
    renderer,
    gui
}: {
    camera: THREE.Camera,
    renderer: THREE.WebGLRenderer
}) {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target = new THREE.Vector3(0, 0, 0);
    // gui.add( controls, 'angle', 0.0, 5.0, 0.1 )

    return {
        controls
    };
}
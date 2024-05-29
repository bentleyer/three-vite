import * as THREE from 'three';

export function useHelper({
    scene
}: {
    scene: THREE.Scene
}) {
    const axesHelper = new THREE.AxesHelper( 500000 );
    scene.add( axesHelper );
}
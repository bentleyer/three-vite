import * as THREE from 'three';

export function useHelper({
    scene
}: {
    scene: THREE.Scene
}) {
    const axesHelper = new THREE.AxesHelper( 5 );
    scene.add( axesHelper );
}
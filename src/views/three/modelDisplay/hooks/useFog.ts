import Stats from 'three/addons/libs/stats.module.js';
import * as THREE from 'three'

export function useFog({
    scene
}: {
    scene: THREE.Scene
}) {
    const fog = new THREE.FogExp2( 0xcccccc, 0.002 );
    scene.fog = fog
    return {
        
    }
}
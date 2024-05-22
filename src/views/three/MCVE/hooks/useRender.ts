import * as THREE from 'three';

export function useRender() {
    const container = document.getElementById('three');
    const canvasBig = document.createElement('canvas');
    canvasBig.id = 'canvas-test';
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        canvas: canvasBig,
        logarithmicDepthBuffer: true
    });
    renderer.autoClear = true;

    // renderer.shadowMap.enabled = false;
    renderer.setClearColor(new THREE.Color(0xa7a7a7));
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight - 63);
    // renderer.sortObjects = true;
    container?.appendChild(renderer.domElement);
    return {
        renderer
    }
}
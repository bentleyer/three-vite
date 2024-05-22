import * as THREE from 'three';
import { useCamera } from './useCamera';
import { useControl } from './useControl';
import { useLight } from './useLight';
import { useRender } from './useRender';
import { useState } from './useState';
import { useHelper } from './useHelper';


export function useInit() {
    const scene = new THREE.Scene();
    // 初始顺序 px/right nx/left py/up ny/down pz/front nz/back
    scene.background = new THREE.Color(0xbfe3dd);
    const { camera } = useCamera();
    const { renderer } = useRender();

    const { controls } = useControl({
        camera,
        renderer
    });
    const {
        ambientLight,
        directionalLights,
        directionalLight
    } = useLight({
        scene
    });
    const {
        stats
    } = useState()
    useHelper({
        scene
    })
    return {
        scene,
        camera,
        renderer,
        controls,
        ambientLight,
        directionalLights,
        directionalLight,
        stats
    }
}
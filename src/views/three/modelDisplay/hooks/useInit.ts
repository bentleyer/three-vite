import * as THREE from 'three';
import { useCamera } from './useCamera';
import { useControl } from './useControl';
import { useLight } from './useLight';
import { useRender } from './useRender';
import { useState } from './useState';
import { useHelper } from './useHelper';
import { useHdr } from './initHdr';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { useLensflare } from './useLensflare';
import { usePointLight } from './usePointLight';
import { useFog } from './useFog';
// import { useSkybox } from './useSkybox';
import { useSkybox } from './useSkyboxSphere';


export function useInit() {
    const gui = new GUI()
    const scene = new THREE.Scene();
    // 初始顺序 px/right nx/left py/up ny/down pz/front nz/back
    scene.background = new THREE.Color(0xbfe3dd);
    const { camera } = useCamera({
        gui
    });
    const { renderer } = useRender();

    const { controls } = useControl({
        camera,
        renderer,
        gui
    });
    // useFog({
    //     scene
    // })
    const {
        light,
    } = useLight({
        scene,
        gui
    });
    // const {
    //     light: lightPoint,
    // } = useLensflare({
    //     scene,
    //     gui
    // });
    // usePointLight({
    //     scene,
    //     gui
    // })
    const {
        stats
    } = useState()
    useHelper({
        scene
    })
    const {
        envMap
    } = useHdr({
        scene,
        renderer,
        gui
    })
    const {  } = useSkybox({
        scene,
        renderer,
        gui
    })
    function animation(delta) {
        
    }
    return {
        scene,
        camera,
        renderer,
        controls,
        // light,
        stats,
        gui,
        envMap,
        animation
    }
}
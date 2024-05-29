import * as THREE from 'three';
import right from '@/assets/images/textures/9_r.jpg';
import left from '@/assets/images/textures/9_l.jpg';
import up from '@/assets/images/textures/9_u.jpg';
import down from '@/assets/images/textures/9_d.jpg';
import front from '@/assets/images/textures/9_f.jpg';
import back from '@/assets/images/textures/9_b.jpg';
import { useCamera } from './useCamera';
import { useControl } from './useControl';
import { useLight } from './useLight';
import { useRender } from './useRender';
import { useState } from './useState';
import { useHelper } from './useHelper';
import { BlurredEnvMapGenerator } from 'three-gpu-pathtracer';
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
// import hdrMap from '@/assets/images/hdr/memorial.hdr?url'

import hdrMap from '@/assets/images/hdr/venice_sunset_1k.hdr?url'

export async function useInit() {
    const scene = new THREE.Scene();
    // 初始顺序 px/right nx/left py/up ny/down pz/front nz/back
    // scene.background = new THREE.Color(0xbfe3dd);
    const envMap = new THREE.CubeTextureLoader().load([ right, left, back, front, up, down ]);
    // scene.background = envMap
    // scene.environment = envMap

    const { camera } = useCamera();
    const { renderer } = useRender();

    const { controls } = useControl({
        camera,
        renderer
    });
    const {
        light
    } = useLight({
        scene
    });
    const {
        stats
    } = useState();
    useHelper({
        scene
    });
    // const generator = new BlurredEnvMapGenerator( renderer );
    // const blurredEnvMap = generator.generate( envMap, 0.35 );
    const [ envTexture ] = await Promise.all([
        new RGBELoader().loadAsync(hdrMap),
        // new THREE.CubeTextureLoader().loadAsync([ right, left, back, front, up, down ]);
    ]);
    envTexture.mapping = THREE.EquirectangularReflectionMapping;
    envTexture.minFilter = THREE.LinearFilter;
    envTexture.magFilter = THREE.LinearFilter;
    envTexture.needsUpdate = true;
    scene.environment = envTexture
    scene.background = envTexture;
    return {
        scene,
        camera,
        renderer,
        controls,
        stats
    };
}
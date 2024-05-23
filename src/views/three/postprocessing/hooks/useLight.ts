import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { ref } from 'vue';
import right from '@/assets/images/textures/9_r.jpg';
import left from '@/assets/images/textures/9_l.jpg';
import up from '@/assets/images/textures/9_u.jpg';
import down from '@/assets/images/textures/9_d.jpg';
import front from '@/assets/images/textures/9_f.jpg';
import back from '@/assets/images/textures/9_b.jpg';
const SHADOW_MAP_WIDTH = 8192;
const SHADOW_MAP_HEIGHT = 8192;


export function useLight({
    scene,
}: {
    scene: THREE.Scene
}) {
    const color = 0xFFFFFF;
    const intensity = 6;
    const light = new THREE.DirectionalLight( color, intensity );
    light.position.set( - 1, 2, 4 );
    scene.add( light );
    // let samlldirectionalLightt = new THREE.directionalLightt(0xffffff);
    // this.smallScene.add(samlldirectionalLightt);
    return {
        light
    };

}
import * as THREE from 'three';
import { ref } from 'vue';
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js';
// import textureFlareImg from '@/assets/images/textures/lensflare/lensflare0.png';
import textureFlareImg from '@/assets/images/textures/lensflare/pearl_0.png';

import textureFlareImg3 from '@/assets/images/textures/lensflare/lensflare3.png';
import textureFlareImg4 from '@/assets/images/textures/lensflare/lensflare4.jpg';
// import textureFlareImg4 from '@/assets/images/textures/lensflare/lensflare4.jpg';



const SHADOW_MAP_WIDTH = 8192;
const SHADOW_MAP_HEIGHT = 8192;


export function usePointLight({
    scene,
    gui
}: {
    scene: THREE.Scene,
    gui: any
}) {
    const textureLoader = new THREE.TextureLoader();
    const textureFlare0 = textureLoader.load(textureFlareImg);
    const textureFlare3 = textureLoader.load(textureFlareImg3);
    const textureFlare4 = textureLoader.load(textureFlareImg4);

    let light

    addLight(0.55, 0.9, 0.5, -30, -30, 50);
    // addLight(0.55, 0.9, 0.5, -30, -30, 40);

    function addLight(h, s, l, x, y, z) {
        const light = new THREE.PointLight(0xffffff, 1.5, 2000, 0);
        // light.color.setHSL(h, s, l);
        const sphere = new THREE.SphereGeometry( 5, 16, 8 );
        light.color = new THREE.Color('red')
        light.position.set(x, y, z);
        light.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xff0040 } ) ) );
        scene.add(light);
        const lensflare = new Lensflare();
        lensflare.addElement(new LensflareElement(textureFlare0, 40, 0, light.color));
        // lensflare.addElement(new LensflareElement(textureFlare3, 200, 0));
        // lensflare.addElement(new LensflareElement(textureFlare3, 70, 0.7));
        // lensflare.addElement(new LensflareElement(textureFlare3, 120, 0.9));
        // lensflare.addElement(new LensflareElement(textureFlare3, 70, 1));
        // light.add(lensflare);
        const material = new THREE.MeshStandardMaterial({
            color: 0xff0040,
            emissive: 0xff0040,
            emissiveIntensity: 3
        })
        const mesh = new THREE.Mesh( sphere, material ) 
        // scene.add(mesh)
    }

    return {
        light
    };

}
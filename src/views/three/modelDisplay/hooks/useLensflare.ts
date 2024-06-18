import * as THREE from 'three';
import { ref } from 'vue';
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js';
import textureFlareImg from '@/assets/images/textures/lensflare/lensflare0.png';
// import textureFlareImg from '@/assets/images/textures/lensflare/pearl_0.png';

import textureFlareImg3 from '@/assets/images/textures/lensflare/lensflare3.png';
import textureFlareImg4 from '@/assets/images/textures/lensflare/lensflare4.jpg';
// import textureFlareImg4 from '@/assets/images/textures/lensflare/lensflare4.jpg';



const SHADOW_MAP_WIDTH = 8192;
const SHADOW_MAP_HEIGHT = 8192;


export function useLensflare({
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

    // gui.add( light.position, 'x', -100.0, 100.0, 0.1 )
    // gui.add( light.position, 'y', -100.0, 100.0, 0.1 )
    // gui.add( light.position, 'z', -100.0, 100.0, 0.1 )
    // const light = new THREE.PointLight(0xffffff, 1.5, 1000, 1);
    // light.position.set(-60, -60, 400);
    // const lensflare = new Lensflare();
    // lensflare.addElement(new LensflareElement(textureFlare0, 200, 0, light.color));
    // lensflare.addElement(new LensflareElement(textureFlare0, 200, 0, new THREE.Color('red')));
    // lensflare.addElement(new LensflareElement(textureFlare3, 60, 0.6));
    // lensflare.addElement(new LensflareElement(textureFlare3, 70, 0.7));
    // lensflare.addElement(new LensflareElement(textureFlare3, 120, 0.9));
    // lensflare.addElement(new LensflareElement(textureFlare3, 70, 1));
    // addLight(0.55, 0.9, 0.5, -30, -30, 50);
    // addLight(0.08, 0.8, 0.5, 0, 0, 100);
    // addLight(0.995, 0.5, 0.9, 500, 500, 100);
    // light.add(lensflare);
    // scene.add(light);
    addLight(0.55, 0.9, 0.5, -30, -30, 50);
    // addLight(0.55, 0.9, 0.5, -30, -30, 40);

    function addLight(h, s, l, x, y, z) {
        const light = new THREE.PointLight(0xffffff, 1.5, 200, 1);
        // light.color.setHSL(h, s, l);

        // light.color = new THREE.Color('red')
        light.position.set(x, y, z);
        scene.add(light);
        const lensflare = new Lensflare();
        lensflare.addElement(new LensflareElement(textureFlare0, 200, 0, light.color));
        // lensflare.addElement(new LensflareElement(textureFlare3, 200, 0));
        // lensflare.addElement(new LensflareElement(textureFlare3, 70, 0.7));
        // lensflare.addElement(new LensflareElement(textureFlare3, 120, 0.9));
        // lensflare.addElement(new LensflareElement(textureFlare3, 70, 1));
        light.add(lensflare);
    }

    return {
        light
    };

}
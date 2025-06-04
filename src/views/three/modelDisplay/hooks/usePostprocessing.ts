// 后处理
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import {
    vertex,
    fragment
} from '../shader/index';

export function usePostProcessing({
    scene,
    gui,
    renderer,
    camera
}: {
    scene: THREE.Scene,
    gui: GUI,
    renderer: THREE.WebGLRenderer,
    camera: THREE.Camera
}) {
    const composer = new EffectComposer(renderer);
    const BLOOM_SCENE = 2;

    const bloomLayer = new THREE.Layers();
    bloomLayer.set(BLOOM_SCENE);

    const params = {
        threshold: 0.3,
        strength: 0.3,
        radius: 0.5,
    };

    const renderScene = new RenderPass(scene, camera);

    const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0.4, 0.85);
    bloomPass.threshold = params.threshold;
    bloomPass.strength = params.strength;
    bloomPass.radius = params.radius;

    const bloomComposer = new EffectComposer(renderer);
    bloomComposer.renderToScreen = false;
    bloomComposer.addPass(renderScene);
    bloomComposer.addPass(bloomPass);

    const mixPass = new ShaderPass(
        new THREE.ShaderMaterial({
            uniforms: {
                baseTexture: { value: null },
                bloomTexture: { value: bloomComposer.renderTarget2.texture }
            },
            vertexShader: vertex,
            fragmentShader: fragment,
            defines: {}
        }), 'baseTexture'
    );
    mixPass.needsSwap = true;

    const outputPass = new OutputPass();

    const finalComposer = new EffectComposer(renderer);
    // finalComposer.addPass(renderScene);
    // finalComposer.addPass(mixPass);
    // finalComposer.addPass(outputPass);


    const bloomFolder = gui.addFolder('bloom');

    bloomFolder.add(params, 'threshold', 0.0, 1.0).onChange(function (value) {

        bloomPass.threshold = Number(value);

    });

    bloomFolder.add(params, 'strength', 0.0, 3).onChange(function (value) {

        bloomPass.strength = Number(value);

    });

    bloomFolder.add(params, 'radius', 0.0, 1.0).step(0.01).onChange(function (value) {

        bloomPass.radius = Number(value);

    });
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
    composer.addPass(outputPass);
    return {
        bloomComposer,
        finalComposer,
        composer,
        bloomLayer
    };

}


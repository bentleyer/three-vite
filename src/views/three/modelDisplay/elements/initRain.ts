import * as THREE from 'three';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';

const gu = {
    time: { value: 0 },
    depthData: { value: 1 }
};



export function initRain({
    scene,
    gui
}: {
    scene: THREE.Scene,
    gui: GUI
}) {
    const rain = new Rain(new THREE.Vector3(200, 200, 200), 500000);

    scene.add(rain);
    function animationMesh(delta) {
        gu.time.value = gu.time.value + delta  / 1
    }
    return {
        animationMesh
    }
}



console.clear();


class DepthData extends THREE.WebGLRenderTarget {
    constructor(size, camParams, renderer, scene) {
        super(size, size);
        this.renderer = renderer
        this.scene = scene

        this.texture.minFilter = THREE.NearestFilter;
        this.texture.magFilter = THREE.NearestFilter;
        this.stencilBuffer = false;
        this.depthTexture = new THREE.DepthTexture();
        this.depthTexture.format = THREE.DepthFormat;
        this.depthTexture.type = THREE.UnsignedIntType;

        const hw = camParams.width * 0.5;
        const hh = camParams.height * 0.5;
        const d = camParams.depth;
        this.depthCam = new THREE.OrthographicCamera(-hw, hw, hh, -hh, 0, d);
        this.depthCam.layers.set(1);
        this.depthCam.position.set(0, d, 0);
        this.depthCam.lookAt(0, 0, 0);
    }

    update() {
        this.renderer.setRenderTarget(this);
        this.renderer.render(scene, this.depthCam);
        this.renderer.setRenderTarget(null);
    }
}




class Rain extends THREE.Line {
    constructor(size, amount) {
        const v = new THREE.Vector3();
        const gBase = new THREE.BufferGeometry().setFromPoints([ new THREE.Vector2(0, 0), new THREE.Vector2(0, 1) ]);
        const g = new THREE.InstancedBufferGeometry().copy(gBase);
        g.setAttribute('instPos', new THREE.InstancedBufferAttribute(
            new Float32Array(
                Array.from({ length: amount }, () => {
                    v.random().subScalar(0.5);
                    v.y += 0.5;
                    v.multiply(size);
                    return [ ...v ];
                }).flat()
            ), 3
        ));
        g.instanceCount = amount;

        const m = new THREE.LineBasicMaterial({
            color: 'white',
            transparent: true,
            onBeforeCompile: shader => {
                shader.uniforms.depthData = gu.depthData;
                shader.uniforms.time = gu.time;
                shader.vertexShader = `
            uniform float time;
            
            attribute vec3 instPos;
            
            varying float colorTransition;
            varying vec3 vPos;
            ${shader.vertexShader}
          `.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
            
            float t = time;
            vec3 iPos = instPos;
            iPos.y = mod(50. - instPos.y - t * 5., 50.);
            
            transformed.y *= 0.5;
            transformed += iPos;
            
            vPos = transformed;
            
            colorTransition = position.y;
            `
    );
                //console.log(shader.vertexShader);

                shader.fragmentShader = `
            uniform sampler2D depthData;
            varying float colorTransition;
            varying vec3 vPos;
            ${shader.fragmentShader}
          `.replace(
        'vec4 diffuseColor = vec4( diffuse, opacity );',
        `
            vec2 depthUV = (vPos.xz + 10.) / 20.;
            depthUV.y = 1. - depthUV.y;
            
            float depthVal = 0.0 ;
            float actualDepth = depthVal * 20.;
            
            if(vPos.y < actualDepth) discard;
            
            float trns = 1. - colorTransition;
            
            float distVal = smoothstep(3., 0., vPos.y - actualDepth);
            vec3 col = mix(diffuse, vec3(0.9), distVal); // the closer, the whiter
            vec4 diffuseColor = vec4( mix(col, col + 0.1, pow(trns, 16.)), (opacity * (0.25 + 0.75 * distVal)) * trns );
            `
    );
                //console.log(shader.fragmentShader);
            }
        });
        super(g, m);
        this.frustumCulled = false;
        this.rotation.x = Math.PI / 2
    }
}
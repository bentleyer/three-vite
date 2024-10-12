import * as THREE from 'three';

import hdr_n_z from '@/assets/images/textures/hdrs/skybox/n_z.jpg';
import hdr_n_y from '@/assets/images/textures/hdrs/skybox/n_y.jpg';
import hdr_n_x from '@/assets/images/textures/hdrs/skybox/n_x.jpg';
import hdr_p_z from '@/assets/images/textures/hdrs/skybox/p_z.jpg';
import hdr_p_y from '@/assets/images/textures/hdrs/skybox/p_y.jpg';
import hdr_p_x from '@/assets/images/textures/hdrs/skybox/p_x.jpg';



export function useSkybox({
    scene,
    renderer,
    gui
}) {

    const hdrJpgEquirectangularMap = new THREE.CubeTextureLoader().load([ hdr_p_x, hdr_n_x, hdr_p_y, hdr_n_y, hdr_p_z, hdr_n_z ]);
    const image1 = new THREE.TextureLoader().load(hdr_n_x);

    scene.background = hdrJpgEquirectangularMap;
    // scene.background = new THREE.Color('green')
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMappingExposure = 1;
    // 创建一个着色器材质
    const skyboxMaterial = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        uniforms: {
            // 将天空盒纹理传递给着色器
            skybox: { value: hdrJpgEquirectangularMap },
            // 定义时间变量
            time: { value: 0 },
        },
        vertexShader: `
    varying vec3 vWorldPosition;
    void main() {
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `,
        fragmentShader: `
    uniform samplerCube skybox;
    uniform float time;
    varying vec3 vWorldPosition;
    void main() {
      vec3 direction = normalize(vWorldPosition);
      // 在片元着色器中通过时间和方向计算出天空盒的颜色
      vec4 color = textureCube(skybox, vec3(direction.x + time * 0.1, direction.yz)).rgba;
      gl_FragColor = color;
    }
  `,
    });

    // 创建一个天空盒网格，将着色器材质应用于其材质
    const skyboxGeometry = new THREE.BoxGeometry(10000, 10000, 10000);
    const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
    scene.add(skybox);

    function animation(delta) {
        skyboxMaterial.uniforms.time.value += 0.03;
    }

    // toneMappingFolder.add(scene.backgroundRotation, 'y', 0, 10, 0.1)

    return {
        animation,
        skyboxMaterial: skyboxMaterial
    };
}


const defaultSkyboxVertexShader = [

    'varying vec3 vViewDir;', //send the view direction for lookup to frag

    'void main(){',

    'vec4 wp = vec4( position + cameraPosition , 1. ); ', //move the unit cube to be centered with the camera

    'vViewDir = position;', //the unit cube has its vertices positioned so that this can be used for word space lookup

    'gl_Position = projectionMatrix * viewMatrix * wp;', //project the transformed cube, modelMatrix ommited because all thats needed is the translation

    '}'

].join('\n');

const defaultSkyboxFragmentShader = [

    'varying vec3 vViewDir;', //view dir for lookup

    'uniform samplerCube uCubemap;', //cubemap texture

    'void main(){',

    'vec4 tex = textureCube( uCubemap , normalize( vViewDir) );',

    'gl_FragColor = tex;',

    // "gl_FragColor = vec4( vViewDir , 1. );",

    '}'

].join('\n');

const defaultCubeGeometry = new THREE.BoxGeometry(2, 2, 2, 1, 1, 1); 	//a single segment cube;

function SkyBoxMaterial(cubemap) {

    THREE.ShaderMaterial.call(this, {

        uniforms:{

            uCubemap:{

                type:'t',

                value: null

            }

        },

        vertexShader: defaultSkyboxVertexShader,

        fragmentShader: defaultSkyboxFragmentShader,

        side: THREE.BackSide,									//render the backside of the cube

        depthWrite: false 										//its infinitely far away, so no interferance with depth

    });

    Object.defineProperty(this, 'cubemap', {

        get: function () {
            return this.uniforms.uCubemap.value;
        },

        set: function (v) {
            this.uniforms.uCubemap.value = v;
        }

    });

    if (undefined !== cubemap) {
        this.cubemap = cubemap;
    }

}

SkyBoxMaterial.prototype = Object.create(THREE.ShaderMaterial.prototype);

SkyBoxMaterial.constructor = SkyBoxMaterial;


//skybox class extends from mesh
function SkyBox(renderer, cubemap) {

    // params = params || {};

    THREE.Mesh.call(this, defaultCubeGeometry, new SkyBoxMaterial());

    if (undefined === renderer) {

        console.warn('SkyBox: renderer not provided.');

        return false;

    }
    this._renderer = renderer;


    this._scene = new THREE.Scene(); //have its own self contained scene

    this.frustumCulled = false; //prevent threejs from trying to cull this object (the matrix is not used so three.js doesnt know where it is)

    this._scene.add(this);

    Object.defineProperty(this, 'cubemap', {

        get: function() {
            return this.material.cubemap;
        },

        set: function(v) {
            this.material.cubemap = v;
        }

    });

    if (undefined !== cubemap) {
        this.cubemap = cubemap;
    }

}

SkyBox.prototype = Object.create(THREE.Mesh.prototype);

SkyBox.constructor = SkyBox;

SkyBox.prototype.render = function(camera) {

    const hijackedAutoClear = this._renderer.autoClear;

    this._renderer.autoClear = false;

    this._renderer.render(this._scene, camera);

    this._renderer.autoClear = hijackedAutoClear;

};



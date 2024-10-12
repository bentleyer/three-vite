import * as THREE from 'three';

// import hdr_n_z from '@/assets/images/textures/hdrs/skybox/n_z.jpg';
// import hdr_n_y from '@/assets/images/textures/hdrs/skybox/n_y.jpg';
// import hdr_n_x from '@/assets/images/textures/hdrs/skybox/n_x.jpg';
// import hdr_p_z from '@/assets/images/textures/hdrs/skybox/p_z.jpg';
// import hdr_p_y from '@/assets/images/textures/hdrs/skybox/p_y.jpg';
// import hdr_p_x from '@/assets/images/textures/hdrs/skybox/p_x.jpg';

import hdr_n_z from '@/assets/images/textures/hdrs/overcast-daylight/n_z.png';
import hdr_n_y from '@/assets/images/textures/hdrs/overcast-daylight/n_y.png';
import hdr_n_x from '@/assets/images/textures/hdrs/overcast-daylight/n_x.png';
import hdr_p_z from '@/assets/images/textures/hdrs/overcast-daylight/p_z.png';
import hdr_p_y from '@/assets/images/textures/hdrs/overcast-daylight/p_y.png';
import hdr_p_x from '@/assets/images/textures/hdrs/overcast-daylight/p_x.png';



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

export function useSkybox({
    scene,
    renderer,
    gui
}) {

    const hdrJpgEquirectangularMap = new THREE.CubeTextureLoader().load([ hdr_p_x, hdr_n_x, hdr_p_y, hdr_n_y, hdr_p_z, hdr_n_z ]);
    const image1 = new THREE.TextureLoader().load(hdr_n_x);

    // scene.background = hdrJpgEquirectangularMap;
    // scene.background = new THREE.Color('green')
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMappingExposure = 1;

    const skyboxGeometry = new THREE.BoxGeometry(2, 2, 2, 1, 1, 1);
    const skyboxMaterial = new THREE.ShaderMaterial({
        uniforms:{

            uCubemap:{

                value: hdrJpgEquirectangularMap

            }

        },

        vertexShader: defaultSkyboxVertexShader,

        fragmentShader: defaultSkyboxFragmentShader,

        side: THREE.BackSide,									//render the backside of the cube

        depthWrite: false
    });
    const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
    skybox.rotation.x = Math.PI / 2

    // 创建一个天空盒网格，将着色器材质应用于其材质
    scene.add(skybox);

    function animation(delta) {
        // skyboxMaterial.uniforms.time.value += 0.03;
    }

    // toneMappingFolder.add(scene.backgroundRotation, 'y', 0, 10, 0.1)

    return {
        animation,
        skyboxMaterial: skyboxMaterial
    };
}



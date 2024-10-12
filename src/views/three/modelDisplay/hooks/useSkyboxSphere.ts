import * as THREE from 'three';

import sphereImg from '@/assets/images/textures/hdrs/Texture-cloudy-daylight-HDRI-2048/cloudy-daylight.png'


const defaultSkyboxVertexShader = [

    'varying vec3 vPosition;', //send the view direction for lookup to frag

    'void main(){',

    'vec4 wp = vec4( position + cameraPosition , 1. ); ', //move the unit cube to be centered with the camera

    'vPosition = position;', //the unit cube has its vertices positioned so that this can be used for word space lookup

    'gl_Position = projectionMatrix * viewMatrix * wp;', //project the transformed cube, modelMatrix ommited because all thats needed is the translation

    '}'

].join('\n');

const defaultSkyboxFragmentShader = [

    'varying vec3 vPosition;', //view dir for lookup

    'uniform samplerCube uCubemap;', //cubemap texture

    'void main(){',

    'vec4 tex = textureCube( uCubemap , normalize( vPosition) );',

    'gl_FragColor = tex;',

    // "gl_FragColor = vec4( vViewDir , 1. );",

    '}'

].join('\n');

// const fragmentShader = `
//     varying vec3 vPosition;  // 顶点着色器传递的顶点位置
//     uniform sampler2D tex;  // 纹理贴图

//     void main() {
//         // 旋转矩阵，绕X轴旋转90度
//         mat3 rotation = mat3(
//             1.0,  0.0,  0.0,
//             0.0,  0.0,  -1.0,
//             0.0,  1.0,  0.0
//         );

//         // 旋转后的顶点坐标
//         vec3 rotatedPosition = rotation * vPosition;

//         // 计算旋转后的 uv 坐标
//         vec2 uv = vec2(rotatedPosition.x * 0.5 + 0.5, rotatedPosition.y * 0.5 + 0.5);

//         // 采样贴图上的颜色
//         vec4 texColor = texture2D(tex, uv);

//         // 使用纹理颜色作为片段颜色
//         gl_FragColor = texColor;
//     }
// `;

// const fragmentShader = `
//     varying vec3 vPosition;  // 顶点着色器传递的顶点位置
//     uniform sampler2D tex;  // 纹理贴图

//     void main() {
//         // 计算球体上的纹理坐标 (uv坐标)
//         vec2 uv = vec2(vPosition.y * 0.5 + 0.5, vPosition.x * 0.5 + 0.5);

//         // 采样贴图上的颜色
//         vec4 texColor = texture2D(tex, uv);

//         // 使用纹理颜色作为片段颜色
//         // gl_FragColor = texColor;
//         gl_FragColor = texColor;
//     }
// `;

const vertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;

    void main() {
        mat3 rotation = mat3(
            1.0,  0.0,  0.0,
            0.0,  0.0,  1.0,
            0.0,  -1.0,  0.0
        );
        vec4 wp = vec4( rotation * position + cameraPosition , 1. ); 
        vPosition = position;
        vUv = uv; // 传递纹理坐标给片段着色器

        gl_Position = projectionMatrix * viewMatrix * wp;
    }
`;

// const fragmentShader = `
//     uniform sampler2D tex;
//     varying vec2 vUv;

//     void main() {
//         // 从全景纹理获取颜色值
//         vec4 color = texture2D(tex, vUv);
//         gl_FragColor = color; // 将颜色输出
//         // gl_FragColor = vec4(1, 1, 0, 1); // 将颜色输出
//     }
// `;

const fragmentShader = `
    varying vec3 vPosition;  // 顶点着色器传递的顶点位置
    uniform sampler2D tex;  // 纹理贴图
    varying vec2 vUv;

    void main() {

        // 采样贴图上的颜色
        vec4 texColor = texture2D(tex, vUv);

        // 使用纹理颜色作为片段颜色
        gl_FragColor = texColor;
    }
`;

export function useSkybox({
    scene,
    renderer,
    gui
}) {

    const image1 = new THREE.TextureLoader().load(sphereImg);

    // scene.background = hdrJpgEquirectangularMap;
    // scene.background = new THREE.Color('green')


    const skyGeometry = new THREE.SphereGeometry(10000, 60, 40);
    const skyMaterial = new THREE.MeshBasicMaterial({
        map: image1,
        side: THREE.BackSide, // 反向显示贴图
    });
    const skyboxMaterial = new THREE.ShaderMaterial({
        uniforms:{

            tex:{

                value: image1

            }

        },

        // vertexShader: defaultSkyboxVertexShader,
        vertexShader: vertexShader,

        fragmentShader: fragmentShader,

        side: THREE.BackSide,									//render the backside of the cube

        depthWrite: false
    });
    const skybox = new THREE.Mesh(skyGeometry, skyboxMaterial);
    // skybox.rotation.x = Math.PI / 2

    // 创建一个天空盒网格，将着色器材质应用于其材质
    scene.add(skybox);

    function animation(delta) {
        // skyboxMaterial.uniforms.time.value += 0.03;
    }

    // toneMappingFolder.add(scene.backgroundRotation, 'y', 0, 10, 0.1)

    return {
        animation,
    };
}



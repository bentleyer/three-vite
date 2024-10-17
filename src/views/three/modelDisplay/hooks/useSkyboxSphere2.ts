import * as THREE from 'three';

import sphereImg from '@/assets/images/textures/hdrs/Texture-cloudy-daylight-HDRI-2048/cloudy-daylight.png'
import { vertex, fragment } from '../shader/proceduralSky'


export function useSkybox({
    scene,
    renderer,
    gui
}) {

    const image1 = new THREE.TextureLoader().load(sphereImg);

    // scene.background = hdrJpgEquirectangularMap;
    // scene.background = new THREE.Color('green')


    const skyGeometry = new THREE.SphereGeometry(10000, 60, 40);
    const skyboxGeometry = new THREE.BoxGeometry(2, 2, 2, 1, 1, 1);
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
        vertexShader: vertex,

        fragmentShader: fragment,

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



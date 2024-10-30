import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';
import * as THREE from 'three';
import type GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';
import myModel from '@/assets/models/car/suv_light.glb?url';
// import myModel from '@/assets/models/car/suv_one_light.glb?url';

// import myModel from '@/assets/models/gltf/tree.glb?url';
import textureBaseColor from '@/assets/images/textures/car/Texture_suv_basecolor_1024.jpg';

// import textureEmissiveColor from '@/assets/images/textures/car/suv_emissive.jpg'
import textureEmissiveColor from '@/assets/images/textures/car/suv-emission2.jpeg';
import { findKeyByValue } from '../utils';
// import textureEmissiveColor from '@/assets/images/textures/car/suv-emission.jpeg'
// import textureEmissiveColor from '@/assets/images/textures/car/suv-emission3.jpeg'

const LightTypeNameMap = {
    'LowBeamHeadlightFR': '前面右侧近光灯',
    'LowBeamHeadlightFL': '前面左侧近光灯',
    'HighBeamHeadlightFR': '前面右侧远光灯',
    'HighBeamHeadlightFL': '前面左侧远光灯',
    'TurnSignalLightFR': '前面右侧转向灯',
    'TurnSignalLightFL': '前面左侧转向灯',
    'TurnSignalLightBR': '后面右侧转向灯',
    'TurnSignalLightBL': '后面左侧转向灯',
    'BrakeLightBR': '后面右侧刹车灯',
    'BrakeLightBL': '后面左侧刹车灯',
    'PositionLightFR': '前面右侧示廓灯',
    'PositionLightFL': '前面左侧示廓灯',
    'TailLightBR': '后面右侧尾灯',
    'TailLightBL': '后面左侧尾灯',
    'FogLightFR': '前面右侧雾灯',
    'FogLightFL': '前面左侧雾灯',
    'ReverseLightBR': '后面右侧倒车灯',
    'ReverseLightBL': '后面左侧倒车灯',
    'DaytimeRunningLightFR': '前面右侧日间行车灯',
    'DaytimeRunningLightFL': '前面左侧日间行车灯',
    'BrakeLightFlashingLightBR': '后面右侧刹车灯闪烁灯',
    'BrakeLightFlashingLightBL': '后面左侧刹车灯闪烁灯',
    'ThirdBrakeLightBR': '后面高位刹车灯',
    'InstrumentPanelLightFR': '前面右侧仪表灯',
    'InstrumentPanelLightFL': '前面左侧仪表灯',
    'InteriorLightFR': '前面右侧室内灯',
    'InteriorLightFL': '前面左侧室内灯',
    'LicensePlateLightBR': '后面车牌灯',
    'HazardLightsFR': '前面右侧警示灯',
    'HazardLightsFL': '前面左侧警示灯',
    'HazardLightsBR': '后面右侧警示灯',
    'HazardLightsBL': '后面左侧警示灯'
};


const LightTypeMap = {
    'LowBeamHeadlightFR': 'Low_beam_R',
    'LowBeamHeadlightFL': 'High_beams_L',
    'HighBeamHeadlightFR': 'High_beams_R',
    'HighBeamHeadlightFL': 'Low_beam_L',
    'TurnSignalLightFR': 'Front_turn_signalwarning_light_R',
    'TurnSignalLightFL': 'Front_turn_signalwarning_light_L',
    'TurnSignalLightBR': 'Rear_turn_signalwarning_light_R',
    'TurnSignalLightBL': 'Rear_turn_signalwarning_light_L',
    'BrakeLightBR': 'rear_indicator_R',
    'BrakeLightBL': 'rear_indicator_L',
    'PositionLightFR': '',
    'PositionLightFL': '',
    'TailLightBR': 'rear_indicator_R',
    'TailLightBL': 'rear_indicator_L',
    'FogLightFR': '',
    'FogLightFL': '',
    'ReverseLightBR': '',
    'ReverseLightBL': '',
    'DaytimeRunningLightFR': 'Front_indicator_light_R',
    'DaytimeRunningLightFL': 'Front_indicator_light_L',
    'BrakeLightFlashingLightBR': '',
    'BrakeLightFlashingLightBL': '',
    'ThirdBrakeLightBR': '',
    'InstrumentPanelLightFR': '',
    'InstrumentPanelLightFL': '',
    'InteriorLightFR': '',
    'InteriorLightFL': '',
    'LicensePlateLightBR': '',
    'HazardLightsFR': '',
    'HazardLightsFL': '',
    'HazardLightsBR': '',
    'HazardLightsBL': ''
};

type LightLocation = keyof typeof LightTypeMap

function getLocation(name: string): LightLocation | '' {
    const lightType = findKeyByValue(LightTypeMap, name);
    return lightType;
}

const lightOnMat = {
    // 近光-白灯
    'LowBeamHeadlightFR': {
        emissive: new THREE.Color('white'),
        emissiveIntensity: 2,
        color: new THREE.Color('white'),
    },
    'LowBeamHeadlightFL': {
        emissive: new THREE.Color('white'),
        emissiveIntensity: 2,
        color: new THREE.Color('white'),
    },
    // 远光-白灯
    'HighBeamHeadlightFR': {
        emissive: new THREE.Color('white'),
        emissiveIntensity: 5,
        color: new THREE.Color('white'),
    },
    'HighBeamHeadlightFL': {
        emissive: new THREE.Color('white'),
        emissiveIntensity: 5,
        color: new THREE.Color('white'),
    },
    // 转向-黄灯
    'TurnSignalLightFR': {
        emissive: new THREE.Color('#fff700'),
        emissiveIntensity: 1,
        color: new THREE.Color('#fff700'),
    },
    'TurnSignalLightFL': {
        emissive: new THREE.Color('#fff700'),
        emissiveIntensity: 1,
        color: new THREE.Color('#fff700'),
    },
    'TurnSignalLightBR': {
        emissive: new THREE.Color('#fff700'),
        emissiveIntensity: 1,
        color: new THREE.Color('#fff700'),
    },
    'TurnSignalLightBL': {
        emissive: new THREE.Color('#fff700'),
        emissiveIntensity: 1,
        color: new THREE.Color('#fff700'),
    },
    // 刹车-红灯
    'BrakeLightBR': {
        emissive: new THREE.Color('red'),
        emissiveIntensity: 1,
        color: new THREE.Color('white'),
    },
    'BrakeLightBL': {
        emissive: new THREE.Color('red'),
        emissiveIntensity: 1,
        color: new THREE.Color('white'),
    },
    // 尾灯-红灯
    'TailLightBR': {
        emissive: new THREE.Color('red'),
        emissiveIntensity: 1,
        color: new THREE.Color('white'),
    },
    'TailLightBL': {
        emissive: new THREE.Color('red'),
        emissiveIntensity: 1,
        color: new THREE.Color('white'),
    },
    // 行车灯-白灯
    'DaytimeRunningLightFR': {
        emissive: new THREE.Color('white'),
        emissiveIntensity: 1,
        color: new THREE.Color('white'),
    },
    'DaytimeRunningLightFL': {
        emissive: new THREE.Color('white'),
        emissiveIntensity: 1,
        color: new THREE.Color('white'),
    },
};

const lightOffMat = {
    // 近光-白灯
    'LowBeamHeadlightFR': {
        emissive: new THREE.Color('white'),
        emissiveIntensity: 0,
        color: new THREE.Color('white'),
    },
    'LowBeamHeadlightFL': {
        emissive: new THREE.Color('white'),
        emissiveIntensity:  0,
        color: new THREE.Color('white'),
    },
    // 远光-白灯
    'HighBeamHeadlightFR': {
        emissive: new THREE.Color('white'),
        emissiveIntensity:  0,
        color: new THREE.Color('white'),
    },
    'HighBeamHeadlightFL': {
        emissive: new THREE.Color('white'),
        emissiveIntensity:  0,
        color: new THREE.Color('white'),
    },
    // 转向-黄灯
    'TurnSignalLightFR': {
        emissive: new THREE.Color('#fff700'),
        emissiveIntensity:  0,
        color: new THREE.Color('white'),
    },
    'TurnSignalLightFL': {
        emissive: new THREE.Color('#fff700'),
        emissiveIntensity:  0,
        color: new THREE.Color('white'),
    },
    'TurnSignalLightBR': {
        emissive: new THREE.Color('#fff700'),
        emissiveIntensity:  0,
        color: new THREE.Color('white'),
    },
    'TurnSignalLightBL': {
        emissive: new THREE.Color('#fff700'),
        emissiveIntensity:  0,
        color: new THREE.Color('white'),
    },
    // 刹车-红灯
    'BrakeLightBR': {
        emissive: new THREE.Color('red'),
        emissiveIntensity:  0,
        color: new THREE.Color('white'),
    },
    'BrakeLightBL': {
        emissive: new THREE.Color('red'),
        emissiveIntensity:  0,
        color: new THREE.Color('white'),
    },
    // 尾灯-红灯
    'TailLightBR': {
        emissive: new THREE.Color('red'),
        emissiveIntensity:  0,
        color: new THREE.Color('white'),
    },
    'TailLightBL': {
        emissive: new THREE.Color('red'),
        emissiveIntensity:  0,
        color: new THREE.Color('white'),
    },
    // 行车灯-白灯
    'DaytimeRunningLightFR': {
        emissive: new THREE.Color('white'),
        emissiveIntensity:  0,
        color: new THREE.Color('white'),
    },
    'DaytimeRunningLightFL': {
        emissive: new THREE.Color('white'),
        emissiveIntensity:  0,
        color: new THREE.Color('white'),
    },
};

export function carEmissiveOn(instance: any, location: LightLocation) {
    instance.traverse((obj: any) => {
      if (obj.isMesh) {
        if (getLocation(obj.name) === location) {
          // obj.material.emissiveMap = emissiveColor;
          if (getLocation(obj.name)) {
            const mat = lightOnMat[location]
            for (let k in mat) {
                obj.material[k] = mat[k]
            }
          }
        }
      }
    });
  }

export function carEmissiveOff(instance: any, location: LightLocation) {
    instance.traverse((obj: any) => {
      if (obj.isMesh) {
        if (getLocation(obj.name) === location) {
            const mat = lightOffMat[location]
            for (let k in mat) {
                obj.material[k] = mat[k]
            }
        }
      }
    });
  }


export async function initLoader({
    scene,
    gui
}:{
    gui: GUI
}) {
    const params = {
        punctualLightsEnabled: true,
        frontRight: true,
        frontLeft: true,
        backRight: true,
        backLeft: true,
        'LowBeamHeadlightFR': true,
        'LowBeamHeadlightFL': true,
        'HighBeamHeadlightFR': true,
        'HighBeamHeadlightFL': true,
        'TurnSignalLightFR': true,
        'TurnSignalLightFL': true,
        'TurnSignalLightBR': true,
        'TurnSignalLightBL': true,
        'BrakeLightBR': true,
        'BrakeLightBL': true,
        'PositionLightFR': true,
        'PositionLightFL': true,
        'TailLightBR': true,
        'TailLightBL': true,
        'FogLightFR': true,
        'FogLightFL': true,
        'ReverseLightBR': true,
        'ReverseLightBL': true,
        'DaytimeRunningLightFR': true,
        'DaytimeRunningLightFL': true,
        'BrakeLightFlashingLightBR': true,
        'BrakeLightFlashingLightBL': true,
        'ThirdBrakeLightBR': true,
        'InstrumentPanelLightFR': true,
        'InstrumentPanelLightFL': true,
        'InteriorLightFR': true,
        'InteriorLightFL': true,
        'LicensePlateLightBR': true,
        'HazardLightsFR': true,
        'HazardLightsFL': true,
        'HazardLightsBR': true,
        'HazardLightsBL': true
    };
    // const hdrJpgEquirectangularMap = new THREE.CubeTextureLoader().load([ hdr_p_x, hdr_n_x, hdr_p_y, hdr_n_y, hdr_p_z, hdr_n_z ]);
    const textureLoader = new THREE.TextureLoader();
    //纹理 被加载管理器统一管理

    const building2BaseColor = textureLoader.load(textureBaseColor);
    const emissiveColor = textureLoader.load(textureEmissiveColor);

    building2BaseColor.flipY = false;
    emissiveColor.flipY = false;
    emissiveColor.colorSpace = THREE.SRGBColorSpace;

    const sceneModel = new THREE.Group();
    const modelArr = [];
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/src/assets/libs/draco/gltf/');
    const count = 10;

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);

    function makeNaive(model) {
        for (let i = 0; i < count; i++) {
            const model2 = model.clone();
            model2.position.set(Math.random() * 200 - 100, Math.random() * 200 - 100, 0);
            sceneModel.add(model2);
            modelArr.push(model2);
        }
        scene.add(sceneModel);

    }

    const [ gltf ] = await Promise.all([
        loader.loadAsync(myModel),
    ]);
    const model = gltf.scene;
    model.traverse((obj) => {
        if (obj.isMesh) {
            console.log('getLocation', getLocation(obj.name), obj.name);
            // obj.material =  new THREE.MeshPhysicalMaterial()
            obj.material = obj.material.clone();
            if (getLocation(obj.name)) {
                obj.material.color = new THREE.Color('white');
                obj.material.map = building2BaseColor;
                // obj.material.emissive = new THREE.Color('#ffc800');
                obj.material.emissive = new THREE.Color('white');

                obj.material.emissiveMap = building2BaseColor;
                // obj.material.emissiveMap = emissiveColor;
                if (getLocation(obj.name)) {
                    const folder = gui.addFolder(getLocation(obj.name));
                    folder.close()
                    folder.addColor(obj.material, 'emissive');
                    folder.addColor(obj.material, 'color');

                    folder.add(obj.material, 'roughness', 0, 10, 0.1);
                    folder.add(obj.material, 'metalness', 0, 10, 0.1);

                    folder.add(obj.material, 'emissiveIntensity', 0, 10, 0.1);
                    folder.add(params, getLocation(obj.name)).onChange(
                        (val) => {
                            if (!val) {
                                // obj.material.color  = new THREE.Color('white')
                                carEmissiveOff(model, getLocation(obj.name))
                                // obj.material.emissiveIntensity = 0;
                            } else {
                                carEmissiveOn(model, getLocation(obj.name))
                                // obj.material.color  = new THREE.Color('black')
                                // obj.material.emissiveIntensity = 1;
                                // obj.material.emissive = new THREE.Color('red');
                            }
                        }
                    );
                    obj.layers.toggle(2);
                }
            }
            obj.castShadow = true;
        }
    });
    console.log('model', model);
    model.rotation.x = Math.PI / 2;
    // gui.add( model.rotation, 'y', 0.0, Math.PI * 2, 0.01 )
    model.scale.set(10, 10, 10);
    // makeNaive(model)
    scene.add(model);
    function animationMesh() {

        sceneModel.children.forEach((child) => {
            const rotationSpeed = {
                x: 0,
                y: 0.01,
                z: 0
            };
            child.rotation.set(
                child.rotation.x + rotationSpeed.x,
                child.rotation.y + rotationSpeed.y,
                child.rotation.z + rotationSpeed.z
            );
        });
    }
    return {
        animationMesh
    };
}
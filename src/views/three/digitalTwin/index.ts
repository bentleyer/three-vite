import * as THREE from 'three';

import Stats from 'three/addons/libs/stats.module.js';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
// import myModel from '@/assets/models/gltf/Audibm_min.glb?url';
// import myModel from '@/assets/models/gltf/Audi.glb?url';
import myModel from '@/assets/models/gltf/ferrari.glb?url';
import picture from '@/assets/images/textures/ferrari_ao.png';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { createWater } from './compents/sea';


// 构建目标路径
const SHADOW_MAP_WIDTH = 4096, SHADOW_MAP_HEIGHT = 4096;

let renderer: any;
let camera: any;
let scene: any;
let controls: any;
let grid: any;
let stats: any;
let city: any;
let renderList: any = [];
let water: any;
const sceneModel = new THREE.Group();
const bodyMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xff0000, metalness: 1.0, roughness: 0.5, clearcoat: 1.0, clearcoatRoughness: 0.03
});

const detailsMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff, metalness: 1.0, roughness: 0.5
});

const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, metalness: 0.25, roughness: 0, transmission: 1.0
});

function initControl() {
    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();
    controls.screenSpacePanning = false; //摄像机将在与摄像机向上方向垂直的平面中平移
    controls.minPolarAngle = 0; // radians
    controls.maxPolarAngle = 1.5;
    // controls.zoomToCursor = true;
}

function initCamera() {

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 10000);
    camera.up = new THREE.Vector3(0, 0, 1);
    camera.position.set(1500, 1500, 1000);
}

function initRender() {
    const container = document.getElementById('container');

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true  });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container?.appendChild(renderer.domElement);
    // document.body.appendChild(renderer.domElement);
    renderer.autoClear = true;
    renderer.sortObjects = true;

    // renderer.shadowMap.enabled = true;
    // renderer.shadowMap.type = THREE.BasicShadowMap
    // renderer.shadowMap.type = THREE.VSMShadowMap;

}

function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x32373E);
    // scene.background = new THREE.Color(0xffffff);
    // scene.matrixWorldAutoUpdate = false;
}

function initState() {
    stats = new Stats();
    stats.domElement.style.zIndex = 100;
    document.body.appendChild(stats.dom);
}

function initGrid() {
    grid = new THREE.GridHelper(200, 200, 0x000000, 0x000000);
    grid.rotation.x = Math.PI / 2;
    grid.material.opacity = 0.2;
    grid.material.depthWrite = false;
    grid.material.transparent = true;
    scene.add(grid);
}
export function changeBody(type:string, event: any) {
    if (type === 'body') {
        bodyMaterial.color.set(event?.target?.value);
    }
    if (type === 'details') {
        detailsMaterial.color.set(event?.target?.value);
    }
    if (type === 'glass') {
        glassMaterial.color.set(event?.target?.value);
    }
}
function initLight() {
    // const ambient = new THREE.AmbientLight(0xffffff);
    // scene.add(ambient);

    const light = new THREE.DirectionalLight(0xffffff, 3);
    light.position.set(-100, -100, 100);
    light.castShadow = true;
    light.shadow.camera.top = 2000;
    light.shadow.camera.bottom = -2000;
    light.shadow.camera.left = -2000;
    light.shadow.camera.right = 2000;
    light.shadow.camera.near = 0;
    light.shadow.camera.far = 1000;
    light.shadow.bias = -0.001;
    light.shadow.radius = 1;

    light.shadow.mapSize.width = SHADOW_MAP_WIDTH;
    light.shadow.mapSize.height = SHADOW_MAP_HEIGHT;

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    scene.add(light);
}


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
        // child.position = new THREE.Vector3(
        //     child.position.x + Math.sin(0 * rotationSpeed.x),
        //     child.position.y + Math.sin(100 * rotationSpeed.y),
        //     child.position.z + Math.sin(rotationSpeed.z)
        // )
        // child.position.set(
        //     child.position.x + Math.sin(0 * rotationSpeed.x),
        //     child.position.y + Math.sin(100 * rotationSpeed.y),
        //     child.position.z + Math.sin(rotationSpeed.z)
        // );
    });
}


function initLoader() {

    const shadow = new THREE.TextureLoader().load(picture);
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath('/src/assets/libs/draco/gltf/');

    const loader = new GLTFLoader();
    loader.setDRACOLoader(dracoLoader);
    loader.load(myModel, function (gltf) {


        const model = gltf.scene;
        // model.castShadow = true;
        // model.traverse((obj) => {
        //     if (obj.isObject3D) {
        //         obj.castShadow = true;
        //     }
        // });
        const carModel: any = gltf.scene.children[0];

        carModel.getObjectByName('body').material = bodyMaterial;

        carModel.getObjectByName('rim_fl').material = detailsMaterial;
        carModel.getObjectByName('rim_fr').material = detailsMaterial;
        carModel.getObjectByName('rim_rr').material = detailsMaterial;
        carModel.getObjectByName('rim_rl').material = detailsMaterial;
        carModel.getObjectByName('trim').material = detailsMaterial;

        carModel.getObjectByName('glass').material = glassMaterial;
        model.rotation.x = Math.PI / 2;
        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(0.655 * 4, 1.3 * 4),
            new THREE.MeshBasicMaterial({
                map: shadow, blending: THREE.MultiplyBlending, toneMapped: false, transparent: true
            })
        );
        mesh.rotation.x = -Math.PI / 2;
        mesh.renderOrder = 2;
        carModel.add(mesh);

        // makeBatch(model)
        // makeInstance(model);
        // makeMerge(model);
        // makeMergeAll(model)

        scene.add(model);

        console.log('gltf', gltf, scene);

        // mixer = new THREE.AnimationMixer(model);
        // mixer.clipAction(gltf.animations[0]).play();
        // mixers.push(mixer);
        scene.updateMatrixWorld();
        animate();

    }, undefined, function (e) {

        console.error(e);

    });
}


const clock = new THREE.Clock();
// const container = document.getElementById('container');


// initScene();

// initRender();

// initGrid();
// initCamera();

// initControl();
// // renderer.setClearColor(new THREE.Color('red'));
// initState();


// initLight();
// // initInput();
// // initBatch()
// initLoader();


window.onresize = function () {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

};

// const axesHelper = new THREE.AxesHelper(500);
// scene.add(axesHelper);


function animate() {
    requestAnimationFrame(animate);
    // scene.updateMatrixWorld();
    // scene.updateMatrixWorld()
    const delta = clock.getDelta();
    // water.material.uniforms['time'].value += 1.0 / 60.0;
    // city.updateData();
    // sceneModel.updateMatrixWorld();
    renderList?.forEach((fn: any) => fn(clock.getElapsedTime()))

    // animationMesh();

    controls.update();

    stats.update();

    renderer.render(scene, camera);
}

export const start = async () => {
    initScene();

    initRender();

    // initGrid();
    initCamera();

    initControl();
    // renderer.setClearColor(new THREE.Color('red'));
    initState();


    initLight();
    // initInput();
    // initBatch()
    // 实例化
    // water = await createWater();
    // water.rotation.x = - Math.PI / 2;
    // water.position.z = 200;
    // scene.add(water);
    
    city = new City();
    // scene.add(city.group);
    // renderList = city.list
    animate();
    // initLoader();
};

class City {
    private fbxLoader: FBXLoader;
    public group: THREE.Group;
    private clock: THREE.Clock;
    private surroundLineMaterial: THREE.ShaderMaterial | null;
    private time: { value: number };
    private startTime: { value: number };
    private startLength: { value: number };
    private isStart: boolean;

    constructor() {
        this.fbxLoader = new FBXLoader();
        this.group = new THREE.Group();
        this.clock = new THREE.Clock()
        this.surroundLineMaterial = null;// 定义包围线材质属性
        this.time = { value: 0 };
        this.startTime = { value: 0 };
        this.startLength = { value: 2 }
        this.isStart = false;

        this.fbxLoader.load(`https://z2586300277.github.io/3d-file-server/` + 'models/fbx/shanghai.FBX', (group) => {

            // group.rotation.x = Math.PI / 2;
            // this.group.add(group);
            // group.traverse((child: any) => {
            //     // 设置城市建筑（mesh物体），材质基本颜色
            //     if (child.name == 'CITY_UNTRIANGULATED') {
            //         const materials = Array.isArray(child.material) ? child.material : [child.material]
            //         materials.forEach((material: any) => {
            //             material.transparent = true;
            //             material.color.setStyle("#9370DB");
            //         })
            //     }

            //     // 设置城市地面（mesh物体），材质基本颜色
            //     if (child.name == 'LANDMASS') {
            //         const materials = Array.isArray(child.material) ? child.material : [child.material]
            //         materials.forEach((material: any) => {
            //             material.transparent = true;
            //             material.color.setStyle("#040912");
            //         })
            //     }
            // })

            // this.init();
            const groupLoader = new THREE.Group()

            group.children.forEach((item) => {

                const clonedData = item.clone()

                modelHandlerMap[clonedData.name]?.(clonedData, groupLoader)

                groupLoader.add(clonedData)

            })
            groupLoader.rotation.x = Math.PI / 2;
            scene.add(groupLoader)
        });
    }

    // 初始化城市类的实例
    init() {
        this.isStart = true; // 城市渲染启动
        this.clock.start()
        this.surroundLine();
    }

    // 创建包围线条效果
    surroundLine() {
        let cityBuildings: any // 城市建筑群
        this.group.traverse(child => {
            if (child.name !== 'CITY_UNTRIANGULATED') return
            cityBuildings = child
        })

        const geometry = new THREE.EdgesGeometry(cityBuildings.geometry);
        const surroundLineMaterial = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: {
                uColor: {
                    value: new THREE.Color('#FFF')
                }
            },
            vertexShader: `
                void main() {
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
                `,
            fragmentShader: ` 
                uniform vec3 uColor;
                void main() {
                    gl_FragColor = vec4(uColor, 1);
                }
                `
        });


        const line = new THREE.LineSegments(geometry, surroundLineMaterial);
        line.name = 'surroundLine';
        line.applyMatrix4(cityBuildings.matrix.clone())
        cityBuildings.parent.add(line);

        // 在原先材质效果的基础上修改shader
        // cityBuildings.onBeforeCompile = (shader: any) => {
        //     material.color = new THREE.Color('#0e233d')
        //     material.transparent = true
        //     material.opacity = 0.9
        //     // 实现生长效果
        //     // applyGrowShader(shader)
        //     // applyRiseShader(shader)
        //     // applySpreadShader(shader)
        //     applySweepShader(shader)
        // }
        
    }

    updateData = () => {
        if (!this.isStart) return false;
        const dt = this.clock.getDelta();
        this.time.value += dt;
        this.startTime.value += dt;
        if (this.startTime.value >= this.startLength.value) {
            this.startTime.value = this.startLength.value;
        }
    }
}

// animate();

const modelHandlerMap: any = {
    CITY_UNTRIANGULATED: (model: any, group: any) => {
        // 城市建筑
        const { geometry, position, material } = model

        // 模型线框化
        const lienMaterial = new THREE.LineBasicMaterial({ color: '#2685fe' })
        const lineBox = new THREE.LineSegments(new THREE.EdgesGeometry(geometry, 1), lienMaterial)
        lineBox.position.copy(position)
        // 模型坐标系与WebGL坐标系不同需要处理
        lineBox.rotateX(-Math.PI / 2)
        group.add(lineBox)

        // 在原先材质效果的基础上修改shader
        material.onBeforeCompile = (shader: any) => {
            material.color = new THREE.Color('#0e233d')
            material.transparent = true
            material.opacity = 0.9
            // 实现生长效果
            // applyGrowShader(shader)
            // applyRiseShader(shader)
            // applySpreadShader(shader)
            applySweepShader(shader)
        }
        // lienMaterial.onBeforeCompile = (shader) => {
        //     applyGrowShader(shader)
        // }
    },
    LANDMASS: (model: any) => {
        // 地面
        const material = model.material
        material.color = new THREE.Color('#040912')
        material.transparent = true
        material.opacity = 0.8
    },
    ROADS: (model: any) => {
        // 道路
        const material = model.material
        material.color = new THREE.Color('#292e4c')
    }
}
const applySweepShader = (shader: any) => {
    shader.uniforms.uSweepTime = { value: 0 }
    shader.uniforms.uSweepColor = { value: new THREE.Color('#00FFFF') }

    shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
      #include <common>
      varying vec2 vSweepPosition;
    `
    )
    shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
            #include <begin_vertex>
            vSweepPosition = vec2(position.x, position.y);
        `
    )
    shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `
      #include <common>
      uniform vec3 uSweepColor;
      uniform float uSweepTime;
      varying vec2 vSweepPosition;
      
      vec3 sweep() {
        vec2 center = vec2(0.0);
        float smoothness = 60.0;
        float start = mod(uSweepTime, 2200.0) - 1200.0;
        float ratio = smoothstep(start, start + smoothness, vSweepPosition.x) - smoothstep(start + smoothness, start + smoothness * 2.0, vSweepPosition.x);
        return uSweepColor * ratio;
      }
    `
    )
    shader.fragmentShader = shader.fragmentShader.replace(
        '#include <dithering_fragment>',
        `
      #include <dithering_fragment>
      gl_FragColor = gl_FragColor + vec4(sweep(), 1.0);
    `
    )
    renderList.push((time: any) => {
        shader.uniforms.uSweepTime.value = time * 160.0
    })
}

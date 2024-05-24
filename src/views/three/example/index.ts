import {
    ACESFilmicToneMapping,
    Scene,
    EquirectangularReflectionMapping,
    WebGLRenderer,
    PerspectiveCamera,
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js';
import { GenerateMeshBVHWorker } from './workers/GenerateMeshBVHWorker';
import { getScaledSettings } from './utils/getScaledSettings.js';
import { LoaderElement } from './utils/LoaderElement.js';
import { WebGLPathTracer } from 'three-gpu-pathtracer/src/index.js';
// import { WebGLPathTracer } from 'three-gpu-pathtracer/src/';
import hdrMap from '@/assets/images/hdr/memorial.hdr?url';
import myModel from '@/assets/models/gltf/tree.glb?url';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';


const ENV_URL = 'https://raw.githubusercontent.com/gkjohnson/3d-demo-data/master/hdri/chinese_garden_1k.hdr';
const MODEL_URL = 'https://raw.githubusercontent.com/gkjohnson/3d-demo-data/main/models/terrarium-robots/scene.gltf';
const CREDITS = 'Model by "nyancube" on Sketchfab';
const DESCRIPTION = 'Simple path tracing example scene setup with background blur.';

let pathTracer, renderer, controls;
let camera, scene;
let loader;

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/src/assets/libs/draco/gltf/');
const count = 100;

const loader2 = new GLTFLoader();
loader2.setDRACOLoader(dracoLoader);


init();

async function init() {

    const { tiles, renderScale } = getScaledSettings();

    // loader = new LoaderElement();
    // loader.attach(document.body);

    // renderer
    renderer = new WebGLRenderer({ antialias: true });
    renderer.toneMapping = ACESFilmicToneMapping;
    document.body.appendChild(renderer.domElement);

    // path tracer
    pathTracer = new WebGLPathTracer(renderer);
    pathTracer.filterGlossyFactor = 0.5;
    pathTracer.renderScale = renderScale;
    pathTracer.tiles.set(tiles, tiles);
    // const worker = new GenerateMeshBVHWorker()
    // worker.maxWorkerCount = 4
    // pathTracer.setBVHWorker(worker);

    // camera
    camera = new PerspectiveCamera(75, 1, 0.025, 500);
    camera.position.set(8, 9, 24);

    // scene
    scene = new Scene();
    // scene.backgroundBlurriness = 0.05;

    // controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.y = 10;
    controls.addEventListener('change', () => pathTracer.updateCamera());
    controls.update();

    // load the environment map and model
    const [ gltf, envTexture ] = await Promise.all([
        loader2.loadAsync(myModel),
        new RGBELoader().loadAsync(hdrMap),
    ]);
    // const [ gltf ] = await Promise.all([
    //     loader2.loadAsync(myModel),
    // ]);
    /* new RGBELoader().load(hdrMap, function (texture, textureData) {

        console.log(textureData);
        console.log(texture);

        texture.mapping = EquirectangularReflectionMapping;
        // texture.minFilter = THREE.LinearFilter;
        // texture.magFilter = THREE.LinearFilter;
        // texture.needsUpdate = true;
        scene.environment = texture;
        scene.background = texture;

        // scene.add(mesh);

    }); */

    envTexture.mapping = EquirectangularReflectionMapping;
    scene.background = envTexture;
    scene.environment = envTexture;
    scene.add(gltf.scene);

    // initialize the path tracer
    // await pathTracer.setSceneAsync(scene, camera,);
    pathTracer.setScene(scene, camera,);

    window.addEventListener('resize', onResize);

    onResize();
    animate();

}

function onResize() {

    // update resolution
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // update camera
    pathTracer.updateCamera();

}

function animate() {

    requestAnimationFrame(animate);

    pathTracer.renderSample();

    // loader.setSamples(pathTracer.samples);

}

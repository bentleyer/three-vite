import * as THREE from 'three';
import {
    Group,
    Scene,
    MeshBasicMaterial,
    DoubleSide,
    Mesh,
    Vector3,
    Vector4,
    Color,
    AdditiveBlending,
    TextureLoader,
    CapsuleGeometry,
    MeshStandardMaterial
} from 'three';
import { BatchedRenderer, IntervalValue, ConstantColor, ConstantValue, PointEmitter, ParticleSystem, FrameOverLife, PiecewiseBezier, SizeOverLife, Bezier, ColorOverLife, ColorRange, RenderMode, ConeEmitter, Noise, BatchedParticleRenderer, CircleEmitter, GridEmitter, RandomColorBetweenGradient, Gradient, } from '../modules/three.quarks.esm.js';

import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';
// import snow from '@/assets/images/textures/sprites/texture1.png';
import snow from '@/assets/images/textures/sprites/snowflake1.png';
import rainFrag from '../shader/rain/particle_frag.glsl.js';
import rainVert from '../shader/rain/local_particle_vert.glsl.js';

// 顶点着色器
const vertexShader = `
    varying vec2 vUv;
    varying float vAlpha;

    void main() {
        vUv = uv;
        vAlpha = 1.0 - uv.y;  // 根据位置设置透明度
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        gl_PointSize = 10.0; // 控制雨滴大小
    }
`;

// 片元着色器
const fragmentShader = `
    varying vec2 vUv;
    varying float vAlpha;

    void main() {
        vec3 color = vec3(1.0, 0.0, 0.0); // 雨滴颜色（白色）
        gl_FragColor = vec4(color, 1.0); // 透明度
    }
`;


export function initParticles({
    scene,
    gui,
    camera
}: {
    camera: THREE.Camera
    scene: THREE.Scene,
    gui: GUI
}) {
    const assignSRGB = (texture) => {

        texture.colorSpace = THREE.SRGBColorSpace;

    };
    const textureLoader = new THREE.TextureLoader(); //纹理 被加载管理器统一管理
    const texture = textureLoader.load(snow, assignSRGB);
    // const clock = new THREE.Clock();
    const batchSystem = new BatchedRenderer();
    const batchRenderer = new BatchedParticleRenderer();
    scene.add(batchRenderer);

    // // Particle system configuration
    // const muzzle = {
    //     duration: 1,
    //     looping: false,
    //     startLife: new IntervalValue(0.1, 0.2),
    //     startSpeed: new ConstantValue(0),
    //     startSize: new IntervalValue(1, 5),
    //     startColor: new ConstantColor(new THREE.Vector4(1, 1, 1, 1)),
    //     worldSpace: false,

    //     maxParticle: 5,
    //     emissionOverTime: new ConstantValue(0),
    //     emissionBursts: [ {
    //         time: 0,
    //         count: new ConstantValue(1),
    //         cycle: 1,
    //         interval: 0.01,
    //         probability: 1,
    //     } ],

    //     shape: new PointEmitter(),
    //     material: new THREE.MeshBasicMaterial({ map: texture, blending: THREE.AdditiveBlending, transparent: true }),
    //     startTileIndex: new ConstantValue(91),
    //     uTileCount: 10,
    //     vTileCount: 10,
    //     renderOrder: 2,
    //     renderMode: RenderMode.Mesh
    // };
    // // Create particle system based on your configuration
    // const muzzle1 = new ParticleSystem(muzzle);
    // // developers can customize how the particle system works by
    // // using existing behavior or adding their own Behavior.
    // muzzle1.addBehavior(new ColorOverLife(new ColorRange(new THREE.Vector4(1, 0.3882312, 0.125, 1), new THREE.Vector4(1, 0.826827, 0.3014706, 1))));
    // muzzle1.addBehavior(new SizeOverLife(new PiecewiseBezier([ [ new Bezier(1, 0.95, 0.75, 0), 0 ] ])));
    // // texture atlas animation
    // muzzle1.addBehavior(new FrameOverLife(new PiecewiseBezier([ [ new Bezier(91, 94, 97, 100), 0 ] ])));
    // muzzle1.emitter.name = 'muzzle1';
    // muzzle1.emitter.position.x = 1;

    // batchSystem.addSystem(muzzle1);

    // // Add emitter to your Object3D
    // scene.add(muzzle1.emitter);
    // scene.add(batchSystem);
    const geo = new CapsuleGeometry(1.0, 3.0);
    const mat = new MeshStandardMaterial({
        color: new Color(0.5, 0.5, 0.5),
        roughness: 0.2,
        metalness: 1.0,
    });
    const gBase = new THREE.BufferGeometry().setFromPoints([ new THREE.Vector2(0, 0), new THREE.Vector2(0, 1) ]);
    const geometry = new THREE.BoxGeometry(0.03, 0.03, 1);


    const ps = new ParticleSystem({
        duration: -1, // 无限循环
        looping: true,
        instancingGeometry: geometry,
        startLife: new IntervalValue(3, 5), // 雨滴生命周期
        startSpeed: new IntervalValue(40, 60), // 雨滴下落速度
        startSize: new IntervalValue(1, 2),
        // startLength: new ConstantValue(100),
        // startSize: new IntervalValue(0.5, 0.8), // 雨滴的大小
        startColor: new ColorRange(new THREE.Vector4(1, 1, 1, 0.8), new THREE.Vector4(1, 1, 1, 1),), // 白色到透明
        worldSpace: true,

        emissionOverTime: new ConstantValue(10000),
        shape: new GridEmitter({ width: 200, height: 200, column: 100, row: 100 }),
        // material: new THREE.MeshBasicMaterial({
        //     // map: texture,
        //     // blending: THREE.AdditiveBlending,
        //     // blending: THREE.AdditiveBlending,
        //     depthTest: false,
        //     transparent: true,
        //     userData: {
        //         useShader: true
        //     },
        //     // color: 'red',
        //     side: THREE.DoubleSide,
        // }),
        material: new THREE.ShaderMaterial({
            vertexShader: rainVert,
            fragmentShader: rainFrag,
            // blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true,
            side: THREE.DoubleSide,
            userData: {
                useShader: true
            },
        }),
        renderMode: RenderMode.Mesh,
        // renderMode: RenderMode.StretchedBillBoard,
        // rendererEmitterSettings: {
        //     // speedFactor: 0,
        //     lengthFactor: 30,
        // },
        // renderMode: RenderMode.BillBoard,
        // startTileIndex: new ConstantValue(0),
        // uTileCount: 10,
        // vTileCount: 10,
        // renderOrder: 0,
    });
    // ps.addBehavior(
    //     new ColorOverLife(
    //         new RandomColorBetweenGradient(
    //             new Gradient(
    //                 [
    //                     [new Vector3(1, 0, 0), 0],
    //                     [new Vector3(1, 0, 0), 0],
    //                 ],
    //                 [
    //                     [1, 0],
    //                     [1, 1],
    //                 ]
    //             ),
    //             new Gradient(
    //                 [
    //                     [new Vector3(0, 1, 0), 0],
    //                     [new Vector3(0, 1, 0), 1],
    //                 ],
    //                 [
    //                     [1, 0],
    //                     [1, 1],
    //                 ]
    //             )
    //         )
    //     )
    // );
    ps.emitter.name = 'ps';
    // ps.addBehavior(new Noise(new ConstantValue(1), new ConstantValue(2)));
    ps.emitter.rotation.x = Math.PI;
    ps.emitter.position.z = 0;
    scene.add(ps.emitter);
    batchRenderer.addSystem(ps);
    batchRenderer.position.z = 100;
    // 预热操作
    for (let i = 0; i < 100; i++) {
        batchRenderer.update(3);
    }
    // batchRenderer.update(3);
    // batchRenderer.update(3);

    // batchRenderer.rotation.x = Math.PI / 2
    let i = 0;
    function animationMesh(delta) {
        // const range = 100
        // const x = Math.floor(camera.position.x / range) * range + range / 2
        // const y = Math.floor(camera.position.y / range) * range + range / 2
        // const z = Math.floor(camera.position.z / range) * range + range
        // batchRenderer.position.set(x, y, z)
        // batchRenderer.position.copy(camera.position)
        // batchRenderer.position.z -= 10
        batchRenderer.update(delta);
        if (i < 100) {
            // batchRenderer.update(delta);
            i++;
        }
    }

    // setTimeout(() => {
    //     ps.pause()
    //     setTimeout(() => {
    //         ps.play()
    //     }, 5000)
    // }, 5000)
    return {
        batchRenderer,
        animationMesh
    };
}


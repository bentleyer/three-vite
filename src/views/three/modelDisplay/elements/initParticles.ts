import * as THREE from 'three';
import { BatchedRenderer, IntervalValue, ConstantColor, ConstantValue, PointEmitter, ParticleSystem, FrameOverLife, PiecewiseBezier, SizeOverLife, Bezier, ColorOverLife, ColorRange, RenderMode, ConeEmitter, Noise, BatchedParticleRenderer, CircleEmitter, GridEmitter } from 'three.quarks';
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';
// import snow from '@/assets/images/textures/sprites/texture1.png';
import snow from '@/assets/images/textures/sprites/snowflake1.png'

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
    const ps = new ParticleSystem({
        duration: -1, // 无限循环
        looping: true,
        startLife: new IntervalValue(6, 10), // 雨滴生命周期
        startSpeed: new IntervalValue(20, 30), // 雨滴下落速度
        startSize: new ConstantValue(2),
        // startSize: new IntervalValue(0.5, 0.8), // 雨滴的大小
        startColor: new ColorRange(new THREE.Vector4(1, 1, 1, 0.8), new THREE.Vector4(1, 1, 1, 1)), // 白色到透明
        worldSpace: true,

        emissionOverTime: new ConstantValue(2000),
        shape: new GridEmitter({ width: 300, height: 300, column: 100, row: 100 }),
        material: new THREE.MeshBasicMaterial({
            map: texture,
            blending: THREE.AdditiveBlending,
            // blending: THREE.AdditiveBlending,
            // depthTest: false,
            transparent: true,
            // color: 'red',
            side: THREE.DoubleSide,
        }),
        renderMode: RenderMode.BillBoard,
        // startTileIndex: new ConstantValue(0),
        // uTileCount: 10,
        // vTileCount: 10,
        // renderOrder: 0,
    });
    ps.emitter.name = 'ps';
    // ps.addBehavior(new Noise(new ConstantValue(1), new ConstantValue(2)));
    ps.emitter.rotation.x = Math.PI;
    ps.emitter.position.z = 0;
    scene.add(ps.emitter);
    batchRenderer.addSystem(ps);
    // batchRenderer.rotation.x = Math.PI / 2

    function animationMesh(delta) {
        const range = 100
        const x = Math.floor(camera.position.x / range) * range + range / 2
        const y = Math.floor(camera.position.y / range) * range + range / 2
        const z = Math.floor(camera.position.z / range) * range + range / 2
        batchRenderer.position.set(x, y, z)
        // batchRenderer.position.copy(camera.position)
        // batchRenderer.position.z -= 10
        batchRenderer.update(delta);
    }
    return {
        batchRenderer,
        animationMesh
    };
}


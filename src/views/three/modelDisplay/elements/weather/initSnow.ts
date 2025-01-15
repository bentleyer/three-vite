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
import { BatchedRenderer, IntervalValue, ConstantColor, ConstantValue, PointEmitter, ParticleSystem, FrameOverLife, PiecewiseBezier, SizeOverLife, Bezier, ColorOverLife, ColorRange, RenderMode, ConeEmitter, Noise, BatchedParticleRenderer, CircleEmitter, GridEmitter, RandomColorBetweenGradient, Gradient, } from '../../modules/three.quarks.esm.js';
// import { BatchedRenderer, IntervalValue, ConstantColor, ConstantValue, PointEmitter, ParticleSystem, FrameOverLife, PiecewiseBezier, SizeOverLife, Bezier, ColorOverLife, ColorRange, RenderMode, ConeEmitter, Noise, BatchedParticleRenderer, CircleEmitter, GridEmitter, RandomColorBetweenGradient, Gradient, } from 'three.quarks';

import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js';
// import snow from '@/assets/images/textures/sprites/texture1.png';
import snow from '@/assets/images/textures/sprites/snowflake1.png';



export function initSnow({
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


    const ps = new ParticleSystem({
        duration: -1, // 无限循环
        looping: true,
        startLife: new IntervalValue(5, 7), // 雨滴生命周期
        startSpeed: new IntervalValue(10, 15), // 雨滴下落速度
        startSize: new IntervalValue(1, 2),
        // startLength: new ConstantValue(100),
        // startSize: new IntervalValue(0.5, 0.8), // 雨滴的大小
        startColor: new ColorRange(new THREE.Vector4(1, 1, 1, 0.8), new THREE.Vector4(1, 1, 1, 1),), // 白色到透明
        worldSpace: true,

        emissionOverTime: new ConstantValue(300),
        shape: new GridEmitter({ width: 200, height: 200, column: 100, row: 100 }),
        material: new THREE.MeshBasicMaterial({
            map: texture,
            blending: THREE.AdditiveBlending,
            // blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true,
            // color: 'red',
            side: THREE.DoubleSide,

        }),
        onBeforeRender(shader) {
            console.log('onBeforeRender')
            return shader
        },
        // renderMode: RenderMode.Mesh,
        // renderMode: RenderMode.StretchedBillBoard,

        renderMode: RenderMode.BillBoard,
        // startTileIndex: new ConstantValue(0),
        // uTileCount: 10,
        // vTileCount: 10,
        // renderOrder: 0,
    });

    ps.emitter.name = 'ps';
    ps.addBehavior(new Noise(new ConstantValue(1), new ConstantValue(2)));
    ps.emitter.rotation.x = Math.PI;
    ps.emitter.position.z = 0;
    scene.add(ps.emitter);
    batchRenderer.addSystem(ps);
    batchRenderer.position.z = 50;
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
    const params = {
        number: 100,
        speed: 20,
    }
    function handleClick() {
        ps.stop()
    }
    function handleClick2() {
        console.log('ps', ps)
        ps.emissionOverTime = new ConstantValue(params.number)
        ps.startSpeed = new ConstantValue(params.speed)

        ps.restart()
        for (let i = 0; i < 100; i++) {
            batchRenderer.update(3);
        }
    }

    const folder = gui.addFolder('ps')
    folder.add(params, 'number', 30, 3000).onChange((val) => {
        handleClick()
        handleClick2()
    })
    folder.add(params, 'speed', 2, 30).onChange((val) => {
        handleClick()
        handleClick2()
    })
    return {
        batchRenderer,
        animationMesh,
        handleClick,
        handleClick2
    };
}


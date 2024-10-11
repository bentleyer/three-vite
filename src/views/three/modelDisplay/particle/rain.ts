// const rain = new ParticleSystem({
//     duration: -1, // 无限循环
//     looping: true,
//     startLife: new IntervalValue(2, 3), // 雨滴生命周期
//     startSpeed: new IntervalValue(20, 30), // 雨滴下落速度
//     startSize: new IntervalValue(0.1, 0.2), // 雨滴的大小
//     startColor: new ColorRange(new THREE.Vector4(1, 1, 1, 0.8), new THREE.Vector4(1, 1, 1, 0)), // 白色到透明
//     worldSpace: true,

//     emissionOverTime: new ConstantValue(10000), // 每秒生成10000个雨滴
//     shape: new BoxEmitter({ width: 1000, height: 100, depth: 1000 }), // 1000x100x1000区域内随机生成雨滴
//     material: new THREE.MeshBasicMaterial({
//         map: rainTexture, // 使用雨滴贴图
//         blending: THREE.AdditiveBlending,
//         transparent: true,
//         side: THREE.DoubleSide,
//     }),
//     renderMode: RenderMode.BillBoard, // 粒子面向相机
// });

// // 为雨滴添加轻微的随机摆动
// rain.addBehavior(new Noise(new ConstantValue(0.5), new ConstantValue(1)));

// scene.add(rain.emitter);
// batchRenderer.addSystem(rain);
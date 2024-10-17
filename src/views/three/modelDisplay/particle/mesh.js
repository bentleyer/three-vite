        const geo = new CapsuleGeometry(1.0, 3.0);
        const mat = new MeshStandardMaterial({
            color: new Color(0.5, 0.5, 0.5),
            roughness: 0.2,
            metalness: 1.0,
            envMap: textureCube,
            envMapIntensity: 1.0,
        });

        let ps = new ParticleSystem({
            duration: 1,
            looping: true,
            prewarm: true,
            instancingGeometry: geo,
            startLife: new IntervalValue(2.0, 3.0),
            startSpeed: new ConstantValue(1),
            startSize: new ConstantValue(0.1),
            startColor: new ConstantColor(new Vector4(1, 1, 1, 1)),
            startRotation: new RandomQuatGenerator(),
            worldSpace: true,

            emissionOverTime: new ConstantValue(60),
            emissionBursts: [],

            shape: new ConeEmitter({radius: 0.1, angle: 1}),
            material: mat,
            renderMode: RenderMode.Mesh,
            startTileIndex: new ConstantValue(0),
            uTileCount: 10,
            vTileCount: 10,
            renderOrder: 0,
        });



        const ps = new ParticleSystem({
            duration: -1, // 无限循环
            looping: true,
            startLife: new IntervalValue(6, 10), // 雨滴生命周期
            startSpeed: new IntervalValue(20, 30), // 雨滴下落速度
            startSize: new IntervalValue(0.05, 0.1),
            // startLength: new ConstantValue(100),
            // startSize: new IntervalValue(0.5, 0.8), // 雨滴的大小
            // startColor: new ColorRange(new THREE.Vector4(1, 1, 1, 0.8), new THREE.Vector4(1, 1, 1, 1),), // 白色到透明
            worldSpace: true,
    
            emissionOverTime: new ConstantValue(1000),
            shape: new GridEmitter({ width: 300, height: 300, column: 100, row: 100 }),
            // material: new THREE.MeshBasicMaterial({
            //     // map: texture,
            //     blending: THREE.AdditiveBlending,
            //     // blending: THREE.AdditiveBlending,
            //     depthTest: false,
            //     transparent: true,
            //     // color: 'red',
            //     side: THREE.DoubleSide,
            // }),
            material: new THREE.ShaderMaterial({
                vertexShader: vertexShader,
                fragmentShader: fragmentShader,
                // blending: THREE.AdditiveBlending,
                depthTest: false,
                transparent: true,
                // side: THREE.DoubleSide,
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


        const m = new THREE.LineBasicMaterial({
            color: 'white',
            transparent: true,
            onBeforeCompile: shader => {
                shader.vertexShader = `            
            
            varying float colorTransition;
            varying vec3 vPos;
            ${shader.vertexShader}
          `.replace(
        '#include <begin_vertex>',
        `#include <begin_vertex>
            
            vPos = transformed;       
            colorTransition = position.y;
            `
    );
                //console.log(shader.vertexShader);

                shader.fragmentShader = `
            varying float colorTransition;
            varying vec3 vPos;
            ${shader.fragmentShader}
          `.replace(
        'vec4 diffuseColor = vec4( diffuse, opacity );',
        `
            
            float depthVal = 0.0 ;
            float actualDepth = depthVal * 20.;
            
            if(vPos.y < actualDepth) discard;
            
            float trns = 1. - colorTransition;
            
            float distVal = smoothstep(3., 0., vPos.y - actualDepth);
            vec3 col = mix(diffuse, vec3(0.9), distVal); // the closer, the whiter
            vec4 diffuseColor = vec4( mix(col, col + 0.1, pow(trns, 16.)), (opacity * (0.25 + 0.75 * distVal)) * trns );
            `
    );
                //console.log(shader.fragmentShader);
            }
        });
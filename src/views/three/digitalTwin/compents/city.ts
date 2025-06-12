import * as THREE from 'three';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

export class City {
    private fbxLoader: FBXLoader;
    public group: THREE.Group;
    private clock: THREE.Clock;
    private surroundLineMaterial: THREE.ShaderMaterial | null;
    private time: { value: number };
    private startTime: { value: number };
    private startLength: { value: number };
    private isStart: boolean;
    private list: any = [];

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

                this.modelHandlerMap[clonedData.name]?.(clonedData, groupLoader)

                groupLoader.add(clonedData)

            })
            groupLoader.rotation.x = Math.PI / 2;
            this.group = groupLoader;
            // scene.add(groupLoader)
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
    modelHandlerMap: any = {
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
              const list = applySweepShader(shader)
              this.list.push(...list);
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
}


const applySweepShader = (shader: any) => {
  let renderList = [];
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
  return renderList;
}
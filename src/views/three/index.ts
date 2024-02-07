import '@/assets/css/style.css'
import * as THREE from 'three'
// 导入轨迹控制器
import { OrbitControls } from 'three/addons'
// import {  } from 'three/addons/controls'
// 导入动画库
import gsap from 'gsap'

import * as dat from 'dat.gui'
const PI = Math.PI

// 创建场景
const scene = new THREE.Scene()

// 创建相机
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000)

camera.position.set(0, 0, 30)

// 添加物体
//创建几何体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)

const cubeMaterial = new THREE.MeshBasicMaterial({
    color: '#05d'
})

const cube = new THREE.Mesh(cubeGeometry, cubeMaterial)

// 修改发物体位置

// cube.position.set(5, 0, 0)
cube.position.x = 2
// 缩放
cube.scale.set(1, 2, 3)
// 旋转,c采用弧度
cube.rotation.set(PI / 4, 0, 0)

//几何体添加入场景
scene.add(cube)

// 初始化渲染器

const renderer = new THREE.WebGLRenderer()

// 设置渲染尺寸
renderer.setSize(window.innerWidth, window.innerHeight)

// 将webgl渲染的内容添加到body中
document.body.appendChild(renderer.domElement)

// 使用渲染器渲染
renderer.render(scene, camera)

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 设置控制器阻尼
controls.enableDamping = true

// 添加坐标辅助器, 红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.
const axesHelper = new THREE.AxesHelper(5)

scene.add(axesHelper)

// 设置时间
// const clock = new THREE.Clock()

// 设置动画

/* const animate = gsap.to(cube.position, 
    { 
        x: 5,
        duration: 5,
        ease: 'back.out(8)',
        onComplete(params) {
            console.log('onComplete', params)
        },
        onStart(params) {
            console.log('onStart', params)
        },
        // 设置重复次数
        repeat:3,
        // 倒放，往返运动
        yoyo: true,
        // 延时
        delay: 2,
    }
) */
// gsap.to(cube.rotation, { x: 2 * PI, duration: 5, repeat: -1})


window.addEventListener('dblclick', () => {
    // console.log('animate', animate)
    // 双击控制动画
    // if (animate.isActive()) {
    //     animate.pause()
    // } else {
    //     animate.resume()
    // }
    //双击进入全屏
    const fullscreenElement = document.fullscreenElement
     if (!fullscreenElement) {
        renderer.domElement.requestFullscreen()
     } else {
        // 退出全屏
        document.exitFullscreen()
     }
})

function render() {
    // time是d当前运行的时间，毫秒为单位
    // cube.position.x += 0.01
    // if (cube.position.x > 5) {
    //     cube.position.x = 0
    // }
    // let t = time / 1000 % 5
    // cube.position.x = t * 1
    // if (t  > 5) {
    //     cube.position.x = 0
    // }
    // 时钟运行总时长
    // let time = clock.getElapsedTime()
    // 两次调用时间间隔，包括getDelta， getElapsedTime调用
    // let deltaTime = clock.getDelta()
    // console.log('getElapsedTime', deltaTime)
    // cube.position.x = time * 1 % 5


    controls.update()
    // cube.rotation.x += 0.01
    renderer.render(scene, camera)
    // 下一帧渲染调用
    requestAnimationFrame(render)
}

render()

// 打印
console.log('cube mesh', cube)


// 监听画面变化，更新视图
window.addEventListener('resize', () => {
    // 重新计算画面
    // 更新摄像头
    camera.aspect = window.innerWidth / window.innerHeight
    // 更新摄像机投影矩阵
    camera.updateProjectionMatrix()
    // 更新渲染器
    renderer.setSize(window.innerWidth , window.innerHeight )
    // 设置像素比
    renderer.setPixelRatio(window.devicePixelRatio)
})

// 引入gui
const gui = new dat.GUI()
// 设置位置
gui.add(cube.position, 'x').min(0).max(20).step(0.1).name('移动x').onChange(() => {
    console.log('gui')
}).onFinishChange((value) => {
    console.log('onFinishChange', value)
})
// 设置颜色
const params = {
    color: '#0046ff',
    fn: () => {
        gsap.to(
            cube.position,
            {
                x: 8,
                duration: 5,
                yoyo: true,
                ease: 'back.out(8)',
                repeat: -1
            }
        )
    }
}
gui.addColor(params, 'color').onChange(
    (value) => {
        console.log('值修改')
        cube.material.color.set(value)
    }
)


gui.add(cube, 'visible')


//  添加文件夹

const folder = gui.addFolder('文件夹')

folder.add(cube.material, 'wireframe')

//点击触发事件
folder.add(params, 'fn').name('点击运动')
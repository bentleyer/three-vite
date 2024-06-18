import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { ref } from 'vue';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

export function useCamera({
    gui
}: {
    gui: GUI
}) {
    // 第二参数就是 长度和宽度比 默认采用浏览器  返回以像素为单位的窗口的内部宽度和高度
    // mainDom = document.getElementsByClassName('app-main')[0]
    const camera = new THREE.PerspectiveCamera(85, window.innerWidth / (window.innerHeight - 63), 0.1, 30000);
    // camera = new THREE.OrthographicCamera(-200 * window.innerWidth / (window.innerHeight - 60), 200 * window.innerWidth / (window.innerHeight - 60), 200, -200, 1, 1000)
    const angle = 0.3
    const cameraAngle = {
        angle: 0.3
    }
    camera.position.set(0, 0, 50);
    camera.up = new THREE.Vector3(0, 0, 1);
    // camera.up.applyEuler(new THREE.Euler(0, 0, angle))
    // gui.add( cameraAngle, 'angle', 0.0, 5.0, 0.1 ).onChange((value) => {
    //     camera.up = new THREE.Vector3(0, 0, 1);
    //     // camera.up.applyEuler(new THREE.Euler(0, angle, 0))
    //     // camera.up = new THREE.Vector3(1, 1, 1);

    //     camera.updateMatrixWorld()
    //     camera.updateProjectionMatrix()
    //     console.log('camera')
    // })

    // camera.up = new THREE.Vector3(0, 0, 1);
    // camera.lookAt(new THREE.Vector3(0, 0, 0))
    // camera.scale.set(10, 10, 10)
    return {
        camera
    }
}
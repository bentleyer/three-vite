

import * as logic from '@/modules/logitech/g29';

console.log('logic', logic);

window.relayOS = logic.relayOS;
window.g = logic;
window.logic = logic;


window.addEventListener('gamepadconnected', (event) => {
    console.log('Gamepad connected:', event.gamepad);

});

function updateGamepadStatus() {
    const gamepads = navigator.getGamepads();

    if (gamepads[0]) {
        const joystick = gamepads[0];

        // 获取操纵杆的轴数据和按钮状态
        const xAxis = joystick.axes[0];
        const yAxis = joystick.axes[1];
        const buttonPressed = joystick.buttons[0].pressed;

        console.log(`Joystick X: ${xAxis}, Y: ${yAxis}, Button pressed: ${buttonPressed}`, gamepads[0]);

        // 在这里处理操纵杆输入，更新UI等
    }

    // 继续监听
}


let interval = null

export function LogiPlayDirtRoadEffect() {
    let flag = true

    logic.leds([ 0, 0, 0, 0, 1 ]);
    logic.autoCenter([ 0.7, 0.3 ]);
    // interval = setInterval(() => {
    //     const effect = 0.05
    //     const multiply = flag ? 1 : -1
    //     console.log('0.5 + effect * multiply', 0.5 + effect * multiply)
    //     logic.forceConstant(0.5 + effect * multiply)
    //     flag = !flag
    // }, 1000)
    logic.forceConstant(0.5);
    logic.forceFriction(0.5);
    // logic.forceConstant(0.4)

}

export function LogiPlayCityRoadEffect() {
    logic.autoCenter([ 0.6, 0.3 ]);



    logic.autoCenter([ 0.5, 0.5 ]);
    // interval = setInterval(() => {
    //     const effect = 0.05
    //     const multiply = flag ? 1 : -1
    //     console.log('0.5 + effect * multiply', 0.5 + effect * multiply)
    //     logic.forceConstant(0.5 + effect * multiply)
    //     flag = !flag
    // }, 1000)
    logic.forceConstant(0.5);
    logic.forceFriction(0.2);
    // logic.forceConstant(0.4)

}

export function LogiClearInterval() {
    clearInterval(interval)
}

export async function useUsb () {
    logic.connect({

    });
    logic.on('all', function(val) {
        console.log('val', val);
        // if (val) {
        //     console.log('I really love it when you press my buttons.', val)
        // }
    });
    // try {
    //     // 请求用户选择HID设备
    //     const [device] = await navigator.hid.requestDevice({ filters: [] }); // 根据需要设置过滤器
    //     if (!device) {
    //         console.log('No device selected');
    //         return;
    //     }

    //     // 打开设备连接
    //     await device.open();
    //     console.log(`Connected to ${device.productName}`);

    //     // 处理输入报告
    //     device.oninputreport = (event) => {
    //         const { data, device, reportId } = event;
    //         console.log(`Received data from ${device.productName}:`, new Uint8Array(data.buffer));
    //         // 在这里处理设备发回的数据
    //     };

    //     // 发送报告到设备
    //     const reportId = 0x01; // 根据设备的文档选择合适的报告ID
    //     const data = new Uint8Array([0x00, 0x01, 0x02, 0x03]); // 示例数据
    //     await device.sendReport(reportId, data);
    //     console.log('Data sent to device');

    //     // 示例：延迟5秒后关闭设备连接
    //     setTimeout(async () => {
    //         await device.close();
    //         console.log('Device connection closed');
    //     }, 5000);

    // } catch (error) {
    //     console.error('Error:', error);
    // }

}


export function closeUse() {
    logic.disconnect();
}


import * as THREE from 'three';


import { useUsb, closeUse } from './usb';


function handleClick() {
    useUsb()
    //   state.camera.rotation.set(0, 0, baseDate.main_vehicle.phi - Math.PI / 2)
}

export {
    handleClick,
    closeUse
};


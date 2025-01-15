import * as THREE from "three";
import GUI from "three/examples/jsm/libs/lil-gui.module.min.js";

export function useFog({ scene, gui }: { gui: GUI, scene: THREE.Scene }) {

  const fog = new THREE.FogExp2(0xcccccc, 0.01);
  scene.fog = fog
  const folder = gui.addFolder("fog");
  folder.add(fog, "density", 0, 0.1, 0.001);
  return {
    fog
  };
}

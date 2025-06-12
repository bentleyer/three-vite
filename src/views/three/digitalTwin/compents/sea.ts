import * as THREE from 'three';
import { Water } from 'three/examples/jsm/objects/Water.js';

export const createWater = () => {
  const waterGeometry = new THREE.PlaneGeometry(2000, 2000);

  const water = new Water(
      waterGeometry,
      {
          textureWidth: 512,
          textureHeight: 512,
          waterNormals: new THREE.TextureLoader().load(  `https://z2586300277.github.io/3d-file-server/` +  '/images/texture/waternormals.jpg', function (texture) {
            
              texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

          }),
          sunDirection: new THREE.Vector3(0,1,1),
          sunColor: 0xffffff,
          waterColor: 0x001e0f,
          distortionScale: 3.7,
          fog: false
      }
  );
  return water;
}


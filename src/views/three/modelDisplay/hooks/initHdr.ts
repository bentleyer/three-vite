import * as THREE from 'three';
// import hdr_n_z from '@/assets/images/textures/hdr/hdr_n_z.jpg';
// import hdr_n_y from '@/assets/images/textures/hdr/hdr_n_y.jpg';
// import hdr_n_x from '@/assets/images/textures/hdr/hdr_n_x.jpg';
// import hdr_p_z from '@/assets/images/textures/hdr/hdr_p_z.jpg';
// import hdr_p_y from '@/assets/images/textures/hdr/hdr_p_y.jpg';
// import hdr_p_x from '@/assets/images/textures/hdr/hdr_p_x.jpg';

import hdr_n_z from '@/assets/images/textures/hdr2/n_z.png';
import hdr_n_y from '@/assets/images/textures/hdr2/n_y.png';
import hdr_n_x from '@/assets/images/textures/hdr2/n_x.png';
import hdr_p_z from '@/assets/images/textures/hdr2/p_z.png';
import hdr_p_y from '@/assets/images/textures/hdr2/p_y.png';
import hdr_p_x from '@/assets/images/textures/hdr2/p_x.png';

export function useHdr({
    scene,
    renderer,
    gui
}) {
    const hdrJpgEquirectangularMap = new THREE.CubeTextureLoader().load([ hdr_p_x, hdr_n_x, hdr_p_y, hdr_n_y, hdr_p_z, hdr_n_z ]);
    
    scene.environment = hdrJpgEquirectangularMap
    scene.background = hdrJpgEquirectangularMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMappingExposure = 1;
    // this.renderer.outputEncoding = THREE.sRGBEncoding;
    gui.add( renderer, 'toneMappingExposure', 0.0, 3.0, 0.01 )

}
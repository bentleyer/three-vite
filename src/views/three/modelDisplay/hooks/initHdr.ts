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

    scene.environment = hdrJpgEquirectangularMap;
    scene.background = hdrJpgEquirectangularMap;
    // scene.background = new THREE.Color('black')
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMappingExposure = 1;
    // this.renderer.outputEncoding = THREE.sRGBEncoding;
    // gui.add(renderer, 'toneMappingExposure', 0.0, 3.0, 0.01);
    const toneMappingOptions = {
        None: THREE.NoToneMapping,
        Linear: THREE.LinearToneMapping,
        Reinhard: THREE.ReinhardToneMapping,
        Cineon: THREE.CineonToneMapping,
        ACESFilmic: THREE.ACESFilmicToneMapping,
        AgX: THREE.AgXToneMapping,
        Neutral: THREE.NeutralToneMapping,
        Custom: THREE.CustomToneMapping
    };
    const params = {
        exposure: 1.0,
        toneMapping: 'Neutral',
        blurriness: 0.3,
        intensity: 1.0,
    };
    let guiExposure: any = null;
    const toneMappingFolder = gui.addFolder('tone mapping');

    toneMappingFolder.add(params, 'toneMapping', Object.keys(toneMappingOptions))

        .onChange(function () {

            updateGUI(toneMappingFolder);

            renderer.toneMapping = toneMappingOptions[params.toneMapping];

        });
    function updateGUI(folder) {

        if (guiExposure !== null) {

            guiExposure.destroy();
            guiExposure = null;

        }

        if (params.toneMapping !== 'None') {

            guiExposure = folder.add(params, 'exposure', 0, 2)

                .onChange(function () {

                    renderer.toneMappingExposure = params.exposure;

                });

        }

    }
    return {
        envMap: hdrJpgEquirectangularMap
    }
}
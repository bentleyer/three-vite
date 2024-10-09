import * as THREE from 'three';
// import hdr_n_z from '@/assets/images/textures/hdr/hdr_n_z.jpg';
// import hdr_n_y from '@/assets/images/textures/hdr/hdr_n_y.jpg';
// import hdr_n_x from '@/assets/images/textures/hdr/hdr_n_x.jpg';
// import hdr_p_z from '@/assets/images/textures/hdr/hdr_p_z.jpg';
// import hdr_p_y from '@/assets/images/textures/hdr/hdr_p_y.jpg';
// import hdr_p_x from '@/assets/images/textures/hdr/hdr_p_x.jpg';

// import hdr_n_z from '@/assets/images/textures/hdr2/n_z.png';
// import hdr_n_y from '@/assets/images/textures/hdr2/n_y.png';
// import hdr_n_x from '@/assets/images/textures/hdr2/n_x.png';
// import hdr_p_z from '@/assets/images/textures/hdr2/p_z.png';
// import hdr_p_y from '@/assets/images/textures/hdr2/p_y.png';
// import hdr_p_x from '@/assets/images/textures/hdr2/p_x.png';

// import hdr_n_z from '@/assets/images/textures/hdrs/cloudy_daylight/n_z.png';
// import hdr_n_y from '@/assets/images/textures/hdrs/cloudy_daylight/n_y.png';
// import hdr_n_x from '@/assets/images/textures/hdrs/cloudy_daylight/n_x.png';
// import hdr_p_z from '@/assets/images/textures/hdrs/cloudy_daylight/p_z.png';
// import hdr_p_y from '@/assets/images/textures/hdrs/cloudy_daylight/p_y.png';
// import hdr_p_x from '@/assets/images/textures/hdrs/cloudy_daylight/p_x.png';

// import hdr_n_z from '@/assets/images/textures/hdrs/cloudy-dusk/n_z.png';
// import hdr_n_y from '@/assets/images/textures/hdrs/cloudy-dusk/n_y.png';
// import hdr_n_x from '@/assets/images/textures/hdrs/cloudy-dusk/n_x.png';
// import hdr_p_z from '@/assets/images/textures/hdrs/cloudy-dusk/p_z.png';
// import hdr_p_y from '@/assets/images/textures/hdrs/cloudy-dusk/p_y.png';
// import hdr_p_x from '@/assets/images/textures/hdrs/cloudy-dusk/p_x.png';


import hdr_n_z from '@/assets/images/textures/hdrs/overcast-daylight/n_z.png';
import hdr_n_y from '@/assets/images/textures/hdrs/overcast-daylight/n_y.png';
import hdr_n_x from '@/assets/images/textures/hdrs/overcast-daylight/n_x.png';
import hdr_p_z from '@/assets/images/textures/hdrs/overcast-daylight/p_z.png';
import hdr_p_y from '@/assets/images/textures/hdrs/overcast-daylight/p_y.png';
import hdr_p_x from '@/assets/images/textures/hdrs/overcast-daylight/p_x.png';

// import hdr_n_z from '@/assets/images/textures/hdrs/Texture-sunny-dusk-HDRI-2048/n_z.png';
// import hdr_n_y from '@/assets/images/textures/hdrs/Texture-sunny-dusk-HDRI-2048/n_y.png';
// import hdr_n_x from '@/assets/images/textures/hdrs/Texture-sunny-dusk-HDRI-2048/n_x.png';
// import hdr_p_z from '@/assets/images/textures/hdrs/Texture-sunny-dusk-HDRI-2048/p_z.png';
// import hdr_p_y from '@/assets/images/textures/hdrs/Texture-sunny-dusk-HDRI-2048/p_y.png';
// import hdr_p_x from '@/assets/images/textures/hdrs/Texture-sunny-dusk-HDRI-2048/p_x.png';

// import hdr_n_z from '@/assets/images/textures/hdrs/overcast-dusk/nz.png';
// import hdr_n_y from '@/assets/images/textures/hdrs/overcast-dusk/ny.png';
// import hdr_n_x from '@/assets/images/textures/hdrs/overcast-dusk/nx.png';
// import hdr_p_z from '@/assets/images/textures/hdrs/overcast-dusk/pz.png';
// import hdr_p_y from '@/assets/images/textures/hdrs/overcast-dusk/py.png';
// import hdr_p_x from '@/assets/images/textures/hdrs/overcast-dusk/px.png';



export function useHdr({
    scene,
    renderer,
    gui
}) {

    const hdrJpgEquirectangularMap = new THREE.CubeTextureLoader().load([ hdr_p_x, hdr_n_x, hdr_p_y, hdr_n_y, hdr_p_z, hdr_n_z ]);
    const image1 = new THREE.TextureLoader().load(hdr_n_x);

    scene.environment = hdrJpgEquirectangularMap;
    scene.background = hdrJpgEquirectangularMap;
    // scene.background = new THREE.Color('green')
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
    updateGUI(toneMappingFolder)
    console.log('scene.background', scene, hdrJpgEquirectangularMap)
    // toneMappingFolder.add(scene.backgroundRotation, 'y', 0, 10, 0.1)

    return {
        envMap: hdrJpgEquirectangularMap
    }
}
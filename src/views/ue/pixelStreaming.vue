<template>
    <div>
    </div>
</template>
<script>
// import { PixelStreaming } from '@epicgames-ps/lib-pixelstreamingfrontend-ue5.5'
import { Config, PixelStreaming } from '@epicgames-ps/lib-pixelstreamingfrontend-ue5.5';
// import { Application, PixelStreamingApplicationStyle } from '@/modules/lib-pixelstreamingfrontend-ui-ue5.5/dist/esm/pixelstreamingfrontend-ui.js'

import { Application, PixelStreamingApplicationStyle } from '@epicgames-ps/lib-pixelstreamingfrontend-ui-ue5.5';
// import { Application, PixelStreamingApplicationStyle } from '@epicgames-ps/lib-pixelstreamingfrontend-ui-ue5.5';

const PixelStreamingApplicationStyles = new PixelStreamingApplicationStyle(); PixelStreamingApplicationStyles.applyStyleSheet(); // Example of how to set the logger level
// Logger.SetLoggerVerbosity(10);        // Create a config object
const config = new Config({ useUrlParams: true }); // Create a Native DOM delegate instance that implements the Delegate interface class
const stream = new PixelStreaming(config);
const application = new Application({ stream, onColorModeChanged: (isLightMode) => PixelStreamingApplicationStyles.setColorMode(isLightMode) });
document.body.appendChild(application.rootElement);

window.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
        console.log('addEventListener', e);
        const descriptor = {
            LoadLevel: '/Game/Maps/Level_2',
            PlayerCharacter: {
                Name: 'Shinobi',
                Skin: 'Dynasty',
            },
        };
        stream.emitUIInteraction(descriptor);
    }
});

</script>
<style>
body {
    width: 100vw;
    height: 100vh;
    min-height: -webkit-fill-available;
    font-family: 'Montserrat';
    margin: 0;
}
</style>

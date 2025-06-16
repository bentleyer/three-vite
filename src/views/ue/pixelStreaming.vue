<template>
    <div>
        
    </div>
</template>
<script setup>
// import { PixelStreaming } from '@epicgames-ps/lib-pixelstreamingfrontend-ue5.5'
import { Config, PixelStreaming } from '@epicgames-ps/lib-pixelstreamingfrontend-ue5.5';
// import { Application, PixelStreamingApplicationStyle } from '@/modules/lib-pixelstreamingfrontend-ui-ue5.5/dist/esm/pixelstreamingfrontend-ui.js'

import { Application, PixelStreamingApplicationStyle } from '@epicgames-ps/lib-pixelstreamingfrontend-ui-ue5.5';
import { ref } from 'vue';
// import { Application, PixelStreamingApplicationStyle } from '@epicgames-ps/lib-pixelstreamingfrontend-ui-ue5.5';

const PixelStreamingApplicationStyles = new PixelStreamingApplicationStyle(); PixelStreamingApplicationStyles.applyStyleSheet(); // Example of how to set the logger level
// Logger.SetLoggerVerbosity(10);        // Create a config object
const config = new Config({ useUrlParams: true, initialSettings: {
    // SignallingServerUrl: 'ws://192.168.110.25'
} }); // Create a Native DOM delegate instance that implements the Delegate interface class
const stream = new PixelStreaming(config);
// stream.setSignallingUrlBuilder(
//     () => {
//         return 'ws://192.168.110.25';
//     }
// );
const application = new Application({ stream, onColorModeChanged: (isLightMode) => PixelStreamingApplicationStyles.setColorMode(isLightMode) });
// application.hideCurrentOverlay()
document.body.appendChild(application.rootElement);
const descriptor = {
    LoadLevel: 'map1',
    params: {
        url: 'http://dev-qianxing.risenlighten.com/#/sampleRoad/cartest/?id=15070&record_id=19690&sim_record_id=564068005248555341',
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjQ2LCJvaWQiOjI1LCJuYW1lIjoi5pyx6bmP6aOeIiwiaWRlbnRpdHkiOiJub3JtYWwiLCJwZXJtaXNzaW9ucyI6W10sImlzcyI6InVzZXIiLCJzdWIiOiJMYXNWU2ltIiwiZXhwIjoxNzQ5NzExODE4LCJuYmYiOjE3NDkxMDcwMTgsImlhdCI6MTc0OTEwNzAxOCwianRpIjoiNDYifQ.-NqgRk7anwm_itH22trqgPjelJFv2J80GSbqqg-JrBY'
    }
};

window.addEventListener('keyup', (e) => {
    if (e.code === 'Space') {
        console.log('addEventListener', e);
        stream.emitUIInteraction(descriptor);

    }
});

const visibleBtn = ref(true)

function handleClick() {
    visibleBtn.value = false
    // console.log('click')
    stream.connect();
    stream.play();
    stream.addEventListener('playStream', () => {
        stream.emitUIInteraction(descriptor);
    })

}

</script>
<style>
body {
    width: 100vw;
    height: 100vh;
    min-height: -webkit-fill-available;
    font-family: 'Montserrat';
    margin: 0;
}
.pixelBtn {
    z-index: 9999;
    position: absolute;
    color: blue;
    font-size: 60px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
</style>

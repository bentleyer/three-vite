
<template>
    <div id="container">
        <!-- <Button @click="test.handleClick">test</Button> -->
    </div>
    <Button @click="test.handleClick">test</Button>
    <Button @click="test.closeUse">close</Button>
    <Button @click="usb.LogiPlayCityRoadEffect">LogiPlayCityRoadEffect</Button>
    <Button @click="usb.LogiClearInterval">LogiClearInterval</Button>

</template>
<script lang="ts" setup>
// import './index';
// import './usb'

import * as test from './index';
import * as usb from './usb';

</script>

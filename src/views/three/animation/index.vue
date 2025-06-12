
<template>
    <div class="edit" id="container">
        <input style="margin-right: 10px;" type="color" id="body-color" value="#ff0000" @input="changeBody('body', $event)"/>
        <input style="margin-right: 10px;" type="color" id="details-color" value="#ffffff" @input="changeBody('details', $event)"/>
        <input style="margin-right: 10px;" type="color" id="glass-color" value="#ffffff" @input="changeBody('glass', $event)"/>
        <button style="margin-right: 10px;" type="color" id="body-color" value="#ff0000"  @click="playAnimation('open')">开门</button>
        <button style="margin-right: 10px;" type="color" id="body-color" value="#ff0000"  @click="playAnimation('close')">关门</button>
    </div>
</template>
<script lang="ts" setup>
import './index';
import { changeBody, playAnimation } from './index';
// const bodyChange = () => {

// };
</script>


<style>
.edit{
    position: absolute;
    left: calc(50% - 100px);
    top: 20px;
}
</style>
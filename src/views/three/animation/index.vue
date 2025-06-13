
<template>
    <div class="edit" id="container">
        <input style="margin-right: 10px;" type="color" value="#25282b" @input="changeBody('border', $event)"/>
        <input style="margin-right: 10px;" type="color" value="#a3a9af" @input="changeBody('mullion', $event)"/>
        <input style="margin-right: 10px;" type="color" value="#7c8187" @input="changeBody('mid', $event)"/>
        <input style="margin-right: 10px;" type="color" value="#5f6468" @input="changeBody('left', $event)"/>
        <a-button type="primary" style="margin-right: 10px;" @click="playAnimation('open')">开门</a-button>
        <a-button type="primary" style="margin-right: 10px;" @click="playAnimation('close')">关门</a-button>
        <a-button type="primary" style="margin-right: 10px;" @click="changeColor">更改颜色</a-button>
    </div>
</template>

<script lang="ts" setup>
import './index';
import { changeBody, playAnimation, changeColor } from './index';
</script>

<style>
.edit{
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    top: 20px;
}
</style>
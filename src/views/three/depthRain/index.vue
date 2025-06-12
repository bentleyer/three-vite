
<template>
    <div class="edit" id="container">
        <div class="content">
            <input type="color" id="body-color" value="#ff0000" @input="changeBody('body', $event)"/>
            车身
        </div>
        <div class="content">
            <input type="color" id="details-color" value="#ffffff" @input="changeBody('details', $event)"/>
            轮毂
        </div>
        <div class="content">
            <input type="color" id="glass-color" value="#ffffff" @input="changeBody('glass', $event)"/>
            玻璃
        </div>
    </div>
</template>
<script lang="ts" setup>
import './index';
import { changeBody } from './index';
// const bodyChange = () => {

// };
</script>


<style>
.edit{
    position: absolute;
    left: calc(50% - 100px);
    top: 20px;
    display: flex;
    .content{
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-right: 10px;
    }
}
</style>
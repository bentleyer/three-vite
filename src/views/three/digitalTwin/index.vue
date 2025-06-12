<template>
    <div  class="screen">
        <div class="screen-title">
            数字孪生大屏展示
        </div>
        <div id="container" class="screen-context">
            <div class="left-box">
                <div class="card">
                    <div class="card-title">
                        数据看板1
                    </div>
                    <div class="card-context" style="height: 150px;">
                        <a-space size="large">
                            <a-progress type="circle" :percent="0.2" />
                        </a-space>
                        <div style="margin-left: 10px;">
                            任务通过率
                        </div>
                    </div>
                </div>
                <div class="card">
                    <div class="card-title">
                        交通流参与者
                    </div>
                    <div class="card-context"  style="width: 300px; height:200px;" id="main">
                        数据2
                    </div>
                </div>
                <div class="card">
                    <div class="card-title">
                        数据看板3
                    </div>
                    <div class="card-context" style="height: 200px; width: 300px;"  id="chart">
                        数据3
                    </div>
                </div>
            </div>
            <div class="right-box">
                <div class="card">
                    <div class="card-title">
                        数据看板1
                    </div>
                    <div class="card-context" style="height: 150px;">
                        数据2
                    </div>
                </div>
                <div class="card">
                    <div class="card-title">
                        数据看板2
                    </div>
                    <div class="card-context" style="height:200px;">
                        数据2
                    </div>
                </div>
                <div class="card">
                    <div class="card-title">
                        数据看板3
                    </div>
                    <div class="card-context" style="height: 200px;">
                        数据3
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>
<script lang="ts" setup>
import { onMounted } from 'vue';
import { start } from '.';
import * as echarts from 'echarts';
// import './index';
onMounted(() => {
    start();
    initChart();
    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.getElementById('main'));

    // 指定图表的配置项和数据
    // let option = {
    //     title: {
    //         text: ''
    //     },
    //     tooltip: {},
    //     legend: {
    //         data: [ '销量' ]
    //     },
    //     xAxis: {
    //         data: [ '衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子' ]
    //     },
    //     yAxis: {},
    //     series: [
    //         {
    //             name: '销量',
    //             type: 'bar',
    //             data: [ 5, 20, 36, 10, 10, 20 ]
    //         }
    //     ]
    // };
    let option = {
        series: [
            {
                type: 'pie',
                data: [
                    {
                        value: 335,
                        name: '行人'
                    },
                    {
                        value: 234,
                        name: '非机动车辆'
                    },
                    {
                        value: 548,
                        name: '测试车辆'
                    }
                ],
                roseType: 'area'
            }
        ]
    };

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
});

const initChart = () => {
    let myChart = echarts.init(document.getElementById('chart'));
    let option = {
        color: [ '#80FFA5', '#00DDFF', '#37A2FF', '#FF0087', '#FFBF00' ],
        title: {
            text: '',
            textStyle: {
                color: '#fff',
            },
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985',
                },
            },
        },
        legend: {
            data: [ 'Line 1', 'Line 2', 'Line 3', 'Line 4', 'Line 5' ],
        },
        textStyle: {
            fontSize: '0.2rem',
            color: '#fff',
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true,
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: [ 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun' ],
            },
        ],
        yAxis: [
            {
                type: 'value',
            },
        ],
        series: [
            {
                name: 'Line 1',
                type: 'line',
                stack: 'Total',
                smooth: true,
                lineStyle: {
                    width: 0,
                },
                showSymbol: false,
                areaStyle: {
                    opacity: 0.8,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: 'rgb(128, 255, 165)',
                        },
                        {
                            offset: 1,
                            color: 'rgb(1, 191, 236)',
                        },
                    ]),
                },
                emphasis: {
                    focus: 'series',
                },
                data: [ 140, 232, 101, 264, 90, 340, 250 ],
            },
            {
                name: 'Line 2',
                type: 'line',
                stack: 'Total',
                smooth: true,
                lineStyle: {
                    width: 0,
                },
                showSymbol: false,
                areaStyle: {
                    opacity: 0.8,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: 'rgb(0, 221, 255)',
                        },
                        {
                            offset: 1,
                            color: 'rgb(77, 119, 255)',
                        },
                    ]),
                },
                emphasis: {
                    focus: 'series',
                },
                data: [ 120, 282, 111, 234, 220, 340, 310 ],
            },
            {
                name: 'Line 3',
                type: 'line',
                stack: 'Total',
                smooth: true,
                lineStyle: {
                    width: 0,
                },
                showSymbol: false,
                areaStyle: {
                    opacity: 0.8,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: 'rgb(55, 162, 255)',
                        },
                        {
                            offset: 1,
                            color: 'rgb(116, 21, 219)',
                        },
                    ]),
                },
                emphasis: {
                    focus: 'series',
                },
                data: [ 320, 132, 201, 334, 190, 130, 220 ],
            },
            {
                name: 'Line 4',
                type: 'line',
                stack: 'Total',
                smooth: true,
                lineStyle: {
                    width: 0,
                },
                showSymbol: false,
                areaStyle: {
                    opacity: 0.8,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: 'rgb(255, 0, 135)',
                        },
                        {
                            offset: 1,
                            color: 'rgb(135, 0, 157)',
                        },
                    ]),
                },
                emphasis: {
                    focus: 'series',
                },
                data: [ 220, 402, 231, 134, 190, 230, 120 ],
            },
            {
                name: 'Line 5',
                type: 'line',
                stack: 'Total',
                smooth: true,
                lineStyle: {
                    width: 0,
                },
                showSymbol: false,
                label: {
                    show: true,
                    position: 'top',
                },
                areaStyle: {
                    opacity: 0.8,
                    color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                        {
                            offset: 0,
                            color: 'rgb(255, 191, 0)',
                        },
                        {
                            offset: 1,
                            color: 'rgb(224, 62, 76)',
                        },
                    ]),
                },
                emphasis: {
                    focus: 'series',
                },
                data: [ 220, 302, 181, 234, 210, 290, 150 ],
            },
        ],
    };
    myChart?.setOption(option);
};

</script>

<style>
.screen{
    position: relative;
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    .screen-title{
        position: absolute;
        top: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        font-family: "Arial", sans-serif;
        color: white;
        background: url(@/views/three/digitalTwin/assets/header_bg.png);
        background-repeat: no-repeat;
        background-size: 100% 60px;
        height: 60px;
        width: 100%;
        z-index: 99;
        font-size: 20px;
    }
    .screen-context{
        width: 100%;
        height: 100%;
    }
    .card{
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        margin-bottom: 10px;
        /* background-color: rgba(255, 228, 196, 0.518); */
        background: linear-gradient(#2200ff, #2200ff) left -3px top 0, linear-gradient(#2200ff, #2200ff) left -3px top -3px, linear-gradient(#2200ff, #2200ff) right -3px top 0, linear-gradient(#2200ff, #2200ff) right -3px top -3px, linear-gradient(#2200ff, #2200ff) left -3px bottom 0, linear-gradient(#2200ff, #2200ff) left -3px bottom -3px, linear-gradient(#2200ff, #2200ff) right -3px bottom 0, linear-gradient(#2200ff, #2200ff) right -3px bottom -3px;
        background-color: rgba(182, 197, 216, 0.6);
        background-repeat: no-repeat;
        background-size: 3px 16px, 16px 3px;
        border: 2px solid transparent;
        backdrop-filter: blur(2px);

        .card-title{
            display: flex;
            align-items: center;
            justify-content: flex-start;
            height: 60px;
            padding-left: 10px;
            font-size: 20px;
        }
        .card-context{
            width: 100%;
            padding-left: 15px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
    .left-box{
        position: absolute;
        left: 10px;
        top: 100px;
        width: 300px;
        height: auto;
    }
    .right-box{
        position: absolute;
        right: 10px;
        top: 100px;
        width: 300px;
        height: auto;
    }
}

.arco-progress-circle-wrapper{
    width: 100px !important;
    height: 100px !important;
}
.arco-progress-circle-text{
    color: black;
}
</style>
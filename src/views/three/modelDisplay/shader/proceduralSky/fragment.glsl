uniform vec3 sunPosition; // 太阳位置，或者太阳方向
uniform float sunIntensity; // 太阳光强度
varying vec2 vUv;
varying vec3 vPosition;
uniform sampler2D tex;  // 纹理贴图


vec3 getSkyColor(vec3 viewDir) {
    vec3 zenithColor = vec3(0.1, 0.4, 0.8); // 天顶的颜色 (例如蓝色天空)
    vec3 horizonColor = vec3(0.9, 0.5, 0.2); // 地平线的颜色 (例如夕阳)
    // Interpolate color based on the Y axis (vertical direction)
    float mixFactor = smoothstep(-0.2, 1.0, viewDir.z); // 根据方向y值做平滑插值
    vec3 skyColor = mix(horizonColor, zenithColor, mixFactor);
    return skyColor;
}

void main() {
    vec3 viewDir = normalize(vPosition);
    // vec3 viewDir = normalize(vec3(1.0, 0.5, 0.0));
    vec3 sunDirection = normalize(vec3(0.0, 0.0, 1.0));
    float sunSize = 0.001;
    float sunIntensity = 1.0;
    // 计算当前片段方向与太阳方向的点积，用来判断太阳的位置
    float sunFactor1 = dot(viewDir, sunDirection);

    // 根据距离计算太阳光影响的强度，这里简单使用一个指数衰减
    float sunFactor = (sunFactor1 + 1.0) / 2.0;

    // 根据太阳的大小使用 smoothstep 实现渐变效果，模拟太阳的大小
    float sunGlow = smoothstep(1.0 - sunSize - sunSize / 2.0, 1.0 - sunSize, sunFactor);
    // 天空颜色和太阳颜色
    // 采样贴图上的颜色
    // Sky color parameters
    vec3 skyColor = getSkyColor(viewDir);
    vec3 sunColor = vec3(1.0, 0.8, 0.4); // 太阳光颜色

    // 计算太阳的最终颜色，基于太阳光强度和渐变
    vec3 finalSunColor = sunColor * sunIntensity;

    // 将天空颜色与太阳光颜色混合
    vec3 finalColor = mix(skyColor, finalSunColor, sunGlow);

    // 输出最终颜色
    gl_FragColor = vec4(finalColor, 1.0);

}

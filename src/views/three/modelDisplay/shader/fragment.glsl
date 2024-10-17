varying vec3 vPosition;  // 顶点着色器传递的顶点位置
uniform sampler2D tex;  // 纹理贴图
varying vec2 vUv;

void main() {

    // 采样贴图上的颜色
    vec4 texColor = texture2D(tex, vUv);

    // 使用纹理颜色作为片段颜色
    gl_FragColor = texColor;
}
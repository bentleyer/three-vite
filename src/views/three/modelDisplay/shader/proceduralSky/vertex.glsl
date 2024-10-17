varying vec2 vUv;
varying vec3 vPosition;

void main() {
    mat3 rotation = mat3(
        1.0,  0.0,  0.0,
        0.0,  0.0,  1.0,
        0.0,  -1.0,  0.0
    );
    vec4 wp = vec4( rotation * position + cameraPosition , 1. ); 
    vPosition = rotation * position;
    vUv = uv; // 传递纹理坐标给片段着色器

    gl_Position = projectionMatrix * viewMatrix * wp;
}
varying vec3 vPosition;
varying vec2 vUv;

void main() {
    vUv = uv;
    vPosition = position;

    // Standard vertex transformations
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
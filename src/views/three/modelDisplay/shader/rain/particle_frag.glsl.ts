export default /* glsl */ `

#include <common>
#include <color_pars_fragment>
#include <map_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
#include <alphatest_pars_fragment>

#include <tile_pars_fragment>
#include <soft_pars_fragment>
varying vec3 vPosition;
varying vec3 vWPosition;
varying vec3 vCameraPosition;


void main() {
    float dis = distance(vWPosition.xy, vCameraPosition.xy);

    // 如果距离小于 10 米，则不显示该像素
    if (dis < 5.0) {
        discard;  // 丢弃该片段，不进行渲染
    }
    #include <clipping_planes_fragment>
    
    vec3 outgoingLight = vec3( 0.0 );
    vec4 diffuseColor = vColor;
    float opacity = 1.;

    #include <logdepthbuf_fragment>
    
    #include <tile_fragment>
    #include <alphatest_fragment>

    outgoingLight = diffuseColor.rgb;
    
    #ifdef USE_COLOR_AS_ALPHA
    opacity = diffuseColor.r;
    gl_FragColor = vec4( outgoingLight, diffuseColor.r );
    #else
    opacity = diffuseColor.a;
    gl_FragColor = vec4( outgoingLight, diffuseColor.a );
    #endif

    if(vWPosition.z < -10.0) discard;
    // 自身透明度
    float trns = (vPosition.z + 0.5);
    // 离地透明度

    float distVal = smoothstep(3., 0., vWPosition.z);
    vec3 col = mix(outgoingLight, vec3(0.9), distVal); // the closer, the whiter
    diffuseColor = vec4( mix(col, col + 0.1, pow(trns, 16.)), (1.0 * (0.25 + 0.75 * distVal)) * trns );
    gl_FragColor = vec4( diffuseColor );

    #include <soft_fragment>
    #include <tonemapping_fragment>
}
`;
/*
    gl_FragColor = vec4(vUv.x, vUv.y, 1.0, 1.0);

    #ifdef USE_MAP
    vec4 texelColor = texture2D( map, vUv);
    diffuseColor *= texelColor;
    #endif

    outgoingLight = diffuseColor.rgb;

    gl_FragColor = vec4( outgoingLight, diffuseColor.a );
*/

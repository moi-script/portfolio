import { DoubleSide, ShaderMaterial, type Texture } from 'three'

export const PAGE_WIDTH = 3
export const PAGE_HEIGHT = 4
export const PAGE_SEGMENTS = 24

const vertex = /* glsl */ `
  uniform float uTurn;      // 0 = flat right, 1 = flat left
  varying vec2 vUv;
  varying float vShade;

  void main() {
    vUv = uv;
    vec3 p = position;      // x in [0, W], spine at x = 0

    float angle = uTurn * ${Math.PI.toFixed(6)};   // rotate around spine (y-axis)
    // paper curl: mid-turn the free edge lifts; zero at the ends
    float curl = sin(uTurn * ${Math.PI.toFixed(6)}) * 0.35;
    float t = p.x / ${PAGE_WIDTH.toFixed(1)};       // 0 at spine, 1 at free edge

    // rotate the point around the spine (x=0) about the vertical axis
    float c = cos(angle);
    float s = sin(angle);
    float x = p.x * c;
    float z = -p.x * s;

    // add curl bulge in local normal direction (lift in z), strongest mid-page
    z += curl * sin(t * ${Math.PI.toFixed(6)});

    vec3 transformed = vec3(x, p.y, z);
    vShade = 0.85 + 0.15 * (1.0 - abs(uTurn - 0.5) * 2.0); // subtle sheen mid-turn
    gl_Position = projectionMatrix * modelViewMatrix * vec4(transformed, 1.0);
  }
`

const fragment = /* glsl */ `
  uniform sampler2D uMap;
  varying vec2 vUv;
  varying float vShade;
  void main() {
    vec4 tex = texture2D(uMap, vUv);
    gl_FragColor = vec4(tex.rgb * vShade, 1.0);
  }
`

export function makePageMaterial(map: Texture): ShaderMaterial {
  return new ShaderMaterial({
    uniforms: {
      uTurn: { value: 0 },
      uMap: { value: map },
    },
    vertexShader: vertex,
    fragmentShader: fragment,
    side: DoubleSide,
  })
}

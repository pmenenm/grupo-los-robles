// src/components/islands/hero3d-shaders.js
// GLSL compartido para HeroScene.jsx. Sin TypeScript (regla del proyecto, §3).

// Simplex noise 3D clásico (Ashima Arts / Ian McEwan) — dominio público, usado como
// utilidad de ruido barata para el desplazamiento orgánico de la esfera y las partículas.
export const NOISE_GLSL = `
vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 mod289(vec4 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x){ return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
            i.z + vec4(0.0, i1.z, i2.z, 1.0))
          + i.y + vec4(0.0, i1.y, i2.y, 1.0))
          + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

// Uniforms inyectados en el vertex shader de la esfera (vía onBeforeCompile, ver DistortedSphere).
// uMouse3D: punto del cursor proyectado en espacio local del objeto.
// uMouseStrength: energía de la interacción — sube con la velocidad del mouse, decae solo.
// uRadius: radio de influencia del "empujón" alrededor del cursor.
// uActivation: 0 = reposo (solo respiración de ruido), 1 = activo (mouse + scroll a pleno).
export const SPHERE_UNIFORMS_GLSL = `
uniform float uTime;
uniform vec3 uMouse3D;
uniform float uMouseStrength;
uniform float uRadius;
uniform float uActivation;
uniform float uScroll;
`;

// Se inyecta en #include <begin_vertex> — después de esto, `transformed` sigue el pipeline
// normal de MeshStandardMaterial/MeshPhysicalMaterial (recibe luces reales de la escena).
export const SPHERE_DISPLACEMENT_GLSL = `
  float ambientNoise = snoise(position * 1.6 + uTime * 0.12) * 0.22;

  float distToMouse = distance(position, uMouse3D);
  float falloff = smoothstep(uRadius, 0.0, distToMouse);
  vec3 repel = normalize(position - uMouse3D + 0.0001) * falloff * uMouseStrength;

  float breathing = mix(0.06, 1.0, uActivation);
  transformed += normal * (ambientNoise * breathing) + repel * uActivation;
  transformed += normal * uScroll * 0.35;
`;

// ── Partículas: shader propio completo (no PBR, aditivo) ──
export const PARTICLES_VERTEX_GLSL = `
  ${NOISE_GLSL}

  uniform float uTime;
  uniform vec3 uMouse3D;
  uniform float uMouseStrength;
  uniform float uRadius;
  attribute float aPhase;
  attribute float aSize;
  varying float vAlpha;

  void main() {
    vec3 pos = position;

    // Flotación orgánica: cada partícula ondula en su propia fase/velocidad
    pos.y += sin(uTime * 0.4 + aPhase * 6.28) * 0.18;
    pos.x += cos(uTime * 0.3 + aPhase * 6.28) * 0.12;

    // Repulsión del mouse — mismo principio que la esfera: fuerza radial con caída suave
    float distToMouse = distance(pos, uMouse3D);
    float falloff = smoothstep(uRadius * 1.6, 0.0, distToMouse);
    pos += normalize(pos - uMouse3D + 0.0001) * falloff * uMouseStrength * 1.8;

    vAlpha = 0.35 + falloff * 0.65;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = aSize * (200.0 / -mvPosition.z);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

export const PARTICLES_FRAGMENT_GLSL = `
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    float glow = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(uColor, glow * vAlpha);
  }
`;

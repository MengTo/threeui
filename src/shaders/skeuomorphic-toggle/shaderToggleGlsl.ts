export const SHADER_TOGGLE_VERTEX = `
attribute vec2 aPosition;
void main() {
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

/* One fragment shader draws the whole control. Every edge is antialiased from
   the screen-space derivative of its own distance field rather than a fixed
   smoothstep, so the borders stay one pixel crisp at any size — a constant
   width blurs the rim as soon as the control is scaled up. */
const SHADER_TOGGLE_FRAGMENT_BODY = `
precision highp float;

uniform vec2 uRes;
uniform float uUnit;
uniform float uTime;
uniform float uOn;
uniform float uProgress;
uniform float uMode;
uniform vec2 uPointer;

const float R = 1.0;
const float L = 1.35;
const float TH = 0.78;
const float PI = 3.14159265359;

float hash11(float n) {
  return fract(sin(n * 127.1) * 43758.5453123);
}

vec2 hash21(float n) {
  return fract(sin(vec2(n * 127.1, n * 311.7)) * 43758.5453123);
}

/* Screen-space hash. Feeding raw gl_FragCoord into a sin-based hash runs out of
   float precision at 1080p and bands into visible diagonal wedges, so wrap the
   coordinate into a small range first. */
float hash22(vec2 co) {
  return fract(sin(dot(mod(co, 512.0), vec2(12.9898, 78.233))) * 43758.5453123);
}

float valueNoise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash11(i.x + i.y * 57.0);
  float b = hash11(i.x + 1.0 + i.y * 57.0);
  float c = hash11(i.x + (i.y + 1.0) * 57.0);
  float d = hash11(i.x + 1.0 + (i.y + 1.0) * 57.0);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 5; i++) {
    value += amplitude * valueNoise(p);
    p = p * 2.03 + 11.3;
    amplitude *= 0.5;
  }
  return value;
}

/* Ridged noise reads as filament rather than cloud — it is what gives the
   trough its threaded, fibrous look instead of a soft blur. */
float ridged(vec2 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int i = 0; i < 4; i++) {
    float n = 1.0 - abs(valueNoise(p) * 2.0 - 1.0);
    value += amplitude * n * n;
    p = p * 2.11 + 7.7;
    amplitude *= 0.5;
  }
  return value;
}

/* Two rounds of domain warping. One fbm on its own drifts; warping it by
   another turns the flow into curling filaments that read as real motion. */
vec2 warp(vec2 p, float t) {
  vec2 q = vec2(fbm(p + vec2(0.0, t * 0.12)), fbm(p + vec2(5.2, 1.3) - t * 0.09));
  vec2 r = vec2(fbm(p + 3.4 * q + vec2(1.7, 9.2)), fbm(p + 3.4 * q + vec2(8.3, 2.8)));
  return p + 0.42 * r;
}

float sdCapsule(vec2 p, float halfLength, float radius) {
  p.x -= clamp(p.x, -halfLength, halfLength);
  return length(p) - radius;
}

float fw(float d) {
#ifdef HAS_DERIVATIVES
  return max(fwidth(d), 1e-5);
#else
  return 1.6 / uUnit;
#endif
}

/* Filled side of a distance field, one pixel of coverage at the boundary. */
float fill(float d) {
  float w = fw(d) * 0.72;
  return smoothstep(w, -w, d);
}

/* A stroke centred on the isoline, measured in control-space units. */
float stroke(float d, float halfWidth) {
  float w = fw(d) * 0.8;
  return smoothstep(halfWidth + w, halfWidth - w, abs(d));
}

float capsuleHalo(vec2 p, float spread) {
  return exp(-max(0.0, sdCapsule(p, L, R)) * spread);
}

void main() {
  vec2 frag = gl_FragCoord.xy - 0.5 * uRes;
  vec2 p = frag / uUnit;
  vec2 screen = frag / max(uRes.x, uRes.y);

  float dark = uMode;
  float energy = mix(0.16, 1.0, uOn);

  vec3 accent = mix(vec3(0.09, 0.32, 0.95), vec3(0.24, 0.55, 1.0), dark);
  vec3 accentWarm = mix(vec3(0.55, 0.18, 0.86), vec3(0.62, 0.32, 1.0), dark);
  vec3 accentCool = mix(vec3(0.06, 0.62, 0.92), vec3(0.36, 0.86, 1.0), dark);
  vec3 sparkColor = mix(vec3(0.15, 0.62, 0.98), vec3(0.55, 0.86, 1.0), dark);
  vec3 dormant = mix(vec3(0.66, 0.69, 0.75), vec3(0.16, 0.19, 0.25), dark);

  /* Stage. */
  vec3 skyTop = mix(vec3(0.965, 0.972, 0.984), vec3(0.055, 0.062, 0.086), dark);
  vec3 skyBottom = mix(vec3(0.886, 0.906, 0.941), vec3(0.016, 0.019, 0.031), dark);
  vec3 color = mix(skyBottom, skyTop, smoothstep(-0.55, 0.55, screen.y));

  /* A faint dot lattice keeps the empty stage from reading as flat paint. */
  vec2 lattice = fract(p * 1.8) - 0.5;
  float dots = smoothstep(0.09, 0.02, length(lattice));
  color += dots * mix(-0.05, 0.05, dark) * mix(vec3(0.32, 0.4, 0.62), accent, dark);

  /* Bloom, one exponential per channel for a touch of chromatic spread. */
  float haloR = capsuleHalo(p * 0.985, 1.35);
  float haloG = capsuleHalo(p, 1.5);
  float haloB = capsuleHalo(p * 1.015, 1.65);
  vec3 halo = vec3(haloR, haloG, haloB) * mix(accent, accentWarm, 0.35);
  color += halo * energy * mix(0.045, 0.3, dark);

  float d = sdCapsule(p, L, R);
  float inside = fill(d);

  /* ---- Trough interior ---------------------------------------------- */
  vec2 flowP = vec2(p.x * 0.72 - uTime * 0.3, p.y * 1.25);
  vec2 w = warp(flowP, uTime);
  float plasma = fbm(w * 1.5);
  float threads = ridged(vec2(w.x * 2.2, w.y * 3.4 + uTime * 0.16));

  /* Brushed striations along the travel axis. */
  float brushed = 0.5 + 0.5 * sin(p.y * 74.0 + fbm(w * 3.0) * 9.0);
  brushed *= 0.5 + 0.5 * valueNoise(vec2(p.x * 26.0, p.y * 4.0));

  /* Interference bands, following the warp so they curve with the flow. */
  float caustic = pow(abs(sin(w.x * 3.6 - uTime * 1.5 + threads * 2.4)), 9.0);

  /* A micro lattice the light catches, crisp because it is derivative-AA'd. */
  vec2 cell = fract(p * vec2(22.0, 19.0)) - 0.5;
  float micro = stroke(length(cell) - 0.2, 0.035);

  /* A travelling charge front. */
  float streak = pow(max(0.0, sin(p.x * 2.1 - uTime * 2.6 + plasma * 3.4)), 7.0);

  vec3 interior = mix(dormant, mix(accent, accentWarm, plasma * 0.42), uOn);
  interior *= mix(0.24, 0.86, plasma) * energy;
  interior += mix(accentCool, vec3(1.0), 0.25) * threads * threads * uOn * 0.15;
  interior += mix(accent, vec3(1.0), 0.35) * caustic * uOn * 0.2;
  interior += accentCool * micro * mix(0.018, 0.05, dark) * energy;
  interior *= 0.82 + 0.18 * brushed;
  interior += mix(accent, vec3(1.0), 0.35) * streak * uOn * 0.34;

  /* Powered down still has to read as a slot, not a hole — on a light stage an
     unlit trough at the on-state's exposure goes nearly black. */
  vec3 restColor = dormant * mix(0.6, 0.2, dark) * (0.72 + 0.4 * plasma);
  restColor += accentCool * micro * mix(0.02, 0.045, dark);
  restColor *= 0.88 + 0.12 * brushed;
  interior = mix(restColor, interior, uOn);

  /* Inner shading: the capsule is still a physical trough. */
  float trough = smoothstep(-R, R * 0.35, p.y);
  interior *= mix(0.42, 1.2, trough);

  color = mix(color, interior, inside);

  /* ---- Borders ------------------------------------------------------- */
  /* A hairline seat just outside the wall reads as the shadow the rim casts. */
  color *= 1.0 - stroke(d - 0.028, 0.026) * mix(0.16, 0.3, dark);
  /* The lit rim itself: one crisp stroke on the boundary. */
  vec3 rimColor = mix(accent, vec3(1.0), mix(0.5, 0.28, dark));
  color += rimColor * stroke(d, 0.013) * mix(0.34, 0.66, dark) * energy;
  /* An inner bevel a hair inside the wall, brightest along the top shoulder. */
  float bevel = stroke(d + 0.062, 0.02) * smoothstep(-0.35, 0.85, p.y / R);
  color += mix(accentCool, vec3(1.0), 0.5) * bevel * mix(0.2, 0.34, dark) * energy;
  /* Soft glow bleeding inward from the wall. */
  color += rimColor * exp(-abs(d) * 18.0) * mix(0.06, 0.13, dark) * energy * inside;

  /* ---- Sparks -------------------------------------------------------- */
  /* A dense fine mist rather than a handful of blobs. Phase and lane come from
     independent hashes — sharing one makes the field collapse into a visible
     lattice — and each mote carries its own size, speed and brightness so the
     drift never reads as one animated sheet. */
  vec3 sparks = vec3(0.0);
  for (int i = 0; i < 64; i++) {
    float fi = float(i);
    vec2 h = hash21(fi + 3.7);
    float phase = hash11(fi * 7.13 + 1.7);
    float weight = hash11(fi * 3.31 + 5.9);
    float life = fract(uTime * (0.2 + h.x * 0.42) * mix(0.35, 1.0, uOn) + phase);
    float x = mix(-L - R * 0.55, L + R * 0.55, life);
    float y = (h.y - 0.5) * 1.52 * (0.32 + 0.68 * sin(life * PI)) + sin(life * 6.4 + fi) * 0.06;
    vec2 sp = p - vec2(x, y);
    /* Stretch along travel so each one carries a comet tail. */
    sp.x *= 0.45;
    float fade = sin(life * PI);
    /* Tight kernels: the big ones were reading as glowing pills. */
    float grain = 1500.0 + 5200.0 * weight;
    float core = exp(-dot(sp, sp) * grain * 3.0);
    float tail = exp(-dot(sp, sp) * grain);
    float brightness = 0.35 + 0.65 * weight;
    sparks += mix(sparkColor, vec3(1.0), 0.6 * fade) * (tail * 0.55 + core) * fade * brightness;
  }
  color += sparks * mix(0.3, 1.15, uOn) * mix(0.85, 1.15, dark) * inside;

  /* ---- Thumb --------------------------------------------------------- */
  float thumbX = mix(-L, L, uProgress);
  vec2 tp = p - vec2(thumbX, 0.0);
  float td = length(tp) - TH;
  float thumbIn = fill(td);
  vec2 disc = tp / TH;
  float discLength = min(1.0, length(disc));
  vec3 normal = normalize(vec3(disc, sqrt(max(1e-4, 1.0 - discLength * discLength))));

  /* Micro relief on the shell, sampled in the sphere's own frame so it wraps
     with the surface instead of sliding across it. */
  vec2 shellUv = vec2(atan(normal.y, normal.x) * 1.6, normal.z * 2.4);
  float relief = valueNoise(shellUv * 15.0) * 0.6 + valueNoise(shellUv * 41.0) * 0.4;
  vec3 bumped = normalize(normal + vec3((relief - 0.5) * 0.035, (relief - 0.5) * 0.035, 0.0));

  vec3 light = normalize(vec3(-0.42 + uPointer.x * 0.35, 0.58 + uPointer.y * 0.35, 0.8));
  /* A cool fill from the opposite side, and a rim from behind: one lamp on a
     sphere gives a flat coin, three give it form. */
  vec3 fillDir = normalize(vec3(0.62, -0.28, 0.55));
  vec3 rimDir = normalize(vec3(0.34, 0.5, -0.72));
  float diffuse = max(0.0, dot(bumped, light));
  float specular = pow(max(0.0, dot(reflect(-light, bumped), vec3(0.0, 0.0, 1.0))), 120.0);
  /* A second, stretched lobe: the brushed anisotropic streak. */
  vec3 stretched = normalize(vec3(bumped.x * 0.28, bumped.y, bumped.z));
  float sheen = pow(max(0.0, dot(reflect(-light, stretched), vec3(0.0, 0.0, 1.0))), 16.0);
  float fillTerm = max(0.0, dot(bumped, fillDir));
  float rimTerm = pow(max(0.0, dot(bumped, rimDir)), 2.2) * pow(1.0 - max(0.0, normal.z), 1.6);
  float fresnel = pow(1.0 - max(0.0, normal.z), 2.6);

  vec3 thumbBase = mix(vec3(0.96, 0.97, 0.99), vec3(0.78, 0.82, 0.9), dark);
  vec3 thumbColor = thumbBase * (0.17 + 0.86 * diffuse * diffuse);
  thumbColor += thumbBase * mix(accentCool, vec3(1.0), 0.35) * fillTerm * 0.3;
  thumbColor += mix(accentCool, vec3(1.0), 0.5) * rimTerm * mix(0.3, 0.55, dark);
  thumbColor *= 0.975 + 0.05 * relief;
  thumbColor += mix(accent, accentWarm, 0.4) * fresnel * mix(0.34, 0.6, dark) * energy;
  thumbColor += vec3(1.0) * specular * 1.6;
  thumbColor += mix(vec3(1.0), accentCool, 0.35) * sheen * 0.13;
  thumbColor += mix(accent, accentWarm, 0.6) * uOn * 0.1;
  /* Roll the highlights off instead of letting them clip — a clipped sphere
     reads as a white sticker rather than a lit object. */
  /* Bounce off the lit trough onto the underside. */
  thumbColor += accentCool * smoothstep(0.2, -0.9, disc.y) * uOn * mix(0.1, 0.16, dark);
  thumbColor = thumbColor / (1.0 + thumbColor * 0.22);

  /* Contact shadow under the thumb. */
  float contact = exp(-dot(tp * vec2(0.8, 1.6), tp * vec2(0.8, 1.6)) * 1.9);
  color *= 1.0 - contact * 0.42 * inside;

  color = mix(color, thumbColor, thumbIn);
  /* Crisp terminator ring so the thumb keeps a defined edge. */
  color += mix(vec3(1.0), accentCool, 0.4) * stroke(td, 0.01) * mix(0.15, 0.26, dark);
  color += mix(accent, accentWarm, 0.35) * exp(-max(0.0, td) * 7.0) * uOn * 0.22 * inside;

  /* ---- Grade --------------------------------------------------------- */
  color *= mix(0.86, 1.0, smoothstep(1.0, 0.2, length(screen * vec2(1.0, 1.25))));
  float grain = hash22(gl_FragCoord.xy + vec2(mod(uTime * 61.0, 512.0), mod(uTime * 37.0, 512.0)));
  color += (grain - 0.5) * mix(0.014, 0.03, dark);

  gl_FragColor = vec4(max(color, 0.0), 1.0);
}
`;

export function buildShaderToggleFragment(hasDerivatives: boolean) {
  /* The extension pragma has to lead the source, before any other directive. */
  const prefix = hasDerivatives
    ? "#extension GL_OES_standard_derivatives : enable\n#define HAS_DERIVATIVES\n"
    : "";
  return prefix + SHADER_TOGGLE_FRAGMENT_BODY;
}

import * as THREE from "three128";

export type GlassParticleOptions = {
  count: number;
  thickness: number;
  dispersion: number;
  specular: number;
  rim: number;
  drift: number;
};

export const GLASS_PARTICLE_DEFAULTS: GlassParticleOptions = {
  count: 22,
  thickness: 0.115,
  dispersion: 0.05,
  specular: 0.85,
  rim: 0.5,
  drift: 1,
};

const MAX_COUNT = 34;

const QUAD_VERTEX = "void main(){ gl_Position = vec4(position.xy, 0.0, 1.0); }";

/* the backdrop is drawn twice each frame: once into the refraction target the
   glass samples, once straight to the canvas — one cheap fullscreen pass is far
   less work than a second material that blits the target back */
const BACKDROP_FRAGMENT = `precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform vec2 uPointer;

vec3 bloom(vec2 uv, vec2 centre, float radius, vec3 tint){
  float aspect = uRes.x / max(uRes.y, 1.0);
  float d = length((uv - centre) * vec2(aspect, 1.0));
  float falloff = smoothstep(radius, 0.0, d);
  return tint * falloff * falloff;
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float t = uTime * 0.17;
  /* the base tone matters more than the blooms: refraction samples the whole
     frame, so a backdrop with black regions makes beads read as dark holes */
  vec3 col = vec3(0.085, 0.095, 0.125);
  col += mix(vec3(0.0), vec3(0.05, 0.06, 0.10), uv.y);
  col += bloom(uv, vec2(0.23 + 0.055 * sin(t * 0.9), 0.76 + 0.045 * cos(t * 0.7)), 0.86, vec3(0.24, 0.42, 0.96)) * 0.92;
  col += bloom(uv, vec2(0.82 + 0.05 * cos(t * 0.8), 0.34 + 0.055 * sin(t * 1.1)), 0.80, vec3(0.66, 0.30, 0.88)) * 0.80;
  col += bloom(uv, vec2(0.50 + 0.07 * sin(t * 0.6 + 1.7), 0.10 + 0.04 * cos(t * 0.9)), 0.74, vec3(0.14, 0.68, 0.70)) * 0.60;
  col += bloom(uv, vec2(0.10 + 0.04 * cos(t * 1.2), 0.16 + 0.05 * sin(t * 0.8)), 0.58, vec3(0.98, 0.60, 0.40)) * 0.34;
  col += bloom(uv, vec2(0.5 + uPointer.x * 0.20, 0.56 + uPointer.y * 0.16), 0.46, vec3(0.74, 0.78, 0.96)) * 0.30;
  float vignette = smoothstep(1.34, 0.30, length((uv - 0.5) * vec2(1.05, 1.0)));
  col *= mix(0.62, 1.0, vignette);
  gl_FragColor = vec4(col, 1.0);
}`;

const GLASS_VERTEX = `varying vec3 vNormalView;
varying vec3 vViewPos;
varying vec4 vScreen;

void main(){
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vNormalView = normalize(normalMatrix * normal);
  vViewPos = mvPosition.xyz;
  vScreen = projectionMatrix * mvPosition;
  gl_Position = vScreen;
}`;

/* screen-space refraction: the surface normal bends the view ray, the offset is
   applied to this fragment's own screen coordinate, and the three channels use
   three slightly different indices so the bead edges split into colour the way
   real glass does */
const GLASS_FRAGMENT = `precision highp float;
uniform sampler2D uBackdrop;
uniform float uThickness;
uniform float uDispersion;
uniform float uSpecular;
uniform float uRim;
uniform vec3 uTint;
uniform vec3 uLight;
varying vec3 vNormalView;
varying vec3 vViewPos;
varying vec4 vScreen;

void main(){
  vec2 screenUV = (vScreen.xy / vScreen.w) * 0.5 + 0.5;
  vec3 N = normalize(vNormalView);
  vec3 V = normalize(-vViewPos);
  vec3 I = -V;
  float fresnel = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 3.4);

  vec2 offsetR = refract(I, N, 1.0 / (1.44 - uDispersion)).xy * uThickness;
  vec2 offsetG = refract(I, N, 1.0 / 1.44).xy * uThickness;
  vec2 offsetB = refract(I, N, 1.0 / (1.44 + uDispersion)).xy * uThickness;

  vec3 col;
  col.r = texture2D(uBackdrop, clamp(screenUV + offsetR, 0.002, 0.998)).r;
  col.g = texture2D(uBackdrop, clamp(screenUV + offsetG, 0.002, 0.998)).g;
  col.b = texture2D(uBackdrop, clamp(screenUV + offsetB, 0.002, 0.998)).b;
  col *= uTint;

  vec3 L = normalize(uLight);
  vec3 H = normalize(L + V);
  float ndoth = max(dot(N, H), 0.0);
  col += pow(ndoth, 150.0) * uSpecular;
  col += pow(ndoth, 16.0) * uSpecular * 0.11;
  /* a second, dimmer key from below keeps the underside of every bead alive */
  vec3 H2 = normalize(normalize(vec3(0.55, -0.7, 0.45)) + V);
  col += pow(max(dot(N, H2), 0.0), 44.0) * uSpecular * 0.22;
  col += fresnel * uRim * vec3(0.86, 0.90, 1.0);

  /* aerial perspective: the small far beads dissolve into the plate they float
     over instead of reading as hard specks */
  float haze = smoothstep(7.4, 11.4, -vViewPos.z);
  col = mix(col, texture2D(uBackdrop, screenUV).rgb, haze * 0.7);
  gl_FragColor = vec4(col, 1.0);
}`;

type Bead = {
  mesh: THREE.Mesh;
  material: THREE.ShaderMaterial;
  origin: THREE.Vector3;
  bob: number;
  phase: number;
  spin: THREE.Vector3;
  radius: number;
};

/* one deterministic sequence so the arrangement is identical on every load and a
   recorded preview matches what a visitor sees */
function seeded(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

export function createGlassParticleField(canvas: HTMLCanvasElement, getOptions: () => GlassParticleOptions) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x0a0b0f, 1);

  const backdropScene = new THREE.Scene();
  const backdropCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const backdropUniforms = {
    uRes: { value: new THREE.Vector2(1, 1) },
    uTime: { value: 0 },
    uPointer: { value: new THREE.Vector2() },
  };
  const backdropMaterial = new THREE.ShaderMaterial({
    uniforms: backdropUniforms,
    vertexShader: QUAD_VERTEX,
    fragmentShader: BACKDROP_FRAGMENT,
    depthTest: false,
    depthWrite: false,
  });
  const backdropGeometry = new THREE.PlaneGeometry(2, 2);
  backdropScene.add(new THREE.Mesh(backdropGeometry, backdropMaterial));

  const target = new THREE.WebGLRenderTarget(2, 2, {
    minFilter: THREE.LinearFilter,
    magFilter: THREE.LinearFilter,
    format: THREE.RGBAFormat,
  });

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0, 7.4);
  const group = new THREE.Group();
  scene.add(group);

  const geometries = [
    new THREE.SphereGeometry(1, 44, 30),
    new THREE.IcosahedronGeometry(1, 1),
    new THREE.TorusGeometry(0.78, 0.30, 22, 56),
  ];
  const tints = [
    new THREE.Color(1.04, 1.0, 1.02),
    new THREE.Color(0.97, 1.0, 1.06),
    new THREE.Color(1.05, 0.99, 0.97),
  ];

  const random = seeded(20260826);
  const beads: Bead[] = [];
  for (let index = 0; index < MAX_COUNT; index += 1) {
    /* the first third are the large hero beads, the remainder are the fine dust
       that reads as depth behind them */
    const hero = index < 8;
    const radius = hero ? 0.40 + random() * 0.34 : 0.09 + random() * 0.18;
    /* spheres carry the look; the gem and the ring appear once each among the
       hero beads so the field has silhouette variety without reading as props */
    const geometry = geometries[hero ? (index === 3 ? 1 : index === 6 ? 2 : 0) : 0];
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uBackdrop: { value: target.texture },
        uThickness: { value: 0.1 },
        uDispersion: { value: 0.05 },
        uSpecular: { value: 0.85 },
        uRim: { value: 0.5 },
        uTint: { value: tints[index % tints.length] },
        uLight: { value: new THREE.Vector3(-0.45, 0.86, 0.62) },
      },
      vertexShader: GLASS_VERTEX,
      fragmentShader: GLASS_FRAGMENT,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.setScalar(radius);
    /* hero beads are rejection-sampled against the ones already placed: two
       large spheres that intersect read as one lumpy blob rather than as glass */
    const origin = new THREE.Vector3();
    for (let attempt = 0; attempt < 48; attempt += 1) {
      origin.set(
        (random() - 0.5) * 8.4,
        (random() - 0.5) * 5.0 - 0.25,
        hero ? -1.4 + random() * 2.6 : -3.6 + random() * 2.4,
      );
      if (!hero) break;
      const clear = beads.every((placed) => {
        const dx = placed.origin.x - origin.x;
        const dy = placed.origin.y - origin.y;
        return Math.hypot(dx, dy) > (placed.radius + radius) * 1.25 + 0.3;
      });
      if (clear) break;
    }
    mesh.position.copy(origin);
    mesh.rotation.set(random() * 6.28, random() * 6.28, random() * 6.28);
    group.add(mesh);
    beads.push({
      mesh,
      material,
      origin,
      radius,
      bob: 0.14 + random() * 0.34,
      phase: random() * 6.28,
      spin: new THREE.Vector3((random() - 0.5) * 0.28, (random() - 0.5) * 0.34, (random() - 0.5) * 0.2),
    });
  }

  const pointer = new THREE.Vector2();
  const pointerTarget = new THREE.Vector2();
  let width = 1;
  let height = 1;
  let clock = 0;
  let lastAt = performance.now();

  const resize = (cssWidth: number, cssHeight: number) => {
    const nextWidth = Math.max(1, Math.round(cssWidth));
    const nextHeight = Math.max(1, Math.round(cssHeight));
    if (nextWidth === width && nextHeight === height) return;
    width = nextWidth;
    height = nextHeight;
    const ratio = Math.min(window.devicePixelRatio, 2);
    renderer.setSize(width, height, false);
    target.setSize(Math.round(width * ratio), Math.round(height * ratio));
    backdropUniforms.uRes.value.set(width * ratio, height * ratio);
    camera.aspect = width / height;
    /* a wide catalog frame should widen the field of view rather than crop it, so
       the bead spread stays the same composition at every aspect */
    camera.fov = camera.aspect > 1 ? 42 : 42 / Math.max(0.62, camera.aspect);
    camera.updateProjectionMatrix();
    for (const bead of beads) bead.material.uniforms.uBackdrop.value = target.texture;
  };

  const setPointer = (x: number, y: number) => pointerTarget.set(x, y);

  const render = (now = performance.now()) => {
    const options = getOptions();
    clock += Math.min(96, now - lastAt) * 0.001;
    lastAt = now;
    pointer.lerp(pointerTarget, 0.045);

    const visible = Math.max(4, Math.min(MAX_COUNT, Math.round(options.count)));
    for (let index = 0; index < beads.length; index += 1) {
      const bead = beads[index];
      bead.mesh.visible = index < visible;
      if (!bead.mesh.visible) continue;
      const uniforms = bead.material.uniforms;
      uniforms.uThickness.value = options.thickness * (0.55 + bead.radius * 0.9);
      uniforms.uDispersion.value = options.dispersion;
      uniforms.uSpecular.value = options.specular;
      uniforms.uRim.value = options.rim;
      const t = clock * options.drift;
      bead.mesh.position.set(
        bead.origin.x + Math.sin(t * 0.21 + bead.phase) * bead.bob * 0.9,
        bead.origin.y + Math.cos(t * 0.27 + bead.phase * 1.3) * bead.bob,
        bead.origin.z + Math.sin(t * 0.17 + bead.phase * 0.7) * bead.bob * 0.5,
      );
      bead.mesh.rotation.x += bead.spin.x * 0.0075 * options.drift;
      bead.mesh.rotation.y += bead.spin.y * 0.0075 * options.drift;
      bead.mesh.rotation.z += bead.spin.z * 0.0075 * options.drift;
    }

    group.rotation.y = pointer.x * 0.14;
    group.rotation.x = -pointer.y * 0.1;
    group.position.x = pointer.x * 0.28;
    group.position.y = pointer.y * 0.2;

    backdropUniforms.uTime.value = clock;
    backdropUniforms.uPointer.value.set(pointer.x, pointer.y);

    renderer.setRenderTarget(target);
    renderer.render(backdropScene, backdropCamera);
    renderer.setRenderTarget(null);
    renderer.render(backdropScene, backdropCamera);
    renderer.autoClear = false;
    renderer.render(scene, camera);
    renderer.autoClear = true;
  };

  const dispose = () => {
    for (const bead of beads) bead.material.dispose();
    for (const geometry of geometries) geometry.dispose();
    backdropGeometry.dispose();
    backdropMaterial.dispose();
    target.dispose();
    renderer.dispose();
  };

  return { resize, render, setPointer, dispose };
}

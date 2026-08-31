import * as THREE from "three";

import type { ToggleMode } from "./toggleMode";

export type GlassToggleSceneOptions = {
  canvas: HTMLCanvasElement;
  mode: ToggleMode;
  speed: number;
  on: boolean;
};

export type GlassToggleScene = {
  setMode: (mode: ToggleMode) => void;
  setSpeed: (speed: number) => void;
  setSize: (size: number) => void;
  setOn: (on: boolean) => void;
  setPointer: (x: number, y: number) => void;
  resize: (width: number, height: number) => void;
  /* Pixel footprint of the rendered pill, so the DOM control can sit on it. */
  measureSwitch: () => { width: number; height: number };
  dispose: () => void;
};

type Palette = {
  /* The stage is a flat sweep, so it carries no light of its own. */
  backdrop: number;
  backdropFloor: number;
  shadow: number;
  glass: number;
  attenuationOff: number;
  attenuationOn: number;
  knob: number;
  knobTransmission: number;
  knobEnv: number;
  shellEmissive: number;
  filamentOn: number;
  filamentOff: number;
  key: number;
  keyIntensity: number;
  ambient: number;
  /* Studio built into the environment map rather than the backdrop. */
  envSkyTop: number;
  envSkyBottom: number;
  envFloor: number;
  envSoftbox: number;
  envIntensity: number;
};

const PALETTES: Record<ToggleMode, Palette> = {
  light: {
    backdrop: 0xe9ecf1,
    backdropFloor: 0xdfe3ea,
    shadow: 0.3,
    glass: 0xf4f8ff,
    attenuationOff: 0xdfe8f5,
    attenuationOn: 0x2f6bff,
    knob: 0xfdfeff,
    knobTransmission: 0.78,
    knobEnv: 1.3,
    shellEmissive: 0.02,
    filamentOn: 0x2f6bff,
    filamentOff: 0xc4ccd8,
    key: 0xffffff,
    keyIntensity: 0.18,
    ambient: 0.015,
    envSkyTop: 0xffffff,
    envSkyBottom: 0x9aa4b4,
    envFloor: 0x2a3040,
    envSoftbox: 0xffffff,
    envIntensity: 1.0,
  },
  dark: {
    backdrop: 0x0a0b0f,
    backdropFloor: 0x06070a,
    shadow: 0.55,
    glass: 0xe8eefb,
    attenuationOff: 0x7f93b8,
    attenuationOn: 0x2f6bff,
    knob: 0xf2f6ff,
    knobTransmission: 0.58,
    knobEnv: 2.3,
    shellEmissive: 0.62,
    filamentOn: 0x3b7bff,
    filamentOff: 0x161a24,
    key: 0xd8e4ff,
    keyIntensity: 0.12,
    ambient: 0.006,
    envSkyTop: 0xdde6f5,
    envSkyBottom: 0x1a2030,
    envFloor: 0x04050a,
    envSoftbox: 0xffffff,
    envIntensity: 0.9,
  },
};

/* Proportioned like a physical switch: the capsule is twice as wide as it is
   tall and the knob clears the wall by a constant seat. */
const TRACK_RADIUS = 0.6;
const TRACK_LENGTH = 1.2;
const THUMB_RADIUS = TRACK_RADIUS - 0.225;
const TRAVEL = (TRACK_LENGTH / 2) * 0.8;
const CONTROL_WIDTH = TRACK_LENGTH + TRACK_RADIUS * 2;
/* The pill keeps ~13% of the stage height and never more than 18% of its
   width, so all four variants read at the same size in the picker. */
const VIEW_HEIGHT = (TRACK_RADIUS * 2) / 0.13;
const WIDTH_SHARE = 0.18;

function srgb(hex: number) {
  return new THREE.Color(hex).convertSRGBToLinear();
}

function hex(value: number) {
  return `#${value.toString(16).padStart(6, "0")}`;
}

/* A studio, not a lamp rig — and an HDR one. A canvas environment tops out at
   1.0, which is why LDR reflections read as dull grey wash; these softboxes run
   12-40x above the sky, so the tone mapper blows them into the hard specular
   streaks that make a surface read as glass. Everything reflected comes from
   here, which is why the stage behind the control can stay flat. */
type Softbox = {
  u: number;
  v: number;
  halfWidth: number;
  halfHeight: number;
  intensity: number;
  feather: number;
  warm: number;
};

const SOFTBOXES: readonly Softbox[] = [
  /* Broad key, high and camera-left. */
  { u: 0.3, v: 0.2, halfWidth: 0.155, halfHeight: 0.135, intensity: 19, feather: 0.86, warm: 0.04 },
  /* Narrow strip: the hard highlight that runs the length of the shoulder. */
  { u: 0.52, v: 0.115, halfWidth: 0.17, halfHeight: 0.04, intensity: 15, feather: 0.9, warm: 0 },
  /* Cool rim from behind camera-right. */
  { u: 0.86, v: 0.31, halfWidth: 0.085, halfHeight: 0.09, intensity: 10, feather: 0.92, warm: -0.06 },
  /* Backlight, directly behind the subject at u=0.25. At the silhouette the
     reflection vector points straight away from the camera, so this is the
     source that draws the clean border all the way round — and it lights the
     transmission through the body at the same time. A ring around the horizon
     instead reflects onto the equator and paints a bar across the middle. */
  { u: 0.25, v: 0.5, halfWidth: 0.1, halfHeight: 0.2, intensity: 6.5, feather: 0.8, warm: 0 },
  /* A small hard source high and camera-left: the crisp catchlight on the
     sphere, which a broad softbox alone can never give. */
  { u: 0.95, v: 0.21, halfWidth: 0.028, halfHeight: 0.032, intensity: 70, feather: 0.45, warm: 0.02 },
  /* Low bounce so the underside is not dead black. */
  { u: 0.5, v: 0.82, halfWidth: 0.5, halfHeight: 0.22, intensity: 0.5, feather: 1, warm: 0.02 },
];

function smoothFalloff(distance: number, extent: number, feather: number) {
  const inner = extent * (1 - feather);
  if (distance <= inner) return 1;
  if (distance >= extent) return 0;
  const t = (distance - inner) / (extent - inner);
  return 1 - t * t * (3 - 2 * t);
}

function buildEnvironmentTexture(palette: Palette) {
  const width = 512;
  const height = 256;
  const data = new Float32Array(width * height * 4);
  const skyTop = srgb(palette.envSkyTop);
  const skyBottom = srgb(palette.envSkyBottom);
  const floor = srgb(palette.envFloor);
  const box = srgb(palette.envSoftbox);

  for (let y = 0; y < height; y += 1) {
    /* three's equirect maps texture V=0 to straight *down*, so the rows have
       to be walked in reverse for `v` to mean what the softbox list says it
       means. Without this the whole studio is upside down and the subject is
       lit from the floor. */
    const v = 1 - y / (height - 1);
    /* Sky above, floor below, blended across a wide band — a hard horizon
       reflects as a seam cutting the capsule in half. */
    const ground = smoothFalloff(Math.max(0, 0.62 - v), 0.34, 1);
    const skyMix = Math.min(1, v / 0.56);
    const skyR = skyTop.r + (skyBottom.r - skyTop.r) * skyMix;
    const skyG = skyTop.g + (skyBottom.g - skyTop.g) * skyMix;
    const skyB = skyTop.b + (skyBottom.b - skyTop.b) * skyMix;
    const fade = 1 - Math.max(0, v - 0.62) * 1.1;
    const baseR = skyR + (floor.r * fade - skyR) * ground;
    const baseG = skyG + (floor.g * fade - skyG) * ground;
    const baseB = skyB + (floor.b * fade - skyB) * ground;

    for (let x = 0; x < width; x += 1) {
      const u = x / (width - 1);
      let r = baseR;
      let g = baseG;
      let b = baseB;

      for (const light of SOFTBOXES) {
        /* Azimuth wraps, so measure the short way round. */
        let du = Math.abs(u - light.u);
        if (du > 0.5) du = 1 - du;
        const dv = Math.abs(v - light.v);
        /* Elliptical, not separable: a product of two 1D falloffs reflects as a
           rectangle with visible corners. */
        const radial = Math.sqrt(
          (du / light.halfWidth) * (du / light.halfWidth)
          + (dv / light.halfHeight) * (dv / light.halfHeight),
        );
        if (radial >= 1) continue;
        const strength = smoothFalloff(radial, 1, light.feather) * light.intensity;
        r += box.r * strength * (1 + light.warm);
        g += box.g * strength;
        b += box.b * strength * (1 - light.warm);
      }

      const index = (y * width + x) * 4;
      data[index] = r;
      data[index + 1] = g;
      data[index + 2] = b;
      data[index + 3] = 1;
    }
  }

  const texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat, THREE.FloatType);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

/* Micro-surface: real glass is never perfectly smooth, and the tiny variation
   is what stops a reflection from reading as a flat gradient. */
function buildMicroTextures() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const image = ctx.createImageData(size, size);
  const height = new Float32Array(size * size);
  let seed = 0x9e3779b9;
  const random = () => {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    return ((seed >>> 0) % 100000) / 100000;
  };

  /* Two octaves of blurred value noise plus a faint polishing grain. */
  const coarse = new Float32Array(64 * 64);
  for (let i = 0; i < coarse.length; i += 1) coarse[i] = random();
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const u = (x / size) * 64;
      const v = (y / size) * 64;
      const x0 = Math.floor(u);
      const y0 = Math.floor(v);
      const fx = u - x0;
      const fy = v - y0;
      const sx = fx * fx * (3 - 2 * fx);
      const sy = fy * fy * (3 - 2 * fy);
      const at = (ax: number, ay: number) => coarse[((ay & 63) * 64) + (ax & 63)];
      const a = at(x0, y0);
      const b = at(x0 + 1, y0);
      const c = at(x0, y0 + 1);
      const d = at(x0 + 1, y0 + 1);
      const value = (a * (1 - sx) + b * sx) * (1 - sy) + (c * (1 - sx) + d * sx) * sy;
      const grain = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
      height[(y * size) + x] = value * 0.86 + (grain - Math.floor(grain)) * 0.14;
    }
  }

  for (let i = 0; i < height.length; i += 1) {
    /* Mostly smooth, with a shallow floor so roughness never reaches zero. */
    const value = 168 + height[i] * 78;
    image.data[i * 4] = value;
    image.data[i * 4 + 1] = value;
    image.data[i * 4 + 2] = value;
    image.data[i * 4 + 3] = 255;
  }
  ctx.putImageData(image, 0, 0);
  const roughness = new THREE.CanvasTexture(canvas);
  roughness.wrapS = THREE.RepeatWrapping;
  roughness.wrapT = THREE.RepeatWrapping;

  /* Derive a matching normal map so the micro-relief bends highlights too. */
  const normalCanvas = document.createElement("canvas");
  normalCanvas.width = size;
  normalCanvas.height = size;
  const normalCtx = normalCanvas.getContext("2d");
  if (!normalCtx) return { roughness, normal: null };
  const normalImage = normalCtx.createImageData(size, size);
  const at = (x: number, y: number) => height[((y + size) % size) * size + ((x + size) % size)];
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const dx = at(x + 1, y) - at(x - 1, y);
      const dy = at(x, y + 1) - at(x, y - 1);
      const index = (y * size + x) * 4;
      normalImage.data[index] = 128 + dx * 110;
      normalImage.data[index + 1] = 128 - dy * 110;
      normalImage.data[index + 2] = 255;
      normalImage.data[index + 3] = 255;
    }
  }
  normalCtx.putImageData(normalImage, 0, 0);
  const normal = new THREE.CanvasTexture(normalCanvas);
  normal.wrapS = THREE.RepeatWrapping;
  normal.wrapT = THREE.RepeatWrapping;
  return { roughness, normal };
}

const BACKDROP_VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/* Deliberately featureless: a seamless sweep with one contact shadow. All the
   detail in the render comes off the environment map. */
const BACKDROP_FRAGMENT = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uAspect;
uniform float uShadow;
uniform vec3 uBackdrop;
uniform vec3 uFloor;

void main() {
  vec2 p = vec2((vUv.x - 0.5) * uAspect, vUv.y - 0.5);
  vec3 color = mix(uFloor, uBackdrop, smoothstep(-0.42, 0.16, p.y));

  /* Contact shadow, baked into the opaque sweep so the glass refracts it. */
  vec2 core = (p - vec2(0.0, -0.052)) / vec2(0.148, 0.038);
  vec2 spread = (p - vec2(0.0, -0.062)) / vec2(0.28, 0.1);
  float occlusion = exp(-dot(core, core) * 0.9) * 0.72 + exp(-dot(spread, spread) * 0.8) * 0.42;
  color *= 1.0 - clamp(occlusion, 0.0, 1.0) * uShadow;

  /* A dither step wide enough to kill banding on a near-flat sweep. */
  float dither = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
  color += (dither - 0.5) * 0.0035;

  gl_FragColor = vec4(color, 1.0);
}
`;

export function createGlassToggleScene({
  canvas,
  mode,
  speed,
  on,
}: GlassToggleSceneOptions): GlassToggleScene {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 40);
  camera.position.set(0, 0.22, 9.4);
  camera.lookAt(0, 0, 0);

  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();

  const backdropUniforms = {
    uAspect: { value: 1 },
    uShadow: { value: PALETTES[mode].shadow },
    uBackdrop: { value: srgb(PALETTES[mode].backdrop) },
    uFloor: { value: srgb(PALETTES[mode].backdropFloor) },
  };

  const backdrop = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.ShaderMaterial({
      uniforms: backdropUniforms,
      vertexShader: BACKDROP_VERTEX,
      fragmentShader: BACKDROP_FRAGMENT,
      depthWrite: false,
    }),
  );
  backdrop.position.z = -3.2;
  backdrop.renderOrder = -1;
  scene.add(backdrop);

  const micro = buildMicroTextures();
  const maxAnisotropy = renderer.capabilities.getMaxAnisotropy();
  if (micro?.roughness) {
    micro.roughness.anisotropy = maxAnisotropy;
    micro.roughness.repeat.set(3, 2);
  }
  if (micro?.normal) {
    micro.normal.anisotropy = maxAnisotropy;
    micro.normal.repeat.set(3, 2);
  }

  /* One rig, turned a few degrees so the capsule reads as a solid object. */
  const rig = new THREE.Group();
  rig.rotation.set(-0.05, 0.13, 0);
  scene.add(rig);

  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: srgb(PALETTES[mode].glass),
    metalness: 0,
    roughness: 0.115,
    transmission: 1,
    ior: 1.62,
    clearcoat: 1,
    clearcoatRoughness: 0.008,
    attenuationColor: srgb(PALETTES[mode].attenuationOff),
    attenuationDistance: 6,
    envMapIntensity: PALETTES[mode].envIntensity,
    specularIntensity: 1,
    roughnessMap: micro?.roughness ?? null,
    clearcoatNormalMap: micro?.normal ?? null,
    clearcoatNormalScale: new THREE.Vector2(0.13, 0.13),
  });
  /* @types/three 0.149 leaves these out of the parameters interface. */
  glassMaterial.thickness = 1.25;
  /* A whisper of thin-film so the shoulders pick up colour the way real
     coated glass does. */
  glassMaterial.iridescence = 0.2;
  glassMaterial.iridescenceIOR = 1.3;
  glassMaterial.iridescenceThicknessRange = [120, 420];
  glassMaterial.emissive = srgb(PALETTES[mode].filamentOn);
  glassMaterial.emissiveIntensity = 0;

  const track = new THREE.Mesh(
    new THREE.CapsuleGeometry(TRACK_RADIUS, TRACK_LENGTH, 64, 192),
    glassMaterial,
  );
  track.rotation.z = Math.PI / 2;
  /* Flattened in depth: a switch is a lozenge, not a capsule pill. */
  track.scale.set(1, 1, 0.82);
  rig.add(track);

  /* A slim lit filament lying in the bottom of the trough. It stays opaque so
     it reaches the transmission backdrop and the shell actually refracts it. */
  const filamentMaterial = new THREE.MeshStandardMaterial({
    color: srgb(PALETTES[mode].filamentOff),
    emissive: srgb(PALETTES[mode].filamentOn),
    emissiveIntensity: on ? 1 : 0,
    roughness: 0.34,
    metalness: 0,
  });
  const filament = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.105, TRACK_LENGTH + 0.16, 16, 64),
    filamentMaterial,
  );
  filament.rotation.z = Math.PI / 2;
  filament.position.set(0, -0.31, -0.04);
  rig.add(filament);

  /* The knob is a frosted lens standing proud of the capsule, so it refracts
     both the sweep behind the stage and the filament inside the trough. */
  const knobMaterial = new THREE.MeshPhysicalMaterial({
    color: srgb(PALETTES[mode].knob),
    metalness: 0,
    roughness: 0.125,
    transmission: PALETTES[mode].knobTransmission,
    ior: 1.47,
    clearcoat: 1,
    clearcoatRoughness: 0.01,
    attenuationColor: srgb(PALETTES[mode].attenuationOff),
    attenuationDistance: 3,
    envMapIntensity: PALETTES[mode].envIntensity * PALETTES[mode].knobEnv,
    roughnessMap: micro?.roughness ?? null,
    clearcoatNormalMap: micro?.normal ?? null,
    clearcoatNormalScale: new THREE.Vector2(0.1, 0.1),
  });
  knobMaterial.thickness = 0.62;
  knobMaterial.iridescence = 0.12;
  knobMaterial.iridescenceIOR = 1.25;
  knobMaterial.iridescenceThicknessRange = [100, 380];

  const knob = new THREE.Mesh(new THREE.SphereGeometry(THUMB_RADIUS, 160, 96), knobMaterial);
  /* Left perfectly spherical — no depth squash. Its equator has to sit at the
     shell's front surface (TRACK_RADIUS * the depth flattening): any deeper and
     the silhouette is read through the curved wall, which refracts it into an
     egg. At the surface the outline is a true circle and the back half still
     sits down in the trough. */
  knob.position.z = TRACK_RADIUS * 0.82;
  rig.add(knob);

  /* IBL does nearly all the work; the key is only here to keep a terminator. */
  const ambient = new THREE.AmbientLight(srgb(0xffffff), PALETTES[mode].ambient);
  scene.add(ambient);

  const key = new THREE.DirectionalLight(srgb(PALETTES[mode].key), PALETTES[mode].keyIntensity);
  key.position.set(2.2, 3.4, 4);
  scene.add(key);

  let environmentTarget: THREE.WebGLRenderTarget | null = null;

  function applyEnvironment(next: ToggleMode) {
    const source = buildEnvironmentTexture(PALETTES[next]);
    if (!source) return;
    const nextTarget = pmrem.fromEquirectangular(source);
    source.dispose();
    environmentTarget?.dispose();
    environmentTarget = nextTarget;
    scene.environment = nextTarget.texture;
  }

  applyEnvironment(mode);

  let currentMode = mode;
  let currentSpeed = speed;
  let target = on ? 1 : 0;
  let progress = target;
  let velocity = 0;
  let onGlow = target;
  const attenuationOffColor = srgb(PALETTES[mode].attenuationOff);
  const attenuationOnColor = srgb(PALETTES[mode].attenuationOn);
  const filamentOffColor = srgb(PALETTES[mode].filamentOff);
  const filamentOnColor = srgb(PALETTES[mode].filamentOn);
  const pointer = new THREE.Vector2(0, 0);
  const smoothedPointer = new THREE.Vector2(0, 0);
  let width = 1;
  let height = 1;
  let baseDistance = camera.position.z;
  let sizeScale = 1;
  let disposed = false;
  let last = performance.now();
  let elapsed = 0;

  const reduceMotion = typeof window !== "undefined"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function applyPalette(next: ToggleMode) {
    const palette = PALETTES[next];
    backdropUniforms.uBackdrop.value = srgb(palette.backdrop);
    backdropUniforms.uFloor.value = srgb(palette.backdropFloor);
    backdropUniforms.uShadow.value = palette.shadow;
    glassMaterial.color = srgb(palette.glass);
    glassMaterial.envMapIntensity = palette.envIntensity;
    knobMaterial.color = srgb(palette.knob);
    knobMaterial.attenuationColor = srgb(palette.attenuationOff);
    knobMaterial.transmission = palette.knobTransmission;
    knobMaterial.envMapIntensity = palette.envIntensity * palette.knobEnv;
    attenuationOffColor.copy(srgb(palette.attenuationOff));
    attenuationOnColor.copy(srgb(palette.attenuationOn));
    filamentOffColor.copy(srgb(palette.filamentOff));
    filamentOnColor.copy(srgb(palette.filamentOn));
    filamentMaterial.emissive = srgb(palette.filamentOn);
    glassMaterial.emissive = srgb(palette.filamentOn);
    ambient.intensity = palette.ambient;
    key.color = srgb(palette.key);
    key.intensity = palette.keyIntensity;
    applyEnvironment(next);
  }

  function resize(nextWidth: number, nextHeight: number) {
    width = Math.max(1, Math.round(nextWidth));
    height = Math.max(1, Math.round(nextHeight));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;

    /* Frame the control identically at every stage size by moving the camera
       rather than scaling the meshes — glass thickness is in world units, so a
       scaled pill would refract differently at every viewport. */
    const halfFov = (camera.fov * Math.PI) / 360;
    const visibleHeight = Math.max(VIEW_HEIGHT, CONTROL_WIDTH / (WIDTH_SHARE * camera.aspect)) / sizeScale;
    baseDistance = visibleHeight / (2 * Math.tan(halfFov));
    camera.position.z = baseDistance;
    camera.updateProjectionMatrix();

    const backdropHeight = 2 * (baseDistance - backdrop.position.z) * Math.tan(halfFov);
    backdrop.scale.set(backdropHeight * camera.aspect * 1.08, backdropHeight * 1.08, 1);
    backdropUniforms.uAspect.value = camera.aspect;
  }

  function measureSwitch() {
    const halfWidth = TRACK_LENGTH / 2 + TRACK_RADIUS;
    const left = new THREE.Vector3(-halfWidth, 0, 0).project(camera);
    const right = new THREE.Vector3(halfWidth, 0, 0).project(camera);
    const top = new THREE.Vector3(0, TRACK_RADIUS, 0).project(camera);
    const bottom = new THREE.Vector3(0, -TRACK_RADIUS, 0).project(camera);
    return {
      width: Math.abs(right.x - left.x) * 0.5 * width,
      height: Math.abs(top.y - bottom.y) * 0.5 * height,
    };
  }

  function frame(now: number) {
    if (disposed) return;
    const delta = Math.min(0.05, (now - last) / 1000);
    last = now;
    elapsed += delta * currentSpeed;

    /* Critically damped travel — it arrives without the rubbery overshoot a
       spring would give a glass object this heavy-looking. */
    const stiffness = reduceMotion ? 400 : 150;
    const damping = 2 * Math.sqrt(stiffness);
    const step = reduceMotion ? Math.min(delta, 0.016) : delta;
    velocity += (target - progress) * stiffness * step - velocity * damping * step;
    progress += velocity * step;

    onGlow += (target - onGlow) * Math.min(1, delta * 6);
    smoothedPointer.lerp(pointer, Math.min(1, delta * 3.2));

    knob.position.x = (progress * 2 - 1) * TRAVEL;
    knob.rotation.z = -progress * Math.PI * 0.9;
    knob.rotation.y = smoothedPointer.x * 0.3;

    filamentMaterial.emissiveIntensity = onGlow * (currentMode === "dark" ? 3.2 : 1.4);
    filamentMaterial.color.copy(filamentOffColor).lerp(filamentOnColor, onGlow * 0.85);
    glassMaterial.attenuationColor.copy(attenuationOffColor).lerp(attenuationOnColor, onGlow);
    glassMaterial.attenuationDistance = 6 - onGlow * 4.8;
    glassMaterial.emissiveIntensity = onGlow * PALETTES[currentMode].shellEmissive;

    camera.position.set(
      smoothedPointer.x * 0.5,
      0.22 + smoothedPointer.y * 0.32,
      baseDistance,
    );
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    window.requestAnimationFrame(frame);
  }

  window.requestAnimationFrame(frame);

  return {
    setMode(next) {
      if (next === currentMode) return;
      currentMode = next;
      applyPalette(next);
    },
    setSpeed(next) {
      currentSpeed = next;
    },
    setSize(next) {
      sizeScale = next;
      resize(width, height);
    },
    setOn(next) {
      target = next ? 1 : 0;
    },
    setPointer(x, y) {
      pointer.set(x, y);
    },
    resize,
    measureSwitch,
    dispose() {
      disposed = true;
      environmentTarget?.dispose();
      pmrem.dispose();
      micro?.roughness?.dispose();
      micro?.normal?.dispose();
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.geometry.dispose();
        const material = object.material;
        if (Array.isArray(material)) material.forEach((entry) => entry.dispose());
        else material.dispose();
      });
      renderer.dispose();
    },
  };
}

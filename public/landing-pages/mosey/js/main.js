// Mosey, "Gone Walking". V2, second pass.
// One world, one route. Scroll position is distance walked along the route.
// In this pass Mosey operates the page: it knocks LIGHTS over and the page goes to night,
// projects its own presentation with its lens, maps your home as it walks the headline,
// projects photos and film on a wall, and ends by landing on the RESERVE button.
import * as THREE from 'three';
import RAPIER from 'rapier';
import { TTFLoader } from 'three/addons/loaders/TTFLoader.js';
import { Font } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { PAL } from './options.js?v=1115-222730';
// the robot: the Higgsfield model. The old stand-in made of simple shapes is still there behind ?robot=standin, for comparing.
const robotLib = await import(new URLSearchParams(location.search).get('robot') === 'standin' ? './robot.js?v=1115-222730' : './robot-model.js?v=1115-222730');
const { createRobot, WAYS } = robotLib;
if (robotLib.loadRobot) await robotLib.loadRobot();
import { createFirstWalk, planLayout } from './first-walk.js?v=1115-222730';
import { createIntroFilm } from './intro-film.js?v=1115-222730';
import { createHome } from './home-kit.js?v=1115-222730';
import { createDock, createAntennaPulse, createPlinth, createCtaButton } from './props-kit.js?v=1115-222730';
import { createSizes } from './sizes.js?v=1115-222730';

const coarse = matchMedia('(pointer: coarse)').matches;
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z);
const clamp = THREE.MathUtils.clamp, lerp = THREE.MathUtils.lerp, smooth = THREE.MathUtils.smoothstep;
const damp = (a, b, l, dt) => a + (b - a) * (1 - Math.exp(-l * dt));
const backOut = (t) => { const c = 1.6; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); };
const bounceOut = (t) => { const n = 7.5625, d = 2.75; if (t < 1 / d) return n * t * t; if (t < 2 / d) return n * (t -= 1.5 / d) * t + 0.75; if (t < 2.5 / d) return n * (t -= 2.25 / d) * t + 0.9375; return n * (t -= 2.625 / d) * t + 0.984375; };
let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
const boot = window.__boot = { start: Math.round(performance.now()) };      // the loader reads these stages (js/loader.js)
if (!WAYS.classic.fixed) { WAYS.classic.body = new THREE.Color(PAL.robot).getHex(); WAYS.classic.trim = new THREE.Color(PAL.trim).getHex(); }
document.documentElement.style.setProperty('--robot', PAL.robot);

/* ---------- renderer, scene, light ---------- */
const canvas = document.getElementById('world');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const DPR = Math.min(devicePixelRatio, coarse ? 1.5 : 2);
renderer.setPixelRatio(DPR);

const scene = new THREE.Scene();
const SKY = new THREE.Color(PAL.sky), BLUE_SKY = new THREE.Color(PAL.deep), NIGHT = new THREE.Color(PAL.night), DUSK = new THREE.Color('#9d90b6');
scene.background = SKY.clone();
scene.fog = new THREE.Fog(PAL.sky, 10, 34);
{ const pm = new THREE.PMREMGenerator(renderer); scene.environment = pm.fromScene(new RoomEnvironment(), 0.04).texture; scene.environmentIntensity = 0.5; pm.dispose(); }
const camera = new THREE.PerspectiveCamera(36, 1, 0.08, 160);
const hemi = new THREE.HemisphereLight(0xeef2ff, 0xe9dcc8, 0.75); scene.add(hemi);
const sun = new THREE.DirectionalLight(0xffedd0, 2.5);
const SUN_OFF = V3(-6, 11, 7), RIM_OFF = V3(7, 5, -9);
sun.castShadow = true;
sun.shadow.mapSize.setScalar(coarse ? 1024 : 2048);
Object.assign(sun.shadow.camera, { left: -13, right: 13, top: 13, bottom: -13, near: 1, far: 44 });
sun.shadow.bias = -0.0004; sun.shadow.normalBias = 0.03; sun.shadow.radius = 5;
scene.add(sun, sun.target);
const rim = new THREE.DirectionalLight(0xcfe0ff, 0.9); scene.add(rim, rim.target);

/* ---------- physics ---------- */
await RAPIER.init(); boot.physics = Math.round(performance.now());
const world = new RAPIER.World({ x: 0, y: -24, z: 0 });
world.timestep = 1 / 60;
const letters = [], letterMeshes = [];

/* ---------- type as architecture ---------- */
const font = await new Promise((res, rej) => new TTFLoader().load('fonts/ArchivoBlack-Regular.ttf', (json) => res(new Font(json)), undefined, rej));
try { await document.fonts.load('40px "Archivo Black"'); } catch (e) { /* the canvas screens fall back to a system face */ }
boot.font = Math.round(performance.now());
const DISPLAY = '"Archivo Black", "Arial Black", sans-serif', MONO = 'ui-monospace, Menlo, monospace';
const blueMat = new THREE.MeshPhysicalMaterial({ color: PAL.side, roughness: 0.42, clearcoat: 0.45, clearcoatRoughness: 0.35 });
const faceMat = new THREE.MeshStandardMaterial({ color: PAL.face, roughness: 0.78 });
const LETTER = [faceMat, blueMat];
const END = [new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 }), new THREE.MeshStandardMaterial({ color: 0xc3cdf7, roughness: 0.5 })];
const inkMat = new THREE.MeshStandardMaterial({ color: PAL.ink, roughness: 0.55 });
const yellowMat = new THREE.MeshStandardMaterial({ color: PAL.accent, roughness: 0.45, metalness: 0.2 });
const glyphCache = new Map();
function glyph(ch, size, depth) {
  const key = ch + size + '_' + depth;
  if (!glyphCache.has(key)) {
    const b = Math.min(0.06, size * 0.03);
    const g = new TextGeometry(ch, { font, size, depth, curveSegments: 14, bevelEnabled: true, bevelThickness: b, bevelSize: b * 0.75, bevelSegments: 4 });
    g.computeBoundingBox();
    const bb = g.boundingBox.clone(), c = bb.getCenter(V3());
    g.translate(-c.x, -c.y, -c.z);
    glyphCache.set(key, { g, bb, c, half: bb.getSize(V3()).multiplyScalar(0.5) });
  }
  return glyphCache.get(key);
}
const advance = (ch, size) => (font.data.glyphs[ch]?.ha ?? font.data.glyphs['n'].ha) * size / font.data.resolution;
const capHeight = (size) => glyph('N', size, 1).bb.max.y;

function makeWord(text, { size, depth, left = 0, z, physics = 'none', gaps = {}, tracking = 0.02, add = true, mat = LETTER, base = 0 }) {
  const out = []; let x = left;
  [...text].forEach((ch, i) => {
    if (ch === ' ') { x += advance('n', size) * 0.7; return; }
    if (gaps[i]) x += gaps[i];
    const G = glyph(ch, size, depth);
    const mesh = new THREE.Mesh(G.g, mat);
    mesh.castShadow = mesh.receiveShadow = true;
    const home = V3(x + G.c.x, base + G.half.y + 0.045, z);
    mesh.position.copy(home);
    if (add) scene.add(mesh);
    out.push({ ch, i, mesh, home, homeQ: new THREE.Quaternion(), half: G.half, x0: x + G.bb.min.x, x1: x + G.bb.max.x, state: 'none', body: null, t: 0, sq: 0, sqV: 0, tilt: 0, block: physics === 'block' || (Array.isArray(physics) && physics.includes(i)) });
    x += advance(ch, size) + tracking;
  });
  out.right = x; return out;
}
function shiftWord(word, dx) { word.forEach((L) => { L.home.x += dx; L.mesh.position.x += dx; L.x0 += dx; L.x1 += dx; }); word.right += dx; }
function giveBodies(word) {
  for (const L of word) {
    if (!L.block) continue;
    L.body = world.createRigidBody(RAPIER.RigidBodyDesc.dynamic().setCanSleep(true).setLinearDamping(0.15).setAngularDamping(0.4).setTranslation(L.home.x, L.home.y, L.home.z));
    world.createCollider(RAPIER.ColliderDesc.cuboid(L.half.x - 0.02, L.half.y, L.half.z).setDensity(0.6).setFriction(0.8).setRestitution(0.05), L.body);
    L.state = 'free'; letters.push(L); letterMeshes.push(L.mesh); L.mesh.userData.letter = L;
  }
}
function solidWall(word) {
  const a = word[0].x0, b = word[word.length - 1].x1, hy = word[0].half.y;
  const body = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation((a + b) / 2, hy, word[0].home.z));
  world.createCollider(RAPIER.ColliderDesc.cuboid((b - a) / 2, hy, word[0].half.z), body);
}
// letter states: free (falls, can be thrown), locked (solid ground), homing (flying back to its place)
function lock(L) { if (L.state === 'free') { if (displaced(L)) sendHome(L, 'locked'); else { L.body.setBodyType(RAPIER.RigidBodyType.Fixed, true); L.state = 'locked'; } } else if (L.state === 'homing') L.after = 'locked'; }
function free(L) { if (L.state === 'locked') { L.body.setBodyType(RAPIER.RigidBodyType.Dynamic, true); L.state = 'free'; } else if (L.state === 'homing') L.after = 'free'; }
function displaced(L) { const p = L.body.translation(), q = L.body.rotation(); return L.home.distanceToSquared(p) > 0.0025 || Math.abs(q.w) < 0.999; }
function sendHome(L, after = 'free') {
  if (L.state === 'homing') { L.after = after; return; }
  if (!displaced(L)) { if (after === 'locked') { L.state = 'free'; lock(L); } return; }
  L.body.setBodyType(RAPIER.RigidBodyType.KinematicPositionBased, true);
  L.from = V3().copy(L.body.translation()); L.fromQ = new THREE.Quaternion().copy(L.body.rotation());
  L.t = 0; L.state = 'homing'; L.after = after;
}
const _v = V3(), _q = new THREE.Quaternion(), _e = new THREE.Euler();
function stepLetters(dt) {
  for (const L of letters) {
    if (L.state !== 'homing') continue;
    L.t = Math.min(1, L.t + dt / 0.6);
    _v.lerpVectors(L.from, L.home, backOut(L.t)); _v.y += Math.sin(L.t * Math.PI) * 0.6;
    _q.slerpQuaternions(L.fromQ, L.homeQ, Math.min(1, L.t * 1.15));
    L.body.setNextKinematicTranslation(_v); L.body.setNextKinematicRotation(_q);
    if (L.t >= 1) {
      L.body.setTranslation(L.home, true); L.body.setRotation(L.homeQ, true);
      L.body.setLinvel({ x: 0, y: 0, z: 0 }, true); L.body.setAngvel({ x: 0, y: 0, z: 0 }, true);
      L.body.setBodyType(L.after === 'locked' ? RAPIER.RigidBodyType.Fixed : L.after === 'float' ? RAPIER.RigidBodyType.KinematicPositionBased : RAPIER.RigidBodyType.Dynamic, true);
      L.state = L.after;
    }
  }
}

/* ---------- small makers ---------- */
const pops = [];
const pop = (obj, d, homeY = null, span = 2.2) => { const p = { obj, d, homeY, span, e: -1 }; pops.push(p); return p; };
const rr = (k, x, y, w, h, r, fill) => { k.fillStyle = fill; k.beginPath(); k.roundRect(x, y, w, h, r); k.fill(); };
const canvasTex = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8; return { c, k: c.getContext('2d'), tex }; };
const tinyMosey = (k, x, y, s, col = PAL.robot) => {          // a small drawn Mosey, for screens and stand-in photos
  k.fillStyle = 'rgba(40,30,20,.18)'; k.beginPath(); k.ellipse(x + s * 0.5, y + s * 1.02, s * 0.9, s * 0.16, 0, 0, 7); k.fill();
  k.fillStyle = col; k.beginPath(); k.roundRect(x - s * 0.55, y - s * 1.5, s * 1.1, s, s * 0.28); k.fill();
  k.beginPath(); k.ellipse(x, y, s * 0.42, s * 0.5, 0, 0, 7); k.fill(); k.fillRect(x - s * 0.04, y - s * 1.75, s * 0.08, s * 0.3); k.beginPath(); k.arc(x, y - s * 1.8, s * 0.1, 0, 7); k.fill();
  k.fillStyle = '#8b8d92'; k.beginPath(); k.ellipse(x - s * 0.22, y + s * 0.95, s * 0.22, s * 0.12, 0, 0, 7); k.ellipse(x + s * 0.22, y + s * 0.95, s * 0.22, s * 0.12, 0, 0, 7); k.fill();
  k.fillStyle = col; k.fillRect(x - s * 0.3, y + s * 0.3, s * 0.2, s * 0.6); k.fillRect(x + s * 0.1, y + s * 0.3, s * 0.2, s * 0.6);
  k.fillStyle = '#0a0a0c'; k.beginPath(); k.arc(x, y - s, s * 0.27, 0, 7); k.fill(); k.fillStyle = '#fff'; k.beginPath(); k.arc(x - s * 0.09, y - s * 1.09, s * 0.06, 0, 7); k.fill();
};
// a burst of paper. Its flight is a function of a 0..1.7 clock, so scroll can scrub it both ways.
function makeBurst(n, power = 1) {
  const cols = [PAL.accent, PAL.face, '#ff5a3c', '#8fd3b6', '#ff9ecb', '#fbf8f3', '#7b5cff', '#ffb02e'];
  const shapes = [new THREE.BoxGeometry(0.17, 0.006, 0.055), new THREE.BoxGeometry(0.085, 0.006, 0.085), new THREE.CylinderGeometry(0.05, 0.05, 0.006, 14), new THREE.BoxGeometry(0.3, 0.005, 0.028)];      // strips, squares, dots, streamers
  const sets = shapes.map((geo, g) => { const count = Math.ceil(n * [0.4, 0.25, 0.2, 0.15][g]);
    const mesh = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ roughness: 0.55, metalness: 0.1 }), count); mesh.castShadow = true; mesh.frustumCulled = false; scene.add(mesh);
    const data = Array.from({ length: count }, (_, i) => { mesh.setColorAt(i, new THREE.Color(cols[(i * 3 + g * 5) % cols.length]));
      const a = rnd() * 6.28, r = (0.5 + rnd() * 1.9) * power;                              // thrown out in a ring, some high, some wide
      return { vx: Math.cos(a) * r, vz: Math.sin(a) * r * 0.8, vy: (2.2 + rnd() * 3.6) * power, s: rnd() * 6.28, w: 4 + rnd() * 9, sway: 0.08 + rnd() * 0.16, k: 0.75 + rnd() * 0.6, late: rnd() * 0.12 }; });
    return { mesh, data }; });
  const m = new THREE.Matrix4(), e = new THREE.Euler(), sc = V3(), p = V3(), q = new THREE.Quaternion();
  const run = (st, ox, oy, oz, ground) => {
    for (const { mesh, data } of sets) {
      for (let i = 0; i < data.length; i++) {
        const b = data[i], s1 = Math.max(0, st - b.late), tl = (b.vy + Math.sqrt(b.vy * b.vy + 10 * (oy - ground))) / 5, t = Math.min(s1, tl), down = s1 >= tl;
        const flutter = down ? 0 : Math.sin(t * b.w * 0.6 + b.s) * b.sway * Math.min(1, t * 1.5);      // paper doesn't fall straight
        p.set(ox + b.vx * t + flutter, Math.max(ground + 0.012 + i * 0.0004, oy + b.vy * t - 2.5 * t * t), oz + b.vz * t + flutter * 0.6);
        e.set(down ? 0 : b.s + t * b.w, b.s + t * 3, down ? 0 : t * b.w * 0.7);
        m.compose(p, q.setFromEuler(e), sc.setScalar(s1 > 0 ? b.k : 0.001)); mesh.setMatrixAt(i, m);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }
  };
  run.show = (v) => { for (const { mesh } of sets) mesh.visible = v; };
  return run;
}
// A wall Mosey can project on: painted plaster with a moulded skirting board, a socket and a light switch.
// The picture is light thrown on the plaster: feathered at the edges, brightest in the middle, with a little spill round it.
const wallRnd = (() => { let s = 4711; return () => (s = (s * 16807) % 2147483647) / 2147483647; })();      // the wall has its own dice, so the page's dice roll as they did
const wallPaint = (() => { const { k, tex } = canvasTex(512, 512); k.fillStyle = '#ece5d8'; k.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 2600; i++) { k.fillStyle = `rgba(${rnd() > 0.5 ? '255,250,240' : '120,105,85'},${(0.02 + rnd() * 0.035).toFixed(3)})`; k.fillRect(rnd() * 512, rnd() * 512, 2 + rnd() * 26, 1 + rnd() * 2); }      // roller marks
  for (let i = 0; i < 44; i++) {                                                                  // patches where the paint dried a little lighter or darker. They wrap, so the tiles don't show.
    const x = wallRnd() * 512, y = wallRnd() * 512, r = 40 + wallRnd() * 110, c = wallRnd() > 0.5 ? '255,251,240' : '96,82,62', a = (0.03 + wallRnd() * 0.035).toFixed(3);
    for (const ox of [-512, 0, 512]) for (const oy of [-512, 0, 512]) { const gr = k.createRadialGradient(x + ox, y + oy, 0, x + ox, y + oy, r); gr.addColorStop(0, `rgba(${c},${a})`); gr.addColorStop(1, `rgba(${c},0)`); k.fillStyle = gr; k.fillRect(x + ox - r, y + oy - r, r * 2, r * 2); }
  }
  for (let i = 0; i < 7000; i++) { k.fillStyle = `rgba(${wallRnd() > 0.5 ? '255,252,244' : '70,60,46'},${(0.03 + wallRnd() * 0.05).toFixed(3)})`; k.fillRect(wallRnd() * 512, wallRnd() * 512, 1, 1); }      // the grain of the plaster
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(5, 3); return tex; })();
// How much of the picture reaches the wall: all of it in the middle, none at the soft rounded edge, and a little less where the plaster is rough, so the wall shows through the light.
const edgeFade = (() => { const w = 512, h = 288, { k, tex } = canvasTex(w, h), im = k.createImageData(w, h), d = im.data;
  for (let y = 0, i = 0; y < h; y++) for (let x = 0; x < w; x++, i += 4) {
    const qx = Math.abs(x + 0.5 - w / 2) - (w / 2 - 16), qy = Math.abs(y + 0.5 - h / 2) - (h / 2 - 16), sd = Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - 10;
    d[i] = d[i + 1] = d[i + 2] = 255 * smooth(-sd, 0, 12) * (1 - 0.05 * wallRnd()); d[i + 3] = 255; }
  k.putImageData(im, 0, 0);
  for (let i = 0; i < 520; i++) { k.fillStyle = `rgba(0,0,0,${(0.02 + wallRnd() * 0.05).toFixed(3)})`; k.fillRect(wallRnd() * w, wallRnd() * h, 3 + wallRnd() * 22, 1); }
  tex.colorSpace = THREE.NoColorSpace; return tex; })();
const WALL_PX = coarse ? [1024, 576] : [1536, 864];      // the canvas the home screens are drawn on: bigger where there are the pixels to show it
function makeWall(cx, cz, rotY, paint, WW = 15, home = false) {
  const W = 6.4, Hh = 3.6, cy = 2.4, WH = 8.4, ks = home ? 0.018 : 0;      // at home the picture is a touch narrower at the bottom: it is thrown up from the floor
  const g = new THREE.Group(); g.position.set(cx, cy, cz); g.rotation.y = rotY;
  const plaster = new THREE.MeshStandardMaterial({ map: wallPaint, bumpMap: wallPaint, bumpScale: 0.5, roughness: 0.96, vertexColors: true }), trim = new THREE.MeshStandardMaterial({ color: '#f6f1e7', roughness: 0.55 });
  // The slab. It is painted a little darker away from the picture and down by the floor, so the light seems to fall off.
  const slabGeo = new THREE.BoxGeometry(WW, WH, 0.3, Math.round(WW / 0.8), 10, 1), sp = slabGeo.attributes.position, su = slabGeo.attributes.uv, sc = new Float32Array(sp.count * 3);
  for (let i = 0; i < sp.count; i++) { const x = sp.getX(i), y = sp.getY(i) + WH / 2 - cy, v = (1 - 0.27 * smooth(Math.hypot(x / 7, y / 4.4), 0.55, 2)) * (0.9 + 0.1 * smooth(y + cy, 0.5, 1.7)); sc.set([v, v * 0.992, v * 0.975], i * 3); su.setX(i, su.getX(i) * WW / 15); }
  slabGeo.setAttribute('color', new THREE.BufferAttribute(sc, 3));
  const slab = new THREE.Mesh(slabGeo, plaster); slab.position.set(0, WH / 2 - cy, -0.1); slab.receiveShadow = true; g.add(slab);
  // A moulding is its section pulled along the wall. The skirting has a flat face, a cove and a bead on top.
  const mould = (pts) => { const s = new THREE.Shape(); pts.forEach(([x, y], i) => (i ? s.lineTo(x, y) : s.moveTo(x, y))); const e = new THREE.ExtrudeGeometry(s, { depth: WW, bevelEnabled: false }); e.rotateY(-Math.PI / 2); e.translate(WW / 2, 0, 0); return e; };
  const skirt = new THREE.Mesh(mould([[0, 0], [0.1, 0], [0.1, 0.4], [0.088, 0.425], [0.088, 0.44], [0.07, 0.475], [0.056, 0.52], [0.056, 0.545], [0.064, 0.56], [0.064, 0.58], [0.05, 0.6], [0, 0.6]]), trim); skirt.position.set(0, -cy, 0.05); skirt.receiveShadow = true; g.add(skirt);
  if (home) { const rail = new THREE.Mesh(mould([[0, 0], [0.03, 0.012], [0.062, 0.05], [0.062, 0.09], [0.042, 0.1], [0.042, 0.13], [0, 0.15]]), trim); rail.position.set(0, 5.02 - cy, 0.05); g.add(rail); }      // a picture rail, up above the shelf
  for (const [x, y, w, h] of [[W / 2 + (home ? 4.4 : 1.5), 0.95, 0.5, 0.5], [home ? -W / 2 - 5.9 : -W / 2 - 2.1, 4.3, 0.5, 0.74]]) {                    // a socket low down, a light switch higher up. At home they are further along, clear of the shelf and the basket.
    const plate = new THREE.Mesh(new RoundedBoxGeometry(w, h, 0.05, 2, 0.02), trim); plate.position.set(x, y - cy, 0.07); g.add(plate);
    const key = new THREE.Mesh(new RoundedBoxGeometry(w * 0.4, h * 0.45, 0.04, 2, 0.015), new THREE.MeshStandardMaterial({ color: '#dcd5c8', roughness: 0.5 })); key.position.set(x, y - cy, 0.1); key.rotation.x = 0.12; g.add(key);
  }
  // Soft shade where things meet: on the floor in front of the skirting, on the wall above it, and under the rail. Strips that fade out, each corner with its own strength.
  const sh = { p: [], c: [] }, L = -WW / 2, R = WW / 2;
  const strip = (rows) => { for (let i = 0; i < rows.length - 1; i++) { const [ay, az, aa] = rows[i], [by, bz, ba] = rows[i + 1]; sh.p.push(L, ay, az, R, ay, az, R, by, bz, L, ay, az, R, by, bz, L, by, bz); for (const a of [aa, aa, ba, aa, ba, ba]) sh.c.push(1, 1, 1, a); } };
  strip([[0.016 - cy, 0.15, 0.3], [0.016 - cy, 0.5, 0.11], [0.016 - cy, 1.6, 0]]); strip([[0.6 - cy, 0.053, 0.2], [0.73 - cy, 0.053, 0.07], [1.05 - cy, 0.053, 0]]);
  if (home) strip([[5.02 - cy, 0.053, 0.2], [4.93 - cy, 0.053, 0.06], [4.7 - cy, 0.053, 0]]);
  const shGeo = new THREE.BufferGeometry(); shGeo.setAttribute('position', new THREE.Float32BufferAttribute(sh.p, 3)); shGeo.setAttribute('color', new THREE.Float32BufferAttribute(sh.c, 4));
  const shade = new THREE.Mesh(shGeo, new THREE.MeshBasicMaterial({ color: '#2b2218', vertexColors: true, transparent: true, depthWrite: false, side: THREE.DoubleSide })); shade.renderOrder = -2; g.add(shade);
  // The picture: a sheet of light on the plaster, a little dimmer towards its corners as a lamp is.
  const [cw, ch] = home ? WALL_PX : [1024, 576], { k, tex } = canvasTex(cw, ch), tilt = (x, y) => x * (1 - ks * (1 - y / (Hh / 2)));
  const mat = new THREE.MeshBasicMaterial({ map: tex, alphaMap: edgeFade, vertexColors: true, transparent: true, fog: false, toneMapped: false });
  const faceGeo = new THREE.PlaneGeometry(W, Hh, 12, 8), fp = faceGeo.attributes.position, fc = new Float32Array(fp.count * 3);
  for (let i = 0; i < fp.count; i++) { fc.fill(1 - 0.13 * smooth(Math.hypot(fp.getX(i) / (W / 2), fp.getY(i) / (Hh / 2)), 0.3, 1.35), i * 3, i * 3 + 3); fp.setX(i, tilt(fp.getX(i), fp.getY(i))); }
  faceGeo.setAttribute('color', new THREE.BufferAttribute(fc, 3));
  const face = new THREE.Mesh(faceGeo, mat); face.position.z = 0.064; g.add(face);
  // The light that spills: a glow round the picture, and a wash on the floor under it. Unlit and added on, it is not a lamp.
  const hp = [], hc = [], tri = (...v) => { for (const [x, y, z, b] of v) { hp.push(x, y, z); hc.push(b, b, b); } };
  const ring = (off, b) => { const pts = [], r = 0.3 + Math.max(off, 0), hx = W / 2 + off - r, hy = Hh / 2 + off - r; [[1, 1], [-1, 1], [-1, -1], [1, -1]].forEach(([sx, sy], q) => { for (let j = 0; j < 7; j++) { const a = (q + j / 6) * Math.PI / 2, y = sy * hy + Math.sin(a) * r; pts.push([tilt(sx * hx + Math.cos(a) * r, clamp(y, -Hh / 2, Hh / 2)), y, 0.058, b]); } }); return pts; };
  [ring(-0.16, 1), ring(0.08, 0.33), ring(0.4, 0.09), ring(0.9, 0.014), ring(1.6, 0)].forEach((a, i, all) => { const b = all[i + 1]; if (b) a.forEach((p, j) => { const n = (j + 1) % a.length; tri(p, a[n], b[n], p, b[n], b[j]); }); });
  [-W / 2 - 1.3, -W / 2 + 0.7, W / 2 - 0.7, W / 2 + 1.3].forEach((x, i, xs) => { if (i < 3) { const fy = 0.022 - cy, a = [x, fy, 0.16, i === 0 ? 0 : 0.3], b = [xs[i + 1], fy, 0.16, i === 2 ? 0 : 0.3], c = [xs[i + 1], fy, 2.7, 0], d = [x, fy, 2.7, 0]; tri(a, b, c, a, c, d); } });
  const haloGeo = new THREE.BufferGeometry(); haloGeo.setAttribute('position', new THREE.Float32BufferAttribute(hp, 3)); haloGeo.setAttribute('color', new THREE.Float32BufferAttribute(hc, 3));
  const halo = new THREE.Mesh(haloGeo, new THREE.MeshBasicMaterial({ color: '#fff0cc', vertexColors: true, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false, toneMapped: false })); halo.visible = false; g.add(halo);
  scene.add(g);
  const local = [[-W / 2, Hh / 2], [W / 2, Hh / 2], [W / 2, -Hh / 2], [-W / 2, -Hh / 2]].map(([x, y]) => [tilt(x, y), y]), corners = [V3(), V3(), V3(), V3()];
  let level = 0.6, lv = 0.6;                                              // how bright the picture is, which is how much light it spills
  return { g, cy, mat, get lit() { return lv; }, corners: () => { local.forEach((c, i) => g.localToWorld(corners[i].set(c[0], c[1], 0.06))); return corners; },
    paint: (a, b, c, d) => { const r = paint(k, a, b, c, d); if (r === false) return; if (r >= 0) level = r; tex.needsUpdate = true; },      // a painter can say nothing changed (false), or how bright its picture is (0 to 1)
    spill: (v) => { lv += (level - lv) * 0.06; face.visible = v > 0.003; halo.visible = home && face.visible; halo.material.opacity = v * (0.03 + 0.2 * lv); } };      // the first screen is lit by its own lamp, so only the wall at home gets the glow
}
// the light from its lens to a wall: a cone in three lengths, brightest at the lens and nearly gone by the time it reaches the plaster
const projLamp = new THREE.SpotLight('#fff1cf', 0, 18, 0.6, 0.7, 1.1); scene.add(projLamp, projLamp.target);      // what its projector throws on the room, seen from inside its head
const beam = new THREE.Mesh(new THREE.BufferGeometry(), new THREE.MeshBasicMaterial({ color: '#fff3c4', vertexColors: true, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false, toneMapped: false }));
beam.geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(39), 3)); beam.geometry.setIndex([0, 1, 2, 3].flatMap((i) => { const j = (i + 1) % 4; return [0, 1 + i, 1 + j, 1 + i, 5 + i, 5 + j, 1 + i, 5 + j, 1 + j, 5 + i, 9 + i, 9 + j, 5 + i, 9 + j, 5 + j]; }));
beam.geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array([1, 1, 1, ...Array(12).fill(0.1), ...Array(12).fill(0.014), ...Array(12).fill(0.001)]), 3));
beam.frustumCulled = false; beam.visible = false; scene.add(beam);
// dust drifting in that light. Each mote sits part of the way from the lens to a spot on the picture, and glints as it turns.
const motes = (() => { const n = 40, geo = new THREE.BufferGeometry(), seeds = Array.from({ length: n }, () => [wallRnd(), wallRnd(), wallRnd(), wallRnd()]);
  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3)); geo.setAttribute('color', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
  const { k, tex } = canvasTex(32, 32), gr = k.createRadialGradient(16, 16, 0, 16, 16, 16); gr.addColorStop(0, '#fff'); gr.addColorStop(0.35, 'rgba(255,255,255,0.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); k.fillStyle = gr; k.fillRect(0, 0, 32, 32);
  const pts = new THREE.Points(geo, new THREE.PointsMaterial({ map: tex, color: '#fff3c4', size: 0.036, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, toneMapped: false }));
  pts.frustumCulled = false; pts.visible = false; scene.add(pts);
  const sway = (x) => Math.abs(((x / Math.PI) % 2 + 2) % 2 - 1);      // to and fro at an even pace, 0 to 1
  return { pts, move(from, c, T, on) { const p = geo.attributes.position, col = geo.attributes.color;
    seeds.forEach(([a, b, s, w], i) => { const u = 0.04 + 0.92 * sway(a * 40 + T * (0.05 + w * 0.08)), v = 0.04 + 0.92 * sway(b * 40 + T * (0.04 + a * 0.07)), f = (s + T * (0.006 + w * 0.012)) % 1, far = 0.08 + 0.72 * f * f;      // more of them near the lens, where the light is strongest
      const x = lerp(lerp(c[0].x, c[1].x, u), lerp(c[3].x, c[2].x, u), v), y = lerp(lerp(c[0].y, c[1].y, u), lerp(c[3].y, c[2].y, u), v), z = lerp(lerp(c[0].z, c[1].z, u), lerp(c[3].z, c[2].z, u), v);
      p.setXYZ(i, lerp(from.x, x, far), lerp(from.y, y, far), lerp(from.z, z, far));
      const glint = on * Math.sin(f * Math.PI) * (1 - 0.6 * far) * (0.2 + 0.8 * (0.5 + 0.5 * Math.sin(T * (0.7 + w * 1.6) + a * 30)) ** 2); col.setXYZ(i, glint, glint, glint); });
    p.needsUpdate = col.needsUpdate = true; } }; })();

/* ---------- the world ---------- */
// the headline
const HEAD_SIZE = 2.75, HEAD_DEPTH = 1.5, X0 = -7;
const H = capHeight(HEAD_SIZE) + 0.045;
const headline = makeWord('GONE WALKING', { size: HEAD_SIZE, depth: HEAD_DEPTH, left: X0, z: 0, physics: 'block' });
giveBodies(headline);
headline.forEach((L) => { L.face = faceMat.clone(); L.face.emissive = new THREE.Color(PAL.accent); L.face.emissiveIntensity = 0; L.mesh.material = [L.face, blueMat]; });   // each letter can light up on its own
const lastL = headline[headline.length - 1];
const gapA = headline[3].x1, gapB = headline[4].x0;
const SX = headline.right + 1.7;                         // the street runs down -z from here

// the box, far to the left of the headline
const BX = X0 - 16.6, BS = 1.36, BH = 1.05;
// LIGHTS: the word it knocks over to switch the page to night
const lightsW = makeWord('LIGHTS', { size: 1.25, depth: 0.45, left: BX + 4.9, z: -1.3 });
lightsW.forEach((L) => { L.pivot = V3(L.home.x, L.home.y - L.half.y, L.home.z - L.half.z); L.face = faceMat.clone(); L.face.color.set('#ffe9a6'); L.face.emissive = new THREE.Color('#ffc94d'); L.face.emissiveIntensity = 1.3; L.mesh.material = [L.face, blueMat]; });      // each letter is a lamp: lit while it stands, dark once it is down
const haloTex = (() => { const { k, tex } = canvasTex(128, 128); const g = k.createRadialGradient(64, 64, 4, 64, 64, 64); g.addColorStop(0, 'rgba(255,255,255,1)'); g.addColorStop(0.45, 'rgba(255,255,255,0.42)'); g.addColorStop(1, 'rgba(255,255,255,0)'); k.fillStyle = g; k.fillRect(0, 0, 128, 128); return tex; })();
lightsW.forEach((L) => { L.halo = new THREE.Mesh(new THREE.PlaneGeometry(L.half.x * 2 + 2.6, L.half.y * 2 + 1.7), new THREE.MeshBasicMaterial({ map: haloTex, color: '#ffb84a', transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, fog: false })); L.halo.position.set(L.home.x, L.home.y + 0.6, L.home.z - L.half.z - 0.08); L.halo.renderOrder = -1; scene.add(L.halo); });      // the glow each letter throws on the air behind it
const signLamp = new THREE.PointLight('#ffe2a8', 0, 11, 1.5); scene.add(signLamp);
const Lx0 = lightsW[0].x0, Lx1 = lightsW[5].x1;
const S0 = V3(Lx0 - 0.7, 0, -0.3), S1 = V3(Lx1 + 0.5, 0, -0.3);
// the screen it finds in front of it once it is out of the box and has said hello. You watch its first film from inside its head.
// It stands where you were standing: 6.6 in front of the spot it lands on, facing it.
const film = createIntroFilm({ PAL, DISPLAY, MONO });
const SCREEN = V3(BX + 3.1, 2.4, 7.3);
const wallA = makeWall(SCREEN.x, SCREEN.z, Math.PI, (k, u, t, on, vid) => film(k, u, t, on, vid));
// The film itself, made with Higgsfield (Seedance 2.5, from pictures of this robot). It plays in its own time, not with the scroll.
// If it can't load, the drawn film in intro-film.js plays instead.
// crossOrigin: the film and the photos below are drawn into the 3D scene, and a browser only allows that for pictures it may read.
// Inside a locked-down frame (Aura's preview, some embeds) the page has no origin of its own, so even its own files count as
// someone else's unless they are asked for this way. Without it the wall stayed blank there.
const filmVid = Object.assign(document.createElement('video'), { crossOrigin: 'anonymous', src: 'media/mosey-at-home.mp4', preload: 'auto', muted: true, playsInline: true });
filmVid.setAttribute('playsinline', '');
const filmS = { where: null, t: 0, done: false, sound: true }, FILM_LEN = 40;
const filmReady = () => filmVid.readyState >= 2 && !filmVid.error;
const photos = ['kitchen', 'keys', 'night'].map((n) => Object.assign(new Image(), { crossOrigin: 'anonymous', src: `media/photo-${n}.webp` }));      // its photo album: three Higgsfield pictures of it at home
// Each photo is decoded as soon as it has arrived, off the main thread (im.bmp). The wall then draws a ready picture. Without this
// the browser decoded all three the first time the album was drawn, which was a stall of several frames on a slow phone.
if (window.createImageBitmap) photos.forEach((im) => { const go = () => createImageBitmap(im).then((b) => { im.bmp = b; }).catch(() => {}); if (im.complete && im.naturalWidth) go(); else im.addEventListener('load', go, { once: true }); });
wallA.g.visible = false;

// what it does: three words, each with a screen floating over the path
const Z = { talksWord: -8, bump: -7.4, talk: -11.4, dive: -15.6, seesWord: -18.5, sock: -24.5, sofa: -32, cat: -41, stove: -47, surface: -51, nap: -55, life: -59.5, photo: -67, details: -77, plinth: -81 };
const talks = makeWord('TALKS', { size: 2.1, depth: 0.9, z: Z.talksWord, physics: [4] });        // its S is the one Mosey walks into
shiftWord(talks, SX - (talks[4].x0 + talks[4].x1) / 2); giveBodies(talks);      // the S stands right in its way. It walks through the word and the S goes flying. solidWall(talks.slice(0, 4));
const bumpS = talks[4];
const GAP = 1.35;
const probe = makeWord('SE', { size: 3.3, depth: 1.1, z: 0, add: false });
const sees = makeWord('SEES', { size: 3.3, depth: 1.1, z: Z.seesWord, gaps: { 2: GAP } });      // a gate. On the other side you see what it sees.
shiftWord(sees, SX - (probe.right + GAP / 2 - 0.02)); solidWall(sees.slice(0, 2)); solidWall(sees.slice(2));

// what it says: a speech card that floats beside it and types its answers
const QA = [['Mosey, pasta timer?', 'Nine minutes. I\'ll come and find you.'], ['Mosey, what\'s 7 times 8?', '56. Five, six, seven, eight: 56 is 7 times 8.'], ['Tell me a joke.', 'Why did I cross the page? You kept scrolling.']];
const speech = (() => {
  const { k, tex } = canvasTex(768, 432);
  const m = new THREE.Mesh(new THREE.PlaneGeometry(2.5, 1.406), new THREE.MeshBasicMaterial({ map: tex, transparent: true, fog: false, toneMapped: false, depthWrite: false }));
  m.visible = false; m.renderOrder = 5; scene.add(m);
  const wrap = (text, x, y, w, lh) => { let line = ''; for (const word of text.split(' ')) { if (k.measureText(line + word).width > w && line) { k.fillText(line, x, y); y += lh; line = ''; } line += word + ' '; } k.fillText(line, x, y); };
  return { m, paint(i, n, t) {
    k.clearRect(0, 0, 768, 432); k.textAlign = 'left';
    const [q, a] = QA[i];
    k.font = `30px ${DISPLAY}`; const qw = Math.min(748, Math.ceil(k.measureText(q).width) + 60); rr(k, 768 - qw - 10, 10, qw, 70, 35, PAL.ink); k.fillStyle = '#fff'; k.fillText(q, 768 - qw + 20, 56);      // the dark bubble is as wide as its question. At a fixed 420 the longest one ran off the edge
    if (n > 0) {
      k.font = `44px ${DISPLAY}`; let lines = 1, line = ''; for (const word of a.split(' ')) { if (k.measureText(line + word).width > 630 && line) { lines++; line = ''; } line += word + ' '; }      // the bubble is as tall as the whole answer needs, from the first letter
      const bh = 96 + 2 * 54;                                                                      // every answer is two lines, so the bubble never changes size
      rr(k, 10, 104, 700, bh, 36, PAL.accent); k.fillStyle = PAL.accent; k.beginPath(); k.moveTo(50, 90 + bh); k.lineTo(20, 170 + bh); k.lineTo(130, 100 + bh); k.fill();
      k.fillStyle = PAL.onAccent; wrap(a.slice(0, n), 46, 176, 630, 54);
      if (n < a.length) for (let j = 0; j < 7; j++) { const h = 8 + Math.abs(Math.sin(t * 9 + j)) * 26; rr(k, 560 + j * 18, 68 + bh - h / 2, 10, h, 5, PAL.onAccent); }      // its voice, while it is speaking
    }
    tex.needsUpdate = true;
  } };
})();

// its home, at its own scale. From 14 cm up, a sofa is a building and a sock is a landmark. The furniture is built in home-kit.js.
const homeKit = createHome({ THREE, RoundedBoxGeometry, PAL, SX, Z });
const home = homeKit.group; home.visible = false; scene.add(home);
const keyObj = homeKit.keyObj;
const ping = new THREE.Mesh(new THREE.RingGeometry(0.9, 1, 48), new THREE.MeshBasicMaterial({ color: PAL.accent, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide, fog: false }));
ping.rotation.x = -Math.PI / 2; ping.position.copy(keyObj.position).setY(0.04); scene.add(ping);
// what its lens picks out on the way through
const SEEN = [
  { p: V3(SX - 1.05, 0.22, Z.sock + 0.25), name: 'Sock', line: 'The other one. Finally.' },
  { p: V3(SX - 1.5, 0.4, Z.sofa + 1.5), name: 'Dust', line: 'Not my job.' },
  { p: V3(SX + 1.1, 0.25, Z.sofa - 1.2), name: 'Keys', line: 'Last seen 8:14. Found.' },
  { p: V3(SX - 2.9, 1.3, Z.cat), name: 'Cat', line: 'Asleep. Do not disturb.' },
  { p: V3(SX + 3.9, 6.3, Z.stove - 1), name: 'Stove', line: 'Off. I checked twice.' },
];
const hud = document.getElementById('hud'), iris = document.getElementById('iris'), hudA = hud.querySelector('.hud-a'), hudB = hud.querySelector('.hud-b');
SEEN.forEach((t) => { t.el = document.createElement('div'); t.el.className = 'vtag'; t.el.innerHTML = `<i><u></u><u></u><u></u><u></u></i><em></em><p><b>${t.name}</b><span>${t.line}</span><small></small></p>`; t.dist = t.el.querySelector('em'); t.conf = t.el.querySelector('small'); hud.appendChild(t.el); });
// the pulse it sends out along the floor to measure the room
const scanRing = new THREE.Mesh(new THREE.RingGeometry(0.965, 1, 96), new THREE.MeshBasicMaterial({ color: PAL.accent, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide, fog: false, blending: THREE.AdditiveBlending }));
scanRing.rotation.x = -Math.PI / 2; scanRing.visible = false; scene.add(scanRing);
const povLamp = new THREE.PointLight('#ffe2a0', 0, 9, 1.4); scene.add(povLamp);
const povLook = V3();
// the dock it charges on (props-kit.js): a ring of lights fills as the battery does, and rings pulse from its antenna while it charges
const dockKit = createDock({ THREE, PAL, DISPLAY, MONO }), dock = dockKit.group; dock.position.set(SX, 0, Z.nap); dock.rotation.y = -1.75; scene.add(dock);      // turned so the display is beside it, facing you, and clear of the way it walks on
const pulse = createAntennaPulse({ THREE, PAL }); scene.add(pulse.group);

// at home: a wall it projects photos and film on. The pictures are drawn stand-ins, the Higgsfield photos and the film go here.
const scenes = [
  (k) => { const g = k.createLinearGradient(0, 0, 0, 600); g.addColorStop(0, '#dfe7ea'); g.addColorStop(1, '#c9d3d6'); k.fillStyle = g; k.fillRect(0, 0, 480, 600); k.fillStyle = '#c59a6c'; k.fillRect(0, 400, 480, 200); k.fillStyle = '#2a2a31'; k.fillRect(250, 210, 200, 150); k.fillStyle = '#9fb6ff'; k.fillRect(262, 222, 176, 120); k.fillStyle = '#2a2a31'; k.fillRect(330, 360, 40, 44); k.fillStyle = '#f3ead9'; k.beginPath(); k.ellipse(120, 420, 46, 14, 0, 0, 7); k.fill(); k.fillRect(78, 350, 84, 70); tinyMosey(k, 200, 368, 34); },
  (k) => { k.fillStyle = '#f2dcc0'; k.fillRect(0, 0, 480, 600); k.fillStyle = '#9fd0ee'; k.fillRect(60, 40, 360, 330); k.fillStyle = '#fff6df'; k.fillRect(60, 40, 360, 20); k.fillRect(232, 40, 16, 330); k.fillStyle = '#e9c9a2'; k.fillRect(30, 370, 420, 36); k.fillStyle = 'rgba(255,240,200,.55)'; k.beginPath(); k.moveTo(60, 406); k.lineTo(420, 406); k.lineTo(480, 600); k.lineTo(0, 600); k.fill(); tinyMosey(k, 300, 318, 40); k.fillStyle = '#3d7a52'; k.beginPath(); k.ellipse(130, 300, 30, 60, 0.2, 0, 7); k.ellipse(160, 310, 24, 50, -0.4, 0, 7); k.fill(); k.fillStyle = '#b5673d'; k.fillRect(112, 340, 62, 34); },
  (k, t = 0) => { k.fillStyle = '#cfe3d6'; k.fillRect(0, 0, 480, 600); k.fillStyle = '#f6efe2'; for (let y = 380; y < 600; y += 55) for (let x = (y / 55) % 2 ? 0 : 55; x < 480; x += 110) k.fillRect(x, y, 55, 55); k.fillStyle = '#b9d2c2'; k.fillRect(0, 380, 480, 4); k.fillStyle = '#f4f1ea'; k.fillRect(40, 120, 190, 262); k.fillStyle = '#d9d2c4'; k.fillRect(40, 244, 190, 6); k.fillStyle = '#e8452c'; k.beginPath(); k.ellipse(380, 470, 44, 16, 0, 0, 7); k.fill(); tinyMosey(k, 290 + Math.sin(t * 1.1) * 70, 440 + Math.abs(Math.sin(t * 6)) * -6, 44); },
];
const SLOTS = ['Recipe', 'Film', 'Photos', 'Stars'];
// What is on and by the wall at home, beside the picture: an oak shelf with a print, books and a plant, a brass wall lamp,
// a rope basket with a folded blanket, and further along two big books on the floor with a mug on top.
// Each part is baked into one of a few meshes, one mesh per kind of surface, and carries its own colour.
const dressWall = (g, cy) => {
  const bins = { matte: [], glaze: [], brass: [], leaf: [], lit: [], glow: [], shade: [] }, m4 = new THREE.Matrix4(), q4 = new THREE.Quaternion(), eu = new THREE.Euler(), c3 = new THREE.Color();
  const put = (bin, geo, col, x, y, z, rx = 0, ry = 0, rz = 0) => {      // turned about z, then x, then y, and set down at x, y, z
    const o = geo.index ? geo.toNonIndexed() : geo; o.applyMatrix4(m4.compose(V3(x, y - cy, z), q4.setFromEuler(eu.set(rx, ry, rz, 'YXZ')), V3(1, 1, 1)));
    const n = o.attributes.position.count; let cs = o.attributes.color && o.attributes.color.array; if (!cs) { cs = new Float32Array(n * 3); c3.set(col); for (let i = 0; i < n; i++) c3.toArray(cs, i * 3); }
    bins[bin].push({ position: o.attributes.position.array, normal: o.attributes.normal.array, color: cs }); };
  const bake = (bin, mat, shadow = true, tint = 3) => { const geo = new THREE.BufferGeometry();
    for (const name of ['position', 'normal', 'color']) { const a = new Float32Array(bins[bin].reduce((s, o) => s + o[name].length, 0)); let at = 0; for (const o of bins[bin]) { a.set(o[name], at); at += o[name].length; } geo.setAttribute(name, new THREE.BufferAttribute(a, name === 'color' ? tint : 3)); }
    const m = new THREE.Mesh(geo, mat); m.castShadow = shadow; g.add(m); return m; };
  const lathe = (pts, seg = 22) => new THREE.LatheGeometry(pts.map(([r, y]) => new THREE.Vector2(r, y)), seg);
  const fan = (rx, ry, vals, dark = false, seg = 20) => { const p = [], c = [], at = (i, k) => { const a = i / seg * Math.PI * 2, r = k / (vals.length - 1); p.push(Math.cos(a) * rx * r, Math.sin(a) * ry * r, 0); if (dark) c.push(1, 1, 1, vals[k]); else c.push(vals[k], vals[k], vals[k]); };      // a soft round patch, strongest in the middle and gone at the rim: a glow, or a shadow if dark
    for (let i = 0; i < seg; i++) for (let k = 0; k < vals.length - 1; k++) { at(i, k); at(i + 1, k + 1); at(i, k + 1); if (k) { at(i, k); at(i + 1, k); at(i + 1, k + 1); } }
    const f = new THREE.BufferGeometry(); f.setAttribute('position', new THREE.Float32BufferAttribute(p, 3)); f.setAttribute('color', new THREE.Float32BufferAttribute(c, dark ? 4 : 3)); f.computeVertexNormals(); return f; };
  const OAK = '#b88a55', LINEN = '#efe7d8', PAGES = '#f3ecdc', TERRA = '#c2633f', BRASS = '#d8b468', GREENS = ['#2f6b47', '#3a7d55', '#27583c', '#468a5c'];
  // a hardback standing on its tail with its spine towards you: two boards, a spine with two thin bands, and the pages set back between them
  const book = (x, y, z, a, b, c, col, band, rx = 0, ry = 0, rz = 0) => { const t = 0.022;
    for (const s of [-1, 1]) put('matte', new THREE.BoxGeometry(t, b, c).translate(s * (a - t) / 2, b / 2, 0), col, x, y, z, rx, ry, rz);
    put('matte', new THREE.BoxGeometry(a, b, t).translate(0, b / 2, (c - t) / 2), col, x, y, z, rx, ry, rz);
    for (const h of [0.14, 0.84]) put('matte', new THREE.BoxGeometry(a, 0.014, 0.006).translate(0, b * h, c / 2), band, x, y, z, rx, ry, rz);
    put('matte', new THREE.BoxGeometry(a - 2 * t, b - 0.03, c - t - 0.035).translate(0, b / 2, -t / 2 - 0.0175), PAGES, x, y, z, rx, ry, rz); };
  // a leaf: narrow at the stalk, widest a third of the way up, folded a little along its rib and curling over at the tip
  const leaf = (len, wid, bend, up = 0) => { const p = [], idx = [], rows = 6;
    for (let i = 0; i <= rows; i++) { const t = i / rows, w = wid * Math.pow(Math.sin(Math.PI * Math.pow(t, 0.62)), 0.85), a = bend * t, y = up + len * (a ? Math.sin(a) / bend : t), z = a ? len * (1 - Math.cos(a)) / bend : 0;
      p.push(-w, y, z + w * 0.22, 0, y, z, w, y, z + w * 0.22); if (i) { const o = i * 3; idx.push(o - 3, o - 2, o + 1, o - 3, o + 1, o, o - 2, o - 1, o + 2, o - 2, o + 2, o + 1); } }
    const f = new THREE.BufferGeometry(); f.setAttribute('position', new THREE.Float32BufferAttribute(p, 3)); f.setIndex(idx); f.computeVertexNormals(); return f; };

  // the shelf: a thick oak board with a rounded edge, on two brass pegs
  const sx = -4.66, ty = 3.365;
  put('matte', new RoundedBoxGeometry(1.9, 0.13, 0.52, 3, 0.055), OAK, sx, ty - 0.065, 0.31);
  for (const dx of [-0.66, 0.66]) put('brass', new THREE.CylinderGeometry(0.028, 0.028, 0.42, 10), BRASS, sx + dx, ty - 0.16, 0.26, Math.PI / 2);
  { // a framed print leans against the wall at one end: coloured shapes on cream paper
    const part = (bin, geo, col, x, y, z) => put(bin, geo.translate(x, y + 0.51, z), col, sx - 0.5, ty, 0.2, -0.1, 0.06);
    for (const [w, h, x, y] of [[0.8, 0.04, 0, 0.49], [0.8, 0.04, 0, -0.49], [0.04, 0.94, -0.38, 0], [0.04, 0.94, 0.38, 0]]) part('matte', new THREE.BoxGeometry(w, h, 0.05), PAL.ink, x, y, 0);
    part('matte', new THREE.BoxGeometry(0.74, 0.96, 0.012), '#f6f0e3', 0, 0, -0.012);
    part('matte', new THREE.CircleGeometry(0.17, 28), PAL.deep, -0.07, 0.15, 0); part('matte', new THREE.CircleGeometry(0.21, 24, 0, Math.PI), PAL.accent, 0.07, -0.16, 0.003);
    part('matte', new THREE.BoxGeometry(0.1, 0.3, 0.002), TERRA, 0.2, 0.2, 0.004); part('matte', new THREE.BoxGeometry(0.5, 0.012, 0.002), PAL.ink, 0, -0.2, 0.006);
  }
  // books of different sizes, the last one leaning on the others
  [[0.17, 0.68, 0.34, PAL.deep, LINEN], [0.12, 0.56, 0.32, PAL.accent, PAL.ink]].reduce((x, [a, b, c, col, band]) => { book(x + a / 2, ty, 0.37, a, b, c, col, band); return x + a + 0.012; }, sx - 0.06);
  book(sx + 0.42, ty, 0.37, 0.15, 0.63, 0.34, PAL.ink, LINEN, 0, 0, 0.17);
  put('shade', fan(1.2, 0.3, [0.2, 0.1, 0], true), 0, sx, ty - 0.22, 0.054);      // the shelf's shadow on the wall under it
  { // a terracotta pot with a plant in it, and one stem trailing over the edge of the shelf
    const px = sx + 0.72, pz = 0.3;
    put('matte', lathe([[0.001, 0], [0.15, 0], [0.19, 0.3], [0.2, 0.33], [0.186, 0.345], [0.168, 0.33], [0.165, 0.27], [0.001, 0.27]]), TERRA, px, ty, pz);
    put('matte', new THREE.CircleGeometry(0.166, 18), '#3a2c20', px, ty + 0.275, pz, -Math.PI / 2);
    for (let i = 0; i < 11; i++) { const yaw = i * 2.4 + 0.5, lean = 0.2 + 0.62 * ((i * 0.37) % 1), stalk = 0.16 + 0.26 * ((i * 0.61) % 1), size = 0.26 + 0.12 * ((i * 0.83) % 1);
      put('leaf', new THREE.CylinderGeometry(0.009, 0.012, stalk, 5).translate(0, stalk / 2, 0), '#2a5a3c', px, ty + 0.27, pz, lean, yaw);
      put('leaf', leaf(size, size * 0.3, 1.1, stalk), GREENS[i % 4], px, ty + 0.27, pz, lean, yaw); }
    put('leaf', new THREE.CylinderGeometry(0.008, 0.008, 0.36, 5).translate(0, -0.18, 0), '#2a5a3c', px + 0.06, ty + 0.34, pz + 0.17, 0.75);
    put('leaf', new THREE.CylinderGeometry(0.008, 0.008, 0.72, 5).translate(0, -0.36, 0), '#2a5a3c', px + 0.06, ty + 0.08, pz + 0.3, 0, 0, 0.05);
    for (let i = 0; i < 6; i++) put('leaf', leaf(0.2, 0.068, 0.7), GREENS[(i + 1) % 4], px + 0.06 + i * 0.006, ty + 0.02 - i * 0.125, pz + 0.3, 0.25, 0, Math.PI + (i % 2 ? 0.95 : -0.95));
  }
  { // the wall lamp: a brass plate, a brass arm that curves up to the bulb, an ink dome over it that is bright inside, and the pool of light it paints on the wall
    const lx = 4.2, ly = 4.3, R = 0.38, lz = 0.07 + R;
    put('brass', new THREE.CylinderGeometry(0.13, 0.13, 0.035, 26), BRASS, lx, ly - 0.28 - R, 0.068, Math.PI / 2); put('brass', new THREE.TorusGeometry(R, 0.022, 8, 16, Math.PI / 2), BRASS, lx, ly - 0.28, 0.07, 0, -Math.PI / 2, -Math.PI / 2);
    put('brass', new THREE.CylinderGeometry(0.05, 0.04, 0.1, 14), BRASS, lx, ly - 0.25, lz); put('lit', new THREE.SphereGeometry(0.085, 14, 10), '#fff3d4', lx, ly - 0.14, lz);
    put('matte', lathe([[0.34, -0.3], [0.326, -0.23], [0.282, -0.14], [0.2, -0.065], [0.1, -0.026], [0.001, -0.02]], 28), PAL.ink, lx, ly, lz);
    put('lit', lathe([[0.001, -0.04], [0.1, -0.046], [0.19, -0.082], [0.266, -0.152], [0.308, -0.235], [0.322, -0.3], [0.34, -0.3]], 28), '#ffdca6', lx, ly, lz);
    put('glow', fan(1.25, 1.7, [0.2, 0.07, 0.016, 0]), 0, lx, ly - 1.15, 0.057); put('glow', fan(0.62, 0.62, [0.1, 0.03, 0.006, 0]), 0, lx, ly - 0.2, lz + 0.36);
  }
  { // the basket: coils of rope, wider in the middle, with two leather handles. In it a blanket folded in three, the top fold slipping out over the rim.
    const bx = 3.95, bz = 0.95, coils = [0.45, 0.505, 0.54, 0.56, 0.565, 0.555, 0.54, 0.525];
    coils.forEach((r, i) => put('matte', new THREE.TorusGeometry(r, 0.064, 6, 26), i === 7 ? '#a98558' : i % 2 ? '#c9a878' : '#c2a06e', bx, 0.066 + i * 0.116, bz, Math.PI / 2));
    put('matte', new THREE.CylinderGeometry(0.5, 0.42, 0.84, 20, 1, true), '#8a6d47', bx, 0.44, bz);
    for (const s of [-1, 1]) put('matte', new THREE.TorusGeometry(0.12, 0.022, 6, 12, Math.PI), '#8f5f36', bx + s * 0.56, 0.9, bz, 0, Math.PI / 2);
    put('shade', fan(0.9, 0.78, [0.36, 0.26, 0.08, 0], true), 0, bx, 0.019, bz + 0.04, -Math.PI / 2);      // and the shadow it sits in
    for (const [w, h, d, x, y, z, rx, ry, rz] of [[0.84, 0.2, 0.66, 0, 0.9, 0, 0, 0.16, 0.02], [0.78, 0.19, 0.6, 0.02, 1.06, 0.03, 0, -0.1, -0.04], [0.7, 0.18, 0.6, -0.03, 1.14, 0.3, 0.5, 0.12, 0]]) {
      put('matte', new RoundedBoxGeometry(w, h, d, 3, 0.088), LINEN, bx + x, y, bz + z, rx, ry, rz);
      for (const dx of [0.14, 0.24]) put('matte', new RoundedBoxGeometry(w, h + 0.008, d + 0.008, 3, 0.088).scale(0.05 / w, 1, 1).translate(dx, 0, 0), PAL.deep, bx + x, y, bz + z, rx, ry, rz); }      // two blue stripes run over every fold
  }
  { // further along the wall, on the floor: two big books lying flat with their pages towards the room, and a mug of coffee on top
    const fx = -8.6, fz = 0.95; let y = 0;
    for (const [a, b, c, col, band, ry] of [[0.3, 1.9, 1.36, PAL.ink, PAL.accent, Math.PI + 0.1], [0.24, 1.7, 1.2, PAL.deep, LINEN, Math.PI - 0.12]]) { book(fx, y + a / 2, fz, a, b, c, col, band, 0, ry, Math.PI / 2); y += a; }
    put('shade', fan(1.5, 1.05, [0.3, 0.24, 0.08, 0], true), 0, fx + 0.95, 0.019, fz, -Math.PI / 2);
    const mx = fx + 0.75, mz = fz + 0.05;
    put('glaze', lathe([[0.001, 0], [0.26, 0], [0.3, 0.04], [0.3, 0.55], [0.288, 0.575], [0.272, 0.56], [0.268, 0.1], [0.001, 0.07]], 26), PAL.accent, mx, y, mz);
    put('glaze', new THREE.TorusGeometry(0.16, 0.04, 8, 14, Math.PI), PAL.accent, mx + 0.29, y + 0.3, mz, 0, 0, -Math.PI / 2); put('matte', new THREE.CircleGeometry(0.27, 22), '#3b2416', mx, y + 0.5, mz, -Math.PI / 2);
  }
  bake('matte', new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.72 })); bake('glaze', new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.26 }));
  bake('brass', new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.38, metalness: 0.45 })); bake('leaf', new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.5, side: THREE.DoubleSide }));
  bake('lit', new THREE.MeshBasicMaterial({ vertexColors: true, side: THREE.DoubleSide, toneMapped: false }), false);      // the inside of the lamp is not lit by anything: it is the light
  bake('shade', new THREE.MeshBasicMaterial({ color: '#2b2218', vertexColors: true, transparent: true, depthWrite: false, side: THREE.DoubleSide }), false, 4);
  return bake('glow', new THREE.MeshBasicMaterial({ color: '#ffcf8a', vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide, fog: false, toneMapped: false }), false);      // the lamp's glow is handed back, so the page can turn it up as the room goes dark
};
// The four screens it projects at home. Each is drawn on a 1600 by 900 sheet with an 88 margin, whatever size the canvas is,
// and is only drawn again when what it shows has changed.
const wallScreens = (() => {
  const INK = PAL.ink, INK2 = 'rgba(21,21,26,0.6)', CREAM = '#fff6e0', DIMW = 'rgba(255,246,224,0.66)'; let last = '';
  const label = (k, s, x, y, px, col, align = 'left') => { k.font = `600 ${px}px ${MONO}`; k.letterSpacing = `${(px * 0.14).toFixed(1)}px`; k.textAlign = align; k.fillStyle = col; k.fillText(s, x, y); k.letterSpacing = '0px'; k.textAlign = 'left'; };
  const head = (k, s, x, y, px, col, align = 'left') => { k.font = `${px}px ${DISPLAY}`; k.textAlign = align; k.fillStyle = col; k.fillText(s, x, y); k.textAlign = 'left'; };
  const dot = (k, x, y, r, col) => { k.fillStyle = col; k.beginPath(); k.arc(x, y, r, 0, 7); k.fill(); };
  const top = (k, a, b, colA, colB, ring) => {                    // every screen starts the same way: its eye, what this is, and a note on the right
    dot(k, 105, 112, 17, ring); dot(k, 105, 112, 13, PAL.accent); dot(k, 105, 112, 7.5, INK); dot(k, 102.5, 109.5, 2.2, '#fff');
    label(k, a, 140, 122, 28, colA); label(k, b, 1512, 122, 28, colB, 'right'); };
  const clock = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  const recipe = (k, left) => {                                   // a recipe on the kitchen wall, with the timer it is keeping
    k.fillStyle = CREAM; k.fillRect(0, 0, 1600, 900);
    top(k, 'RECIPE · TOMATO RIGATONI', 'SERVES 2 · 25 MIN', INK, INK2, INK); k.fillStyle = 'rgba(21,21,26,0.14)'; k.fillRect(88, 160, 1424, 2);
    label(k, 'STEP 02 / 05', 88, 262, 34, PAL.deep);
    head(k, 'Simmer the', 82, 402, 136, INK); head(k, 'sauce.', 82, 530, 136, INK);
    k.font = `600 36px ${MONO}`; k.fillStyle = 'rgba(21,21,26,0.8)'; k.fillText('Low heat. Stir now and then.', 90, 606);
    let x = 88; for (const [name, qty] of [['TOMATOES', '400 G'], ['GARLIC', '2'], ['BASIL', '6']]) {      // what goes in at this step
      k.font = `600 26px ${MONO}`; k.letterSpacing = '3.6px'; const w1 = k.measureText(name).width, w = w1 + k.measureText(qty).width + 66; k.letterSpacing = '0px';
      k.strokeStyle = 'rgba(21,21,26,0.26)'; k.lineWidth = 2.5; k.beginPath(); k.roundRect(x, 648, w, 60, 30); k.stroke();
      label(k, name, x + 26, 687, 26, INK); label(k, qty, x + 40 + w1, 687, 26, PAL.deep); x += w + 14; }
    for (let i = 0; i < 5; i++) rr(k, 88 + i * 100, 784, 86, 12, 6, i < 1 ? INK : i === 1 ? PAL.deep : 'rgba(21,21,26,0.2)');      // five steps: one done, this one, three to go
    head(k, 'Cook the pasta', 1512, 804, 42, INK, 'right'); label(k, 'NEXT', 1484 - k.measureText('Cook the pasta').width, 801, 26, INK2, 'right');
    const cx = 1268, cy = 446, r = 196, u = left / 540, a1 = -Math.PI / 2 + u * Math.PI * 2;
    k.lineWidth = 26; k.strokeStyle = 'rgba(21,21,26,0.08)'; k.beginPath(); k.arc(cx, cy, r, 0, 7); k.stroke();
    k.strokeStyle = PAL.accent; k.lineCap = 'round'; k.beginPath(); k.arc(cx, cy, r, -Math.PI / 2, a1); k.stroke(); k.lineCap = 'butt';
    dot(k, cx + Math.cos(a1) * r, cy + Math.sin(a1) * r, 6, INK);
    k.lineWidth = 2; for (let i = 0; i < 60; i++) { const a = i / 60 * Math.PI * 2, r0 = r - 30, r1 = r0 - (i % 5 ? 7 : 15); k.strokeStyle = i % 5 ? 'rgba(21,21,26,0.16)' : 'rgba(21,21,26,0.42)'; k.beginPath(); k.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); k.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); k.stroke(); }
    head(k, clock(left), cx, cy + 30, 112, INK, 'center'); label(k, 'MIN LEFT', cx, cy + 84, 26, INK2, 'center');
  };

  const filmScr = (k, t) => {                                     // the film, the same one it showed you at the start, with a title and a scrub bar over it
    k.fillStyle = '#0c0d12'; k.fillRect(0, 0, 1600, 900);
    if (filmReady()) k.drawImage(filmVid, 0, 0, 1600, 900); else { k.save(); k.translate(0, -470); k.scale(1600 / 480, 1600 / 480); scenes[2](k, t); k.restore(); }
    let g = k.createLinearGradient(0, 0, 0, 230); g.addColorStop(0, 'rgba(8,8,12,0.62)'); g.addColorStop(1, 'rgba(8,8,12,0)'); k.fillStyle = g; k.fillRect(0, 0, 1600, 230);
    g = k.createLinearGradient(0, 500, 0, 900); g.addColorStop(0, 'rgba(8,8,12,0)'); g.addColorStop(1, 'rgba(8,8,12,0.88)'); k.fillStyle = g; k.fillRect(0, 500, 1600, 400);
    const dur = filmReady() ? filmVid.duration || 30 : 12, now = filmReady() ? filmVid.currentTime : t % 12, u = clamp(now / dur, 0, 1);
    dot(k, 99, 112, 9, '#ff5a3c'); label(k, 'NOW PLAYING', 124, 122, 28, '#fff'); label(k, 'FILM · 40 IN', 1512, 122, 28, DIMW, 'right');
    head(k, 'A day with Mosey', 84, 716, 88, '#fff'); label(k, 'MADE WITH HIGGSFIELD', 88, 762, 28, PAL.accent);
    rr(k, 88, 794, 8, 28, 2, '#fff'); rr(k, 103, 794, 8, 28, 2, '#fff'); label(k, clock(now), 136, 818, 28, '#fff');
    rr(k, 250, 805, 1140, 7, 3.5, 'rgba(255,255,255,0.28)'); rr(k, 250, 805, 1140 * u, 7, 3.5, PAL.accent); dot(k, 250 + 1140 * u, 808.5, 11, PAL.accent);
    label(k, clock(dur), 1512, 818, 28, DIMW, 'right');
  };

  const SHOTS = [[2, 'HALL', '02:12', 'All quiet.', 2.2], [1, 'SOFA', '16:10', 'Found your keys.', 16.17], [0, 'KITCHEN', '18:04', 'Nine minutes left.', 18.07]];      // its day, in the order it happened
  const album = (k, sel) => {                                     // its photo album: three photos side by side, and where in the day each was taken
    const g0 = k.createLinearGradient(0, 0, 0, 900); g0.addColorStop(0, 'rgba(22,23,30,0.9)'); g0.addColorStop(1, 'rgba(30,31,42,0.9)'); k.clearRect(0, 0, 1600, 900); k.fillStyle = g0; k.fillRect(0, 0, 1600, 900);      // not quite solid: a projector has no black, so the wall shows through the dark
    top(k, 'AT HOME WITH MOSEY', 'TODAY · 3 PHOTOS', CREAM, PAL.accent, CREAM);
    SHOTS.forEach(([n, place, time, line], i) => { const x = 88 + i * 484, y = 164, w = 456, h = 556, im = photos[n], on = i === sel;
      k.save(); k.beginPath(); k.roundRect(x, y, w, h, 20); k.clip();
      if (im.complete && im.naturalWidth) { const sc = Math.max(w / im.naturalWidth, h / im.naturalHeight), iw = im.naturalWidth * sc, ih = im.naturalHeight * sc; k.drawImage(im.bmp || im, x + (w - iw) / 2, y + (h - ih) / 2, iw, ih); }
      else { k.save(); k.translate(x, y); k.scale(w / 480, w / 480); scenes[n](k, 0); k.restore(); }
      const g = k.createLinearGradient(0, y + h - 230, 0, y + h); g.addColorStop(0, 'rgba(10,10,14,0)'); g.addColorStop(1, 'rgba(10,10,14,0.84)'); k.fillStyle = g; k.fillRect(x, y + h - 230, w, 230);
      if (!on) { k.fillStyle = 'rgba(22,23,30,0.3)'; k.fillRect(x, y, w, h); }
      k.restore();
      rr(k, x + 20, y + 20, 72, 42, 21, 'rgba(10,10,14,0.6)'); label(k, `0${i + 1}`, x + 58, y + 50, 24, '#fff', 'center');
      label(k, `${place} · ${time}`, x + 28, y + h - 78, 26, PAL.accent); head(k, line, x + 26, y + h - 30, 38, '#fff');
      if (on) { k.strokeStyle = PAL.accent; k.lineWidth = 5; k.beginPath(); k.roundRect(x - 2.5, y - 2.5, w + 5, h + 5, 22); k.stroke(); } });
    k.fillStyle = 'rgba(255,246,224,0.22)'; k.fillRect(88, 777, 1424, 2);
    for (let hr = 0; hr <= 24; hr += 6) { const x = 88 + 1424 * hr / 24; k.fillStyle = 'rgba(255,246,224,0.22)'; k.fillRect(x - 1, 770, 2, 16); label(k, `${String(hr).padStart(2, '0')}:00`, x, 822, 24, DIMW, hr === 0 ? 'left' : hr === 24 ? 'right' : 'center'); }
    SHOTS.forEach((sh, i) => { const x = 88 + 1424 * sh[4] / 24; if (i === sel) { dot(k, x, 778, 13, PAL.accent); dot(k, x, 778, 5, INK); } else dot(k, x, 778, 7, CREAM); });
  };

  // The night sky looking north: the Plough, the Pole Star at the tip of the Little Bear, and Cassiopeia on the far side of it, in the Milky Way.
  const at = ([x, y]) => [860 + (x - 860) * 1.3, 380 + (y - 310) * 1.3];
  const SKY = [
    ['URSA MAJOR', 372, 560, [[407, 193], [474, 214], [508, 244], [540, 292], [492, 331], [515, 411], [570, 395]], [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]]],
    ['URSA MINOR', 814, 626, [[860, 310], [846, 356], [822, 398], [800, 440], [756, 452], [764, 492], [806, 484]], [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 3]]],
    ['CASSIOPEIA', 1298, 300, [[1179, 284], [1141, 259], [1158, 223], [1122, 202], [1146, 162]], [[0, 1], [1, 2], [2, 3], [3, 4]]],
  ].map(([name, lx, ly, pts, lines]) => ({ name, lx, ly, pts: pts.map(at), lines }));
  const bright = SKY.flatMap((c, n) => c.pts.map(([x, y], i) => [x, y, n === 1 && i === 0 ? 4.6 : 2.6 + ((i * 7 + n * 3) % 4) * 0.45]));
  for (let i = 0; i < 26; i++) bright.push([60 + wallRnd() * 1480, 60 + wallRnd() * 600, 1.5 + wallRnd() * 1.6]);
  const sky = (() => { const c = document.createElement('canvas'); [c.width, c.height] = WALL_PX; const k = c.getContext('2d'), s = c.width / 1600; k.setTransform(s, 0, 0, s, 0, 0);
    const g = k.createLinearGradient(0, 0, 0, 900); g.addColorStop(0, 'rgba(5,7,26,0.9)'); g.addColorStop(0.6, 'rgba(10,15,46,0.9)'); g.addColorStop(1, 'rgba(23,30,72,0.9)'); k.fillStyle = g; k.fillRect(0, 0, 1600, 900);
    k.save(); k.translate(1230, 300); k.rotate(-1.02); const mw = k.createLinearGradient(0, -190, 0, 190); mw.addColorStop(0, 'rgba(150,170,255,0)'); mw.addColorStop(0.5, 'rgba(170,185,255,0.1)'); mw.addColorStop(1, 'rgba(150,170,255,0)'); k.fillStyle = mw; k.fillRect(-1200, -190, 2400, 380);
    for (let i = 0; i < 420; i++) dot(k, (wallRnd() - 0.5) * 2200, (wallRnd() + wallRnd() + wallRnd() - 1.5) * 110, 0.5 + wallRnd() * 0.8, `rgba(225,232,255,${(0.15 + wallRnd() * 0.4).toFixed(2)})`); k.restore();
    for (let i = 0; i < 260; i++) dot(k, wallRnd() * 1600, wallRnd() * 900, 0.6 + wallRnd() * 1.2, `rgba(${wallRnd() > 0.3 ? '255,244,214' : '200,216,255'},${(0.2 + wallRnd() * 0.6).toFixed(2)})`);
    k.strokeStyle = 'rgba(170,190,255,0.36)'; k.lineWidth = 1.6;
    for (const c of SKY) { for (const [a, b] of c.lines) { const [x0, y0] = c.pts[a], [x1, y1] = c.pts[b], d = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / d * 11, uy = (y1 - y0) / d * 11; k.beginPath(); k.moveTo(x0 + ux, y0 + uy); k.lineTo(x1 - ux, y1 - uy); k.stroke(); }      // the lines stop short of each star
      label(k, c.name, c.lx, c.ly, 24, 'rgba(190,205,255,0.82)'); }
    label(k, 'POLARIS', 886, 374, 24, PAL.accent);
    const fade = k.createLinearGradient(0, 600, 0, 900); fade.addColorStop(0, 'rgba(5,7,26,0)'); fade.addColorStop(1, 'rgba(5,7,26,0.55)'); k.fillStyle = fade; k.fillRect(0, 600, 1600, 300);
    top(k, 'BEDTIME · 22:30', 'NORTH SKY · TONIGHT', CREAM, DIMW, CREAM);
    head(k, 'Goodnight.', 82, 764, 124, CREAM); label(k, 'STARS ON THE WALL · OFF IN 20 MIN', 88, 814, 28, PAL.accent);
    return c; })();
  const night = (k, t) => {                                       // stars on the wall at bedtime. The sky is drawn once, only the brighter stars twinkle.
    k.clearRect(0, 0, 1600, 900); k.drawImage(sky, 0, 0, 1600, 900);
    bright.forEach(([x, y, r], i) => { const a = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * (1.1 + (i % 5) * 0.45) + i * 2.4)); dot(k, x, y, r * 3.4, `rgba(190,205,255,${(a * 0.1).toFixed(3)})`); dot(k, x, y, r * 1.8, `rgba(255,244,214,${(a * 0.28).toFixed(3)})`); dot(k, x, y, r, `rgba(255,248,230,${a.toFixed(3)})`); });
  };

  return (k, slot, t) => {
    const left = Math.ceil(540 - (t % 540)), sel = Math.floor(t / 4) % 3;
    const key = slot === 0 ? `0 ${left}` : slot === 2 ? `2 ${sel} ${photos.filter((im) => im.complete && im.naturalWidth).length}` : slot === 3 ? `3 ${Math.floor(t * 8)}` : '';
    if (key && key === last) return false; last = key;      // the film is the only screen that changes every time
    const s = k.canvas.width / 1600; k.setTransform(s, 0, 0, s, 0, 0); k.textAlign = 'left';
    if (slot === 0) recipe(k, left); else if (slot === 1) filmScr(k, t); else if (slot === 2) album(k, sel); else night(k, t);
    return [1, 0.5, 0.3, 0.14][slot];
  };
})();
const wallB = makeWall(SX - 5.6, Z.photo, Math.PI / 2, wallScreens, 26, true);

// specs: the plinth
const wallLamp = dressWall(wallB.g, wallB.cy);
const PZ = Z.plinth, PH = 0.3;
const plinth = createPlinth({ THREE, PAL, PH, post: [0, 0] }).group; plinth.position.set(SX, 0, PZ); scene.add(plinth);
for (const c of plinth.children) if (c.isGroup) c.visible = false;      // the kit's measuring post falls outside both camera angles here, and the labels already say 14 cm      // a turntable stand with a ruler round it (props-kit.js)
// colours: a gate, the family behind it, and the colour's name standing behind them
const GATE_X = SX + 5.5;
const gate = new THREE.Group(); gate.position.set(GATE_X, 0, PZ); scene.add(gate);
{ // a sheet of colour hangs in the gate. It walks through the sheet and comes out painted.
  const sheet = new THREE.Mesh(new THREE.PlaneGeometry(1.72, 2.22), new THREE.MeshBasicMaterial({ color: WAYS.tomato.body, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false }));
  sheet.rotation.y = Math.PI / 2; sheet.position.set(0, 1.13, 0); gate.add(sheet); gate.userData.sheet = sheet;
  for (const z of [-0.9, 0.9]) { const foot = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.07, 0.34, 2, 0.03), inkMat); foot.position.set(0, 0.035, z); foot.castShadow = true; gate.add(foot); }
  const drip = new THREE.Mesh(new RoundedBoxGeometry(0.16, 0.1, 1.86, 2, 0.04), new THREE.MeshStandardMaterial({ color: WAYS.tomato.body, roughness: 0.4 })); drip.position.set(0, 2.36, 0); gate.add(drip);      // a bar of the colour along the top
}
{
  const bar = (w, h, d, px, py, pz) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), inkMat); m.position.set(px, py, pz); m.castShadow = true; gate.add(m); };
  bar(0.09, 2.3, 0.09, 0, 1.15, -0.9); bar(0.09, 2.3, 0.09, 0, 1.15, 0.9); bar(0.09, 0.09, 1.89, 0, 2.3, 0);
}
const family = Object.keys(WAYS).filter((key) => key !== 'classic').map((key, i) => {
  const r = createRobot(); r.setWay(key);
  r.root.position.set(GATE_X + 3.6 + i * 1.5, 1.3, PZ - 2.7); r.root.rotation.y = -0.2 + i * 0.12;
  scene.add(r.root); return { r, key, seed: i * 1.7 };
});
const sizes = createSizes({ THREE, RoundedBoxGeometry, scene, family, WAYS, createRobot, mats: { blue: blueMat, ink: inkMat }, at: [GATE_X + 5.1, PZ - 2.7], DISPLAY, MONO, PAL, get robot() { return robot; } });      // the stage they stand on, with a Mosey XL next to them (js/sizes.js)
const shelf = sizes.group; scene.add(shelf);
const nameWords = {}, NAME_X = GATE_X + 5.3, NAME_K = 0.72;      // the colour's name stands behind the stage. With the camera this close it is shown at 0.72, or TOMATO runs off both sides
for (const key of Object.keys(WAYS)) {
  const m = [new THREE.MeshStandardMaterial({ color: WAYS[key].body, roughness: 0.7 }), new THREE.MeshPhysicalMaterial({ color: WAYS[key].body, roughness: 0.4, clearcoat: 0.4 })];
  const w = makeWord(WAYS[key].name.toUpperCase(), { size: 1.5, depth: 0.6, z: PZ - 4.2, mat: m });
  shiftWord(w, GATE_X + 5.3 - (w[0].x0 + w[w.length - 1].x1) / 2); w.k = 0; w.forEach((L) => { L.mesh.visible = false; }); nameWords[key] = w;
}
// price: thin numerals that fall like dominoes
const PRICE_X = SX + 22;
const priceProbe = makeWord('$149', { size: 3.7, depth: 0.55, z: 0, add: false, gaps: { 3: 0.22 } });
const price = makeWord('$149', { size: 3.7, depth: 0.55, left: PRICE_X - priceProbe.right / 2, z: PZ - 3.7, physics: 'block', gaps: { 3: 0.22 } });
giveBodies(price);

// the floor is a thin board with a graph paper grid and an accent edge
const EX = SX + 33, EZ = PZ - 0.5; let floorMesh = null;
{
  const { k, tex } = canvasTex(256, 256);
  k.fillStyle = PAL.ground; k.fillRect(0, 0, 256, 256);
  k.fillStyle = 'rgba(21,21,26,0.085)'; k.fillRect(0, 0, 256, 3); k.fillRect(0, 0, 3, 256);
  k.fillStyle = 'rgba(21,21,26,0.3)'; k.fillRect(0, 0, 14, 3); k.fillRect(0, 0, 3, 14);
  const FW = EX - BX + 50, FCX = (EX + BX - 50) / 2;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(FW, 200); tex.offset.x = (FCX - FW / 2) % 1; tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const top = new THREE.MeshStandardMaterial({ map: tex, roughness: 0.94 }), side = new THREE.MeshStandardMaterial({ color: '#e9e1d4', roughness: 0.95 });
  const floor = floorMesh = new THREE.Mesh(new THREE.BoxGeometry(FW, 0.4, 200), [yellowMat, side, top, new THREE.MeshBasicMaterial({ color: new THREE.Color(PAL.deep).multiplyScalar(0.62) }), side, side]);      // the underside is in its own shadow: deep blue, so it sinks into the drop
  floor.position.set(FCX, -0.2, -50); floor.receiveShadow = true; scene.add(floor);
  const b = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(FCX, -20, -50));
  world.createCollider(RAPIER.ColliderDesc.cuboid(FW / 2, 20, 100).setFriction(0.9), b);
  const p = world.createRigidBody(RAPIER.RigidBodyDesc.fixed().setTranslation(SX, PH / 2, PZ));
  world.createCollider(RAPIER.ColliderDesc.cylinder(PH / 2, 0.95), p);
}
// far below the edge: the last words of the page, and the button it lands on
const FY = -17, ES = 1.7;
const endL2 = makeWord('WALKING.', { size: ES, depth: 0.8, z: EZ, mat: END, base: FY });
shiftWord(endL2, EX + 3.0 - endL2[5].home.x);
const endL1 = makeWord('GONE', { size: ES, depth: 0.8, left: endL2[0].x0, z: EZ, mat: END, base: FY + capHeight(ES) + 0.16 });
const endBox = { cx: (endL2[0].x0 + endL2[endL2.length - 1].x1) / 2, cy: FY + capHeight(ES) + 0.3, w: endL2[endL2.length - 1].x1 - endL2[0].x0 };
{ const g = new THREE.Mesh(new THREE.PlaneGeometry(260, 260), new THREE.MeshStandardMaterial({ color: new THREE.Color(PAL.deep).multiplyScalar(0.92), roughness: 0.9 })); g.rotation.x = -Math.PI / 2; g.position.set(EX, FY, EZ); g.receiveShadow = true; scene.add(g); }
const BTN = V3(endBox.cx, FY, EZ + 4.2);
const ctaKit = createCtaButton({ THREE, PAL, DISPLAY, MONO }), cta = ctaKit.group, capBtn = ctaKit.cap; cta.position.copy(BTN); scene.add(cta);      // the big button (props-kit.js)
const LAND = V3(BTN.x, FY + 0.8, BTN.z - 0.98);      // on the back of the cap, so the word on it stays whole
// When it lands on the button the last words are blown apart. Each letter has a place it ends up lying, worked out once, so scroll can run the blast both ways.
const endLetters = [...endL1, ...endL2];
endLetters.forEach((L, i) => {
  const dx = L.home.x - BTN.x, far = 0.8 + rnd() * 0.9, top = L.home.y > FY + capHeight(ES);
  const side = dx === 0 ? (i % 2 ? 1 : -1) : Math.sign(dx);
  L.rest = V3(BTN.x + side * (3.9 + rnd() * 4.6), FY + L.half.z + 0.03, BTN.z - 3.4 + rnd() * 3.8);      // they come down to the left and right of the button, on the floor, clear of the words under it
  L.arc = 2.4 + rnd() * 3.2 + (top ? 1.6 : 0); L.rot = new THREE.Euler(-Math.PI / 2 - Math.PI * 2 * (1 + (i % 2)), (rnd() - 0.5) * 2.6, (rnd() - 0.5) * 1.2); L.late = Math.abs(dx) * 0.012;
});
{ // streaks in the drop, so you feel the speed going down
  const n = 46, m = new THREE.InstancedMesh(new THREE.BoxGeometry(0.03, 1.5, 0.03), new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.2, fog: false }), n), mx = new THREE.Matrix4();
  for (let i = 0; i < n; i++) { let x = BTN.x + (rnd() - 0.5) * 20; if (Math.abs(x - BTN.x) < 1.6) x += 3.2; mx.makeTranslation(x, FY + 2.5 + rnd() * 13.5, EZ - 5 + rnd() * 14); m.setMatrixAt(i, mx); }
  m.frustumCulled = false; scene.add(m);
}

// the box: closed and taped. Mosey has to get out of it.
// The box is drawn where its body is. At rest that is BOX_HOME, and everything inside is built in world coordinates around it.
const BOX_HOME = V3(BX, BH / 2, 0), BOX_SKY = V3(BX + 0.12, 10, 0.02), DROP_D = 0.3;
const boxDrop = new THREE.Group(), boxInner = new THREE.Group(); boxInner.position.copy(BOX_HOME).negate(); boxDrop.add(boxInner); boxDrop.position.copy(BOX_SKY); boxDrop.visible = false; scene.add(boxDrop);
const boxBody = world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(BOX_SKY.x, BOX_SKY.y, BOX_SKY.z).setCcdEnabled(true).setAngularDamping(1.4));
world.createCollider(RAPIER.ColliderDesc.cuboid(BS / 2, BH / 2, BS / 2).setDensity(0.55).setFriction(0.9).setRestitution(0.02), boxBody);
const drop = { state: 'sky', t: 0, hitT: -1, from: V3(), fromQ: new THREE.Quaternion() };
const Q0 = new THREE.Quaternion();
const boxPivot = new THREE.Group(); boxPivot.position.set(BX - BS / 2, 0, 0); boxInner.add(boxPivot);
const flaps = [];
{
  const kraft = '#c9a373', t = 0.04;
  // Kraft paper: an even tan with fibres, specks, a little scuffing and the faint ribs of the corrugation showing through.
  let sd = 11; const rn = () => (sd = (sd * 16807) % 2147483647) / 2147483647;
  const paper = (k, w, h) => {
    k.fillStyle = kraft; k.fillRect(0, 0, w, h);
    for (let x = 0; x < w; x += 9) { k.fillStyle = `rgba(70,45,15,${0.018 + rn() * 0.03})`; k.fillRect(x, 0, 3, h); }                   // ribs
    for (let i = 0; i < w * h / 260; i++) { const x = rn() * w, y = rn() * h, l = 4 + rn() * 14, a = rn() * 6.28; k.strokeStyle = rn() > 0.5 ? `rgba(255,236,200,${0.05 + rn() * 0.09})` : `rgba(80,52,20,${0.05 + rn() * 0.1})`; k.lineWidth = 0.6 + rn() * 0.8; k.beginPath(); k.moveTo(x, y); k.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); k.stroke(); }      // fibres
    for (let i = 0; i < w * h / 900; i++) { k.fillStyle = `rgba(60,38,12,${0.1 + rn() * 0.2})`; k.fillRect(rn() * w, rn() * h, 1 + rn() * 1.5, 1 + rn() * 1.5); }                 // specks
    for (let i = 0; i < 5; i++) { const x = rn() * w, y = rn() * h, g = k.createRadialGradient(x, y, 0, x, y, 40 + rn() * 80); g.addColorStop(0, `rgba(255,240,210,${0.05 + rn() * 0.05})`); g.addColorStop(1, 'rgba(255,240,210,0)'); k.fillStyle = g; k.fillRect(0, 0, w, h); }      // scuffs
    const e = k.createLinearGradient(0, 0, 0, h); e.addColorStop(0, 'rgba(60,35,10,0.1)'); e.addColorStop(0.06, 'rgba(60,35,10,0)'); e.addColorStop(0.94, 'rgba(60,35,10,0)'); e.addColorStop(1, 'rgba(60,35,10,0.14)'); k.fillStyle = e; k.fillRect(0, 0, w, h);                // worn edges
  };
  const kraftTex = (() => { const { k, tex } = canvasTex(512, 512); paper(k, 512, 512); return tex; })();
  const ribs = (() => { const { k, tex } = canvasTex(256, 64); k.fillStyle = '#808080'; k.fillRect(0, 0, 256, 64); for (let x = 0; x < 256; x += 8) { const g = k.createLinearGradient(x, 0, x + 8, 0); g.addColorStop(0, '#6f6f6f'); g.addColorStop(0.5, '#8e8e8e'); g.addColorStop(1, '#6f6f6f'); k.fillStyle = g; k.fillRect(x, 0, 8, 64); } tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(3, 1); tex.colorSpace = THREE.NoColorSpace; return tex; })();
  const cardMat = new THREE.MeshStandardMaterial({ map: kraftTex, bumpMap: ribs, bumpScale: 0.6, roughness: 0.95 }), inMat = new THREE.MeshStandardMaterial({ map: kraftTex, color: '#c9a98a', bumpMap: ribs, bumpScale: 0.6, roughness: 1 });
  // the cut edge of corrugated board: two liners with a wave of fluting between them
  const flute = (len, turned = false) => { const { k, tex } = canvasTex(64, 32); k.fillStyle = '#b08a58'; k.fillRect(0, 0, 64, 32); k.fillStyle = '#d9b98a'; k.fillRect(0, 0, 64, 5); k.fillRect(0, 27, 64, 5);
    k.strokeStyle = '#7d5c33'; k.lineWidth = 3; k.beginPath(); for (let x = 0; x <= 64; x++) { const y = 16 + Math.sin(x / 64 * Math.PI * 4) * 8; x ? k.lineTo(x, y) : k.moveTo(x, y); } k.stroke();
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping; tex.repeat.set(Math.max(1, Math.round(len / 0.05)), 1); if (turned) { tex.center.set(0.5, 0.5); tex.rotation = Math.PI / 2; }
    return new THREE.MeshStandardMaterial({ map: tex, roughness: 1 }); };
  const tapeMat = new THREE.MeshPhysicalMaterial({ color: PAL.accent, roughness: 0.28, clearcoat: 0.7, clearcoatRoughness: 0.25 });        // packing tape has a sheen that paper doesn't
  const printed = (draw) => { const { k, tex } = canvasTex(1024, 800); paper(k, 1024, 800); k.save(); k.scale(2, 2); k.globalAlpha = 0.93; draw(k); k.restore();
    k.globalCompositeOperation = 'multiply'; k.globalAlpha = 0.35; k.drawImage(kraftTex.image, 0, 0, 1024, 800); k.globalCompositeOperation = 'source-over'; k.globalAlpha = 1;      // the ink sits in the paper, not on top of it
    return new THREE.MeshStandardMaterial({ map: tex, bumpMap: ribs, bumpScale: 0.6, roughness: 0.93 }); };
  const front = printed((k) => {
    k.fillStyle = PAL.deep; k.fillRect(0, 0, 512, 58);
    k.fillStyle = '#fbf8f3'; k.font = `600 19px ${MONO}`; k.textAlign = 'left'; k.fillText('A SMALL AI COMPANION · FIRST EDITION', 28, 37);
    k.fillStyle = PAL.deep; k.font = `112px ${DISPLAY}`; k.fillText('MOSEY', 22, 208);
    k.fillStyle = 'rgba(50,30,10,0.8)'; k.font = `600 21px ${MONO}`; k.fillText('HANDLE WITH CURIOSITY', 30, 254); k.fillText('14 CM · 310 G · WALKS', 30, 284);
    k.fillRect(28, 314, 456, 3); for (let i = 0; i < 30; i++) k.fillRect(30 + i * 4.6, 332, i % 3 ? 2 : 3.6, 40);
    k.fillStyle = PAL.accent; k.beginPath(); k.arc(420, 322, 50, 0, 7); k.fill(); k.fillStyle = PAL.onAccent; k.textAlign = 'center'; k.font = `600 16px ${MONO}`; k.fillText('No.', 420, 306); k.font = `34px ${DISPLAY}`; k.fillText('001', 420, 342); k.textAlign = 'left';
  });
  const side = printed((k) => {
    k.fillStyle = PAL.deep; k.fillRect(0, 0, 512, 58);
    for (const x of [176, 276]) { k.beginPath(); k.moveTo(x, 190); k.lineTo(x + 30, 130); k.lineTo(x + 60, 190); k.lineTo(x + 40, 190); k.lineTo(x + 40, 250); k.lineTo(x + 20, 250); k.lineTo(x + 20, 190); k.fill(); }
    k.font = `40px ${DISPLAY}`; k.textAlign = 'center'; k.fillText('THIS WAY UP', 256, 312); k.fillStyle = 'rgba(50,30,10,0.8)'; k.font = `600 19px ${MONO}`; k.fillText('OR ANY WAY. IT GETS UP.', 256, 346);
  });
  const g = new THREE.Group(); g.position.set(BS / 2, 0, 0); boxPivot.add(g);
  const wall = (w, h, d, x, y, z, mat = cardMat) => { const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; g.add(m); return m; };
  wall(BS - 0.03, t, BS - 0.03, 0, t / 2 + 0.004, 0, inMat);                                    // no two faces share a plane, so nothing flickers when the box moves
  const topZ = flute(BS), topX = flute(BS, true);
  wall(BS, BH, t, 0, BH / 2, -BS / 2, [cardMat, cardMat, topZ, cardMat, inMat, cardMat]); wall(BS, BH, t, 0, BH / 2, BS / 2, [cardMat, cardMat, topZ, cardMat, front, inMat]);
  wall(t, BH, BS - t, -BS / 2, BH / 2, 0, [inMat, cardMat, topX, cardMat, cardMat, cardMat]); wall(t, BH, BS - t, BS / 2, BH / 2, 0, [side, inMat, topX, cardMat, cardMat, cardMat]);
  const pad = wall(BS - 0.14, 0.27, BS - 0.14, 0, 0.06 + 0.135, 0, new THREE.MeshStandardMaterial({ color: '#e6d6b8', roughness: 1 })); pad.castShadow = false;
  for (const s of [-1, 1]) { const tail = wall(0.16, 0.3, 0.008, 0, BH - 0.15, s * (BS / 2 + t / 2 + 0.005), tapeMat); tail.castShadow = false; }
  const flap = (px, pz, axis, sign, w, d, y, outer) => {
    const h = new THREE.Group(); h.position.set(px, y, pz); g.add(h);
    const eX = flute(d), eZ = flute(w);                                    // the flap's cut edges
    const m = new THREE.Mesh(new THREE.BoxGeometry(w, t, d), [eX, eX, cardMat, inMat, eZ, eZ]); m.position.set(axis === 'z' ? sign * w / 2 : 0, 0, axis === 'x' ? sign * d / 2 : 0); m.castShadow = m.receiveShadow = true; h.add(m);
    if (outer) { const tape = new THREE.Mesh(new THREE.BoxGeometry(0.08, t + 0.008, BS + 0.02), tapeMat); tape.position.set(sign * (w - 0.04), 0, 0); h.add(tape); }
    flaps.push({ h, axis, sign, outer, rest: 0.7 + rnd() * 0.3, board: outer && sign > 0 });      // the right-hand lid is the one it climbs out on to
  };
  flap(BS / 2, 0, 'z', 1, BS / 2, BS, BH + t / 2, true); flap(-BS / 2, 0, 'z', -1, BS / 2, BS, BH + t / 2, true);
  flap(0, BS / 2, 'x', 1, BS - 2 * t, BS * 0.28, BH - t / 2 - 0.006, false); flap(0, -BS / 2, 'x', -1, BS - 2 * t, BS * 0.28, BH - t / 2 - 0.006, false);
}
const boxBurst = makeBurst(150, 1.1), landBurst = makeBurst(90, 1.5);
const dust = new THREE.Mesh(new THREE.RingGeometry(0.72, 1, 48), new THREE.MeshBasicMaterial({ color: '#b9ad9a', transparent: true, opacity: 0, depthWrite: false }));
dust.rotation.x = -Math.PI / 2; scene.add(dust);
const LANDP = V3(BX + 3.1, 0, 0.7);

// the hero headline: letters that float, turn and glow. They are real bodies, so the box can land on them.
const heroType = [], heroMeshes = [];
const tall = () => innerWidth / innerHeight < 0.8;
{
  const small = tall(), size = small ? 0.56 : 0.8, depth = small ? 0.18 : 0.26;
  const baseMat = new THREE.MeshPhysicalMaterial({ color: PAL.ink, roughness: 0.3, clearcoat: 0.8, clearcoatRoughness: 0.2, emissive: PAL.accent, emissiveIntensity: 0 });
  ['MEET', 'MOSEY.'].forEach((row, r) => { let x = 0; [...row].forEach((ch) => {
    const G = glyph(ch, size, depth), mesh = new THREE.Mesh(G.g, baseMat.clone()); mesh.castShadow = true; scene.add(mesh);
    const L = { ch, mesh, r, lx: x + G.c.x, ly: G.half.y, half: G.half, home: V3(), homeQ: new THREE.Quaternion(), i: heroType.length, spinT: -9, push: V3(), state: 'float', t: 0, row: small ? [2.72, 1.98][r] : [2.5, 1.5][r] };
    L.body = world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(BX, L.row, 0).setCanSleep(true).setLinearDamping(0.15).setAngularDamping(0.5).setCcdEnabled(true));
    world.createCollider(RAPIER.ColliderDesc.cuboid(G.half.x, G.half.y, G.half.z).setDensity(1.1).setFriction(0.8).setRestitution(0.12), L.body);
    mesh.userData.hero = mesh.userData.letter = L; heroType.push(L); heroMeshes.push(mesh); letters.push(L); letterMeshes.push(mesh);
    x += advance(ch, size) + 0.04; }); heroType.filter((L) => L.r === r).forEach((L) => { L.w = x - 0.04; }); });
}
function placeHero() { for (const L of heroType) L.home.set(BX - L.w / 2 + L.lx, L.row + L.ly, 0.02); }
const heroTop = heroType[0].row + heroType[0].half.y * 2;      // the top of the upper row, where the box first touches
// a hero letter lets go of its place and falls, or flies back to it
function freeHero(L, away = 0) {
  if (L.state !== 'float') return;
  L.body.setBodyType(RAPIER.RigidBodyType.Dynamic, true); L.state = 'free';
  L.body.setLinvel({ x: away * 1.4, y: -1.5, z: (rnd() - 0.4) * 1.6 }, true); L.body.setAngvel({ x: (rnd() - 0.5) * 5, y: (rnd() - 0.5) * 3, z: -away * 3 }, true);
}
function floatHero(L) {
  if (L.state === 'float') return;
  if (L.state === 'homing') { L.after = 'float'; return; }
  L.body.setBodyType(RAPIER.RigidBodyType.KinematicPositionBased, true);
  L.from = V3().copy(L.body.translation()); L.fromQ = new THREE.Quaternion().copy(L.body.rotation()); L.t = 0; L.state = 'homing'; L.after = 'float';
}

/* ---------- the route ---------- */
const PIN = V3(BX - 0.05, 0.33, 0.1), RIMP = V3(BX + BS / 2 + 0.32, BH + 0.014, 0.1);      // on the opened right-hand lid, which lies out like a board
// the way through the plan on the floor: it lands in the living room, goes through the bedroom door, round the bed, and ends in the bath
const PL = planLayout(X0, headline.right);
const PLAN = [[Math.max((gapA + 0.9 - PL.x0) / PL.PW, 0.4), 0.62], [0.47, 0.44], [0.555, 0.76], [0.67, 0.54], [0.693, 0.6], [0.699, 0.9], [0.835, 0.9], [0.858, 0.78], [0.875, 0.63], [0.925, 0.58]].map(([u, v]) => V3(PL.U(u), 0, PL.Zv(v)));      // up to the sofa, down across the rug, through the door, round the bed, into the bath
const PLAN_MARK = [, 'pl1', 'pl2', 'pdoor', , 'bedW', 'bedE'];      // the places the camera changes its mind at
const route = buildRoute([
  { p: PIN },
  { p: PIN, how: 'wait', len: 1.5, mark: 'knock' },                                              // closed box, something moves inside
  { p: PIN, how: 'wait', len: 2.4, act: 'peek', face: 0.45, mark: 'peeked' },                    // the lid lifts, a lens looks out
  { p: RIMP, how: 'climb', len: 2.4, act: 'climb', mark: 'rim' },
  { p: RIMP, how: 'wait', len: 1.4, act: 'teeter', face: 1.2 },
  { p: LANDP, how: 'jump', len: 3.4, act: 'tumble', lift: 1.15, mark: 'out' },
  { p: LANDP, how: 'wait', len: 1.0, act: 'land', face: 0.4 },
  { p: LANDP, how: 'wait', len: 2.6, act: 'wave', face: 0.12, mark: 'landed' },                 // on its feet, it turns to you and waves
  { p: LANDP, how: 'wait', len: 2.8, face: 0, mark: 'present0' },                                // it holds still, and you go in through its lens
  { p: LANDP, how: 'wait', len: 8, act: 'present', face: 0, mark: 'presentEnd' },               // its first film, seen from inside its head
  { p: LANDP, how: 'wait', len: 1.6, face: 0.3, mark: 'filmOut' },                               // and out again, in front of it
  { p: S0, mark: 'slap0' },
  { p: S1, mark: 'slapEnd' },                                                                    // it just walks past the word, arms at its sides (it used to trail a hand along the letters, which read as a stuck-out arm)
  { p: V3(X0 - 1.3, 0, 0), mark: 'headline' },
  { p: V3(headline[0].home.x, H, 0), how: 'jump', lift: 1.7, len: 0.9, act: 'tumble', timed: 1.1, mark: 'onG' },      // a real jump: it takes just under a second however slowly you scroll, in a high arc clear of the letter's edge
  { p: V3(gapA - 0.4, H, 0), mark: 'gone' },                                                     // across the first word, on top of it
  { p: PLAN[0], how: 'jump', lift: 1.4, len: 1.6, act: 'tumble', timed: 1.0, mark: 'gap' },                                           // then off the word and down into the plan it is drawing
  { p: PLAN[0], how: 'wait', len: 0.3, act: 'land' },
  ...PLAN.slice(1).map((p, i, a) => (i === a.length - 1 ? { p, mark: 'tip' } : PLAN_MARK[i + 1] ? { p, mark: PLAN_MARK[i + 1] } : { p })),          // through the doors, room to room, round the bed
  { p: PLAN[PLAN.length - 1], how: 'wait', len: 6.5, mark: 'tipEnd' },                            // it stands in the bath, done, while the camera goes out over the map and down to the dock
  { p: V3(PL.U(PL.UB) + 0.95, 0, PL.Zv(0.5)), how: 'jump', lift: 0.95 },                          // a hop over the outside wall
  { p: V3(SX, 0, 0.3), mark: 'street' },
  { p: V3(SX, 0, Z.bump), mark: 'bump' },
  { p: V3(SX + 0.25, 0, Z.bump - 0.5), how: 'wait', len: 2.2, act: 'stumble' },
  { p: V3(SX, 0, Z.talk), mark: 'talk' },
  { p: V3(SX, 0, Z.talk), how: 'wait', len: 8, act: 'talk', face: 0.55, mark: 'talkEnd' },       // it turns to you. Ask it something.
  { p: V3(SX, 0, Z.dive), mark: 'dive0' },
  { p: V3(SX, 0, Z.dive), how: 'wait', len: 3.2, face: 0.1, mark: 'dive' },                       // it turns round, and you go in through its lens
  { p: V3(SX, 0, Z.sock + 1.8), mark: 'sock' },
  { p: V3(SX, 0, Z.sofa + 0.7), mark: 'sofa' },
  { p: V3(SX, 0, Z.sofa + 0.7), how: 'wait', len: 5, mark: 'sofaEnd' },                           // under the sofa: the keys
  { p: V3(SX, 0, Z.cat + 1.5), mark: 'cat' },
  { p: V3(SX, 0, Z.stove + 4), mark: 'stove' },
  { p: V3(SX, 0, Z.stove + 4), how: 'wait', len: 9.5, mark: 'stoveEnd' },                         // the stove: off. A long stop: here the picture pulls back and turns out to be your phone (js/phone.js)
  { p: V3(SX, 0, Z.surface), mark: 'surface' },
  { p: V3(SX, 0, Z.nap), mark: 'nap' },
  { p: V3(SX, 0, Z.nap), how: 'wait', len: 0.9, face: -0.95 },                                   // it turns round to you first, then sits
  { p: V3(SX, 0, Z.nap), how: 'wait', len: 4.2, act: 'nap', face: -0.95, mark: 'napEnd' },
  { p: V3(SX, 0, Z.nap), how: 'wait', len: 1.5, face: -0.6 },                                    // it gets to its feet first, then turns and goes
  { p: V3(SX, 0, Z.life), mark: 'life' },
  { p: V3(SX, 0, Z.photo), mark: 'photo' },
  { p: V3(SX, 0, Z.photo), how: 'wait', len: 12, act: 'present', face: -Math.PI / 2 - 0.3, mark: 'photoEnd' },   // lights down: what it projects
  { p: V3(SX, 0, Z.details), mark: 'details' },
  { p: V3(SX, 0, PZ + 1.5) },
  { p: V3(SX, PH, PZ), how: 'jump', mark: 'plinth' },
  { p: V3(SX, PH, PZ), how: 'wait', len: 9, act: 'pose', face: 0, mark: 'plinthEnd' },
  { p: V3(SX + 1.7, 0, PZ), how: 'jump', mark: 'family' },
  { p: V3(GATE_X, 0, PZ), mark: 'gate' },
  { p: V3(SX + 15.5, 0, PZ), mark: 'price' },
  { p: V3(PRICE_X, 0, PZ) },
  { p: V3(PRICE_X - 2.0, 0, PZ - 3.02), mark: 'shove' },                                         // right up against the 1
  { p: V3(SX + 27.5, 0, EZ), mark: 'edge' },
  { p: V3(EX - 0.22, 0, EZ), mark: 'lip0' },
  { p: V3(EX - 0.22, 0, EZ), how: 'wait', len: 2.6, act: 'teeter', mark: 'lip' },
  { p: LAND, how: 'fall', len: 12, act: 'fall', mark: 'land' },                                  // it can't fly. A jump, a front flip, then straight down on to the button, feet first
  { p: LAND, how: 'wait', len: 2, act: 'land', face: 0.15 },
  { p: LAND, how: 'wait', len: 4, act: 'wave', face: 0.15, mark: 'end' },
]);
function buildRoute(pts) {
  const segs = [], marks = {}; let total = 0;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1].p, b = pts[i].p, P = pts[i], how = P.how || 'walk';
    const flat = Math.hypot(b.x - a.x, b.z - a.z);
    const len = P.len ?? (how === 'walk' ? a.distanceTo(b) : how === 'jump' ? Math.max(1.6, flat + Math.abs(b.y - a.y) * 0.5) : 3.2);
    segs.push({ a, b, how, len, start: total, act: P.act, face: P.face, lift: P.lift, timed: P.timed, dir: flat > 0.01 ? V3(b.x - a.x, 0, b.z - a.z).normalize() : null });
    total += len;
    if (P.mark) marks[P.mark] = total;
  }
  for (let i = 0; i < segs.length; i++) if (!segs[i].dir) { let j = i; while (j < segs.length && !segs[j].dir) j++; segs[i].dir = (segs[j] || segs[i - 1]).dir; }
  const out = { pos: V3(), dir: V3(), air: -1, act: { name: null, t: 0 }, face: undefined };
  function at(d) {
    d = clamp(d, 0, total - 1e-4);
    const s = segs.find((g) => d < g.start + g.len) || segs[segs.length - 1];
    const t = (d - s.start) / s.len;
    out.pos.lerpVectors(s.a, s.b, t); out.dir.copy(s.dir); out.air = -1; out.face = s.face; out.how = s.how;
    out.act.name = s.act || null; out.act.t = t;
    out.crouch = 0;
    if (s.how === 'jump') { const lift = s.lift ?? (0.55 + Math.max(0, s.b.y - s.a.y) * 0.22), c = s.timed ? 0.15 : 0, tt = clamp((t - c) / (1 - c), 0, 1);      // a timed jump starts with a crouch: it gathers itself on the spot, then goes
      out.pos.lerpVectors(s.a, s.b, tt); out.pos.y = lerp(s.a.y, s.b.y, tt) + 4 * lift * tt * (1 - tt); out.air = t < c ? -1 : tt; out.act.t = tt; out.crouch = t < c ? Math.sin(Math.PI / 2 * Math.min(1, t / (c * 0.6))) : 0; }
    if (s.how === 'climb') { const e = t * t * (3 - 2 * t); out.pos.y = lerp(s.a.y, s.b.y, Math.min(1, e * 1.25)) + Math.sin(Math.PI * smooth(t, 0.62, 1)) * 0.09; out.pos.x = lerp(s.a.x, s.b.x, smooth(t, 0.56, 1)); }      // straight up inside the box first, then a step over the rim
    if (s.how === 'fall') { const j = smooth(t, 0, 0.22), f = clamp((t - 0.13) / 0.87, 0, 1); out.pos.x = lerp(s.a.x, s.b.x, j); out.pos.z = lerp(s.a.z, s.b.z, j); out.pos.y = s.a.y + Math.sin(Math.min(1, t / 0.22) * Math.PI) * 1.3 + (s.b.y - s.a.y) * Math.pow(f, 1.7); }      // out and up, then faster and faster
    if (s.how === 'float') { const e = smooth(t, 0, 0.45); out.pos.x = lerp(s.a.x, s.b.x, e); out.pos.z = lerp(s.a.z, s.b.z, e); out.pos.y = lerp(s.a.y, s.b.y, t * t * (3 - 2 * t)) + Math.sin(t * 16) * 0.1 * Math.sin(t * Math.PI) + Math.sin(Math.min(1, t * 9) * Math.PI) * 0.5; }
    return out;
  }
  return { at, total, marks, segs };
}
const M = route.marks;
const M_OUT = M.stoveEnd + 1.3;          // where you come back out of its head: just after the stove
boot.marks = M;
// "talk-0.4", "plinth+2", "end", "12": a place on the route
const parseD = (str) => { const m = /^\s*([a-zA-Z]\w*)?\s*([+-]?\s*[\d.]+)?\s*$/.exec(String(str)); return (m[1] ? M[m[1]] : 0) + (m[2] ? parseFloat(m[2].replace(/\s/g, '')) : 0); };

const stops = {
  hero: [0, M.landed], hello: [M.landed, M.filmOut], lights: [M.filmOut, M.headline], headline: [M.headline, M.street], talks: [M.street, M.talkEnd + 0.4], sees: [M.talkEnd + 0.4, M_OUT + 2.5], charge: [M_OUT + 2.5, M.napEnd + 1.2], life: [M.napEnd + 1.2, M.details - 5],      // each stop starts when its word or its thing comes into the picture
  details: [M.details - 5, M.family], family: [M.family, M.price], price: [M.price, M.edge], edge: [M.edge, route.total],
};
headline.forEach((L) => { const a = distAtX(L.x0), b = distAtX(L.x1); L.win = [a - 2.6, b + 0.5]; L.dOn = distAtX(L.x0 + 0.3); });
function distAtX(x) { let best = 0, bd = 1e9; for (let d = M.headline; d < M.street; d += 0.1) { const p = route.at(d).pos; const e = Math.abs(p.x - x); if (e < bd) { bd = e; best = d; } } return best; }
lightsW.forEach((L) => { L.dPass = M.slap0 + (L.home.x - S0.x); });

// when each thing pops up
talks.forEach((L, i) => pop(L.mesh, M.tipEnd + 0.2 + i * 0.25, L.home.y));      // the next word comes up only once GONE WALKING has had its last picture to itself
sees.forEach((L, i) => pop(L.mesh, M.talkEnd - 0.6 + i * 0.4, L.home.y));
pop(dock, M.stove);
pop(wallB.g, M.napEnd - 1, wallB.cy, 2.6);
pop(plinth, M.details - 5); pop(shelf, M.plinthEnd + 0.3, 0.65);
family.forEach((f, i) => pop(f.r.root, M.plinthEnd + 0.6 + i * 0.4, null, 1.4));
price.forEach((L, i) => pop(L.mesh, M.price - 1.4 + i * 0.5, null, 1.6));      // the price comes up once the colour's name has gone, so the two never stand side by side

/* ---------- camera: one moment at a time ---------- */
// K: where the camera sits relative to the robot (x right, y up, z toward the viewer) and where it looks.
// P: the same shot framed for a phone held upright, where the generic phone rule isn't good enough.
const K = (d, off, look, fov = 36, fit = false) => ({ d, off, look, fov, fit });
const P = (key, off, look, fov) => { key.m = { off, look, fov, own: true }; return key; };
const camKeys = [
  P(K(0,                [0.05, 1.88, 7.3],  [0.05, 1.84, 0], 34),    [0.05, 2.34, 10.4], [0.05, 2.3, 0], 50),     // just the name, floating, with room under it for the PRESS button
  P(K(DROP_D + 0.1,     [0.05, 1.88, 7.3],  [0.05, 1.84, 0], 34),    [0.05, 2.34, 10.4], [0.05, 2.3, 0], 50),
  K(DROP_D + 0.75,      [0.3, 0.95, 6.0],   [0, 0.22, 0], 34),          // the box lands: down to the floor with it
  K(M.peeked - 0.6,     [0.9, 0.8, 4.7],    [-0.5, 0.85, 0], 34),       // closer as the lid lifts
  K(M.rim - 0.4,        [2.1, 0.5, 3.9],    [-0.2, 0.5, 0], 36),
  K(M.rim + 1.0,        [3.0, 0.2, 3.4],    [0.1, 0.3, 0], 36),         // low, under it, as it teeters on the rim
  K(M.rim + 3.2,        [0.7, 0.1, 5.6],    [0.6, -0.15, 0], 38),       // side on and wide for the jump: the box behind, the floor ahead
  K(M.out + 0.3,        [1.3, 0.35, 3.6],   [0.1, 0.4, 0], 36),         // down at floor height for the landing
  K(M.landed - 2.4,     [1.0, 0.6, 3.2],    [0.2, 0.55, 0], 36),
  K(M.landed - 0.2,     [0.5, 0.66, 2.7],   [0.12, 0.6, 0], 36),        // a little closer for the hello
  K(M.present0 - 0.55,  [0.02, 0.79, 0.62], [0, 0.78, 0], 30),          // from the front, straight into its lens
  K(M.presentEnd + 0.4, [0.9, 0.8, 3.3],    [0.25, 0.6, 0], 36),        // out the way you came in: in front of it again
  P(K(M.slap0 - 0.1,    [3.6, 1.5, 9.6],    [3.4, 0.7, -1.2], 40, true), [3.7, 2.6, 22.0], [3.7, 0.2, -1.2], 60), // it turns to go, and there is the whole word: LIGHTS
  K(M.slap0 + 2.6,      [3.0, 1.3, 8.8],    [2.3, 0.7, -1.0], 40),      // ahead of it, looking back along the word as the letters go down
  K(M.slapEnd - 0.2,    [1.2, 1.5, 6.4],    [-2.2, 0.5, -1.0], 40),
  K(M.headline - 1.6,   [17.8, 2.6, 37.5],  [17.8, 2.2, 0], 40, true),  // the whole headline, square on, in the dark, waiting
  K(M.headline - 0.2,   [3.5, 2.0, 13.0],   [5.5, 1.5, 0], 40),         // then in: it walks up to the G
  K(M.headline + 0.5,   [1.0, 3.4, 10.5],   [2.2, 0.6, 0], 44),         // near enough to see the jump up on to the G, far enough to see where it lands
  // Gone Walking is watched from several places, not one: from the front with the word above the home, over its shoulder as the rooms come
  // out of the light, from above as the light crosses the rug, from inside the next room as it arrives, from a crane over the bed,
  // from outside over the front wall, and the whole home at the end. A phone gets its own framing for each (the second set of numbers).
  // GONE WALKING is cut as a few held shots with slow moves between them. A key is a place the camera rests: two keys with the same offset make a hold.
  P(K(M.onG + 0.6,      [5.5, 6.0, 11.5],   [0.2, -1.4, 2.6], 48),   [1.6, 8.5, 13.0],  [0.2, -2.2, 2.8], 60),    // on the G, from high in front and a little ahead: the word, and the home coming out of the light under it
  P(K(M.onG + 3.2,      [3.8, 2.0, 3.2],    [-1.2, -0.5, 0.8], 48),  [1.2, 6.2, 8.5],   [0.4, -0.4, 0.0], 60),    // then in close, ahead of it: its face, the letters lit behind it, the rooms it has drawn below them
  P(K(M.onG + 6.2,      [3.8, 2.0, 3.2],    [-1.2, -0.5, 0.8], 48),  [1.2, 6.2, 8.5],   [0.4, -0.4, 0.0], 60),    // held
  P(K(M.gone - 0.1,     [-2.6, 6.0, 6.0],   [0.8, -0.7, 1.0], 50),    [-2.2, 7.5, 6.5],  [0.6, -0.4, 1.2], 60),    // up behind its shoulder before it jumps, looking down into the home: the camera is still for the jump itself
  P(K(M.gap + 0.4,      [-3.6, 3.6, 3.6],   [1.6, 0.3, -0.4], 50),   [-3.0, 4.6, 3.6],  [0.8, 0.1, -0.2], 60),    // down with it into the home
  P(K(M.pl1 - 1.0,      [-3.0, 2.4, 2.0],   [3.0, 0.4, -0.6], 52),   [-2.6, 3.4, 2.0],  [1.6, 0.2, -0.4], 64),    // over its shoulder: the room comes out of the light in front of it
  P(K(M.pl1 + 0.4,      [-3.0, 2.5, 2.2],   [2.8, 0.4, -0.4], 52),   [-2.6, 3.5, 2.2],  [1.5, 0.2, -0.3], 64),    // held
  P(K(M.pl2 + 0.4,      [3.0, 2.7, 3.2],    [-0.4, 0.5, -0.5], 48),  [1.8, 2.6, 3.0],   [-0.1, 0.45, -0.3], 60),  // one slow turn round to its front
  P(K(M.pdoor - 0.5,    [3.2, 3.0, 3.0],    [-0.2, 0.4, -0.6], 46),  [1.8, 2.8, 3.0],   [0, 0.4, -0.4], 60),      // held: it walks toward us through the living room
  P(K(M.bedW + 2.6,     [2.9, 1.6, 0.6],    [-0.4, 0.4, -1.1], 44),  [2.3, 2.4, 1.0],   [-0.2, 0.45, -0.5], 62),  // a long slow push in as it comes through the door and round the bed, ending low and close in front of it
  P(K(M.bedE - 1.4,     [2.7, 1.7, 0.6],    [-0.3, 0.4, -1.1], 44),  [2.2, 2.5, 1.0],   [-0.2, 0.45, -0.5], 62),  // held
  P(K(M.tip - 0.7,      [2.0, 3.2, 1.6],    [-0.3, 0.4, -0.5], 46),  [-2.6, 5.0, 0.4],  [0.6, 0.2, -0.2], 62),    // the bath, the last room: it walks in, the counter reaches 62 (a phone comes round behind it here, so its pull-out is one straight line)
  P(K(M.tip + 0.3,      [2.0, 3.2, 1.6],    [-0.3, 0.4, -0.5], 46),  [-2.6, 5.0, 0.4],  [0.6, 0.2, -0.2], 62),    // held
  P(K(M.tip + 3.4,      [-15.6, 15, 24.5],  [-15.6, 1.25, -4.2], 46),   [-30, 30, 3],      [-16, 0, 0], 58),         // up and out: the whole map for a moment, the word over the home
  P(K(M.tip + 6.2,      [-41, 6.2, 4.2],    [-20, -2.4, -3.6], 44),  [-46, 10, 2.6],    [-24, 0, -1.6], 52),      // map saved: the camera rides the dots all the way back and stops at the dock, looking down the whole home to where it stands
  K(M.street - 0.4,     [1.8, 1.5, 5.4],    [1.4, 0.5, -3], 40),
  K(M.street + 2.4,     [1.5, 1.2, 4.0],    [-0.4, 0.75, -4], 44),      // the turn: over the shoulder, down the street
  K(M.bump - 2.6,       [1.7, 1.3, 4.8],    [-0.7, 0.9, -3], 44),       // the word ahead, whole
  K(M.bump - 0.3,       [1.0, 1.7, 8.0],    [-2.6, 1.0, -1.0], 42),     // the whole word from the front as it walks into the S
  K(M.bump + 2.2,       [1.3, 1.4, 6.6],    [-1.4, 0.9, -1.0], 42),
  K(M.talk - 0.2,       [1.5, 0.9, 5.0],    [1.05, 1.0, 0], 38),        // it turns to you, with room for what it says
  K(M.talkEnd - 0.3,    [0.8, 0.95, 4.7],   [1.05, 1.0, 0], 38),
  K(M.dive0 - 1.4,      [0.9, 1.1, 3.8],    [0, 0.9, -3], 44),          // on, toward the next word
  K(M.dive0 + 0.4,      [0.5, 1.35, 6.3],   [0, 1.4, -1.5], 60),       // it turns round. SEES stands behind it.
  K(M.dive - 0.55,      [0.02, 0.79, 0.62], [0, 0.78, 0], 30),          // straight into the lens
  K(M_OUT + 0.5,        [2.1, 1.1, 3.4],    [-0.2, 0.7, -2], 42),        // and out again, behind it, while the stove is still in its eye
  K(M.nap - 2.0,        [-1.6, 1.0, 3.6],   [0.9, 0.7, -3], 42),
  K(M.nap + 1.2,        [-2.5, 0.75, 2.3],  [0.15, 0.42, -0.1], 34),        // down on the floor next to it
  K(M.napEnd - 0.8,     [-2.0, 0.8, 2.6],   [0.2, 0.42, -0.1], 34),
  K(M.life + 0.5,       [1.2, 1.25, 4.2],   [-0.9, 1.25, -4.5], 44),
  P(K(M.photo - 0.6,    [4.6, 1.35, -3.9],  [-4.4, 1.6, -0.5], 44),    [6.6, 1.7, 1.6],   [-5.6, 2.9, 0.3], 60),      // on a phone: straight on to the wall from further back, so the whole picture fits       // swing round behind it: the wall is to its left
  P(K(M.photo + 6,      [5.0, 1.35, -3.4],  [-4.6, 1.6, -0.5], 44),     [6.8, 1.7, 1.2],   [-5.6, 2.9, 0.2], 60),
  P(K(M.photoEnd - 0.3, [4.8, 1.35, -3.0],  [-4.6, 1.6, -0.5], 44),   [6.6, 1.7, 0.8],   [-5.6, 2.9, 0.2], 60),
  K(M.details - 2.5,    [0.6, 1.3, 4.4],    [0, 0.8, -3.5], 42),
  K(M.plinth + 0.2,     [1.8, 0.95, 4.2],   [0.4, 0.44, 0], 34),
  K(M.plinth + 4.5,     [-0.85, 1.1, 4.2],  [0.4, 0.44, 0], 34),
  K(M.plinthEnd - 0.2,  [-2.3, 0.9, 3.8],   [0.4, 0.44, 0], 34),
  K(M.gate - 1.6,       [7.2, 1.35, 1.6],   [0.2, 1.2, 0], 38),         // from in front, through the gate's opening: you see it walk through and change colour
  K(M.gate + 0.5,       [6.4, 1.4, 2.8],    [0.6, 1.2, -0.3], 38),
  P(K(M.gate + 2.4,     [3.0, 2.5, 6.9],    [3.0, 1.7, -2.0], 40),   [2.6, 3.0, 12.4],  [2.6, 1.55, -2.0], 60),     // close on the stage: the two sizes, and the colour's name just over their heads     // the family and the colour's name above them, all in the picture
  P(K(M.gate + 4.8,     [0.6, 2.5, 6.9],    [0.6, 1.7, -2.0], 40),   [0.2, 3.0, 12.4],  [0.2, 1.55, -2.0], 60),
  P(K(M.price - 2.5,    [-2.15, 2.3, 9.6],  [-2.15, 2.2, -2.0], 40), [-2.5, 3.0, 19.0], [-2.5, 1.4, -2.0], 60),    // the camera stays where it is while the colours card is up, so the word never slides out of the picture
  P(K(M.price + 1.6,    [6.8, 2.0, 12.4],   [5.1, 1.8, -3.7], 40, true), [5.0, 3.2, 31.0], [5.0, 0.2, -3.7], 60), // the whole price, with room on the left for the card
  K(M.shove - 2.0,      [-0.6, 1.9, 16.6],  [-0.6, 1.7, -3.0], 40, true), // the whole price, standing to the right of the card
  K(M.shove - 0.1,      [1.5, 1.9, 17.6],   [1.5, 1.6, -3.0], 40, true),
  K(M.shove + 1.8,      [2.0, 8.2, 5.2],    [2.0, 0, -2.6], 40),        // up and over as the numbers go down, so $149 still reads lying on the floor
  K(M.edge + 1,         [-2.4, 1.2, 4.2],   [1.6, 0.5, 0], 38),
  K(M.lip0 - 1.6,       [4.6, 0.7, 6.4],    [0.6, -1.1, 0], 44),
  K(M.lip + 0.5,        [2.6, 0.9, 5.4],    [-0.2, 0.5, 0], 42),        // side on for the jump and the flip
  K(M.lip + 2.8,        [-0.4, 0.5, 5.0],   [1.9, 0.4, 0], 40),         // falling beside it: the robot on the left, open blue on the right for the words, the floor out of the picture
  K(M.land - 2.6,       [-0.4, 0.8, 5.4],   [1.9, 0.2, 0], 40),
];
const camOff = V3(), camLook = V3(), _a = V3(), _b = V3();
const C_FLASH = new THREE.Color('#fff4d0');
function camAt(d) {
  let i = 0; while (i < camKeys.length - 2 && d > camKeys[i + 1].d) i++;
  const A0 = camKeys[i], B0 = camKeys[i + 1], t = smooth(d, A0.d, B0.d), mob = tall();
  const A = mob && A0.m ? A0.m : A0, B = mob && B0.m ? B0.m : B0;
  const ra = Math.hypot(A.off[0], A.off[2]), rb = Math.hypot(B.off[0], B.off[2]);
  const ta = Math.atan2(A.off[0], A.off[2]); let dt = Math.atan2(B.off[0], B.off[2]) - ta; dt = Math.atan2(Math.sin(dt), Math.cos(dt));
  let r = lerp(ra, rb, t), th = ta + dt * t, y = lerp(A.off[1], B.off[1], t), fov = lerp(A.fov, B.fov, t);
  camLook.lerpVectors(_a.fromArray(A.look), _b.fromArray(B.look), t);
  const fit = clamp(1.6 / camera.aspect, 1, 1.5); if (!mob) r *= lerp(A.fit ? fit : 1, B.fit ? fit : 1, t);     // on a narrower window, back off until the word fits
  if (mob) { const g = lerp(A.own ? 0 : 1, B.own ? 0 : 1, t);                                                       // the generic phone rule, faded out toward keys that bring their own framing
    r *= lerp(A.own ? 1 : A.fit ? 1.7 : 1.42, B.own ? 1 : B.fit ? 1.7 : 1.42, t); y += 0.25 * g; fov = Math.min(64, fov + 15 * g); camLook.x *= lerp(A.own ? 1 : A.fit ? 1 : 0.3, B.own ? 1 : B.fit ? 1 : 0.3, t); }
  camOff.set(Math.sin(th) * r, y, Math.cos(th) * r);
  return fov;
}

/* ---------- the robot ---------- */
const robot = createRobot();
scene.add(robot.root);
// It brings its own light, and a soft cool one behind it so its back never goes black at night.
// Both live in the scene, not on the robot: hiding the robot (when you are inside its head) must not change how many lights there are,
// or every surface in view has to be rebuilt for the new count and the page stalls for seconds.
const lamp = new THREE.PointLight('#ffe2a0', 0, 7, 1.5), fillLamp = new THREE.PointLight(0xcfd8ff, 0, 5, 1.6); scene.add(lamp, fillLamp);
const robotBody = world.createRigidBody(RAPIER.RigidBodyDesc.kinematicPositionBased());
world.createCollider(RAPIER.ColliderDesc.capsule(0.28, 0.27).setFriction(0.2), robotBody);
const hit = new THREE.Mesh(new THREE.SphereGeometry(0.62), new THREE.MeshBasicMaterial({ visible: false }));
hit.position.y = 0.6; robot.root.add(hit);
let userWay = null, gateWay = 'classic', way = 'classic';
function showWay(key) {
  way = key; robot.setWay(key);
  document.getElementById('wayname').textContent = WAYS[key].name;
  document.querySelectorAll('.swatches button').forEach((b) => b.classList.toggle('is-on', b.dataset.way === key));
}
document.querySelectorAll('.swatches button').forEach((b, i) => { const key = Object.keys(WAYS)[i]; b.dataset.way = key; b.style.setProperty('--c', '#' + new THREE.Color(WAYS[key].body).getHexString()); b.setAttribute('aria-label', WAYS[key].name); });      // the swatches follow whichever robot is loaded
document.getElementById('wayname').textContent = WAYS.classic.name;
document.querySelectorAll('.swatches button').forEach((b) => b.addEventListener('click', () => {
  userWay = b.dataset.way; showWay(userWay); robot.hop(4);
  family.forEach((f, i) => setTimeout(() => f.r.hop(f.key === userWay ? 4.6 : 2.6), 80 + i * 90));
}));
const thumbs = [...document.querySelectorAll('.thumbs:not(.asks) button')], asks = [...document.querySelectorAll('.asks button')];
asks.forEach((b) => b.addEventListener('click', () => { S.qPick = +b.dataset.q; S.qPickT = S.time; robot.hop(2.4); }));
thumbs.forEach((b) => b.addEventListener('click', () => { S.pick = +b.dataset.slot; S.pickT = S.time; robot.hop(2.6); }));
const toast = document.getElementById('toast'); let toastT = 0;
const say = (text) => { toast.textContent = text; toast.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(() => toast.classList.remove('is-on'), 2600); };

// the headline walk is its first lap of your home: the plan builds on the floor as it walks
const walk = createFirstWalk({ THREE, scene, camera, M, PAL, headline, lastL, robot, X0, canvasTex, V3, smooth, clamp, backOut, tall, DISPLAY, MONO });

/* ---------- scroll: the page is the track ---------- */
const sections = [...document.querySelectorAll('section[data-stop]')];
const copies = [...document.querySelectorAll('.copy')].map((el) => ({ el, d0: parseD(el.dataset.d0), d1: parseD(el.dataset.d1), side: el.dataset.side || 'left' }));
const callouts = [...document.querySelectorAll('.callout')].map((el) => ({ el, d0: parseD(el.dataset.d0), d1: parseD(el.dataset.d1), left: el.dataset.dir === 'l', a: el.dataset.anchor.split(',').map(Number) }));
let track = [];
const RATE = { headline: 0.8 };          // how much scroll a stretch takes, next to the others. The headline walk felt long, so it goes by a little quicker.
function layout() {
  const px = tall() ? 84 : 104;
  sections.forEach((s) => { const [a, b] = stops[s.dataset.stop]; s.style.height = Math.max(innerHeight * 0.9, (b - a) * px * (RATE[s.dataset.stop] || 1)) + 'px'; });
  const maxY = Math.max(1, document.documentElement.scrollHeight - innerHeight);
  const sum = sections.reduce((n, s) => n + s.offsetHeight, 0);
  let y = 0;
  track = sections.map((s, i) => { const h = s.offsetHeight * maxY / sum, r = { s, i, y0: y, y1: y + h, d: stops[s.dataset.stop] }; y += h; return r; });
  renderer.setSize(innerWidth, innerHeight, false);
  camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
  placeHero();
}
function readScroll() {
  const y = clamp(scrollY, 0, track[track.length - 1].y1);
  const r = track.find((k) => y <= k.y1) || track[track.length - 1];
  const t = clamp((y - r.y0) / (r.y1 - r.y0), 0, 1);
  return { d: lerp(r.d[0], r.d[1], t), r, t };
}
function scrollForD(d) { const r = track.find((k) => d <= k.d[1]) || track[track.length - 1]; return lerp(r.y0, r.y1, clamp((d - r.d[0]) / (r.d[1] - r.d[0]), 0, 1)); }
let lastW = innerWidth;
addEventListener('resize', () => { if (coarse && innerWidth === lastW) return; lastW = innerWidth; const d = S.exact; layout(); scrollTo(0, scrollForD(d)); });
document.querySelectorAll('[data-go]').forEach((a) => a.addEventListener('click', (e) => {
  e.preventDefault(); S.navT = S.time; scrollTo({ top: scrollForD(Math.min(parseD(a.dataset.go), route.total)), behavior: reduceMotion ? 'auto' : 'smooth' });
}));

// Sound. These five are recordings made with Higgsfield, the walk's own sound is made in js/sound.js. Everything goes out through
// one volume (out), and that starts shut: a page shouldn't make noise nobody asked for. Pressing PRESS is asking, and so is the
// sound switch in the top bar. sfx.set(true) opens it, sfx.set(false) shuts it again.
const sfx = (() => {
  const files = { press: 'audio/press.mp3', box: 'audio/box-drop.mp3', pop: 'audio/pop.mp3', whoosh: 'audio/whoosh.mp3', land: 'audio/land.mp3' }, raw = {}, buf = {}, want = {}, last = {}; let ctx = null, out = null;
  // while recording (?press=), a few pixels in the corner flash a colour per sound, so the recording can be given the same sounds at the same moments
  const mark = new URLSearchParams(location.search).has('press') ? document.body.appendChild(Object.assign(document.createElement('i'), { style: 'position:fixed;left:0;bottom:0;width:12px;height:12px;z-index:99;opacity:0' })) : null;
  const tint = { press: '#ff00ff', box: '#00ffff', pop: '#00ff00', whoosh: '#ff0000', land: '#0000ff' };
  for (const k in files) raw[k] = fetch(files[k]).then((r) => r.arrayBuffer()).catch(() => null);          // fetched up front, so the first click doesn't wait for the network
  const TRIM = 0.5;      // the recordings are loud. Played at half, they sit just above the walk's own sound and nothing jumps out
  const start = (k, vol) => { const src = ctx.createBufferSource(), gain = ctx.createGain(); src.buffer = buf[k]; gain.gain.value = vol * TRIM; src.connect(gain).connect(out); src.start(); };
  const unlock = () => {
    if (ctx) { if (ctx.state === 'suspended') ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext; if (!AC) return; ctx = new AC(); out = ctx.createGain(); out.gain.value = 0; out.connect(ctx.destination);
    for (const k in files) raw[k].then((b) => b && ctx.decodeAudioData(b)).then((d) => { if (!d) return; buf[k] = d; if (want[k] && performance.now() - want[k].t < 400) start(k, want[k].vol); }).catch(() => {});
  };
  ['pointerdown', 'keydown', 'touchstart'].forEach((ev) => addEventListener(ev, unlock, { passive: true, capture: true }));
  return { live: () => !!ctx && ctx.state === 'running', off: true, get ctx() { return ctx; }, get out() { return out; },
    set(on) { unlock(); this.off = !on; if (out) { const t = ctx.currentTime; out.gain.cancelScheduledValues(t); out.gain.setTargetAtTime(on ? 1 : 0, t, on ? 0.015 : 0.08); } filmVid.muted = filmVid.loop || !filmS.sound || !on; },
    play(k, vol = 0.9) {
    const now = performance.now(); if (now - (last[k] || -1e9) < 900) return; last[k] = now;          // never the same sound twice in a second, however you scrub
    if (mark) { mark.style.background = tint[k]; mark.style.opacity = 1; setTimeout(() => { mark.style.opacity = 0; }, 180); }
    if (!ctx || ctx.state !== 'running' || this.off) return; if (buf[k]) start(k, vol); else want[k] = { t: now, vol }; } };
})();

// The PRESS button under the name does the first scrolls for you: the box comes down, and once it has landed
// the page walks itself forward until the robot is out and standing. Any scroll of your own takes over.
let auto = null;
function autoTo(d, secs, ease) {      // ease: how far along (0 to 1) at each share of the time. Left out, it starts and stops gently
  const me = auto = { stop: false }, y0 = scrollY, y1 = scrollForD(d), t0 = performance.now();
  return new Promise((done) => { (function tick(now) {
    if (me.stop) { me.over = true; return done(false); }
    const k = clamp((now - t0) / (secs * 1000), 0, 1); scrollTo(0, y0 + (y1 - y0) * (ease ? ease(k) : k * k * (3 - 2 * k)));
    if (k < 1) requestAnimationFrame(tick); else { me.over = true; done(true); }
  })(t0); });
}
// The last fall is one motion. Step off the edge and the page scrolls itself: up to speed, a steady fall all the way to the button,
// then it slows down while the words fly and the camera comes in. Left to the scroll alone, any pause left the robot hanging in mid-air.
// Scroll back up off the button and it goes back to the edge in one go too. Your own scroll takes over again once it has landed.
const FALL_SECS = 4.2;      // from the edge to the button
function fallTo(dir) {
  if (dir < 0) { autoTo(M.lip - 0.4, 1.3); auto.fall = true; auto.hold = performance.now() + 1300; return; }
  const d0 = S.exact, dL = M.land, dE = M.land + 3.4, v = (dL - M.lip) / FALL_SECS, tA = 0.3, sA = v * tA / 2, tB = Math.max(0, dL - d0 - sA) / v, tC = 2 * (dE - dL) / v, tot = tA + tB + tC;
  autoTo(dE, tot, (k) => { const t = k * tot, u = t - tA - tB; return (t < tA ? v * t * t / (2 * tA) : u < 0 ? sA + v * (t - tA) : dL - d0 + v * u - v * u * u / (2 * tC)) / (dE - d0); });
  auto.fall = true; auto.hold = performance.now() + (tA + tB + 0.4) * 1000;      // nothing interrupts it until it has hit the button
}
document.getElementById('unbox').addEventListener('click', async () => {
  sfx.play('press');
  if (!(await autoTo(DROP_D + 0.55, reduceMotion ? 0.01 : 0.6))) return;
  const me = auto;
  await new Promise((done) => { const t = setInterval(() => { if (drop.state === 'home' || me.stop) { clearInterval(t); done(); } }, 50); });
  if (!me.stop) autoTo(M.landed - 1.0, reduceMotion ? 0.01 : 7);          // it stops in the middle of the wave, so it keeps waving until you scroll
});
['wheel', 'touchmove', 'keydown'].forEach((ev) => addEventListener(ev, () => { if (auto && performance.now() > (auto.hold || 0)) auto.stop = true; }, { passive: true }));
// the film: a button to skip it, and one for its sound
const filmbar = document.getElementById('filmbar'), filmsound = document.getElementById('filmsound');
document.getElementById('skipfilm').addEventListener('click', (e) => { e.preventDefault(); autoTo(M.slap0 - 0.1, reduceMotion ? 0.01 : 2.2); });
filmsound.addEventListener('click', () => { filmS.sound = !filmS.sound; filmVid.muted = !filmS.sound || sfx.off; filmsound.textContent = filmS.sound ? 'Sound on' : 'Sound off'; filmsound.setAttribute('aria-pressed', filmS.sound); if (filmS.sound && filmVid.paused && filmS.where) filmVid.play().catch(() => {}); });
const ASSIST = new URLSearchParams(location.search).get('assist') !== '0';
{ const p = new URLSearchParams(location.search).get('press'); if (p) setTimeout(() => document.getElementById('unbox').click(), +p * 1000); }      // ?press=2 presses it for you after 2 s, for recordings

/* ---------- pointer: look, hop, grab, throw, spin, press ---------- */
const pointer = { x: 0, y: 0, has: false, down: false };
const ray = new THREE.Raycaster();
let drag = null, spin = null, userYaw = 0, hoverDirty = false;
const ndc = (e) => { pointer.x = (e.clientX / innerWidth) * 2 - 1; pointer.y = -(e.clientY / innerHeight) * 2 + 1; pointer.has = true; };
function pick() {
  ray.setFromCamera(pointer, camera);
  if (S.d > M.land - 1 && ray.intersectObject(capBtn, false)[0]) return { cta: true };
  const r = S.pov ? null : ray.intersectObject(hit, false)[0];
  const l = ray.intersectObjects(letterMeshes, false).find((h) => h.object.visible && h.object.userData.letter.state === 'free');
  if (r && (!l || r.distance < l.distance)) return { robot: true };
  if (l) return { letter: l.object.userData.letter, point: l.point };
  const h = ray.intersectObjects(heroMeshes, false).find((x) => x.object.userData.hero.state === 'float');
  if (h) return { hero: h.object.userData.hero };
  return null;
}
function startGrab(p) {
  if (!p) return false;
  if (p.cta) { S.ctaV = 7; robot.hop(4.4); say('Reserved. Well, not really. Mosey is made up.'); return true; }
  if (p.robot) { robot.hop(); return true; }
  if (p.hero) { p.hero.spinT = S.time; return true; }
  const L = p.letter, pos = L.body.translation();
  drag = { L, plane: new THREE.Plane().setFromNormalAndCoplanarPoint(camera.getWorldDirection(V3()).negate(), p.point), grip: V3().copy(p.point).sub(pos) };
  L.body.wakeUp(); document.body.classList.add('grabbing');
  return true;
}
canvas.addEventListener('touchstart', (e) => { ndc(e.touches[0]); const p = pick(); if (p && p.letter) e.preventDefault(); }, { passive: false });
addEventListener('pointerdown', (e) => {
  if (e.target.closest && e.target.closest('a,button')) return;
  ndc(e); pointer.down = true;
  if (!startGrab(pick()) && S.stop === 'details' && S.d > M.plinth - 0.5) spin = { x: e.clientX, yaw: userYaw };
});
addEventListener('pointermove', (e) => { ndc(e); hoverDirty = true; if (spin) userYaw = spin.yaw + (e.clientX - spin.x) * 0.012; });
const release = () => { pointer.down = false; drag = null; spin = null; document.body.classList.remove('grabbing'); };
addEventListener('pointerup', release); addEventListener('pointercancel', release);
document.addEventListener('pointerleave', () => { pointer.has = false; });

/* ---------- the loop ---------- */
const showAct = { name: 'present', t: 0 };
const S = { exact: 0, d: 0, prev: 0, speed: 0, sign: 1, idleFor: 0, yaw: 0.45, time: 0, stop: 'hero', shoved: false, tipped: false, bumped: false, found: false, acc: 0, close: 0, shiftX: 0, shiftY: 0, wasAir: false, tick: 0, pick: -1, pickT: -99, slot: -1, q: -1, qT: 0, qPick: 0, qPickT: -99, pov: false, povInit: false, cta: 0, ctaV: 0, night: 0 };
const anchor = V3(), look = V3(), camPos = V3(), headW = V3(), target = V3(), local = V3(), lens = V3(), cFace = new THREE.Color(), cAcc = new THREE.Color(PAL.accent), cBase = new THREE.Color(PAL.face), cCool = new THREE.Color('#a9b9ff');
const navA = [...document.querySelectorAll('nav.stops a')], navB = [...document.querySelectorAll('nav.tabs a')], seal = document.querySelector('.bar .mark');
navA.forEach((a) => a.style.setProperty('--x', (Math.min(parseD(a.dataset.go), route.total) / route.total * 100).toFixed(2) + '%'));      // each link stands on the track where its stop is
const hint = document.getElementById('hint'), stopname = document.getElementById('stopname'), stopnum = document.getElementById('stopnum'), railfill = document.getElementById('railfill'), railbot = document.getElementById('railbot');
const railticks = Object.values(stops).slice(1).map(([a]) => { const el = document.createElement('b'); el.style.left = (a / route.total * 100).toFixed(2) + '%'; document.getElementById('railticks').appendChild(el); return { el, a, done: false }; });      // a dot where each stop begins
boot.world = Math.round(performance.now());
layout();
{ const q = new URLSearchParams(location.search).get('d'); if (q) scrollTo(0, scrollForD(parseD(q))); }
S.exact = S.d = S.prev = readScroll().d;
anchor.copy(route.at(S.d).pos);
let first = true, last = performance.now(), running = true, manual = false;
const perf = { frames: 0, ms: 0, worst: 0 };

function frame(now) {
  if (!running) return;
  if (now - last < 0.5) { if (!manual) requestAnimationFrame(frame); return; }          // a frame with no time in it: skip, never divide by zero
  const dt = Math.min((now - last) / 1000, 1 / 30) * (window.__heroFx?.timeScale ?? 1); last = now; S.time += dt; S.tick++;      // the freeze in the intro slows the clock (js/hero-fx.js)
  const T = S.time;
  perf.frames++; perf.ms += dt * 1000; perf.worst = Math.max(perf.worst, dt * 1000);

  // 1. scroll to distance walked
  const sc = readScroll();
  S.exact = sc.d;
  S.d = reduceMotion || first ? S.exact : damp(S.d, S.exact, 5.5, dt);
  if (Math.abs(S.d - S.exact) < 0.002) S.d = S.exact;
  S.speed = damp(S.speed, (S.d - S.prev) / dt, 12, dt);
  const forward = S.d > S.prev, was = S.prev; S.prev = S.d;
  if (S.speed > 0.4) S.sign = 1; else if (S.speed < -0.4) S.sign = -1;
  if (ASSIST && !reduceMotion && !first && !(auto && auto.fall && !auto.over)) {      // the last fall plays in one go (fallTo)
    const a = M.lip + 0.2, b = M.land - 0.3;
    if (forward && was <= a && S.d > a && S.exact < M.land - 1) fallTo(1); else if (!forward && was >= b && S.d < b && S.exact > M.lip + 1) fallTo(-1);
  }
  S.idleFor = Math.abs(S.speed) < 0.06 ? S.idleFor + dt : 0;
  if (S.stop !== sc.r.s.dataset.stop) { S.stop = sc.r.s.dataset.stop; stopname.textContent = sc.r.s.dataset.name; stopnum.textContent = String(sc.r.i + 1).padStart(2, '0'); }

  // 2. night and day. LIGHTS falling turns the page dark. It stays dark while the map draws, and the day comes back on the street.
  let fallen = 0;
  lightsW.forEach((L, i) => {
    const e0 = clamp((S.d - (M.presentEnd - 0.2 + i * 0.22)) / 1.1, 0, 1), sc0 = e0 <= 0 ? 0 : backOut(e0);
    const f = smooth(S.d, L.dPass - 0.15, L.dPass + 1.0), a = -Math.PI / 2 * bounceOut(f); fallen += f; L.face.emissiveIntensity = 1.3 * (1 - smooth(f, 0.05, 0.45)) * sc0; L.halo.material.opacity = 0.5 * (1 - smooth(f, 0.02, 0.3)) * (e0 >= 1 ? 1 : 0) * smooth(S.d, M.presentEnd + 0.9, M.presentEnd + 2.2) * (S.d < M.headline + 2 ? 1 : 0);
    const cy = L.half.y * sc0, cz = L.half.z * sc0;
    const sink = smooth(S.d, M.headline - 1.6, M.headline - 0.5) * (1 - smooth(S.d, M.street + 2, M.street + 3));      // the fallen word sinks into the floor while it is up on GONE WALKING: it lay in the back of every shot there
    L.mesh.visible = e0 > 0 && sink < 0.999; L.mesh.scale.setScalar(Math.max(0.001, sc0)); L.mesh.rotation.x = a;
    L.mesh.position.set(L.pivot.x, L.pivot.y + cy * Math.cos(a) - cz * Math.sin(a) - sink * 0.6, L.pivot.z + cy * Math.sin(a) + cz * Math.cos(a));
  });
  signLamp.position.set((lightsW[0].home.x + lightsW[5].home.x) / 2, 1.9, 0.6); signLamp.intensity = 26 * (1 - fallen / lightsW.length) * smooth(S.d, M.presentEnd, M.presentEnd + 1.2) * (S.d < M.headline ? 1 : 0);
  const eve = smooth(S.d, M.presentEnd + 0.5, M.slap0 - 0.4);      // evening comes on as it walks to the sign, so the sign is the brightest thing in the picture before it goes out
  const N = S.night = (0.36 * eve + 0.64 * fallen / lightsW.length) * (1 - smooth(S.d, M.street - 1.5, M.street + 4)) * (1 - 0.42 * smooth(S.d, M.onG - 1, M.onG + 2.5));      // on its first walk the night eases to a deep dusk, so it and the home it maps are lit the same from every side
  const dimA = smooth(S.d, M.present0 + 0.3, M.present0 + 1.2) * (1 - smooth(S.d, M.presentEnd - 1.9, M.presentEnd - 1.0)) * 0.88;      // lights down for its first film
  const dim = Math.max(dimA, smooth(S.d, M.photo - 2, M.photo) * (1 - smooth(S.d, M.photoEnd, M.photoEnd + 2)) * 0.9);      // and for the projector at home
  sun.intensity = lerp(2.5, 0.07, N) * (1 - dim); hemi.intensity = lerp(0.75, 0.2, N) * (1 - dim * 0.5); rim.intensity = lerp(0.9, 1.3, N);
  scene.environmentIntensity = lerp(0.5, 0.1, Math.max(N, dim)); lamp.intensity = 15 * Math.max(N, dim); fillLamp.intensity = 12 * Math.max(N, dim);
  for (const L of headline) {
    const sweep = M.tip - 0.3 + 0.9 * (L.home.x - headline[0].home.x) / (headline[headline.length - 1].home.x - headline[0].home.x);      // when the home is learned, the light runs along the whole word once, left to right
    const lit = Math.max(L.dOn <= M.gone + 0.3 ? smooth(S.d, L.dOn, L.dOn + 0.12) : 0, smooth(S.d, sweep, sweep + 0.1) * (S.d < M.street + 4 ? 1 : 0));      // yellow means walked on. The rest wait, and all light together when the home is learned      // lit as it passes, and all of them once the home is learned
    if (lit < 0.5) cFace.copy(cBase).lerp(C_FLASH, lit * 2); else cFace.copy(C_FLASH).lerp(cAcc, lit * 2 - 1); L.face.color.copy(cFace); /* blue to yellow by way of white, a flash, and not through the pink a straight blend makes */ L.face.emissive.copy(cCool).lerp(cAcc, lit); L.face.emissiveIntensity = lerp(N * 0.62, 0.12 + 0.9 * N, lit);      // unlit letters keep a faint glow at night, so the headline can be read before it gets there
  }

  // 3. the robot on the route
  // A timed jump plays on the clock, not on the scroll: once you scroll into it, it finishes in its own time (and backs out the same way).
  // Without this, a slow scroll held it in mid-air for seconds and it read as floating.
  { const d = S.d; if (S.vd === undefined || Math.abs(d - S.vd) > 7) S.vd = d;
    const sg = route.segs.find((g) => S.vd < g.start + g.len) || route.segs[route.segs.length - 1];
    if (sg.how === 'jump' && sg.timed && S.vd > sg.start + 1e-4) { const end = sg.start + sg.len - 1e-3, want = d >= end ? end : d <= sg.start ? sg.start : (d >= S.vd || S.sign >= 0 ? end : sg.start), step = sg.len / sg.timed * dt; S.vd += clamp(want - S.vd, -step, step); if (Math.abs(S.vd - end) < 1e-3 && d >= end) S.vd = d; if (S.vd <= sg.start + 1e-4 && d <= sg.start) S.vd = d; }
    else S.vd += clamp(d - S.vd, -22 * dt, 22 * dt); }
  const R = route.at(S.vd);
  const povA = S.d > M.present0 - 0.3 && S.d < M.presentEnd - 0.2, povB = S.d > M.dive - 0.3 && S.d < M_OUT - 0.2;      // inside its head: for its first film, and for the walk through the home
  const pov = S.pov = povA || povB;
  robot.root.visible = !pov; home.visible = S.d > M.dive - 0.42 && S.d < M_OUT + 3.6;      // only once the iris is black, so the two worlds are never in one picture
  if (povB !== S.seesHid) { S.seesHid = povB; for (const L of sees) L.mesh.visible = !povB; }      // from inside its head the first thing you see is the home, not the sides of the letters it is standing between
  { const hh = S.d > M.present0 - 0.3; if (hh !== S.heroHid) { S.heroHid = hh; for (const L of heroType) L.mesh.visible = !hh; } { const ch = povA || (S.d > M.headline + 0.3 && S.d < M.street + 3); if (ch !== S.confHid) { S.confHid = ch; boxBurst.show(!ch); } } }      // and the confetti is not on the floor of the room where the film plays      // the fallen letters of its name are put away while you watch the film, so none lies in front of the picture
  robot.root.position.copy(R.pos);
  if (S.d < M.peeked) robot.root.position.y -= 0.6 * (1 - smooth(S.d, M.knock, M.knock + 0.9));                    // crouched under the lid
  if (R.act.name === 'peek') robot.root.position.y += Math.pow(Math.max(0, Math.sin(T * 1.15)), 3) * 0.2 * (1 - R.act.t);
  const capDrop = 0.26 * clamp(Math.sin(clamp((S.d - M.land) / 1.5, 0, 1) * Math.PI) * 1.1 + S.cta, 0, 1.2);      // the button gives under it
  if (S.d >= M.land) robot.root.position.y -= capDrop;
  capBtn.position.y = 0.55 - capDrop; if (S.d > M.edge) ctaKit.update(T, clamp(capDrop / 0.26, 0, 1) * 0.8);
  { const below = S.d > M.lip + 2.6; if (below !== S.below) { S.below = below; floorMesh.visible = !below; cta.visible = below || S.d > M.land; for (const L of endLetters) L.mesh.visible = below; } }      // once it is falling, the floor it left is put away (it would hang over the picture), and what is at the bottom is only shown from here on
  S.ctaV += (-S.cta * 140 - S.ctaV * 11) * dt; S.cta = Math.max(0, S.cta + S.ctaV * dt);
  const dropping = R.how === 'float' || R.how === 'fall', still = R.how === 'wait' || R.how === 'climb' || dropping;
  const wantYaw = (R.face !== undefined ? R.face : dropping ? 0.2 + (R.how === 'fall' ? Math.sin(T * 1.25) * 0.55 * smooth(R.act.t, 0.2, 0.3) * (1 - smooth(R.act.t, 0.85, 0.97)) : 0) : Math.atan2(R.dir.x * (still ? 1 : S.sign), R.dir.z * (still ? 1 : S.sign))) + userYaw;
  let dy = wantYaw - S.yaw; dy = Math.atan2(Math.sin(dy), Math.cos(dy));
  S.yaw += dy * (1 - Math.exp(-9 * dt));
  robot.root.rotation.y = S.yaw;
  S.lampUp = damp(S.lampUp || 0, R.air >= 0 ? 1 : 0, 7, dt);      // in a jump its lamp rides higher above it, so a flip never turns it white
  lamp.position.set(Math.sin(S.yaw) * 0.3, 1.25 + S.lampUp * 1.5, Math.cos(S.yaw) * 0.3).add(robot.root.position); fillLamp.position.set(-1.2 * Math.cos(S.yaw) - 1.5 * Math.sin(S.yaw), 1.5, 1.2 * Math.sin(S.yaw) - 1.5 * Math.cos(S.yaw)).add(robot.root.position);
  if (S.stop !== 'details' && !spin) userYaw = damp(userYaw, 0, 4, dt);

  const lookAt = { yaw: 0, pitch: 0 };
  if (pointer.has && !coarse) {
    robot.root.getWorldPosition(headW); headW.y += 0.8;
    ray.setFromCamera(pointer, camera);
    target.copy(ray.ray.direction).multiplyScalar(camera.position.distanceTo(headW) * 0.82).add(ray.ray.origin);
    local.copy(target); robot.root.worldToLocal(local);
    lookAt.yaw = clamp(Math.atan2(local.x, Math.max(0.2, local.z)), -1.15, 1.15);
    lookAt.pitch = clamp(-Math.atan2(local.y - 0.8, Math.hypot(local.x, local.z)), -0.5, 0.45);
  }
  const an = R.act.name;
  if ((S.d > M.dive0 && S.d < M.dive) || (S.d > M.landed && S.d < M.present0)) { lookAt.yaw = 0; lookAt.pitch = 0; }                          // it holds still and looks straight at you
  if (an === 'present') { const g = smooth(Math.sin(T * 0.55), 0.55, 0.8); lookAt.yaw = 1.15 * g; lookAt.pitch = -0.1 * (1 - g); }      // it watches the wall, and looks round at you now and then
  if (an === 'present' && S.d > M.photo - 1) { showAct.name = ['present', 'talk', 'wave', 'pose'][Math.max(0, S.slot)] || 'present'; showAct.t = 0.5; }
  if (an === 'talk') { showAct.name = ['talk', 'present', 'pose'][Math.max(0, S.q)] || 'talk'; showAct.t = clamp((T - S.qT) / 3, 0, 1); if (S.q === 1) lookAt.pitch = -0.32; }      // the timer: it tells you. the rain: it points up and looks at the sky. the joke: a little bow      // recipe: it points. film: it tells you about it. photos: it waves at them. stars: it looks round at them
  robot.update({ dist: S.d, speed: still ? 0 : S.speed, air: R.air, crouch: R.crouch, onModel: S.d > M.gap - 0.2 && S.d < M.tipEnd + 0.6, falling: false, idleFor: S.d < M.headline ? 0 : S.idleFor, look: lookAt, lookDown: S.d > M.lip0, act: (an === 'present' && S.d > M.photo - 1) || an === 'talk' ? showAct : R.act, dt, time: T, blobOff: S.d < M.rim || dropping || (R.air >= 0 && S.d > M.headline - 1 && S.d < M.gap + 0.5) || (S.d > M.lip0 - 1.2 && S.d < M.land) || camera.position.y - robot.root.position.y > 5.5, glow: Math.max(N, dim) });
  robotBody.setNextKinematicTranslation(dropping || S.d < M.out || Math.abs(S.d - S.exact) > 3 ? { x: 0, y: -80, z: 0 } : { x: R.pos.x, y: R.pos.y + 0.55, z: R.pos.z });

  // the box comes down out of the sky, on to the name. A real fall, started by the first scroll.
  if (first && S.d > M.knock) { drop.state = 'home'; heroType.forEach((L, i) => { freeHero(L); L.body.setTranslation({ x: BX + (i % 2 ? 1 : -1) * (1.25 + i * 0.32), y: 0.5 + (i % 3) * 0.3, z: -0.5 + (i % 4) * 0.35 }, true); L.body.setRotation(_q.setFromEuler(_e.set(1.3, i, 0.3)), true); }); }      // the page was opened further down: the letters are already on the floor
  if (drop.state === 'sky' && S.d > DROP_D) {
    drop.state = 'falling'; drop.t = 0; drop.hitT = -1;
    boxBody.setBodyType(RAPIER.RigidBodyType.Dynamic, true);
    boxBody.setEnabledTranslations(false, true, false, true);                                             // it falls straight down, so it always ends up where the rest of the scene expects it
    boxBody.setTranslation({ x: BX, y: 7.6, z: 0 }, true); boxBody.setRotation(_q.setFromEuler(_e.set(0.05, 0.28, 0.09)), true);
    boxBody.setLinvel({ x: 0, y: -4.5, z: 0 }, true); boxBody.setAngvel({ x: 0.15, y: 0.4, z: -0.3 }, true);
  } else if (drop.state === 'falling') {
    drop.t += dt; const p = boxBody.translation(), bottom = p.y - BH / 2;
    if (drop.hitT < 0 && bottom < heroTop + 0.3) {                                                         // first touch. The letters under it let go now, the row below and the ones further out a beat later.
      drop.hitT = drop.t; sfx.play('box');
      for (const L of heroType) { L.dx = L.home.x - p.x; L.due = drop.t + L.r * 0.045 + Math.max(0, Math.abs(L.dx) - BS / 2) * 0.05; }
    }
    if (drop.hitT >= 0) for (const L of heroType) if (L.state === 'float' && drop.t >= L.due) freeHero(L, Math.abs(L.dx) > BS / 2 ? Math.sign(L.dx) : 0);
    const v = boxBody.linvel(); if (v.y > 1.2) boxBody.setLinvel({ x: 0, y: 1.2, z: 0 }, true);                  // cardboard doesn't bounce
    if ((drop.t > 0.7 && Math.hypot(v.x, v.y, v.z) < 0.25) || drop.t > 1.7 || S.d > M.knock + 0.3) { drop.state = 'settling'; drop.t = 0; drop.from.copy(p); drop.fromQ.copy(boxBody.rotation()); boxBody.setBodyType(RAPIER.RigidBodyType.KinematicPositionBased, true); heroType.forEach((L) => freeHero(L)); }
  } else if (drop.state === 'settling') {                                                                 // it shuffles itself square. Something inside did that.
    drop.t = Math.min(1, drop.t + dt / 0.7); const e = drop.t * drop.t * (3 - 2 * drop.t);
    _v.lerpVectors(drop.from, BOX_HOME, e); _v.y += Math.sin(e * Math.PI) * 0.12; _q.slerpQuaternions(drop.fromQ, Q0, e);
    boxBody.setNextKinematicTranslation(_v); boxBody.setNextKinematicRotation(_q);
    if (drop.t >= 1) drop.state = 'home';
  } else if (drop.state === 'home') {
    boxBody.setNextKinematicTranslation({ x: BX - 0.6 * (1 - Math.pow(1 - smooth(S.d, M.rim + 1.5, M.rim + 3.4), 3)), y: BH / 2, z: 0 }); boxBody.setNextKinematicRotation(Q0);
  } else if (drop.state === 'rising') {                                                                   // scrolled back to the top: it goes back up
    drop.t = Math.min(1, drop.t + dt / 0.45); _v.lerpVectors(drop.from, BOX_SKY, drop.t * drop.t); _q.slerpQuaternions(drop.fromQ, Q0, drop.t);
    boxBody.setNextKinematicTranslation(_v); boxBody.setNextKinematicRotation(_q);
    if (drop.t >= 1) drop.state = 'sky';
  }
  if (drop.state !== 'sky' && drop.state !== 'rising' && S.d < DROP_D - 0.12) {
    drop.state = 'rising'; drop.t = 0; drop.from.copy(boxBody.translation()); drop.fromQ.copy(boxBody.rotation());
    boxBody.setBodyType(RAPIER.RigidBodyType.KinematicPositionBased, true); heroType.forEach(floatHero);
  }
  // The letters fall where physics puts them, then make room: off the box, clear of the lids that are about to swing open,
  // away from the front of the box, and off the spot where it will land.
  if (drop.state === 'settling' || drop.state === 'home') {
    const pop = drop.state === 'settling' && drop.t < 0.06;                                          // the box shuffles square: everything touching it jumps
    if (S.d < M.slap0) for (const L of heroType) {
      if (L.state !== 'free') continue;
      const p = L.body.translation(), v = L.body.linvel(), dx = p.x - BX, side = Math.abs(dx) < 0.05 ? (L.i % 2 ? 1 : -1) : Math.sign(dx);
      let vx = null, vz = null;
      if (Math.abs(dx) < 1.62 && p.z > -1.05 && p.z < BS / 2 + 1.9 && p.y < BH + 0.7) vx = side * 2.3;       // the box, its lids, and the view of its front
      const lx = p.x - LANDP.x, lz = p.z - LANDP.z, ld = Math.hypot(lx, lz);
      if (ld < 1.2) { const k = ld > 0.02 ? 1 / ld : 0; vx = (k ? lx * k : 1) * 2.1; vz = (k ? lz * k : 0.4) * 2.1; }                     // where it lands
      if (vx !== null) { L.body.setLinvel({ x: lerp(v.x, vx, 0.18), y: pop ? 2.6 + rnd() * 1.4 : v.y, z: vz !== null ? lerp(v.z, vz, 0.18) : v.z }, true); if (pop) L.body.setAngvel({ x: (rnd() - 0.5) * 6, y: (rnd() - 0.5) * 4, z: -side * 3 }, true); }
      if (drop.state === 'home' && Math.abs(dx) < BS / 2 - 0.02 && Math.abs(p.z) < BS / 2 - 0.02 && p.y < BH) L.body.setTranslation({ x: BX + side * (BS / 2 + 0.9), y: 0.5, z: p.z }, true);      // one that somehow ended up inside the box
      if (p.y < 0.09) { L.body.setTranslation({ x: p.x, y: 0.16, z: p.z }, true); L.body.setLinvel({ x: v.x, y: 0, z: v.z }, true); }                                                    // or pressed into the floor
    }
  }
  if (drop.state === 'home') { boxDrop.position.copy(BOX_HOME); boxDrop.quaternion.identity(); } else { boxDrop.position.copy(boxBody.translation()); boxDrop.quaternion.copy(boxBody.rotation()); }
  boxDrop.visible = drop.state !== 'sky' && (S.d < M.headline + 0.7 || S.d > M.street + 3);      // the box and the fallen LIGHTS are put away while it is up on GONE WALKING: they sat in the back of every shot there
  { const boxed = drop.state === 'home' || drop.state === 'settling'; if (boxed !== S.boxed) { S.boxed = boxed; document.body.classList.toggle('boxed', boxed); } }      // the copy and the tracker wait for the box
  if (drop.state !== 'home' && S.d < M.rim) robot.root.visible = false;                                    // it is in the box, wherever the box is
  if (forward && was <= M.peeked - 0.3 && S.d > M.peeked - 0.3) for (const L of heroType) {                // the lid flips off whatever landed on it
    const lp = L.body.translation(); if (L.state !== 'free' || lp.y < BH - 0.1 || Math.abs(lp.x - BX) > BS / 2 + 0.2 || Math.abs(lp.z) > BS / 2 + 0.2) continue;
    const m = L.body.mass(); L.body.applyImpulse({ x: Math.sign(lp.x - BX || 1) * m * 2.4, y: m * 4.2, z: m * (1 + rnd()) }, true); L.body.applyTorqueImpulse({ x: m * 0.3, y: 0, z: -m * 0.3 }, true);
  }

  if (forward) {                                                                                     // its sounds, on the way forward only
    const hit = (d) => was <= d && S.d > d;
    if (hit(M.peeked - 0.2)) sfx.play('pop', 0.85);                                                   // the lids fly open and the confetti goes up
    if (hit(M.rim + 1.45)) sfx.play('whoosh', 0.4);                                                  // it jumps and flips
    if (hit(M.out - 0.04)) sfx.play('land', 0.85);                                                   // both feet on the floor
    if (hit(M.lip + 0.5)) sfx.play('whoosh', 0.4);                                                   // off the edge, with a flip
    if (hit(M.land - 0.06)) { sfx.play('land', 0.95); sfx.play('pop', 0.7); }                        // on to the button, and the words go flying
  }
  // the box: taped shut, it shudders, the lid lifts, then it bursts
  const pk = smooth(S.d, M.knock, M.knock + 1.3), bk = smooth(S.d, M.peeked - 0.3, M.peeked + 0.5), be = bk <= 0 ? 0 : backOut(bk);
  const shake = S.d < M.knock ? Math.pow(Math.max(0, Math.sin(T * 1.25)), 14) : 0;
  const rattle = bk * (1 - smooth(S.d, M.rim + 1.2, M.out)) * Math.min(1, Math.abs(S.speed) * 0.5 + 0.15);
  const headTop = robot.root.position.y + (robot.headTop ?? 1.02) + 0.03, headX = robot.root.position.x - BX, headHalf = robot.headHalf ?? 0.27;
  flaps.forEach((f, i) => {
    // While it peeks, each lid lies on the top corner of its head: the lid's angle is worked out from where the head is, so the two never pass through each other.
    const lift = headTop - (BH + 0.04), reach = Math.max(0.08, BS / 2 - f.sign * headX - headHalf);
    const peekPhi = f.outer ? Math.max(shake * 0.24, lift > 0 ? Math.atan2(lift, reach) + (0.5 + 0.5 * Math.sin(T * 2.2 + i)) * 0.05 * pk : 0) : 0;
    const rest = f.board ? lerp(0.1, f.rest, smooth(S.d, M.rim + 1.7, M.rim + 2.6)) : f.rest;          // the board stays out flat until it has jumped off
    const phi = lerp(peekPhi, Math.PI + rest, be) + Math.sin(T * (9 + i * 2.3)) * 0.07 * rattle * (f.board ? 0.15 : 1);
    if (f.axis === 'z') f.h.rotation.z = f.sign * (Math.PI - phi); else f.h.rotation.x = f.sign * (phi - Math.PI);
  });
  const kick = smooth(S.d, M.rim + 1.5, M.rim + 3.4);                                             // pushed back as it jumps. It rocks, and stays the right way up.
  boxPivot.position.set(BX - BS / 2 - 0.6 * (1 - Math.pow(1 - kick, 3)), shake * 0.035, 0);
  boxPivot.rotation.z = Math.sin(kick * Math.PI * 3) * 0.2 * (1 - kick) + Math.sin(T * 31) * 0.02 * shake + Math.sin(T * 26) * 0.012 * rattle;
  boxBurst(clamp((S.d - (M.peeked - 0.25)) / 3.4, 0, 1) * 3.1, BX, BH, 0, 0);          // long enough on the clock for every piece to reach the floor
  const dk = clamp((S.d - M.out) / 1.3, 0, 1);                                                    // a ring of dust where it lands
  dust.visible = dk > 0 && dk < 1; dust.position.set(LANDP.x, 0.02, LANDP.z); dust.scale.setScalar(0.4 + dk * 1.5); dust.material.opacity = (1 - dk) * 0.55;
  landBurst(clamp((S.d - M.land) / 2.6, 0, 1) * 4.2, BTN.x, FY + 0.9, BTN.z, FY);
  { const b0 = clamp((S.d - M.land) / 2.2, 0, 1);                                                   // the last words, blown off their feet
    if (b0 !== S.blast) { S.blast = b0; for (const L of endLetters) {
      const e = clamp((b0 - L.late) / (1 - L.late), 0, 1), te = 1 - (1 - e) * (1 - e) * (1 - e);
      L.mesh.position.lerpVectors(L.home, L.rest, te); L.mesh.position.y += Math.sin(Math.min(1, e * 1.08) * Math.PI) * L.arc * (1 - e * 0.25);
      L.mesh.rotation.set(L.rot.x * te, L.rot.y * te, L.rot.z * te);
    } } }

  // the hero headline floats, turns and glows until the box lands on it
  for (const L of heroType) {
    const i = L.i, m = L.mesh;
    if (L.state !== 'float') { if (m.material.emissiveIntensity) m.material.emissiveIntensity = 0; m.scale.setScalar(1); continue; }
    const intro = clamp((T - 0.25 - i * 0.07) / 0.7, 0, 1);
    const wave = (T * 0.9 - i * 0.5) % 9, turn = wave > 0 && wave < 1.1 ? (wave / 1.1) * (wave / 1.1) * (3 - 2 * wave / 1.1) * Math.PI * 2 : 0;
    const tap = clamp((T - L.spinT) / 0.9, 0, 1), tapTurn = (1 - Math.pow(1 - tap, 3)) * Math.PI * 2 * (tap < 1 ? 1 : 0);
    _v.copy(L.home).project(camera);
    const dx = _v.x - pointer.x, dyp = (_v.y - pointer.y) / camera.aspect, dd = Math.hypot(dx, dyp), near = pointer.has && !coarse ? Math.max(0, 0.22 - dd) / 0.22 : 0;
    L.push.x = damp(L.push.x, near * Math.sign(dx || 1) * 0.16, 8, dt); L.push.y = damp(L.push.y, near * 0.14, 8, dt);
    _v.set(L.home.x + L.push.x, L.home.y + Math.sin(T * 1.3 + i * 0.7) * 0.05 + L.push.y, L.home.z);
    _q.setFromEuler(_e.set(Math.sin(T * 0.9 + i) * 0.06 - L.push.y * 2, Math.sin(T * 0.8 + i * 0.9) * 0.2 + turn + tapTurn + L.push.x * 3, Math.sin(T * 0.7 + i * 1.3) * 0.03));
    L.body.setNextKinematicTranslation(_v); L.body.setNextKinematicRotation(_q);
    m.scale.setScalar(Math.max(0.001, backOut(intro)));
    m.material.emissiveIntensity = Math.pow(Math.max(0, Math.sin(T * 1.7 - i * 0.6)), 10) * 1.1 + near * 0.8;
  }

  // the family waits, watches it go by, and waves
  for (const f of family) {
    if (!f.r.root.visible) continue;
    const dx = robot.root.position.x - f.r.root.position.x, dz = robot.root.position.z - f.r.root.position.z, near = Math.hypot(dx, dz) < 3.4;
    const yaw = clamp(Math.atan2(dx, dz) - f.r.root.rotation.y, -1.2, 1.2);
    f.r.update({ dist: 0, speed: 0, air: -1, falling: false, idleFor: 0, look: { yaw, pitch: 0 }, act: near ? { name: 'wave', t: 0 } : null, dt, time: T + f.seed });
  }
  sizes.update({ way, dt, T, d: S.d, M });
  for (const key in nameWords) {
    const w = nameWords[key], on = key === way && S.d > M.gate + 0.5 && S.d < M.price - 2.4 ? 1 : 0;
    w.k = damp(w.k, on, on ? 7 : 12, dt); const e = w.k < 0.01 ? 0 : backOut(Math.min(1, w.k));
    w.forEach((L, i) => { L.mesh.visible = e > 0; L.mesh.scale.setScalar(Math.max(0.001, e * NAME_K)); L.mesh.position.x = NAME_X + (L.home.x - NAME_X) * NAME_K; L.mesh.position.y = (L.home.y + 2.85) * e + Math.sin(T * 1.2 + i * 0.6) * 0.04; L.mesh.rotation.y = (1 - e) * (i % 2 ? 1 : -1); });
  }

  // 4. words that are ground, words that fall, words that squash
  for (const L of headline) { if (S.d > L.win[0] && S.d < L.win[1]) lock(L); else free(L); }
  { const hid = S.d > M.street + 0.9 && S.d < M.nap; if (hid !== S.headHid) { S.headHid = hid; for (const L of headline) L.mesh.visible = !hid; } }      // from TALKS on the camera looks back up the street. The headline would be seen from behind, mirrored, so it is put away.
  if (S.d < M.slapEnd && was >= M.slapEnd) headline.forEach((L) => sendHome(L, 'free'));
  if (forward && was <= M.bump - 0.8 && S.d > M.bump - 0.8 && !S.bumped && bumpS.state === 'free') {
    S.bumped = true; S.bumpT = T; const m = bumpS.body.mass(), p = bumpS.body.translation(); sfx.play('box', 0.5);
    bumpS.body.applyImpulseAtPoint({ x: m * 9.5, y: m * 3.8, z: -m * 0.6 }, { x: p.x - 0.2, y: p.y + bumpS.half.y * 0.5, z: p.z }, true);      // knocked out of the word, up and away to the far side
  }
  if (S.d < M.bump - 2.5 && S.bumped) { S.bumped = false; sendHome(bumpS, 'free'); }
  { const gone = S.bumped ? smooth(T - S.bumpT, 1.1, 1.7) : 0; if (gone !== S.sGone) { S.sGone = gone; bumpS.mesh.visible = gone < 0.99; bumpS.shrink = 1 - gone; } }      // the S doesn't lie about afterwards: once it has landed it pops away
  S.found = S.d > M.sofa;
  if (forward && was <= M.shove - 0.05 && S.d > M.shove - 0.05 && !S.shoved) {
    S.shoved = true; robot.hop();
    price.forEach((L, i) => setTimeout(() => {
      if (L.state !== 'free') return;
      const m = L.body.mass(), p = L.body.translation();
      L.body.applyImpulseAtPoint({ x: (i - 1.5) * m * 0.25, y: 0, z: -m * 4.6 }, { x: p.x, y: p.y + L.half.y * 0.8, z: p.z }, true);
    }, i * 130));
  }
  if (S.d < M.price - 1 && S.shoved) { S.shoved = false; price.forEach((L) => sendHome(L, 'free')); }
  if (!userWay) { const w = S.d > M.gate - 0.3 ? 'tomato' : 'classic'; if (w !== gateWay) { gateWay = w; showWay(w); } }
  if (way !== S.famWay) { S.famWay = way; for (const f of family) f.r.setWay(f.key === way ? 'classic' : f.key); }      // whichever colour it is wearing, the one waiting in that colour puts on silver

  if (drag) {
    if (drag.L.state !== 'free') release();
    else {
      ray.setFromCamera(pointer, camera);
      if (ray.ray.intersectPlane(drag.plane, target)) {
        const p = drag.L.body.translation();
        target.sub(drag.grip); target.y = Math.max(target.y, drag.L.half.z + 0.05);
        _v.set(target.x - p.x, target.y - p.y, target.z - p.z).multiplyScalar(13).clampLength(0, 34);
        drag.L.body.setLinvel(_v, true);
        const w = drag.L.body.angvel(); drag.L.body.setAngvel({ x: w.x * 0.9, y: w.y * 0.9, z: w.z * 0.9 }, true);
      }
    }
  } else if (hoverDirty && !coarse) { hoverDirty = false; document.body.classList.toggle('can-grab', !!pick()); }

  stepLetters(dt);
  S.acc = Math.min(S.acc + dt, 0.05);
  while (S.acc >= world.timestep) { world.step(); S.acc -= world.timestep; }
  for (const L of letters) { L.mesh.position.copy(L.body.translation()); L.mesh.quaternion.copy(L.body.rotation()); }
  if (bumpS.shrink !== undefined) bumpS.mesh.scale.setScalar(Math.max(0.001, bumpS.shrink));

  const onTop = S.d > M.onG - 0.02 && S.d < M.gone + 0.3 && R.air < 0;                              // the letter under its feet squashes and rocks
  for (const L of headline) {
    const on = onTop && L.state === 'locked' && R.pos.x > L.x0 - 0.06 && R.pos.x < L.x1 + 0.06;
    if (on && !L.wasOn) L.sqV += S.wasAir ? 1.5 : 0.55;
    L.wasOn = on;
    const step = on ? Math.max(0, Math.sin(S.d * 7.4 * 2)) * 0.012 * Math.min(1, Math.abs(S.speed)) : 0;
    L.sqV += (((on ? 0.045 : 0) + step - L.sq) * 150 - L.sqV * 8) * dt; L.sq += L.sqV * dt;
    L.tilt = damp(L.tilt, on ? clamp((R.pos.x - L.home.x) / L.half.x, -1, 1) * -0.035 : 0, on ? 9 : 5, dt);
    if (L.state === 'locked' || Math.abs(L.sq) > 0.001) {
      const q = L.state === 'locked' ? L.sq : 0;
      L.mesh.scale.set(1 + q * 0.5, 1 - q, 1 + q * 0.5); L.mesh.position.y -= L.half.y * q; if (L.state === 'locked') L.mesh.rotateZ(L.tilt);
      if (on) robot.root.position.y += -2 * L.half.y * q + L.tilt * (R.pos.x - L.home.x);
    } else L.mesh.scale.setScalar(1);
  }
  S.wasAir = R.air >= 0;

  { const gu = clamp((S.d - (M.plinthEnd + 0.3)) / 1.6, 0, 1), gs = (gu <= 0 ? 0 : backOut(gu)) * (1 - smooth(S.d, M.gate + 0.9, M.gate + 1.6));      // the colours gate comes up once it has left the stand, and goes again once it is through
    gate.visible = gs > 0.002; gate.scale.setScalar(Math.max(gs, 0.001)); if (gate.visible) gate.userData.sheet.material.opacity = 0.5 + Math.sin(T * 3.1) * 0.08; }
  { const nv = S.d > M.gate - 3 && S.d < M.price ? 3 : S.stop === 'details' ? 2 : S.exact > M.talkEnd + 0.4 && S.exact < M_OUT + 2.5 ? 1 : (S.exact > M.street && S.exact <= M.talkEnd + 0.4) || (S.exact >= M_OUT + 2.5 && S.exact < M.details - 5) ? 0 : -1; if (nv !== S.nav) { S.nav = nv; navA.forEach((a, i) => a.classList.toggle('is-on', i === nv)); navB.forEach((a, i) => a.classList.toggle('is-on', i === nv)); } }      // the nav shows which of its four places you are in
  // the world pops up just ahead
  for (const p of pops) {
    const e0 = clamp((S.d - p.d) / p.span, 0, 1); if (e0 === p.e) continue; p.e = e0;
    const e = e0 <= 0 ? 0 : backOut(e0);
    p.obj.visible = e0 > 0; p.obj.scale.setScalar(Math.max(e, 0.001));
    if (p.homeY !== null && !p.obj.userData.letter) p.obj.position.y = p.homeY * e;
  }
  { const fk2 = 1 - smooth(S.d, M.price + 0.3, M.price + 1.1); if (fk2 < 1 && S.d > M.plinthEnd + 3) { for (const f of family) { f.r.root.visible = fk2 > 0.01; f.r.root.scale.setScalar(Math.max(0.001, fk2)); } shelf.visible = fk2 > 0.01; shelf.scale.setScalar(Math.max(0.001, fk2)); } }      // the others and their shelf are put away once it has gone on to the price
  // what it says
  const sp = smooth(S.d, M.talk - 0.6, M.talk + 0.2) * (1 - smooth(S.d, M.talkEnd - 0.9, M.talkEnd - 0.15));
  speech.m.visible = sp > 0.01;
  if (speech.m.visible) {
    const auto = clamp(Math.floor((S.d - M.talk) / (8 / 3)), 0, 2), qi = T - S.qPickT < 9 ? S.qPick : auto;
    if (qi !== S.q) { S.q = qi; S.qT = T; asks.forEach((b, i) => b.classList.toggle('is-on', i === qi)); }
    const mobS = tall(); speech.m.position.set(R.pos.x + (mobS ? 0.15 : 1.5), (mobS ? 1.64 : 1.5) + Math.sin(T * 1.4) * 0.025, R.pos.z + 0.3); speech.m.quaternion.copy(camera.quaternion); speech.m.scale.setScalar(backOut(Math.min(1, sp)) * (mobS ? 0.68 : 1));      // on a phone: a little smaller and lower, so the question sits under the top bar and not behind it
    if (S.tick % 2 === 0) speech.paint(S.q, Math.max(0, Math.floor((T - S.qT - 0.2) * 64)), T);
  }
  if (home.visible) { homeKit.catBody.scale.y = 0.9 + Math.sin(T * 1.6) * 0.035; if (homeKit.update) homeKit.update(T); }      // the cat breathes
  const pkk = S.d > M.sofa - 1.5 && S.d < M.sofaEnd + 3 ? (T * 0.8) % 1 : -1;
  ping.visible = pkk >= 0; if (pkk >= 0) { ping.scale.setScalar(0.3 + pkk * 1.2); ping.material.opacity = (1 - pkk) * 0.9; }
  keyObj.rotation.y = 0.6 + (S.found ? Math.sin(T * 9) * 0.05 : 0);
  { // charging: the dock's ring fills, rings pulse from its antenna, and a chip beside it says how full it is
    const charging = an === 'nap', level = lerp(0.18, 1, smooth(S.d, M.nap + 0.3, M.napEnd - 0.5));
    if (dock.visible) dockKit.update(T, level, charging);
    const pk = charging ? smooth(R.act.t, 0.1, 0.28) * (1 - smooth(R.act.t, 0.9, 1)) : 0;
    if (pk > 0.01) robot.tipWorld(pulse.group.position); pulse.update(T, pk, camera);
  }

  // its projector: its first film on the screen in front of it, then photos and film at home
  const projA = smooth(S.d, M.present0 + 0.6, M.present0 + 1.4) * (1 - smooth(S.d, M.presentEnd - 2.0, M.presentEnd - 1.3));
  const projB = smooth(S.d, M.photo - 0.6, M.photo + 0.6) * (1 - smooth(S.d, M.photoEnd - 0.2, M.photoEnd + 1));
  { // the screen comes up behind you while it waves, and goes again as it walks off
    const up = clamp((S.d - (M.landed - 1.5)) / 1.2, 0, 1), sc = (up <= 0 ? 0 : backOut(up)) * (1 - smooth(S.d, M.presentEnd - 0.45, M.presentEnd - 0.2));      // it goes while the iris is shut, so it is never seen from behind
    wallA.g.visible = sc > 0.002;
    if (wallA.g.visible) {
      wallA.g.scale.setScalar(Math.max(sc, 0.001)); wallA.g.position.y = wallA.cy * sc;
      const warm = projA > 0 && projA < 1 ? 0.82 + 0.18 * Math.sin(T * 41) * Math.sin(T * 13) : 1;                    // the lamp flickers as it comes on
      wallA.mat.color.setScalar(warm); wallA.mat.opacity = projA; wallA.spill(projA * warm);
      if (S.tick % 2 === 0) wallA.paint(filmS.where !== 'A' ? 0 : filmVid.error ? filmS.t / FILM_LEN : (T * 0.023) % 0.069, T, projA, filmReady() ? filmVid : null);      // the countdown runs until the film has loaded. Only if it can't load at all does the drawn film play.
      projLamp.intensity = projA * 70 * warm;
    } else projLamp.intensity = 0;
  }
  { // the film runs in its own time while a screen is showing it: on the first screen with you inside its head, and in the Film slot at home
    const want = povA && projA > 0.5 ? 'A' : wallB.g.visible && projB > 0.5 && S.slot === 1 ? 'B' : null;
    if (want !== filmS.where) { filmS.where = want; filmS.t = 0; filmS.done = false;
      if (want) { try { filmVid.currentTime = 0; } catch (e) {} filmVid.loop = want === 'B'; filmVid.muted = want === 'B' || !filmS.sound || !sfx.live() || sfx.off; filmVid.play().catch(() => { filmVid.muted = true; filmVid.play().catch(() => {}); }); }
      else filmVid.pause(); }
    if (want) filmS.t += dt;
    if (want === 'A' && !filmS.done && (filmReady() ? filmVid.ended || filmVid.currentTime > filmVid.duration - 0.9 : filmVid.error && filmS.t >= FILM_LEN)) { filmS.done = true; if (Math.abs(S.speed) < 0.5) autoTo(M.slap0 - 0.1, 4.6); }      // the last second of the film: the page starts to walk you back out, and leaves you looking at the next word
    const bar = povA && projA > 0.3; if (bar !== S.filmbar) { S.filmbar = bar; filmbar.classList.toggle('is-on', bar); }
    // one scroll at the hello is enough: the page carries you in through its lens and stops at the film. Any scroll of your own after that takes over.
    if (ASSIST && !reduceMotion && forward && was <= M.present0 - 1.8 && S.d > M.present0 - 1.8 && Math.abs(S.speed) < 9 && T - (S.navT ?? -9) > 3 && Math.abs(S.exact - S.d) < 2.5) { autoTo(M.present0 + 3.3, 3.0); auto.hold = performance.now() + 700; }
  }
  if (wallB.g.visible) {
    const auto = clamp(Math.floor((S.d - M.photo) / 3), 0, 3), slot = T - S.pickT < 7 ? S.pick : auto;
    if (slot !== S.slot) { S.slot = slot; thumbs.forEach((b, i) => b.classList.toggle('is-on', i === slot)); }
    wallB.mat.opacity = projB; wallB.spill(projB); if (S.tick % 2 === 0 && projB > 0) wallB.paint(slot, T);
    wallLamp.material.opacity = 0.2 + 0.8 * Math.max(N, dim);                                      // by day the wall lamp hardly shows on the wall, in the dark it glows
  }
  beam.visible = motes.pts.visible = projB > 0.02;                                                                     // from outside you see the light it throws. From inside its head you are the light.
  if (beam.visible) {
    const pa = beam.geometry.attributes.position; robot.lensWorld(lens); pa.setXYZ(0, lens.x, lens.y, lens.z);
    const cs = wallB.corners(), lit = 0.14 + 0.86 * wallB.lit; [0.25, 0.6, 1].forEach((f, r) => cs.forEach((c, i) => pa.setXYZ(1 + r * 4 + i, lerp(lens.x, c.x, f), lerp(lens.y, c.y, f), lerp(lens.z, c.z, f)))); pa.needsUpdate = true;
    beam.material.opacity = projB * lit * (0.17 + Math.sin(T * 13) * 0.007); motes.move(lens, cs, T, projB * lit);      // a dark picture throws less light
  }

  // 5. the camera: close, always moving, leaning in when you stop
  let fov = camAt(S.d);
  S.close = damp(S.close, S.idleFor > 0.7 ? 1 : 0, S.idleFor > 0.7 ? 0.9 : 3, dt);
  camOff.multiplyScalar((1 - 0.1 * S.close) * (1 + clamp(Math.abs(S.speed) / 16, 0, 0.14)));
  const follow = first || reduceMotion ? 1 : 1 - Math.exp(-7 * dt);
  anchor.x += (R.pos.x - anchor.x) * follow; anchor.z += (R.pos.z - anchor.z) * follow;
  anchor.y += (R.pos.y - anchor.y) * (first ? 1 : 1 - Math.exp(-(R.how === 'fall' ? 9 : R.air >= 0 || R.how === 'float' ? 4.5 : 3.2) * dt));
  camPos.copy(anchor).add(camOff); look.copy(anchor).add(camLook);
  if (!reduceMotion) { camPos.x += Math.sin(T * 0.7) * 0.03; camPos.y += Math.sin(T * 0.9 + 1) * 0.022; }
  if (pointer.has && !coarse && !drag) { camPos.x += pointer.x * 0.16; camPos.y += pointer.y * 0.09; }
  if (S.d <= M.lip) camPos.y = Math.max(camPos.y, 0.14);
  const endK = smooth(S.d, M.land - 1.7, M.land - 0.1);                                            // the last shot: pull back until the words and the button fit
  if (endK > 0) {
    const mob2 = tall(), f2 = mob2 ? 52 : 34, th = Math.tan(THREE.MathUtils.degToRad(f2 / 2));
    const r = Math.max(endBox.w * (mob2 ? 1.18 : 1.12) / (2 * th * camera.aspect), 5.2 / (2 * th));                   // closer on the landing: the words just fit
    _a.set(endBox.cx + (mob2 ? 0 : 1.0), endBox.cy + 4.4 + r * 0.16, EZ + r); _b.set(endBox.cx, endBox.cy + (mob2 ? -0.9 - r * 0.14 : 0.5), EZ + 1.8);      // the words sit below the nav, whole
    camPos.lerp(_a, endK); look.lerp(_b, endK); fov = lerp(fov, f2, endK);
    const inK = smooth(S.d, M.land + 0.5, M.land + 3.2);                                           // once the words have gone, come in close: the robot on its button
    if (inK > 0) { _a.set(BTN.x + (mob2 ? 0.3 : 1.2), FY + (mob2 ? 5.2 : 4.5), BTN.z + (mob2 ? 12.2 : 10.8)); _b.set(BTN.x, FY - (mob2 ? 1.3 : 0.25), BTN.z - (mob2 ? 0 : 0.2));      // far enough back, and aimed low enough, that the whole button and the robot on it sit between the bar and the card      // close: the robot is the picture, standing on the word it wants you to press
      camPos.lerp(_a, inK); look.lerp(_b, inK); fov = lerp(fov, mob2 ? 50 : 30, inK); }
  }
  for (const dv of [M.present0, M.dive]) { const hk = smooth(S.d, dv - 1.7, dv - 0.5) * (1 - smooth(S.d, dv - 0.3, dv)); if (hk > 0) {      // going in: the lens itself is the middle of the picture, so the iris closes on it
    robot.lensWorld(lens); look.lerp(lens, hk); _a.copy(lens).addScaledVector(_b.set(Math.sin(S.yaw), 0, Math.cos(S.yaw)), 0.62); _a.y += 0.01; camPos.lerp(_a, hk * hk); } }
  if (povA) {                                                                                      // its first film: you are behind its lens, looking up at the screen
    const mobP = tall(), k1 = smooth(S.d, M.present0 + 0.3, M.present0 + 2.9);                     // first the room and a blank screen, then it leans in on the picture
    fov = lerp(mobP ? 100 : 62, mobP ? 94 : 46, k1);
    camPos.set(R.pos.x + Math.sin(T * 0.8) * 0.012, R.pos.y + 0.8 + Math.sin(T * 1.1) * 0.008, R.pos.z + 0.25);
    _a.set(SCREEN.x, lerp(1.2, SCREEN.y - 0.42, k1), SCREEN.z);                                    // the picture sits high in the view, clear of the buttons and the track
    if (pointer.has && !coarse) { _a.x -= pointer.x * 0.7; _a.y += pointer.y * 0.4; }              // you can look around a little
    if (!S.povInit) { S.povInit = true; povLook.copy(_a); }
    povLook.lerp(_a, 1 - Math.exp(-3.5 * dt)); look.copy(povLook);
    projLamp.position.copy(camPos); projLamp.target.position.copy(SCREEN); povLamp.intensity = 0;
  } else if (pov) {                                                                                // through its lens, 14 cm off the floor
    fov = tall() ? 82 : 64;
    camPos.set(R.pos.x + Math.sin(S.d * 3.7) * 0.02, R.pos.y + 0.8 + Math.abs(Math.sin(S.d * 7.4)) * 0.03, R.pos.z).addScaledVector(R.dir, 0.25);
    _a.copy(camPos).addScaledVector(R.dir, 6); _a.y = 0.75;
    let best = null, bd = 1e9;
    for (const t of SEEN) { const ahead = (t.p.x - camPos.x) * R.dir.x + (t.p.z - camPos.z) * R.dir.z, dd = t.p.distanceTo(camPos); if (ahead > -0.6 && dd < bd) { bd = dd; best = t; } }
    if (best) _a.lerp(best.p, (1 - smooth(bd, 5, 14)) * 0.82);                                    // its eye goes to the nearest thing it knows
    { const sk = smooth(S.d, M.stove - 4.5, M.stove - 1) * (1 - smooth(S.d, M.stoveEnd + 0.5, M.stoveEnd + 2)); if (sk > 0) _a.lerp(_b.set(SX + 4.2, 4.4, Z.stove - 1.0), sk); }      // at the stove it looks up and round at the whole thing
    if (pointer.has && !coarse) { _a.x += pointer.x * 1.8; _a.y += pointer.y * 1.0; }              // and you can look around
    if (!S.povInit) { S.povInit = true; povLook.copy(_a); }
    povLook.lerp(_a, 1 - Math.exp(-3.5 * dt)); look.copy(povLook);
    const under = smooth(-camPos.z, -Z.sofa - 3.6, -Z.sofa - 2.6) * (1 - smooth(-camPos.z, -Z.sofa + 2.6, -Z.sofa + 3.6));
    hemi.intensity *= 1 - under * 0.8; scene.environmentIntensity *= 1 - under * 0.8; povLamp.intensity = under * 8; povLamp.position.copy(camPos);
  } else { S.povInit = false; povLamp.intensity = 0; }
  walk.frame({ S, R, T });
  camera.position.copy(camPos); camera.lookAt(look);
  camera.fov = fov;
  const live = copies.find((c) => c.on && c.side !== 'none'), side = live ? live.side : 'none', mob = tall();
  S.shiftX = damp(S.shiftX, mob ? 0 : side === 'left' ? 0.1 : side === 'right' ? -0.1 : 0, 2.6, dt);
  S.shiftY = damp(S.shiftY, mob && live ? (live.el.classList.contains('hero') ? 0.2 : 0.23) : 0, 2.6, dt);
  camera.setViewOffset(innerWidth, innerHeight, -S.shiftX * innerWidth, S.shiftY * innerHeight, innerWidth, innerHeight);
  sun.target.position.copy(anchor); sun.position.copy(anchor).add(SUN_OFF);
  rim.target.position.copy(anchor); rim.position.copy(anchor).add(RIM_OFF);
  const reach = camOff.length(); scene.fog.near = reach * 1.15 + 4; scene.fog.far = reach + 26;
  const blueK = smooth(S.d, M.edge + 0.5, M.lip0 - 0.5);
  { const nk = Math.max(N, dim); if (nk < 0.5) scene.background.lerpColors(SKY, DUSK, nk * 2); else scene.background.lerpColors(DUSK, NIGHT, nk * 2 - 1); }      // day goes to night through a warm dusk, not through grey
  scene.background.lerp(BLUE_SKY, blueK); scene.fog.color.copy(scene.background);
  if (S.d > M.lip) { scene.fog.near = 30; scene.fog.far = 120; }
  if (pov) { scene.fog.near = 9; scene.fog.far = 48; }
  if (S.late !== (S.d > M.edge)) { S.late = S.d > M.edge; price.forEach((L) => { L.mesh.castShadow = !S.late; }); }

  // 6. the page copy
  for (const c of copies) { const on = S.exact >= c.d0 && S.exact <= c.d1; if (on !== c.on) { c.on = on; c.el.classList.toggle('is-on', on); } }
  hint.classList.toggle('is-off', S.exact < M.landed - 1.6 || S.exact > M.landed + 2);          // "scroll to walk" shows once it is out of the box and waiting for you
  { const pr = (S.exact / route.total * 100).toFixed(2); if (pr !== S.rail) { S.rail = pr; railfill.style.width = `calc(${pr}% - 2px)`; railbot.style.left = pr + '%'; if (!reduceMotion) seal.style.setProperty('--turn', (S.exact * 9).toFixed(1) + 'deg');      /* the seal's ring turns with the walk */ for (const k of railticks) { const dn = S.exact > k.a; if (dn !== k.done) { k.done = dn; k.el.classList.toggle('is-done', dn); } } }
    const mv = Math.abs(S.speed) > 0.6; if (mv !== S.railMv) { S.railMv = mv; railbot.classList.toggle('is-moving', mv); } }
  document.body.classList.toggle('sky-blue', blueK > 0.5); document.body.classList.toggle('at-end', S.d > M.lip + 0.4); document.body.classList.toggle('night', Math.max(N, dim) > 0.5); document.body.classList.toggle('proj', dim > 0.5 && N < 0.5);

  window.__heroFx?.frame?.(look);      // the intro's rain and freeze get the last word on the camera (js/hero-fx.js)
  renderer.render(scene, camera);

  walk.after({ S, R });
  for (const c of callouts) {
    const on = S.exact >= c.d0 && S.exact <= c.d1; if (on !== c.on) { c.on = on; c.el.classList.toggle('is-on', on); }
    if (!on) continue;
    _v.set(c.a[0], c.a[1], c.a[2]); robot.root.localToWorld(_v); _v.project(camera);
    c.el.style.transform = `translate(${((_v.x * 0.5 + 0.5) * innerWidth).toFixed(1)}px, ${((-_v.y * 0.5 + 0.5) * innerHeight).toFixed(1)}px) translate(${c.left ? '-100%' : '0'}, -50%)`;
  }
  // what the lens shows: tags that lock on to what it recognises, and the iris you pass through
  hud.classList.toggle('is-on', pov);
  if (povA !== S.filmHud) { S.filmHud = povA; hud.classList.toggle('film', povA); hudA.textContent = povA ? '● Projecting' : '● Mosey vision'; if (!povA) hudB.textContent = '14 cm · 08:41 · 82%'; }
  if (povA && S.tick % 10 === 0) { const ft = filmReady() ? Math.floor(filmVid.currentTime) : 0, fd = filmReady() ? Math.round(filmVid.duration) : 30, txt = `0:${String(ft).padStart(2, '0')} / 0:${fd}`; if (txt !== S.filmClock) { S.filmClock = txt; hudB.textContent = txt; } }      // the film's clock, sharp, in the corner of its view
  if (povB) { S.nearSeen = 1e9; for (const t of SEEN) { _v.copy(t.p).project(camera); if (_v.z < 1 && Math.abs(_v.x) < 1.02 && Math.abs(_v.y) < 1.02) S.nearSeen = Math.min(S.nearSeen, t.p.distanceTo(camera.position)); } }      // one thing at a time: only the nearest one in view gets brackets, plus any it has already locked on to
  if (povB) for (const t of SEEN) {
    _v.copy(t.p).project(camera); const dd = t.p.distanceTo(camera.position), on = _v.z < 1 && dd < 13 && Math.abs(_v.x) < 1.02 && Math.abs(_v.y) < 1.02;
    const lk = on && dd < (t.name === 'Stove' ? 11.5 : 7.5) && S.d < M_OUT - 1.5; t.el.classList.toggle('is-on', on && (lk || dd < S.nearSeen + 0.01)); t.el.classList.toggle('main', dd < S.nearSeen + 0.01); t.el.classList.toggle('lock', lk); t.el.classList.toggle('flip', _v.x > (tall() ? -0.2 : 0.2));
    if (lk && !t.lk) t.lockT = T; t.lk = lk;
    if (!on) continue;
    t.el.style.transform = `translate(${((_v.x * 0.5 + 0.5) * innerWidth).toFixed(1)}px, ${((-_v.y * 0.5 + 0.5) * innerHeight).toFixed(1)}px)`;
    if (S.tick % 5 === 0) {                                                                         // the brackets grow as it gets nearer, with the distance under them in the robot's own centimetres
      const sz = Math.round(clamp(1300 / dd, 70, 230) / 10) * 10; if (sz !== t.sz) { t.sz = sz; t.el.style.setProperty('--s', sz + 'px'); }
      const cm = Math.round(dd * 12.2 / 5) * 5; if (cm !== t.cm) { t.cm = cm; t.dist.textContent = cm >= 100 ? (cm / 100).toFixed(1) + ' m' : cm + ' cm'; }
    }
    if (lk) { const c = Math.min(99 - (t.name.length % 4), Math.floor((T - t.lockT) * 150)); if (c !== t.c) { t.c = c; t.conf.textContent = `Match ${c}%`; } }
  }
  scanRing.visible = povB;
  if (povB) { const kk = (T * 0.42) % 1; scanRing.position.set(camera.position.x, 0.03, camera.position.z); scanRing.scale.setScalar(0.6 + kk * 13); scanRing.material.opacity = (1 - kk) * (1 - kk) * 0.55; }
  const through = (d, a = 1.5) => 1 - smooth(S.d, d - a, d - 0.45) + smooth(S.d, d - 0.15, d + 0.9);          // the iris closes as you reach its lens and opens on the other side
  const ir = Math.min(through(M.present0), through(M.presentEnd + 0.1, 1.5), through(M.dive), 1 - smooth(S.d, M_OUT - 1.3, M_OUT - 0.35) + smooth(S.d, M_OUT - 0.05, M_OUT + 0.9));
  { const dv = ir < 0.8; if (dv !== S.diving) { S.diving = dv; document.body.classList.toggle('diving', dv); } }      // the nav steps aside while the lens fills the picture
  if (ir !== S.ir) { S.ir = ir; iris.style.display = ir >= 1 ? 'none' : 'block'; iris.style.setProperty('--r', (ir * 84).toFixed(1)); }
  if (first) { first = false; boot.firstFrame = Math.round(performance.now()); document.getElementById('loading')?.classList.add('is-done'); setTimeout(warm, 400); }
  if (boot.warmDone && !boot.shown && new URLSearchParams(location.search).has('boot')) { boot.shown = true; document.body.appendChild(Object.assign(document.createElement('pre'), { textContent: `world ${boot.world - boot.start} ms\nfirst frame ${boot.firstFrame - boot.start} ms\nwarm-up held the page ${boot.warmHeld} ms\nshaders ready ${boot.warmDone - boot.start} ms\nworst frame ${perf.worst.toFixed(0)} ms`, style: 'position:fixed;left:20px;top:80px;z-index:99;background:#000;color:#fff;font:600 22px/1.4 monospace;padding:14px 18px' })); }      // ?boot shows how long the page took to get ready
  if (!manual) requestAnimationFrame(frame);
}
// Right after the first frame: hand every material's shader to the graphics driver to build in the background.
// Without this each new kind of surface is built the first time it scrolls into view, and each one costs a stutter.
// (Drawing the whole world once up front did the same job but held the page for seven seconds.)
// ?warmtest draws each object of the home once on its own, off screen, and lists the slowest. For finding what stalls the first time the home shows.
function warmTest() {
  const rt = new THREE.WebGLRenderTarget(64, 64), cam = new THREE.PerspectiveCamera(70, 1, 0.1, 500), out = [], meshes = [];
  home.traverse((o) => { if (o.isMesh || o.isInstancedMesh || o.isLine || o.isPoints) meshes.push(o); });
  const top = scene.children.map((o) => [o, o.visible]); for (const [o] of top) if (!o.isLight && o !== home) o.visible = false;
  home.visible = true; for (const m of meshes) { m.userData.wv = m.visible; m.visible = false; m.userData.fc = m.frustumCulled; m.frustumCulled = false; }
  cam.position.set(SX, 30, -10); cam.lookAt(SX, 0, -38); renderer.setRenderTarget(rt);
  const gl = renderer.getContext(), px = new Uint8Array(4);
  for (const m of meshes) { m.visible = true; const t0 = performance.now(); renderer.render(scene, cam); gl.readPixels(0, 0, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, px); const ms = performance.now() - t0; m.visible = false;
    const g = m.geometry, tris = Math.round((g.index ? g.index.count : g.attributes.position.count) / 3), mt = [].concat(m.material)[0], maps = ['map', 'normalMap', 'roughnessMap', 'bumpMap', 'aoMap', 'alphaMap'].filter((n) => mt[n]).map((n) => `${n}:${mt[n].image?.width}`).join(' ');
    out.push([ms, `${ms.toFixed(0)} ms  ${m.name || m.parent?.name || mt.type}  tris ${tris}  ${m.isInstancedMesh ? 'x' + m.count : ''}  ${maps}`]); }
  renderer.setRenderTarget(null); for (const m of meshes) { m.visible = m.userData.wv; m.frustumCulled = m.userData.fc; } for (const [o, v] of top) o.visible = v; rt.dispose();
  out.sort((a, b) => b[0] - a[0]); const total = out.reduce((n, o) => n + o[0], 0);
  document.body.appendChild(Object.assign(document.createElement('pre'), { textContent: `home: ${meshes.length} objects, ${total.toFixed(0)} ms in all\n` + out.slice(0, 16).map((o) => o[1]).join('\n'), style: 'position:fixed;left:10px;top:70px;z-index:99;background:#000;color:#fff;font:600 15px/1.35 monospace;padding:12px 16px;max-width:1400px;white-space:pre-wrap' }));
}
function warm() {
  try { const was = [], t0 = performance.now(); scene.traverse((o) => { was.push([o, o.visible]); o.visible = true; });
    const done = renderer.compileAsync(scene, camera); for (const [o, v] of was) o.visible = v;
    boot.warmHeld = Math.round(performance.now() - t0); done.then(() => { try { const rt = new THREE.WebGLRenderTarget(16, 16), keep = []; scene.traverse((o) => { if (o.isLight) return; keep.push([o, o.visible, o.frustumCulled]); o.visible = true; o.frustumCulled = false; }); renderer.setRenderTarget(rt); renderer.render(scene, camera); renderer.setRenderTarget(null); for (const [o, v, f] of keep) { o.visible = v; o.frustumCulled = f; } rt.dispose(); } catch (e) { renderer.setRenderTarget(null); }      /* every mesh and texture goes to the graphics card now, behind the loader, and not as a stutter half way down the page */
      renderer.debug.checkShaderErrors = false;      /* every shader has been built and checked by now. Left on, the first real use of one later in the walk stops to ask the graphics card for its error log, which is a visible hitch on a slow phone */
      boot.warmDone = Math.round(performance.now()); if (new URLSearchParams(location.search).has('warmtest')) warmTest(); }).catch(() => {});
  } catch (e) { console.warn('warm-up skipped', e); }
}
requestAnimationFrame(frame);
document.addEventListener('visibilitychange', () => { running = !document.hidden; if (running) { last = performance.now(); requestAnimationFrame(frame); } });

// callable checks for the build, not shown on the page
window.__mosey = {
  marks: M, total: route.total, state: S, boot, camera, robot, anchor, camOff, route, scene, renderer, world, drop, heroType, BX, sfx,
  yFor: (d) => scrollForD(typeof d === 'string' ? parseD(d) : d),
  goTo: (d) => scrollTo(0, scrollForD(typeof d === 'string' ? parseD(d) : d)),
  step: (n = 150) => { manual = true; for (let i = 0; i < n; i++) frame(last + 1000 / 60); manual = false; last = performance.now(); document.getElementById('loading')?.remove(); if (window.__introGate) window.__introGate.hold = false; return +S.d.toFixed(1); },   // run frames by hand, for checks while the tab is in the background
  perf: () => { const r = { fps: +(1000 / (perf.ms / perf.frames)).toFixed(1), worstMs: +perf.worst.toFixed(1), calls: renderer.info.render.calls, triangles: renderer.info.render.triangles, bodies: world.bodies.len(), dpr: DPR }; perf.frames = perf.ms = perf.worst = 0; return r; },
};

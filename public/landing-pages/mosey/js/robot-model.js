// Mosey, the real one: the Higgsfield model (Tripo mesh, Meshy skeleton and walk, torso and head re-skinned
// to single bones, see assets/model/README.md) behind the same calls as the stand-in in robot.js.
//
// The file has one clip, a walk. Everything else is done on the skeleton in code:
// the walk is scrubbed by distance, it fades into a standing pose when the robot stops,
// and each "act" (peek, climb, teeter, wave, talk, nap, fly and the rest) turns a few bones on top of that.
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { clone as cloneRig } from 'three/addons/utils/SkeletonUtils.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export const WAYS = {
  classic: { name: 'Silver',   body: 0xc2c5cc, fixed: true },       // satin silver and brass
  tomato:  { name: 'Tomato',   body: 0xe8452c, paint: 0xe8452c },
  mint:    { name: 'Mint',     body: 0x8fd3b6, paint: 0x8fd3b6 },
  sunny:   { name: 'Sunny',    body: 0xf6c21a, paint: 0xf6c21a },
};

const damp = (a, b, l, dt) => a + (b - a) * (1 - Math.exp(-l * dt));
const clamp = THREE.MathUtils.clamp;
const bell = (t) => Math.sin(Math.PI * clamp(t, 0, 1));
const X = new THREE.Vector3(1, 0, 0), Y = new THREE.Vector3(0, 1, 0), Z = new THREE.Vector3(0, 0, 1);
const TALL = 1.7, HEIGHT = 1.15, K = HEIGHT / TALL;                 // the model stands 1.7 in its own units, the page wants 1.15
const LENS = new THREE.Vector3(0, 1.37, 0.24), TIP = new THREE.Vector3(0, 1.7, 0);       // in the model's own units: the middle of the face, the top of the antenna
const NECK = 0.085;                                                                         // how far the head is lifted off the body
const STRIDE = 0.8, CYCLE = 4.2 / 4;                                // page units walked per walk cycle, and seconds of clip per cycle

let source = null, AVG = 0.06;
// how bright the texture is on average (linear light), so the shader can tell "darker than usual" from "lighter than usual"
function averageLight(img) {
  try { const c = document.createElement('canvas'); c.width = c.height = 64; const k = c.getContext('2d', { willReadFrequently: true }); k.drawImage(img, 0, 0, 64, 64);
    const d = k.getImageData(0, 0, 64, 64).data; let sum = 0, n = 0;
    for (let i = 0; i < d.length; i += 4) { const lin = (v) => Math.pow(v / 255, 2.2); sum += 0.299 * lin(d[i]) + 0.587 * lin(d[i + 1]) + 0.114 * lin(d[i + 2]); n++; }
    return Math.max(0.01, sum / n); } catch (e) { return 0.06; }
}
export async function loadRobot(url = 'models/mosey-clean.glb') {
  source = await new GLTFLoader().loadAsync(url);
  source.scene.traverse((o) => { if (o.isMesh && o.material.map?.image) AVG = averageLight(o.material.map.image); });
  return source;
}

export function createRobot() {
  const root = new THREE.Group();          // placed on the route by the page
  const spin = new THREE.Group();          // flips turn around the belly, not the feet
  spin.position.y = 0.5; root.add(spin);
  const body = new THREE.Group();          // bob, lean, squash
  body.position.y = -0.5; spin.add(body);
  const model = cloneRig(source.scene); model.scale.setScalar(K); body.add(model);

  /* ---------- the surface ----------
     The model's texture came out blotchy, with highlights baked in. It is kept for what it is good at
     (where the brass is, where the panel lines and seams are) and the finish is rebuilt on top:
     one even satin graphite, real metal for the brass, a clear coat. Colourways swap the graphite for paint. */
  let skinned = null;
  model.traverse((o) => { if (o.isSkinnedMesh) skinned = o; });
  const src = skinned.material;
  const U = { uBody: { value: new THREE.Color() }, uBrassCol: { value: new THREE.Color('#b28a45') }, uClean: { value: 0.92 }, uMetal: { value: 0.62 }, uRough: { value: 0.4 }, uAvg: { value: AVG },
    uHeadI: { value: skinned.skeleton.bones.findIndex((b) => b.name === 'Head') }, uHipsI: { value: skinned.skeleton.bones.findIndex((b) => b.name === 'Hips') },
    uShL: { value: skinned.skeleton.bones.findIndex((b) => b.name === 'LeftShoulder') }, uShR: { value: skinned.skeleton.bones.findIndex((b) => b.name === 'RightShoulder') },
    // Only the legs and feet of the generated model are drawn. Everything else has a clean part built in code standing in for it,
    // so any vertex that follows another bone (head, body, spine, shoulders, arms, hands) is left out. That also removes stray scraps, like the one under the armpit.
    uShow: { value: ['LeftUpLeg', 'LeftLeg', 'LeftFoot', 'LeftToeBase', 'RightUpLeg', 'RightLeg', 'RightFoot', 'RightToeBase'].map((n) => skinned.skeleton.bones.findIndex((b) => b.name === n)) } };
  const mat = new THREE.MeshPhysicalMaterial({ map: src.map, normalMap: src.normalMap, roughnessMap: src.roughnessMap, metalnessMap: src.metalnessMap, clearcoat: 0.28, clearcoatRoughness: 0.3, envMapIntensity: 1.7 });
  mat.normalScale.copy(src.normalScale).multiplyScalar(0.4);
  mat.onBeforeCompile = (sh) => {
    Object.assign(sh.uniforms, U);
    // The generated head and body are lumpy, so clean shells stand in for them (below). Their own vertices are
    // pulled toward the middle of each part, out of sight. Every vertex follows one bone, so the bone index says which part it is.
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nuniform float uHeadI; uniform float uHipsI; uniform float uShL; uniform float uShR; uniform float uShow[8]; varying float vHide;').replace('#include <begin_vertex>', `#include <begin_vertex>
      vHide = 0.0;
      #ifdef USE_SKINNING
        vHide = 1.0; for (int i = 0; i < 8; i++) if (abs(skinIndex.x - uShow[i]) < 0.5) vHide = 0.0;      // and any triangle that touches one of them is not drawn at all, so no stretched sliver can show
        if (abs(skinIndex.x - uHeadI) < 0.5) transformed = mix(vec3(0.0, 1.455, -0.035), transformed, 0.5);
        else if (abs(skinIndex.x - uHipsI) < 0.5) transformed = mix(vec3(0.0, 0.87, 0.0), transformed, 0.55);
        else if (abs(skinIndex.x - uShL) < 0.5 || abs(skinIndex.x - uShR) < 0.5) transformed = vec3(sign(transformed.x) * 0.25, 1.02, -0.03);      // the lumps between body and arm: gathered to a point inside the shoulder ball
      #endif`);
    sh.fragmentShader = sh.fragmentShader
      .replace('uniform vec3 diffuse;', 'uniform vec3 diffuse; uniform vec3 uBody; uniform vec3 uBrassCol; uniform float uClean; uniform float uMetal; uniform float uRough; uniform float uAvg; varying float vHide; float gBrass = 0.0;')
      .replace('#include <map_fragment>', `#include <map_fragment>
      if (vHide > 0.001) discard;
      { vec3 t = diffuseColor.rgb; float hi = max(t.r, max(t.g, t.b)), lo = min(t.r, min(t.g, t.b));
        gBrass = smoothstep(0.3, 0.5, hi > 0.001 ? (hi - lo) / hi : 0.0) * smoothstep(0.5, 1.3, hi / uAvg);        // saturated and bright: that is brass
        float lum = dot(t, vec3(0.299, 0.587, 0.114));
        float shade = mix(1.0, clamp(lum / uAvg, 0.3, 1.15), 0.28);                                                  // keep a hint of the seams, lose the blotches
        diffuseColor.rgb = mix(mix(t * 1.7, uBody * shade, uClean), uBrassCol * clamp(lum / (uAvg * 2.4), 0.55, 1.35), gBrass); }`)
      .replace('#include <roughnessmap_fragment>', '#include <roughnessmap_fragment>\n roughnessFactor = mix(mix(roughnessFactor, uRough, uClean), 0.28, gBrass);')
      .replace('#include <metalnessmap_fragment>', '#include <metalnessmap_fragment>\n metalnessFactor = mix(mix(metalnessFactor, uMetal, uClean), 1.0, gBrass);');
  };
  model.traverse((o) => { if (o.isMesh) { o.material = mat; o.castShadow = true; o.receiveShadow = false; o.frustumCulled = false; } });

  /* ---------- the skeleton: a standing pose, then the walk on top ---------- */
  const bone = {}; skinned.skeleton.bones.forEach((b) => { bone[b.name] = b; });
  { // standing = the pose the mesh was bound in. Each bone's place relative to its parent comes from the bind matrices.
    const sk = skinned.skeleton, inv = sk.boneInverses, m = new THREE.Matrix4();
    sk.bones.forEach((b, i) => {
      const pi = sk.bones.indexOf(b.parent);
      if (pi >= 0) m.copy(inv[pi]).multiply(inv[i].clone().invert());
      else { b.parent.updateMatrix(); m.copy(b.parent.matrix).invert().multiply(inv[i].clone().invert()); }      // the root bone sits in the armature, which is scaled to 1/100
      m.decompose(b.position, b.quaternion, b.scale);
    });
  }
  root.updateMatrixWorld(true);
  // The walk is sampled by hand, not through an AnimationMixer: every frame each bone is set to
  // (standing pose, blended toward the clip at this moment), and the acts then turn bones on top of that.
  // A mixer skips writing a value that did not change, which would let those turns pile up frame after frame.
  const clip = source.animations[0], _q = new THREE.Quaternion(), _v = new THREE.Vector3();
  // The clip was recorded from a person, whose legs pass close together and turn in and out. This robot's legs are wide blocks,
  // so its legs only keep the part of each rotation that swings front to back (about the robot's side-to-side axis).
  const LEGS = /^(Left|Right)(UpLeg|Leg|Foot|ToeBase)$/, SWING = { UpLeg: 0.92, Leg: 1, Foot: 1, ToeBase: 1 };
  const tracks = clip.tracks.map((tr) => { const dot = tr.name.lastIndexOf('.'), name = tr.name.slice(0, dot), b = bone[name], prop = tr.name.slice(dot + 1);
    if (!b || prop === 'scale' || /^(Spine|Spine01|Spine02|LeftShoulder|RightShoulder)$/.test(name)) return null;      // its chest is one rigid block: no spine, no shrugging. The arms stay seated in their shoulder balls and the head stays over the body.
    const k = { b, quat: prop === 'quaternion', it: tr.createInterpolant(), rest: (prop === 'quaternion' ? b.quaternion : b.position).clone() };
    if (k.quat && LEGS.test(name)) { k.P = model.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(b.parent.getWorldQuaternion(new THREE.Quaternion())); k.Pi = k.P.clone().invert(); k.restI = k.rest.clone().invert(); k.amp = SWING[name.replace(/^(Left|Right)/, '')]; }
    if (k.quat && name === 'Hips') k.half = 0.4;                         // and its hips roll less
    if (k.quat && (name === 'Head' || name === 'neck')) k.half = 0.3;    // and its head stays level, so the box never tips into the shoulders
    if (!k.quat && name === 'Hips') k.noSway = true;                     // and don't sway from side to side
    return k; }).filter(Boolean);
  const _d2 = new THREE.Quaternion(), _t2 = new THREE.Quaternion();
  // The skeleton puts each hip pivot 18 cm above the top of the leg, inside the body, so the leg tops used to swing out of the hips.
  // Here each leg is made to turn about an axle at its own top instead: after the bone is rotated, it is shifted so that point stays put.
  const hipAxle = ['LeftUpLeg', 'RightUpLeg'].map((n) => { const b = bone[n];
    const Prest = model.getWorldQuaternion(new THREE.Quaternion()).invert().multiply(b.parent.getWorldQuaternion(new THREE.Quaternion()));
    const ratio = model.getWorldScale(new THREE.Vector3()).x / b.parent.getWorldScale(new THREE.Vector3()).x;                       // model units to the bone's own units
    return { b, restI: b.quaternion.clone().invert(), v: new THREE.Vector3(0, -0.178, 0.02).applyQuaternion(Prest.invert()).multiplyScalar(ratio) }; });
  /* ---------- clean parts ----------
     The head and the body are simple shapes, and a generated mesh never gets a simple shape perfectly smooth.
     So they are built here instead: two rounded shells in one finish, as if sprayed in one pass, with the face,
     the lens, the speaker, the antenna and the charge port as crisp parts on top. Arms and legs stay the model's own.
     Each group rides on a bone: it sits in the model's own space and is moved by however far that bone is from its bind pose. */
  const riders = [], palms = {}, _m = new THREE.Matrix4(); let fill = null;
  const rideOn = (b) => { const g = new THREE.Group(); g.matrixAutoUpdate = false; model.add(g); riders.push({ g, b, c: b.matrixWorld.clone().invert().multiply(model.matrixWorld) }); return g; };
  const headRig = rideOn(bone.Head), bodyRig = rideOn(bone.Hips);
  const part = (rig, geo, m, x, y, z, shadow = false) => { const o = new THREE.Mesh(geo, m); o.position.set(x, y, z); o.castShadow = shadow; rig.add(o); return o; };
  const shell = new THREE.MeshPhysicalMaterial({ roughness: 0.4, metalness: 0.62, clearcoat: 0.28, clearcoatRoughness: 0.3, envMapIntensity: 1.9 });       // its colour follows the colourway
  const glass = new THREE.MeshPhysicalMaterial({ color: 0x0a0a0d, roughness: 0.16, metalness: 0, clearcoat: 0, envMapIntensity: 0.9, specularIntensity: 0.25 });      // glossy, but not a mirror: a face that goes white when it looks up is wrong
  const dark = new THREE.MeshStandardMaterial({ color: 0x1b1c20, roughness: 0.38, metalness: 0.7 });      // the lens barrel, the antenna pin, the charge contact
  const joint = new THREE.MeshPhysicalMaterial({ color: 0x5b5e67, roughness: 0.38, metalness: 0.55, clearcoat: 0.3, clearcoatRoughness: 0.35, envMapIntensity: 1.7 });       // gunmetal, for everything that turns
  const brass = new THREE.MeshStandardMaterial({ color: 0xb28a45, roughness: 0.3, metalness: 1 });
  const canvasTex = (w, h, draw) => { const c = document.createElement('canvas'); c.width = w; c.height = h; draw(c.getContext('2d')); const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4; return t; };

  // the head: one rounded block, lifted off the body on a real neck so it can look down without sinking into the shoulders
  const head = new THREE.Group(); head.position.y = NECK; headRig.add(head);
  part(head, new RoundedBoxGeometry(0.606, 0.476, 0.496, 10, 0.085), shell, 0, 1.37, -0.035, true);
  { // the face is set into the head: a raised rim in the head's own finish, and inside it the glass, the streak of light and the lens
    const F = 0.213, W = 0.43, Hh = 0.3;                                    // the front of the head, and the size of the glass
    const rr = (w, h, r) => { const p = new THREE.Shape(), x = -w / 2, y = -h / 2; p.moveTo(x + r, y); p.lineTo(x + w - r, y); p.quadraticCurveTo(x + w, y, x + w, y + r); p.lineTo(x + w, y + h - r); p.quadraticCurveTo(x + w, y + h, x + w - r, y + h); p.lineTo(x + r, y + h); p.quadraticCurveTo(x, y + h, x, y + h - r); p.lineTo(x, y + r); p.quadraticCurveTo(x, y, x + r, y); return p; };
    const rim = rr(W + 0.05, Hh + 0.05, 0.075); rim.holes.push(rr(W - 0.006, Hh - 0.006, 0.052));
    part(head, new THREE.ExtrudeGeometry(rim, { depth: 0.017, bevelEnabled: true, bevelThickness: 0.004, bevelSize: 0.004, bevelSegments: 3, curveSegments: 10 }), shell, 0, LENS.y, F - 0.004, true);
    part(head, new RoundedBoxGeometry(W, Hh, 0.012, 6, 0.05), glass, 0, LENS.y, F - 0.004);               // the glass sits below the rim
    const streak = canvasTex(128, 96, (k) => { const g = k.createLinearGradient(0, 0, 128, 96);
      g.addColorStop(0, 'rgba(255,255,255,0.22)'); g.addColorStop(0.28, 'rgba(255,255,255,0.05)'); g.addColorStop(0.3, 'rgba(255,255,255,0.13)'); g.addColorStop(0.46, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(255,255,255,0.05)');
      k.fillStyle = g; k.beginPath(); k.roundRect(0, 0, 128, 96, 16); k.fill(); });
    part(head, new THREE.PlaneGeometry(W - 0.012, Hh - 0.012), new THREE.MeshBasicMaterial({ map: streak, transparent: true, depthWrite: false }), 0, LENS.y, F + 0.0035);
    part(head, new THREE.CylinderGeometry(0.081, 0.086, 0.02, 48), dark, 0, LENS.y, F + 0.012).rotation.x = Math.PI / 2;
    part(head, new THREE.TorusGeometry(0.077, 0.008, 14, 64), brass, 0, LENS.y, F + 0.022);
    part(head, new THREE.SphereGeometry(0.066, 40, 26), glass, 0, LENS.y, F + 0.012).scale.z = 0.36;
    part(head, new THREE.TorusGeometry(0.035, 0.0065, 10, 40), new THREE.MeshStandardMaterial({ color: 0x3a3d4a, roughness: 0.3, metalness: 0.6 }), 0, LENS.y, F + 0.028);
    part(head, new THREE.SphereGeometry(0.01, 10, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }), -0.025, LENS.y + 0.027, F + 0.034);
    part(head, new THREE.SphereGeometry(0.005, 8, 6), new THREE.MeshBasicMaterial({ color: 0xffffff }), 0.021, LENS.y - 0.021, F + 0.035);
  }
  const halo = part(head, new THREE.TorusGeometry(0.101, 0.0045, 10, 64), new THREE.MeshBasicMaterial({ color: 0xffd98a, transparent: true, opacity: 0.55, fog: false }), 0, LENS.y, 0.2175);       // the warm light ring round the lens
  // the antenna: a pin with a brass ball, on a brass foot
  part(head, new THREE.CylinderGeometry(0.011, 0.013, 0.08, 16), dark, 0, 1.646, 0, true);
  part(head, new THREE.SphereGeometry(0.027, 24, 16), brass, 0, TIP.y, 0, true);
  part(head, new THREE.TorusGeometry(0.026, 0.008, 10, 32), brass, 0, 1.61, 0).rotation.x = Math.PI / 2;
  part(head, new THREE.TorusGeometry(0.088, 0.011, 12, 56), brass, 0, 1.128, -0.02).rotation.x = Math.PI / 2;      // a ring under the head, where the neck goes in
  const tip = part(head, new THREE.SphereGeometry(0.04, 14, 10), new THREE.MeshBasicMaterial({ color: 0xffd76a, transparent: true, opacity: 0, fog: false }), 0, TIP.y, 0);
  const prop = new THREE.Group(); prop.position.copy(TIP).setY(TIP.y + 0.04); prop.visible = false; head.add(prop);       // the antenna is also a propeller, for emergencies
  for (const r of [0, Math.PI / 2]) { const b = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.012, 0.09), brass); b.rotation.y = r; prop.add(b); }
  const beam = part(head, new THREE.ConeGeometry(0.9, 3.0, 28, 1, true), new THREE.MeshBasicMaterial({ color: 0xfff1a8, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide, fog: false }), 0, LENS.y, LENS.z + 1.55);
  beam.rotation.x = -Math.PI / 2; beam.visible = false;                                                             // what the lens is looking at, when it checks a room
  const lensAt = new THREE.Object3D(); lensAt.position.set(0, LENS.y, 0.26); head.add(lensAt);

  // the body: one rounded block, a little narrower at the hips
  { const g = new RoundedBoxGeometry(0.562, 0.522, 0.42, 10, 0.105), pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) { const t = clamp((pos.getY(i) + 0.261) / 0.522, 0, 1), k = 0.86 + 0.14 * t * t * (3 - 2 * t); pos.setX(i, pos.getX(i) * k); pos.setZ(i, pos.getZ(i) * k); }
    g.computeVertexNormals(); part(bodyRig, g, shell, 0, 0.866, 0, true); }
  { // the speaker: a perforated disc in a brass ring
    const holes = canvasTex(256, 256, (k) => { k.fillStyle = '#4d4f58'; k.fillRect(0, 0, 256, 256); k.fillStyle = '#0b0b0e';
      for (let r = 0; r < 19; r++) for (let c = 0; c < 19; c++) { const x = 12 + c * 13 + (r % 2 ? 6.5 : 0), y = 12 + r * 13; k.beginPath(); k.arc(x, y, 3.6, 0, 7); k.fill(); } });
    const SY = 0.94, SZ = 0.2;
    part(bodyRig, new THREE.CylinderGeometry(0.086, 0.086, 0.012, 56), dark, 0, SY, SZ).rotation.x = Math.PI / 2;
    part(bodyRig, new THREE.CircleGeometry(0.073, 56), new THREE.MeshStandardMaterial({ map: holes, roughness: 0.55, metalness: 0.25 }), 0, SY, SZ + 0.0065);
    part(bodyRig, new THREE.TorusGeometry(0.082, 0.0105, 14, 72), brass, 0, SY, SZ + 0.006);
    part(bodyRig, new RoundedBoxGeometry(0.076, 0.03, 0.014, 4, 0.012), dark, 0, 0.71, -0.186);                      // the charge contact, low on its back
  }
  { // Joints, where the generated limbs meet the clean body. Each pivot is read from the skeleton.
    const at = (name) => { const i = skinned.skeleton.bones.findIndex((b) => b.name === name); return new THREE.Vector3().setFromMatrixPosition(skinned.skeleton.boneInverses[i].clone().invert()); };
    part(bodyRig, new THREE.CylinderGeometry(0.066, 0.074, 0.2, 32), joint, 0, 1.17, -0.02, true);                   // the neck
    part(bodyRig, new THREE.TorusGeometry(0.092, 0.013, 12, 56), brass, 0, 1.13, -0.02).rotation.x = Math.PI / 2;    // and its collar on the body
    for (const side of ['Left', 'Right']) {
      // The shoulder is a ball in the body's own finish, centred on the pivot. A ball looks the same however the arm turns,
      // and it is big enough to swallow the ragged top of the generated arm.
      const sh = at(side + 'Arm'), sx = Math.sign(sh.x);
      part(bodyRig, new THREE.SphereGeometry(0.112, 40, 28), shell, sh.x + sx * 0.018, sh.y - 0.014, sh.z, true);
      part(bodyRig, new THREE.TorusGeometry(0.1, 0.01, 12, 56), brass, sh.x - sx * 0.03, sh.y - 0.014, sh.z).rotation.y = Math.PI / 2;        // seated in a brass ring on the body
    }
    // The hips: a band in the body's finish that the tops of the legs sit inside, with a brass cap on each end of the axle they turn on.
    part(bodyRig, new RoundedBoxGeometry(0.55, 0.22, 0.43, 8, 0.085), shell, 0, 0.59, -0.012, true);
    for (const sx of [-1, 1]) part(bodyRig, new THREE.CylinderGeometry(0.05, 0.05, 0.014, 36), brass, sx * 0.278, 0.596, -0.012).rotation.z = Math.PI / 2;
    // Arms. The generated ones were torn where they met the shoulder and ragged at the wrist. These are three plain parts:
    // an upper arm that goes into the shoulder ball, a gunmetal ball for the elbow, and a forearm that ends at the brass cuff.
    const span = (rig, a, b, ra, rb, m) => { const d = b.clone().sub(a), o = part(rig, new THREE.CylinderGeometry(rb, ra, d.length(), 36), m, 0, 0, 0, true);
      o.position.copy(a).addScaledVector(d, 0.5); o.quaternion.setFromUnitVectors(Y, d.normalize()); return o; };
    for (const side of ['Left', 'Right']) {
      const sh = at(side + 'Arm'), e = at(side + 'ForeArm'), w = at(side + 'Hand'), up = rideOn(bone[side + 'Arm']), lo = rideOn(bone[side + 'ForeArm']);
      span(up, sh, e, 0.06, 0.053, shell);
      part(lo, new THREE.SphereGeometry(0.062, 32, 22), joint, e.x, e.y, e.z, true);
      const d = w.clone().sub(e).normalize(), w1 = w.clone().addScaledVector(d, -0.05), w2 = w.clone().addScaledVector(d, -0.018);
      span(lo, e, w1, 0.051, 0.057, shell);
      span(lo, w1, w2, 0.057, 0.045, shell);                                                    // the forearm closes in to a socket
      part(lo, new THREE.SphereGeometry(0.056, 36, 24), joint, w.x, w.y, w.z, true);          // and the hand turns on a ball in it. Nothing of the hand reaches down into the forearm, so nothing can poke out of it.
      const band = span(lo, e.clone().lerp(w, 0.36), e.clone().lerp(w, 0.4), 0.0545, 0.055, brass); band.castShadow = false;      // a thin brass band below the elbow
    }
    // Hands. The generated ones are curled for good, so they can never show an open palm. These are built open:
    // a palm with a dark pad on the inside, four two-part fingers fanned a little, a thumb, a brass cuff at the wrist.
    for (const side of ['Left', 'Right']) {
      const w = at(side + 'Hand'), e = at(side + 'ForeArm'), sx = Math.sign(w.x);
      const d = w.clone().sub(e).normalize(), inward = new THREE.Vector3(-sx, 0, 0), nrm = inward.sub(d.clone().multiplyScalar(inward.dot(d))).normalize(), u = new THREE.Vector3().crossVectors(d, nrm);
      const th = u.z > 0 ? 1 : -1;                                             // the thumb is on the side that faces forward
      const hnd = new THREE.Group(); hnd.position.copy(w); hnd.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(u, d, nrm)); rideOn(bone[side + 'Hand']).add(hnd); palms[side] = { hnd, r: riders[riders.length - 1] };      // x across the hand, y along the fingers, z out of the palm
      const W = 0.17, T = 0.042;
      part(hnd, new THREE.CylinderGeometry(0.061, 0.061, 0.02, 36), brass, 0, 0.03, 0);
      part(hnd, new RoundedBoxGeometry(W, 0.108, T, 4, 0.017), shell, 0, 0.078, 0, true);
      part(hnd, new THREE.CylinderGeometry(0.03, 0.03, 0.006, 28), joint, 0, 0.08, T / 2).rotation.x = Math.PI / 2;      // a soft grip pad in the palm
      const digits = [];                                                        // each finger and the thumb bend at two knuckles
      for (let i = 0; i < 4; i++) { const k = (i - 1.5) * th, len = [0.94, 1, 0.96, 0.84][i];      // index to little finger
        const f = new THREE.Group(); f.position.set(k * 0.0425, 0.13, 0); f.rotation.z = -k * 0.07; hnd.add(f);
        part(f, new RoundedBoxGeometry(0.036, 0.06 * len, 0.036, 3, 0.012), shell, 0, 0.034 * len, 0, true);
        const g = new THREE.Group(); g.position.y = 0.064 * len; f.add(g);
        part(g, new RoundedBoxGeometry(0.033, 0.052 * len, 0.032, 3, 0.012), shell, 0, 0.028 * len, 0, true);
        digits.push({ a: f, b: g, more: 1 + i * 0.16 }); }
      const tb = new THREE.Group(); tb.position.set(th * W * 0.47, 0.05, 0.004); tb.rotation.z = -th * 0.8; hnd.add(tb);
      part(tb, new RoundedBoxGeometry(0.04, 0.062, 0.038, 3, 0.013), shell, 0, 0.03, 0, true);
      const tg = new THREE.Group(); tg.position.y = 0.06; tb.add(tg);
      part(tg, new RoundedBoxGeometry(0.035, 0.048, 0.033, 3, 0.012), shell, 0, 0.025, 0, true);
      digits.push({ a: tb, b: tg, more: 0.6 });
      palms[side].digits = digits; palms[side].curl = 1;
    }
  }

  const blob = new THREE.Mesh(new THREE.CircleGeometry(0.3, 24), new THREE.MeshBasicMaterial({ color: 0x1a1830, transparent: true, opacity: 0.18, depthWrite: false }));
  blob.rotation.x = -Math.PI / 2; blob.position.y = 0.012; root.add(blob);

  // turn a bone about an axis given in the robot's own space (x to its left, y up, z forward), whatever the bone's own axes are
  const _pw = new THREE.Quaternion(), _mq = new THREE.Quaternion(), _d = new THREE.Quaternion(), _ax = new THREE.Vector3();
  function turn(b, axis, angle) {
    if (!b || Math.abs(angle) < 1e-4) return;
    b.parent.getWorldQuaternion(_pw); model.getWorldQuaternion(_mq);
    _d.setFromAxisAngle(_ax.copy(axis).applyQuaternion(_mq), angle);
    b.quaternion.premultiply(_pw.clone().invert().multiply(_d).multiply(_pw));
  }
  // hold a hand at an exact angle in the robot's space: fingers along one direction, palm facing another.
  // Stacking turns on the arm never got the palm square to the camera, so the hand is aimed directly instead.
  const _hm = new THREE.Matrix4(), _hq = new THREE.Quaternion(), _tq = new THREE.Quaternion(), _hp = new THREE.Vector3(), _hs = new THREE.Vector3(), _fx = new THREE.Vector3(), _fz = new THREE.Vector3();
  function aimHand(p, fingers, palm, w) {
    if (!p || w < 0.01) return;
    p.r.b.updateWorldMatrix(true, false);
    _hm.copy(model.matrixWorld).invert().multiply(p.r.b.matrixWorld).multiply(p.r.c).decompose(_hp, _hq, _hs); _hq.multiply(p.hnd.quaternion);      // how the hand sits right now
    _fx.crossVectors(fingers, palm).normalize(); _fz.crossVectors(_fx, fingers).normalize();
    _tq.setFromRotationMatrix(_hm.makeBasis(_fx, fingers, _fz)).multiply(_hq.invert());                                                    // the turn that takes it to where it should be
    if (_tq.w < 0) _tq.set(-_tq.x, -_tq.y, -_tq.z, -_tq.w);
    const ang = 2 * Math.acos(Math.min(1, _tq.w)), sn = Math.sqrt(Math.max(1e-9, 1 - _tq.w * _tq.w));
    turn(p.r.b, _fz.set(_tq.x / sn, _tq.y / sn, _tq.z / sn), ang * w);
  }
  const _fing = new THREE.Vector3(), _palm = new THREE.Vector3();
  // a hand at rest hangs with its fingers a little curled, like a real one. It opens flat to wave.
  function curl(p, want, dt) {
    p.curl = damp(p.curl, want, 9, dt);
    for (const d of p.digits) { d.a.rotation.x = 0.07 + p.curl * 0.3 * d.more; d.b.rotation.x = 0.05 + p.curl * 0.48 * d.more; }
  }
  // at rest a hand keeps pointing where its forearm points, and only rolls so the palm faces the body (or the floor when the arm is out sideways).
  // The walk clip left one palm facing forward and the other edge on.
  function settle(p, sx, w) {
    if (!p || w < 0.01) return;
    p.r.b.updateWorldMatrix(true, false);
    _hm.copy(model.matrixWorld).invert().multiply(p.r.b.matrixWorld).multiply(p.r.c).decompose(_hp, _hq, _hs); _hq.multiply(p.hnd.quaternion);
    _fing.set(0, 1, 0).applyQuaternion(_hq);
    aimHand(p, _fing, _palm.set(-sx, -Math.abs(_fing.x) * 1.5, 0.2).normalize(), w);
  }
  // the stand-in called the limb on the viewer's left "L". On the model that side is the robot's own right.
  const arm = { L: bone.RightArm, R: bone.LeftArm }, fore = { L: bone.RightForeArm, R: bone.LeftForeArm }, hand = { L: bone.RightHand, R: bone.LeftHand }, leg = { L: bone.RightUpLeg, R: bone.LeftUpLeg }, shin = { L: bone.RightLeg, R: bone.LeftLeg };

  const s = {
    run: 0, sit: 0, air: 0, hop: 0, hopV: 0, lookYaw: 0, lookPitch: 0, lean: 0, walk: 0, squash: 0, time: 0,
    act: { peek: 0, climb: 0, teeter: 0, tumble: 0, land: 0, wobble: 0, stumble: 0, nap: 0, pose: 0, wave: 0, talk: 0, scan: 0, slap: 0, present: 0, fly: 0, fall: 0 },
  };

  // st: { dist, speed, air (0..1 jump progress or -1), falling, idleFor, look:{yaw,pitch}, dt, time, act:{name,t}|null, blobOff, glow }
  function update(st) {
    const dt = st.dt, T = st.time, A = s.act;
    const an = st.act?.name, at = st.act?.t ?? 0;
    for (const k in A) A[k] = damp(A[k], an === k ? 1 : 0, k === 'nap' ? (an === k ? 4 : 3) : an === k ? 12 : 7, dt);      // sitting down and getting up take their time
    const moving = Math.abs(st.speed) > 0.05;
    s.run = damp(s.run, clamp((Math.abs(st.speed) - 3.4) / 4, 0, 1), 6, dt);
    const busy = A.peek + A.climb + A.teeter + A.nap + A.pose + A.stumble + A.land + A.talk + A.scan + A.wave + A.slap + A.present + A.fly + A.fall > 0.2;
    const wantSit = !moving && st.idleFor > 2.8 && st.air < 0 && !st.falling && !busy ? 1 : 0;
    s.sit = damp(s.sit, wantSit, wantSit ? 3.2 : 9, dt);
    const inAir = st.air >= 0 || st.falling;
    s.air = damp(s.air, inAir ? 1 : 0, 14, dt);
    s.hopV -= 22 * dt; s.hop += s.hopV * dt; if (s.hop < 0) { if (s.hopV < -1) s.squash = 1; s.hop = 0; s.hopV = 0; }
    s.squash = damp(s.squash, 0, 9, dt);

    // the walk: scrubbed by distance, so feet never slide and scrolling back walks it backwards
    const walk = (1 - s.sit) * (1 - s.air) * (1 - A.nap) * (1 - A.climb) * (1 - A.fly) * (1 - A.fall) * (1 - A.peek);
    s.walk = damp(s.walk, moving ? walk : 0, moving ? 10 : 6, dt);
    const dur = clip.duration, tt = (((st.dist / STRIDE) * CYCLE) % dur + dur) % dur;
    for (const k of tracks) {
      const val = k.it.evaluate(tt);
      if (!k.quat) { _v.fromArray(val); if (k.noSway) _v.x = k.rest.x; k.b.position.copy(k.rest).lerp(_v, s.walk); continue; }
      _q.fromArray(val);
      if (k.P) {                                                          // legs: the swing about the side-to-side axis, nothing else
        _d2.copy(k.P).multiply(_q).multiply(k.restI).multiply(k.Pi);                                   // how far this bone is turned from standing, seen in the robot's own space
        const ang = 2 * Math.atan2(_d2.x, _d2.w), a = Math.atan2(Math.sin(ang), Math.cos(ang)) * k.amp;
        _t2.set(Math.sin(a / 2), 0, 0, Math.cos(a / 2));
        _q.copy(k.Pi).multiply(_t2).multiply(k.P).multiply(k.rest);
      }
      k.b.quaternion.copy(k.rest).slerp(_q, s.walk * (k.half || 1));
    }

    const wind = T * 13, down = s.sit + A.nap;                    // windmill arms for teeter and wobble. Sitting and napping share a pose.
    // legs: only what the acts add. The stride itself is in the clip.
    let lL = -down * 1.5 + s.air * 0.6, lR = -down * 1.42 - s.air * 0.4;
    lL += A.climb * Math.sin(at * 16) * 0.8; lR -= A.climb * Math.sin(at * 16) * 0.8;
    lL -= A.wobble * 1.1 * bell(at); lR += A.teeter * Math.sin(wind * 0.5) * 0.25;
    lL -= A.stumble * 1.2 * bell(at * 1.6);
    lL += A.fly * (0.3 + Math.sin(T * 3) * 0.22); lR += A.fly * (0.1 - Math.sin(T * 3) * 0.22);      // legs dangle
    const fk = A.fall * (an === 'fall' ? 1 - clamp((at - 0.9) / 0.1, 0, 1) : 1);                       // falling: arms up, legs kicking, and everything straightens just before the feet touch
    lL += fk * (0.3 + Math.sin(T * 7) * 0.5); lR += fk * (0.12 - Math.sin(T * 7) * 0.5);
    turn(leg.L, X, lL); turn(leg.R, X, lR);
    turn(bone.LeftUpLeg, Z, 0.035); turn(bone.RightUpLeg, Z, -0.035);                                  // feet a touch wider apart, so the legs clear each other
    for (const h of hipAxle) { _d2.copy(h.b.quaternion).multiply(h.restI); h.b.position.add(_v.copy(h.v).applyQuaternion(_d2).negate().add(h.v)); }      // turn about the axle at the top of the leg
    turn(shin.L, X, down * 0.95 + s.air * 0.5 + fk * 0.5 + A.fly * 0.35 + A.climb * Math.max(0, Math.sin(at * 16)) * 0.6); turn(shin.R, X, down * 0.9 + s.air * 0.3 + fk * 0.35 + A.fly * 0.25 + A.climb * Math.max(0, -Math.sin(at * 16)) * 0.6);

    // arms
    let aL = -s.air * 2.3 + down * 0.3, aR = -s.air * 2.3 + down * 0.3, zL = -s.air * 0.5, zR = s.air * 0.5, eL = 0, eR = 0, yR = 0, yL = 0;
    aL -= A.peek * 0.3; aR -= A.peek * 0.3;                                                  // peeking: hands stay down inside the box
    aL -= A.climb * (2.4 + Math.sin(at * 16) * 0.5); aR -= A.climb * (2.4 - Math.sin(at * 16) * 0.5);
    const wm = A.teeter + A.wobble;
    aL += wm * (Math.sin(wind) * 1.6 - 1.2); aR += wm * (Math.sin(wind + 2.1) * 1.6 - 1.2); zL -= wm * 0.35; zR += wm * 0.35; yL -= wm * 0.55; yR += wm * 0.55;      // arms windmill out to the sides, clear of its head
    aL -= A.stumble * 1.6 * bell(at * 1.4); zR += A.stumble * 1.1 * bell(at * 1.4);
    const waving = Math.min(1, A.wave + A.pose * bell((at - 0.18) / 0.4));        // a wave hello
    aR -= waving * 0.2; zR += waving * 1.5;                                                          // a hello: upper arm out to the side, a little above level
    aL -= A.talk * (0.55 + Math.sin(T * 5) * 0.35); aR -= A.talk * (0.75 + Math.sin(T * 5 + 2) * 0.4); zL -= A.talk * 0.25; zR += A.talk * 0.25; eL -= A.talk * 0.7; eR -= A.talk * 0.7;   // talks with its hands
    zL -= A.slap * 1.15; aL += A.slap * (0.15 + Math.sin(T * 16) * 0.14);                                // one hand out, trailing along the letters
    aR -= A.present * 1.95; yR += A.present * 0.5;                                                       // points at the wall
    zL -= A.fly * 1.0; zR += A.fly * 1.0; aL -= A.fly * 0.25; aR -= A.fly * 0.25;
    zL -= fk * (1.85 + Math.sin(T * 9) * 0.55); zR += fk * (1.85 + Math.sin(T * 9 + 1.9) * 0.55); aL -= fk * 0.35; aR -= fk * 0.35; eL -= fk * 0.5; eR -= fk * 0.5;      // arms flung out and up to the sides, where you can see them past its head
    { const easy = (1 - s.walk) * (1 - down) * (1 - s.air) * (1 - A.climb) * (1 - wm), sway = Math.sin(T * 1.6);      // standing still: elbows a little bent, arms breathing, never two straight rods
      eL -= easy * (0.2 + sway * 0.03 + waving * 0.14); eR -= easy * (1 - waving) * (0.2 - sway * 0.03);
      aL += easy * sway * 0.03; aR -= easy * (1 - waving) * sway * 0.03; zL -= easy * waving * 0.1; }
    zL += s.walk * 0.14; zR -= s.walk * 0.14;                                                          // walking: the clip holds the arms out like a person in a coat. Bring them in to its sides.
    turn(arm.L, X, aL); turn(arm.L, Z, zL); turn(arm.R, X, aR); turn(arm.R, Z, zR); turn(arm.R, Y, yR); turn(arm.L, Y, yL);
    turn(fore.L, X, eL); turn(fore.R, X, eR);
    settle(palms.Right, -1, 1); settle(palms.Left, 1, 1 - waving);
    curl(palms.Right, 1 - A.talk * 0.6 - A.fly - A.fall, dt); curl(palms.Left, (1 - waving) * (1 - A.talk * 0.6 - A.fly - A.fall), dt);
    if (waving > 0.01) {                                                                                 // forearm up beside the head, rocking from the elbow, and an open palm held square to you
      const rock = Math.sin(T * 8.5) * 0.3, late = Math.sin(T * 8.5 - 0.7) * 0.42;
      turn(fore.R, Z, waving * (1.26 + rock));
      aimHand(palms.Left, _fing.set(Math.sin(0.2 - late), Math.cos(0.2 - late), 0), _palm.set(0.1, 0.05, 1).normalize(), waving);      // the hand swings a beat behind the forearm
    }

    // body
    const breathe = Math.sin(T * 2.1) * 0.006;
    const landSq = A.land * (1 - clamp(at * 3, 0, 1)) + s.squash * 0.6;
    body.position.y = -0.5 + breathe - down * 0.31 + s.hop + A.peek * (0.05 + Math.sin(T * 2.4) * 0.02);      // a landing squashes it from the feet up. The feet never go below the floor.
    body.scale.set(1 + landSq * 0.14, 1 - landSq * 0.18, 1 + landSq * 0.14);
    s.lean = damp(s.lean, moving ? 0.06 + s.run * 0.24 : 0, 8, dt);
    const teeterRock = (A.teeter + A.wobble * 0.8) * Math.sin(T * 7) * 0.3;
    body.rotation.x = s.lean * Math.sign(st.speed || 1) * (1 - A.nap) + teeterRock + A.climb * 0.45 - down * 0.08;
    body.rotation.z = A.stumble * 0.55 * bell(at * 1.3) + (A.teeter + A.wobble) * Math.sin(T * 5.3) * 0.12;
    body.rotation.z += A.fly * Math.sin(T * 2.2) * 0.14 + fk * Math.sin(T * 2.6) * 0.2; body.rotation.x += A.fly * 0.1 + fk * Math.sin(T * 1.9) * 0.14;      // falling: it rocks and tips as it goes

    // flips
    { const q = clamp((at - 0.02) / 0.2, 0, 1); spin.rotation.x = (an === 'tumble' ? at : an === 'fall' ? q * q * (3 - 2 * q) : 0) * Math.PI * 2; }      // a full turn forward: over the jump out of the box, and at the top of the last fall
    if (st.falling) spin.rotation.x += st.fallSpin || 0;

    // head: looks where you are, lags behind the body, tilts when curious
    const peekScan = A.peek * (st.look.yaw === 0 ? Math.sin(T * 1.3) * 0.7 : 0);
    const lookBack = A.stumble * clamp(at * 2.2 - 0.9, 0, 1) * 1.5;
    s.lookYaw = damp(s.lookYaw, (st.look.yaw + peekScan + lookBack) * (1 - A.nap), 7, dt);
    s.lookPitch = damp(s.lookPitch, st.look.pitch + (A.teeter > 0.5 && st.lookDown ? 0.5 : 0), 7, dt);
    const hy = s.lookYaw + A.land * Math.sin(at * 22) * 0.45 * clamp(1.2 - at, 0, 1) * clamp(at * 4 - 1, 0, 1) + A.scan * Math.sin(T * 1.5) * 0.95;
    const hx = s.lookPitch * (1 - A.nap) + s.sit * 0.18 + A.nap * (0.42 + Math.sin(T * 1.3) * 0.05) - teeterRock * 0.6 + A.talk * Math.sin(T * 7) * 0.06 + A.scan * 0.12 - A.present * 0.24 + A.fly * 0.2 + fk * 0.22;
    const hz = Math.sin(T * 0.9) * 0.035 * (1 - s.walk) + A.nap * 0.1 + A.peek * Math.sin(T * 0.7) * 0.12 + A.pose * Math.sin(T * 1.4) * 0.06;
    turn(bone.Head, Y, hy); turn(bone.Head, X, clamp(hx, -0.45, 0.34)); turn(bone.Head, Z, hz);      // it can't nod further down than its neck allows

    // what rides on the head
    model.updateWorldMatrix(true, false); _m.copy(model.matrixWorld).invert();
    for (const r of riders) { r.b.updateWorldMatrix(true, false); r.g.matrix.copy(_m).multiply(r.b.matrixWorld).multiply(r.c); r.g.updateMatrixWorld(true); }
    prop.visible = A.fly > 0.02; prop.scale.setScalar(Math.max(0.001, A.fly)); prop.rotation.y += dt * 42;
    tip.material.opacity = Math.min(1, (st.glow || 0) * (0.85 + Math.sin(T * 4) * 0.15)); tip.visible = tip.material.opacity > 0.02;
    beam.material.opacity = A.scan * (0.2 + Math.sin(T * 9) * 0.03); beam.visible = A.scan > 0.02;
    halo.material.opacity = 0.4 + (st.glow || 0) * 0.6 + A.talk * Math.max(0, Math.sin(T * 9)) * 0.4;                // it glows a little, more in the dark, and pulses when it talks

    blob.material.opacity = st.blobOff ? 0 : 0.18 * (1 - s.air) * (st.falling ? 0 : 1);
    blob.scale.setScalar(1.1 - s.hop * 0.8 + down * 0.5);
  }

  function hop(v = 3.4) { if (s.hop < 0.02) s.hopV = v; }
  function setWay(key) { const w = WAYS[key]; if (!w) return;
    if (w.paint) { U.uBody.value.setHex(w.paint); U.uClean.value = 0.96; U.uMetal.value = 0.08; U.uRough.value = 0.46; mat.clearcoat = 0.5; }      // painted
    else { U.uBody.value.set('#9a9ea8'); U.uClean.value = 0.93; U.uMetal.value = 0.6; U.uRough.value = 0.3; mat.clearcoat = 0.4; }                // satin silver. Not too metallic, or it goes black when the lights are out.
    shell.color.copy(U.uBody.value).multiplyScalar(w.paint ? 1 : 1.05); shell.metalness = U.uMetal.value; shell.roughness = U.uRough.value; shell.clearcoat = mat.clearcoat; }          // the shells take the same finish as the limbs
  setWay('classic');

  return { root, update, hop, setWay, tipWorld: (v) => tip.getWorldPosition(v), height: HEIGHT, headTop: (1.37 + NECK + 0.238) * K, headHalf: 0.303 * K + 0.06, lensWorld: (v) => lensAt.getWorldPosition(v) };
}

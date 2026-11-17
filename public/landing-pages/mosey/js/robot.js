// Mosey, stand-in version. Simple shapes that match the character sheet
// (assets/sheet/mosey-sheet.jpg) until the Higgsfield model replaces it.
// The page only talks to this through createRobot() and robot.update(), so the
// rigged GLB can be swapped in behind the same calls.
//
// What makes it feel alive is not the mesh. It is: steps tied to distance,
// a head that lags and looks, an eye that blinks, an antenna on a spring,
// and a set of small "acts" (peek, climb, teeter, tumble, land, stumble, nap, wave).
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

export const WAYS = {
  classic: { name: 'Classic', body: 0xf6c21a, trim: 0x8b8d92 },
  tomato:  { name: 'Tomato',  body: 0xe8452c, trim: 0xf3ead9 },
  mint:    { name: 'Mint',    body: 0x8fd3b6, trim: 0x2f5d4f },
  night:   { name: 'Night',   body: 0x2a2a31, trim: 0xf6c21a },
};

const damp = (a, b, l, dt) => a + (b - a) * (1 - Math.exp(-l * dt));
const clamp = THREE.MathUtils.clamp;
const bell = (t) => Math.sin(Math.PI * clamp(t, 0, 1));

export function createRobot() {
  const bodyMat = new THREE.MeshPhysicalMaterial({ color: WAYS.classic.body, roughness: 0.38, clearcoat: 0.35, clearcoatRoughness: 0.35 });
  const trimMat = new THREE.MeshStandardMaterial({ color: WAYS.classic.trim, roughness: 0.62 });
  const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x08080b, roughness: 0.03, clearcoat: 1, clearcoatRoughness: 0.02, envMapIntensity: 2.2 });
  const irisMat = new THREE.MeshStandardMaterial({ color: 0x4a4d5c, roughness: 0.3, metalness: 0.4 });

  const mesh = (geo, mat, parent, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z); m.castShadow = true; m.receiveShadow = true;
    parent.add(m); return m;
  };

  const root = new THREE.Group();          // placed on the route by the page
  const spin = new THREE.Group();          // flips and lying down turn around the belly, not the feet
  spin.position.y = 0.5; root.add(spin);
  const body = new THREE.Group();          // bob, lean, squash
  body.position.y = -0.5; spin.add(body);

  const torso = mesh(new THREE.SphereGeometry(0.2, 32, 22), bodyMat, body, 0, 0.42, 0);
  torso.scale.set(1, 1.1, 0.92);
  mesh(new THREE.TorusGeometry(0.125, 0.012, 8, 40), trimMat, body, 0, 0.585, 0).rotation.x = Math.PI / 2;   // collar seam

  const head = new THREE.Group();
  head.position.set(0, 0.58, 0); body.add(head);
  mesh(new RoundedBoxGeometry(0.5, 0.44, 0.42, 8, 0.12), bodyMat, head, 0, 0.2, 0);
  const ring = mesh(new THREE.TorusGeometry(0.137, 0.038, 20, 48), bodyMat, head, 0, 0.2, 0.208);
  ring.castShadow = false;
  const eye = new THREE.Group(); eye.position.set(0, 0.2, 0.186); head.add(eye);
  const lens = mesh(new THREE.SphereGeometry(0.119, 36, 26), glassMat, eye); lens.scale.z = 0.55; lens.castShadow = false;
  const iris = mesh(new THREE.TorusGeometry(0.052, 0.012, 10, 32), irisMat, eye, 0, 0, 0.056); iris.castShadow = false;
  const glint = new THREE.Mesh(new THREE.SphereGeometry(0.019, 10, 8), new THREE.MeshBasicMaterial({ color: 0xffffff }));
  glint.position.set(-0.04, 0.045, 0.058); eye.add(glint);
  const lidGeo = new THREE.CircleGeometry(0.128, 32); lidGeo.translate(0, -0.128, 0);       // an eyelid: a disc hinged at the top of the lens
  const lid = new THREE.Mesh(lidGeo, bodyMat); lid.position.set(0, 0.128, 0.072); lid.scale.y = 0.001; eye.add(lid);
  const glint2 = glint.clone(); glint2.scale.setScalar(0.45); glint2.position.set(0.036, -0.036, 0.06); eye.add(glint2);

  const beam = new THREE.Mesh(new THREE.ConeGeometry(0.62, 2.0, 28, 1, true), new THREE.MeshBasicMaterial({ color: 0xfff1a8, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide, fog: false }));
  beam.rotation.x = -Math.PI / 2; beam.position.z = 1.08; beam.visible = false; eye.add(beam);       // what the lens is looking at, when it checks a room
  const antenna = new THREE.Group(); antenna.position.set(0, 0.42, 0); head.add(antenna);
  mesh(new THREE.CylinderGeometry(0.016, 0.03, 0.1, 12), bodyMat, antenna, 0, 0.05, 0);
  const tipMat = new THREE.MeshStandardMaterial({ color: WAYS.classic.body, roughness: 0.4, emissive: 0xffd76a, emissiveIntensity: 0 });
  mesh(new THREE.SphereGeometry(0.046, 18, 14), tipMat, antenna, 0, 0.12, 0);            // the tip glows in the dark
  const prop = new THREE.Group(); prop.position.y = 0.175; prop.visible = false; antenna.add(prop);   // and it has a propeller, for emergencies
  for (const r of [0, Math.PI / 2]) { const b = mesh(new THREE.BoxGeometry(0.46, 0.008, 0.06), trimMat, prop); b.rotation.y = r; b.castShadow = false; }

  const limb = (x, y, len, rad, endGeo, endScale) => {
    const pivot = new THREE.Group(); pivot.position.set(x, y, 0); body.add(pivot);
    mesh(new THREE.CapsuleGeometry(rad, len, 6, 14), bodyMat, pivot, 0, -len / 2 - rad * 0.4, 0);
    const end = mesh(endGeo, trimMat, pivot, 0, -len - rad, 0); end.scale.copy(endScale);
    return pivot;
  };
  const mitt = new THREE.SphereGeometry(0.072, 18, 14);
  const shoe = new THREE.SphereGeometry(0.1, 22, 14);
  const armL = limb(-0.205, 0.52, 0.13, 0.05, mitt, new THREE.Vector3(1, 1.15, 1));
  const armR = limb(0.205, 0.52, 0.13, 0.05, mitt, new THREE.Vector3(1, 1.15, 1));
  const legL = limb(-0.09, 0.27, 0.1, 0.058, shoe, new THREE.Vector3(1, 0.62, 1.3));
  const legR = limb(0.09, 0.27, 0.1, 0.058, shoe, new THREE.Vector3(1, 0.62, 1.3));
  for (const leg of [legL, legR]) { const s = leg.children[1]; s.position.y = -0.208; s.position.z = 0.03; }

  // product detail: joints, ears, a seam around the head, a number on the chest, a charge port on the back
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x1b1b20, roughness: 0.5 });
  for (const x of [-0.205, 0.205]) { mesh(new THREE.SphereGeometry(0.062, 16, 12), trimMat, body, x, 0.52, 0); const ear = mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.03, 24), trimMat, head, x * 1.24, 0.2, 0); ear.rotation.z = Math.PI / 2; const bolt = mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.036, 12), darkMat, head, x * 1.24, 0.2, 0); bolt.rotation.z = Math.PI / 2; }
  for (const x of [-0.09, 0.09]) mesh(new THREE.SphereGeometry(0.066, 16, 12), trimMat, body, x, 0.265, 0);
  { const band = mesh(new THREE.BoxGeometry(0.3, 0.006, 0.004), darkMat, head, 0, 0.385, 0.211); band.castShadow = false; }
  { const c = document.createElement('canvas'); c.width = 128; c.height = 64; const k = c.getContext('2d'); k.fillStyle = '#15151a'; k.font = '700 34px ui-monospace, Menlo, monospace'; k.textAlign = 'center'; k.fillText('001', 64, 44);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace;
    const no = new THREE.Mesh(new THREE.PlaneGeometry(0.11, 0.055), new THREE.MeshBasicMaterial({ map: t, transparent: true, opacity: 0.8 })); no.position.set(0.055, 0.5, 0.168); no.rotation.x = -0.35; no.rotation.y = 0.28; body.add(no); }
  { const port = mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.02, 20), darkMat, body, 0, 0.42, -0.182); port.rotation.x = Math.PI / 2; port.castShadow = false; }
  { const vent = [-0.05, 0, 0.05].map((y) => { const v = mesh(new THREE.BoxGeometry(0.16, 0.012, 0.01), darkMat, head, 0, 0.2 + y, -0.212); v.castShadow = false; return v; }); }

  const blob = new THREE.Mesh(
    new THREE.CircleGeometry(0.3, 24),
    new THREE.MeshBasicMaterial({ color: 0x1a1830, transparent: true, opacity: 0.18, depthWrite: false })
  );
  blob.rotation.x = -Math.PI / 2; blob.position.y = 0.012; root.add(blob);

  const s = {
    run: 0, sit: 0, air: 0, hop: 0, hopV: 0, lookYaw: 0, lookPitch: 0, lean: 0,
    ant: 0, antV: 0, lastSpeed: 0, blinkAt: 2 + Math.random() * 2, blink: 0, squash: 0, wide: 0,
    act: { peek: 0, climb: 0, teeter: 0, tumble: 0, land: 0, wobble: 0, stumble: 0, nap: 0, pose: 0, wave: 0, talk: 0, scan: 0, slap: 0, present: 0, fly: 0 },
  };

  // st: { dist, speed, air (0..1 jump progress or -1), falling, idleFor, look:{yaw,pitch}, dt, time, act:{name,t}|null, blobOff }
  function update(st) {
    const dt = st.dt, T = st.time, A = s.act;
    const an = st.act?.name, at = st.act?.t ?? 0;
    for (const k in A) A[k] = damp(A[k], an === k ? 1 : 0, an === k ? 12 : 7, dt);
    const moving = Math.abs(st.speed) > 0.05;
    const phase = st.dist * 7.4;                                   // steps are tied to distance walked
    s.run = damp(s.run, clamp((Math.abs(st.speed) - 3.4) / 4, 0, 1), 6, dt);
    const busy = A.peek + A.climb + A.teeter + A.nap + A.pose + A.stumble + A.land + A.talk + A.scan + A.wave + A.slap + A.present + A.fly > 0.2;
    const wantSit = !moving && st.idleFor > 2.8 && st.air < 0 && !st.falling && !busy ? 1 : 0;
    s.sit = damp(s.sit, wantSit, wantSit ? 3.2 : 9, dt);
    const inAir = st.air >= 0 || st.falling;
    s.air = damp(s.air, inAir ? 1 : 0, 14, dt);
    s.hopV -= 22 * dt; s.hop += s.hopV * dt; if (s.hop < 0) { if (s.hopV < -1) s.squash = 1; s.hop = 0; s.hopV = 0; }
    s.squash = damp(s.squash, 0, 9, dt);

    const amp = moving ? THREE.MathUtils.lerp(0.66, 1.05, s.run) : 0;
    const swing = Math.sin(phase) * amp;
    const walk = (1 - s.sit) * (1 - s.air) * (1 - A.nap) * (1 - A.climb) * (1 - A.fly);
    const wind = T * 13;                                           // windmill arms for teeter and wobble

    // legs
    let lL = swing * walk - s.sit * 1.45 + s.air * 0.6, lR = -swing * walk - s.sit * 1.45 - s.air * 0.4;
    lL += A.climb * Math.sin(at * 16) * 0.8; lR -= A.climb * Math.sin(at * 16) * 0.8;
    lL -= A.wobble * 1.1 * bell(at); lR += A.teeter * Math.sin(wind * 0.5) * 0.25;
    lL -= A.stumble * 1.2 * bell(at * 1.6); lL -= A.nap * 1.5; lR -= A.nap * 1.38;
    lL += A.fly * (0.3 + Math.sin(T * 3) * 0.22); lR += A.fly * (0.1 - Math.sin(T * 3) * 0.22);      // legs dangle
    legL.rotation.x = lL; legR.rotation.x = lR;

    // arms
    let aL = -swing * 0.85 * walk - s.air * 2.3 + s.sit * 0.25, aR = swing * 0.85 * walk - s.air * 2.3 + s.sit * 0.25;
    let zL = -0.5 - s.air * 0.5, zR = 0.5 + s.air * 0.5;
    aL -= A.peek * 2.75; aR -= A.peek * 2.75; zL += A.peek * 0.25; zR -= A.peek * 0.25;      // mitts on the rim
    aL -= A.climb * (2.4 + Math.sin(at * 16) * 0.5); aR -= A.climb * (2.4 - Math.sin(at * 16) * 0.5);
    const wm = A.teeter + A.wobble;
    aL += wm * (Math.sin(wind) * 1.6 - 1.2); aR += wm * (Math.sin(wind + 2.1) * 1.6 - 1.2); zL -= wm * 0.7; zR += wm * 0.7;
    aL -= A.stumble * 1.6 * bell(at * 1.4); zR += A.stumble * 1.1 * bell(at * 1.4);
    zL += A.nap * 0.25; zR -= A.nap * 0.25; aL -= A.nap * 0.35; aR -= A.nap * 0.35;
    const waving = Math.min(1, A.wave + A.pose * bell((at - 0.18) / 0.4));        // a wave hello
    aR -= waving * (2.6 + Math.sin(T * 11) * 0.35); zR += waving * 0.35;
    aL -= A.talk * (0.55 + Math.sin(T * 5) * 0.35); aR -= A.talk * (0.75 + Math.sin(T * 5 + 2) * 0.4); zL -= A.talk * 0.25; zR += A.talk * 0.25;   // talks with its hands
    zL -= A.slap * 1.2; aL += A.slap * (0.15 + Math.sin(T * 16) * 0.14);                                // left hand out, trailing along the letters
    aR -= A.present * 2.3; zR += A.present * 0.45;                                                       // points at the wall
    zL -= A.fly * 1.0; zR += A.fly * 1.0; aL -= A.fly * 0.25; aR -= A.fly * 0.25;
    armL.rotation.x = aL; armR.rotation.x = aR; armL.rotation.z = zL; armR.rotation.z = zR;

    // body
    const bob = Math.abs(Math.cos(phase)) * 0.038 * amp * walk;
    const breathe = Math.sin(T * 2.1) * 0.006;
    const landSq = A.land * (1 - clamp(at * 3, 0, 1)) + s.squash * 0.6 + (st.crouch || 0) * 0.95;      // the crouch before a jump is the same squash as a landing
    body.position.y = -0.5 + bob + breathe * (1 + A.nap * 2.5) - (s.sit + A.nap) * 0.2 + s.hop + A.peek * (0.05 + Math.sin(T * 2.4) * 0.02) - landSq * 0.12;
    body.scale.set(1 + landSq * 0.2, 1 - landSq * 0.25, 1 + landSq * 0.2);
    s.lean = damp(s.lean, moving ? 0.1 + s.run * 0.24 : 0, 8, dt);
    const teeterRock = (A.teeter + A.wobble * 0.8) * Math.sin(T * 7) * 0.3;
    body.rotation.x = s.lean * Math.sign(st.speed || 1) * (1 - A.nap) - s.sit * 0.12 - A.nap * 0.1 + teeterRock + A.climb * 0.45;
    body.rotation.z = Math.sin(phase) * 0.06 * amp * walk + A.stumble * 0.55 * bell(at * 1.3) + (A.teeter + A.wobble) * Math.sin(T * 5.3) * 0.12;

    // flips and lying down
    { const ft = Math.min(1, at / 0.78); spin.rotation.x = (an === 'tumble' ? ft * ft * (3 - 2 * ft) : 0) * Math.PI * 2; }      // the flip is done by four fifths of the jump, so it lands feet first
    spin.position.y = 0.5;
    if (st.falling) spin.rotation.x += st.fallSpin || 0;

    // head: looks where you are, lags behind the body, tilts when curious
    const scan = A.peek * (st.look.yaw === 0 ? Math.sin(T * 1.3) * 0.7 : 0);
    const lookBack = A.stumble * clamp(at * 2.2 - 0.9, 0, 1) * 1.5;
    s.lookYaw = damp(s.lookYaw, (st.look.yaw + scan + lookBack) * (1 - A.nap), 7, dt);
    s.lookPitch = damp(s.lookPitch, st.look.pitch + (A.teeter > 0.5 && st.lookDown ? 0.5 : 0), 7, dt);
    head.rotation.y = s.lookYaw + Math.sin(phase) * 0.05 * amp * walk + A.land * Math.sin(at * 22) * 0.45 * clamp(1.2 - at, 0, 1) * clamp(at * 4 - 1, 0, 1);
    head.rotation.x = s.lookPitch * (1 - A.nap) + s.sit * 0.18 + A.nap * (0.42 + Math.sin(T * 1.3) * 0.05) - teeterRock * 0.6;
    head.rotation.z = Math.sin(T * 0.9) * 0.035 * (1 - amp) + A.nap * 0.2 + A.peek * Math.sin(T * 0.7) * 0.12 + A.pose * Math.sin(T * 1.4) * 0.06;

    head.rotation.y += A.scan * Math.sin(T * 1.5) * 0.95;                       // sweeps the room
    head.rotation.x += A.talk * Math.sin(T * 7) * 0.06 + A.scan * 0.12 - A.present * 0.24 + A.fly * 0.2;
    prop.visible = A.fly > 0.02; prop.scale.setScalar(Math.max(0.001, A.fly)); prop.rotation.y += dt * 42;
    body.rotation.z += A.fly * Math.sin(T * 2.2) * 0.14; body.rotation.x += A.fly * 0.1;
    tipMat.emissiveIntensity = (st.glow || 0) * (1.7 + Math.sin(T * 4) * 0.3);
    beam.material.opacity = A.scan * (0.2 + Math.sin(T * 9) * 0.03); beam.visible = A.scan > 0.02;

    // antenna on a spring: it whips when the robot starts, stops or lands
    const accel = (st.speed - s.lastSpeed) / Math.max(dt, 1e-3); s.lastSpeed = st.speed;
    s.antV += (-s.ant * 90 - s.antV * 7 - clamp(accel, -40, 40) * 0.06 - s.hopV * 0.4) * dt; s.ant += s.antV * dt;
    antenna.rotation.x = clamp(s.ant, -0.9, 0.9) - body.rotation.x * 0.8 + A.nap * 0.9;
    antenna.rotation.z = Math.sin(T * 3) * 0.04 + A.talk * Math.sin(T * 14) * 0.12 + (A.teeter + A.wobble) * Math.sin(T * 17) * 0.25;

    // the eye: blinks, closes to sleep, opens wide when surprised
    s.blinkAt -= dt; if (s.blinkAt < 0) { s.blink = 1; s.blinkAt = 2.2 + Math.random() * 3.5; }
    s.blink = damp(s.blink, 0, 14, dt);
    s.wide = damp(s.wide, (A.teeter + A.stumble * bell(at) + A.wobble > 0.5 || inAir) ? 1 : 0, 10, dt);
    const lidK = Math.max(s.blink, A.nap * 0.86);
    lid.scale.y = Math.max(0.001, lidK); lid.visible = lidK > 0.02;
    eye.scale.setScalar(1 + s.wide * 0.08);
    ring.scale.setScalar(1 + s.wide * 0.07);
    iris.position.x = clamp(s.lookYaw * 0.035, -0.035, 0.035); iris.position.y = clamp(-s.lookPitch * 0.04, -0.03, 0.03);
    glint.position.x = -0.04 + iris.position.x * 0.5; glint.visible = lidK < 0.35; glint2.visible = lidK < 0.75;

    blob.material.opacity = st.blobOff ? 0 : (st.onModel ? 0.34 : 0.18) * (1 - s.air) * (st.falling ? 0 : 1); blob.position.y = st.onModel ? 0.058 : 0.012;      // in the model home the floor is a little higher than the ground, and the shadow was under it
    blob.scale.setScalar(1 - s.hop * 0.8 + A.nap * 0.5);
  }

  function hop(v = 3.4) { if (s.hop < 0.02) s.hopV = v; }
  function setWay(key) { const w = WAYS[key]; if (!w) return; bodyMat.color.setHex(w.body); trimMat.color.setHex(w.trim); tipMat.color.setHex(w.body); }

  return { root, update, hop, setWay, height: 1.15, lensWorld: (v) => eye.getWorldPosition(v) };
}

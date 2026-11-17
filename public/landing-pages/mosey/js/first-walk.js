// First Walk. The walk along GONE WALKING is Mosey's first lap of your home.
// While it crosses the letters, a scale model of a home appears on the floor in front of them, the way an architect
// would build one: a white board, thin white walls, real floors and small furniture you can name at a glance.
// A sheet of light from its lens sweeps along. Behind the light the model is there, ahead of it there are only dots.
// Pins drop on what it will remember, and a counter adds up the square metres.
// Everything is a function of where the robot is, so it scrubs both ways.
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';

// Where the plan lies on the floor, shared with the page so the robot's route can go through its doors.
// u runs along the headline (0..1), v from the letters toward you (0..1).
export function planLayout(X0, right) {
  const x0 = X0 - 1.0, x1 = right + 0.8, z0 = 1.15, z1 = 6.5, PW = x1 - x0, PD = z1 - z0;
  const W = 2048, Hc = Math.round(W * PD / PW), top = 26, bot = Hc - 26, ih = bot - top;
  const U = (u) => x0 + u * PW, Zp = (py) => z0 + (py / Hc) * PD, Zv = (v) => Zp(top + v * ih);      // plan fractions to the world
  const UA = 0.012, UB = 0.988;
  const rooms = [['Hall', UA, 0.15, 6], ['Kitchen', 0.15, 0.37, 11], ['Living room', 0.37, 0.67, 24], ['Bedroom', 0.67, 0.875, 14], ['Bath', 0.875, UB, 7]];
  const door = (i) => { const a = i % 2 ? 0.36 : 0.44; return [a, a + 0.36]; };      // wide enough that it walks through with room on both sides
  return { x0, x1, z0, z1, PW, PD, W, Hc, top, bot, ih, U, Zp, Zv, UA, UB, rooms, door };
}

const PLACED = [];
export function createFirstWalk(c) {
  const { THREE, scene, camera, headline: hl, lastL, M, PAL, V3, smooth, clamp, backOut, tall, robot, canvasTex, DISPLAY, MONO, X0 } = c;
  const { x0, x1, z0, z1, PW, PD, W, Hc, top, bot, ih, U, Zp, Zv, UA, UB, rooms, door } = planLayout(X0, hl.right), TOTAL = 62;
  const zN = Zv(0), zS = Zv(1), DV = zS - zN, FY = 0.04, WH = 0.62, WF = 0.42, WT = 0.07, HS = 1.5;      // the back and front walls, the depth of the home, the floor's height, how high the walls stand (the front one is lower, so you see in), their thickness, and how much taller than its plan a piece of furniture is drawn

  /* ---------- the scan: one number, how far the light has got. Everything in the model reads it ---------- */
  // Each material throws away what lies ahead of the light and glows where the light is passing, so things appear out of the light itself.
  const scanU = { value: -1e9 }, onU = { value: 0 }, botU = { value: new THREE.Vector3() };
  const scanned = (m) => {
    m.onBeforeCompile = (sh) => {
      sh.uniforms.uScan = scanU;
      sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying float vScanX;').replace('#include <project_vertex>', '#include <project_vertex>\nvScanX = (modelMatrix * vec4(transformed, 1.0)).x;');
      sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform float uScan;\nvarying float vScanX;')
        .replace('#include <clipping_planes_fragment>', '#include <clipping_planes_fragment>\nif (vScanX > uScan) discard;')
        .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += vec3(1.0, 0.8, 0.28) * smoothstep(0.42, 0.0, uScan - vScanX) * 1.5;');
    };
    m.customProgramCacheKey = () => 'mosey-plan-scan'; return m;
  };
  const mat = (color, rough = 0.85, more = {}) => scanned(new THREE.MeshStandardMaterial({ color, roughness: rough, emissive: color, emissiveIntensity: 0.2, ...more }));
  const MT = {
    wall: mat('#ece7dc', 0.9, { emissiveIntensity: 0.14 }), cap: mat('#cfc7b6', 0.8, { emissiveIntensity: 0.12 }), board: mat('#ebe5d9', 0.95), white: mat('#fbfaf5', 0.7), cream: mat('#eadfc9', 0.9),
    wood: mat('#c99a62', 0.6), walnut: mat('#8c633a', 0.55), fabric: mat('#3d57d6', 0.95), fabric2: mat('#5a72e4', 0.95),
    mustard: mat(PAL.accent, 0.8), ink: mat('#26262e', 0.5), steel: mat('#aab0ba', 0.3, { metalness: 0.7 }), brass: mat('#cf9f38', 0.3, { metalness: 0.9 }),
    glass: mat('#a8cdec', 0.15, { emissiveIntensity: 0.55 }), green: mat('#3f9a68', 0.8), clay: mat('#c96b43', 0.8), water: mat('#8fcfee', 0.12, { emissiveIntensity: 0.5 }),
  };
  // Everything of one material becomes one mesh, so the whole home is sixteen draw calls however much is in it.
  const bins = new Map();
  const put = (m, g) => { if (!bins.has(m)) bins.set(m, []); bins.get(m).push(g.index ? g.toNonIndexed() : g); };
  // a piece of furniture has its own little frame: x to the right, z toward you, y up, standing at (u, v) on the plan and turned by ry
  function piece(u, v, ry = 0, hs = HS) {
    const ox = U(u), oz = Zv(v);
    const place = (g, x, y, z, rot) => { if (rot) g.rotateY(rot); g.translate(x, y, z); if (ry) g.rotateY(ry); g.translate(ox, FY, oz); return g; };
    return {
      box(m, sx, sy, sz, x = 0, y = 0, z = 0, r = 0.03, rot = 0) { sy *= hs; y *= hs; put(m, place(new RoundedBoxGeometry(sx, sy, sz, 2, Math.max(0.004, Math.min(r, sx / 2.1, sy / 2.1, sz / 2.1))), x, y + sy / 2, z, rot)); },
      cyl(m, r0, r1, h, x = 0, y = 0, z = 0, seg = 24) { h *= hs; y *= hs; put(m, place(new THREE.CylinderGeometry(r1, r0, h, seg), x, y + h / 2, z)); },
      ball(m, r, x, y, z, sy = 1, sx = 1) { y *= hs; const g = new THREE.SphereGeometry(r, 14, 10); g.scale(sx, sy, 1); put(m, place(g, x, y, z)); },
    };
  }
  const wide = (du) => du * PW, deep = (dv) => dv * DV;

  /* ---------- the shell: a board, four outer walls, the walls between rooms with their doors, a window in every room ---------- */
  { const s = piece((UA + UB) / 2, 0.5, 0, 1);
    s.box(MT.board, wide(UB - UA) + 0.5, 0.036, DV + 0.5, 0, -FY + 0.002, 0, 0.014);                                  // the board the model stands on
    s.box(MT.wall, wide(UB - UA) + WT, WH, WT, 0, 0, -DV / 2, 0.012); s.box(MT.wall, wide(UB - UA) + WT, WF, WT, 0, 0, DV / 2, 0.012);      // back and front
    s.box(MT.wall, WT, WH, DV, -wide(UB - UA) / 2, 0, 0, 0.012); s.box(MT.wall, WT, WH, DV, wide(UB - UA) / 2, 0, 0, 0.012); }              // the two ends
  { const s = piece((UA + UB) / 2, 0.5, 0, 1), L = wide(UB - UA);      // a darker cap along the top of the outer walls and a skirting board inside them
    s.box(MT.cap, L + WT + 0.02, 0.022, WT + 0.02, 0, WH, -DV / 2, 0.006); s.box(MT.cap, L + WT + 0.02, 0.022, WT + 0.02, 0, WF, DV / 2, 0.006); s.box(MT.cap, WT + 0.02, 0.022, DV, -L / 2, WH, 0, 0.006); s.box(MT.cap, WT + 0.02, 0.022, DV, L / 2, WH, 0, 0.006);
    s.box(MT.cap, L, 0.05, 0.016, 0, 0, -DV / 2 + WT / 2 + 0.008, 0.004); s.box(MT.cap, L, 0.05, 0.016, 0, 0, DV / 2 - WT / 2 - 0.008, 0.004); }
  for (let i = 1; i < rooms.length; i++) {
    const [a, b] = door(i), s = piece(rooms[i][1], 0, 0, 1);
    s.box(MT.cap, WT + 0.02, 0.022, deep(a), 0, WH, deep(a) / 2, 0.006); s.box(MT.cap, WT + 0.02, 0.022, deep(1 - b), 0, WH, deep(b + (1 - b) / 2), 0.006);
    s.box(MT.wall, WT, WH, deep(a), 0, 0, deep(a) / 2, 0.012); s.box(MT.wall, WT, WH, deep(1 - b), 0, 0, deep(b + (1 - b) / 2), 0.012);
  }
  for (const [, ra, rb] of rooms) { const s = piece((ra + rb) / 2, 0, 0, 1), w = Math.min(1.9, wide(rb - ra) * 0.42);      // a window in the back wall of every room
    s.box(MT.glass, w, 0.3, WT + 0.012, 0, 0.2, 0, 0.006); s.box(MT.white, w + 0.08, 0.03, WT + 0.04, 0, 0.175, 0, 0.006); s.box(MT.white, 0.025, 0.3, WT + 0.02, 0, 0.2, 0, 0.004); }

  /* ---------- the furniture. Same places as before, so its route between them still fits ---------- */
  { // hall: a bench with a cushion, shoes kicked off beside it, a coat stand, and its dock
    const r = piece(0.0475, 0.2), sx = wide(0.035), sz = deep(0.2);
    for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) r.box(MT.ink, 0.035, 0.15, 0.035, x * (sx / 2 - 0.05), 0, z * (sz / 2 - 0.05), 0.008);
    for (let i = 0; i < 5; i++) r.box(MT.wood, sx / 5 - 0.02, 0.03, sz, -sx / 2 + sx / 10 + i * sx / 5, 0.15, 0, 0.01);
    r.box(MT.mustard, sx * 0.9, 0.045, sz * 0.4, 0, 0.18, -sz * 0.24, 0.022); r.box(MT.cream, sx * 0.5, 0.05, 0.3, 0.02, 0.18, sz * 0.25, 0.02, 0.2);
    const sh = piece(0.05, 0.4, 0, 1);      // two pairs of shoes: a sole, an upper, a darker opening
    [[MT.ink, 0, 0, 0.1], [MT.ink, 0.16, 0.03, 0.2], [MT.clay, 0.46, 0.12, -0.5], [MT.clay, 0.58, 0.02, -0.2]].forEach(([m, x, z, rot]) => { const q = piece(0.035 + x / PW, 0.4 + z / DV, rot, 1); q.box(MT.white, 0.11, 0.02, 0.27, 0, 0, 0, 0.01); q.box(m, 0.1, 0.07, 0.25, 0, 0.018, 0, 0.04); q.box(MT.cream, 0.06, 0.02, 0.1, 0, 0.075, 0.04, 0.008); });
    const d = piece(0.085, 0.72, 0, 1); d.cyl(MT.ink, 0.44, 0.42, 0.045, 0, 0, 0, 40); d.cyl(MT.mustard, 0.37, 0.37, 0.05, 0, 0, 0, 40); d.cyl(MT.ink, 0.32, 0.32, 0.054, 0, 0, 0, 40); d.box(MT.ink, 0.2, 0.16, 0.05, 0.42, 0, -0.3, 0.02, 0.5); }
  { // kitchen: a run of cabinets with a worktop, sink and hob, a tall fridge, a round table with two stools
    const sx = wide(0.2), sz = deep(0.15), k = piece(0.26, 0.135);
    k.box(MT.ink, sx - 0.5, 0.05, sz - 0.1, 0.25, 0, -0.02, 0.01); k.box(MT.white, sx - 0.5, 0.27, sz - 0.04, 0.25, 0.05, 0, 0.02);
    k.box(MT.wood, sx - 0.44, 0.035, sz + 0.03, 0.25, 0.32, 0.005, 0.012);
    for (let i = 0; i < 6; i++) { const x = -sx / 2 + 0.78 + i * ((sx - 0.62) / 6); k.box(MT.brass, 0.2, 0.014, 0.014, x, 0.25, sz / 2 - 0.012, 0.005); k.box(MT.cream, 0.012, 0.25, 0.012, x - (sx - 0.62) / 12, 0.06, sz / 2 - 0.02, 0.004); }
    k.box(MT.steel, 0.62, 0.012, sz * 0.62, -0.25, 0.352, 0, 0.03); k.box(MT.ink, 0.5, 0.012, sz * 0.46, -0.25, 0.356, 0.01, 0.04); k.cyl(MT.brass, 0.018, 0.018, 0.12, -0.25, 0.355, -sz * 0.36, 10); k.box(MT.brass, 0.022, 0.02, 0.14, -0.25, 0.46, -sz * 0.26, 0.008);
    k.box(MT.ink, 0.82, 0.012, sz * 0.74, 1.3, 0.354, 0, 0.02); for (const [hx, hz] of [[-0.2, -0.13], [0.2, -0.13], [-0.2, 0.13], [0.2, 0.13]]) { k.cyl(MT.steel, 0.1, 0.1, 0.008, 1.3 + hx, 0.364, hz, 20); k.cyl(MT.ink, 0.07, 0.07, 0.01, 1.3 + hx, 0.365, hz, 20); }
    k.box(MT.white, 0.44, 0.66, sz - 0.02, -sx / 2 + 0.22, 0, 0, 0.03); k.box(MT.steel, 0.016, 0.3, 0.02, -sx / 2 + 0.39, 0.3, sz / 2, 0.006); k.box(MT.steel, 0.442, 0.006, sz - 0.016, -sx / 2 + 0.22, 0.42, 0.004, 0.002); k.box(MT.steel, 0.016, 0.12, 0.02, -sx / 2 + 0.39, 0.47, sz / 2, 0.006);
    const t = piece(0.25, 0.62); t.cyl(MT.ink, 0.3, 0.28, 0.025, 0, 0, 0, 28); t.cyl(MT.ink, 0.06, 0.05, 0.27, 0, 0.02, 0, 12); t.cyl(MT.wood, 0.72, 0.74, 0.04, 0, 0.28, 0, 48);
    t.cyl(MT.mustard, 0.1, 0.17, 0.07, 0.12, 0.32, -0.08, 20); for (const [bx, bz, m] of [[0.07, -0.1, MT.clay], [0.17, -0.05, MT.green], [0.11, -0.02, MT.clay]]) t.ball(m, 0.055, bx, 0.41, bz);
    t.cyl(MT.white, 0.07, 0.07, 0.012, -0.3, 0.32, 0.18, 16); t.cyl(MT.white, 0.045, 0.04, 0.07, -0.42, 0.32, -0.12, 14);
    for (const u of [0.205, 0.295]) { const st = piece(u, 0.62); st.cyl(MT.ink, 0.15, 0.14, 0.015, 0, 0, 0, 20); st.cyl(MT.steel, 0.022, 0.022, 0.17, 0, 0.012, 0, 8); st.cyl(MT.walnut, 0.19, 0.2, 0.035, 0, 0.175, 0, 24); } }
  { // living room: a sofa with cushions, a lamp beside it, a bookshelf, a plant
    const sx = Math.min(wide(0.17), 3.0), sz = deep(0.2), s = piece(0.485, 0.2), n = 3, cw = (sx - 0.56) / n;
    for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) s.cyl(MT.walnut, 0.03, 0.04, 0.06, x * (sx / 2 - 0.12), 0, z * (sz / 2 - 0.12), 8);
    s.box(MT.fabric, sx, 0.15, sz * 0.94, 0, 0.055, 0, 0.06); s.box(MT.fabric, sx, 0.3, sz * 0.24, 0, 0.19, -sz * 0.35, 0.08);
    for (const x of [-1, 1]) s.box(MT.fabric, 0.24, 0.17, sz * 0.9, x * (sx / 2 - 0.12), 0.19, 0.01, 0.08);
    for (let i = 0; i < n; i++) { const x = -sx / 2 + 0.28 + cw * (i + 0.5); s.box(MT.fabric2, cw - 0.03, 0.09, sz * 0.6, x, 0.2, sz * 0.1, 0.045); s.box(MT.fabric2, cw - 0.05, 0.2, 0.15, x, 0.28, -sz * 0.17, 0.06); }
    s.box(MT.mustard, 0.34, 0.26, 0.1, -sx / 2 + 0.5, 0.29, sz * 0.02, 0.05, 0.5); s.box(MT.cream, 0.3, 0.24, 0.1, sx / 2 - 0.52, 0.29, sz * 0.03, 0.05, -0.45);
    const l = piece(0.572, 0.13); l.cyl(MT.brass, 0.13, 0.12, 0.02, 0, 0, 0, 20); l.cyl(MT.brass, 0.012, 0.012, 0.62, 0, 0.02, 0, 8); l.cyl(MT.cream, 0.17, 0.11, 0.18, 0, 0.56, 0, 24);
    // a desk by the far wall: a laptop, a lamp, a pile of books, a mug, and a chair pushed back from it
    const bx = wide(0.05), bz = deep(0.34), b = piece(0.625, 0.26);
    b.box(MT.walnut, bx, 0.03, bz, 0, 0.31, 0, 0.012); for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) b.box(MT.ink, 0.04, 0.31, 0.04, x * (bx / 2 - 0.06), 0, z * (bz / 2 - 0.06), 0.008);
    b.box(MT.cream, bx * 0.9, 0.11, 0.42, 0.02, 0.2, -bz / 2 + 0.27, 0.012); b.cyl(MT.brass, 0.014, 0.014, 0.02, -bx * 0.43, 0.25, -bz / 2 + 0.27, 8);      // a drawer
    b.box(MT.steel, 0.36, 0.014, 0.5, 0.05, 0.34, 0.05, 0.012); b.box(MT.ink, 0.3, 0.004, 0.42, 0.05, 0.352, 0.05, 0.004); b.box(MT.steel, 0.014, 0.3, 0.5, 0.25, 0.345, 0.05, 0.006); b.box(MT.glass, 0.006, 0.25, 0.44, 0.241, 0.37, 0.05, 0.003); b.box(MT.mustard, 0.007, 0.05, 0.16, 0.2405, 0.5, 0.05, 0.002); for (let i = 0; i < 4; i++) b.box(MT.steel, 0.045, 0.004, 0.36, -0.04 + i * 0.06, 0.354, 0.05, 0.002);      // the laptop, open: a lit screen, rows of keys
    b.cyl(MT.ink, 0.07, 0.07, 0.012, 0.2, 0.34, -bz * 0.36, 16); b.cyl(MT.ink, 0.01, 0.01, 0.2, 0.2, 0.35, -bz * 0.36, 6); b.cyl(MT.mustard, 0.09, 0.05, 0.08, 0.14, 0.5, -bz * 0.36, 16);      // the lamp
    [[MT.fabric, 0], [MT.cream, 0.15], [MT.clay, -0.2]].forEach(([m, rot], i) => b.box(m, 0.26 - i * 0.02, 0.022, 0.19, 0.1, 0.34 + i * 0.022, bz * 0.33, 0.006, rot)); b.cyl(MT.white, 0.035, 0.04, 0.05, -0.28, 0.34, 0.36, 12);
    const ch = piece(0.625 - (bx / 2 + 0.34) / PW, 0.27, 0.25); ch.cyl(MT.ink, 0.17, 0.16, 0.012, 0, 0, 0, 5); ch.cyl(MT.steel, 0.02, 0.02, 0.17, 0, 0.012, 0, 8); ch.box(MT.fabric2, 0.34, 0.05, 0.36, 0, 0.18, 0, 0.022); ch.box(MT.fabric2, 0.05, 0.24, 0.34, -0.17, 0.2, 0, 0.022);
    const ky = piece(0.425, 0.88, 0.5, 1); ky.cyl(MT.brass, 0.075, 0.075, 0.012, 0, 0, 0, 20); ky.cyl(MT.cream, 0.05, 0.05, 0.014, 0, 0, 0, 16); ky.box(MT.steel, 0.2, 0.012, 0.04, 0.14, 0, 0.03, 0.004, 0.3); ky.box(MT.steel, 0.17, 0.012, 0.04, 0.12, 0, -0.05, 0.004, -0.4); ky.box(MT.mustard, 0.08, 0.02, 0.08, -0.1, 0, 0.02, 0.008, 0.6);      // a ring, two keys and a fob
    const p = piece(0.385, 0.36); p.cyl(MT.clay, 0.15, 0.2, 0.22, 0, 0, 0, 24); p.cyl(MT.walnut, 0.17, 0.17, 0.01, 0, 0.215, 0, 20);
    for (let i = 0; i < 8; i++) {      // each leaf is a flat oval, tipped up on its own stem
      const a = i * 2.39996 + 0.4, tilt = 0.5 + (i % 3) * 0.22, r = 0.13 + (i % 4) * 0.045, y = FY + (0.4 + (i % 3) * 0.13 + i * 0.012) * HS;
      const g = new THREE.SphereGeometry(0.15, 12, 8); g.scale(1.25, 0.06, 0.72); g.translate(0.13, 0, 0); g.rotateZ(tilt); g.rotateY(-a); g.translate(U(0.385) + Math.cos(a) * r * 0.4, y, Zv(0.36) + Math.sin(a) * r * 0.4); put(MT.green, g);
      const st = new THREE.CylinderGeometry(0.008, 0.012, 0.3 * HS, 5); st.translate(0, 0.15 * HS, 0); st.rotateZ(-0.25 - (i % 3) * 0.1); st.rotateY(-a); st.translate(U(0.385), FY + 0.2 * HS, Zv(0.36)); put(MT.green, st);
    } }
  { // bedroom: a wardrobe with four doors, a bed with a headboard, two pillows and a duvet turned back
    const sx = wide(0.15), sz = deep(0.12), w = piece(0.765, 0.12);
    w.box(MT.white, sx, 0.6, sz, 0, 0.02, 0, 0.025); w.box(MT.ink, sx - 0.06, 0.02, sz - 0.06, 0, 0, 0, 0.006);
    for (let i = 0; i < 4; i++) { const x = -sx / 2 + sx / 8 + i * sx / 4; w.box(MT.wood, sx / 4 - 0.035, 0.53, 0.02, x, 0.055, sz / 2, 0.012); w.cyl(MT.brass, 0.02, 0.02, 0.03, x + (i % 2 ? -1 : 1) * (sx / 8 - 0.07), 0.3, sz / 2 + 0.012, 8); }
    const bx = wide(0.095), bz = deep(0.46), b = piece(0.7675, 0.49);
    b.box(MT.walnut, bx + 0.08, 0.1, bz + 0.06, 0, 0.03, 0, 0.03); for (const [x, z] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) b.cyl(MT.walnut, 0.035, 0.045, 0.04, x * (bx / 2 - 0.05), 0, z * (bz / 2 - 0.05), 8);
    b.box(MT.walnut, bx + 0.1, 0.4, 0.07, 0, 0.03, -bz / 2 - 0.02, 0.03); b.box(MT.white, bx, 0.1, bz, 0, 0.13, 0, 0.05);
    for (const x of [-1, 1]) b.box(MT.white, bx * 0.42, 0.075, bz * 0.2, x * bx * 0.24, 0.225, -bz * 0.34, 0.036);
    b.box(MT.fabric2, bx + 0.04, 0.05, bz * 0.6, 0, 0.215, bz * 0.2, 0.025); b.box(MT.white, bx + 0.045, 0.065, bz * 0.11, 0, 0.215, -bz * 0.08, 0.03); b.box(MT.mustard, bx + 0.05, 0.03, bz * 0.16, 0, 0.262, bz * 0.34, 0.014); }
  { // bath: a tub with water in it and a tap, a toilet, a towel left on the floor
    const sx = wide(0.075), sz = deep(0.42), t = piece(0.9325, 0.29);
    t.box(MT.white, sx, 0.27, sz, 0, 0, 0, 0.13); t.box(MT.cap, sx - 0.22, 0.01, sz - 0.22, 0, 0.266, 0, 0.11); t.box(MT.water, sx - 0.34, 0.012, sz - 0.34, 0, 0.268, 0, 0.09);
    t.box(MT.brass, 0.05, 0.05, 0.1, 0, 0.27, -sz / 2 + 0.12, 0.012); for (const x of [-0.12, 0.12]) t.cyl(MT.brass, 0.022, 0.022, 0.035, x, 0.27, -sz / 2 + 0.09, 8);
    t.ball(MT.mustard, 0.065, 0.1, 0.305, 0.2, 0.8, 1.2); t.ball(MT.mustard, 0.042, 0.15, 0.345, 0.2); t.box(MT.clay, 0.04, 0.014, 0.02, 0.2, 0.332, 0.2, 0.005);      // a rubber duck
    const o = piece(0.966, 0.68); o.box(MT.white, 0.16, 0.3, 0.34, 0.14, 0, 0, 0.03); o.cyl(MT.white, 0.13, 0.17, 0.18, -0.08, 0, 0, 24); o.cyl(MT.cap, 0.18, 0.18, 0.02, -0.08, 0.18, 0, 24); o.cyl(MT.white, 0.14, 0.14, 0.012, -0.08, 0.2, 0, 24);
    const w = piece(0.938, 0.8, 0.5, 1); w.box(MT.mustard, 0.5, 0.03, 0.34, 0, 0, 0, 0.012); w.box(MT.white, 0.5, 0.032, 0.05, 0, 0, 0.09, 0.012); w.box(MT.white, 0.5, 0.032, 0.05, 0, 0, -0.09, 0.012); }

  const model = new THREE.Group(); scene.add(model);
  for (const [m, list] of bins) { const mesh = new THREE.Mesh(mergeGeometries(list, false), m); mesh.frustumCulled = false; model.add(mesh); }
  const pops = [];
  // Once the home is learned, a line of dots runs from where it stands back through every door to its dock: the map, used.
  const BACK = new THREE.CatmullRomCurve3([[0.925, 0.58], [0.875, 0.63], [0.858, 0.78], [0.835, 0.9], [0.72, 0.9], [0.693, 0.74], [0.67, 0.56], [0.555, 0.64], [0.37, 0.6], [0.31, 0.82], [0.2, 0.84], [0.15, 0.6], [0.085, 0.72]].map(([u, v]) => V3(U(u), FY + 0.012, Zv(v))), false, 'centripetal').getSpacedPoints(160);      // one smooth line, through every door
  const backLen = BACK.slice(1).reduce((n, q, i) => n + q.distanceTo(BACK[i]), 0), NB = Math.round(backLen / 0.3);
  const back = new THREE.InstancedMesh(new THREE.CircleGeometry(0.1, 18).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#ffffff', fog: false, toneMapped: false }), NB);
  const rim = new THREE.InstancedMesh(new THREE.CircleGeometry(0.14, 18).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: '#1b2470', fog: false, toneMapped: false }), NB);      // a dark rim under each dot: yellow alone was lost on the oak and the tiles
  { const mx = new THREE.Matrix4(); let i = 0, seg = 0, into = 0; for (; i < NB; i++) { let dd = i * 0.3 - into; while (seg < BACK.length - 2 && dd > BACK[seg].distanceTo(BACK[seg + 1])) { const l = BACK[seg].distanceTo(BACK[seg + 1]); dd -= l; into += l; seg++; } const q = V3().copy(BACK[seg]).lerp(BACK[seg + 1], Math.min(1, dd / BACK[seg].distanceTo(BACK[seg + 1]))); mx.makeTranslation(q.x, q.y, q.z); back.setMatrixAt(i, mx); } }
  const backC = new THREE.Color(), backY = new THREE.Color('#f6c21a'), backW = new THREE.Color('#fff6cf'); for (let i = 0; i < NB; i++) back.setColorAt(i, backY);
  back.count = 0; back.frustumCulled = false; back.renderOrder = 3; model.add(back);
  { const mx = new THREE.Matrix4(); for (let i = 0; i < NB; i++) { back.getMatrixAt(i, mx); mx.elements[13] -= 0.004; rim.setMatrixAt(i, mx); } rim.instanceMatrix.needsUpdate = true; rim.count = 0; rim.frustumCulled = false; rim.renderOrder = 2; model.add(rim); }

  /* ---------- the floors: boards, tiles, rugs and the soft shadow under every piece, painted once ---------- */
  const SC = 2, { k, tex } = canvasTex(W * SC, Hc * SC);
  { const X = (u) => u * W * SC, Y = (v) => (top + v * ih) * SC, hash = (i) => { const x = Math.sin(i * 127.1) * 43758.5453; return x - Math.floor(x); };
    const boards = (ua, ub, base, n, seed) => { const hgt = ih * SC / n; for (let r = 0; r < n; r++) { let x = X(ua) - hash(seed + r) * 260; let j = 0; while (x < X(ub)) { const len = 230 + hash(seed + r * 13 + j) * 200, l = 0.9 + hash(seed + r * 7 + j * 3) * 0.16; k.fillStyle = `rgb(${Math.round(base[0] * l)},${Math.round(base[1] * l)},${Math.round(base[2] * l)})`; k.fillRect(Math.max(x, X(ua)), Y(0) + r * hgt, Math.min(len, X(ub) - Math.max(x, X(ua))), hgt - 1.5); x += len + 1.5; j++; } } };
    const tiles = (ua, ub, size, cA, cB, grout) => { k.fillStyle = grout; k.fillRect(X(ua), Y(0), X(ub) - X(ua), ih * SC); for (let y = Y(0), r = 0; y < Y(1); y += size, r++) for (let x = X(ua), q = 0; x < X(ub); x += size, q++) { k.fillStyle = (r + q) % 2 ? cA : cB; k.fillRect(x + 1.5, y + 1.5, Math.min(size, X(ub) - x) - 3, Math.min(size, Y(1) - y) - 3); } };
    const rug = (ua, va, ub, vb, a, b2, c2) => { const x = X(ua), y = Y(va), w = X(ub) - x, h = Y(vb) - y; k.fillStyle = a; k.beginPath(); k.roundRect(x, y, w, h, 14); k.fill(); k.strokeStyle = b2; k.lineWidth = 9; k.strokeRect(x + 20, y + 20, w - 40, h - 40); k.strokeStyle = c2; k.lineWidth = 3; k.strokeRect(x + 36, y + 36, w - 72, h - 72); for (let i = 0; i < w / 12; i++) { k.fillStyle = a; k.fillRect(x + i * 12 + 3, y - 9, 4, 9); k.fillRect(x + i * 12 + 3, y + h, 4, 9); } };
    k.clearRect(0, 0, W * SC, Hc * SC);
    tiles(rooms[0][1], rooms[0][2], 62, '#d9d3c7', '#cfc8ba', '#b9b2a4');                              // hall: stone tiles
    tiles(rooms[1][1], rooms[1][2], 40, '#f1ece2', '#e2dccf', '#c8c1b3');                              // kitchen: small checks
    boards(rooms[2][1], rooms[2][2], [214, 174, 124], 15, 3); boards(rooms[3][1], rooms[3][2], [224, 190, 146], 15, 71);      // living room and bedroom: oak boards
    tiles(rooms[4][1], rooms[4][2], 30, '#dfe9ee', '#d2e0e7', '#b4c4cc');                              // bath: small pale tiles
    rug(0.41, 0.42, 0.61, 0.82, '#ece4d2', '#3d57d6', '#f6c21a'); rug(0.69, 0.76, 0.72, 0.98, '#3d57d6', '#ece4d2', '#ece4d2'); rug(0.9, 0.56, 0.955, 0.74, '#ece4d2', '#f6c21a', '#3d57d6');
    k.fillStyle = '#8a6238'; k.beginPath(); k.roundRect(X(0.02), Y(0.9), X(0.06) - X(0.02), Y(0.99) - Y(0.9), 8); k.fill();      // the doormat
    // soft shadows: where a piece meets the floor, and along the foot of every wall
    k.save(); k.filter = `blur(${9 * SC}px)`; k.fillStyle = 'rgba(46, 30, 12, 0.6)';
    for (const [u, v, w, h] of [[0.03, 0.1, 0.035, 0.2], [0.16, 0.06, 0.2, 0.15], [0.485 - 1.5 / PW, 0.1, 3.0 / PW, 0.2], [0.6, 0.09, 0.05, 0.34], [0.69, 0.06, 0.15, 0.12], [0.72, 0.26, 0.095, 0.46], [0.895, 0.08, 0.075, 0.42], [0.955, 0.62, 0.02, 0.1]]) k.fillRect(X(u) + 5, Y(v) + 8, X(u + w) - X(u), Y(v + h) - Y(v) + 10);
    for (const [u, v, r] of [[0.25, 0.62, 0.6], [0.205, 0.62, 0.2], [0.295, 0.62, 0.2], [0.385, 0.36, 0.22], [0.085, 0.72, 0.44], [0.572, 0.13, 0.16]]) { k.beginPath(); k.ellipse(X(u) + 5, Y(v) + 9, r / PW * W * SC, r / PW * W * SC, 0, 0, 7); k.fill(); }
    k.fillStyle = 'rgba(46, 30, 12, 0.42)'; k.fillRect(X(UA), Y(0) - 4, X(UB) - X(UA), 16 * SC); for (let i = 0; i <= rooms.length; i++) { const u = i === rooms.length ? UB : rooms[i][1]; k.fillRect(X(u) - 2, Y(0), 14 * SC, ih * SC); }
    k.restore();
    k.globalCompositeOperation = 'destination-in'; k.fillStyle = '#000'; k.fillRect(X(UA), Y(0), X(UB) - X(UA), ih * SC); k.globalCompositeOperation = 'source-over';      // nothing outside the walls
    tex.needsUpdate = true; }
  // The floor is one flat picture. Its shader does the scan: the picture behind the light, a field of dots ahead of it, and the bright line itself.
  const planMat = new THREE.MeshBasicMaterial({ map: tex, color: '#ebe7df', transparent: true, depthWrite: false, fog: false, toneMapped: false });
  planMat.onBeforeCompile = (sh) => {
    sh.uniforms.uScan = scanU; sh.uniforms.uOn = onU; sh.uniforms.uBot = botU; sh.uniforms.uBox = { value: new THREE.Vector4(U(UA), U(UB), zN, zS) };
    sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec2 vScanXZ;').replace('#include <project_vertex>', '#include <project_vertex>\nvScanXZ = (modelMatrix * vec4(transformed, 1.0)).xz;');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nuniform float uScan;\nuniform float uOn;\nuniform vec4 uBox;\nuniform vec3 uBot;\nvarying vec2 vScanXZ;')
      .replace('#include <map_fragment>', `#include <map_fragment>
        float ahead = step(uScan, vScanXZ.x);
        float inside = step(uBox.x, vScanXZ.x) * step(vScanXZ.x, uBox.y) * step(uBox.z, vScanXZ.y) * step(vScanXZ.y, uBox.w);
        vec2 gq = fract(vScanXZ * 2.4) - 0.5;
        float dotm = smoothstep(0.085, 0.05, length(gq));
        float edge = smoothstep(0.7, 0.0, uScan - vScanXZ.x) * (1.0 - ahead);
        float line = smoothstep(0.06, 0.0, abs(uScan - vScanXZ.x)) * inside * uOn;
        float bd = distance(vScanXZ, uBot.xy);
        float ping = smoothstep(0.93, 1.0, fract(bd * 0.62 - uBot.z * 0.75)) * smoothstep(3.4, 0.5, bd) * uOn;      // rings going out from its feet: it is measuring
        vec4 behind = diffuseColor; behind.rgb += vec3(1.0, 0.78, 0.25) * (edge * edge * 0.3 + ping * 0.3);
        vec4 front = vec4(1.0, 1.0, 1.0, 0.2 * dotm * inside * opacity);
        diffuseColor = mix(behind, front, ahead);
        diffuseColor = mix(diffuseColor, vec4(1.0, 0.96, 0.8, opacity), line);`);
  };
  planMat.customProgramCacheKey = () => 'mosey-plan-floor';
  const plan = new THREE.Mesh(new THREE.PlaneGeometry(PW, PD), planMat);
  plan.rotation.x = -Math.PI / 2; plan.position.set((x0 + x1) / 2, FY + 0.002, (z0 + z1) / 2); plan.renderOrder = 2; scene.add(plan);

  // the scan is the bright line on the floor, the rings going out from its feet and a rain of small sparks along the line
  const NS = 44, sparkP = new Float32Array(NS * 3), sparkS = Array.from({ length: NS }, (_, i) => ({ z: zN + 0.1 + (DV - 0.2) * ((i * 0.618) % 1), sp: 0.5 + ((i * 0.37) % 1) * 0.9, ph: (i * 0.71) % 1 }));
  const sparks = new THREE.Points(new THREE.BufferGeometry().setAttribute('position', new THREE.BufferAttribute(sparkP, 3)), new THREE.PointsMaterial({ color: '#ffcf3d', size: 0.032, transparent: true, opacity: 0.85, depthWrite: false, fog: false, blending: THREE.AdditiveBlending, toneMapped: false }));
  sparks.frustumCulled = false; scene.add(sparks);

  /* ---------- what it remembers: pins on the plan, labels on the page ---------- */
  const ui = document.getElementById('mappins'), chip = document.getElementById('mapchip'), chipLabel = chip.querySelector('span'), chipCount = chip.querySelector('b');
  const pinMat = new THREE.MeshBasicMaterial({ color: '#ffffff', fog: false });
  const pins = [[0.085, 0.72, 'Dock'], [0.3, 0.2, 'Stove'], [0.425, 0.88, 'Keys, last seen'], [0.215, 0.4, 'Sun at 4 pm'], [0.775, 0.5, 'Your side']].map(([u, v, name]) => {
    const g = new THREE.Group(); g.position.set(U(u), 0, Zv(v)); model.add(g);
    const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.62, 8), pinMat); stick.position.y = 0.31; g.add(stick);
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.046, 16, 12), new THREE.MeshBasicMaterial({ color: PAL.accent, fog: false })); head.position.y = 0.66; g.add(head);
    const el = document.createElement('div'); el.className = 'mpin'; el.innerHTML = `<p>${name}</p>`; ui.appendChild(el);
    return { u, g, el, p: V3(U(u), 0.74, Zv(v)) };
  });
  { const el = document.createElement('div'); el.className = 'mpin'; el.innerHTML = '<p>Mosey</p>'; ui.appendChild(el); pins.push({ u: 0, g: null, el, p: V3(), follow: true }); }      // from the dock it is a long way off: this says which speck it is

  const xa = hl[0].x0, xb = U(0.955), lens = V3(), _p = V3();      // done a little before it reaches the last room's far wall, so the finished plan gets a beat
  let m2 = -1, P = 0, live = false, lastTag = '', cardR = null, chipR = null, camT = 0, lastUp = 0; const _r = V3(), camPrev = V3();
  return {
    frame({ S, R, T }) {
      const a = smooth(S.d, M.headline - 0.4, M.onG) * (1 - smooth(S.d, M.street + 0.8, M.street + 3));
      live = a > 0.01; plan.visible = model.visible = live; planMat.opacity = a;
      if (!live) { sparks.visible = false; P = 0; return; }
      const lead = 1.7 * smooth(S.d, M.gap - 2.0, M.gap - 0.2);                                   // once it is down in the plan, the light runs a little ahead of it, so the home appears in front of it
      const p = P = S.d >= M.tip ? 1 : S.d < M.headline ? 0 : Math.min(clamp((R.pos.x + lead - xa) / (xb - xa), 0, 1), clamp((S.d - M.onG - 0.35) * 0.14, 0, 1));      // the light waits until the camera is up, then runs out from the front door and catches it up
      const scanning = p > 0.004 && p < 0.999, fx = U(Math.min(p, UB - 0.004));
      scanU.value = p >= 0.999 ? 1e9 : p <= 0.004 ? -1e9 : fx; onU.value = scanning ? Math.min(1, (p - 0.004) / 0.014) : 0; botU.value.set(S.d > M.gap - 0.1 ? R.pos.x : 1e6, R.pos.z, T);      // the measuring rings start when it is down in the home, not while it is up on the word
      model.scale.y = Math.max(0.001, a);
      rim.count = back.count = Math.round(NB * smooth(S.d, M.tip + 0.6, M.tip + 5.0));
      if (back.count) { const head = ((T * 0.42) % 1.25) * NB; for (let i = 0; i < back.count; i++) { const q = (i - head) / 3.2; back.setColorAt(i, backC.copy(backY).lerp(backW, Math.exp(-q * q))); } back.instanceColor.needsUpdate = true; }      // a brighter spot runs along the dots, from it to the dock, again and again
      for (const o of pops) { const e = clamp((p - o.u) / 0.022, 0, 1), s = e <= 0 ? 0 : backOut(e); o.m.visible = e > 0; o.m.scale.setScalar(Math.max(0.001, s)); }
      for (const n of pins) { if (n.follow) { n.on = S.d > M.tip + 4.2 && S.d < M.tipEnd + 0.4; n.p.set(R.pos.x, R.pos.y + 1.3, R.pos.z); continue; } const e = clamp((p - n.u) / 0.03, 0, 1); n.on = e > 0.5; n.k = (n.k || 0) + ((n.shown ? 1 : 0) - (n.k || 0)) * 0.2; n.g.visible = n.k > 0.02; n.g.scale.setScalar(Math.max(0.001, n.k)); }      // a pin stands only while its label is up, so there is never a bare pin
      sparks.visible = scanning;
      if (scanning) {
        for (let i = 0; i < NS; i++) { const s = sparkS[i], h = (T * s.sp + s.ph) % 1; sparkP[i * 3] = fx - h * 0.12 + Math.sin(T * 3 + i) * 0.02; sparkP[i * 3 + 1] = FY + h * h * 0.75; sparkP[i * 3 + 2] = s.z; }      // they rise off the line and fall behind it
        sparks.geometry.attributes.position.needsUpdate = true;
      }
    },
    // after the render, with the camera settled: the labels and the counter
    after({ S, R }) {
      const placed = PLACED;
      const show = live && S.d > M.onG - 0.4 && S.d < M.tipEnd + 0.5;
      chip.classList.toggle('is-on', show);
      const n = Math.round(P * TOTAL), ub = (R.pos.x - x0) / PW, room = rooms.find((r) => ub < r[2]) || rooms[rooms.length - 1], tag = n >= TOTAL ? 'Map saved · 5 rooms' : `Mapping · ${room[0]}`;
      if (n !== m2 || tag !== lastTag) { m2 = n; lastTag = tag; chipCount.textContent = `${n} m²`; chipLabel.textContent = tag; chip.classList.toggle('done', n >= TOTAL); }      // the counter names the room it is in
      // A label shows only where its whole rectangle has room: inside the frame, clear of the bars, the counter, the caption card, the robot and every label already placed.
      // It has to have had room for a moment before it comes up, and once it goes it stays away for a second: no blinking while the camera moves.
      const done = S.d > M.tip - 0.2, W2 = innerWidth, H2 = innerHeight, small = W2 < 820, now = performance.now();
      if (show && (S.tick & 3) === 0) { const c2 = document.querySelector('.copy.note.is-on'); if (c2) { const r = c2.getBoundingClientRect(); if (r.width > 0) cardR = r; } chipR = chip.getBoundingClientRect(); }      // the card's place is kept while captions swap: they all sit in the same spot
      let bot = null;
      if (show) { _r.copy(robot.root.position); _r.project(camera); const fx2 = (_r.x * 0.5 + 0.5) * W2, fy = (-_r.y * 0.5 + 0.5) * H2; _r.copy(robot.root.position); _r.y += 1.05; _r.project(camera); const hy = (-_r.y * 0.5 + 0.5) * H2, hh = Math.abs(fy - hy); bot = { left: fx2 - hh * 0.34, right: fx2 + hh * 0.34, top: hy - hh * 0.12, bottom: fy + 4 }; }
      const hit = (L, r, pad) => r && L.left < r.right + pad && L.right > r.left - pad && L.top < r.bottom + pad && L.bottom > r.top - pad;
      const cs = camPrev.distanceTo(camera.position) / Math.max(0.004, (now - camT) / 1000); camPrev.copy(camera.position); camT = now;
      const out = S.d > M.tip + 0.3 && S.d < M.tip + 6.0, atDock = S.d >= M.tip + 6.0;      // from the lift out of the bath to the dock no label is up, then they come up once at the dock and stay
      const flying = cs > 6 || out;      // and while the camera travels fast no label is up either: they come back when it settles
      placed.length = 0;
      for (const pin of pins) {
        let ok = show && pin.on && !flying, x = 0, y = 0, L = null, flip = pin.flip;
        if (ok) {
          _p.copy(pin.p).project(camera); x = (_p.x * 0.5 + 0.5) * W2; y = (-_p.y * 0.5 + 0.5) * H2;
          const w = pin.w || (pin.w = pin.el.firstElementChild.offsetWidth) || 130, pad = pin.shown ? 4 : 18;
          const room = (fl) => { const Q = fl ? { left: x - 16 - w, right: x - 10, top: y - (small ? 26 : 32), bottom: y + 4 } : { left: x + 10, right: x + 16 + w, top: y - (small ? 26 : 32), bottom: y + 4 };
            if (!(Q.left > 8 && Q.right < W2 - 8 && Q.top > (small ? 100 : 112) + pad && Q.bottom < H2 - (small ? 96 : 150) - pad) || hit(Q, cardR, pad + 4) || hit(Q, chipR, pad) || (!pin.follow && hit(Q, bot, pad - 6))) return null;
            for (const q of placed) if (hit(Q, q, pin.shown ? 2 : 12)) return null; return Q; };
          ok = _p.z < 1 && (done || pin.follow || Math.abs(pin.p.x - R.pos.x) < (pin.shown ? 12 : 10));
          if (ok) { L = room(!!flip); if (!L && !pin.shown) { L = room(!flip); if (L) flip = !flip; } if (!L && pin.shown && atDock) L = { left: x + 10, right: x + 16 + w, top: y - 32, bottom: y + 4 }; ok = !!L; }      // it keeps the side it is on while it is up, and may pick the other side only when it comes up
        }
        let on = ok;
        if (ok && !pin.shown) { if (!pin.okAt) pin.okAt = now; if (now - pin.okAt < 500 || now < (pin.cool || 0) || now - lastUp < 150 || cs > 2.2) on = false; else { lastUp = now; pin.upAt = now; } }      // a label comes up only when the camera is nearly at rest else if (!ok) { pin.okAt = 0; if (pin.shown) pin.cool = now + (flying ? 300 : 2200); }
        if (!on && pin.shown && !flying && show && pin.on && now - (pin.upAt || 0) < 1500) { on = true; L = L || { left: x + 10, right: x + 16 + (pin.w || 130), top: y - 32, bottom: y + 4 }; pin.cool = 0; }      // once up it stays at least a second and a half: never a flash
        if (on) { placed.push(L); if (flip !== pin.flip) { pin.flip = flip; pin.el.classList.toggle('flip', !!flip); } pin.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`; }
        pin.shown = on; pin.el.classList.toggle('is-on', on);
      }
    },

  };
}

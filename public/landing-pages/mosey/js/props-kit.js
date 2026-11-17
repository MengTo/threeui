// Mosey props kit: the charging dock, the signal rings over the antenna, the specs plinth and the RESERVE button.
// Each maker returns a group built around its own origin, y up, floor at y = 0. The page places the group.
// Everything is core Three.js (passed in as THREE), no addons, no image files. Text is drawn on canvases.

const TAU = Math.PI * 2;
const clamp01 = (v) => Math.min(1, Math.max(0, v));
const BRASS = '#c9982e';

/* ---------- shared helpers ---------- */

// a canvas and its texture. Colour maps are sRGB, bump maps are not.
function makeCanvas(THREE, w, h, colour = true) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  const tex = new THREE.CanvasTexture(c);
  if (colour) tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return { c, k: c.getContext('2d'), tex };
}

// A lathe outline from a few corners [radius, height, rounding, steps]. Each corner with a rounding is cut into a small curve
// that starts that far before the corner, so no edge ends hard. Go from the bottom outside, up, then in across the top.
function profile(THREE, corners, steps = 5) {
  const out = [];
  corners.forEach(([x, y, r = 0, n = steps], i) => {
    const a = corners[i - 1], b = corners[i + 1];
    if (!r || !a || !b) { out.push(new THREE.Vector2(x, y)); return; }
    const ax = a[0] - x, ay = a[1] - y, bx = b[0] - x, by = b[1] - y, la = Math.hypot(ax, ay), lb = Math.hypot(bx, by);
    const d = Math.min(r, la * 0.45, lb * 0.45);
    const p0x = x + ax / la * d, p0y = y + ay / la * d, p1x = x + bx / lb * d, p1y = y + by / lb * d;
    for (let s = 0; s <= n; s++) { const t = s / n, u = 1 - t; out.push(new THREE.Vector2(u * u * p0x + 2 * u * t * x + t * t * p1x, u * u * p0y + 2 * u * t * y + t * t * p1y)); }
  });
  return out;
}
const lathe = (THREE, corners, around = 96, steps = 5) => new THREE.LatheGeometry(profile(THREE, corners, steps), around);

// a flat outline with every corner rounded, for extruding. pts are [x, y, rounding].
function roundPoly(THREE, pts, steps = 6) {
  const s = new THREE.Shape(), n = pts.length;
  pts.forEach(([x, y, r = 0], i) => {
    const a = pts[(i + n - 1) % n], b = pts[(i + 1) % n];
    const ax = a[0] - x, ay = a[1] - y, bx = b[0] - x, by = b[1] - y, la = Math.hypot(ax, ay), lb = Math.hypot(bx, by), d = Math.min(r, la * 0.45, lb * 0.45);
    const p0 = [x + ax / la * d, y + ay / la * d], p1 = [x + bx / lb * d, y + by / lb * d];
    if (i === 0) s.moveTo(p0[0], p0[1]); else s.lineTo(p0[0], p0[1]);
    if (d > 0) s.quadraticCurveTo(x, y, p1[0], p1[1]);
  });
  s.closePath(); return s;
}
const roundRect = (THREE, w, h, r) => roundPoly(THREE, [[-w / 2, -h / 2, r], [w / 2, -h / 2, r], [w / 2, h / 2, r], [-w / 2, h / 2, r]]);

// an outline pushed out into a solid with soft edges. It grows along z, from 0 to depth.
function slab(THREE, shape, depth, bevel, curve = 8) {
  const g = new THREE.ExtrudeGeometry(shape, { depth: depth - bevel * 2, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelOffset: -bevel, bevelSegments: 3, curveSegments: curve });
  return g.translate(0, 0, bevel);
}

// several geometries as one, so one material is one draw call
function merge(THREE, list) {
  const parts = list.map((g) => (g.index ? g.toNonIndexed() : g)), out = new THREE.BufferGeometry();
  for (const name of ['position', 'normal', 'uv']) {
    if (!parts.every((g) => g.attributes[name])) continue;
    const size = parts[0].attributes[name].itemSize, arr = new Float32Array(parts.reduce((n, g) => n + g.attributes[name].count * size, 0));
    let o = 0; for (const g of parts) { arr.set(g.attributes[name].array, o); o += g.attributes[name].count * size; }
    out.setAttribute(name, new THREE.BufferAttribute(arr, size));
  }
  return out;
}

// a ribbed band, like the grip of a dial: a ring whose wall goes in and out
function fluted(THREE, { r0, y0, r1, y1, ribs, depth, wave = [1, 1, 0.45, 0, 0, 0.45] }) {
  const per = wave.length, n = ribs * per, rows = [[0, 0], [0.12, 1], [0.88, 1], [1, 0]], pos = [], idx = [];
  for (const [t, k] of rows) for (let i = 0; i < n; i++) {
    const a = i / n * TAU, r = r0 + (r1 - r0) * t + depth * k * wave[i % per];
    pos.push(Math.sin(a) * r, y0 + (y1 - y0) * t, Math.cos(a) * r);
  }
  for (let j = 0; j < rows.length - 1; j++) for (let i = 0; i < n; i++) {
    const a = j * n + i, b = j * n + (i + 1) % n, c = a + n, d = b + n;
    idx.push(a, b, c, b, d, c);
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
  return g;
}

// a small normal map of soft bumps that tiles: the slight waviness of sprayed lacquer
function peelMap(THREE, size = 128, cells = 8) {
  const wrap = (i) => ((i % cells) + cells) % cells, ease = (t) => t * t * (3 - 2 * t);
  const rnd = (i, j) => { const v = Math.sin(wrap(i) * 127.1 + wrap(j) * 311.7) * 43758.5453; return v - Math.floor(v); };
  const high = (x, y) => { const gx = x / size * cells, gy = y / size * cells, i = Math.floor(gx), j = Math.floor(gy), u = ease(gx - i), v = ease(gy - j); return (rnd(i, j) * (1 - u) + rnd(i + 1, j) * u) * (1 - v) + (rnd(i, j + 1) * (1 - u) + rnd(i + 1, j + 1) * u) * v; };
  const { k, tex } = makeCanvas(THREE, size, size, false), img = k.createImageData(size, size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const nx = (high(x - 1, y) - high(x + 1, y)) * 6, ny = (high(x, y - 1) - high(x, y + 1)) * 6, l = Math.hypot(nx, ny, 1), o = (y * size + x) * 4;
    img.data[o] = 127.5 + 127.5 * nx / l; img.data[o + 1] = 127.5 + 127.5 * ny / l; img.data[o + 2] = 127.5 + 127.5 / l; img.data[o + 3] = 255;
  }
  k.putImageData(img, 0, 0); tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

const shadows = (m, cast = true, receive = true) => { m.castShadow = cast; m.receiveShadow = receive; return m; };

/* ---------- the charging dock ---------- */

// segments is kept so older calls still work. The light ring is one continuous band now.
export function createDock({ THREE, PAL, DISPLAY, MONO, segments = 24, startAngle = 0 }) {
  const group = new THREE.Group();
  const shell = new THREE.MeshPhysicalMaterial({ color: '#1a1a20', metalness: 0.42, roughness: 0.45, clearcoat: 0.22, clearcoatRoughness: 0.45 });      // dark anodised metal
  const soft = new THREE.MeshStandardMaterial({ color: '#27272d', roughness: 0.82 });                                              // soft plastic: the foot, the cable and its plugs
  const rubber = new THREE.MeshStandardMaterial({ color: '#ffffff', roughness: 0.9 });                                              // the pad it stands on
  const brass = new THREE.MeshStandardMaterial({ color: BRASS, roughness: 0.3, metalness: 1 });

  // the base, from the floor up: a wall with a fine seam line, a chamfer that catches the light, a deck that slopes up to the light ring,
  // a narrow ledge inside the ring, and a small step down to the landing pad. It stands on a rubber foot set in from the edge.
  const baseG = lathe(THREE, [[0.78, 0.0075], [0.82, 0.0075, 0.006], [0.82, 0.0135, 0.001, 2], [0.8165, 0.015, 0.001, 2], [0.8165, 0.0175, 0.001, 2], [0.82, 0.019, 0.001, 2], [0.82, 0.037, 0.002, 2], [0.807, 0.048, 0.002, 2],
    [0.7225, 0.066, 0.0015, 2], [0.721, 0.0605], [0.6735, 0.0605], [0.6735, 0.0545], [0.642, 0.0545, 0.0015, 2], [0.6405, 0.0495], [0.6, 0.0495]], 128, 4);
  const footG = lathe(THREE, [[0.7, 0], [0.783, 0, 0.003, 2], [0.787, 0.0085], [0.7, 0.0085]], 96, 2);
  // the display stands behind the base: a thin panel that leans back so its face looks up at you, a prop behind it, and a low tab that joins it to the base
  const W = 0.58, H = 0.345, D = 0.034, LEAN = Math.atan(0.098 / 0.34), FRONT = -0.84, FOOT = 0.022, cosL = Math.cos(LEAN), sinL = Math.sin(LEAN);
  const panelG = slab(THREE, roundRect(THREE, W, H, 0.045), D, 0.008, 10).translate(0, H / 2, -D).rotateX(-LEAN).translate(0, FOOT, FRONT);
  const back = (y) => (y - FOOT) * Math.tan(LEAN) + D / cosL;                      // how far behind FRONT the back of the panel is at a height
  const propG = slab(THREE, roundPoly(THREE, [[0.03, 0.004, 0.006], [back(0.2) - 0.006, 0.2, 0.012], [back(0.2) + 0.03, 0.2, 0.02], [0.2, 0.03, 0.02], [0.2, 0.004, 0.006]]), 0.4, 0.012).rotateY(Math.PI / 2).translate(-0.2, 0, FRONT);
  const tabG = slab(THREE, roundRect(THREE, 0.46, 0.3, 0.06), 0.016, 0.005).rotateX(-Math.PI / 2).translate(0, 0, -0.915);
  group.add(shadows(new THREE.Mesh(merge(THREE, [baseG, panelG, propG, tabG]), shell)));

  // the landing pad: soft rubber with fine rings pressed in, two foot marks and the name printed on it
  {
    const { k, tex } = makeCanvas(THREE, 1024, 1024), PR = 0.6405, u = 1024 / (2 * PR), X = (x) => 512 + x * u, Z = (z) => 512 + z * u;
    k.fillStyle = '#1b1b20'; k.fillRect(0, 0, 1024, 1024);
    k.strokeStyle = 'rgba(255,255,255,0.022)'; k.lineWidth = 1.5; for (let r = 0.03; r < 0.575; r += 0.0125) { k.beginPath(); k.arc(512, 512, r * u, 0, TAU); k.stroke(); }
    k.strokeStyle = '#2f2f38'; k.lineWidth = 2.5; k.beginPath(); k.arc(512, 512, 0.59 * u, 0, TAU); k.stroke();
    k.strokeStyle = '#3b3b46'; k.lineWidth = 3;
    for (const x of [-0.13, 0.13]) { k.beginPath(); k.roundRect(X(x - 0.07), Z(-0.1), 0.14 * u, 0.25 * u, 0.06 * u); k.stroke(); }
    k.fillStyle = '#50505d'; k.textAlign = 'center'; k.font = `600 25px ${MONO}`;
    try { k.letterSpacing = '8px'; } catch (e) { /* older browsers space the letters normally */ }
    k.fillText('MOSEY DOCK', 512, Z(0.45));
    rubber.map = tex;
    group.add(shadows(new THREE.Mesh(new THREE.CircleGeometry(PR, 96).rotateX(-Math.PI / 2).translate(0, 0.05, 0), rubber), false));
  }

  // the cable: a plug with a ribbed strain relief in the side of the display, a soft curve along the floor, and the wall plug at the far end
  const PLUG = new THREE.Vector3(2.3, 0, -1.9), PORT = new THREE.Vector3(0.2, 0.046, FRONT - 0.13);
  {
    const ribs = [[0.008, 0]]; for (let i = 0; i < 7; i++) { const r = 0.0215 - i * 0.0011, y = 0.002 + i * 0.012; ribs.push([r, y], [r, y + 0.007], [r - 0.004, y + 0.0085], [r - 0.004, y + 0.012]); } ribs.push([0.0125, 0.088]);
    const reliefG = () => new THREE.LatheGeometry(ribs.map(([r, y]) => new THREE.Vector2(r, y)), 18);
    const gripG = lathe(THREE, [[0, 0], [0.0195, 0, 0.004, 3], [0.021, 0.02, 0.003, 2], [0.021, 0.07, 0.004, 3], [0.016, 0.076]], 20).rotateZ(-Math.PI / 2).translate(PORT.x + 0.008, PORT.y, PORT.z);
    const path = new THREE.CatmullRomCurve3([[PORT.x + 0.1, PORT.y, PORT.z], [PORT.x + 0.2, PORT.y, PORT.z], [0.56, 0.02, PORT.z - 0.03], [0.82, 0.0135, PORT.z - 0.11], [1.15, 0.0135, -1.36], [1.5, 0.0135, -1.72], [PLUG.x - 0.42, 0.018, PLUG.z + 0.02], [PLUG.x - 0.23, 0.042, PLUG.z], [PLUG.x - 0.1, 0.042, PLUG.z]].map((p) => new THREE.Vector3(...p)), false, 'centripetal');
    const tube = new THREE.TubeGeometry(path, 110, 0.0125, 8);
    const plugG = slab(THREE, roundRect(THREE, 0.24, 0.14, 0.035), 0.085, 0.014).rotateX(-Math.PI / 2).translate(PLUG.x, 0.002, PLUG.z);
    group.add(shadows(new THREE.Mesh(merge(THREE, [footG, tube, gripG, reliefG().rotateZ(-Math.PI / 2).translate(PORT.x + 0.08, PORT.y, PORT.z), reliefG().rotateZ(Math.PI / 2).translate(PLUG.x - 0.115, 0.042, PLUG.z), plugG]), soft)));
  }

  // brass: a hairline ring round the landing pad, two charging contacts, the metal collar of the plug, and the prongs of the wall plug
  {
    const trim = lathe(THREE, [[0.661, 0.054], [0.6605, 0.0562, 0.001, 2], [0.6485, 0.0562, 0.001, 2], [0.648, 0.054]], 128);
    const contact = (x) => slab(THREE, roundRect(THREE, 0.11, 0.036, 0.018), 0.006, 0.002, 6).rotateX(-Math.PI / 2).translate(x, 0.0465, -0.3);
    const collar = lathe(THREE, [[0, 0], [0.0235, 0, 0.002, 2], [0.0235, 0.012, 0.002, 2], [0.018, 0.012]], 20).rotateZ(-Math.PI / 2).translate(PORT.x, PORT.y, PORT.z);
    const prong = (z) => slab(THREE, roundRect(THREE, 0.07, 0.012, 0.004), 0.03, 0.002, 3).rotateX(-Math.PI / 2).translate(PLUG.x + 0.15, 0.03, PLUG.z + z);
    group.add(shadows(new THREE.Mesh(merge(THREE, [trim, contact(-0.09), contact(0.09), collar, prong(-0.035), prong(0.035)]), brass), false));
  }

  // The ring of light: one frosted band that wraps over the crest of the deck and down its inner side, so the near half shows from low down
  // and the far half shows across the pad. What it shows is a strip of 256 colours, written every frame and wrapped once round the ring.
  // The strip is three rows deep: the outer edge, a hotter line along the middle, and the inner side.
  // It starts at the front (startAngle turns the start, in radians) and fills up clockwise, seen from above.
  const GLOW = 256, ROWS = [[0.7, 0], [1, 0.3], [0.8, 0]], glowData = new Uint8Array(GLOW * ROWS.length * 4), glowTex = new THREE.DataTexture(glowData, GLOW, ROWS.length, THREE.RGBAFormat);
  glowTex.colorSpace = THREE.SRGBColorSpace; glowTex.magFilter = glowTex.minFilter = THREE.LinearFilter; glowTex.wrapS = THREE.RepeatWrapping;
  const ringG = new THREE.LatheGeometry([[0.7195, 0.0612], [0.7185, 0.0675], [0.712, 0.0725], [0.703, 0.075], [0.692, 0.0756], [0.682, 0.0745], [0.6745, 0.0715], [0.6712, 0.066], [0.6712, 0.0545]].map(([r, y]) => new THREE.Vector2(r, y)), 128);
  const ring = new THREE.Mesh(ringG, new THREE.MeshPhysicalMaterial({ color: '#2f2f36', roughness: 0.42, clearcoat: 0.35, clearcoatRoughness: 0.3, emissive: '#ffffff', emissiveMap: glowTex, toneMapped: false }));
  ring.receiveShadow = true;
  // a soft glow that spills from the lit part onto the deck and the edge of the pad. It adds light, so it shows on the dark body and in a dimmed room.
  const haloPts = [[0.79, 0.0533, 0], [0.757, 0.0602, 0.16], [0.726, 0.0672, 0.7], [0.712, 0.0755, 1], [0.693, 0.0782, 1], [0.675, 0.0755, 1], [0.668, 0.0665, 0.9], [0.667, 0.0568, 0.7], [0.642, 0.0568, 0.3], [0.59, 0.0522, 0]];
  const haloG = new THREE.LatheGeometry(haloPts.map(([r, y]) => new THREE.Vector2(r, y)), 128);
  { const col = []; for (let i = 0; i <= 128; i++) for (const p of haloPts) col.push(p[2], p[2], p[2]); haloG.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); }
  const halo = new THREE.Mesh(haloG, new THREE.MeshBasicMaterial({ color: new THREE.Color(1, 0.5, 0.5), map: glowTex, vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, fog: false }));
  halo.renderOrder = 2; group.add(ring, halo);

  // the display: glass over the whole face of the panel, with a thin black border round the lit part. The percentage is drawn on a canvas and glows on its own.
  const SW = 704, SH = 412, GW = W - 0.018, GH = H - 0.018, screen = makeCanvas(THREE, SW, SH);
  const glassG = new THREE.ShapeGeometry(roundRect(THREE, GW, GH, 0.036), 10);
  { const p = glassG.attributes.position, uv = glassG.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / GW + 0.5, p.getY(i) / GH + 0.5); }
  const glass = new THREE.Mesh(glassG, new THREE.MeshPhysicalMaterial({ color: '#050507', roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.04, emissive: '#ffffff', emissiveMap: screen.tex, emissiveIntensity: 1.25 }));
  glass.rotation.x = -LEAN; glass.position.set(0, FOOT + cosL * H / 2 + sinL * 0.0012, FRONT - sinL * H / 2 + cosL * 0.0012); group.add(glass);
  const shown = { pct: -1, charging: null };
  function draw(pct, charging) {
    const k = screen.k; shown.pct = pct; shown.charging = charging;
    k.fillStyle = '#000000'; k.fillRect(0, 0, SW, SH);
    k.fillStyle = '#08080c'; k.beginPath(); k.roundRect(15, 15, SW - 30, SH - 30, 32); k.fill();
    // the number, with a smaller percent sign
    const num = String(pct); k.textBaseline = 'alphabetic'; k.textAlign = 'left';
    k.font = `226px ${DISPLAY}`; const wn = k.measureText(num).width; k.font = `106px ${DISPLAY}`; const wp = k.measureText('%').width;
    let x = SW / 2 - (wn + 12 + wp) / 2;
    k.fillStyle = PAL.paper; k.font = `226px ${DISPLAY}`; k.fillText(num, x, 238); x += wn + 12;
    k.fillStyle = PAL.accent; k.font = `106px ${DISPLAY}`; k.fillText('%', x, 238);
    // a battery that fills up, and a word under the number
    const word = charging ? (pct >= 100 ? 'FULL' : 'CHARGING') : (pct >= 99 ? 'READY' : 'LOW');
    k.font = `600 38px ${MONO}`; try { k.letterSpacing = '5px'; } catch (e) { /* fine without */ }
    const ww = k.measureText(word).width, bw = 112, bh = 54, gap = 26, bx = SW / 2 - (bw + 10 + gap + ww) / 2, by = 288;
    k.strokeStyle = PAL.paper; k.lineWidth = 5; k.beginPath(); k.roundRect(bx, by, bw, bh, 13); k.stroke();
    k.fillStyle = PAL.paper; k.beginPath(); k.roundRect(bx + bw + 4, by + 17, 7, bh - 34, 3); k.fill();
    k.fillStyle = PAL.accent; k.beginPath(); k.roundRect(bx + 9, by + 9, Math.max(8, (bw - 18) * pct / 100), bh - 18, 5); k.fill();
    if (charging && pct < 100) { const cx = bx + bw / 2, cy = by + bh / 2; k.fillStyle = '#08080c'; k.beginPath(); k.moveTo(cx + 6, cy - 18); k.lineTo(cx - 12, cy + 4); k.lineTo(cx - 1, cy + 4); k.lineTo(cx - 6, cy + 18); k.lineTo(cx + 12, cy - 4); k.lineTo(cx + 1, cy - 4); k.closePath(); k.fill(); }
    k.fillStyle = charging ? PAL.accent : 'rgba(251,248,243,0.6)'; k.fillText(word, bx + bw + 10 + gap, by + 41);
    try { k.letterSpacing = '0px'; } catch (e) { /* fine without */ }
    screen.tex.needsUpdate = true;
  }

  // charge is 0 to 1. While charging the leading end of the light breathes. Off the charger the lit part sits dim and steady.
  const cOn = new THREE.Color(PAL.accent), cDim = cOn.clone().multiplyScalar(0.4), cHot = cOn.clone().lerp(new THREE.Color('#ffffff'), 0.75), cTip = new THREE.Color(), c = new THREE.Color();
  const toByte = (v) => Math.round(255 * (v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055));      // the strip is stored as sRGB
  function update(T, charge = 0, charging = false) {
    charge = clamp01(charge);
    const beat = 0.5 + 0.5 * Math.sin(T * 3.2), full = charge > 0.995;
    cTip.copy(cOn).multiplyScalar(0.25).lerp(cHot, beat);
    for (let j = 0; j < GLOW; j++) {
      let f = 1 - (j + 0.5) / GLOW - startAngle / TAU; f -= Math.floor(f);                // how far round the ring this colour sits, from the start
      const lit = full ? 1 : clamp01((charge - f) / 0.008);
      let glow = 0.04;
      if (!charging) c.copy(cDim);
      else if (full) { c.copy(cOn); glow = 0.12 + 0.05 * Math.sin(T * 2 - f * TAU); }
      else { const tip = Math.exp(-(((charge - f) / 0.03) ** 2)); c.copy(cOn).lerp(cTip, tip); glow = 0.1 + (0.3 * beat - 0.06) * tip; }
      const peak = Math.max(c.r, c.g, c.b);
      ROWS.forEach(([gain, white], row) => {
        const o = (row * GLOW + j) * 4, g = gain * lit, w = white * lit;                 // the middle row is pushed towards white, as far as its own brightness
        glowData[o] = toByte(c.r * g + (peak - c.r) * w); glowData[o + 1] = toByte(c.g * g + (peak - c.g) * w); glowData[o + 2] = toByte(c.b * g + (peak - c.b) * w); glowData[o + 3] = Math.round(255 * glow * lit);
      });
    }
    glowTex.needsUpdate = true;
    const pct = Math.round(charge * 100);
    if (pct !== shown.pct || charging !== shown.charging) draw(pct, charging);
    glass.material.emissiveIntensity = charging ? 1.25 : 0.6;
  }
  update(0, 0, false);
  return { group, update };
}

/* ---------- the signal rings over the antenna ---------- */

export function createAntennaPulse({ THREE, PAL, count = 4, from = 0.05, to = 0.45, speed = 0.55 }) {
  const group = new THREE.Group(); group.visible = false;
  const g = new THREE.RingGeometry(0.945, 1, 72);
  const rings = [];
  for (let i = 0; i < count; i++) {
    const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: PAL.accent, transparent: true, opacity: 0, depthWrite: false, side: THREE.DoubleSide, forceSinglePass: true, toneMapped: false, fog: false }));
    m.renderOrder = 3; rings.push(m); group.add(m);
  }
  // each ring grows from the tip and fades. They are spread in time so one is always on its way out.
  function update(T, strength = 1, camera = null) {
    group.visible = strength >= 0.01; if (!group.visible) return;
    if (camera) group.quaternion.copy(camera.quaternion);
    rings.forEach((m, i) => {
      const p = (((T * speed + i / count) % 1) + 1) % 1, grow = 1 - Math.pow(1 - p, 2.2);
      m.scale.setScalar(from + (to - from) * grow);
      m.material.opacity = strength * Math.min(1, p * 10) * Math.pow(1 - p, 1.6);
    });
  }
  return { group, update };
}

/* ---------- the specs plinth ---------- */

export function createPlinth({ THREE, PAL, PH = 0.3, DISPLAY = '"Archivo Black", "Arial Black", sans-serif', MONO = 'ui-monospace, Menlo, monospace', robotH = 1.15, robotCm = 14, post = [-1.25, -0.5], postTurn = 0.25 }) {
  const group = new THREE.Group();
  const ink = new THREE.MeshStandardMaterial({ color: PAL.ink, roughness: 0.55 });
  const blue = new THREE.MeshPhysicalMaterial({ color: PAL.side, roughness: 0.4, clearcoat: 0.6, clearcoatRoughness: 0.22 });
  const brass = new THREE.MeshStandardMaterial({ color: BRASS, roughness: 0.3, metalness: 1 });
  const yellow = new THREE.MeshPhysicalMaterial({ color: PAL.accent, roughness: 0.35, clearcoat: 0.7, clearcoatRoughness: 0.2 });
  const rule = new THREE.MeshPhysicalMaterial({ color: PAL.ink, roughness: 0.45, clearcoat: 0.3, clearcoatRoughness: 0.4 });
  const POST = new THREE.Vector3(post[0], 0, post[1]), TURN = postTurn, CM = robotH / robotCm;
  const GAP = PH - 0.062, PLAT = PH - 0.052;                      // the drum ends at GAP, the turntable on top starts at PLAT

  // ink parts as one mesh: the base of the plinth and the dark core that shows in its shadow gaps, the ruler ring on the floor, the foot of the measuring post
  {
    // the base stands on a foot set in from its edge, so a line of shadow runs between it and the floor
    const base = lathe(THREE, [[0.95, 0], [1.004, 0, 0.003, 2], [1.004, 0.011], [1.045, 0.011, 0.005, 3], [1.045, 0.05, 0.0025, 2], [1.03, 0.063, 0.0025, 2], [0.972, 0.069, 0.003, 2], [0.93, 0.069], [0.93, PLAT + 0.002], [0.9, PLAT + 0.002]], 128);
    const flat = (g) => g.rotateX(-Math.PI / 2).translate(0, 0.003, 0);
    const parts = [base, flat(new THREE.RingGeometry(1.246, 1.254, 160)), flat(new THREE.RingGeometry(1.2185, 1.2215, 160))];
    for (let i = 0; i < 180; i++) {                       // a fine tick every 2 degrees, longer every 10 and every 30
      const big = i % 15 === 0, mid = i % 5 === 0, len = big ? 0.115 : mid ? 0.07 : 0.036, w = big ? 0.011 : mid ? 0.008 : 0.0058, a = i / 180 * TAU;
      if (Math.hypot(-Math.sin(a) * 1.3 - POST.x, Math.cos(a) * 1.3 - POST.z) < 0.2) continue;                       // leave room for the foot of the post
      parts.push(new THREE.PlaneGeometry(w, len).rotateX(-Math.PI / 2).translate(0, 0.003, 1.25 + len / 2).rotateY(-a));
    }
    parts.push(lathe(THREE, [[0.06, 0], [0.135, 0, 0.008], [0.135, 0.022, 0.01], [0.09, 0.04, 0.01], [0.0, 0.04]], 48).translate(POST.x, 0, POST.z));
    group.add(shadows(new THREE.Mesh(merge(THREE, parts), ink)));
  }
  // brass: a satin band between the base and the drum, a fine ring let into the top of the turntable, and a pin that marks its centre
  {
    const band = lathe(THREE, [[0.93, 0.0695], [0.966, 0.0695, 0.005, 3], [0.966, 0.093, 0.005, 3], [0.93, 0.093]], 128);
    const inlay = lathe(THREE, [[0.866, PH - 0.001], [0.866, PH + 0.0012, 0.0006, 2], [0.854, PH + 0.0012, 0.0006, 2], [0.854, PH - 0.001]], 128);
    const pin = lathe(THREE, [[0.034, PH - 0.001], [0.034, PH + 0.0015, 0.001, 2], [0.029, PH + 0.003, 0.001, 2], [0, PH + 0.003]], 32);
    group.add(shadows(new THREE.Mesh(merge(THREE, [band, inlay, pin]), brass), false));
  }
  // the drum and the turntable, two parts with a shadow gap between them. Each steps in a little where a band is laid on: the lettering on the drum, the grip on the turntable.
  const TXT0 = 0.1235, TXT1 = GAP - 0.0245, GRIP0 = PLAT + 0.0062, GRIP1 = PH - 0.0162;
  {
    const drum = lathe(THREE, [[0.92, 0.099], [0.95, 0.099, 0.004, 3], [0.95, TXT0 - 0.002, 0.0012, 2], [0.9465, TXT0], [0.94, TXT0], [0.94, TXT1], [0.9465, TXT1], [0.95, TXT1 + 0.002, 0.0012, 2], [0.95, GAP, 0.003, 3], [0.92, GAP]], 128);
    const table = lathe(THREE, [[0.92, PLAT], [0.95, PLAT, 0.003, 3], [0.95, GRIP0 - 0.0006, 0.0008, 2], [0.947, GRIP0], [0.94, GRIP0], [0.94, GRIP1], [0.947, GRIP1], [0.95, GRIP1 + 0.0006, 0.0008, 2], [0.95, PH - 0.009, 0.002, 2], [0.941, PH, 0.002, 2], [0.925, PH]], 128);
    group.add(shadows(new THREE.Mesh(merge(THREE, [drum, table]), blue)));
  }

  // The two bands share one picture, repeated four times round, so the lettering reads from any side.
  // Its lower three quarters are the lettering, cut in and filled with paper white between two hairlines. Its top quarter is a fine diamond grip.
  {
    const CW = 2048, CH = 256, art = makeCanvas(THREE, CW, CH), dent = makeCanvas(THREE, CW, CH, false), hex = new THREE.Color(PAL.side).getHex();
    art.k.fillStyle = PAL.side; art.k.fillRect(0, 0, CW, CH); dent.k.fillStyle = '#ffffff'; dent.k.fillRect(0, 0, CW, CH);
    // the grip: small pyramids between two sets of slanted grooves, drawn once as a tile
    const tileA = document.createElement('canvas'), tileD = document.createElement('canvas'); tileA.width = tileD.width = 16; tileA.height = tileD.height = 32;
    const ka = tileA.getContext('2d'), kd = tileD.getContext('2d'), ia = ka.createImageData(16, 32), id = kd.createImageData(16, 32), tri = (t) => 1 - Math.abs(2 * (t - Math.floor(t)) - 1);
    for (let y = 0; y < 32; y++) for (let x = 0; x < 16; x++) {
      const h = Math.min(tri((x + y / 2) / 16), tri((x - y / 2) / 16)), o = (y * 16 + x) * 4, tone = 0.66 + 0.4 * h, g = Math.round(255 * h);
      ia.data[o] = Math.min(255, (hex >> 16 & 255) * tone); ia.data[o + 1] = Math.min(255, (hex >> 8 & 255) * tone); ia.data[o + 2] = Math.min(255, (hex & 255) * tone); ia.data[o + 3] = 255;
      id.data[o] = id.data[o + 1] = id.data[o + 2] = g; id.data[o + 3] = 255;
    }
    ka.putImageData(ia, 0, 0); kd.putImageData(id, 0, 0);
    art.k.fillStyle = art.k.createPattern(tileA, 'repeat'); art.k.fillRect(0, 0, CW, 64); dent.k.fillStyle = dent.k.createPattern(tileD, 'repeat'); dent.k.fillRect(0, 0, CW, 64);
    // the lettering, set letter by letter so the spacing is the same in every browser, then squeezed to fit once round the canvas
    const line = `MOSEY  ·  FIRST EDITION  ·  ${robotCm} CM TALL  ·  `, track = 20;
    for (const [k, fg, alpha] of [[art.k, PAL.paper, 0.8], [dent.k, '#000000', 1]]) {
      k.font = `600 86px ${MONO}`; k.textBaseline = 'middle'; k.textAlign = 'left'; k.fillStyle = fg;
      const wide = [...line].reduce((n, ch) => n + k.measureText(ch).width + track, 0);
      k.save(); k.scale(CW / wide, 1); k.globalAlpha = alpha; let x = track / 2; for (const ch of line) { k.fillText(ch, x, 164); x += k.measureText(ch).width + track; } k.restore();
      k.globalAlpha = alpha * 0.55; k.fillRect(0, 64 + 17, CW, 3); k.fillRect(0, CH - 20, CW, 3); k.globalAlpha = 1;
    }
    for (const t of [art.tex, dent.tex]) { t.wrapS = THREE.RepeatWrapping; t.repeat.x = 4; t.offset.x = 0.5; }
    const strip = (r, y0, y1, v0, v1) => { const g = new THREE.LatheGeometry([new THREE.Vector2(r, y0), new THREE.Vector2(r, y1)], 128), uv = g.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setY(i, uv.getY(i) > 0.5 ? v1 : v0); return g; };
    const bands = new THREE.Mesh(merge(THREE, [strip(0.9462, TXT0 - 0.0004, TXT1 + 0.0004, 0.008, 0.742), strip(0.9492, GRIP0 - 0.0003, GRIP1 + 0.0003, 0.758, 0.992)]),
      new THREE.MeshPhysicalMaterial({ map: art.tex, bumpMap: dent.tex, bumpScale: 0.8, roughness: 0.4, clearcoat: 0.6, clearcoatRoughness: 0.22 }));
    group.add(shadows(bands, false));
  }

  // the top of the turntable: a spun finish with a few fine rings cut into it. The pattern runs from the edge to the middle of a tiny texture.
  {
    const bump = makeCanvas(THREE, 4, 1024, false), tone = makeCanvas(THREE, 4, 1024), RT = 0.925;
    const cuts = [[0.9, 0.003], [0.8725, 0.0028], [0.8475, 0.0028], [0.14, 0.0028], [0.052, 0.0028]];      // [radius, half the width] of each ring
    for (let y = 0; y < 1024; y++) {
      const r = y / 1023 * RT, spun = r > 0.16 && r < 0.83 ? ((y * 7919) % 13) / 12 : 0;                 // row 1023 is the edge, row 0 the middle
      let cut = 1; for (const [at, w] of cuts) cut = Math.min(cut, clamp01(Math.abs(r - at) / w));
      const b = Math.round(255 * (0.3 + 0.7 * cut) * (1 - 0.12 * spun)), t = Math.round(255 * (0.6 + 0.4 * cut) * (1 - 0.04 * spun));
      bump.k.fillStyle = `rgb(${b},${b},${b})`; bump.k.fillRect(0, y, 4, 1);
      tone.k.fillStyle = `rgb(${t},${t},${t})`; tone.k.fillRect(0, y, 4, 1);
    }
    const top = new THREE.Mesh(new THREE.LatheGeometry([new THREE.Vector2(RT, PH), new THREE.Vector2(0, PH)], 128),
      new THREE.MeshPhysicalMaterial({ color: PAL.face, map: tone.tex, bumpMap: bump.tex, bumpScale: 0.4, roughness: 0.36, clearcoat: 0.45, clearcoatRoughness: 0.3 }));
    group.add(shadows(top, false));
  }

  // the numbers of the ruler ring, every 30 degrees, 0 at the front. All of them stand the same way up, so from the front none reads upside down.
  {
    const { k, tex } = makeCanvas(THREE, 1024, 256), pos = [], nor = [], uv = [], idx = [], R = 1.485, w = 0.184, h = 0.138;
    k.fillStyle = PAL.ink; k.globalAlpha = 0.9; k.textAlign = 'center'; k.textBaseline = 'middle'; k.font = `700 72px ${MONO}`;
    for (let i = 0; i < 12; i++) {
      const col = i % 6, row = Math.floor(i / 6); k.fillText(String(i * 30), (col + 0.5) * 1024 / 6, row * 128 + 68);
      const a = i / 12 * TAU, dx = -Math.sin(a), dz = Math.cos(a), ux = 0, uz = -1, rx = 1, rz = 0, u0 = col / 6, u1 = (col + 1) / 6, v1 = 1 - row / 2, v0 = v1 - 0.5;
      for (const [sx, sy, u, v] of [[-1, -1, u0, v0], [1, -1, u1, v0], [1, 1, u1, v1], [-1, 1, u0, v1]]) { pos.push(dx * R + rx * sx * w / 2 + ux * sy * h / 2, 0.004, dz * R + rz * sx * w / 2 + uz * sy * h / 2); nor.push(0, 1, 0); uv.push(u, v); }
      idx.push(i * 4, i * 4 + 1, i * 4 + 2, i * 4, i * 4 + 2, i * 4 + 3);
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx);
    const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({ map: tex, transparent: true, depthWrite: false, roughness: 0.6, side: THREE.DoubleSide, forceSinglePass: true, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }));
    m.receiveShadow = true; group.add(m);
  }

  // the measuring post: an ink ruler with paper marks that starts counting at the top of the plinth, where the robot stands
  {
    const post = new THREE.Group(); post.position.copy(POST); post.rotation.y = TURN; group.add(post);
    const BW = 0.12, BT = 0.02, top = PH + (robotCm + 2.6) * CM, y0 = 0.03;
    const blade = shadows(new THREE.Mesh(slab(THREE, roundRect(THREE, BW, BT, 0.007), top - y0, 0.005, 4).rotateX(-Math.PI / 2).translate(0, y0, 0), rule)); post.add(blade);
    // the scale, drawn on the face of the ruler: a tick every half centimetre, a number every five
    const sw = BW - 0.012, s0 = PH - 0.03, sh = top - 0.012 - s0, cv = makeCanvas(THREE, 80, 1024), k = cv.k, px = 80 / sw, Y = (y) => (1 - (y - s0) / sh) * 1024;
    k.fillStyle = PAL.paper; k.textBaseline = 'middle'; k.textAlign = 'left'; k.font = `700 27px ${MONO}`;
    for (let n = 0; n <= (robotCm + 2) * 2; n++) {
      const y = Y(PH + n * CM / 2), len = n % 10 === 0 ? 0.052 : n % 2 === 0 ? 0.034 : 0.02;
      k.fillRect(0, y - (n % 10 === 0 ? 2 : 1.3), len * px, n % 10 === 0 ? 4 : 2.6);
      if (n % 10 === 0 && Math.abs(n / 2 - robotCm) > 2) k.fillText(String(n / 2), 0.058 * px, y - 17);
    }
    const face = new THREE.Mesh(new THREE.PlaneGeometry(sw, sh).translate(0, s0 + sh / 2, BT / 2 + 0.0012), new THREE.MeshStandardMaterial({ map: cv.tex, transparent: true, depthWrite: false, roughness: 0.6 }));
    face.receiveShadow = true; post.add(face);
    // the marker: a yellow clip on the ruler at the robot's height, with a flag that points at it
    const MY = PH + robotH;
    const clip = slab(THREE, roundRect(THREE, BW + 0.04, 0.062, 0.016), BT + 0.03, 0.006).translate(0, MY, -(BT + 0.03) / 2);
    const flag = slab(THREE, roundPoly(THREE, [[0.05, -0.068, 0.02], [0.4, -0.068, 0.02], [0.47, 0, 0.012], [0.4, 0.068, 0.02], [0.05, 0.068, 0.02]]), 0.018, 0.005).translate(0, MY, 0.004);
    post.add(shadows(new THREE.Mesh(merge(THREE, [clip, flag]), yellow)));
    const tag = makeCanvas(THREE, 384, 128), t = tag.k, label = `${robotCm} CM`;
    t.fillStyle = PAL.onAccent; t.textAlign = 'center'; t.textBaseline = 'middle'; t.font = `104px ${DISPLAY}`;
    const tw = t.measureText(label).width; t.save(); t.translate(192, 70); t.scale(Math.min(1, 360 / tw), 1); t.fillText(label, 0, 0); t.restore();
    const text = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.1).translate(0.245, MY, 0.004 + 0.018 + 0.0012), new THREE.MeshStandardMaterial({ map: tag.tex, transparent: true, depthWrite: false, roughness: 0.5 }));
    post.add(text);
  }
  return { group };
}

/* ---------- the RESERVE button ---------- */

export function createCtaButton({ THREE, PAL, DISPLAY, MONO, lights = 36 }) {
  const group = new THREE.Group();
  const ink = new THREE.MeshPhysicalMaterial({ color: PAL.ink, roughness: 0.5, clearcoat: 0.25, clearcoatRoughness: 0.5 });      // satin black
  const brass = new THREE.MeshStandardMaterial({ color: BRASS, roughness: 0.36, metalness: 1 });                                  // satin, not polished
  const n = lights, RL = 2.189, FLOOR = 0.284;                      // the lights sit in a channel cut into the top of the collar. FLOOR is its floor.

  // the base: a collar on a foot set in from its edge, a band of fine ribs, a smooth chamfered top with the light channel in it, and a well in the middle that the cap sinks into
  {
    const collar = lathe(THREE, [[2.2, 0], [2.362, 0, 0.004, 2], [2.362, 0.013], [2.4, 0.013, 0.006, 3], [2.4, 0.058, 0.003, 2], [2.384, 0.074, 0.003, 2], [2.368, 0.078, 0.002, 2], [2.312, 0.222, 0.002, 2], [2.332, 0.226, 0.002, 2], [2.332, 0.272, 0.003, 2],
      [2.306, 0.3, 0.003, 2], [2.262, 0.3, 0.002, 2], [2.25, FLOOR, 0.002, 2], [2.04, FLOOR, 0.003, 2], [2.04, 0.27]], 128);
    const grip = fluted(THREE, { r0: 2.369, y0: 0.08, r1: 2.3135, y1: 0.22, ribs: 200, depth: 0.013, wave: [1, 0.35, 0, 0.35] });
    group.add(shadows(new THREE.Mesh(merge(THREE, [collar, grip]), ink)));
    // the well: a matte black wall and floor, so the gap round the cap stays dark
    const wall = new THREE.LatheGeometry([new THREE.Vector2(2.034, FLOOR - 0.002), new THREE.Vector2(2.034, 0.004), new THREE.Vector2(1.5, 0.004)], 96);
    group.add(shadows(new THREE.Mesh(wall, new THREE.MeshStandardMaterial({ color: '#060607', roughness: 1 })), false));
    // brass: a lip round the well, and a small socket for each light
    const lip = lathe(THREE, [[2.13, FLOOR - 0.002], [2.13, 0.311, 0.003, 2], [2.118, 0.322, 0.003, 2], [2.05, 0.327, 0.004, 3], [2.026, 0.312, 0.004, 3], [2.026, 0.28]], 128);
    const parts = [lip], socket = [[0.054, 0], [0.054, 0.0065], [0.0505, 0.0105], [0.047, 0.0105], [0.044, 0.004]].map(([r, y]) => new THREE.Vector2(r, y));
    for (let i = 0; i < n; i++) { const a = i / n * TAU; parts.push(new THREE.LatheGeometry(socket, 14).translate(Math.sin(a) * RL, FLOOR, Math.cos(a) * RL)); }
    group.add(shadows(new THREE.Mesh(merge(THREE, parts), brass), false));
  }

  // the cap: deep yellow lacquer, a straight skirt, a round shoulder and a shallow dome. The words are printed under the lacquer.
  const R = 1.95, TOP = 1.69, dome = (r) => 0.25 - 0.016 * (r / TOP) ** 2;
  const side = (y) => 1.925 - 0.047 * (y + 0.115) / 0.353;                      // the wall of the cap leans in a little on its way up
  const corners = [[1.5, -0.52], [R, -0.52, 0.008, 2], [R, -0.14, 0.014, 3], [1.925, -0.115, 0.012, 3], [side(-0.04), -0.04, 0.004, 2], [side(-0.028) - 0.014, -0.028, 0.004, 2], [side(-0.016), -0.016, 0.004, 2], [1.878, dome(TOP) + 0.004, 0.19, 10]];
  for (const r of [1.25, 1.0, 0.75, 0.5, 0.25, 0]) corners.push([r, dome(r)]);
  const capG = new THREE.LatheGeometry(profile(THREE, corners, 8), 128);
  { const p = capG.attributes.position, uv = capG.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, 0.5 + p.getX(i) / (2 * R), 0.5 - p.getZ(i) / (2 * R)); }      // print straight down on it: the baseline of the words faces +z
  const print = makeCanvas(THREE, 2048, 2048), press3d = makeCanvas(THREE, 1024, 1024, false);
  // one drawing, used twice: once in colour for the print, once in grey to press the letters a little into the cap. S is the size of the canvas.
  function label(k, S, bg, fg, pillText, soft) {
    const U = S / (2 * R), px = S / 1024;
    k.fillStyle = bg; k.fillRect(0, 0, S, S); if (soft) k.filter = `blur(${1.6 * px}px)`;
    k.fillStyle = fg; k.strokeStyle = fg; k.textAlign = 'center'; k.textBaseline = 'alphabetic';
    k.font = `${200 * px}px ${DISPLAY}`; const m = k.measureText('RESERVE'), tw = 2.62 * U, th = 0.84 * U;            // tall letters, because the camera looks across the cap
    k.save(); k.translate(S / 2, S / 2 + 0.13 * U); k.scale(tw / m.width, th / (m.actualBoundingBoxAscent || 140 * px)); k.fillText('RESERVE', 0, 0); k.restore();
    // the price in a pill under it, with an arrow
    const pw = 1.98 * U, ph = 0.4 * U, py = S / 2 + 0.36 * U; k.beginPath(); k.roundRect(S / 2 - pw / 2, py, pw, ph, ph / 2); k.fill();
    k.fillStyle = pillText; k.strokeStyle = pillText; k.font = `600 ${46 * px}px ${MONO}`; try { k.letterSpacing = `${3 * px}px`; } catch (e) { /* fine without */ }
    const line = 'MOSEY · $149', lw = k.measureText(line).width, ax = 0.3 * U, x0 = S / 2 - (lw + 0.12 * U + ax) / 2;
    k.textAlign = 'left'; k.save(); k.translate(x0, py + ph / 2); k.scale(1, 1.5); k.textBaseline = 'middle'; k.fillText(line, 0, 2 * px); k.restore();
    try { k.letterSpacing = '0px'; } catch (e) { /* fine without */ }
    const a0 = x0 + lw + 0.12 * U, a1 = a0 + ax, ay = py + ph / 2; k.lineWidth = 0.05 * U; k.lineCap = 'round'; k.lineJoin = 'round';
    k.beginPath(); k.moveTo(a0, ay); k.lineTo(a1, ay); k.moveTo(a1 - 0.085 * U, ay - 0.115 * U); k.lineTo(a1, ay); k.lineTo(a1 - 0.085 * U, ay + 0.115 * U); k.stroke();
    // two fine printed rings where the dome meets the shoulder, one a hairline
    k.strokeStyle = fg; k.lineWidth = 0.014 * U; k.beginPath(); k.arc(S / 2, S / 2, 1.6 * U, 0, TAU); k.stroke();
    k.lineWidth = 0.005 * U; k.beginPath(); k.arc(S / 2, S / 2, 1.635 * U, 0, TAU); k.stroke();
    k.filter = 'none';
  }
  label(print.k, 2048, PAL.accent, PAL.onAccent, PAL.accent, false);
  label(press3d.k, 1024, '#ffffff', '#000000', '#9a9a9a', true);
  // a soft base under a sharp clear coat reads as deep lacquer. The coat is very slightly wavy, so its highlights are not ruler straight.
  const peel = peelMap(THREE); peel.repeat.set(5, 5);
  const cap = shadows(new THREE.Mesh(capG, new THREE.MeshPhysicalMaterial({ color: '#e2d2b4', map: print.tex, bumpMap: press3d.tex, bumpScale: 2.5, roughness: 0.42, clearcoat: 1, clearcoatRoughness: 0.035,
    clearcoatNormalMap: peel, clearcoatNormalScale: new THREE.Vector2(0.04, 0.04), emissive: PAL.accent, emissiveMap: print.tex, emissiveIntensity: 0.1 })));
  cap.position.y = 0.55; group.add(cap);

  // small lenses, one in each socket. One mesh, a colour per light. Each lens is brightest at its crown and darker at its rim.
  const lensG = new THREE.SphereGeometry(0.044, 12, 6, 0, TAU, 0, Math.PI / 2).scale(1, 0.62, 1);
  { const p = lensG.attributes.position, col = []; for (let i = 0; i < p.count; i++) { const v = 0.5 + 0.5 * Math.pow(clamp01(p.getY(i) / 0.0273), 1.5); col.push(v, v, v); } lensG.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); }
  const leds = new THREE.InstancedMesh(lensG, new THREE.MeshBasicMaterial({ color: '#ffffff', vertexColors: true, toneMapped: false }), n);
  const mx = new THREE.Matrix4();
  for (let i = 0; i < n; i++) { const a = i / n * TAU; mx.makeTranslation(Math.sin(a) * RL, FLOOR + 0.003, Math.cos(a) * RL); leds.setMatrixAt(i, mx); }
  leds.frustumCulled = false; group.add(leds);

  // a soft pool of light on the floor round the base. It adds light and fades to nothing at its edge.
  const poolG = new THREE.RingGeometry(2.3, 3.7, 96, 7).rotateX(-Math.PI / 2).translate(0, 0.012, 0);
  { const p = poolG.attributes.position, col = [], warm = new THREE.Color(PAL.accent), cool = new THREE.Color(PAL.face), c = new THREE.Color();
    for (let i = 0; i < p.count; i++) { const d = clamp01((Math.hypot(p.getX(i), p.getZ(i)) - 2.36) / 1.34), v = Math.pow(1 - d, 2.2); c.copy(warm).lerp(cool, clamp01(d * 2.2)).multiplyScalar(v); col.push(c.r, c.g, c.b); }
    poolG.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); }
  const pool = new THREE.Mesh(poolG, new THREE.MeshBasicMaterial({ color: '#ffffff', vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, fog: false }));
  pool.renderOrder = 1; group.add(pool);

  // three points of light chase each other round the collar. A press turns everything up.
  const cLow = new THREE.Color(PAL.accent).multiplyScalar(0.2), cOn = new THREE.Color(PAL.accent), cHot = cOn.clone().lerp(new THREE.Color('#ffffff'), 0.8), c = new THREE.Color();
  function update(T, press = 0) {
    press = clamp01(press);
    for (let i = 0; i < n; i++) {
      const x = (((i / n * 3 - T * 0.32) % 1) + 1) % 1, tail = Math.pow(x, 2.6), v = clamp01(tail + press * (0.75 + 0.25 * Math.sin(T * 14 + i * 2.4)));
      if (v < 0.6) c.copy(cLow).lerp(cOn, v / 0.6); else c.copy(cOn).lerp(cHot, (v - 0.6) / 0.4);
      leds.setColorAt(i, c);
    }
    leds.instanceColor.needsUpdate = true;
    pool.material.color.setScalar(0.3 + 0.05 * Math.sin(T * 1.6) + 0.6 * press);
    cap.material.emissiveIntensity = 0.1 + 0.28 * press;                      // a little of its own light keeps the yellow rich in the shade
  }
  update(0, 0);
  return { group, cap, update };
}

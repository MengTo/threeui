// Mosey's home, built at its own scale. The robot is 1.15 tall here, so 1 unit is about 12 cm:
// a sofa is a building, a sock is a landmark. Every shape is made in code and every texture is drawn on a canvas.
//   createHome({ THREE, RoundedBoxGeometry, PAL, SX, Z })  ->  { group, keyObj, catBody, update(T) }
// The path it walks (x within SX ± 0.6, up to y 1.3) stays empty from the sock to the stove.
import { mergeGeometries, mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js';

export function createHome({ THREE, RoundedBoxGeometry, PAL, SX, Z }) {
  const group = new THREE.Group();
  const V3 = (x = 0, y = 0, z = 0) => new THREE.Vector3(x, y, z), V2 = (x, y) => new THREE.Vector2(x, y);
  const lerp = THREE.MathUtils.lerp, clamp = THREE.MathUtils.clamp, smooth = THREE.MathUtils.smoothstep, PI = Math.PI;
  let seed = 23; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const rr = (a, b) => a + (b - a) * rnd();
  const hash = (i, j) => { const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return s - Math.floor(s); };
  const wob = (x, y, z) => Math.sin(x * 1.7 + Math.sin(z * 1.3) * 1.2) * 0.5 + Math.sin(y * 2.3 + Math.sin(x * 1.9) * 1.1) * 0.3 + Math.sin(z * 2.9 + y * 1.3) * 0.2;
  const live = [];                                             // small things that move: each is a function of the clock

  /* ---------- canvases and textures ---------- */
  const canvas = (w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h; return c; };
  const texOf = (c, { srgb = true, rep = [1, 1] } = {}) => { const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(rep[0], rep[1]); t.anisotropy = 8; if (srgb) t.colorSpace = THREE.SRGBColorSpace; return t; };
  const again = (t, u, v) => { const c = t.clone(); c.repeat.set(u, v); c.needsUpdate = true; return c; };      // the same picture at another size
  // fill a canvas one pixel at a time: fn gives 0..1. As a mask the value goes to the alpha instead.
  const paint = (w, h, fn, mask = false) => {
    const c = canvas(w, h), k = c.getContext('2d'), img = k.createImageData(w, h), d = img.data;
    for (let y = 0, i = 0; y < h; y++) for (let x = 0; x < w; x++, i += 4) { const v = clamp(fn(x, y), 0, 1) * 255; if (mask) { d[i] = d[i + 1] = d[i + 2] = 255; d[i + 3] = v; } else { d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; } }
    k.putImageData(img, 0, 0); return c;
  };
  // turn a grey height picture into a normal map. It wraps round, so it tiles.
  const normalFrom = (src, strength = 2) => {
    const w = src.width, h = src.height, a = src.getContext('2d').getImageData(0, 0, w, h).data;
    const out = canvas(w, h), ko = out.getContext('2d'), img = ko.createImageData(w, h), d = img.data;
    const H = (x, y) => a[(((y + h) % h) * w + ((x + w) % w)) * 4] / 255;
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const dx = (H(x + 1, y) - H(x - 1, y)) * strength, dy = (H(x, y + 1) - H(x, y - 1)) * strength, l = 1 / Math.sqrt(dx * dx + dy * dy + 1), i = (y * w + x) * 4;
      d[i] = (-dx * l * 0.5 + 0.5) * 255; d[i + 1] = (dy * l * 0.5 + 0.5) * 255; d[i + 2] = (l * 0.5 + 0.5) * 255; d[i + 3] = 255;
    }
    ko.putImageData(img, 0, 0); return out;
  };
  // many thin strokes on a canvas, each drawn again across the edges so the picture tiles
  const strokes = (c, n, draw) => { const k = c.getContext('2d'), w = c.width, h = c.height; for (let i = 0; i < n; i++) { const x = rnd() * w, y = rnd() * h, s = rnd(), t = rnd(); for (const ox of [0, -w]) for (const oy of [0, -h]) draw(k, x + ox, y + oy, s, t); } };

  // woven cloth: threads going over and under each other, 32 to a tile
  const weaveH = paint(512, 512, (x, y) => { const cx = x / 16, cy = y / 16, i = Math.floor(cx), j = Math.floor(cy), fx = cx - i, fy = cy - j, over = (i + j) & 1; return Math.pow(Math.sin(PI * (over ? fx : fy)), 0.7) * (0.55 + 0.45 * Math.sin(PI * (over ? fy : fx))) * (0.8 + 0.2 * hash(i, j)); });
  const weaveN = texOf(normalFrom(weaveH, 2.4), { srgb: false });
  const heather = texOf(paint(256, 256, (x, y) => { const i = x >> 3, j = y >> 3; return 0.8 + 0.2 * ((i + j) & 1 ? hash(i, Math.floor(j / 3)) : hash(Math.floor(i / 3), j)); }));      // threads a little lighter and darker
  // knitting: rows of little V stitches
  const knitH = paint(256, 256, (x, y) => { const fx = (x % 32) / 32, fy = (y % 32) / 32, d = Math.abs(Math.abs(fx - 0.5) - 0.42 * (1 - fy)); return Math.pow(Math.max(0, 1 - d / 0.17), 0.8); });
  const knitN = texOf(normalFrom(knitH, 3), { srgb: false });
  const knitC = texOf(paint(256, 256, (x, y) => { const fx = (x % 32) / 32, fy = (y % 32) / 32, d = Math.abs(Math.abs(fx - 0.5) - 0.42 * (1 - fy)); return 0.84 + 0.16 * Math.max(0, 1 - d / 0.2); }));
  // oak: long grain lines and a few pores, running up the picture
  const woodC = (() => {
    const c = canvas(512, 512), k = c.getContext('2d'); k.fillStyle = '#eadfcb'; k.fillRect(0, 0, 512, 512);
    strokes(c, 420, (k, x, y, s, t) => { k.strokeStyle = `rgba(${120 + s * 40 | 0},${84 + s * 30 | 0},${50 + s * 20 | 0},${0.03 + t * 0.1})`; k.lineWidth = 0.5 + s * 1.6; const f = (1 + Math.floor(t * 3)) * PI * 2 / 512, amp = 1 + s * 4; k.beginPath(); for (let v = -512; v <= 1024; v += 16) k.lineTo(x + Math.sin(v * f + s * 9) * amp, v); k.stroke(); });
    strokes(c, 700, (k, x, y, s, t) => { k.fillStyle = `rgba(100,66,36,${0.08 + t * 0.14})`; k.fillRect(x, y, 1, 3 + s * 9); });
    return texOf(c);
  })();
  // a soft round shadow, and a soft-edged rectangle, to sit things on the floor
  const blobT = texOf(paint(128, 128, (x, y) => { const r = Math.hypot(x - 63.5, y - 63.5) / 64; return Math.pow(Math.max(0, 1 - r), 1.6); }, true));
  const softRectT = texOf(paint(256, 128, (x, y) => { const u = Math.abs(x - 127.5) / 128, v = Math.abs(y - 63.5) / 64; return smooth(1 - u, 0, 0.22) * smooth(1 - v, 0, 0.42); }, true));

  /* ---------- materials ---------- */
  const cloth = (color, o = {}) => new THREE.MeshPhysicalMaterial({ color, map: heather, normalMap: weaveN, normalScale: V2(0.85, 0.85), roughness: 0.96, sheen: 0.5, sheenRoughness: 0.55, sheenColor: new THREE.Color(color).lerp(new THREE.Color('#ffffff'), 0.4), ...o });
  const wood = (color, { rep = null, ...o } = {}) => new THREE.MeshStandardMaterial({ color, map: rep ? again(woodC, rep[0], rep[1]) : woodC, roughness: 0.55, ...o });
  const metal = (color, roughness = 0.3, o = {}) => new THREE.MeshStandardMaterial({ color, metalness: 0.92, roughness, envMapIntensity: 2.4, ...o });
  const brass = metal('#c9a24c', 0.3), steel = metal('#c9cdd2', 0.26);
  const painted = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.55 });          // one material for small painted and plastic things, coloured per piece
  const tint = (geo, hex) => { const c = new THREE.Color(hex), n = geo.attributes.position.count, a = new Float32Array(n * 3); for (let i = 0; i < n; i++) { a[i * 3] = c.r; a[i * 3 + 1] = c.g; a[i * 3 + 2] = c.b; } geo.setAttribute('color', new THREE.BufferAttribute(a, 3)); return geo; };

  /* ---------- shape makers ---------- */
  const add = (geo, mat, { cast = true, receive = true, parent = group } = {}) => { const m = new THREE.Mesh(geo, mat); m.castShadow = cast; m.receiveShadow = receive; parent.add(m); return m; };
  const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler();
  // move a geometry to its place for good: turn it, then shift it
  const put = (geo, x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, s = 1) => geo.applyMatrix4(_m.compose(V3(x, y, z), _q.setFromEuler(_e.set(rx, ry, rz)), V3(s, s, s)));
  // many geometries as one mesh. keep says which attributes stay.
  const merge = (list, keep = ['position', 'normal', 'uv']) => {
    const flat = list.some((g) => !g.index);
    return mergeGeometries(list.map((g) => { const o = flat && g.index ? g.toNonIndexed() : g; for (const k of Object.keys(o.attributes)) if (!keep.includes(k)) o.deleteAttribute(k); return o; }));
  };
  const mergeTinted = (list) => merge(list, ['position', 'normal', 'uv', 'color']);
  // texture coordinates in world units, picked per triangle from the side it faces. Cloth and grain keep one scale everywhere.
  const boxUV = (geo, s = 1) => {
    const g = geo.index ? geo.toNonIndexed() : geo, p = g.attributes.position, uv = new Float32Array(p.count * 2), v = [V3(), V3(), V3()], e1 = V3(), e2 = V3();
    for (let i = 0; i < p.count; i += 3) {
      for (let j = 0; j < 3; j++) v[j].fromBufferAttribute(p, i + j);
      e1.subVectors(v[1], v[0]); e2.subVectors(v[2], v[0]); e1.cross(e2); const ax = Math.abs(e1.x), ay = Math.abs(e1.y), az = Math.abs(e1.z);
      for (let j = 0; j < 3; j++) { const k = (i + j) * 2, q = v[j]; if (ay >= ax && ay >= az) { uv[k] = q.x * s; uv[k + 1] = q.z * s; } else if (ax >= az) { uv[k] = q.z * s; uv[k + 1] = q.y * s; } else { uv[k] = q.x * s; uv[k + 1] = q.y * s; } }
    }
    g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); return g;
  };
  // a soft box: edges rounded in enough steps to look round, and faces that can puff out like a cushion
  // puff: 2 swells like a dome, 4 stays full almost to the seams. ao: how dark each side gets where it tucks in, as [x-, x+, y-, y+, z-, z+].
  function softBox(w, h, d, { r = 0.1, top = 0, bottom = 0, side = 0, front = 0, pinch = 0, flat = 5, c = 4, uv = 1, puff = 2, ao = null, aoR = 0.5 } = {}) {
    const half = [w / 2, h / 2, d / 2]; r = Math.min(r, half[0], half[1], half[2]);
    const big = Math.max(w, h, d), segs = half.map((a) => 2 * c + Math.max(1, Math.round(flat * 2 * a / big)));
    let g = new THREE.BoxGeometry(w, h, d, segs[0], segs[1], segs[2]); const p = g.attributes.position, q = [0, 0, 0], o = [0, 0, 0];
    const col = ao ? new Float32Array(p.count * 3) : null, full = (u) => 1 - Math.pow(Math.abs(u), puff);
    for (let i = 0; i < p.count; i++) {
      q[0] = p.getX(i); q[1] = p.getY(i); q[2] = p.getZ(i);
      for (let k = 0; k < 3; k++) {                                // crowd the steps into the corners, evenly round the bend
        const a = half[k], n = segs[k], j = Math.round((q[k] + a) / (2 * a) * n);
        q[k] = j <= c ? -a + r * (1 - Math.tan(PI / 4 * (1 - j / c))) : j >= n - c ? a - r * (1 - Math.tan(PI / 4 * (1 - (n - j) / c))) : lerp(-a + r, a - r, (j - c) / (n - 2 * c));
        o[k] = clamp(q[k], -a + r, a - r);
      }
      const l = Math.hypot(q[0] - o[0], q[1] - o[1], q[2] - o[2]);
      if (l > 1e-9) for (let k = 0; k < 3; k++) q[k] = o[k] + (q[k] - o[k]) / l * r;
      const ux = q[0] / half[0], uy = q[1] / half[1], uz = q[2] / half[2];
      if (col) { let k = 1; for (let a = 0; a < 3; a++) { k *= 1 - ao[a * 2] * (1 - smooth(half[a] + q[a], 0, aoR)); k *= 1 - ao[a * 2 + 1] * (1 - smooth(half[a] - q[a], 0, aoR)); } col[i * 3] = col[i * 3 + 1] = col[i * 3 + 2] = k; }
      q[1] += (uy > 0 ? top * uy : bottom * uy) * full(ux) * full(uz);
      q[0] += side * ux * full(uy) * full(uz); q[2] += front * uz * full(ux) * full(uy);
      if (pinch) { q[0] *= 1 - pinch * (1 - uy * uy); q[1] *= 1 - pinch * (1 - ux * ux); }      // a pillow: the sides pull in between the corners
      p.setXYZ(i, q[0], q[1], q[2]);
    }
    g.deleteAttribute('normal'); g.deleteAttribute('uv'); if (col) g.setAttribute('color', new THREE.BufferAttribute(col, 3));
    g = mergeVertices(g, 1e-4); g.computeVertexNormals();
    return boxUV(g, uv);
  }
  // a cord round a rounded rectangle lying flat at height y: piping, rims, pan supports
  const loop = (a, b, rc, y, r) => {
    rc = Math.min(rc, a, b); const sx = 2 * (a - rc), sz = 2 * (b - rc), q = PI / 2 * rc, per = 2 * (sx + sz) + 4 * q, ts = []; let s0 = 0;
    // eight stretches: a straight side, then a corner, four times round
    const parts = [[sz, a, -(b - rc), 0, 1], [q, a - rc, b - rc, 0], [sx, a - rc, b, -1, 0], [q, -(a - rc), b - rc, PI / 2], [sz, -a, b - rc, 0, -1], [q, -(a - rc), -(b - rc), PI], [sx, -(a - rc), -b, 1, 0], [q, a - rc, -(b - rc), PI * 1.5]];
    for (const p of parts) { const n = p.length === 4 ? 8 : 2; for (let i = 0; i < n; i++) ts.push((s0 + p[0] * i / n) / per); s0 += p[0]; } ts.push(1);
    const find = (t, P, Tn) => { let s = (((t % 1) + 1) % 1) * per; for (const p of parts) { if (s <= p[0] + 1e-9) { if (p.length === 4) { const th = p[3] + s / rc; if (P) P.set(p[1] + Math.cos(th) * rc, y, p[2] + Math.sin(th) * rc); if (Tn) Tn.set(-Math.sin(th), 0, Math.cos(th)); } else { if (P) P.set(p[1] + p[3] * s, y, p[2] + p[4] * s); if (Tn) Tn.set(p[3], 0, p[4]); } return; } s -= p[0]; } };
    return sweep({ getPointAt: (t, P) => find(t, P, null), getTangentAt: (t, Tn) => find(t, null, Tn) }, 0, 8, (t, k) => [Math.cos(k) * r, Math.sin(k) * r], { ts, closed: true, uv: [1, per * 2] });
  };
  const cord = (pts, r, seg = 48, sides = 6, closed = false) => new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((p) => p.isVector3 ? p : V3(p[0], p[1], p[2])), closed, 'centripetal'), seg, r, sides, closed);
  const lathe = (pts, seg = 32) => new THREE.LatheGeometry(pts.map(([r, y]) => V2(r, y)), seg);      // profile points go from the bottom up
  // a tube along a mostly level curve, whose cross section can change on the way: shape(t, a) gives [sideways, up]
  function sweep(curve, n, m, shape, { color = null, uv = [1, 1], span = [0, 1], ts = null, closed = false } = {}) {
    if (ts) n = ts.length - 1;
    const pos = [], uvs = [], col = [], idx = [], P = V3(), Tn = V3(), S = V3(), U = V3(), up = V3(0, 1, 0), c = new THREE.Color();
    for (let i = 0; i <= n; i++) {
      const t = ts ? ts[i] : lerp(span[0], span[1], i / n); curve.getPointAt(t, P); curve.getTangentAt(t, Tn); S.crossVectors(up, Tn); if (S.lengthSq() < 1e-6) S.set(1, 0, 0); S.normalize(); U.crossVectors(Tn, S).normalize();
      for (let j = 0; j <= m; j++) {
        const a = j / m * PI * 2, o = shape(t, a);
        pos.push(P.x + S.x * o[0] + U.x * o[1], P.y + S.y * o[0] + U.y * o[1], P.z + S.z * o[0] + U.z * o[1]); uvs.push(j / m * uv[0], t * uv[1]);
        if (color) { c.set(color(t, a)); col.push(c.r, c.g, c.b); }
      }
    }
    for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) { const a = i * (m + 1) + j, b = a + m + 1; idx.push(a, a + 1, b, a + 1, b + 1, b); }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    if (color) g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
    g.setIndex(idx); g.computeVertexNormals();
    const N = g.attributes.normal, v = V3();                     // the seam: both edges share one normal
    const share = (a, b) => { v.set(N.getX(a) + N.getX(b), N.getY(a) + N.getY(b), N.getZ(a) + N.getZ(b)).normalize(); N.setXYZ(a, v.x, v.y, v.z); N.setXYZ(b, v.x, v.y, v.z); };
    for (let i = 0; i <= n; i++) share(i * (m + 1), i * (m + 1) + m);
    if (closed) for (let j = 0; j <= m; j++) share(j, n * (m + 1) + j);                              // a loop: its first and last ring are the same ring
    return g;
  }
  // a sheet with some thickness laid over a surface: fn(u, v) gives the point. Blankets, slippers, magazines.
  // shade(u, v) gives 0..1 and darkens the cloth there: the inside of a fold.
  function sheet(nu, nv, fn, thick = 0.05, su = 1, sv = 1, shade = null) {
    const P = [], W = nu + 1, M = W * (nv + 1), pos = new Float32Array(M * 6), uv = new Float32Array(M * 4), idx = [], du = V3(), dv = V3(), n = V3(), col = shade ? new Float32Array(M * 6) : null;
    for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) P.push(fn(i / nu, j / nv));
    for (let j = 0; j <= nv; j++) for (let i = 0; i <= nu; i++) {
      const k = j * W + i; du.subVectors(P[j * W + Math.min(nu, i + 1)], P[j * W + Math.max(0, i - 1)]); dv.subVectors(P[Math.min(nv, j + 1) * W + i], P[Math.max(0, j - 1) * W + i]); n.crossVectors(du, dv).normalize().multiplyScalar(thick / 2);
      pos.set([P[k].x + n.x, P[k].y + n.y, P[k].z + n.z], k * 3); pos.set([P[k].x - n.x, P[k].y - n.y, P[k].z - n.z], (M + k) * 3);
      uv.set([i / nu * su, j / nv * sv], k * 2); uv.set([i / nu * su, j / nv * sv], (M + k) * 2);
      if (col) { const c = shade(i / nu, j / nv); col.fill(c, k * 3, k * 3 + 3); col.fill(c, (M + k) * 3, (M + k) * 3 + 3); }
    }
    for (let j = 0; j < nv; j++) for (let i = 0; i < nu; i++) { const a = j * W + i, b = a + 1, c = a + W, d = c + 1; idx.push(a, b, c, b, d, c, M + a, M + c, M + b, M + b, M + c, M + d); }
    const rim = []; for (let i = 0; i < nu; i++) rim.push(i); for (let j = 0; j < nv; j++) rim.push(j * W + nu); for (let i = nu; i > 0; i--) rim.push(nv * W + i); for (let j = nv; j > 0; j--) rim.push(j * W);
    rim.forEach((p, i) => { const q = rim[(i + 1) % rim.length]; idx.push(p, M + p, q, q, M + p, M + q); });
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.BufferAttribute(uv, 2)); if (col) g.setAttribute('color', new THREE.BufferAttribute(col, 3)); g.setIndex(idx); g.computeVertexNormals(); return g;
  }
  // soft shadows where things touch the floor: [x, z, width, depth, turn, strength]
  const blobs = [];
  const sit = (x, z, w, d = w, turn = 0, y = 0.012) => blobs.push([x, z, w, d, turn, y]);

  /* ---------- the sofa: 16 wide, legs 1.3 tall. Mosey is 1.15, so it walks right under ---------- */
  // a throw pillow: two faces sewn at a knife edge, fat in the middle, pulled in between its four corners. It comes with its piping.
  const pillowGeo = (s, T, uvs = 1.4, n = 22) => {
    const pos = [], uv = [], col = [], idx = [], W = n + 1, edge = [];
    const at = (a, b, sg) => {
      const e = (1 - a * a) * (1 - b * b), near = smooth(Math.abs(a * b), 0.5, 0.97), crease = Math.sin(Math.atan2(1 - Math.abs(b), 1 - Math.abs(a)) * 14);      // creases fan out from each corner
      return [a * s / 2 * (1 - 0.1 * (1 - b * b)), b * s / 2 * (1 - 0.1 * (1 - a * a)), sg * T * Math.pow(e, 0.4) * (1 + 0.07 * wob(a * 2.6 + sg, b * 2.6, sg * 3) + 0.12 * near * crease), 0.72 + 0.28 * Math.pow(e, 0.22) - 0.05 * near * (0.5 - 0.5 * crease)];
    };
    for (const sg of [1, -1]) {
      const o = pos.length / 3;
      for (let j = 0; j <= n; j++) for (let i = 0; i <= n; i++) { const a = i / n * 2 - 1, b = j / n * 2 - 1, q = at(a, b, sg); pos.push(q[0], q[1], q[2]); uv.push(q[0] * uvs, q[1] * uvs); col.push(q[3], q[3], q[3]); }
      for (let j = 0; j < n; j++) for (let i = 0; i < n; i++) { const k = o + j * W + i; if (sg > 0) idx.push(k, k + 1, k + W, k + 1, k + W + 1, k + W); else idx.push(k, k + W, k + 1, k + 1, k + W, k + W + 1); }
    }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3)); g.setIndex(idx); g.computeVertexNormals();
    for (let i = 0; i < 4; i++) for (let k = 0; k < 10; k++) { const t = k / 10 * 2 - 1, q = i === 0 ? at(t, -1, 1) : i === 1 ? at(1, t, 1) : i === 2 ? at(-t, 1, 1) : at(-1, -t, 1); edge.push(V3(q[0], q[1], 0)); }
    return [g, cord(edge, 0.036, 120, 6, true)];
  };
  {
    const X = SX, Zc = Z.sofa, parts = [], pipes = [];
    const fabric = cloth('#ac987e', { vertexColors: true }), welt = cloth('#8a765d');
    // one upholstered piece and the piping round its rim. rim 'y' runs round the top and bottom, 'z' round the front face.
    // floor: the piece is built that much taller and cut flat there, so its lower edges are not rounded.
    const piece = (w, h, d, o, x, y, z, rx = 0, ry = 0, rz = 0, rim = '', floor = null) => {
      const cut = (g, at) => { if (floor === null) return g; const p = g.attributes.position; for (let i = 0; i < p.count; i++) if (p.getY(i) < at) p.setY(i, at); return g; };
      parts.push(cut(put(softBox(w, h, d, { uv: 2.2, ao: [0, 0, 0, 0, 0, 0], ...o }), X + x, y, Zc + z, rx, ry, rz), floor));
      const r = Math.min(o.r, w / 2, h / 2, d / 2), k = 0.22 * r;
      if (rim === 'y') for (const s of [1, -1]) pipes.push(put(loop(w / 2 - k, d / 2 - k, r - k, s * (h / 2 - k), 0.05), X + x, y, Zc + z, rx, ry, rz));
      if (rim === 'z') pipes.push(cut(put(put(loop(w / 2 - k, h / 2 - k, r - k, d / 2 - k, 0.05), 0, 0, 0, PI / 2), X + x, y, Zc + z, rx, ry, rz), floor + 0.02));
    };
    piece(16, 1.3, 6, { r: 0.24, flat: 8, ao: [0, 0, 0.3, 0.5, 0, 0], aoR: 0.4 }, 0, 2.25, 0);       // the base rail
    piece(16, 5.5, 1.5, { r: 0.55, top: 0.05, flat: 8, ao: [0, 0, 0.2, 0, 0, 0.45] }, 0, 4.35, -2.25);   // the back
    pipes.push(put(loop(8 - 0.06, 3 - 0.06, 0.2, 0, 0.045), X, 1.66, Zc));                           // a welt along the bottom of the rail
    for (const s of [-1, 1]) {
      const inX = s > 0 ? [0.55, 0.4] : [0.4, 0.55];                                                // the gap in the middle is the deeper one
      piece(1.75, 4.9, 6.12, { r: 0.6, side: 0.07, top: 0.05, puff: 3, flat: 6, ao: [0, 0, 0.25, 0, 0, 0] }, s * 7.15, 3.45, 0, 0, 0, 0, 'z', 1.6);      // arms, rolled over at the top
      piece(6.25, 1.15, 4.5, { r: 0.42, top: 0.24, bottom: 0.02, side: 0.03, front: 0.08, puff: 4, flat: 9, ao: [inX[0], inX[1], 0.5, 0, 0.6, 0] }, s * 3.15, 3.47, 0.72, 0, 0, s * 0.006, 'y');      // seat cushions
      piece(6.2, 3.1, 1.25, { r: 0.48, front: 0.42, top: 0.07, side: 0.05, puff: 3, flat: 9, ao: [inX[0], inX[1], 0.6, 0, 0.5, 0] }, s * 3.15, 5.62, -0.95, -0.14, s * 0.012, s * 0.01, 'z');      // back cushions, plump and a little slumped
    }
    add(mergeTinted(parts), fabric); add(merge(pipes), welt, { cast: false });

    // tapered oak legs with brass caps, splayed a little. Their tops stay at x ± 7.2.
    const legs = [], caps = [];
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
      const x = X + sx * 7.2, z = Zc + sz * 2.5, rx = -sz * 0.07, rz = sx * 0.09;
      legs.push(put(lathe([[0.19, -1.02], [0.27, -0.33], [0.31, -0.1], [0.4, -0.07], [0.41, -0.03], [0.4, 0], [0.001, 0]], 28), x, 1.335, z, rx, 0, rz));
      caps.push(put(lathe([[0.001, -1.325], [0.14, -1.325], [0.165, -1.29], [0.2, -1.0], [0.19, -0.99]], 28), x, 1.335, z, rx, 0, rz));
      sit(x + sx * 0.11, z + sz * 0.09, 1.0);
    }
    add(merge(legs), wood('#c2a078', { rep: [3, 1] })); add(merge(caps), brass);

    // underneath: a wooden frame, jute webbing, and a dark dust cloth above it all
    const rails = [softBox(15.6, 0.3, 0.5, { r: 0.04, uv: 1 }), softBox(15.6, 0.3, 0.5, { r: 0.04, uv: 1 })];
    put(rails[0], X, 1.47, Zc + 2.6); put(rails[1], X, 1.47, Zc - 2.6);
    for (const x of [-7.55, -2.6, 2.6, 7.55]) rails.push(put(softBox(0.5, 0.28, 4.8, { r: 0.04, uv: 1 }), X + x, 1.47, Zc));
    add(merge(rails), wood('#5b4d40', { roughness: 0.85 }), { cast: false });
    const juteC = (() => { const c = canvas(128, 128), k = c.getContext('2d'); k.fillStyle = '#a58a60'; k.fillRect(0, 0, 128, 128); for (let y = 0; y < 128; y += 8) for (let x = 0; x < 128; x += 8) { k.fillStyle = `rgba(70,48,22,${0.12 + 0.2 * hash(x, y)})`; k.beginPath(); (x / 8 + y / 8) & 1 ? k.rect(x, y + 2, 8, 4) : k.rect(x + 2, y, 4, 8); k.fill(); } k.fillStyle = 'rgba(120,40,30,.55)'; k.fillRect(20, 0, 6, 128); k.fillRect(102, 0, 6, 128); return texOf(c); })();
    const strap = (len) => { const g = new THREE.BoxGeometry(0.46, 0.022, len), p = g.attributes.position, u = g.attributes.uv; for (let i = 0; i < p.count; i++) u.setXY(i, p.getX(i) / 0.46 + 0.5, p.getZ(i) * 2); return g; };
    const straps = [];
    for (let i = 0; i < 9; i++) straps.push(put(strap(4.9), X - 6 + i * 1.5, 1.372 + (i & 1) * 0.012, Zc));
    for (const z of [-1.05, 1.05]) straps.push(put(strap(14.8), X, 1.36, Zc + z, 0, PI / 2, 0));
    const strapG = merge(straps);
    add(strapG, new THREE.MeshStandardMaterial({ map: juteC, roughness: 1 }), { cast: false });
    const dustCloth = new THREE.PlaneGeometry(15.2, 5); dustCloth.rotateX(PI / 2); put(dustCloth, X, 1.52, Zc);
    add(boxUV(dustCloth, 1.5), cloth('#201f24', { sheen: 0.15 }), { cast: false });

    // the maker's tag, stapled under the back rail
    const tagC = (() => { const c = canvas(128, 96), k = c.getContext('2d'); k.fillStyle = '#efe9dc'; k.fillRect(0, 0, 128, 96); k.fillStyle = '#6f6a62'; k.font = '700 12px ui-monospace, Menlo, monospace'; k.fillText('DO NOT REMOVE', 10, 22); k.globalAlpha = 0.5; for (let i = 0; i < 6; i++) k.fillRect(10, 34 + i * 9, i % 3 === 2 ? 56 : 106, 2); return texOf(c); })();
    add(sheet(4, 6, (u, v) => V3(X + 3.5 + u * 0.44, 1.34 - v * 0.32, Zc - 2.33 + 0.06 * v * v + 0.02 * Math.sin(u * 3)), 0.012, 1, -1), new THREE.MeshStandardMaterial({ map: tagC, roughness: 0.9 }), { cast: false });

    // a knitted throw over the right seat. It lies rumpled on the cushion, rolls over the front edge and hangs in folds.
    const blanketC = (() => { const c = canvas(256, 512), k = c.getContext('2d'); k.fillStyle = '#efe6d4'; k.fillRect(0, 0, 256, 512);
      for (const [y, h, col] of [[26, 16, PAL.face], [50, 5, PAL.face], [64, 5, PAL.face], [84, 7, PAL.accent], [421, 7, PAL.accent], [443, 5, PAL.face], [457, 5, PAL.face], [470, 16, PAL.face]]) { k.fillStyle = col; k.fillRect(0, y, 256, h); }
      const d = k.getImageData(0, 0, 256, 512); for (let i = 0; i < d.data.length; i += 4) { const n = 0.9 + 0.1 * hash(i >> 3, i >> 11); d.data[i] *= n; d.data[i + 1] *= n; d.data[i + 2] *= n; } k.putImageData(d, 0, 0); return texOf(c); })();
    const yS = 4.045 + 0.06, zB = 0.3, zF = 2.55, rB = 0.5, L1 = zF - zB, L2 = L1 + rB * PI / 2, hangL = 1.72;
    const crown = (x, z) => 0.24 * (1 - Math.pow(clamp((x - 3.15) / 3.125, -1, 1), 4)) * (1 - Math.pow(clamp((z - 0.72) / 2.25, -1, 1), 4));      // the seat cushion's top, as softBox puffs it
    const lenAt = (u) => L2 + hangL + 0.34 * (u - 0.5) + 0.07 * Math.sin(u * 5 + 1);
    const pleatAt = (u, s) => 0.5 + 0.39 * Math.sin(u * 20.7 + 0.8 + 0.6 * Math.sin(s * 1.1)) + 0.11 * Math.sin(u * 46 + 2.1 - s * 0.9);      // three big folds and some small ones, 0 in a valley, 1 on a ridge
    const drape = (u, v) => {
      const s = v * lenAt(u), h = Math.max(0, s - L2), g = smooth(h, 0, 1.5), pleat = pleatAt(u, s);
      const x = 3.2 + (u - 0.5) * 3.4 * (1 - 0.23 * g) + 0.07 * Math.sin(s * 2.1 + 1) - 0.1 * (1 - v);      // it gathers as it hangs, and lies a little askew
      let z, y, out = 0;
      if (s < L1) {
        const ridge = 0.1 * Math.exp(-Math.pow((u - 0.24 - 0.2 * s / L1) / 0.05, 2)) * smooth(s, 0.15, 0.7) * (1 - smooth(s, L1 - 0.7, L1 - 0.1));      // one long crease across the seat
        z = zB + s; y = yS + crown(x, z) + ridge + 0.02 * (1 + Math.sin(u * 9 + s * 5.5)) * (1 + 0.6 * Math.sin(u * 4 - s * 3)) + 0.13 * Math.exp(-Math.pow((s - 0.24) / 0.2, 2)) * (0.6 + 0.4 * Math.sin(u * 6 + 1));
      }
      else if (s < L2) { const a = (s - L1) / rB; z = zF + Math.sin(a) * rB; y = yS - rB + Math.cos(a) * (rB + crown(x, Math.min(z, 2.97))); out = (0.05 + 0.04 * pleat) * Math.sin(a); }
      else { y = yS - rB - h; out = 0.05 + (0.04 + 0.5 * g) * pleat + 0.08 * g * smooth(Math.abs(u - 0.5) * 2, 0.8, 1); z = zF + rB; }
      return V3(X + x, y, Zc + z + out);
    };
    const inFold = (u, v) => { const s = v * lenAt(u), g = smooth(Math.max(0, s - L2), 0, 1.5); return 1 - 0.42 * (0.25 + 0.75 * g) * smooth(s, L1, L2) * Math.pow(1 - pleatAt(u, s), 1.4); };
    add(sheet(52, 64, drape, 0.09, 1, 1, inFold), new THREE.MeshPhysicalMaterial({ vertexColors: true, map: blanketC, normalMap: again(knitN, 11, 16), normalScale: V2(1.1, 1.1), roughness: 1, sheen: 0.7, sheenRoughness: 0.5, sheenColor: new THREE.Color('#fff6e6') }));
    // its fringe: short tassels hanging from the hem, and lying on the cushion at the other end
    const tassels = [];
    for (let i = 0; i < 46; i++) { const u = (i + 0.5) / 46, a = drape(u, 1), b = drape(u, 0), len = rr(0.15, 0.2);
      tassels.push(put(new THREE.CylinderGeometry(0.012, 0.024, len, 5).translate(0, -len / 2, 0), a.x, a.y + 0.02, a.z, rr(-0.12, 0.12), 0, rr(-0.12, 0.12)));
      tassels.push(put(new THREE.CylinderGeometry(0.012, 0.024, len, 5).translate(0, -len / 2, 0), b.x, b.y - 0.012, b.z + 0.02, PI / 2 - 0.07, rr(-0.3, 0.3), 0)); }
    add(merge(tassels), new THREE.MeshStandardMaterial({ color: '#e2d7c0', roughness: 1 }), { cast: false });

    // two throw pillows: velvet in the page's blue, and a cream knitted one
    const pillow = (mat, pipeM, s, T, uvs, x, y, z, rx, ry, rz) => { const [g, pipe] = pillowGeo(s, T, uvs); add(put(g, X + x, y, Zc + z, rx, ry, rz), mat); add(put(pipe, X + x, y, Zc + z, rx, ry, rz), pipeM, { cast: false }); };
    pillow(cloth(PAL.face, { vertexColors: true, map: null, normalMap: again(weaveN, 3, 3), normalScale: V2(0.3, 0.3), sheen: 1, sheenRoughness: 0.38, sheenColor: new THREE.Color(PAL.face).lerp(new THREE.Color('#ffffff'), 0.55) }), cloth(PAL.side, { sheen: 0.2 }), 2.6, 0.62, 1.4, -4.6, 5.44, 0.66, -0.33, 0.22, 0.07);
    pillow(new THREE.MeshPhysicalMaterial({ color: '#e7dcc6', vertexColors: true, map: knitC, normalMap: knitN, normalScale: V2(1.3, 1.3), roughness: 1, sheen: 0.5, sheenRoughness: 0.6, sheenColor: new THREE.Color('#fff6e6') }), cloth('#cdbf9f'), 2.2, 0.5, 1.1, 5.3, 5.22, 0.78, -0.4, -0.35, -0.1);

    // the dark under it, soft at the edges
    const shade = new THREE.Mesh(new THREE.PlaneGeometry(20, 11), new THREE.MeshBasicMaterial({ map: softRectT, color: '#0b0a10', transparent: true, opacity: 0.62, depthWrite: false }));
    shade.rotation.x = -PI / 2; shade.position.set(X, 0.015, Zc); shade.renderOrder = 1; group.add(shade);
  }

  /* ---------- a sock, left where socks get left. It lies beside the path, never across it ---------- */
  {
    const O = V3(SX - 1.4, 0, Z.sock);
    const curve = new THREE.CatmullRomCurve3([[-1.5, 0.62], [-1.05, 0.56], [-0.6, 0.47], [-0.16, 0.28], [0.18, -0.08], [0.36, -0.52], [0.44, -0.92], [0.46, -1.16]].map(([x, z]) => V3(O.x + x, 0, O.z + z)), false, 'centripetal');
    const heel = (t) => Math.exp(-Math.pow((t - 0.47) / 0.075, 2)), toe = (t) => t > 0.86 ? Math.sqrt(Math.max(0, 1 - Math.pow((t - 0.86) / 0.14, 2))) : 1;
    const cream = '#f3ecdd';
    const shape = (t, a) => {
      const rib = t < 0.19 ? 1 + 0.055 * Math.sin(a * 18) : 1, crease = 1 + 0.05 * Math.sin(t * 95) * heel(t) * Math.max(0, Math.cos(a)) * 2 + 0.03 * Math.sin(t * 38 + 1);
      const rx = (0.37 + 0.02 * Math.sin(t * 7) + (t < 0.19 ? 0.015 : 0)) * toe(t) * rib * crease * (1 + 0.6 * heel(t) * Math.max(0, -Math.cos(a)));
      const ry = (0.112 + 0.03 * Math.sin(t * 9 + 1) + 0.035 * heel(t)) * Math.pow(toe(t), 0.8) * rib * (1 + 0.1 * Math.sin(t * 64) * Math.exp(-Math.pow((t - 0.4) / 0.13, 2))), s = Math.sin(a);      // empty and lying flat, with a few folds at the ankle
      return [rx * Math.cos(a), ry * (1.02 + (s < 0 ? -Math.pow(-s, 0.75) : s))];
    };
    const body = sweep(curve, 120, 72, shape, { uv: [6, 14], color: (t, a) => t < 0.19 ? ((t > 0.05 && t < 0.08) || (t > 0.11 && t < 0.14) ? PAL.face : cream) : t > 0.85 || (heel(t) > 0.42 && Math.cos(a) < -0.2) ? cream : PAL.accent });
    add(body, new THREE.MeshPhysicalMaterial({ vertexColors: true, map: knitC, normalMap: knitN, normalScale: V2(1.2, 1.2), roughness: 1, sheen: 0.25, sheenRoughness: 0.6, sheenColor: new THREE.Color('#fff4d0'), side: THREE.DoubleSide, shadowSide: THREE.BackSide }));
    // the open cuff: a rolled hem and the dark inside
    const P = curve.getPointAt(0), Tn = curve.getTangentAt(0), S = V3().crossVectors(V3(0, 1, 0), Tn).normalize(), ring = [];
    for (let j = 0; j < 36; j++) { const o = shape(0, j / 36 * PI * 2); ring.push(V3(P.x + S.x * o[0], o[1], P.z + S.z * o[0])); }
    add(cord(ring, 0.02, 72, 6, true), new THREE.MeshStandardMaterial({ color: '#e6dccb', roughness: 1 }), { cast: false });
    const fan = [P.x + Tn.x * 0.42, 0.17, P.z + Tn.z * 0.42], fi = []; ring.forEach((p, j) => { fan.push(lerp(P.x, p.x, 0.86) + Tn.x * 0.3, lerp(0.17, p.y, 0.86), lerp(P.z, p.z, 0.86) + Tn.z * 0.3); fi.push(0, j + 1, (j + 1) % ring.length + 1); });
    const hole = new THREE.BufferGeometry(); hole.setAttribute('position', new THREE.Float32BufferAttribute(fan, 3)); hole.setIndex(fi);
    add(hole, new THREE.MeshBasicMaterial({ color: '#2a231b', side: THREE.DoubleSide }), { cast: false, receive: false });
    sit(O.x - 0.3, O.z + 0.25, 2.5, 3.0, 0.5);
  }

  /* ---------- a dust ball under the sofa: a grey clump with stray fibres ---------- */
  const fuzzT = (() => { const c = canvas(128, 128), k = c.getContext('2d'); const g = k.createRadialGradient(64, 64, 4, 64, 64, 62); g.addColorStop(0, 'rgba(150,143,133,.75)'); g.addColorStop(0.55, 'rgba(160,153,143,.35)'); g.addColorStop(1, 'rgba(170,163,153,0)'); k.fillStyle = g; k.fillRect(0, 0, 128, 128); for (let i = 0; i < 260; i++) { const a = rr(0, 7), r = rr(8, 60), l = rr(6, 26), b = a + rr(-1.4, 1.4); const g = rr(95, 205) | 0; k.strokeStyle = `rgba(${g},${g - 4},${g - 12},${rr(0.15, 0.45)})`; k.lineWidth = rr(0.4, 1.1); k.beginPath(); k.moveTo(64 + Math.cos(a) * r, 64 + Math.sin(a) * r); k.quadraticCurveTo(64 + Math.cos(a) * r + Math.cos(b) * l, 64 + Math.sin(a) * r + Math.sin(b) * l * 0.4, 64 + Math.cos(a) * r + Math.cos(b + 0.8) * l, 64 + Math.sin(a) * r + Math.sin(b + 0.8) * l); k.stroke(); } return texOf(c); })();
  const fuzzM = new THREE.SpriteMaterial({ map: fuzzT, transparent: true, depthWrite: false }), lintM = new THREE.MeshStandardMaterial({ color: '#aaa39a', roughness: 1, transparent: true, opacity: 0.6, depthWrite: false });
  const dustBall = (x, y, z, s) => {
    let core = new THREE.IcosahedronGeometry(0.13, 3); core.deleteAttribute('normal'); core.deleteAttribute('uv'); core = mergeVertices(core);
    const p = core.attributes.position, v = V3(); for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); v.multiplyScalar(1 + 0.45 * wob(v.x * 14, v.y * 14, v.z * 14)); p.setXYZ(i, v.x * 1.15, v.y * 0.75, v.z); }
    core.computeVertexNormals(); core.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(p.count * 2), 2));
    const hairs = [core];
    for (let i = 0; i < 210; i++) { const pts = [], r0 = rr(0.06, 0.3), a = rr(0, 7), b = rr(-1, 1); for (let k = 0; k < 4; k++) { const aa = a + k * rr(0.5, 1.3), bb = b + rr(-0.7, 0.7), r = r0 * rr(0.7, 1.25); pts.push(V3(Math.cos(aa) * Math.cos(bb) * r, Math.sin(bb) * r * 0.75, Math.sin(aa) * Math.cos(bb) * r)); } hairs.push(cord(pts, rr(0.0016, 0.0034), 9, 3)); }
    for (let i = 0; i < 4; i++) { const a = rr(0, 7); hairs.push(cord([V3(Math.cos(a) * 0.15, -0.2, Math.sin(a) * 0.15), V3(Math.cos(a + 0.3) * 0.4, -0.27, Math.sin(a + 0.3) * 0.4), V3(Math.cos(a + 0.9) * 0.62, -0.28, Math.sin(a + 0.9) * 0.62)], 0.004, 10, 3)); }      // long hairs trailing on the floor
    add(put(merge(hairs), x, y, z, 0, rr(0, 6), 0, s), lintM, { cast: false });
    const fuzz = new THREE.Sprite(fuzzM); fuzz.position.set(x, y, z); fuzz.scale.set(0.8 * s, 0.64 * s, 1); fuzz.renderOrder = 3; group.add(fuzz);      // a soft haze round it, so the edge is not a hard line
    sit(x, z, 1.3 * s);
  };
  dustBall(SX - 1.5, 0.3, Z.sofa + 1.5, 1); dustBall(SX + 3.1, 0.14, Z.sofa + 2.1, 0.45); dustBall(SX - 5.2, 0.16, Z.sofa - 1.9, 0.5);

  /* ---------- the keys: a ring, three keys and a tag ---------- */
  const keyObj = new THREE.Group(); keyObj.position.set(SX + 1.1, 0.03, Z.sofa - 1.2); keyObj.rotation.y = 0.6; keyObj.scale.setScalar(1.15); group.add(keyObj);
  {
    const key = (bow, len, hw, teeth, square) => {
      const s = new THREE.Shape(), x0 = square ? bow : bow * 0.93, step = (len - 0.13) / teeth.length; let x = x0 + len - 0.05;
      s.moveTo(x0, -hw); s.lineTo(x0 + len - 0.04, -hw); s.lineTo(x0 + len, -hw * 0.1); s.lineTo(x0 + len - 0.025, hw);
      for (const d of teeth) { s.lineTo(x - step * 0.5, hw - d); x -= step; s.lineTo(x, hw - 0.006); }
      s.lineTo(x0 + 0.04, hw); s.lineTo(x0, hw);
      if (square) { const c = bow * 0.35; s.lineTo(x0, bow - c); s.quadraticCurveTo(x0, bow, x0 - c, bow); s.lineTo(-bow + c, bow); s.quadraticCurveTo(-bow, bow, -bow, bow - c); s.lineTo(-bow, -bow + c); s.quadraticCurveTo(-bow, -bow, -bow + c, -bow); s.lineTo(x0 - c, -bow); s.quadraticCurveTo(x0, -bow, x0, -bow + c); }
      else { const a0 = Math.atan2(hw, x0); s.absarc(0, 0, bow, a0, PI * 2 - a0, false); }
      s.lineTo(x0, -hw);
      const hx = -bow * 0.42, h = new THREE.Path(); h.absarc(hx, 0, bow * 0.3, 0, PI * 2, true); s.holes.push(h);
      const g = new THREE.ExtrudeGeometry(s, { depth: 0.022, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 2, curveSegments: 20 });
      g.translate(-hx, 0, 0); g.rotateX(-PI / 2); return g;
    };
    const k1 = put(key(0.115, 0.36, 0.04, [0.03, 0.018, 0.034, 0.012, 0.028, 0.02]), 0.13, 0.008, 0, 0, 0.12, 0);
    const k2 = put(key(0.1, 0.42, 0.036, [0.016, 0.03, 0.022, 0.03, 0.014, 0.026, 0.02], true), 0.125, 0.04, 0.01, 0.05, -0.62, 0.03);
    const k3 = put(key(0.085, 0.24, 0.03, [0.02, 0.012, 0.022, 0.014]), 0.12, 0.07, 0, -0.04, 0.95, 0.05);
    add(merge([k1, k3]), brass, { parent: keyObj }); add(k2, steel, { parent: keyObj });
    // the split ring, tipped up on the keys, and a short chain to the tag
    const hoop = (R, r, n = 48) => { const g = new THREE.TorusGeometry(R, r, 8, n); g.rotateX(PI / 2); return g; };
    const rings = [put(hoop(0.14, 0.011), 0, 0.085, 0, 0, 0, -0.42), put(hoop(0.14, 0.011), 0.008, 0.107, 0, 0, 0, -0.42)];
    rings.push(put(hoop(0.046, 0.008, 18), -0.166, 0.104, 0.02, 0.2, 0, 1.1), put(hoop(0.028, 0.011, 18), -0.225, 0.05, 0.03));      // one link, and the eyelet in the tag
    add(merge(rings), steel, { parent: keyObj });
    const tag = softBox(0.3, 0.04, 0.19, { r: 0.02, c: 3, flat: 2 }); put(tag, -0.36, 0.026, 0.05, 0, -0.3, 0);
    add(tag, new THREE.MeshPhysicalMaterial({ color: PAL.face, roughness: 0.4, clearcoat: 0.6, clearcoatRoughness: 0.3 }), { parent: keyObj });
    const label = new THREE.PlaneGeometry(0.17, 0.11); label.rotateX(-PI / 2); put(label, -0.385, 0.0468, 0.058, 0, -0.3, 0);
    add(label, new THREE.MeshStandardMaterial({ color: '#f3ecdd', roughness: 0.8 }), { parent: keyObj, cast: false });
    const sh = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.0), new THREE.MeshBasicMaterial({ map: blobT, color: '#000', transparent: true, opacity: 0.5, depthWrite: false })); sh.rotation.x = -PI / 2; sh.position.set(-0.05, -0.012, 0); keyObj.add(sh);
  }

  /* ---------- a woven rug with a fringe on two ends ---------- */
  const RUG = 0.1;                                             // how thick the rug is. The cat lies on top of it.
  {
    const cx = SX - 0.5, cz = Z.cat - 0.3, W = 10, D = 8;
    // the pattern is worked out for every dot of the picture, so its diagonals stay fine close up. Only the shade varies knot by knot.
    const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)), cream = [233, 223, 204], blue = rgb(PAL.face), navy = rgb(PAL.side), gold = rgb(PAL.accent);
    const BW = 1024, BH = 1024, big = canvas(BW, BH), kb = big.getContext('2d'), img = kb.createImageData(BW, BH);
    for (let q = 0; q < BH; q++) for (let p = 0; p < BW; p++) {
      const i = p * 320 / BW, j = q * 256 / BH, x = Math.min(i, 319 - i), y = Math.min(j, 255 - j), e = Math.min(x, y); let c;
      if (e < 9) c = cream; else if (e < 13) c = navy;
      else if (e < 29) c = (e - 13) < Math.abs(((x < y ? j : i) % 24) - 12) * 1.34 ? cream : blue;
      else if (e < 33) c = navy;
      else { const u = Math.abs(((i - 160) % 52 + 52) % 52 - 26) / 26, v = Math.abs(((j - 128) % 44 + 44) % 44 - 22) / 22, d = u + v; c = d < 0.22 ? gold : d < 0.5 ? cream : d < 0.62 ? navy : d > 1.84 ? cream : blue; }
      const n = 0.88 + 0.12 * hash(Math.floor(i), Math.floor(j)), k = (q * BW + p) * 4; img.data[k] = c[0] * n; img.data[k + 1] = c[1] * n; img.data[k + 2] = c[2] * n; img.data[k + 3] = 255;
    }
    kb.putImageData(img, 0, 0);
    const ribN = texOf(normalFrom(paint(128, 128, (x, y) => Math.pow(Math.abs(Math.sin(PI * y / 16)), 0.6) * (0.7 + 0.3 * Math.sin(PI * (x + (Math.floor(y / 16) & 1) * 8) / 8))), 2.6), { srgb: false, rep: [26, 21] });
    const rug = sheet(50, 40, (u, v) => { const c = Math.max(0, u - 0.84) * Math.max(0, 0.2 - v) / 0.032; return V3(cx - W / 2 + u * W - 0.25 * c * c, RUG / 2 + 0.008 * Math.sin(u * 23 + v * 9) + 0.42 * c * c, cz + D / 2 - v * D - 0.2 * c * c); }, RUG);      // one corner has turned up
    add(rug, new THREE.MeshStandardMaterial({ map: texOf(big), normalMap: ribN, normalScale: V2(0.9, 0.9), roughness: 1 }), { cast: false });
    // the fringe: one thin strand, many times, lying on the floor
    const strand = new THREE.CylinderGeometry(0.008, 0.004, 0.36, 4, 1); strand.translate(0, 0.18, 0); strand.rotateX(PI / 2);
    const N = 2 * 230, fringe = new THREE.InstancedMesh(strand, new THREE.MeshStandardMaterial({ color: '#e2d7c2', roughness: 1 }), N), o = new THREE.Object3D();
    for (let i = 0; i < N; i++) { const far = i >= N / 2, k = i % (N / 2); o.position.set(cx - W / 2 + 0.06 + k * (W - 0.12) / (N / 2 - 1), 0.05, cz + (far ? -D / 2 : D / 2)); o.rotation.set(0.11, (far ? PI : 0) + rr(-0.35, 0.35) + (k % 5 - 2) * 0.05, 0, 'YXZ'); o.scale.set(1, 1, rr(0.75, 1.15)); o.updateMatrix(); fringe.setMatrixAt(i, o.matrix); }
    fringe.receiveShadow = true; group.add(fringe);
    sit(cx, cz, W + 1.2, D + 1.4);
  }

  /* ---------- the cat, asleep on the rug: one smooth skin, with ears, a tail, a face ---------- */
  // a smooth skin over soft blobs (surface nets). f(x, y, z) is below zero inside.
  function skin(f, lo, hi, res) {
    const nx = Math.ceil((hi[0] - lo[0]) / res) + 1, ny = Math.ceil((hi[1] - lo[1]) / res) + 1, nz = Math.ceil((hi[2] - lo[2]) / res) + 1, id = (i, j, k) => (k * ny + j) * nx + i;
    const val = new Float32Array(nx * ny * nz), cell = new Int32Array(nx * ny * nz).fill(-1), pos = [], idx = [];
    for (let k = 0; k < nz; k++) for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) val[id(i, j, k)] = f(lo[0] + i * res, lo[1] + j * res, lo[2] + k * res);
    const C = [[0, 0, 0], [1, 0, 0], [0, 1, 0], [1, 1, 0], [0, 0, 1], [1, 0, 1], [0, 1, 1], [1, 1, 1]], E = [[0, 1], [2, 3], [4, 5], [6, 7], [0, 2], [1, 3], [4, 6], [5, 7], [0, 4], [1, 5], [2, 6], [3, 7]], v = new Float32Array(8);
    for (let k = 0; k < nz - 1; k++) for (let j = 0; j < ny - 1; j++) for (let i = 0; i < nx - 1; i++) {
      let n = 0, sx = 0, sy = 0, sz = 0; for (let c = 0; c < 8; c++) v[c] = val[id(i + C[c][0], j + C[c][1], k + C[c][2])];
      for (const [a, b] of E) if ((v[a] < 0) !== (v[b] < 0)) { const t = v[a] / (v[a] - v[b]); sx += lerp(C[a][0], C[b][0], t); sy += lerp(C[a][1], C[b][1], t); sz += lerp(C[a][2], C[b][2], t); n++; }
      if (n) { cell[id(i, j, k)] = pos.length / 3; pos.push(lo[0] + (i + sx / n) * res, lo[1] + (j + sy / n) * res, lo[2] + (k + sz / n) * res); }
    }
    const quad = (a, b, c, d, flip) => { if (a < 0 || b < 0 || c < 0 || d < 0) return; if (flip) idx.push(a, c, b, a, d, c); else idx.push(a, b, c, a, c, d); };
    for (let k = 1; k < nz - 1; k++) for (let j = 1; j < ny - 1; j++) for (let i = 1; i < nx - 1; i++) {
      const inside = val[id(i, j, k)] < 0;
      if (inside !== (val[id(i + 1, j, k)] < 0)) quad(cell[id(i, j - 1, k - 1)], cell[id(i, j, k - 1)], cell[id(i, j, k)], cell[id(i, j - 1, k)], !inside);
      if (inside !== (val[id(i, j + 1, k)] < 0)) quad(cell[id(i - 1, j, k - 1)], cell[id(i - 1, j, k)], cell[id(i, j, k)], cell[id(i, j, k - 1)], !inside);
      if (inside !== (val[id(i, j, k + 1)] < 0)) quad(cell[id(i - 1, j - 1, k)], cell[id(i, j - 1, k)], cell[id(i, j, k)], cell[id(i - 1, j, k)], !inside);
    }
    const nor = new Float32Array(pos.length), e = res * 0.5;      // normals straight from the field, so the shading is smooth
    for (let i = 0; i < pos.length; i += 3) { const x = pos[i], y = pos[i + 1], z = pos[i + 2], gx = f(x + e, y, z) - f(x - e, y, z), gy = f(x, y + e, z) - f(x, y - e, z), gz = f(x, y, z + e) - f(x, y, z - e), l = 1 / (Math.hypot(gx, gy, gz) || 1); nor[i] = gx * l; nor[i + 1] = gy * l; nor[i + 2] = gz * l; }
    const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('normal', new THREE.BufferAttribute(nor, 3)); g.setIndex(idx); return g;
  }
  const cat = new THREE.Group(); cat.position.set(SX - 3.3, 0, Z.cat); cat.rotation.y = 0.5; group.add(cat);
  const catBody = new THREE.Group(); catBody.position.y = RUG; catBody.scale.y = 0.9; cat.add(catBody);      // the page breathes it: scale.y 0.9, a little more, a little less
  {
    const inner = new THREE.Group(); inner.scale.y = 1 / 0.9; inner.position.x = -0.25; catBody.add(inner);                                 // so at 0.9 the cat is exactly as modelled
    const smin = (a, b, k) => { const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.min(a, b) - h * h * k * 0.25; };
    const ell = (x, y, z, c, r) => { const a = (x - c[0]) / r[0], b = (y - c[1]) / r[1], d = (z - c[2]) / r[2]; return (Math.sqrt(a * a + b * b + d * d) - 1) * Math.min(r[0], r[1], r[2]); };
    const cap = (x, y, z, a, b, r) => { const bx = b[0] - a[0], by = b[1] - a[1], bz = b[2] - a[2], h = clamp(((x - a[0]) * bx + (y - a[1]) * by + (z - a[2]) * bz) / (bx * bx + by * by + bz * bz), 0, 1); const dx = x - a[0] - bx * h, dy = y - a[1] - by * h, dz = z - a[2] - bz * h; return Math.sqrt(dx * dx + dy * dy + dz * dz) - r; };
    // curled up: haunch, belly, shoulders, neck, and the head tucked round toward its own tail
    const H = [1.4, 0.5, 0.8], up = V3(0, 1, 0), Nn = V3(-0.42, 0, 0.9).normalize(), Sd = V3().crossVectors(up, Nn).normalize(), MZ = [H[0] + Nn.x * 0.36, 0.36, H[2] + Nn.z * 0.36], chest = V3(0.96, 0.3, 0.84);
    const paws = [[[0.56, 0.13, 0.9], [0.76, 0.115, 1.34], 0.13, 0.3], [[0.98, 0.13, 0.9], [1.12, 0.11, 1.12], 0.11, 0.2], [[-0.5, 0.12, 0.94], [0.1, 0.12, 1.04], 0.125, 0.62]];      // each: from, to, how thick, where the white sock starts
    const cheeks = [-1, 1].map((s) => [H[0] + Sd.x * s * 0.27 + Nn.x * 0.16, 0.4, H[2] + Sd.z * s * 0.27 + Nn.z * 0.16]);
    const f = (x, y, z) => {
      let d = ell(x, y, z, [-0.95, 0.62, -0.15], [0.85, 0.66, 0.8]);
      d = smin(d, ell(x, y, z, [-0.15, 0.68, -0.38], [0.95, 0.72, 0.78]), 0.3);
      d = smin(d, ell(x, y, z, [0.72, 0.6, -0.18], [0.72, 0.62, 0.68]), 0.3);
      d = smin(d, ell(x, y, z, [1.2, 0.5, 0.25], [0.5, 0.45, 0.48]), 0.3);
      d = smin(d, ell(x, y, z, H, [0.5, 0.43, 0.47]), 0.15);
      for (const c of cheeks) d = smin(d, ell(x, y, z, c, [0.24, 0.22, 0.24]), 0.14);
      d = smin(d, ell(x, y, z, MZ, [0.19, 0.16, 0.19]), 0.1);
      d = smin(d, ell(x, y, z, [-0.75, 0.42, 0.5], [0.62, 0.42, 0.42]), 0.22);          // the folded hind leg
      for (const [a, b, r] of paws) d = smin(d, cap(x, y, z, a, b, r), 0.07);
      return Math.max(d, -y);
    };
    const furH = canvas(512, 512); { const k = furH.getContext('2d'); k.fillStyle = '#808080'; k.fillRect(0, 0, 512, 512); }
    strokes(furH, 3600, (k, x, y, s, t) => { const a = PI / 2 + (s - 0.5) * 0.9, l = 10 + t * 22, g = 40 + ((s * 977) % 1) * 190 | 0; k.strokeStyle = `rgba(${g},${g},${g},.55)`; k.lineWidth = 1 + t; k.beginPath(); k.moveTo(x, y); k.lineTo(x + Math.cos(a) * l, y + Math.sin(a) * l); k.stroke(); });
    const dark = new THREE.Color('#2a2a31'), light = new THREE.Color('#d9d3c9'), tmp = new THREE.Color();
    const furC = canvas(512, 512); { const k = furC.getContext('2d'); k.fillStyle = '#fff'; k.fillRect(0, 0, 512, 512); k.globalAlpha = 0.34; k.drawImage(furH, 0, 0); }
    const fur = new THREE.MeshPhysicalMaterial({ vertexColors: true, map: texOf(furC), normalMap: texOf(normalFrom(furH, 3), { srgb: false }), normalScale: V2(1.5, 1.5), roughness: 0.92, sheen: 1, sheenRoughness: 0.5, sheenColor: new THREE.Color('#62626f') });
    let body = skin(f, [-2.0, -0.12, -1.4], [2.1, 1.6, 1.7], 0.056);
    { const p = body.attributes.position, col = new Float32Array(p.count * 3), v = V3(), m = V3(MZ[0] + Nn.x * 0.12, MZ[1] - 0.04, MZ[2] + Nn.z * 0.12);
      for (let i = 0; i < p.count; i++) { v.fromBufferAttribute(p, i); let w = Math.max(1 - smooth(v.distanceTo(m), 0.12, 0.24), 1 - smooth(v.distanceTo(chest), 0.2, 0.4)); for (const [a, b, r, k] of paws) w = Math.max(w, 1 - smooth(cap(v.x, v.y, v.z, [lerp(a[0], b[0], k), a[1], lerp(a[2], b[2], k)], b, 0), r + 0.02, r + 0.1)); tmp.lerpColors(dark, light, w * 0.9); col.set([tmp.r, tmp.g, tmp.b], i * 3); }
      body.setAttribute('color', new THREE.BufferAttribute(col, 3)); }
    body = boxUV(body, 2.4);
    add(body, fur, { parent: inner });
    const reach = (from, dir) => { const p = V3(); for (let t = 0; t < 1.5; t += 0.008) { p.set(from[0] + dir.x * t, from[1] + dir.y * t, from[2] + dir.z * t); if (f(p.x, p.y, p.z) > 0) break; } return p; };      // walk out from inside until you leave the skin
    // the tail, wrapped round to the front. Its last part can flick.
    const tailC = new THREE.CatmullRomCurve3([[-1.2, 0.34, -0.55], [-1.74, 0.2, 0.0], [-1.66, 0.17, 0.72], [-1.18, 0.16, 1.2], [-0.5, 0.15, 1.44], [0.05, 0.14, 1.5], [0.36, 0.14, 1.48]].map((p) => V3(p[0], p[1], p[2])), false, 'centripetal');
    const tailR = (t) => lerp(0.175, 0.125, t) * (t > 0.93 ? Math.sqrt(Math.max(1e-5, 1 - Math.pow((t - 0.93) / 0.07, 2))) : 1), tailShape = (k) => (t, a) => [tailR(t) * k * Math.cos(a), tailR(t) * k * Math.sin(a)];
    add(sweep(tailC, 60, 18, tailShape(1), { span: [0, 0.8], uv: [2, 9], color: () => dark }), fur, { parent: inner });
    const pivot = tailC.getPointAt(0.8), tipG = sweep(tailC, 22, 18, tailShape(0.985), { span: [0.76, 1], uv: [2, 9], color: () => dark });
    tipG.translate(-pivot.x, -pivot.y, -pivot.z); const tip = add(tipG, fur, { parent: inner }); tip.position.copy(pivot);
    // ears: two cupped triangles standing on the head
    const earIn = new THREE.MeshStandardMaterial({ color: '#8d7f7c', roughness: 1 });
    const ears = [-1, 1].map((s) => {
      const base = reach([H[0] + Sd.x * s * 0.26 - Nn.x * 0.1, H[1], H[2] + Sd.z * s * 0.26 - Nn.z * 0.1], up);
      const g = tint(sheet(8, 8, (u, v) => { const w = 0.2 * Math.pow(1 - v, 0.7) + 0.012, x = (u - 0.5) * 2; return V3(x * w, -0.1 + v * 0.48, -0.09 * (1 - x * x) * (1 - v * 0.6) + 0.04); }, 0.035), '#2a2a31');
      const holder = new THREE.Group(); holder.position.copy(base); holder.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(Sd, up, Nn)); inner.add(holder);
      const ear = add(g, fur, { parent: holder }); ear.rotation.z = -s * 0.28; ear.userData.rest = -s * 0.28;
      const inside = sheet(6, 6, (u, v) => { const w = 0.13 * Math.pow(1 - v, 0.8) + 0.004, x = (u - 0.5) * 2; return V3(x * w, -0.04 + v * 0.36, -0.09 * (1 - x * x) * (1 - v * 0.6) + 0.04 + 0.021); }, 0.006);
      add(inside, earIn, { parent: ear, cast: false });      // the pale inside, riding on the ear when it twitches
      return ear;
    });
    // closed eyes, a nose, whiskers
    const out = (side, lift, fwd = 1) => V3().copy(Nn).multiplyScalar(fwd).addScaledVector(Sd, side).addScaledVector(up, lift).normalize(), lines = [], hairs = [];
    for (const s of [-1, 1]) {
      const pts = []; for (let k = 0; k <= 4; k++) { const d = out(s * (0.36 + k * 0.1), 0.2 - 0.08 * Math.sin(PI * k / 4)); pts.push(reach(H, d).addScaledVector(d, 0.004)); }
      lines.push(cord(pts, 0.013, 12, 5));
      for (let k = 0; k < 3; k++) { const d = out(s * 1.5, -0.02 + k * 0.16, 0.7), root = reach(MZ, d), go = V3().copy(Sd).multiplyScalar(s).addScaledVector(Nn, 0.25).addScaledVector(up, 0.12 - k * 0.14).normalize(); hairs.push(cord([root, V3().copy(root).addScaledVector(go, 0.18).add(V3(0, 0.015, 0)), V3().copy(root).addScaledVector(go, 0.36).add(V3(0, -0.03, 0))], 0.003, 8, 3)); }
    }
    const nd = out(0, 0.5), nose = new THREE.SphereGeometry(0.05, 12, 8); nose.scale(1.25, 0.8, 0.8); nose.lookAt(Nn); const np = reach(MZ, nd); put(nose, np.x, np.y, np.z); lines.push(nose);
    add(merge(lines), new THREE.MeshStandardMaterial({ color: '#141318', roughness: 0.6 }), { parent: inner, cast: false });
    add(merge(hairs), new THREE.MeshStandardMaterial({ color: '#ece8e0', roughness: 0.6 }), { parent: inner, cast: false });
    sit(SX - 2.6, Z.cat, 5.2, 4.0, 0.5, RUG + 0.012);
    // now and then an ear twitches and the tail tip flicks
    live.push((T) => {
      const a = (T * 0.23) % 1, tw = a < 0.06 ? Math.sin(a / 0.06 * PI * 2) : 0, b = ((T + 1.7) * 0.31) % 1, tw2 = b < 0.05 ? Math.sin(b / 0.05 * PI * 2) : 0;
      ears[0].rotation.z = ears[0].userData.rest + tw * 0.22; ears[1].rotation.z = ears[1].userData.rest + tw2 * 0.18;
      const c = (T * 0.17) % 1; tip.rotation.y = c < 0.22 ? Math.sin(c / 0.22 * PI * 3) * 0.2 * (1 - c / 0.22) : 0;
    });
  }

  /* ---------- the stove: a freestanding oven, far too tall to see the top of. Door and knobs face the path ---------- */
  {
    const stove = new THREE.Group(); stove.position.set(SX + 6.8, 0, Z.stove - 1); stove.rotation.y = -PI / 2; group.add(stove);      // built facing +z, then turned toward the path
    const enamel = new THREE.MeshPhysicalMaterial({ color: '#f3f0e8', roughness: 0.3, clearcoat: 0.7, clearcoatRoughness: 0.18 });
    const black = new THREE.MeshStandardMaterial({ color: '#1c1c20', roughness: 0.55, metalness: 0.2 });
    const white = [], dark = [], steelG = [], F = 2.62;                                              // F: the front of the carcass
    const at = (list, geo, x, y, z, rx = 0, ry = 0, rz = 0) => list.push(put(geo, x, y, z, rx, ry, rz));
    at(white, softBox(5, 6.5, 5.22, { r: 0.07, c: 3, flat: 3 }), 0, 3.75, 0.01);                        // the carcass, 0.5 off the floor on its feet
    at(white, softBox(4.86, 1.0, 0.16, { r: 0.05, c: 3, flat: 3 }), 0, 1.1, F + 0.08);                  // the drawer at the bottom
    at(white, softBox(4.86, 3.66, 0.16, { r: 0.05, c: 3, flat: 3 }), 0, 3.52, F + 0.08);                // the oven door
    at(white, softBox(4.86, 1.5, 0.16, { r: 0.05, c: 3, flat: 3 }), 0, 6.19, F + 0.08);                 // the control panel
    at(white, softBox(5.06, 0.14, 5.5, { r: 0.05, c: 3, flat: 3 }), 0, 7.07, 0.1);                      // the hob
    at(white, softBox(5.0, 0.8, 0.22, { r: 0.07, c: 3, flat: 3 }), 0, 7.5, -2.48);                      // a low upstand at the back
    at(dark, softBox(4.9, 6.4, 0.06, { r: 0.02, c: 1, flat: 1 }), 0, 3.75, F + 0.0);                    // dark in the gaps between the panels
    at(dark, softBox(4.7, 0.5, 0.1, { r: 0.03, c: 1, flat: 1 }), 0, 0.25, 1.95);                        // the toe kick, set back
    for (const x of [-2.15, 2.15]) for (const z of [-2.2, 2.25]) at(dark, lathe([[0.001, 0], [0.2, 0], [0.22, 0.03], [0.22, 0.12], [0.12, 0.16], [0.12, 0.5], [0.001, 0.5]], 20), x, 0, z);      // feet you can screw up and down
    for (const x of [-2.5, 2.5]) { for (let i = 0; i < 6; i++) at(dark, softBox(0.03, 0.05, 1.1, { r: 0.012, c: 1, flat: 1 }), x, 6.45 - i * 0.14, -1.55); at(dark, softBox(0.02, 6.3, 0.03, { r: 0.008, c: 1, flat: 1 }), x, 3.8, 2.2); }      // vent slots and a seam on each side
    // on top: pan supports and burner caps. Mosey never sees them, the overview does.
    for (const x of [-1.2, 1.2]) for (const z of [-1.15, 1.35]) { at(dark, lathe([[0.001, 0], [0.42, 0], [0.42, 0.05], [0.3, 0.09], [0.001, 0.09]], 24), x, 7.14, z); at(dark, loop(0.85, 0.85, 0.2, 0, 0.045, 48), x, 7.3, z); for (const r of [0, PI / 2]) at(dark, softBox(1.7, 0.07, 0.07, { r: 0.03, c: 1, flat: 1 }), x, 7.3, z, 0, r, 0); }
    // the door handle: a steel bar on two posts
    const bar = new THREE.CylinderGeometry(0.095, 0.095, 4.2, 20); at(steelG, bar, 0, 4.98, F + 0.52, 0, 0, PI / 2);
    for (const x of [-1.85, 1.85]) at(steelG, new THREE.CylinderGeometry(0.07, 0.07, 0.38, 14), x, 4.98, F + 0.33, PI / 2, 0, 0);
    // four knobs, all pointing up at off
    const KX = [-1.98, -1.22, 1.22, 1.98], marks = [];
    for (const x of KX) { at(steelG, lathe([[0.001, 0], [0.28, 0], [0.28, 0.05], [0.225, 0.085], [0.205, 0.27], [0.18, 0.31], [0.001, 0.31]], 32), x, 6.22, F + 0.16, PI / 2); at(marks, softBox(0.045, 0.16, 0.02, { r: 0.008, c: 1, flat: 1 }), x, 6.3, F + 0.475); }
    add(merge(white), enamel, { parent: stove }); add(merge(dark), black, { parent: stove }); add(merge(steelG), steel, { parent: stove }); add(merge(marks), black, { parent: stove, cast: false });
    // dark glass in the door, with a dotted border and the racks faintly behind it
    const glassC = (() => { const c = canvas(512, 320), k = c.getContext('2d'), g = k.createLinearGradient(0, 0, 0, 320); g.addColorStop(0, '#16171c'); g.addColorStop(1, '#0b0c10'); k.fillStyle = g; k.fillRect(0, 0, 512, 320);
      k.strokeStyle = 'rgba(255,255,255,.07)'; k.lineWidth = 2; for (const y of [120, 210]) { k.beginPath(); k.moveTo(40, y); k.lineTo(472, y); k.stroke(); for (let x = 60; x < 472; x += 22) { k.beginPath(); k.moveTo(x, y); k.lineTo(x, y + 6); k.stroke(); } }
      for (let r = 0; r < 5; r++) { k.fillStyle = `rgba(4,4,6,${0.9 - r * 0.16})`; const m = 7 + r * 7, s = 2.6 - r * 0.4; for (let x = m; x <= 512 - m; x += 7) for (const y of [m, 320 - m]) { k.beginPath(); k.arc(x, y, s, 0, 7); k.fill(); } for (let y = m; y <= 320 - m; y += 7) for (const x of [m, 512 - m]) { k.beginPath(); k.arc(x, y, s, 0, 7); k.fill(); } }
      const h = k.createLinearGradient(120, 0, 330, 320); h.addColorStop(0.2, 'rgba(255,255,255,0)'); h.addColorStop(0.42, 'rgba(255,255,255,.1)'); h.addColorStop(0.46, 'rgba(255,255,255,.02)'); h.addColorStop(0.56, 'rgba(255,255,255,.07)'); h.addColorStop(0.75, 'rgba(255,255,255,0)'); k.fillStyle = h; k.fillRect(0, 0, 512, 320); return texOf(c); })();
    const glassM = (map) => new THREE.MeshPhysicalMaterial({ map, roughness: 0.07, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 3 });
    const win = add(new RoundedBoxGeometry(4.2, 2.5, 0.05, 4, 0.025), glassM(glassC), { parent: stove, cast: false }); win.position.set(0, 3.3, F + 0.15);
    // the black strip behind the knobs, with its printed marks
    const panelC = (() => { const c = canvas(1024, 256), k = c.getContext('2d'), px = 1024 / 4.7; k.fillStyle = '#0c0d10'; k.fillRect(0, 0, 1024, 256); k.strokeStyle = k.fillStyle = '#d9d5cc'; k.textAlign = 'center';
      KX.forEach((x, i) => { const cx = 512 + x * px, cy = 128 + (6.19 - 6.22) * px; k.lineWidth = 3; for (let a = 0; a <= 8; a++) { const t = PI * 0.75 + a / 8 * PI * 1.5; k.beginPath(); k.moveTo(cx + Math.cos(t) * 74, cy + Math.sin(t) * 74); k.lineTo(cx + Math.cos(t) * (a % 4 ? 82 : 90), cy + Math.sin(t) * (a % 4 ? 82 : 90)); k.stroke(); }
        k.font = '600 22px ui-monospace, Menlo, monospace'; k.fillText('0', cx, cy - 92); for (let b = 0; b < 4; b++) { k.beginPath(); k.arc(cx - 9 + (b % 2) * 18, cy + 100 + (b >> 1) * 16, 5, 0, 7); b === i ? k.fill() : k.stroke(); } });
      k.lineWidth = 2; k.strokeStyle = 'rgba(217,213,204,.5)'; k.beginPath(); k.roundRect(512 - 124, 128 - 62, 248, 104, 10); k.stroke(); return texOf(c); })();
    const panel = add(new THREE.PlaneGeometry(4.7, 1.175), glassM(panelC), { parent: stove, cast: false }); panel.position.set(0, 6.19, F + 0.162);
    // a small clock. Its colon blinks.
    const clockT = [':', ' '].map((sep) => { const c = canvas(256, 112), k = c.getContext('2d'); k.fillStyle = '#050506'; k.fillRect(0, 0, 256, 112); k.fillStyle = '#ffd596'; k.font = '600 76px ui-monospace, Menlo, monospace'; k.textAlign = 'center'; k.textBaseline = 'middle'; k.shadowColor = '#ffb24a'; k.shadowBlur = 14; k.fillText(`8${sep}41`, 128, 60); return texOf(c); });
    const clockM = new THREE.MeshBasicMaterial({ map: clockT[0] }), clock = add(new THREE.PlaneGeometry(1.0, 0.4375), clockM, { parent: stove, cast: false, receive: false }); clock.position.set(0, 6.25, F + 0.166);
    // its own small green light, under the last knob
    const ledM = new THREE.MeshBasicMaterial({ color: '#35d07f' }), led = add(new THREE.SphereGeometry(0.05, 12, 8), ledM, { parent: stove, cast: false, receive: false }); led.position.set(2.24, 5.68, F + 0.165); led.scale.z = 0.5;
    const ledC = new THREE.Color('#35d07f');
    live.push((T) => { clockM.map = clockT[(T % 1) < 0.5 ? 0 : 1]; ledM.color.copy(ledC).multiplyScalar(0.7 + 0.3 * Math.sin(T * 2.4)); });
    // a tea towel hung over the handle
    const towelC = (() => { const c = canvas(128, 512), k = c.getContext('2d'); k.fillStyle = '#f1eadb'; k.fillRect(0, 0, 128, 512); k.fillStyle = PAL.accent; for (const y of [300, 330, 440]) k.fillRect(0, y, 128, 14); k.fillStyle = PAL.face; for (const y of [322, 352, 432, 462]) k.fillRect(0, y, 128, 3); return texOf(c); })();
    const yc = 4.98, zc = F + 0.52, R = 0.135, Lb = 1.0, Lt = Lb + PI * R, Lf = 2.2;
    const towel = sheet(20, 48, (u, v) => {
      const s = v * (Lt + Lf + 0.16 * Math.sin(u * 3)), x = 1.1 + (u - 0.5) * 1.5 * (0.8 + 0.2 * smooth(Math.abs(s - Lb - PI * R / 2), 0, 1.6)), fold = 0.5 + 0.5 * Math.sin(u * 15 + 1); let y, z, ny = 0, nz = -1, amp = 0;
      if (s < Lb) { z = zc - R; y = yc - Lb + s; amp = 0.05 * (1 - s / Lb); }
      else if (s < Lt) { const a = (s - Lb) / R; z = zc - R * Math.cos(a); y = yc + R * Math.sin(a); nz = -Math.cos(a); ny = Math.sin(a); }
      else { z = zc + R; y = yc - (s - Lt); nz = 1; amp = 0.03 + 0.1 * smooth(s - Lt, 0, 1.4); }
      return V3(x, y + ny * fold * amp, z + nz * fold * amp);
    }, 0.04);
    add(towel, new THREE.MeshStandardMaterial({ map: towelC, normalMap: again(weaveN, 3, 9), roughness: 1 }), { parent: stove });
    sit(SX + 6.8, Z.stove - 1, 7.2, 6.4);
  }

  /* ---------- the room: a papered wall with a skirting board on the left, a tiled wall behind the stove ---------- */
  const WX = SX - 11.6;                                        // the face of the left wall
  {
    const paperC = (() => { const c = canvas(512, 512), k = c.getContext('2d'); k.fillStyle = '#c3c9b6'; k.fillRect(0, 0, 512, 512);
      for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) for (const ox of [-512, 0, 512]) {             // a small sprig, repeated in a half drop
        k.save(); k.translate(i * 128 + (j & 1) * 64 + 32 + ox, j * 128 + 64);
        for (const r of [-0.6, 0.6]) { k.save(); k.rotate(r); k.fillStyle = 'rgba(226,230,214,.75)'; k.beginPath(); k.ellipse(0, -26, 9, 24, 0, 0, 7); k.fill(); k.restore(); }
        k.fillStyle = 'rgba(160,168,146,.9)'; k.beginPath(); k.arc(0, 8, 5, 0, 7); k.fill(); k.fillRect(-1, 8, 2, 30); k.restore();
      }
      const d = k.getImageData(0, 0, 512, 512); for (let i = 0; i < d.data.length; i += 4) { const n = 0.95 + 0.05 * hash(i >> 2, i >> 12); d.data[i] *= n; d.data[i + 1] *= n; d.data[i + 2] *= n; } k.putImageData(d, 0, 0); return texOf(c); })();
    const wall = new THREE.BoxGeometry(0.4, 14, 34.4); put(wall, WX - 0.2, 7, -36.5);
    add(boxUV(wall, 0.5), new THREE.MeshStandardMaterial({ map: paperC, roughness: 0.95 }), { cast: false });
    const prof = new THREE.Shape(); prof.moveTo(0, 0); prof.lineTo(0.17, 0); prof.lineTo(0.17, 0.74); prof.quadraticCurveTo(0.17, 0.86, 0.1, 0.9); prof.quadraticCurveTo(0.05, 0.93, 0.05, 1.0); prof.quadraticCurveTo(0.05, 1.08, 0, 1.1); prof.lineTo(0, 0);
    const skirt = new THREE.ExtrudeGeometry(prof, { depth: 34.4, bevelEnabled: false, curveSegments: 6 }); put(skirt, WX, 0, -53.7);
    const gloss = new THREE.MeshStandardMaterial({ color: '#f2eee5', roughness: 0.42 });
    add(skirt, gloss, { cast: false });
    // two sockets on the wall, a lamp plug in one and a phone charger in the other
    const plates = [], sockC = (() => { const c = canvas(128, 128), k = c.getContext('2d'); k.fillStyle = '#f2eee5'; k.fillRect(0, 0, 128, 128); const g = k.createRadialGradient(64, 60, 30, 64, 64, 46); g.addColorStop(0, '#dedad0'); g.addColorStop(0.85, '#e9e5dc'); g.addColorStop(1, '#bdb8ad'); k.fillStyle = g; k.beginPath(); k.arc(64, 64, 45, 0, 7); k.fill(); k.fillStyle = '#2a2a2e'; for (const x of [46, 82]) { k.beginPath(); k.arc(x, 64, 6, 0, 7); k.fill(); } return texOf(c); })();
    const faces = []; for (const z of [-26.6, -25.72]) { plates.push(put(softBox(0.05, 0.8, 0.8, { r: 0.025, c: 2, flat: 2 }), WX + 0.02, 2.6, z), put(softBox(0.07, 0.62, 0.62, { r: 0.03, c: 2, flat: 2 }), WX + 0.04, 2.6, z)); faces.push(put(new THREE.PlaneGeometry(0.56, 0.56), WX + 0.077, 2.6, z, 0, PI / 2, 0)); }
    for (const z of [-53.7 + 0.5, -19.3 - 0.5]) plates.push(put(softBox(0.16, 13.6, 1.0, { r: 0.05, c: 2, flat: 2 }), WX + 0.06, 6.8, z));      // a door casing at each end, so the wall stops for a reason
    add(merge(plates), gloss, { cast: false }); add(merge(faces), new THREE.MeshStandardMaterial({ map: sockC, roughness: 0.4 }), { cast: false });

    // behind the stove: square white tiles
    const tileH = paint(512, 512, (x, y) => { const fx = (x % 128) / 128, fy = (y % 128) / 128, e = Math.min(fx, 1 - fx, fy, 1 - fy); return smooth(e, 0.02, 0.07); });
    const tileC = (() => { const c = canvas(512, 512), k = c.getContext('2d'); k.fillStyle = '#c9c2b4'; k.fillRect(0, 0, 512, 512); for (let j = 0; j < 4; j++) for (let i = 0; i < 4; i++) { const n = 236 + hash(i, j) * 12 | 0; k.fillStyle = `rgb(${n},${n - 2},${n - 8})`; k.beginPath(); k.roundRect(i * 128 + 4, j * 128 + 4, 120, 120, 5); k.fill(); } return texOf(c); })();
    const tileR = texOf(paint(512, 512, (x, y) => { const fx = (x % 128) / 128, fy = (y % 128) / 128, e = Math.min(fx, 1 - fx, fy, 1 - fy); return e < 0.035 ? 0.95 : 0.2; }), { srgb: false });
    const tiles = new THREE.BoxGeometry(0.4, 14, 13.4); put(tiles, SX + 9.95, 7, -47);
    add(boxUV(tiles, 0.2), new THREE.MeshStandardMaterial({ map: tileC, normalMap: texOf(normalFrom(tileH, 3), { srgb: false }), roughnessMap: tileR, roughness: 1 }), { cast: false });
  }

  /* ---------- set dressing: the things that lie around a living room and a kitchen ---------- */
  const cloths = [], tinted = [], woods = [], pagesG = [], brassG = [];     // gathered here, each list becomes one mesh at the end
  { // a floor lamp by the sofa's arm, its cord running to the wall
    const L = V3(SX - 9.9, 0, -27.4), ironM = new THREE.MeshStandardMaterial({ color: '#2b2b30', roughness: 0.42, metalness: 0.6 });
    // a heavy cast base with a stepped shoulder, on a thin felt pad
    add(put(lathe([[0.001, 0.02], [1.13, 0.02], [1.18, 0.05], [1.19, 0.11], [1.15, 0.17], [1.04, 0.2], [0.5, 0.25], [0.44, 0.29], [0.3, 0.31], [0.22, 0.36], [0.19, 0.5], [0.001, 0.5]], 56), L.x, 0, L.z), ironM);
    tinted.push(tint(put(new THREE.CylinderGeometry(1.1, 1.1, 0.024, 40), L.x, 0.012, L.z), '#4a4640'));
    const hoop = (R, r, y) => put(new THREE.TorusGeometry(R, r, 8, 48).rotateX(PI / 2), L.x, y, L.z);
    // the stem, a collar at the foot, a knuckle half way up, the cup under the shade and the shade's two rings
    add(merge([put(new THREE.CylinderGeometry(0.09, 0.09, 12.3, 16), L.x, 6.5, L.z), put(lathe([[0.1, 0.4], [0.23, 0.42], [0.24, 0.5], [0.2, 0.54], [0.2, 0.66], [0.14, 0.72], [0.1, 0.84]], 24), L.x, 0, L.z), put(lathe([[0.09, 6.3], [0.14, 6.34], [0.15, 6.5], [0.14, 6.66], [0.09, 6.7]], 20), L.x, 0, L.z), put(lathe([[0.1, 12.1], [0.24, 12.2], [0.3, 12.34], [0.26, 12.6], [0.12, 12.72], [0.12, 13.0], [0.001, 13.0]], 24), L.x, 0, L.z), hoop(2.05, 0.03, 12.2), hoop(1.6, 0.03, 14.7),
      ...[0, 1, 2].map((i) => put(new THREE.CylinderGeometry(0.018, 0.018, 1.62, 5).rotateZ(PI / 2).translate(0.8, 0, 0), L.x, 14.66, L.z, 0, i * PI * 2 / 3, 0))]), brass);
    const shade = add(put(lathe([[2.05, 12.2], [1.6, 14.7]], 48), L.x, 0, L.z), new THREE.MeshStandardMaterial({ color: '#efe3ca', emissive: '#ffc878', emissiveIntensity: 0.5, roughness: 1, side: THREE.DoubleSide, normalMap: again(weaveN, 22, 4) })); shade.castShadow = false;
    add(put(new THREE.SphereGeometry(0.34, 16, 12).scale(1, 1.25, 1), L.x, 13.4, L.z), new THREE.MeshBasicMaterial({ color: '#fff1cf' }), { cast: false, receive: false });      // the bulb, seen from below
    // the cord leaves the base through a grommet, snakes over the floor, climbs to the plug in a slack curve
    const cable = cord([[L.x - 1.12, 0.07, L.z + 0.12], [L.x - 1.3, 0.036, L.z + 0.3], [L.x - 1.5, 0.036, L.z + 0.8], [L.x - 0.95, 0.036, L.z + 1.45], [WX + 1.1, 0.036, -25.95], [WX + 0.72, 0.05, -26.3], [WX + 0.5, 0.4, -26.52], [WX + 0.4, 1.3, -26.6], [WX + 0.34, 2.0, -26.6], [WX + 0.32, 2.34, -26.6]], 0.034, 110, 6);
    const plug = lathe([[0.001, 0], [0.24, 0], [0.26, 0.02], [0.26, 0.07], [0.22, 0.1], [0.2, 0.26], [0.17, 0.3], [0.001, 0.3]], 24); put(plug, WX + 0.075, 2.6, -26.6, 0, 0, -PI / 2);      // a round plug: a flange on the plate, a body, and a sleeve where the cord leaves it
    const sleeve = lathe([[0.001, 0], [0.06, 0], [0.075, 0.05], [0.07, 0.2], [0.055, 0.32], [0.001, 0.32]], 12); put(sleeve, WX + 0.31, 2.52, -26.6, PI, 0, 0);
    const grommet = lathe([[0.001, 0], [0.07, 0], [0.07, 0.06], [0.05, 0.14], [0.001, 0.14]], 12); put(grommet, L.x - 1.14, 0.075, L.z + 0.12, 0, 0, PI / 2 - 0.12);
    const sw = softBox(0.5, 0.15, 0.24, { r: 0.07, c: 2, flat: 2 }); put(sw, L.x - 1.0, 0.075, L.z + 1.42, 0, 0.75, 0);
    add(merge([cable, plug, sleeve, grommet, sw]), new THREE.MeshStandardMaterial({ color: '#1e1e22', roughness: 0.55 }), { cast: false });
    tinted.push(tint(put(softBox(0.16, 0.05, 0.1, { r: 0.02, c: 1, flat: 1 }), L.x - 1.0, 0.16, L.z + 1.42, 0, 0.75, 0.2), '#ece6da'));      // the rocker on the foot switch
    sit(L.x, L.z, 3.2); sit(L.x - 1.0, L.z + 1.42, 0.8, 0.5, 0.75);
  }
  { // a phone charger: the white block in the socket, its cable across the floor, the plug end near the path
    const pts = [[WX + 0.22, 2.36, -25.72], [WX + 0.26, 1.3, -25.7], [WX + 0.34, 0.2, -25.55], [WX + 0.7, 0.026, -25.1], [SX - 9.6, 0.026, -24.3], [SX - 8.2, 0.026, -24.6], [SX - 7.3, 0.026, -23.5], [SX - 6.0, 0.026, -23.0], [SX - 5.1, 0.026, -23.7], [SX - 4.3, 0.026, -23.3], [SX - 3.7, 0.03, -22.75]];
    tinted.push(tint(cord(pts, 0.024, 140, 6), '#f1efe9'), tint(put(softBox(0.3, 0.56, 0.5, { r: 0.07, c: 3, flat: 2 }), WX + 0.22, 2.6, -25.72), '#f4f2ec'), tint(put(new THREE.CylinderGeometry(0.045, 0.034, 0.14, 10), WX + 0.22, 2.27, -25.72), '#dedbd3'));
    const end = V3(SX - 3.7, 0.03, -22.75), dir = V3(0.6, 0, 0.55).normalize(), ry = Math.atan2(dir.x, dir.z);
    tinted.push(tint(put(softBox(0.1, 0.07, 0.24, { r: 0.03, c: 2, flat: 1 }), end.x + dir.x * 0.1, 0.036, end.z + dir.z * 0.1, 0, ry, 0), '#f1efe9'), tint(put(softBox(0.07, 0.03, 0.1, { r: 0.014, c: 2, flat: 1 }), end.x + dir.x * 0.26, 0.036, end.z + dir.z * 0.26, 0, ry, 0), '#b9bcc2'));
  }
  { // a stack of clothbound books with reading glasses on top. Their spines face the room.
    const B = V3(SX - 7.0, 0, -26.5); let y = 0;
    const pageT = texOf((() => { const c = canvas(8, 64), k = c.getContext('2d'); k.fillStyle = '#efe7d6'; k.fillRect(0, 0, 8, 64); k.fillStyle = 'rgba(120,100,70,.35)'; for (let i = 0; i < 64; i += 4) k.fillRect(0, i, 8, 1); return c; })());
    for (const [w, h, d, color, ry, label, bar] of [[2.1, 0.3, 1.5, '#3a3a42', 0.2, '#e9e1d0', PAL.ink], [1.9, 0.24, 1.36, PAL.side, -0.14, null, null], [1.6, 0.28, 1.14, '#d8c8a6', 0.5, PAL.side, '#e9e1d0']]) {
      const b = 0.035, here = (g) => put(g, B.x, y, B.z, 0, ry, 0), zs = d / 2 + 0.016;                 // b: how thick a board is. zs: the face of the spine
      // two boards, a spine with rounded shoulders, and the page block set back from the three open edges
      const cover = merge([put(softBox(w, b, d, { r: 0.015, c: 2, flat: 2, uv: 3 }), 0, b / 2, 0), put(softBox(w, b, d, { r: 0.015, c: 2, flat: 2, uv: 3 }), 0, h - b / 2, 0), put(softBox(w, h, 0.1, { r: 0.045, c: 3, flat: 2, uv: 3 }), 0, h / 2, d / 2 - 0.035)]);
      cloths.push(tint(here(cover), color));
      pagesG.push(here(boxUV(new THREE.BoxGeometry(w - 0.12, h - 2 * b + 0.004, d - 0.14).translate(0, h / 2, -0.03), 6)));
      // gilt bands on the spine, and a title label on two of them
      for (const x of [-w / 2 + 0.16, -w / 2 + 0.22, w / 2 - 0.16, w / 2 - 0.22]) brassG.push(here(new THREE.BoxGeometry(0.022, h - 0.09, 0.006).translate(x, h / 2, zs)));
      if (label) { tinted.push(tint(here(new THREE.BoxGeometry(w * 0.34, h - 0.11, 0.006).translate(-w * 0.1, h / 2, zs)), label)); for (const [dy, len] of [[0.035, 0.24], [-0.03, 0.16]]) tinted.push(tint(here(new THREE.BoxGeometry(w * len, 0.028, 0.006).translate(-w * 0.1, h / 2 + dy, zs + 0.003)), bar)); }
      y += h;
    }
    add(merge(pagesG), new THREE.MeshStandardMaterial({ map: pageT, roughness: 0.9 }));
    // a ribbon marker hanging out of the top book
    { const ry = 0.5, c = Math.cos(ry), sn = Math.sin(ry), y0 = y - 0.28;
      cloths.push(tint(sheet(2, 12, (u, v) => { const t = v * 0.62, lx = 0.55 + t, out = Math.max(0, lx - 0.8), ly = y0 + 0.13 - Math.min(0.112, out * out * 5) + 0.01 * Math.sin(v * 9), lz = 0.18 + (u - 0.5) * 0.075 + out * 0.2; return V3(B.x + lx * c + lz * sn, ly, B.z - lx * sn + lz * c); }, 0.012, 0.3, 2), PAL.accent)); }
    // the glasses, standing on their rims and the ends of their arms
    const gl = [], hinge = [], pads = [], R = 0.21, onTop = (g) => put(g, B.x + 0.1, y, B.z + 0.2, 0, 0.9, 0);
    for (const s of [-1, 1]) {
      gl.push(put(new THREE.TorusGeometry(R, 0.019, 8, 40), s * 0.26, R + 0.019, 0)); gl.push(cord([[s * 0.5, R + 0.08, -0.03], [s * 0.52, R + 0.08, -0.4], [s * 0.5, R + 0.05, -0.95], [s * 0.48, 0.02, -1.16]], 0.014, 20, 5));
      gl.push(cord([[s * 0.44, R + 0.1, 0], [s * 0.5, R + 0.09, 0], [s * 0.5, R + 0.08, -0.03]], 0.016, 6, 5));                   // the lug from the rim to the hinge
      hinge.push(new THREE.BoxGeometry(0.03, 0.05, 0.07).translate(s * 0.5, R + 0.08, -0.055));
      hinge.push(cord([[s * 0.1, R + 0.02, -0.005], [s * 0.085, R - 0.03, -0.05], [s * 0.075, R - 0.07, -0.06]], 0.006, 6, 4));    // the wire that holds a nose pad
      pads.push(new THREE.SphereGeometry(0.03, 8, 6).scale(0.5, 1.2, 0.8).translate(s * 0.07, R - 0.08, -0.062));
    }
    gl.push(cord([[-0.07, R + 0.1, 0], [0, R + 0.15, 0.01], [0.07, R + 0.1, 0]], 0.016, 8, 5));
    add(onTop(merge(gl)), new THREE.MeshPhysicalMaterial({ color: '#3a2a20', roughness: 0.3, clearcoat: 0.6, clearcoatRoughness: 0.25 }), { cast: false });
    brassG.push(onTop(merge(hinge))); tinted.push(tint(onTop(merge(pads)), '#e9e3d6'));
    const lens = merge([-1, 1].map((s) => put(new THREE.CircleGeometry(R, 28), s * 0.26, R + 0.019, 0)));
    add(onTop(lens), new THREE.MeshPhysicalMaterial({ color: '#dfeaf2', transparent: true, opacity: 0.22, roughness: 0.05, side: THREE.DoubleSide, depthWrite: false }), { cast: false, receive: false });
    sit(B.x, B.z, 3.4, 2.8, 0.2);
  }
  { // a magazine on the floor, one corner curling
    const coverC = (() => { const c = canvas(256, 352), k = c.getContext('2d'); k.fillStyle = '#ece3d2'; k.fillRect(0, 0, 256, 352); const g = k.createLinearGradient(0, 90, 0, 300); g.addColorStop(0, PAL.face); g.addColorStop(1, PAL.side); k.fillStyle = g; k.fillRect(20, 92, 216, 204); k.fillStyle = PAL.accent; k.beginPath(); k.arc(168, 160, 34, 0, 7); k.fill(); k.fillStyle = '#ece3d2'; k.beginPath(); k.moveTo(20, 296); k.lineTo(100, 210); k.lineTo(150, 262); k.lineTo(190, 226); k.lineTo(236, 296); k.fill();
      k.fillStyle = PAL.ink; k.font = '700 58px Georgia, serif'; k.textBaseline = 'alphabetic'; k.fillText('home', 18, 70); k.font = '600 11px ui-monospace, Menlo, monospace'; k.fillText('ISSUE 14', 180, 34); k.fillRect(20, 312, 120, 5); k.fillRect(20, 324, 84, 5); return texOf(c); })();
    const M = V3(SX + 3.1, 0, -27.0), c = Math.cos(0.5), s = Math.sin(0.5);
    const mag = sheet(14, 18, (u, v) => { const x = (u - 0.5) * 1.75, z = (0.5 - v) * 2.4, k = Math.max(0, u + (1 - v) - 1.55) / 0.45; return V3(M.x + x * c + z * s, 0.04 + 0.2 * k * k + 0.006 * Math.sin(u * 7 + v * 5), M.z - x * s + z * c); }, 0.065);
    add(mag, new THREE.MeshPhysicalMaterial({ map: coverC, roughness: 0.45, clearcoat: 0.5, clearcoatRoughness: 0.3 })); sit(M.x, M.z, 2.6, 3.2, 0.5);
  }
  { // a pair of felt slippers in front of the sofa, toes pointing out into the room
    const wide = (a) => 0.4 + 0.045 * Math.cos(a) - 0.035 * Math.sin(a) * Math.sin(a), bend = (a) => 0.03 * Math.cos(a * 2);      // a foot shape: wider at the toes, a little curved
    const slipper = (mir, x0, z0, ry) => {
      const here = (g) => put(g, x0, 0, z0, 0, ry, 0);
      const sole = new THREE.Shape(); for (let i = 0; i < 48; i++) { const a = (mir > 0 ? i : 48 - i) / 48 * PI * 2, x = mir * (Math.sin(a) * wide(a) + bend(a)), z = Math.cos(a) * 1.1; i ? sole.lineTo(x, -z) : sole.moveTo(x, -z); }
      const soleG = new THREE.ExtrudeGeometry(sole, { depth: 0.07, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 3, curveSegments: 8 }); soleG.rotateX(-PI / 2); soleG.translate(0, 0.06, 0);      // the felt sole, its top at 0.16
      const treadG = new THREE.ExtrudeGeometry(sole, { depth: 0.022, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 1, curveSegments: 8 }); treadG.rotateX(-PI / 2); treadG.scale(1.03, 1, 1.012); treadG.translate(0, 0.008, 0);      // a thin rubber tread under it
      const inG = new THREE.ShapeGeometry(sole, 8); inG.rotateX(-PI / 2); inG.scale(0.94, 1, 0.96); inG.translate(0, 0.166, 0);
      const skin = (u, v0) => { const v = Math.pow(v0, 1.6), z = lerp(1.14, -0.12, v), a = Math.acos(clamp(z / 1.1, -1, 1)), w = Math.sin(a) * wide(a) + 0.035, b = PI * (mir > 0 ? u : 1 - u), h = (0.16 + 0.42 * smooth(v, 0, 0.8)) * Math.sqrt(smooth(v, 0, 0.06)); return V3(mir * (bend(a) - Math.cos(b) * w), 0.09 + Math.pow(Math.sin(b), 0.75) * h, z); };      // the rows crowd toward the toe, where it rounds down over the sole
      cloths.push(tint(here(sheet(18, 16, skin, 0.075, 6, 5)), '#8a8682'));
      // a rolled collar round the opening, and the seam up the middle of the toe
      const rim = []; for (let i = 0; i <= 18; i++) { const p = skin(i / 18, 1); p.z -= 0.012; p.y += 0.004; rim.push(p); }
      const seam = []; for (let i = 0; i <= 10; i++) { const p = skin(0.5, 0.06 + i * 0.094); p.y += 0.036; seam.push(p); }
      cloths.push(tint(here(cord(rim, 0.055, 44, 7)), '#6c6966'), tint(here(cord(seam, 0.013, 24, 4)), '#6c6966'));
      tinted.push(tint(here(soleG), '#b8b2a8'), tint(here(treadG), '#4b4640'), tint(here(inG), '#ece4d4'));
      sit(x0, z0, 1.5, 2.9, ry);
    };
    slipper(1, SX - 5.0, -27.2, 0.22); slipper(-1, SX - 3.75, -27.55, -0.3);
  }
  { // a rubber plant in a terracotta pot
    const P = V3(SX + 6.0, 0, -25.0);
    // fired clay: the rings the wheel left, and a chalky bloom where water has dried
    const clayC = (() => { const c = canvas(256, 256), k = c.getContext('2d'); k.fillStyle = '#b9714f'; k.fillRect(0, 0, 256, 256);
      strokes(c, 260, (k, x, y, s, t) => { k.strokeStyle = s > 0.5 ? `rgba(226,170,140,${0.04 + t * 0.07})` : `rgba(120,62,40,${0.04 + t * 0.08})`; k.lineWidth = 0.6 + s * 1.6; k.beginPath(); k.moveTo(x - 140, y); k.lineTo(x + 140, y + (t - 0.5) * 3); k.stroke(); });
      strokes(c, 60, (k, x, y, s, t) => { const g = k.createRadialGradient(x, y, 0, x, y, 10 + s * 22); g.addColorStop(0, `rgba(232,214,196,${0.05 + t * 0.1})`); g.addColorStop(1, 'rgba(232,214,196,0)'); k.fillStyle = g; k.fillRect(x - 40, y - 40, 80, 80); });
      return texOf(c, { rep: [3, 1] }); })();
    const clay = new THREE.MeshStandardMaterial({ map: clayC, roughness: 0.92 });
    add(merge([put(lathe([[0.001, 0.02], [1.0, 0.02], [1.05, 0.1], [1.3, 2.0], [1.4, 2.02], [1.44, 2.32], [1.38, 2.38], [1.26, 2.36], [1.22, 2.1], [0.001, 2.05]], 48), P.x, 0.1, P.z), put(lathe([[0.001, 0], [1.3, 0], [1.42, 0.06], [1.48, 0.22], [1.42, 0.24], [1.34, 0.12], [0.001, 0.1]], 48), P.x, 0, P.z)]), clay);
    const soil = new THREE.CircleGeometry(1.24, 32); soil.rotateX(-PI / 2); add(put(soil, P.x, 2.24, P.z), new THREE.MeshStandardMaterial({ color: '#3a2c22', roughness: 1 }), { cast: false });
    const stemC = new THREE.CatmullRomCurve3([V3(P.x, 2.2, P.z), V3(P.x + 0.15, 4.5, P.z - 0.1), V3(P.x - 0.1, 7, P.z + 0.1), V3(P.x + 0.1, 9.6, P.z)]);
    const leaves = [], stems = [new THREE.TubeGeometry(stemC, 30, 0.1, 8)];
    const leaf = (L, Wd) => { const n = 12, m = 6, pos = [], uv = [], idx = []; for (let j = 0; j <= n; j++) for (let i = 0; i <= m; i++) { const v = j / n, u = i / m * 2 - 1, w = Wd * Math.pow(Math.sin(PI * Math.pow(v, 0.85)), 0.8) * (1 - 0.25 * v); pos.push(u * w, Math.abs(u) * w * 0.28 - v * v * L * 0.3 + 0.06 * Math.sin(v * 9) * u * u, 0.25 + v * L); uv.push(i / m, v); } for (let j = 0; j < n; j++) for (let i = 0; i < m; i++) { const a = j * (m + 1) + i, b = a + 1, c = a + m + 1; idx.push(a, c, b, b, c, c + 1); } const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); g.setIndex(idx); g.computeVertexNormals(); return g; };
    for (let i = 0; i < 15; i++) { const t = 0.12 + i / 14 * 0.88, p = stemC.getPointAt(t), a = i * 2.4, pitch = lerp(0.2, -0.9, t) + rr(-0.15, 0.15), L = lerp(3.1, 1.7, t) * rr(0.9, 1.1); leaves.push(put(leaf(L, L * 0.27).rotateX(pitch), p.x, p.y, p.z, 0, a, 0)); stems.push(put(new THREE.CylinderGeometry(0.035, 0.045, 0.34, 6).rotateX(PI / 2).translate(0, 0, 0.12).rotateX(pitch), p.x, p.y, p.z, 0, a, 0)); }
    add(merge(leaves), new THREE.MeshPhysicalMaterial({ color: '#2f5238', roughness: 0.38, clearcoat: 0.35, clearcoatRoughness: 0.3, side: THREE.DoubleSide }));
    add(merge(stems), new THREE.MeshStandardMaterial({ color: '#4d5a36', roughness: 0.8 }));
    sit(P.x, P.z, 3.8);
  }
  { // lost under the sofa: a tennis ball and a pencil. On the rug: two wooden blocks.
    const bx = SX - 3.4, bz = Z.sofa - 0.5, R = 0.28;
    const felt = new THREE.SphereGeometry(R, 36, 24); put(felt, bx, R, bz);
    add(felt, new THREE.MeshPhysicalMaterial({ color: '#c7d943', roughness: 1, sheen: 1, sheenRoughness: 0.4, sheenColor: new THREE.Color('#f2ffb0'), bumpMap: again(heather, 6, 3), bumpScale: 0.6 }));
    const seam = []; for (let i = 0; i < 64; i++) { const t = i / 64 * PI * 2, a = 0.76 * R, b = 0.24 * R, c = 2 * Math.sqrt(a * b); seam.push(V3(bx + a * Math.cos(t) + b * Math.cos(3 * t), R + c * Math.sin(2 * t), bz + a * Math.sin(t) - b * Math.sin(3 * t))); }
    add(put(cord(seam, 0.013, 160, 5, true), 0, 0, 0), new THREE.MeshStandardMaterial({ color: '#f1efe4', roughness: 0.9 }), { cast: false }); sit(bx, bz, 1.0);
    const pen = [tint(new THREE.CylinderGeometry(0.034, 0.034, 1.2, 6), PAL.face), tint(new THREE.CylinderGeometry(0.008, 0.034, 0.12, 6).translate(0, 0.66, 0), '#d8b890'), tint(new THREE.CylinderGeometry(0.036, 0.036, 0.08, 10).translate(0, -0.64, 0), '#b9bcc2'), tint(new THREE.CylinderGeometry(0.034, 0.034, 0.07, 10).translate(0, -0.715, 0), '#d98f8a')];
    tinted.push(put(mergeTinted(pen.map((g) => g.toNonIndexed())), SX + 3.9, 0.034, Z.sofa + 0.5, 0, 0.5, PI / 2));
    // also down there: a coin, a glass marble, a hair grip, a toy brick and a few crumbs
    brassG.push(put(lathe([[0.001, 0], [0.108, 0], [0.114, 0.005], [0.114, 0.017], [0.108, 0.022], [0.098, 0.022], [0.092, 0.016], [0.001, 0.016]], 28), SX + 1.9, 0.003, Z.sofa + 1.35)); sit(SX + 1.9, Z.sofa + 1.35, 0.42);
    const swirlC = (() => { const c = canvas(128, 64), k = c.getContext('2d'); k.fillStyle = '#e9eef2'; k.fillRect(0, 0, 128, 64); k.lineCap = 'round'; for (const [col, w, ph] of [[PAL.face, 9, 0], [PAL.accent, 4, 1.3], [PAL.side, 5, 2.6]]) { k.strokeStyle = col; k.lineWidth = w; k.beginPath(); for (let x = -8; x <= 136; x += 4) k.lineTo(x, 32 + Math.sin(x / 128 * PI * 4 + ph) * 16); k.stroke(); } return texOf(c); })();
    add(put(new THREE.SphereGeometry(0.095, 24, 16), SX - 4.0, 0.095, Z.sofa + 1.05, 0.5, 0.3, 0.8), new THREE.MeshPhysicalMaterial({ map: swirlC, roughness: 0.05, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 2.2 })); sit(SX - 4.0, Z.sofa + 1.05, 0.4);
    tinted.push(tint(put(cord([[0, 0.012, 0], [0.5, 0.012, 0.012], [0.57, 0.014, 0.04], [0.5, 0.02, 0.07], [0.33, 0.012, 0.058], [0.22, 0.02, 0.075], [0.11, 0.012, 0.058], [0, 0.014, 0.072]], 0.0085, 40, 5), SX + 2.5, 0, Z.sofa - 2.0, 0, 0.9, 0), '#26262b'));
    const brick = [softBox(0.5, 0.26, 0.25, { r: 0.018, c: 2, flat: 1 })]; for (const x of [-0.125, 0.125]) brick.push(new THREE.CylinderGeometry(0.075, 0.075, 0.05, 14).translate(x, 0.155, 0));
    tinted.push(tint(put(merge(brick), SX - 5.9, 0.13, Z.sofa - 0.4, 0, 0.7, 0), PAL.accent)); sit(SX - 5.9, Z.sofa - 0.4, 0.8, 0.6, 0.7);
    for (let i = 0; i < 9; i++) tinted.push(tint(put(new THREE.IcosahedronGeometry(rr(0.012, 0.03), 0), SX + 2.3 + rr(-0.5, 0.5), 0.015, Z.sofa + 0.1 + rr(-0.4, 0.4), rr(0, 3), rr(0, 3), 0), '#cdb68c'));
    const blockC = (() => { const c = canvas(128, 128), k = c.getContext('2d'); k.fillStyle = '#e4cfa6'; k.fillRect(0, 0, 128, 128); k.strokeStyle = PAL.face; k.lineWidth = 7; k.strokeRect(13, 13, 102, 102); k.fillStyle = PAL.face; k.font = '900 76px Georgia, serif'; k.textAlign = 'center'; k.textBaseline = 'middle'; k.fillText('M', 64, 69); return texOf(c); })();
    const cubes = [[SX + 2.8, -39.5, 0.5], [SX + 3.45, -40.25, -0.3]].map(([x, z, ry]) => { sit(x, z, 0.9, 0.9, ry, RUG + 0.012); return put(new RoundedBoxGeometry(0.44, 0.44, 0.44, 4, 0.05), x, RUG + 0.22, z, 0, ry, 0); });
    add(merge(cubes), new THREE.MeshStandardMaterial({ map: blockC, roughness: 0.6 }));
  }
  { // by the left wall, across from the stove: a small dining table and a chair. From down here, a forest of legs.
    const T = V3(SX - 8.5, 0, -49.5), rod = (r0, r1, len) => new THREE.CylinderGeometry(r0, r1, len, 16);
    woods.push(put(softBox(5, 0.26, 6.5, { r: 0.07, c: 3, flat: 3, uv: 0.6 }), T.x, 6.13, T.z));
    for (const z of [-2.95, 2.95]) woods.push(put(softBox(4.3, 0.5, 0.12, { r: 0.03, c: 1, flat: 1, uv: 0.6 }), T.x, 5.75, T.z + z));
    for (const x of [-2.2, 2.2]) { woods.push(put(softBox(0.12, 0.5, 5.8, { r: 0.03, c: 1, flat: 1, uv: 0.6 }), T.x + x, 5.75, T.z)); for (const z of [-2.95, 2.95]) { woods.push(put(rod(0.22, 0.13, 6.0), T.x + x, 3.0, T.z + z)); sit(T.x + x, T.z + z, 0.8); } }
    const C = V3(SX - 8.3, 0, -45.1);                             // the chair, its back to the room
    woods.push(put(softBox(3.3, 0.22, 3.3, { r: 0.09, c: 3, flat: 3, top: 0.03, uv: 0.6 }), C.x, 3.7, C.z));
    for (const x of [-1.4, 1.4]) {
      woods.push(put(rod(0.13, 0.085, 3.6), C.x + x, 1.8, C.z - 1.4), put(rod(0.13, 0.085, 3.6), C.x + x, 1.8, C.z + 1.4), put(rod(0.085, 0.12, 4.3), C.x + x, 5.72, C.z + 1.52, 0.055, 0, 0));
      woods.push(put(rod(0.055, 0.055, 2.8), C.x + x, 1.25, C.z, PI / 2, 0, 0)); for (const z of [-1.4, 1.4]) sit(C.x + x, C.z + z, 0.6);
    }
    woods.push(put(rod(0.055, 0.055, 2.8), C.x, 1.6, C.z - 1.4, 0, 0, PI / 2), put(rod(0.055, 0.055, 2.8), C.x, 1.25, C.z + 1.4, 0, 0, PI / 2));
    woods.push(put(softBox(3.1, 0.62, 0.14, { r: 0.06, c: 2, flat: 2, uv: 0.6 }), C.x, 7.5, C.z + 1.62, 0.055, 0, 0), put(softBox(3.0, 0.3, 0.1, { r: 0.04, c: 2, flat: 2, uv: 0.6 }), C.x, 5.7, C.z + 1.52, 0.055, 0, 0));
    for (const z of [-1.4, 1.4]) woods.push(put(softBox(2.7, 0.32, 0.1, { r: 0.03, c: 1, flat: 1, uv: 0.6 }), C.x, 3.44, C.z + z)); for (const x of [-1.4, 1.4]) woods.push(put(softBox(0.1, 0.32, 2.7, { r: 0.03, c: 1, flat: 1, uv: 0.6 }), C.x + x, 3.44, C.z));      // the rails that hold the seat
    for (const [px, pz, r] of [[T.x - 2.2, T.z - 2.95, 0.13], [T.x - 2.2, T.z + 2.95, 0.13], [T.x + 2.2, T.z - 2.95, 0.13], [T.x + 2.2, T.z + 2.95, 0.13], [C.x - 1.4, C.z - 1.4, 0.085], [C.x - 1.4, C.z + 1.4, 0.085], [C.x + 1.4, C.z - 1.4, 0.085], [C.x + 1.4, C.z + 1.4, 0.085]]) tinted.push(tint(put(new THREE.CylinderGeometry(r * 0.95, r * 0.95, 0.03, 12), px, 0.015, pz), '#57524b'));
    add(merge(woods), wood('#c9ab80'));
  }
  if (cloths.length) add(mergeTinted(cloths), cloth('#ffffff', { vertexColors: true, sheen: 0.3 }));
  if (tinted.length) add(mergeTinted(tinted), painted);
  if (brassG.length) add(merge(brassG), brass, { cast: false });

  /* ---------- soft shadows where things touch the floor ---------- */
  {
    const quads = blobs.map(([x, z, w, d, turn, y]) => { const g = new THREE.PlaneGeometry(w, d); g.rotateX(-PI / 2); return put(g, x, y, z, 0, turn, 0); });
    if (quads.length) { const m = new THREE.Mesh(merge(quads), new THREE.MeshBasicMaterial({ map: blobT, color: '#1a1410', transparent: true, opacity: 0.42, depthWrite: false })); m.renderOrder = 2; group.add(m); }
  }

  const update = (T) => { for (const f of live) f(T); };
  return { group, keyObj, catBody, update };
}

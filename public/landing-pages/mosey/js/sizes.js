// The Colours stop: two sizes, four colours. One long stage with the three colours you are not wearing on the left and a
// Mosey XL on the right, a thin post between them with a brass mark at each height, and a printed plate under each.
// The card has a size switch. Pick XL and the robot you are walking grows to XL for as long as you are at this stop.
// js/main.js calls createSizes once, puts the group where the shop shelf used to be, and calls update() every frame.
// The switch's look is in css/style.css ("sizes"), its buttons are in index.html.
//   ?demo=1   clicks a colour, the XL and another colour for you, for recordings
export const XL = 1.58;      // the XL is the same robot, this much bigger: 22 cm to the base model's 14

export function createSizes(ctx) {
  const { THREE, RoundedBoxGeometry, scene, family, WAYS, createRobot, mats, at, DISPLAY, MONO, PAL } = ctx, [X, Z] = at;
  const group = new THREE.Group(); group.position.set(X, 0.65, Z);      // it pops up from 0.65 above the floor, the way the shelf did
  const F = -0.65, TOP = 0.6;                                            // the floor seen from inside the group, and how high the stage is
  const brass = new THREE.MeshStandardMaterial({ color: 0xb8924a, roughness: 0.32, metalness: 1 });
  const yellow = new THREE.MeshPhysicalMaterial({ color: PAL.accent, roughness: 0.38, clearcoat: 0.6, clearcoatRoughness: 0.25 });
  const add = (geo, mat, x, y, z) => { const m = new THREE.Mesh(geo, mat); m.castShadow = m.receiveShadow = true; m.position.set(x, y, z); group.add(m); return m; };
  add(new RoundedBoxGeometry(6.9, 0.12, 1.9, 3, 0.05), mats.ink, 0.1, F + 0.06, 0);                               // a dark foot
  add(new RoundedBoxGeometry(6.5, TOP - 0.17, 1.5, 4, 0.1), mats.blue, 0.1, F + 0.12 + (TOP - 0.17) / 2, 0);      // the stage
  add(new RoundedBoxGeometry(6.56, 0.05, 1.56, 2, 0.02), yellow, 0.1, F + TOP - 0.025, 0);                        // a yellow top edge
  add(new THREE.BoxGeometry(0.03, 1.95, 0.03), mats.ink, 1.28, F + TOP + 0.975, -0.45);                           // the post between the two sizes
  for (const h of [1.15, 1.15 * XL]) add(new THREE.BoxGeometry(0.5, 0.025, 0.03), brass, 1.28, F + TOP + h, -0.45);      // and a mark at the top of each head
  // a printed plate: a name, and a line under it
  const plate = (name, sub, x) => {
    const cv = document.createElement('canvas'); cv.width = 512; cv.height = 90; const k = cv.getContext('2d'), tex = new THREE.CanvasTexture(cv); tex.colorSpace = THREE.SRGBColorSpace; tex.anisotropy = 8;
    const draw = () => { k.fillStyle = PAL.paper; k.fillRect(0, 0, 512, 90); k.strokeStyle = PAL.ink; k.lineWidth = 10; k.strokeRect(5, 5, 502, 80); k.fillStyle = PAL.ink; k.textAlign = 'center'; k.textBaseline = 'middle';
      k.font = `36px ${DISPLAY}`; k.fillText(name.toUpperCase(), 256, 33); k.font = `600 18px ${MONO}`; k.fillText(sub.toUpperCase(), 256, 67); tex.needsUpdate = true; };
    draw(); document.fonts?.ready.then(draw);      // once more when the page's own typeface has arrived
    const m = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 0.3), new THREE.MeshBasicMaterial({ map: tex, toneMapped: false })); m.position.set(x, F + 0.33, 0.76); group.add(m);
  };
  plate('Mosey', '14 cm · $149', -1.2); plate('Mosey XL', '22 cm · $249', 2.35);
  [-2.35, -1.2, -0.05].forEach((x, i) => { family[i].r.root.position.set(X + x, TOP, Z + 0.05); family[i].r.root.rotation.y = -0.1 + i * 0.1; });
  const big = createRobot(); big.root.position.set(X + 2.35, TOP, Z); big.root.rotation.y = -0.18; big.root.scale.setScalar(XL); big.root.visible = false; scene.add(big.root);

  // the card's size switch
  const buttons = [...document.querySelectorAll('.size-sw button')], line = document.getElementById('sizeline');
  const LINES = { base: '14 cm. Walks 6 hours. Puts 40 inches on a wall.', xl: '22 cm. Walks 12 hours. Puts 80 inches on a wall, and carries your tea.' };
  let size = 'base', grow = 1, lastWay = null;
  function setSize(s) {
    size = s; line.textContent = LINES[s];
    buttons.forEach((b) => { const on = b.dataset.size === s; b.classList.toggle('is-on', on); b.setAttribute('aria-pressed', on); });
    ctx.robot.hop(s === 'xl' ? 5 : 3); big.hop(s === 'xl' ? 5 : 2.5);
  }
  buttons.forEach((b) => b.addEventListener('click', () => setSize(b.dataset.size)));

  // ?demo=1: once the card is up, a colour, then the XL, then another colour
  const DEMO = new URLSearchParams(location.search).has('demo'), card = document.querySelector('.size-sw').closest('.copy'), plan = [[1.4, 'mint'], [3.2, 'xl'], [5.4, 'sunny']];
  let t0 = 0, n = 0;
  function demo() {
    if (!card.classList.contains('is-on')) { t0 = 0; n = 0; return; }
    t0 ||= performance.now(); const t = (performance.now() - t0) / 1000;
    while (n < plan.length && t > plan[n][0]) { const k = plan[n++][1]; if (k === 'xl') setSize('xl'); else document.querySelector(`.swatches button[data-way="${k}"]`)?.click(); }
  }

  return { group, update({ way, dt, T, d, M }) {
    if (way !== lastWay) { lastWay = way; big.setWay(way); }                               // the XL wears the colour you picked
    const here = d > M.gate - 1 && d < M.price + 0.6;                                      // you are only XL while you are at this stop
    grow += ((here && size === 'xl' ? XL : 1) - grow) * (1 - Math.exp(-7 * dt));
    ctx.robot.root.scale.setScalar(Math.abs(grow - 1) > 0.002 ? grow : 1);
    const lead = family[0].r.root; big.root.visible = lead.visible;                         // it comes and goes with the others
    if (big.root.visible) { big.root.scale.setScalar(XL * lead.scale.x); big.update({ dist: 0, speed: 0, air: -1, falling: false, idleFor: 0, look: { yaw: 0.25, pitch: 0 }, act: size === 'xl' ? { name: 'wave', t: 0 } : null, dt, time: T + 3.1 }); }
    if (DEMO) demo();
  } };
}

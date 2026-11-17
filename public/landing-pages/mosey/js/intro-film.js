// The film Mosey projects right after it says hello: how it helps at home.
// It is drawn in code for now, a stand-in for the real film. One function paints any moment of it:
//   u   0..1 through the whole film (the page's scroll drives it)
//   t   seconds, for the small movements (steam, a blinking light, a cat breathing)
//   on  0..1, the projector warming up: 0 is the blank white screen it finds, 1 is the full picture
const W = 1024, H = 576, TAU = Math.PI * 2;
const cl = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ss = (x, a, b) => { const t = cl((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const SILVER = '#c6c9cf', SHADE = '#9a9da5', BRASS = '#c9982e', DARK = '#101014', BLANK = '#f1ede3';

export function createIntroFilm({ PAL, DISPLAY, MONO }) {
  const rr = (k, x, y, w, h, r, fill) => { k.fillStyle = fill; k.beginPath(); k.roundRect(x, y, w, h, r); k.fill(); };
  const dot = (k, x, y, r, fill) => { k.fillStyle = fill; k.beginPath(); k.arc(x, y, r, 0, TAU); k.fill(); };

  // Mosey as it is now: silver, brass rings, one lens. (x, y) is the floor under its feet, s is its height.
  function mosey(k, x, y, s, { step = 0, wave = 0, glow = 0 } = {}) {
    const walking = step !== 0, bob = walking ? Math.abs(Math.sin(step)) * s * 0.02 : 0;
    k.save(); k.translate(x, y);
    k.fillStyle = 'rgba(20,16,10,0.2)'; k.beginPath(); k.ellipse(0, 0, s * 0.3, s * 0.045, 0, 0, TAU); k.fill();
    for (const side of [-1, 1]) {                                                          // legs and feet
      const ph = step + (side > 0 ? Math.PI : 0), lift = walking ? Math.max(0, Math.sin(ph)) * s * 0.05 : 0, fwd = walking ? Math.cos(ph) * s * 0.03 : 0;
      rr(k, side * s * 0.1 - s * 0.045 + fwd, -s * 0.33 - bob, s * 0.09, s * 0.28 - lift + bob, s * 0.02, SHADE);
      rr(k, side * s * 0.1 - s * 0.085 + fwd, -s * 0.075 - lift, s * 0.17, s * 0.075, s * 0.03, SILVER);
    }
    k.translate(0, -bob);
    k.lineCap = 'round'; k.lineWidth = s * 0.07; k.strokeStyle = SHADE;                   // arms
    k.beginPath(); k.moveTo(-s * 0.24, -s * 0.54); k.lineTo(-s * 0.3, -s * 0.36); k.stroke();
    k.beginPath(); k.moveTo(s * 0.24, -s * 0.54);
    if (wave) { const a = -1.05 + Math.sin(wave) * 0.4; k.lineTo(s * 0.24 + Math.cos(a) * s * 0.22, -s * 0.54 + Math.sin(a) * s * 0.22); } else k.lineTo(s * 0.3, -s * 0.36);
    k.stroke();
    rr(k, -s * 0.21, -s * 0.6, s * 0.42, s * 0.3, s * 0.06, SILVER);                     // body, with the speaker ring
    rr(k, -s * 0.21, -s * 0.37, s * 0.42, s * 0.07, s * 0.03, SHADE);
    dot(k, 0, -s * 0.48, s * 0.062, BRASS); dot(k, 0, -s * 0.48, s * 0.045, '#3a3a40');
    rr(k, -s * 0.07, -s * 0.645, s * 0.14, s * 0.055, s * 0.01, BRASS);                  // neck
    rr(k, -s * 0.24, -s * 0.91, s * 0.48, s * 0.28, s * 0.07, SILVER);                   // head, face and lens
    rr(k, -s * 0.185, -s * 0.875, s * 0.37, s * 0.21, s * 0.04, DARK);
    dot(k, 0, -s * 0.77, s * 0.078, BRASS); dot(k, 0, -s * 0.77, s * 0.058, '#050507');
    dot(k, -s * 0.02, -s * 0.79, s * (0.016 + glow * 0.03), glow ? '#fff3c4' : '#fff');
    k.fillStyle = DARK; k.fillRect(-s * 0.008, -s * 0.975, s * 0.016, s * 0.07); dot(k, 0, -s * 0.985, s * 0.026, BRASS);      // antenna
    k.restore();
  }
  // the three lines every scene carries: a number, what it does, and the small print
  function caption(k, f, no, title, small, col, sub) {
    const a = ss(f, 0.05, 0.2), dy = (1 - a) * 26;
    k.globalAlpha = a; k.fillStyle = sub; k.font = `600 22px ${MONO}`; k.fillText(no, 64, 410 + dy);
    k.fillStyle = col; k.font = `84px ${DISPLAY}`; k.fillText(title, 60, 488 + dy);
    k.fillStyle = sub; k.font = `600 20px ${MONO}`; k.fillText(small, 64, 528 + dy); k.globalAlpha = 1;
  }
  // what it says, in a bubble with a tail toward (tx)
  function bubble(k, a, x, y, text, bg, fg, tx = x + 40, up = false) {
    if (a <= 0) return;
    k.save(); k.globalAlpha = a; k.translate(0, (1 - a) * 14); k.font = `30px ${DISPLAY}`;
    const w = k.measureText(text).width + 48;
    rr(k, x, y, w, 62, 31, bg); k.fillStyle = bg; k.beginPath(); if (up) { k.moveTo(tx - 14, y + 4); k.lineTo(tx, y - 26); k.lineTo(tx + 20, y + 6); } else { k.moveTo(tx - 14, y + 58); k.lineTo(tx, y + 88); k.lineTo(tx + 20, y + 56); } k.fill();
    k.fillStyle = fg; k.fillText(text, x + 24, y + 42); k.restore();
  }

  const scenes = [
    { len: 0.07, fg: null, draw(k, f, t) {                                               // the leader: 3, 2, 1
      k.fillStyle = '#16161c'; k.fillRect(0, 0, W, H);
      const n = 3 - Math.min(2, Math.floor(f * 3)), g = (f * 3) % 1;
      k.strokeStyle = 'rgba(255,248,230,0.35)'; k.lineWidth = 3; k.beginPath(); k.moveTo(0, H / 2); k.lineTo(W, H / 2); k.moveTo(W / 2, 0); k.lineTo(W / 2, H); k.stroke();
      k.fillStyle = 'rgba(255,248,230,0.14)'; k.beginPath(); k.moveTo(W / 2, H / 2); k.arc(W / 2, H / 2, 420, -Math.PI / 2, -Math.PI / 2 + g * TAU); k.fill();
      k.strokeStyle = '#fff8e6'; k.lineWidth = 6; for (const r of [150, 190]) { k.beginPath(); k.arc(W / 2, H / 2, r, 0, TAU); k.stroke(); }
      k.fillStyle = '#fff8e6'; k.textAlign = 'center'; k.font = `230px ${DISPLAY}`; k.fillText(String(n), W / 2, H / 2 + 82);
      k.font = `600 20px ${MONO}`; k.fillText('GOOD COMPANY  ·  REEL 01  ·  MOSEY AT HOME', W / 2, 60); k.textAlign = 'left';
    } },
    { len: 0.19, fg: PAL.ink, draw(k, f, t) {                                            // hello
      k.fillStyle = '#fff8e6'; k.fillRect(0, 0, W, H);
      const a = ss(f, 0.04, 0.2), b = ss(f, 0.14, 0.3), c = ss(f, 0.3, 0.45), d = ss(f, 0.5, 0.65);
      k.font = `118px ${DISPLAY}`; k.globalAlpha = a; k.fillStyle = PAL.ink; k.fillText('Hi, I\'m', 64, 236 + (1 - a) * 30);
      k.globalAlpha = b; k.fillStyle = PAL.deep; k.fillText('Mosey.', 64, 356 + (1 - b) * 30);
      k.font = `600 24px ${MONO}`; k.fillStyle = PAL.ink; k.globalAlpha = c; k.fillText('A SMALL AI COMPANION THAT WALKS.', 68, 424);
      k.globalAlpha = d; k.fillStyle = PAL.deep; k.fillText('THIS IS WHAT I DO AT HOME.', 68, 462); k.globalAlpha = 1;
      const walk = ss(f, 0, 0.3), x = 1140 - walk * 330;
      mosey(k, x, 496, 300, { step: walk < 1 ? f * 46 : 0, wave: walk >= 1 ? t * 8 : 0 });
    } },
    { len: 0.2, fg: PAL.ink, draw(k, f, t) {                                             // in the kitchen: a timer
      k.fillStyle = '#d7e6dc'; k.fillRect(0, 0, W, H);
      for (let x = 0; x < W; x += 64) for (let y = 0; y < 300; y += 64) if (((x + y) / 64) % 2) { k.fillStyle = 'rgba(255,255,255,0.28)'; k.fillRect(x, y, 64, 64); }      // tiles
      rr(k, -20, 318, W + 40, 300, 0, '#f6efe2'); k.fillStyle = '#d9cdb8'; k.fillRect(0, 318, W, 10);                                                                    // the counter
      rr(k, 650, 228, 190, 92, 14, '#2a2a31'); rr(k, 636, 214, 218, 22, 10, '#3a3a44'); rr(k, 726, 198, 38, 18, 8, '#3a3a44');                                             // a pot
      rr(k, 610, 244, 44, 16, 8, '#2a2a31'); rr(k, 836, 244, 44, 16, 8, '#2a2a31');
      k.strokeStyle = 'rgba(255,255,255,0.85)'; k.lineWidth = 9; k.lineCap = 'round';                                                                                     // steam
      for (let j = 0; j < 3; j++) { k.beginPath(); for (let i = 0; i <= 10; i++) { const y = 186 - i * 13, x = 700 + j * 46 + Math.sin(i * 0.7 + t * 2.4 + j * 2) * (4 + i * 1.4); i ? k.lineTo(x, y) : k.moveTo(x, y); } k.globalAlpha = 0.5 + 0.3 * Math.sin(t * 1.7 + j); k.stroke(); }
      k.globalAlpha = 1;
      const secs = 540 - Math.floor(f * 16), cx = 912, cy = 168;                                                                                                          // the timer it is keeping
      dot(k, cx, cy, 78, '#fff'); k.strokeStyle = 'rgba(21,21,26,0.12)'; k.lineWidth = 10; k.beginPath(); k.arc(cx, cy, 62, 0, TAU); k.stroke();
      k.strokeStyle = PAL.deep; k.beginPath(); k.arc(cx, cy, 62, -Math.PI / 2, -Math.PI / 2 + TAU * (secs / 600)); k.stroke();
      k.fillStyle = PAL.ink; k.textAlign = 'center'; k.font = `40px ${DISPLAY}`; k.fillText(`${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, '0')}`, cx, cy + 15); k.textAlign = 'left';
      mosey(k, 520, 320, 150, { wave: f > 0.35 && f < 0.7 ? t * 7 : 0 });
      bubble(k, ss(f, 0.32, 0.42), 250, 96, 'Nine minutes.', PAL.accent, PAL.onAccent, 470);
      caption(k, f, '01', 'I keep time.', 'TIMERS, REMINDERS, THE WEATHER', PAL.ink, 'rgba(21,21,26,0.62)');
    } },
    { len: 0.2, fg: PAL.ink, draw(k, f, t) {                                             // in the living room: the keys under the sofa
      k.fillStyle = '#f2dcc0'; k.fillRect(0, 0, W, H); rr(k, -20, 330, W + 40, 300, 0, '#e6caa2');
      rr(k, 500, 70, 470, 150, 30, '#9c8a72'); rr(k, 456, 150, 86, 150, 26, '#a8957c'); rr(k, 928, 150, 86, 150, 26, '#a8957c');                                           // a sofa, far bigger than Mosey
      rr(k, 520, 190, 215, 76, 22, '#b3a088'); rr(k, 742, 190, 215, 76, 22, '#b3a088'); rr(k, 470, 250, 530, 46, 12, '#a8957c');
      k.fillStyle = 'rgba(30,22,14,0.5)'; k.fillRect(486, 296, 498, 44); rr(k, 486, 294, 22, 46, 4, '#2a2a31'); rr(k, 962, 294, 22, 46, 4, '#2a2a31');                     // the dark under it
      const kx = 850, ky = 328, found = ss(f, 0.55, 0.68);                                                                                                                 // the keys
      for (let j = 0; j < 2; j++) { const p = (t * 0.8 + j * 0.5) % 1; k.strokeStyle = PAL.accent; k.globalAlpha = (1 - p) * 0.9; k.lineWidth = 4; k.beginPath(); k.ellipse(kx, ky, 12 + p * 60, 4 + p * 16, 0, 0, TAU); k.stroke(); }
      k.globalAlpha = 1; k.strokeStyle = PAL.accent; k.lineWidth = 5; k.beginPath(); k.arc(kx - 10, ky - 4, 8, 0, TAU); k.stroke(); k.fillStyle = PAL.accent; k.fillRect(kx - 2, ky - 7, 26, 5); k.fillRect(kx + 14, ky - 2, 5, 7); k.fillRect(kx + 20, ky - 2, 4, 6);
      const walk = ss(f, 0.08, 0.6); mosey(k, 300 + walk * 470, 338, 40, { step: walk < 1 ? f * 60 : 0, glow: 1 });
      bubble(k, found, 716, 374, 'Found them.', PAL.ink, PAL.accent, 836, true);
      caption(k, f, '02', 'I find things.', 'KEYS, REMOTE, THE OTHER SOCK', PAL.ink, 'rgba(21,21,26,0.62)');
    } },
    { len: 0.2, fg: '#fff', draw(k, f, t) {                                              // at night: the rounds
      k.fillStyle = PAL.night; k.fillRect(0, 0, W, H); rr(k, -20, 330, W + 40, 300, 0, '#181c40');
      rr(k, 420, 50, 190, 200, 10, '#232a5c'); dot(k, 560, 106, 30, '#f4ecd0'); dot(k, 574, 98, 26, '#232a5c'); k.fillStyle = '#0b0e26'; k.fillRect(511, 50, 8, 200); k.fillRect(420, 146, 190, 8);   // a window and the moon
      rr(k, 820, 130, 230, 220, 12, '#3b4170'); rr(k, 812, 118, 246, 20, 8, '#12142c'); rr(k, 846, 200, 150, 110, 10, '#12142c');                                           // the stove
      for (let i = 0; i < 3; i++) dot(k, 862 + i * 44, 168, 13, '#12142c');
      dot(k, 1000, 168, 8, Math.sin(t * 3) > -0.5 ? '#35d07f' : '#1f6b45');
      k.fillStyle = '#0a0c20'; k.beginPath(); k.ellipse(660, 322, 74, 30, 0, 0, TAU); k.fill(); dot(k, 722, 314, 22, '#0a0c20');                                             // the cat, asleep
      k.beginPath(); k.moveTo(708, 300); k.lineTo(712, 280); k.lineTo(724, 296); k.moveTo(726, 296); k.lineTo(738, 280); k.lineTo(740, 302); k.fill();
      k.fillStyle = 'rgba(255,255,255,0.5)'; k.font = `600 20px ${MONO}`; for (let j = 0; j < 3; j++) { const p = (t * 0.35 + j / 3) % 1; k.globalAlpha = (1 - p) * 0.8; k.fillText('z', 742 + p * 30, 276 - p * 60); } k.globalAlpha = 1;
      const x = 180 + ss(f, 0, 0.7) * 150, sweep = Math.sin(t * 0.9) * 0.16, ly = 332 - 150 * 0.77;                                                                         // Mosey and the light from its lens
      const g = k.createLinearGradient(x, 0, x + 620, 0); g.addColorStop(0, 'rgba(255,226,160,0.5)'); g.addColorStop(1, 'rgba(255,226,160,0)');
      k.fillStyle = g; k.beginPath(); k.moveTo(x, ly); k.lineTo(x + 620, ly - 150 + sweep * 620); k.lineTo(x + 620, ly + 110 + sweep * 620); k.fill();
      mosey(k, x, 332, 150, { step: f < 0.7 ? f * 40 : 0, glow: 1 });
      bubble(k, ss(f, 0.45, 0.56), 596, 62, 'Stove: off.', PAL.accent, PAL.onAccent, 800);
      caption(k, f, '03', 'I keep watch.', 'THE STOVE, THE WINDOWS, THE CAT', '#fff', 'rgba(255,255,255,0.62)');
    } },
    { len: 0.14, fg: '#fff', draw(k, f, t) {                                             // and that's it
      k.fillStyle = PAL.deep; k.fillRect(0, 0, W, H);
      const a = ss(f, 0.05, 0.25), b = ss(f, 0.2, 0.4), c = ss(f, 0.45, 0.6);
      k.font = `118px ${DISPLAY}`; k.globalAlpha = a; k.fillStyle = '#fff'; k.fillText('That\'s me.', 64, 236 + (1 - a) * 30);
      k.globalAlpha = b; k.fillStyle = PAL.accent; k.fillText('Shall we?', 64, 356 + (1 - b) * 30);
      k.globalAlpha = c; k.fillStyle = '#fff'; k.font = `600 24px ${MONO}`; k.fillText('SCROLL ON. I\'LL GET THE LIGHTS.', 68, 424); k.globalAlpha = 1;
      mosey(k, 810, 496, 300, { wave: t * 8 });
    } },
  ];
  let acc = 0; for (const s of scenes) { s.at = acc; acc += s.len; }
  let shade = null;

  // vid: the real film, when it has loaded. Then its frames are the picture, and the drawn scenes are only the fallback.
  return function paint(k, u, t, on = 1, vid = null) {
    k.setTransform(1, 0, 0, 1, 0, 0); k.globalAlpha = 1; k.textAlign = 'left'; k.textBaseline = 'alphabetic';
    if (on <= 0.002) { k.fillStyle = BLANK; k.fillRect(0, 0, W, H); return; }
    let fg, total = 42;
    if (vid) {
      k.drawImage(vid, 0, 0, W, H); fg = '#fff'; total = Math.round(vid.duration) || 30; u = cl(vid.currentTime / (vid.duration || 30), 0, 0.9999) * acc;
      const g = k.createLinearGradient(0, 0, 0, 90); g.addColorStop(0, 'rgba(0,0,0,0.4)'); g.addColorStop(1, 'rgba(0,0,0,0)'); k.fillStyle = g; k.fillRect(0, 0, W, 90);
    } else {
      u = cl(u, 0, 0.9999) * acc;
      let i = scenes.length - 1; while (i > 0 && u < scenes[i].at) i--;
      const s = scenes[i], f = (u - s.at) / s.len, next = scenes[i + 1], x = next ? ss(f, 0.9, 1) : 0;
      k.save(); s.draw(k, f, t); k.restore();
      if (x > 0) { k.save(); k.globalAlpha = x; k.translate((1 - x) * 90, 0); next.draw(k, 0, t); k.restore(); }
      fg = (x > 0.5 && next ? next.fg : s.fg);
    }
    if (fg) {                                                                            // what a film has round its edge: a title, the clock, how far in you are
      const now = Math.floor((u / acc) * total);
      k.fillStyle = fg; k.globalAlpha = 0.72; k.font = `600 17px ${MONO}`; if (!vid) { dot(k, 70, 42, 5, fg); k.fillText('MOSEY AT HOME', 86, 48); }
      if (!vid) { k.textAlign = 'right'; k.fillText(`0:${String(now).padStart(2, '0')} / 0:${total}`, 960, 48); k.textAlign = 'left'; }      // the real film's clock is in the corner of the page, where it is sharp
      k.globalAlpha = 0.22; k.fillRect(64, 552, 896, 4); k.globalAlpha = 0.9; k.fillRect(64, 552, 896 * (u / acc), 4); k.globalAlpha = 1;
    }
    if (!shade) { shade = k.createRadialGradient(W / 2, H / 2, 300, W / 2, H / 2, 640); shade.addColorStop(0, 'rgba(0,0,0,0)'); shade.addColorStop(1, 'rgba(0,0,0,0.2)'); }
    k.fillStyle = shade; k.fillRect(0, 0, W, H);                                         // a projector is brightest in the middle
    if (on < 1) { k.globalAlpha = 1 - on; k.fillStyle = BLANK; k.fillRect(0, 0, W, H); k.globalAlpha = 1; }
  };
}

// The sound of the walk. Nothing here is a recording: every sound is made in the browser as you scroll, so it follows the scroll.
// The page is a music box and the scroll is its crank. Stop scrolling and it goes quiet.
//   the steps   one soft tap each time a foot comes down. They come from the robot's own walk cycle, so they match what you see
//   the tune    a slow line of plucked notes, one every little stretch of the walk. Scroll back and it plays backwards
//   the bed     four held notes under everything. They change with the chapter, swell while you scroll and sink when you stop
//   the air     a breath of noise that follows how fast you scroll, and turns into wind on the jumps and the last fall
//   moments     a card switching on, a thing it locks on to through its lens, a notification on your phone, the buttons
// It starts when you press PRESS, or with the switch in the top bar, and that switch turns all of the page's sound off again.
// It all goes through the page's one volume (sfx in js/main.js). The switch's look is in css/style.css ("the sound switch").
//   ?sound=1   starts it without a press, for recordings (a normal browser still wants a click first)
const Q = new URLSearchParams(location.search);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v)), sat = (v) => clamp(v, 0, 1);
const hz = (semi) => 293.66 * 2 ** (semi / 12);      // a note, counted in semitones up from the D above middle C

// How loud each part is. 1 would be as loud as the page can go. The recorded sounds (the press, the landings) sit a little above these
const VOL = { bed: 0.03, step: 0.05, tune: 0.075, chime: 0.06, air: 0.02, wind: 0.07, ui: 0.05, ping: 0.1 };

// The chapters. chord: the four notes held under it. lp: how bright the bed is (Hz). tune: how loud the plucked line is here,
// oct: how high it plays, ring: how long each note rings (s), dull: muffled steps, because you are inside its head
const SCENES = {
  day:   { chord: [-12, -5, 4, 2], lp: 820, tune: 1, oct: 0, ring: 0.9 },                       // D, A, F sharp, E: home
  night: { chord: [-15, -8, 0, 7], lp: 560, tune: 0.8, oct: 0, ring: 1.5 },                     // B, F sharp, D, A: the lights are out
  lens:  { chord: [-12, -7, -3, 2], lp: 400, tune: 0.55, oct: 12, ring: 0.3, dull: true },      // D, G, B, E: low and close, with short high blips
  proj:  { chord: [-12, -7, -3, 4], lp: 430, tune: 0, oct: 0, ring: 1 },                        // nearly the same, held still: the film has the floor
  show:  { chord: [-17, -10, 1, -3], lp: 980, tune: 1, oct: 0, ring: 1 },                       // A, E, C sharp, B: brighter, and it wants to go home
  sky:   { chord: [-12, -5, 4, 7], lp: 1500, tune: 1, oct: 12, ring: 1.3 },                     // D again, an octave of air above it
};
// The tune, in semitones from D. Five notes only (D, E, F sharp, A, B), so no two of them can clash. null is a rest
const TUNE = [0, null, 4, 7, null, 4, 9, null, 7, null, 4, 2, null, -5, 0, null, 7, null, 9, 12, null, 9, 7, null, 4, null, 7, 2, null, 0, -3, null];
const GAP = 1.5;      // how far you walk between two notes of it

// the switch in the top bar: four bars that move while the sound is on
const sw = Object.assign(document.createElement('button'), { className: 'snd', id: 'snd', type: 'button', innerHTML: '<i></i><i></i><i></i><i></i><span class="sr">Sound</span>' });
sw.setAttribute('aria-pressed', 'false'); sw.title = 'Sound';
document.querySelector('.bar .btn').before(sw);

let on = false, G = null;      // G: everything that makes sound, built the first time it is turned on
function setOn(v) {
  const m = window.__mosey; if (!m) return;
  on = v; m.sfx.set(v); sw.setAttribute('aria-pressed', v); document.body.classList.toggle('snd-on', v);
  if (v && !G && m.sfx.ctx) G = build(m.sfx.ctx, m.sfx.out);
  if (G) G.bus.gain.setTargetAtTime(v ? 1 : 0, G.ctx.currentTime, v ? 0.5 : 0.05);
}
sw.addEventListener('click', () => { setOn(!on); if (on) G?.tick(); });
// PRESS turns it on. Caught on the way down to the button, so the volume is open before the button's own click sound plays
document.addEventListener('click', (e) => { if (!on && e.target.closest?.('#unbox')) setOn(true); }, true);
document.addEventListener('visibilitychange', () => { const c = window.__mosey?.sfx.ctx; if (!c) return; if (document.hidden) c.suspend(); else if (on) c.resume(); });
if (Q.has('sound')) { const t = setInterval(() => { if (window.__mosey?.boot.firstFrame) { clearInterval(t); setOn(true); } }, 100); }

// The room and the noise are two seconds of random numbers each. Making them takes a moment, so it is done ahead, in the quiet
// seconds while the intro plays. Done inside the click on PRESS, it made that click the longest frame of the page on a slow phone.
const PRE = { rate: 48000, room: null, hiss: null };
const roomSide = (rate) => { const n = Math.floor(rate * 2.2), a = new Float32Array(n); let lp = 0; for (let i = 0; i < n; i++) { lp += (Math.random() * 2 - 1 - lp) * 0.3; a[i] = lp * (1 - i / n) ** 3.4; } return a; };
const noise = (rate) => { const a = new Float32Array(rate * 2); for (let i = 0; i < a.length; i++) a[i] = Math.random() * 2 - 1; return a; };
{ const idle = (f) => (window.requestIdleCallback ? requestIdleCallback(f, { timeout: 3000 }) : setTimeout(f, 60));      // three small jobs, each when the page has a free moment
  setTimeout(() => idle(() => { const l = roomSide(PRE.rate); idle(() => { PRE.room = [l, roomSide(PRE.rate)]; idle(() => { PRE.hiss = noise(PRE.rate); }); }); }), 1200); }

function build(ctx, out) {
  // everything here goes into one bus, through a gentle limiter, into the page's volume
  const bus = ctx.createGain(), lim = ctx.createDynamicsCompressor(); bus.gain.value = 0;
  lim.threshold.value = -22; lim.knee.value = 14; lim.ratio.value = 3.5; lim.attack.value = 0.006; lim.release.value = 0.25;
  bus.connect(lim).connect(out);
  // a small soft room, made from two seconds of fading noise. The plucked notes are sent into it, the steps only a little
  const rate = ctx.sampleRate, made = PRE.rate === rate, room = ctx.createConvolver(), wet = ctx.createGain();
  // The room gets its two seconds a third of a second after the click. Handing them over is the heaviest step of all, and the first
  // notes come later than that anyway. (Made ahead if this device plays at the usual 48000, made now if not.)
  setTimeout(() => { const ir = ctx.createBuffer(2, Math.floor(rate * 2.2), rate); for (let c = 0; c < 2; c++) ir.getChannelData(c).set(made && PRE.room ? PRE.room[c] : roomSide(rate)); room.buffer = ir; }, 350);
  wet.gain.value = 0.55; room.connect(wet).connect(bus);
  const send = (node, amount) => { const g = ctx.createGain(); g.gain.value = amount; node.connect(g).connect(room); };
  // two seconds of plain noise, for the air and for the tap in each step
  const hiss = ctx.createBuffer(1, rate * 2, rate); hiss.getChannelData(0).set((made && PRE.hiss) || noise(rate));

  // the bed: two sets of four notes. A new chapter's chord is put on the silent set, and the two cross over
  const bedLP = ctx.createBiquadFilter(), bed = ctx.createGain(); bedLP.type = 'lowpass'; bedLP.frequency.value = 600; bedLP.Q.value = 0.3; bed.gain.value = 0;
  bedLP.connect(bed).connect(bus); send(bed, 0.5);
  const sets = [0, 1].map((k) => {
    const g = ctx.createGain(); g.gain.value = k ? 0 : 1; g.connect(bedLP);
    const notes = [0.3, 0.36, 0.26, 0.2].map((amp, i) => {
      const vg = ctx.createGain(), sway = ctx.createOscillator(), sg = ctx.createGain(); vg.gain.value = amp; vg.connect(g);
      sway.frequency.value = 0.045 + i * 0.027 + k * 0.011; sg.gain.value = amp * 0.45; sway.connect(sg).connect(vg.gain); sway.start();      // each note breathes at its own slow pace
      return [[-2, 1], [2, 0.4]].map(([cents, k]) => { const o = ctx.createOscillator(), og = ctx.createGain(); o.type = i < 2 ? 'sine' : 'triangle'; o.detune.value = cents; og.gain.value = k; o.connect(og).connect(vg); o.start(); return o; });      // two a hair apart, one quieter: a slow shimmer, not a throb
    });
    return { g, notes };
  });
  let live = 0, scene = null;
  const setChord = (s, at) => { for (const [i, pair] of s.notes.entries()) for (const o of pair) o.frequency.setValueAtTime(hz(at[i]), ctx.currentTime); };
  setChord(sets[0], SCENES.day.chord);

  // the air: noise through a filter that opens as you scroll faster
  const air = ctx.createBufferSource(), airBP = ctx.createBiquadFilter(), airG = ctx.createGain(); air.buffer = hiss; air.loop = true;
  const airLP = ctx.createBiquadFilter(); airLP.type = 'lowpass'; airLP.frequency.value = 1400; airLP.Q.value = 0.3;      // the hiss is taken off the top: what is left is a soft breath, not a gust
  airBP.type = 'bandpass'; airBP.frequency.value = 320; airBP.Q.value = 0.7; airG.gain.value = 0; air.connect(airBP).connect(airLP).connect(airG).connect(bus); air.start();

  // one note, struck and left to ring, like a thumb piano: the note, the one an octave up, and a short knock on top
  function pluck(f, vol, { ring = 0.9, pan = 0, bright = 1, wetK = 0.5, when = 0 } = {}) {
    const t = ctx.currentTime + when, p = ctx.createStereoPanner(); p.pan.value = pan; p.connect(bus); send(p, wetK);
    for (const [mult, amp, len] of [[1, 1, ring], [2, 0.26, ring * 0.55], [3, 0.09, ring * 0.3], [5.43, 0.1 * bright, 0.05]]) {
      const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = f * mult;
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol * amp, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.03 + len);
      o.connect(g).connect(p); o.start(t); o.stop(t + 0.06 + len);
    }
  }
  // a foot coming down: a short low knock that drops in pitch, and a tap of noise on top of it
  function step(left, vol, dull) {
    const t = ctx.currentTime, f = (left ? 196 : 174) * (dull ? 0.72 : 1) * (1 + (Math.random() - 0.5) * 0.05), p = ctx.createStereoPanner(); p.pan.value = left ? -0.2 : 0.2; p.connect(bus); send(p, 0.12);
    const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(f * 1.9, t); o.frequency.exponentialRampToValueAtTime(f, t + 0.035);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1);
    o.connect(g).connect(p); o.start(t); o.stop(t + 0.12);
    const s = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), ng = ctx.createGain(); s.buffer = hiss; bp.type = 'bandpass'; bp.frequency.value = dull ? 800 : 2300; bp.Q.value = 1.3;
    ng.gain.setValueAtTime(vol * (dull ? 0.25 : 0.4), t); ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.03);
    s.connect(bp).connect(ng).connect(p); s.start(t, Math.random() * 1.5, 0.04);
  }
  // a button: a very short dry click
  function tick(vol = 1) {
    const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(1500, t); o.frequency.exponentialRampToValueAtTime(700, t + 0.03);
    g.gain.setValueAtTime(VOL.ui * vol, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.045); o.connect(g).connect(bus); o.start(t); o.stop(t + 0.06);
  }
  // a tone that slides from one pitch to another: the size switch, and going in and out of its lens
  function slide(f0, f1, secs, vol) {
    const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + secs);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + secs * 0.3); g.gain.exponentialRampToValueAtTime(0.0001, t + secs * 1.25);
    o.connect(g).connect(bus); send(g, 0.3); o.start(t); o.stop(t + secs * 1.3);
  }
  // Mosey says something: a few quick notes from its five, in no order
  function chirp() { const five = [12, 14, 16, 19, 21]; for (let i = 0; i < 4; i++) pluck(hz(five[Math.floor(Math.random() * 5)] + 12), VOL.ui * 0.9, { ring: 0.07, bright: 0.3, wetK: 0.25, when: 0.05 + i * 0.075 }); }

  // what it listens to on the page: the buttons
  document.addEventListener('pointerdown', (e) => {
    if (!on) return; const b = e.target.closest?.('button, a.btn, .tabs a, .stops a, .mark'); if (!b || b.id === 'unbox' || b.id === 'snd') return;
    if (b.dataset.size) return slide(b.dataset.size === 'xl' ? 330 : 520, b.dataset.size === 'xl' ? 520 : 330, 0.22, VOL.ui * 1.2);      // XL goes up, back down for the small one
    if (b.dataset.way) { const i = [...b.parentNode.children].indexOf(b); return pluck(hz([12, 16, 19, 21][i % 4]), VOL.chime * 1.3, { ring: 0.8 }); }      // each colour has its own note
    tick(); if (b.closest('.asks')) chirp();
  }, true);

  // what it watches, once a frame
  const m = window.__mosey, M = m.marks, S = m.state, pos = m.robot.root.position;
  const hud = document.getElementById('hud'), filmbar = document.getElementById('filmbar'), body = document.body.classList;
  const cards = [...document.querySelectorAll('.copy.tag')].map((el) => ({ el, on: el.classList.contains('is-on') }));
  const vtags = [...document.querySelectorAll('.vtag')], notes = [...document.querySelectorAll('.pn')];
  const seen = {}, flag = (el, cls) => { const map = seen[cls] ||= new WeakMap(), now = el.classList.contains(cls), was = map.get(el) ?? now; map.set(el, now); return now && !was; };      // true on the frame an element gets a class
  const last = { x: pos.x, y: pos.y, z: pos.z, d: S.d, foot: Math.floor(S.d * 7.4 / Math.PI - 0.5), slot: Math.floor(S.d / GAP), t: performance.now(), stepT: 0, noteT: 0, moved: performance.now() };
  let act = 0, fall = 0, quiet = 1;
  (function frame(now) {
    requestAnimationFrame(frame);
    const dt = clamp((now - last.t) / 1000, 0.001, 0.1); last.t = now;
    const t = ctx.currentTime, d = S.d, v = (d - last.d) / dt, speed = Math.abs(v), jumped = Math.abs(d - last.d) > 4;      // jumped: a link took you somewhere else in one go
    const vy = (pos.y - last.y) / dt, ground = Math.hypot(pos.x - last.x, pos.z - last.z) / dt;
    Object.assign(last, { x: pos.x, y: pos.y, z: pos.z, d });
    if (!on) { last.foot = Math.floor(d * 7.4 / Math.PI - 0.5); last.slot = Math.floor(d / GAP); return; }

    // which chapter this is
    const lens = hud.classList.contains('is-on'), film = filmbar.classList.contains('is-on');
    const name = body.contains('proj') || film ? 'proj' : lens ? 'lens' : body.contains('night') ? 'night' : body.contains('sky-blue') || body.contains('at-end') ? 'sky' : d > M.details - 5 ? 'show' : 'day';
    const sc = SCENES[name];
    if (name !== scene) {
      if (scene) {
        live = 1 - live; setChord(sets[live], sc.chord); sets[live].g.gain.setTargetAtTime(1, t, 0.5); sets[1 - live].g.gain.setTargetAtTime(0, t, 0.5);
        if (name === 'lens') slide(220, 82, 0.5, VOL.chime); else if (scene === 'lens' && name !== 'proj') slide(110, 294, 0.45, VOL.chime * 0.8);      // in through the lens, and out again
        else if (name !== 'proj' && scene !== 'proj') pluck(hz(sc.chord[0] + 24), VOL.chime, { ring: 2.2, wetK: 0.8 });                                 // a new chapter: its lowest note, rung high
      } else setChord(sets[live], sc.chord);
      scene = name;
    }
    // the bed swells while you scroll, sinks when you stop, and all but goes after a quarter of a minute of nothing
    if (speed > 0.15) last.moved = now;
    act += (sat(speed / 2.5) - act) * (1 - Math.exp(-dt * (speed / 2.5 > act ? 3 : 0.8)));
    quiet += ((now - last.moved > 14000 ? 0.3 : 1) - quiet) * (1 - Math.exp(-dt * 0.6));
    const duck = film ? 0.3 : 1;      // its film has a sound of its own
    bed.gain.setTargetAtTime(VOL.bed * (0.45 + 0.55 * act) * quiet * duck, t, 0.2);
    bedLP.frequency.setTargetAtTime(sc.lp * (0.8 + 0.5 * act), t, 0.3);
    // the air follows the scroll. A fast drop turns it into wind
    fall += (sat((Math.abs(vy) - 2) / 7) - fall) * (1 - Math.exp(-dt * 6));
    airG.gain.setTargetAtTime((VOL.air * sat(speed / 6) ** 1.3 + VOL.wind * fall) * duck, t, 0.3);      // slowly: it must not puff with every flick of the wheel
    airBP.frequency.setTargetAtTime(320 + 260 * sat(speed / 7) + 380 * fall, t, 0.3);

    // the steps: one each time a leg reaches the end of its swing, and only while it is really walking along the ground
    const foot = Math.floor(d * 7.4 / Math.PI - 0.5);
    if (foot !== last.foot && !jumped && m.robot.root.visible && ground > 0.25 && Math.abs(vy) < 0.9 && now - last.stepT > 70) {
      last.stepT = now; step(foot % 2 === 0, VOL.step * (0.8 + Math.random() * 0.35) * (1 - 0.45 * sat((speed - 3) / 5)) * (film ? 0 : 1), sc.dull);      // no two steps quite as loud: a row of identical taps sounds like a machine
    }
    last.foot = foot;
    // the tune: the next note each time you pass another stretch
    const slot = Math.floor(d / GAP);
    if (slot !== last.slot && !jumped && now - last.noteT > 170) {
      const note = TUNE[((slot % TUNE.length) + TUNE.length) % TUNE.length];
      if (note !== null && sc.tune) { last.noteT = now; pluck(hz(note + sc.oct), VOL.tune * sc.tune * (1 - 0.4 * sat((speed - 4) / 6)), { ring: sc.ring, pan: Math.sin(slot * 1.7) * 0.3, bright: sc.dull ? 0.3 : 1 }); }
    }
    last.slot = slot;

    // moments
    for (const c of cards) { const isOn = c.el.classList.contains('is-on'); if (isOn && !c.on && !jumped) { pluck(hz(19), VOL.chime, { ring: 1.4, wetK: 0.7 }); pluck(hz(24), VOL.chime * 0.8, { ring: 1.6, wetK: 0.7, when: 0.09 }); } c.on = isOn; }      // a card switches on: two high notes, a fourth apart
    for (const el of vtags) if (flag(el, 'lock') && lens) { pluck(hz(31), VOL.chime * 0.9, { ring: 0.08, bright: 0.2, wetK: 0.3 }); pluck(hz(36), VOL.chime * 0.9, { ring: 0.12, bright: 0.2, wetK: 0.3, when: 0.07 }); }      // it has locked on to something
    for (const el of notes) {
      if (flag(el, 'on')) { pluck(hz(19), VOL.ping, { ring: 0.7, wetK: 0.6 }); pluck(hz(26), VOL.ping, { ring: 1.1, wetK: 0.6, when: 0.12 }); }                     // a notification: two notes going up
      if (flag(el, 'answered')) { const no = el.classList.contains('no'); pluck(hz(no ? 19 : 26), VOL.ping * 0.8, { ring: 0.5 }); pluck(hz(no ? 19 : 14), VOL.ping * 0.8, { ring: 1.2, when: 0.11 }); }      // done: two notes going down
    }
  })(performance.now());

  return { ctx, bus, tick, pluck, step };
}
window.__moseySound = { get on() { return on; }, set: setOn };

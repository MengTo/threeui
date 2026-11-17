// Connected to your phone. At the stove, in the walk through its lens (IT SEES), the picture pulls back and turns out to be
// your phone: you were looking in the whole time. What it found on the way lands next to the phone as notifications, and the
// last one asks. The hall lamp is still on, shall I turn it off? Press a button and it answers.
// One number runs all of it: --pk, from 0 (the full picture) to 1 (the phone). It is set on the four elements that use it and
// not on <html>, where every element of the page would inherit it and be restyled on every frame. The 3D canvas and the HUD over it are
// moved and scaled with CSS, and a frame with the same move carries the phone's bezel. Nothing is rendered twice.
// The look is in css/style.css ("the phone"). js/main.js gives the stove stop the scroll this needs (9.5 where it was 4).
//   ?tap=1   presses "Turn it off" for you, for recordings
const TAP = new URLSearchParams(location.search).has('tap');
const el = (tag, cls, html = '') => Object.assign(document.createElement(tag), { className: cls, innerHTML: html });
const EYE = '<svg viewBox="-50 -50 100 100" aria-hidden="true"><rect x="-50" y="-50" width="100" height="100" rx="24" fill="#15151a"/><circle r="30" fill="#f3efe7"/><circle r="22" fill="#0b0b0f"/><circle r="14" fill="none" stroke="#f6c21a" stroke-width="5"/><circle r="6" fill="#000"/><circle cx="-6" cy="-6" r="3.4" fill="#fff"/></svg>';
const sat = (v) => Math.max(0, Math.min(1, v)), ease = (u) => u * u * (3 - 2 * u), span = (v, a, b) => ease(sat((v - a) / (b - a)));

// what it tells you, in the order it found things. at: how far into the stove stop each one lands
const NOTES = [
  { at: 2.6, title: 'Found your keys', body: 'Under the sofa, left side. Last seen 8:14.' },
  { at: 3.9, title: 'Stove is off', body: 'I checked twice.' },
  { at: 5.2, title: 'Hall lamp is still on', body: 'Nobody is home. Shall I turn it off?', acts: ['Turn it off', 'Leave it'], did: 'Lamp off. I will do the rounds again at ten.', left: 'Left on. I will ask again tonight.' },
];
// one notification, as a phone shows it
function note(n) {
  const e = n.el = el('div', 'pn', `<div class="pn-top">${EYE}<b>Mosey</b><span>now</span></div><p class="pn-t">${n.title}</p><p class="pn-b">${n.body}</p>`
    + (n.acts ? `<div class="pn-acts">${n.acts.map((a, i) => `<button type="button" class="${i ? 'quiet' : ''}" tabindex="-1">${a}</button>`).join('')}</div><p class="pn-done"></p>` : ''));
  e.querySelectorAll('button').forEach((b, i) => b.addEventListener('click', () => answer(n, i === 0)));
  return e;
}
function answer(n, yes) { n.el.querySelector('.pn-done').textContent = yes ? n.did : n.left; n.el.classList.add('answered'); n.el.classList.toggle('no', !yes); }

const back = el('i', 'pb-back'), frame = el('i', 'pb-frame'), side = el('div', 'pb-side', '<p class="pb-h">It was on your phone the whole time.</p><div class="pb-list" role="status"></div>');
for (const x of [back, frame]) x.setAttribute('aria-hidden', 'true');
const list = side.querySelector('.pb-list'); NOTES.forEach((n) => list.append(note(n)));
document.body.append(back, frame, side);

const moved = [document.getElementById('world'), document.getElementById('hud'), back, frame].filter(Boolean);      // what --pk moves
let shown = -1;
(function tick(now) {
  requestAnimationFrame(tick);
  const m = window.__mosey; if (!m) return;
  const M = m.marks, d = m.state.d;
  const k = span(d, M.stove + 1.0, M.stove + 2.4) * (1 - span(d, M.stoveEnd - 1.7, M.stoveEnd - 0.5));      // out to the phone, hold, and back in before it walks on
  const kk = +k.toFixed(4); if (kk !== shown) { shown = kk; for (const e of moved) e.style.setProperty('--pk', kk); document.body.classList.toggle('pb-on', kk > 0); side.classList.toggle('on', k > 0.6); }
  for (const n of NOTES) {
    const on = k > 0.6 && d >= M.stove + n.at;
    if (on !== n.on) { n.on = on; n.t0 = now; n.el.classList.toggle('on', on); n.el.querySelectorAll('button').forEach((b) => { b.tabIndex = on ? 0 : -1; }); if (!on) n.el.classList.remove('answered', 'no', 'hit'); }
    if (TAP && on && n.acts && !n.el.classList.contains('answered')) { if (now - n.t0 > 1500) n.el.classList.add('hit'); if (now - n.t0 > 1750) answer(n, true); }
  }
})(performance.now());

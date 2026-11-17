// The card. Every copy card in the page (.tag, and the small captions, .note) is drawn as Mosey's own screen:
// dark glass, four brackets that lock on, one scan down, the body line typed out, and a lens in the corner that looks at your cursor.
// This file builds those parts inside each card and runs them. The look is in css/style.css ("the card").
//   ?cursor=1   a stand-in cursor crosses each card, so a recording shows what a hand would do
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches, coarse = matchMedia('(pointer: coarse)').matches;
const el = (tag, cls, html = '') => Object.assign(document.createElement(tag), { className: cls, innerHTML: html });
const EYE = '<svg class="eye" viewBox="-50 -50 100 100" aria-hidden="true"><circle r="48" fill="#f3efe7"/><g class="lid"><circle r="37" fill="#0b0b0f"/><g class="look"><circle r="23" fill="none" stroke="#f6c21a" stroke-width="7.5"/><circle r="11" fill="#000"/><circle cx="-9" cy="-10" r="5.5" fill="#fff"/></g></g></svg>';

const cards = [...document.querySelectorAll('.copy.tag, .copy.note')].map((card, n) => {
  const tag = card.classList.contains('tag'), inner = el('div', 'card-in');
  inner.append(...card.childNodes); card.append(inner);
  [...inner.children].forEach((e, i) => e.style.setProperty('--i', i));      // the lines come in one after the other
  const c = { card, inner, tag, n, right: card.dataset.side === 'right', on: false, typed: 0 };
  // the body line is typed out. Every letter is already in place (so nothing reflows), a hidden copy keeps it one sentence for screen readers
  const p = [...inner.children].find((e) => e.tagName === 'P' && !e.className);
  if (p && !reduced) {
    const text = p.textContent;
    p.classList.add('typed');
    p.innerHTML = `<span class="sr">${p.innerHTML}</span><span aria-hidden="true">${text.split(' ').map((w) => `<span style="white-space:nowrap">${[...w].map((ch) => `<span class="ch">${ch}</span>`).join('')}</span>`).join('<span class="ch"> </span>')}</span>`;
    c.chars = [...p.querySelectorAll('.ch')];
  }
  inner.insertAdjacentHTML('afterbegin', EYE);
  if (tag) inner.prepend(el('span', 'rec', 'Mosey'));
  inner.querySelector('.rec')?.setAttribute('aria-hidden', 'true');
  for (const k of ['tl', 'tr', 'bl', 'br']) card.append(Object.assign(el('i', 'brk ' + k), { ariaHidden: 'true' }));
  return c;
});

// where the pointer is, and when it last moved
const ptr = { x: innerWidth / 2, y: innerHeight / 2, t: -1e9 };
addEventListener('pointermove', (e) => { ptr.x = e.clientX; ptr.y = e.clientY; ptr.t = performance.now(); }, { passive: true });

// ?cursor=1: the stand-in cursor waits, then crosses the card twice
const demo = new URLSearchParams(location.search).has('cursor') && innerWidth > 820;
const fake = demo ? document.body.appendChild(el('i', 'demo-cursor', '<svg viewBox="0 0 24 24" width="26" height="26"><path d="M5 2l13 12.2h-6.6l3.7 7.3-2.7 1.3-3.6-7.5L5 19.6z" fill="#15151a" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/></svg>')) : null;
if (fake) Object.assign(fake.style, { position: 'fixed', left: 0, top: 0, zIndex: 50, pointerEvents: 'none', willChange: 'transform', filter: 'drop-shadow(0 2px 3px rgba(0,0,0,.35))' });
const cur = { x: innerWidth * 0.5, y: innerHeight * 0.6 };
const demoCursor = (now, dt) => {
  const c = cards.find((k) => k.on); let tx = innerWidth * 0.52, ty = innerHeight * 0.62;
  if (c) {
    const r = c.inner.getBoundingClientRect(), t = (now - c.t0) / 1000, park = [c.right ? r.left - 150 : r.right + 150, r.top + r.height * 0.78];
    const at = (fx, fy) => [r.left + r.width * fx, r.top + r.height * fy];
    [tx, ty] = t < 1.9 ? park : t < 2.6 ? at(0.78, 0.5) : t < 3.2 ? at(0.14, 0.32) : t < 3.8 ? at(0.82, 0.62) : park;
  }
  const k = 1 - Math.exp(-7 * dt); cur.x += (tx - cur.x) * k; cur.y += (ty - cur.y) * k;
  fake.style.transform = `translate(${cur.x.toFixed(1)}px, ${cur.y.toFixed(1)}px)`;
  dispatchEvent(new PointerEvent('pointermove', { clientX: cur.x, clientY: cur.y, bubbles: true }));
};

const cl = (v, m) => Math.max(-m, Math.min(m, v));
let last = performance.now();
const frame = (now) => {
  requestAnimationFrame(frame);
  const dt = Math.min(0.033, (now - last) / 1000); last = now;
  if (fake) demoCursor(now, dt);
  for (const c of cards) {
    const on = c.card.classList.contains('is-on');
    if (on !== c.on) {
      c.on = on; c.t0 = now;
      if (on) { c.typed = 0; c.chars?.forEach((s) => s.classList.remove('on', 'cur')); c.card.style.setProperty('--h', c.inner.offsetHeight + 'px'); }
    }
    if (!on) continue;
    const r = c.inner.getBoundingClientRect(), live = !coarse && now - ptr.t < 2500;      // someone is moving a cursor
    const mx = (ptr.x - r.left) / r.width, my = (ptr.y - r.top) / r.height, near = live && mx > -0.4 && mx < 1.4 && my > -0.4 && my < 1.4;
    if (c.tag && !reduced) {      // the card leans a little toward the cursor, and a soft light follows it
      c.card.style.setProperty('--ry', (near ? cl((mx - 0.5) * 9, 6) : 0).toFixed(2) + 'deg'); c.card.style.setProperty('--rx', (near ? cl((0.5 - my) * 7, 5) : 0).toFixed(2) + 'deg');
    }
    if (live) { c.inner.style.setProperty('--mx', (mx * 100).toFixed(1) + '%'); c.inner.style.setProperty('--my', (my * 100).toFixed(1) + '%'); }
    // the lens looks at the cursor. With no cursor (a phone, or a hand that has stopped) it looks around on its own
    let ex, ey;
    if (live) { const e = c.inner.querySelector('.eye').getBoundingClientRect(), dx = ptr.x - (e.left + e.width / 2), dy = ptr.y - (e.top + e.height / 2), d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 160) * 4.2; ex = dx / d * k; ey = dy / d * k; }
    else if (reduced) ex = ey = 0;
    else { const s = Math.floor(now / 1400 + c.n * 0.37), h = (v) => { const x = Math.sin(v * 127.1) * 43758.5453; return x - Math.floor(x); }; ex = (h(s) - 0.5) * 7; ey = (h(s + 9.7) - 0.5) * 4.5; }
    c.inner.style.setProperty('--ex', ex.toFixed(2) + 'px'); c.inner.style.setProperty('--ey', ey.toFixed(2) + 'px');
    if (c.chars) {      // typing, on a fixed clock: 16 ms a letter, starting once the card has landed
      const t0 = c.tag ? 520 : 120, per = c.tag ? 14 : 8;      // a caption is short and often on screen briefly, so it types faster
      const n = Math.max(0, Math.min(c.chars.length, Math.floor((now - c.t0 - t0) / per)));
      while (c.typed < n) { c.chars[c.typed - 1]?.classList.remove('cur'); c.chars[c.typed].classList.add('on', 'cur'); c.typed++; }
      if (n >= c.chars.length && c.typed) c.chars[c.chars.length - 1].classList.toggle('cur', now - c.t0 < t0 + c.chars.length * per + 2700 && Math.floor(now / 450) % 2 === 0);      // the caret blinks a few times, then rests
    }
  }
};
requestAnimationFrame(frame);

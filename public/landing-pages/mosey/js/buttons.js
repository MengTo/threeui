// The key button. Every .btn in the page is rebuilt as four layers:
// a dark bezel, a bright cap that sits in it, a label whose letters roll over on hover,
// and a round chip on the end with an arrow in a ring that lights up.
// The idea and the structure come from the MatrixPay forward button (by Aksonvady Phomhome, from ThreeUI),
// redrawn here in this page's colours and type.
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches, touch = matchMedia('(pointer: coarse)').matches;
const ARROW = '<svg viewBox="0 0 16 16"><path d="M2.5 8h10.6M9.2 3.9 13.3 8l-4.1 4.1"/></svg>';
// two half rings round the chip. On hover the light runs along both, from the back to the arrow's tip.
const HALF = ['M5.75 20A14.25 14.25 0 0 1 34.25 20', 'M5.75 20A14.25 14.25 0 0 0 34.25 20'];
const CHIP = `<svg class="btn__trace" viewBox="0 0 40 40"><path class="dim" d="${HALF.join('')}"/>${HALF.map((d) => `<path class="lit" pathLength="1" d="${d}"/>`).join('')}<circle class="pad" cx="20" cy="20" r="8.5"/></svg>`;
const letters = (text, from = 0) => [...text].map((c, i) => { const k = c === ' ' ? ' ' : c; return `<span class="btn__ch" style="--i:${from + i}" data-c="${k}">${k}</span>`; }).join('');

for (const b of document.querySelectorAll('.btn')) {
  const price = b.querySelector('.btn-price')?.textContent.trim() || '';
  const label = [...b.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join(' ').replace(/\s+/g, ' ').trim();
  b.setAttribute('aria-label', price ? `${label}, ${price}` : label);
  b.classList.add('btn--key');
  b.innerHTML = '<span class="btn__bezel" aria-hidden="true"></span><span class="btn__cap" aria-hidden="true"></span>'
    + `<span class="btn__label" aria-hidden="true">${letters(label)}${price ? `<span class="btn__sep"></span>${letters(price, label.length)}` : ''}</span>`
    + (b.classList.contains('btn-play') ? '' : `<span class="btn__chip" aria-hidden="true">${CHIP}<span class="btn__arrow">${ARROW}</span></span>`);      // the play button is all cap, no arrow
  const cap = b.querySelector('.btn__cap');
  // a bloom of light where you press
  b.addEventListener('pointerdown', (e) => {
    const r = cap.getBoundingClientRect(), i = document.createElement('i');
    i.className = 'btn__ripple'; i.style.left = (e.clientX - r.left) + 'px'; i.style.top = (e.clientY - r.top) + 'px';
    cap.append(i); setTimeout(() => i.remove(), 900);
  });
  // it leans a little toward the pointer, and a soft light follows it across the cap
  b.addEventListener('pointermove', (e) => {
    if (reduced || touch) return;
    const r = b.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
    b.style.transition = 'transform 0.15s linear';
    b.style.transform = `translate3d(${Math.max(-6, Math.min(6, dx * 0.2)).toFixed(2)}px, ${Math.max(-4, Math.min(4, dy * 0.3)).toFixed(2)}px, 0)`;
    b.style.setProperty('--mx', (e.clientX - r.left) + 'px'); b.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
  b.addEventListener('pointerleave', () => { b.style.transition = 'transform 0.7s cubic-bezier(0.22, 1, 0.36, 1)'; b.style.transform = ''; });
}

// The quiet links on top roll their letters the same way on hover. The link keeps its plain name for screen readers.
for (const a of document.querySelectorAll('nav.tabs a')) {
  const name = a.textContent.trim();
  a.setAttribute('aria-label', name);
  a.innerHTML = `<span class="tab__roll" aria-hidden="true">${[...name].map((c, i) => `<span class="tab__ch" style="--i:${i}" data-c="${c}">${c}</span>`).join('')}</span>`;
}

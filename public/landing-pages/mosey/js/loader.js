// The loader. A plain script (not a module), so it runs before the 3D starts loading.
// It fills the ring from the page's real boot stages (main.js notes each one in window.__boot), never faster than a
// reader can follow, then opens the screen and lets the letter rain start (window.__introGate, read by js/hero-fx.js).
(function () {
  var el = document.getElementById('loading'); if (!el) return;
  var MIN = 2200;      // how long it stays up at least, in ms, so it can be read. The page itself is usually ready sooner
  var t0 = performance.now(), gate = window.__introGate = { hold: true };
  var pct = document.getElementById('bootpct'), say = document.getElementById('bootsay');
  var SAY = ['Waking Mosey', 'Focusing the lens', 'Finding its feet', 'Ready'], p = 0, lastSay = 0, lastN = -1, done = false;
  function open() { el.classList.add('out'); gate.hold = false; setTimeout(function () { el.remove(); }, 1500); }
  (function tick(now) {
    var b = window.__boot || {}, real = b.firstFrame ? 100 : b.world ? 84 : b.font ? 58 : b.physics ? 36 : 14;      // how far the page really is
    var target = Math.min(real, (now - t0) / (MIN - 400) * 100);                                                       // and never ahead of the clock
    p += (target - p) * 0.14; if (target >= 100 && p > 99.4) p = 100;
    el.style.setProperty('--p', p.toFixed(1));
    var n = Math.round(p); if (n !== lastN) { lastN = n; pct.textContent = n + '%'; }
    var si = p >= 100 ? 3 : p > 62 ? 2 : p > 30 ? 1 : 0; if (si !== lastSay) { lastSay = si; say.textContent = SAY[si]; }
    if (p >= 100 && !done) { done = true; setTimeout(open, 260); return; }
    requestAnimationFrame(tick);
  })(t0);
})();

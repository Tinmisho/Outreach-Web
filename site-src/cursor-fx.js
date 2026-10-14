// Cursor effects: a soft glow that follows the mouse + a short trail of fading sparks.
// Decorative only: never blocks clicks, off on touch devices and with reduced motion.
(() => {
  if (matchMedia('(pointer: coarse)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const light = () => true; // site is light-only
  const T = window.__oxTheme || { a: '#ff7139', b: '#ffbd4f', c: '#ff4f5e', rgba: (al) => `rgba(255,113,57,${al})` };
  const colors = [T.a, T.b, T.c];

  const glow = document.createElement('div');
  Object.assign(glow.style, {
    position: 'fixed', left: 0, top: 0, width: '420px', height: '420px', borderRadius: '50%',
    pointerEvents: 'none', zIndex: 9998, opacity: 0, transition: 'opacity .4s',
    translate: '-50% -50%', willChange: 'transform',
  });
  const canvas = document.createElement('canvas');
  Object.assign(canvas.style, { position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 });
  document.body.append(glow, canvas);
  const ctx = canvas.getContext('2d');

  const paintGlow = () => {
    glow.style.background = `radial-gradient(circle, ${light() ? T.rgba(.2) : T.rgba(.15)} 0%, transparent 65%)`;
  };
  paintGlow();
  matchMedia('(prefers-color-scheme: light)').addEventListener('change', paintGlow);

  const resize = () => {
    const dpr = 1; // trail is soft dots: full-res is wasted GPU on hi-DPI screens
    canvas.width = innerWidth * dpr; canvas.height = innerHeight * dpr;
    canvas.style.width = innerWidth + 'px'; canvas.style.height = innerHeight + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };
  resize(); addEventListener('resize', resize);

  let mx = -999, my = -999, gx = mx, gy = my, last = 0, running = false;
  const sparks = [];
  addEventListener('pointermove', (e) => {
    mx = e.clientX; my = e.clientY;
    if (gx < -900) { gx = mx; gy = my; }
    glow.style.opacity = 1;
    const now = performance.now();
    if (now - last > 28 && sparks.length < 40) {
      last = now;
      sparks.push({ x: mx, y: my, vx: (Math.random() - .5) * .8, vy: (Math.random() - .5) * .8 - .3,
        r: 1.5 + Math.random() * 2.5, life: 1, c: colors[(Math.random() * colors.length) | 0] });
    }
    if (!running) { running = true; requestAnimationFrame(tick); }
  }, { passive: true });
  document.addEventListener('pointerleave', () => { glow.style.opacity = 0; });

  function tick() {
    gx += (mx - gx) * .14; gy += (my - gy) * .14;   // glow eases after the cursor
    glow.style.transform = `translate(${gx}px, ${gy}px)`;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (let i = sparks.length - 1; i >= 0; i--) {
      const s = sparks[i];
      s.x += s.vx; s.y += s.vy; s.life -= .028;
      if (s.life <= 0) { sparks.splice(i, 1); continue; }
      ctx.globalAlpha = s.life * (light() ? .9 : .8);
      ctx.fillStyle = s.c;
      ctx.beginPath(); ctx.arc(s.x, s.y, s.r * s.life, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalAlpha = 1;
    const settled = Math.abs(mx - gx) < .5 && Math.abs(my - gy) < .5;
    if (sparks.length || !settled) requestAnimationFrame(tick); else running = false;
  }
})();

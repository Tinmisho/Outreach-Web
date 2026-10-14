// Sound effects, synthesized with Web Audio (no audio files). Browsers allow audio only after the
// first click / key press, so nothing plays before that. A toggle (top right) mutes everything.
(() => {
  const dbg = () => {}; // diagnostics off (was: report audio state to the local server)
  dbg('init ua=' + navigator.userAgent.slice(-40));
  const KEY = 'outreach.sound';
  let on = true;
  try { on = localStorage.getItem(KEY) !== 'off'; } catch {}
  dbg('stored=' + (function(){try{return localStorage.getItem(KEY)}catch{return 'err'}})() + ' on=' + on);
  let ac = null;
  const ctx = () => {
    if (!ac) { const A = window.AudioContext || window.webkitAudioContext; if (!A) return null; ac = new A(); }
    if (ac.state === 'suspended') ac.resume();
    return ac;
  };
  let unlocked = false, btn = null, noise = null;
  function paint() { if (btn) paintBtn(); }
  // Browsers only start audio from a real gesture (click / tap / key). Scroll and hover do NOT count,
  // so every gesture (re)starts the context: it can also be suspended again after a tab switch.
  const unlock = (e) => {
    if (e && e.type === 'keydown' && (e.key === 'Escape' || e.repeat)) return;
    // A context created or left blocked earlier (Firefox/Zen) never recovers: replace it inside this gesture.
    if (ac && ac.state !== 'running') { try { ac.close(); } catch {} ac = null; noise = null; }
    dbg('gesture ' + e.type + ' before=' + (ac ? ac.state : 'none') + ' on=' + on + ' unlocked=' + unlocked);
    const a = ctx(); if (!a) { dbg('no AudioContext'); return; }
    try { // starting a (silent) sound synchronously inside the gesture is what actually unlocks audio
      const sb = a.createBufferSource(); sb.buffer = a.createBuffer(1, 1, 22050); sb.connect(a.destination); sb.start(0);
    } catch {}
    if (a.resume) a.resume().catch(() => {});
    const done = (w) => { dbg('check@' + w + ' state=' + a.state + ' same=' + (a === ac) + ' unlocked=' + unlocked); if (a === ac && a.state === 'running' && !unlocked) { unlocked = true; paint(); chime(); } };
    done(0); setTimeout(() => done(60), 60); setTimeout(() => done(300), 300);
  };
  // Try right away: browsers that allow autoplay for this site (site setting "Allow Audio",
  // or Chrome's media-engagement score) start immediately; others wait for the first click.
  (() => {
    const a = ctx(); if (!a) return;
    const ok = () => { if (a === ac && a.state === 'running' && !unlocked) { unlocked = true; paint(); dbg('autoplay allowed'); } };
    if (a.resume) a.resume().then(ok).catch(() => {});
    ok(); setTimeout(ok, 200);
  })();
  // Only events Firefox/Zen accept as permission for audio (pointerdown is NOT one of them).
  for (const ev of ['click', 'keydown', 'touchend']) addEventListener(ev, unlock, { capture: true, passive: true });
  document.addEventListener('visibilitychange', () => { if (!document.hidden && ac && ac.state !== 'running') unlocked = false, paint(); });
  const ready = () => { if (!on || !unlocked) return null; const a = ctx(); return a && a.state === 'running' ? a : null; };

  let chimed = false;
  function chime() { if (chimed || !on) return; chimed = true; tone(660, 990, 0.18, 0.22, 'sine'); setTimeout(() => tone(990, 1320, 0.22, 0.2, 'sine'), 120); }
  function tone(freq, endFreq, dur, vol, type = 'sine') {
    const a = ready(); if (!a) { dbg('skip tone ' + freq + ' on=' + on + ' unlocked=' + unlocked + ' state=' + (ac ? ac.state : 'none')); return; }
    dbg('play tone ' + freq + ' state=' + a.state);
    const t = a.currentTime, o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.setValueAtTime(freq, t); o.frequency.exponentialRampToValueAtTime(endFreq, t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.008); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(a.destination); o.start(t); o.stop(t + dur + 0.02);
  }
  function whoosh(up) {
    const a = ready(); if (!a) return;
    if (!noise) {
      noise = a.createBuffer(1, a.sampleRate * 1.2, a.sampleRate);
      const d = noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    const t = a.currentTime, src = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    src.buffer = noise; f.type = 'bandpass'; f.Q.value = 1.2;
    f.frequency.setValueAtTime(up ? 2600 : 280, t); f.frequency.exponentialRampToValueAtTime(up ? 280 : 2600, t + 0.9);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.5, t + 0.35); g.gain.exponentialRampToValueAtTime(0.0001, t + 1.05);
    src.connect(f).connect(g).connect(a.destination); src.start(t); src.stop(t + 1.1);
    tone(up ? 520 : 180, up ? 160 : 620, 0.9, 0.12, 'sine'); // soft tonal sweep under the air
  }

  // ── cinematic sounds ──
  const noiseBuf = (a) => {
    if (!noise || noise.sampleRate !== a.sampleRate) {
      noise = a.createBuffer(1, a.sampleRate * 1.2, a.sampleRate);
      const d = noise.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    }
    return noise;
  };
  // soft glassy chord that opens up (the "entering" moment)
  function shimmer(vol = 0.07, len = 2.2) {
    const a = ready(); if (!a) return;
    const t = a.currentTime;
    [523.25, 659.25, 783.99, 1046.5].forEach((fr, k) => {
      const o = a.createOscillator(), g = a.createGain(), d = k * 0.07;
      o.type = 'sine'; o.frequency.value = fr; o.detune.value = (k % 2 ? 4 : -4);
      g.gain.setValueAtTime(0.0001, t + d); g.gain.exponentialRampToValueAtTime(vol, t + d + 0.18); g.gain.exponentialRampToValueAtTime(0.0001, t + d + len);
      o.connect(g).connect(a.destination); o.start(t + d); o.stop(t + d + len + 0.05);
    });
  }
  // rising tension before the hit
  function riser(len = 0.9) {
    const a = ready(); if (!a) return;
    const t = a.currentTime, n = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    n.buffer = noiseBuf(a); n.loop = true; f.type = 'bandpass'; f.Q.value = 2.5;
    f.frequency.setValueAtTime(600, t); f.frequency.exponentialRampToValueAtTime(4200, t + len);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.07, t + len * 0.95); g.gain.exponentialRampToValueAtTime(0.0001, t + len + 0.06);
    n.connect(f).connect(g).connect(a.destination); n.start(t); n.stop(t + len + 0.1);
  }

  // hover tick + click on interactive elements
  let lastHover = null, lastTick = 0;
  document.addEventListener('pointerover', (e) => {
    const el = e.target.closest && e.target.closest('a,button,[role=button]');
    if (!el || el === lastHover) return;
    lastHover = el; const now = performance.now();
    if (now - lastTick > 60) { lastTick = now; tone(1900, 1300, 0.06, 0.12, 'sine'); }
  }, { passive: true });
  document.addEventListener('pointerout', (e) => {
    if (!lastHover) return;
    const to = e.relatedTarget;
    if (to && lastHover.contains(to)) return; // still inside the same button (moved onto its icon / text)
    if (e.target.closest && e.target.closest('a,button,[role=button]') === lastHover) lastHover = null;
  }, { passive: true });
  document.addEventListener('click', (e) => {
    if (e.target.closest && e.target.closest('a,button,[role=button]') && !e.target.closest('.ox-sound')) tone(700, 300, 0.11, 0.28, 'triangle');
  }, true);

  // dive into the laptop screen: whoosh when crossing into / out of it
  let inside = false;
  const heroProgress = () => { const h = document.querySelector('.hero'); return h ? Math.min(Math.max(scrollY / (h.offsetHeight || innerHeight), 0), 1) : 0; };
  addEventListener('scroll', () => {
    const p = heroProgress();
    if (!inside && p > 0.55) { inside = true; riser(0.6); setTimeout(() => shimmer(), 560); }
    else if (inside && p < 0.45) { inside = false; riser(0.4); }
  }, { passive: true });

  // "What we do" cards: a soft tick as the progress bar moves, a bright pop when a new card lights up
  const NOTES = [523, 659, 784, 1047]; // C E G C: each step climbs
  let lastActive = -1;
  const pop = (i) => { const f = NOTES[i] || 880; tone(f * 2, f * 2, 0.6, 0.06, 'sine'); tone(f * 3, f * 3, 0.35, 0.02, 'sine'); };
  const watchPanels = () => {
    const wrap = document.querySelector('.panels'); if (!wrap) return false;
    new MutationObserver(() => {
      const sp = parseFloat(wrap.style.getPropertyValue('--sp')) || 0;
      const step = Math.floor(sp * 24);
      const act = [...wrap.querySelectorAll('[data-panel]')].findIndex((el) => el.classList.contains('is-active'));
      if (act !== lastActive) { if (lastActive >= 0) pop(act); lastActive = act; }
    }).observe(wrap, { attributes: true, subtree: true, attributeFilter: ['style', 'class'] });
    return true;
  };
  if (!watchPanels()) { const mo = new MutationObserver(() => { if (watchPanels()) mo.disconnect(); }); mo.observe(document.body, { childList: true, subtree: true }); }

  // scrolling anywhere: a light breath of air whose loudness follows scroll speed and fades out when you stop
  let wind = null, lastY = scrollY, lastT = performance.now(), level = 0, raf = 0;
  const windNode = (a) => {
    if (wind && wind.a === a) return wind;
    const len = a.sampleRate * 2, buf = a.createBuffer(1, len, a.sampleRate), d = buf.getChannelData(0);
    let b = 0; for (let i = 0; i < len; i++) { b = (b + 0.02 * (Math.random() * 2 - 1)) / 1.02; d[i] = b * 3.5; } // brown-ish noise: soft, not hissy
    const src = a.createBufferSource(), f = a.createBiquadFilter(), g = a.createGain();
    src.buffer = buf; src.loop = true; f.type = 'bandpass'; f.Q.value = 0.7; f.frequency.value = 900; g.gain.value = 0;
    src.connect(f).connect(g); g.connect(a.destination); src.start();
    return (wind = { a, f, g });
  };
  const fade = () => {
    level *= 0.94;
    if (wind) wind.g.gain.setTargetAtTime(on ? level : 0, wind.a.currentTime, 0.05);
    raf = level > 0.002 ? requestAnimationFrame(fade) : (wind && wind.g.gain.setTargetAtTime(0, wind.a.currentTime, 0.08), 0);
  };
  addEventListener('scroll', () => {
    const now = performance.now(), y = scrollY, dy = y - lastY, dt = Math.max(now - lastT, 8);
    lastY = y; lastT = now;
    const a = ready(); if (!a) return;
    const w = windNode(a), speed = Math.min(Math.abs(dy) / dt, 4); // px per ms
    level = Math.min(0.07, Math.max(level, speed * 0.024));
    w.f.frequency.setTargetAtTime((dy >= 0 ? 800 : 1100) + speed * 300, a.currentTime, 0.1);
    if (!raf) raf = requestAnimationFrame(fade);
  }, { passive: true });

  // "Built for real businesses" gallery: the same glass ting when a new example comes to the middle
  addEventListener('ox:card', (e) => pop((e.detail || 0) % 4));

  // mute toggle
  btn = document.createElement('button');
  btn.className = 'ox-sound'; btn.type = 'button';
  const paintBtn = () => {
    btn.setAttribute('aria-pressed', String(on));
    btn.setAttribute('aria-label', on ? 'Mute sound effects' : 'Turn sound effects on');
    const waiting = on && !unlocked;
    btn.classList.toggle('is-waiting', waiting);
    btn.title = !on ? 'Sound off' : waiting ? 'Click anywhere to enable sound' : 'Sound on';
    btn.innerHTML = on
      ? '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7"/><path d="M19 5a10 10 0 0 1 0 14"/></svg>'
      : '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 5 6 9H2v6h4l5 4z"/><path d="m22 9-6 6"/><path d="m16 9 6 6"/></svg>';
  };
  btn.addEventListener('click', () => {
    on = !on; dbg('toggle -> on=' + on + ' state=' + (ac ? ac.state : 'none'));
    try { localStorage.setItem(KEY, on ? 'on' : 'off'); } catch {}
    paint(); if (on) setTimeout(() => tone(880, 1320, 0.14, 0.25, 'sine'), 30); // after unlock() resumed audio
  });
  paintBtn();
  document.body.append(btn);
})();

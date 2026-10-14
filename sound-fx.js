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
    if (!inside && p > 0.55) { inside = true; whoosh(false); }
    else if (inside && p < 0.45) { inside = false; whoosh(true); }
  }, { passive: true });

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

// Liquid glass — an experiment, switched on by default. Translucent panels with a bright rim and a
// specular highlight that follows the pointer, in the spirit of Apple's Liquid Glass material.
// Everything is gated on <html data-glass="on">, so the flat site is one attribute away:
//   ?glass=0 in the URL, or window.__oxGlass.toggle() in the console. The choice is remembered.
// Content pages only: the 3D home page carries no glass CSS, because the translucent panes there
// cost the scene its laptop and phone. Leave it that way until the two are known to get along.
(() => {
  const KEY = 'outreach.glass';
  // People who ask their OS for less transparency get the flat site unless they chose glass here.
  let on = !matchMedia('(prefers-reduced-transparency: reduce)').matches;
  try { const s = localStorage.getItem(KEY); if (s === '0' || s === '1') on = s === '1'; } catch {}
  const q = new URLSearchParams(location.search).get('glass');
  if (q !== null) on = !(q === '0' || q === 'off' || q === 'false');

  const root = document.documentElement;
  const apply = () => { root.dataset.glass = on ? 'on' : 'off'; };
  apply();
  window.__oxGlass = {
    get on() { return on; },
    set(v) { on = !!v; try { localStorage.setItem(KEY, on ? '1' : '0'); } catch {} apply(); return on; },
    toggle() { return this.set(!on); },
  };

  // The highlight: the surface under the pointer keeps it in --gx/--gy and fades --gl in.
  // One element at a time, one update per frame — the 3D page cannot afford more.
  const SEL = '.glass,.card,.step,.note,.cta,.faq details,.btn,.top,.langs a';
  let queued = 0, lit = null;
  const clear = () => {
    if (!lit) return;
    lit.style.removeProperty('--gx'); lit.style.removeProperty('--gy'); lit.style.removeProperty('--gl');
    lit = null;
  };
  addEventListener('pointermove', (e) => {
    if (!on || queued || e.pointerType === 'touch') return;
    queued = requestAnimationFrame(() => {
      queued = 0;
      const el = e.target instanceof Element ? e.target.closest(SEL) : null;
      if (el !== lit) clear();
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      lit = el;
      el.style.setProperty('--gx', (((e.clientX - r.left) / r.width) * 100).toFixed(1) + '%');
      el.style.setProperty('--gy', (((e.clientY - r.top) / r.height) * 100).toFixed(1) + '%');
      el.style.setProperty('--gl', '1');
    });
  }, { passive: true });
  addEventListener('pointerdown', (e) => { if (e.pointerType === 'touch') clear(); }, { passive: true });
  addEventListener('blur', clear);
  document.addEventListener('visibilitychange', () => { if (document.hidden) clear(); });
})();

// Liquid glass — an experiment, switched on by default. Translucent panels with a bright rim and a
// specular highlight that follows the pointer, in the spirit of Apple's Liquid Glass material.
// Everything is gated on <html data-glass="on">, so the flat site is one attribute away:
//   ?glass=0 in the URL, or window.__oxGlass.toggle() in the console. The choice is remembered.
// On the 3D home page the glass waits for the dive: nothing is translucent while the scene is live,
// because backdrop-filter over the running WebGL canvas is what cost us the laptop and the phone.
// <html data-scene> says whether the scene is still showing, and the home-page glass needs it 'off'.
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
  const SEL = '.glass,.card,.step,.note,.cta,.faq details,.btn,.top,.langs a,.ox-site__nav,.ox-site__btn';
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

  // The 3D page: hold the glass back until the camera has finished diving into the laptop screen.
  // The scene itself drives #ox-site's inline opacity (0 while it renders, 1 once it has faded out
  // and paused its frame loop), so that is the signal to follow rather than a second guess at it.
  const watchScene = () => {
    if (!document.getElementById('root')) return;   // not the 3D page: no scene to wait for
    root.dataset.scene = 'on';
    let tick = 0, site = null;
    const sync = () => {
      tick = 0;
      site ||= document.getElementById('ox-site');
      const done = !!site && parseFloat(site.style.opacity || '0') >= 0.99;
      const want = done ? 'off' : 'on';
      if (root.dataset.scene !== want) root.dataset.scene = want;
    };
    const onScroll = () => { if (!tick) tick = requestAnimationFrame(sync); };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('load', onScroll);
  };
  // this file runs in <head>, so #root and the scene only exist once the body has been parsed
  if (document.readyState === 'loading') addEventListener('DOMContentLoaded', watchScene); else watchScene();
})();

// Palette button (top right, next to the sound toggle): pick a colour theme. Saves it and reloads,
// because the 3D scene is built with the theme colours.
(() => {
  const T = window.__oxThemes, cur = (window.__oxTheme || {}).name || 'orange';
  if (!T) return;
  const btn = document.createElement('button');
  btn.className = 'ox-theme'; btn.type = 'button'; btn.setAttribute('aria-haspopup', 'true'); btn.setAttribute('aria-expanded', 'false');
  btn.setAttribute('aria-label', 'Colour theme: ' + T[cur].label); btn.title = 'Colour theme';
  btn.innerHTML = '<span class="ox-theme__dot"></span>';
  const pop = document.createElement('div');
  pop.className = 'ox-theme__pop'; pop.hidden = true; pop.setAttribute('role', 'menu'); pop.setAttribute('aria-label', 'Colour themes');
  const groups = {};
  for (const [k, t] of Object.entries(T)) (groups[t.group || 'Classic'] ??= []).push([k, t]);
  for (const [gname, items] of Object.entries(groups)) {
    const row = document.createElement('div'); row.className = 'ox-theme__row';
    const lab = document.createElement('span'); lab.className = 'ox-theme__label'; lab.textContent = gname;
    row.append(lab);
    for (const [k, t] of items) {
      const s = document.createElement('button');
      s.type = 'button'; s.className = 'ox-theme__sw' + (k === cur ? ' is-on' : ''); s.setAttribute('role', 'menuitemradio');
      s.setAttribute('aria-checked', String(k === cur)); s.setAttribute('aria-label', t.label); s.title = t.label;
      s.style.background = `linear-gradient(135deg, ${t.b}, ${t.a} 55%, ${t.c})`;
      s.addEventListener('click', () => {
        if (k === cur) { toggle(false); return; }
        try { localStorage.setItem('outreach.theme', k); } catch {}
        location.reload();
      });
      row.append(s);
    }
    pop.append(row);
  }
  const toggle = (v) => { pop.hidden = !v; btn.setAttribute('aria-expanded', String(v)); };
  btn.addEventListener('click', (e) => { e.stopPropagation(); toggle(pop.hidden); });
  document.addEventListener('click', (e) => { if (!pop.hidden && !pop.contains(e.target)) toggle(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !pop.hidden) { toggle(false); btn.focus(); } });
  document.body.append(btn, pop);
})();

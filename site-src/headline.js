// The hero headline comes in letter by letter (GSAP SplitText, vendor/gsap/SplitText.min.js). It waits for
// lang.js to have put the right language in, splits it into words + letters (words never break apart, and
// Intl.Segmenter keeps Georgian letters whole), lets the letters rise in, then puts the plain text back.
// The gradient word (<em>) moves as one piece: splitting it would lose its background-clip gradient.
// The 3D page's own reveal fades the whole headline in; that tween is taken off the headline so it doesn't
// play twice. Under reduced motion nothing happens and the headline just shows.
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const root = document.documentElement;
  const css = document.createElement('style');
  css.textContent = 'html.ox-split-wait .hero__title{visibility:hidden}';
  document.head.append(css);
  root.classList.add('ox-split-wait');
  const show = () => root.classList.remove('ox-split-wait');
  setTimeout(show, 3000); // never keep the headline hidden if something below fails

  const t0 = performance.now();
  const ready = () => {
    const gsap = window.__oxGsap, h1 = document.querySelector('.hero__title');
    if (!gsap || !window.SplitText || !h1 || !h1.dataset.oxLang) return null;
    // wait (briefly) for the page's own reveal to start, so it can be taken off the headline
    if (!gsap.getTweensOf(h1).length && performance.now() - t0 < 1200) return null;
    return { gsap, h1 };
  };
  const wait = () => {
    const r = ready();
    if (!r) { if (performance.now() - t0 < 3000) requestAnimationFrame(wait); return; }
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(() => run(r)).catch(show);
  };

  function run({ gsap, h1 }) {
    gsap.registerPlugin(window.SplitText);
    gsap.killTweensOf(h1);
    gsap.set(h1, { opacity: 1, y: 0, filter: 'none' });
    const split = window.SplitText.create(h1, { type: 'words,chars', ignore: 'em' });
    const em = h1.querySelector('em');
    const parts = split.chars.concat(em ? [em] : [])
      .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    if (em) gsap.set(em, { display: 'inline-block' });
    gsap.set(parts, { opacity: 0, yPercent: 45 });
    show();
    gsap.to(parts, {
      opacity: 1, yPercent: 0, duration: 0.55, ease: 'power2.out', stagger: { amount: 0.6 }, delay: 0.1,
      onComplete: () => { split.revert(); if (em) em.style.display = ''; },
    });
  }
  wait();
})();

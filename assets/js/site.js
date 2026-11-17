(function () {
  const doc = document.documentElement;
  doc.classList.remove('no-js');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) doc.classList.add('reduced');
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';

  /* nav: solid after hero, hide on scroll down */
  const nav = document.getElementById('nav');
  const hero = document.querySelector('.hero, .bhero');
  let lastY = 0;
  function onScroll() {
    const y = window.scrollY;
    const limit = hero ? hero.offsetHeight - 100 : 40;
    if (nav) {
      nav.classList.toggle('solid', y > limit || !hero || nav.dataset.solid === '1');
      nav.classList.toggle('hide', y > lastY && y > 400 && !document.getElementById('mega')?.classList.contains('open'));
    }
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* mega menu */
  const megaBtn = document.getElementById('megaBtn');
  const mega = document.getElementById('mega');
  if (megaBtn && mega) {
    const set = (open) => {
      mega.classList.toggle('open', open);
      megaBtn.setAttribute('aria-expanded', open);
      megaBtn.querySelector('.chev').style.transform = open ? 'rotate(180deg)' : '';
      if (open) nav.dataset.solid = '1'; else delete nav.dataset.solid;
      onScroll();
    };
    megaBtn.addEventListener('click', (e) => { e.stopPropagation(); set(!mega.classList.contains('open')); });
    document.addEventListener('click', (e) => { if (!mega.contains(e.target)) set(false); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') set(false); });
  }

  /* mobile menu */
  const burger = document.getElementById('burger'), mnav = document.getElementById('mnav'), mclose = document.getElementById('mclose');
  if (burger && mnav) {
    burger.addEventListener('click', () => mnav.classList.add('open'));
    mclose.addEventListener('click', () => mnav.classList.remove('open'));
    mnav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => mnav.classList.remove('open')));
  }

  /* fit footer wordmark to width */
  function fitMark() {
    document.querySelectorAll('.mark').forEach((m) => {
      m.style.fontSize = '100px';
      const cs = getComputedStyle(m.parentElement); const w = m.parentElement.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      m.style.fontSize = (100 * w / m.scrollWidth) * 0.995 + 'px';
    });
  }
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(fitMark);
  window.addEventListener('resize', fitMark);

  if (!hasGsap || reduced) {
    document.querySelectorAll('.rv').forEach((el) => { el.style.opacity = 1; el.style.transform = 'none'; });
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  /* smooth scroll */
  if (window.Lenis) {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length > 1 && document.querySelector(id)) { e.preventDefault(); lenis.scrollTo(id, { offset: -60 }); }
    }));
  }

  /* hero headline: word reveal */
  document.querySelectorAll('.split').forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w) => `<span style="display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.08em;margin-bottom:-.08em"><span class="w" style="display:inline-block">${w}</span></span>`).join(' ');
    gsap.from(el.querySelectorAll('.w'), { yPercent: 110, duration: 1.2, ease: 'expo.out', stagger: 0.06, delay: 0.15 });
  });

  /* hero image: slow zoom + parallax */
  const heroImg = document.getElementById('heroImg');
  if (heroImg) {
    gsap.fromTo(heroImg, { scale: 1.12 }, { scale: 1, duration: 2.4, ease: 'expo.out' });
    gsap.to(heroImg, { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  }

  /* reveals */
  ScrollTrigger.batch('.rv', {
    start: 'top 88%',
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1.1, ease: 'expo.out', stagger: 0.08, overwrite: true }),
  });

  /* parallax inside frames */
  document.querySelectorAll('.px').forEach((img) => {
    gsap.fromTo(img, { yPercent: -8 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  /* count up */
  document.querySelectorAll('[data-count]').forEach((el) => {
    const end = +el.dataset.count, o = { v: 0 };
    el.textContent = '0';
    ScrollTrigger.create({
      trigger: el, start: 'top 90%', once: true,
      onEnter: () => gsap.to(o, { v: end, duration: 1.8, ease: 'power3.out', onUpdate: () => { el.textContent = Math.round(o.v); }, onComplete: () => { el.textContent = end; } }),
    });
  });

  window.addEventListener('load', () => ScrollTrigger.refresh());
})();

(function () {
  document.documentElement.classList.remove('no-js');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* nav shadow */
  const nav = $('#nav');
  addEventListener('scroll', () => nav.classList.toggle('sh', scrollY > 50), { passive: true });

  /* mobile menu */
  $('#burger').onclick = () => $('#mnav').classList.add('open');
  $('#mclose').onclick = () => $('#mnav').classList.remove('open');
  $$('#mnav a').forEach((a) => a.addEventListener('click', () => $('#mnav').classList.remove('open')));

  /* rail: buttons, drag, progress */
  const rail = $('#rail'), prog = $('#prog');
  const step = () => rail.querySelector('.slide').offsetWidth + 16;
  $('#next').onclick = () => rail.scrollBy({ left: step(), behavior: 'smooth' });
  $('#prev').onclick = () => rail.scrollBy({ left: -step(), behavior: 'smooth' });
  const upd = () => {
    const max = rail.scrollWidth - rail.clientWidth, f = max > 0 ? rail.scrollLeft / max : 0;
    const w = rail.clientWidth / rail.scrollWidth;
    prog.style.width = w * 100 + '%';
    prog.style.transform = `translateX(${f * (1 / w - 1) * 100}%)`;
  };
  rail.addEventListener('scroll', upd, { passive: true }); addEventListener('resize', upd); upd();
  let down = false, sx = 0, sl = 0, moved = false;
  rail.addEventListener('pointerdown', (e) => { if (e.pointerType !== 'mouse') return; down = true; moved = false; sx = e.clientX; sl = rail.scrollLeft; rail.classList.add('drag'); });
  addEventListener('pointermove', (e) => { if (!down) return; const dx = e.clientX - sx; if (Math.abs(dx) > 4) moved = true; rail.scrollLeft = sl - dx; });
  addEventListener('pointerup', () => { down = false; rail.classList.remove('drag'); });
  rail.addEventListener('click', (e) => { if (moved) { e.preventDefault(); moved = false; } }, true);

  /* country explorer */
  const C = [
    ['bj', 'Benin', 'Porto-Novo', '../assets/img/biosphere.webp'],
    ['bf', 'Burkina Faso', 'Ouagadougou', '../assets/img/biosphere.webp'],
    ['cv', 'Cabo Verde', 'Praia', ''],
    ['ci', "Côte d'Ivoire", 'Yamoussoukro', ''],
    ['gm', 'Gambia', 'Banjul', ''],
    ['gh', 'Ghana', 'Accra', '../assets/img/wm/asante.jpg'],
    ['gn', 'Guinea', 'Conakry', ''],
    ['gw', 'Guinea-Bissau', 'Bissau', ''],
    ['lr', 'Liberia', 'Monrovia', ''],
    ['ml', 'Mali', 'Bamako', '../assets/img/wm/djenne.jpg'],
    ['ne', 'Niger', 'Niamey', ''],
    ['ng', 'Nigeria', 'Abuja', '../assets/img/wm/osun.jpg'],
    ['sn', 'Senegal', 'Dakar', '../assets/img/hero-saloum.jpg'],
    ['sl', 'Sierra Leone', 'Freetown', ''],
    ['tg', 'Togo', 'Lomé', '../assets/img/wm/koutammakou.jpg'],
  ];
  const tabs = $('#ctabs'), panel = $('#cpanel');
  tabs.innerHTML = C.map((c, i) => `<button role="tab" data-i="${i}"><b style="font-weight:500">${c[1]}</b><span>${c[2]}</span></button>`).join('');
  const arrow = '<svg><use href="#arr"/></svg>';
  function show(i) {
    const c = C[i];
    $$('button', tabs).forEach((b, j) => { b.classList.toggle('on', i === j); b.setAttribute('aria-selected', i === j); });
    const ab = tabs.children[i];
    if (ab && getComputedStyle(tabs).flexDirection === 'row') tabs.scrollTo({ left: ab.offsetLeft - 12, behavior: 'smooth' });
    panel.innerHTML = `${c[3] ? `<img class="bgimg" src="${c[3]}" alt="">` : ''}
      <div class="top fade"><span>Country profile</span><span>${String(i + 1).padStart(2, '0')} of 15</span></div>
      <div class="fade"><div class="nm">${c[1]}</div>
        <div class="meta"><div>Capital<b>${c[2]}</b></div><div>Regional office<b>Dakar</b></div><div>Fields covered<b>All five sectors</b></div></div></div>
      <div class="acts fade"><a class="btn b-white" href="https://www.unesco.org/en/countries/${c[0]}">Country profile ${arrow}</a><a class="btn b-soft" href="#">Data and statistics</a></div>`;
  }
  tabs.addEventListener('click', (e) => { const b = e.target.closest('button'); if (b) show(+b.dataset.i); });
  show(12);

  /* resources filter */
  $('#filters').addEventListener('click', (e) => {
    const b = e.target.closest('.chip'); if (!b) return;
    $$('#filters .chip').forEach((x) => x.classList.toggle('on', x === b));
    const f = b.dataset.f;
    $$('#cards .card').forEach((c) => { c.classList.toggle('hide', f !== 'all' && !c.dataset.c.split(' ').includes(f)); c.style.opacity = 1; c.style.transform = 'none'; });
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  });

  /* video playlist */
  $('#plist').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    $$('#plist button').forEach((x) => x.classList.toggle('on', x === b));
    $('#mainImg').src = b.dataset.img; $('#mainT').textContent = b.querySelector('b').textContent; $('#mainSub').textContent = b.dataset.s;
    $('#mainV').href = 'https://www.youtube.com/watch?v=' + b.dataset.v;
  });

  /* footer wordmark fit */
  function fit() { const m = $('#big'); m.style.fontSize = '100px'; const w = m.parentElement.clientWidth - parseFloat(getComputedStyle(m.parentElement).paddingLeft) * 2; m.style.fontSize = (100 * w / m.scrollWidth) * 0.995 + 'px'; }
  (document.fonts ? document.fonts.ready : Promise.resolve()).then(fit); addEventListener('resize', fit);

  if (reduced || !window.gsap) { $$('.rv').forEach((e) => { e.style.opacity = 1; e.style.transform = 'none'; }); return; }
  gsap.registerPlugin(ScrollTrigger);

  if (window.Lenis) {
    const lenis = new Lenis({ duration: 1.05 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
    $$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => { const id = a.getAttribute('href'); if (id.length > 1 && $(id)) { e.preventDefault(); lenis.scrollTo(id, { offset: -90 }); } }));
  }

  $$('.split').forEach((el) => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w) => `<span style="display:inline-block;overflow:hidden;vertical-align:top;padding-bottom:.12em;margin-bottom:-.12em"><span class="w" style="display:inline-block">${w}</span></span>`).join(' ');
    gsap.from($$('.w', el), { yPercent: 115, duration: 1.3, ease: 'expo.out', stagger: 0.05, delay: 0.1 });
  });

  ScrollTrigger.batch('.rv', { start: 'top 90%', onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.07, overwrite: true }) });

  $$('[data-count]').forEach((el) => {
    const end = +el.dataset.count, o = { v: 0 }; el.textContent = '0';
    ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => gsap.to(o, { v: end, duration: 1.8, ease: 'power3.out', onUpdate: () => (el.textContent = Math.round(o.v)), onComplete: () => (el.textContent = end) }) });
  });

  addEventListener('load', () => ScrollTrigger.refresh());
})();

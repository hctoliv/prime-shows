(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const root = document.documentElement;
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const IG_USER = 'primeshowseventossp';

  /* ---------- intro 3 2 1 ---------- */
  const hero = $('#hero');
  const cd = $('#countdown');
  let introDone = false;
  function endIntro() {
    if (introDone) return;
    introDone = true;
    try { sessionStorage.setItem('ps-intro', '1'); } catch (e) {}
    if (!root.classList.contains('intro-on')) { hero.classList.add('ready'); return; }
    cd.classList.add('out');
    setTimeout(() => { root.classList.remove('intro-on'); }, 700);
    setTimeout(() => hero.classList.add('ready'), 250);
  }
  if (root.classList.contains('intro-on') && !reduce) {
    setTimeout(endIntro, 3500);
    cd.addEventListener('click', endIntro);
    addEventListener('keydown', endIntro, { once: true });
  } else {
    root.classList.remove('intro-on');
    endIntro();
  }

  /* ---------- header ---------- */
  const hd = $('#hd');
  const burger = $('#burger');
  burger.addEventListener('click', () => {
    const open = root.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', open);
  });
  $$('#nav a').forEach(a => a.addEventListener('click', () => {
    root.classList.remove('menu-open');
    burger.setAttribute('aria-expanded', 'false');
  }));

  /* ---------- lazy videos: load near viewport, pause off-screen ---------- */
  const vio = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const v = e.target;
      if (e.isIntersecting) {
        if (!v.src && v.dataset.src) v.src = v.dataset.src;
        const p = v.play(); if (p) p.catch(() => {});
      } else if (!v.paused) v.pause();
    });
  }, { rootMargin: '200px 0px' });
  $$('video[data-src]').forEach(v => vio.observe(v));

  /* hero: light up one column at a time */
  const cols = $$('.hcol');
  let litI = 0;
  setInterval(() => {
    cols.forEach((c, i) => c.classList.toggle('lit', i === litI));
    litI = (litI + 1) % cols.length;
  }, 2600);

  /* ---------- stage lights canvas ---------- */
  const cv = $('#lights');
  const ctx = cv.getContext('2d');
  let W = 0, H = 0, dpr = 1;
  const ptr = { x: .5, y: .6, tx: .5, ty: .6 };
  const beams = [
    { x: .12, base: .35, sp: .00042, ph: 0, col: '248,216,104' },
    { x: .5, base: .5, sp: .00031, ph: 2, col: '255,240,200' },
    { x: .88, base: .65, sp: .00038, ph: 4, col: '232,184,80' }
  ];
  const dust = Array.from({ length: 70 }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.6 + .3, v: Math.random() * .00025 + .00008, a: Math.random() }));
  function size() {
    dpr = Math.min(devicePixelRatio || 1, 1.5);
    W = cv.clientWidth; H = cv.clientHeight;
    cv.width = W * dpr; cv.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size(); addEventListener('resize', size);
  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    ptr.tx = (e.clientX - r.left) / r.width; ptr.ty = (e.clientY - r.top) / r.height;
  });
  let heroVisible = true;
  new IntersectionObserver(([e]) => { heroVisible = e.isIntersecting; }).observe(hero);
  function drawLights(t) {
    ctx.clearRect(0, 0, W, H);
    ptr.x += (ptr.tx - ptr.x) * .04; ptr.y += (ptr.ty - ptr.y) * .04;
    beams.forEach((b, i) => {
      const sway = reduce ? 0 : Math.sin(t * b.sp + b.ph) * .22;
      const tgt = b.base + sway + (ptr.x - .5) * (i === 1 ? .5 : .25);
      const ox = b.x * W, oy = -20;
      const tx = tgt * W, ty = H * 1.05;
      const ang = Math.atan2(ty - oy, tx - ox);
      const len = Math.hypot(tx - ox, ty - oy);
      const spread = .13;
      ctx.save();
      ctx.translate(ox, oy); ctx.rotate(ang);
      const g = ctx.createLinearGradient(0, 0, len, 0);
      g.addColorStop(0, `rgba(${b.col},.38)`);
      g.addColorStop(.5, `rgba(${b.col},.1)`);
      g.addColorStop(1, `rgba(${b.col},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.moveTo(0, -6); ctx.lineTo(len, -len * spread); ctx.lineTo(len, len * spread); ctx.lineTo(0, 6);
      ctx.closePath(); ctx.fill();
      ctx.restore();
      const hg = ctx.createRadialGradient(ox, 0, 0, ox, 0, 90);
      hg.addColorStop(0, `rgba(${b.col},.55)`); hg.addColorStop(1, `rgba(${b.col},0)`);
      ctx.fillStyle = hg; ctx.fillRect(ox - 90, 0, 180, 90);
    });
    dust.forEach(d => {
      if (!reduce) { d.y -= d.v * 16; d.x += Math.sin(t * .0005 + d.a * 6) * .0002; }
      if (d.y < -.02) { d.y = 1.02; d.x = Math.random(); }
      ctx.fillStyle = `rgba(255,236,190,${.25 + .35 * Math.sin(t * .002 + d.a * 9) ** 2})`;
      ctx.beginPath(); ctx.arc(d.x * W, d.y * H, d.r, 0, 6.283); ctx.fill();
    });
  }

  /* ---------- artists ---------- */
  const ARTISTS = [
    {
      name: 'Jéssica Vieira', handle: 'jessica.vieira.oficial',
      img: 'img/jessica.jpg', alt: 'Jéssica Vieira cantando ao vivo',
      clip: 'video/jessica.mp4', poster: 'video/jessica.jpg',
      quote: '“Mais um evento @primeshowseventossp @quintaldoespeto”',
      facts: ['Cantora, contato direto com a Prime Shows', 'Palcos recentes: Quintal do Espeto e Espaço Interlagos', 'Dividiu o palco com Bruno Hipólito e Junior & Leonardo']
    },
    {
      name: 'Dener & Thiago', handle: 'denerethiago.oficial',
      img: 'img/dener-thiago.jpg', alt: 'Dener e Thiago cantando no palco',
      clip: 'video/dener-thiago.mp4', poster: 'video/dener-thiago.jpg',
      quote: '“O artista vive do palco, da música e da energia de vocês!”',
      facts: ['Dupla de Luccas Lima e Thiago Marques, representados por Prime Shows', 'DVD “De SP pro Mundo”, com a inédita “Essa tal de carência” gravada com Thaeme & Thiago', 'Participação no DVD de Anselmo & Rafael em Cuiabá, MT']
    },
    {
      name: 'Junior & Leonardo', handle: 'junioreleonardooficial',
      img: 'img/junior-leonardo.jpg', alt: 'Junior e Leonardo no palco',
      clip: 'video/junior-leonardo.mp4', poster: 'video/junior-leonardo.jpg',
      quote: '“Que show pancada foi esse @primeshowseventossp”',
      facts: ['Dupla com site oficial em junioreleonardo.com.br', '“Show grandioso no rodeio de Itapecerica da Serra”', 'Participação especial na gravação do DVD de Dener & Thiago']
    },
    {
      name: 'Fernando Lorenz', handle: 'fernandolorenzcantor',
      img: 'img/fernando-lorenz.jpg', alt: 'Retrato do cantor Fernando Lorenz',
      clip: 'video/fernando-lorenz.mp4', poster: 'video/fernando-lorenz.jpg',
      quote: '“Participação no show do @ricardorosalemcantor lá na @montecarlo.sp pela @primeshowseventossp”',
      facts: ['Cantor e compositor', 'Ouça “Terminho de Compromisso” no Sua Música', '#VemComFernandoLorenz']
    }
  ];
  const stage = $('#stage'), sImg = $('#stageImg'), sVid = $('#stageVid');
  const tabs = $$('#roster button');
  let cur = 0;
  function stopClip() {
    sVid.pause(); stage.classList.remove('playing');
    $('.play-t').textContent = 'Ouvir ao vivo';
  }
  function showArtist(i, instant) {
    if (i === cur && !instant) return;
    cur = i;
    const a = ARTISTS[i];
    tabs.forEach((t, j) => t.setAttribute('aria-selected', j === i));
    stopClip();
    sVid.removeAttribute('src'); sVid.load();
    const apply = () => {
      sImg.src = a.img; sImg.alt = a.alt;
      $('#siHandle').textContent = '@' + a.handle;
      $('#siName').textContent = a.name;
      $('#siQuote').textContent = a.quote;
      $('#siFacts').innerHTML = a.facts.map(f => `<li>${f}</li>`).join('');
      const hire = $('#siHire'); hire.textContent = 'Contratar ' + a.name; hire.dataset.artist = a.name;
      $('#siIg').href = `https://www.instagram.com/${a.handle}/`;
      sVid.poster = a.poster;
      stage.classList.remove('swap'); sImg.classList.remove('swap');
    };
    if (instant) return apply();
    stage.classList.add('swap'); sImg.classList.add('swap');
    setTimeout(apply, 280);
  }
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => showArtist(i));
    t.addEventListener('mouseenter', () => { if (matchMedia('(hover:hover)').matches) showArtist(i); });
  });
  showArtist(0, true);
  ARTISTS.forEach(a => { const im = new Image(); im.src = a.img; });
  $('#play').addEventListener('click', () => {
    if (stage.classList.contains('playing')) return stopClip();
    if (!sVid.src.endsWith(ARTISTS[cur].clip)) sVid.src = ARTISTS[cur].clip;
    sVid.muted = false;
    sVid.play().then(() => {
      stage.classList.add('playing');
      $('.play-t').textContent = 'Pausar';
    }).catch(() => {});
  });
  sVid.addEventListener('ended', stopClip);
  new IntersectionObserver(([e]) => { if (!e.isIntersecting) stopClip(); }).observe(stage);
  $('#siHire').addEventListener('click', e => selectArtist(e.currentTarget.dataset.artist));

  /* ---------- scroll-driven sections ---------- */
  const venues = $('#palcos'), vItems = $$('#vlist li'), vFrames = $$('.vf'), vProg = $('#vprog');
  const how = $('#como'), howNum = $('#howNum'), howSteps = $$('#howSteps li');
  let vIdx = 0, hIdx = 0;
  const mqMobile = matchMedia('(max-width:900px)');
  function progress(el) {
    const r = el.getBoundingClientRect();
    const span = r.height - innerHeight;
    return span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
  }
  let lastY = scrollY;
  function onScroll() {
    const y = scrollY;
    hd.classList.toggle('solid', y > 40);
    hd.classList.toggle('hide', y > lastY && y > innerHeight * .9 && !root.classList.contains('menu-open'));
    lastY = y;
    if (!mqMobile.matches) {
      const p = progress(venues);
      const i = Math.min(vFrames.length - 1, Math.floor(p * vFrames.length));
      vProg.style.width = (p * 100).toFixed(1) + '%';
      if (i !== vIdx) {
        vIdx = i;
        vItems.forEach((li, j) => li.classList.toggle('on', j === i));
        vFrames.forEach((f, j) => f.classList.toggle('on', j === i));
      }
    }
    const hp = progress(how);
    const hi = Math.min(2, Math.floor(hp * 3.001));
    how.classList.toggle('final', hp > .9);
    if (hi !== hIdx) {
      hIdx = hi;
      howNum.classList.add('flip');
      setTimeout(() => { howNum.textContent = String(3 - hi); howNum.classList.remove('flip'); }, 180);
      howSteps.forEach((s, j) => s.classList.toggle('on', j === hi));
    }
  }

  /* single rAF loop */
  let ticking = false;
  addEventListener('scroll', () => { ticking = true; }, { passive: true });
  function frame(t) {
    if (ticking) { ticking = false; onScroll(); }
    if (heroVisible) drawLights(t);
    requestAnimationFrame(frame);
  }
  onScroll();
  requestAnimationFrame(frame);

  /* reveal */
  const rio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } }), { threshold: .15 });
  $$('.sec-head, .stage-wrap, .hire-copy, .hire-form').forEach(el => { el.classList.add('rv'); rio.observe(el); });

  /* ---------- hire form ---------- */
  const form = $('#form'), msgEl = $('#msg'), pub = $('#pub'), pubOut = $('#pubOut');
  const fmtDate = v => { if (!v) return ''; const [y, m, d] = v.split('-'); return `${d}/${m}/${y}`; };
  function buildMsg() {
    const f = new FormData(form);
    const n = (+f.get('publico')).toLocaleString('pt-BR');
    const lines = [
      `Olá, Prime! ${f.get('nome') ? 'Aqui é ' + f.get('nome').trim() + '. ' : ''}Quero contratar um show.`,
      `Artista: ${f.get('artista')}`,
      `Evento: ${f.get('tipo')}`,
      f.get('data') ? `Data: ${fmtDate(f.get('data'))}` : 'Data: a definir',
      f.get('cidade') ? `Cidade: ${f.get('cidade').trim()}` : '',
      `Público estimado: ${n} pessoas`
    ].filter(Boolean);
    pubOut.textContent = `${n} pessoas`;
    msgEl.textContent = lines.join('\n');
    return lines.join('\n');
  }
  function selectArtist(name) {
    const r = $$('input[name=artista]').find(i => i.value === name);
    if (r) { r.checked = true; buildMsg(); }
  }
  form.addEventListener('input', buildMsg);
  buildMsg();
  const toast = $('#toast');
  function showToast(t) { toast.textContent = t; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 3200); }
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const text = buildMsg();
    // open the tab inside the click so popup blockers allow it, point it at the DM after the countdown
    const win = window.open('about:blank', '_blank');
    let copied = false;
    try { await navigator.clipboard.writeText(text); copied = true; } catch (err) {}
    const btn = $('#send'), label = btn.querySelector('span');
    btn.classList.add('counting'); btn.disabled = true;
    const steps = ['3', '2', '1', 'Abrindo o Direct…'];
    for (const s of steps) { label.textContent = s; await new Promise(r => setTimeout(r, reduce ? 50 : 420)); }
    const dm = `https://ig.me/m/${IG_USER}`;
    if (win) { win.opener = null; win.location.href = dm; } else location.href = dm;
    showToast(copied ? 'Mensagem copiada. Cole no Direct da Prime e envie.' : 'Copie a mensagem acima e cole no Direct da Prime.');
    label.textContent = 'Enviar pelo Instagram'; btn.classList.remove('counting'); btn.disabled = false;
  });
})();

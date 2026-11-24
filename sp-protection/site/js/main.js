/* SP< Protection — interações do site */
(function () {
  'use strict';
  var doc = document.documentElement;
  doc.classList.remove('no-js');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Navegação: fica sólida ao rolar (ou sempre, em páginas com hero claro) */
  var nav = document.querySelector('.nav');
  if (nav) {
    var alwaysSolid = nav.hasAttribute('data-solid');
    var onScroll = function () {
      nav.classList.toggle('is-solid', alwaysSolid || window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    var toggle = nav.querySelector('.nav__toggle');
    if (toggle) {
      toggle.addEventListener('click', function () {
        var open = nav.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
      nav.querySelectorAll('.nav__menu a').forEach(function (a) {
        a.addEventListener('click', function () { nav.classList.remove('is-open'); });
      });
    }
  }

  /* Texto dinâmico do hero: "a sua dental" → "o seu hospital" → ... */
  /* Efeito de escrita: digita, pausa, apaga e digita a próxima */
  document.querySelectorAll('[data-rotator]').forEach(function (el) {
    var words = Array.prototype.map.call(el.querySelectorAll('span'), function (s) { return s.textContent.trim(); });
    if (!words.length) return;
    el.innerHTML = '<span class="typed"></span><span class="caret"></span>';
    var typed = el.querySelector('.typed');
    if (reduceMotion) { typed.textContent = words[0]; return; }
    var w = 0, n = 0, deleting = false;
    var TYPE = 75, DELETE = 38, HOLD = 1900, GAP = 380;
    var tick = function () {
      var word = words[w];
      if (!deleting) {
        n++;
        typed.textContent = word.slice(0, n);
        el.classList.add('is-typing');
        if (n === word.length) { deleting = true; el.classList.remove('is-typing'); return setTimeout(tick, HOLD); }
        return setTimeout(tick, TYPE + Math.random() * 40);
      }
      n--;
      typed.textContent = word.slice(0, n);
      el.classList.add('is-typing');
      if (n === 0) { deleting = false; w = (w + 1) % words.length; el.classList.remove('is-typing'); return setTimeout(tick, GAP); }
      setTimeout(tick, DELETE);
    };
    setTimeout(tick, 600);
  });

  /* Revelar ao rolar + ativar a linha do tempo */
  var revealEls = document.querySelectorAll('.reveal, .timeline');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* Contador: os números sobem de 0 até o valor quando entram na tela */
  var counters = document.querySelectorAll('.stat__value, .impact__big, .prod b, .growth b');
  var parseNum = function (el) {
    var txt = el.textContent;
    var m = txt.match(/\d[\d.]*(,\d+)?/);
    if (!m) return null;
    var dec = m[1] ? m[1].length - 1 : 0;
    var value = parseFloat(m[0].replace(/\./g, '').replace(',', '.'));
    return { pre: txt.slice(0, m.index), post: txt.slice(m.index + m[0].length), value: value, dec: dec, final: txt };
  };
  var fmt = function (n, dec) {
    return n.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec });
  };
  var runCounter = function (el) {
    var d = el._count;
    if (!d) return;
    var dur = 1500, t0 = null;
    var step = function (t) {
      if (!t0) t0 = t;
      var k = Math.min(1, (t - t0) / dur);
      var eased = 1 - Math.pow(1 - k, 3);
      el.textContent = d.pre + fmt(d.value * eased, d.dec) + d.post;
      if (k < 1) requestAnimationFrame(step); else el.textContent = d.final;
    };
    requestAnimationFrame(step);
  };
  if (!reduceMotion && 'IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { runCounter(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.6 });
    counters.forEach(function (el) {
      var d = parseNum(el);
      if (!d) return;
      el._count = d;
      el.classList.add('is-counting');
      el.textContent = d.pre + fmt(0, d.dec) + d.post;
      cio.observe(el);
    });
  }

  /* Vídeos: só tocam quando visíveis (economia de bateria/dados) */
  var videos = document.querySelectorAll('video[data-autoplay]');
  if ('IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting && !reduceMotion) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
        else { v.pause(); }
      });
    }, { threshold: 0.1 });
    videos.forEach(function (v) { vio.observe(v); });
  }

  /* Efeito 3D (tilt) nos cards e mídias com [data-tilt] */
  if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
    document.querySelectorAll('[data-tilt]').forEach(function (el) {
      var max = parseFloat(el.getAttribute('data-tilt')) || 6;
      el.addEventListener('mousemove', function (ev) {
        var r = el.getBoundingClientRect();
        var x = (ev.clientX - r.left) / r.width - 0.5;
        var y = (ev.clientY - r.top) / r.height - 0.5;
        el.style.transform = 'rotateY(' + (x * max) + 'deg) rotateX(' + (-y * max) + 'deg) translateY(-4px)';
      });
      el.addEventListener('mouseleave', function () { el.style.transform = ''; });
    });
  }

  /* Carrossel da linha do tempo (setas + rolagem nativa) */
  document.querySelectorAll('[data-carousel]').forEach(function (c) {
    var track = c.querySelector('[data-track]');
    var prev = c.querySelector('[data-prev]');
    var next = c.querySelector('[data-next]');
    if (!track) return;
    var step = function (dir) {
      var card = track.firstElementChild;
      var w = card ? card.getBoundingClientRect().width + 20 : 300;
      track.scrollBy({ left: dir * w, behavior: reduceMotion ? 'auto' : 'smooth' });
    };
    var update = function () {
      if (prev) prev.disabled = track.scrollLeft < 8;
      if (next) next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8;
    };
    if (prev) prev.addEventListener('click', function () { step(-1); });
    if (next) next.addEventListener('click', function () { step(1); });
    track.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  });

  /* Imagens ainda não entregues: remove o <img> quebrado e mantém o placeholder */
  document.querySelectorAll('img[data-pending]').forEach(function (img) {
    var drop = function () { img.remove(); };
    if (img.complete && img.naturalWidth === 0) drop();
    else img.addEventListener('error', drop);
  });

  /* Filtros visuais (produtos/blog) */
  document.querySelectorAll('[data-filters]').forEach(function (group) {
    var target = document.querySelector(group.getAttribute('data-filters'));
    group.addEventListener('click', function (ev) {
      var btn = ev.target.closest('button');
      if (!btn) return;
      group.querySelectorAll('button').forEach(function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); });
      if (!target) return;
      var f = btn.getAttribute('data-filter');
      target.querySelectorAll('[data-tags]').forEach(function (card) {
        var show = f === 'all' || card.getAttribute('data-tags').split(' ').indexOf(f) > -1;
        card.hidden = !show;
      });
    });
  });

  /* Miniaturas da galeria do produto */
  document.querySelectorAll('.gallery__thumbs').forEach(function (g) {
    g.addEventListener('click', function (ev) {
      var b = ev.target.closest('button');
      if (!b) return;
      g.querySelectorAll('button').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      var main = g.parentElement.querySelector('[data-gallery-main]');
      var src = b.getAttribute('data-src');
      if (main && src) main.src = src;
    });
  });

  /* Fale conosco: intenção antes dos dados */
  var intentForm = document.querySelector('[data-intent-form]');
  if (intentForm) {
    var panels = intentForm.querySelectorAll('[data-for]');
    var title = intentForm.querySelector('[data-intent-title]');
    var titles = {
      produto: 'Conte qual produto você procura.',
      parceria: 'Vamos conversar sobre parceria.',
      outro: 'Como podemos ajudar?'
    };
    var setIntent = function (intent, scroll) {
      document.querySelectorAll('[data-intent]').forEach(function (c) {
        c.setAttribute('aria-pressed', c.getAttribute('data-intent') === intent ? 'true' : 'false');
      });
      intentForm.hidden = false;
      var empty = document.querySelector('[data-intent-empty]');
      if (empty) empty.hidden = true;
      intentForm.setAttribute('data-current', intent);
      panels.forEach(function (p) {
        var show = p.getAttribute('data-for').split(' ').indexOf(intent) > -1;
        p.hidden = !show;
        p.querySelectorAll('input,select,textarea').forEach(function (f) { f.disabled = !show; });
      });
      var hidden = intentForm.querySelector('input[name="motivo"]');
      if (hidden) hidden.value = intent;
      if (title) title.textContent = titles[intent] || titles.outro;
      if (scroll) intentForm.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    };
    document.querySelectorAll('[data-intent]').forEach(function (c) {
      c.addEventListener('click', function (ev) { ev.preventDefault(); setIntent(c.getAttribute('data-intent'), true); });
    });
    var applyHash = function (scroll) {
      var fromHash = (location.hash.match(/intencao=(\w+)/) || [])[1];
      if (fromHash) setIntent(fromHash, scroll);
    };
    applyHash(false);
    window.addEventListener('hashchange', function () { applyHash(true); });
    intentForm.addEventListener('submit', function (ev) {
      ev.preventDefault();
      var ok = intentForm.querySelector('[data-success]');
      if (ok) { ok.hidden = false; ok.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    });
  }

  /* Ano no rodapé */
  document.querySelectorAll('[data-year]').forEach(function (el) { el.textContent = new Date().getFullYear(); });
})();

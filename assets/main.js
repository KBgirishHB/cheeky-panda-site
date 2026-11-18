/* Cheeky Panda Photography — interactions. No dependencies, no build step. */
(function () {
  'use strict';

  var doc = document, root = doc.documentElement, body = doc.body;
  var $ = function (s, c) { return (c || doc).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || doc).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var pad = function (n) { return (n < 10 ? '0' : '') + n; };

  /* ---------- landing gate: intro video until "Enter site" ---------- */
  var gate = $('#gate'), gateVideo = $('#gate-video'), gateSound = $('#gate-sound');
  function enterSite() {
    if (!gate || gate.classList.contains('is-leaving')) return;
    gate.classList.add('is-leaving');
    body.style.overflow = '';
    body.classList.add('is-loaded');
    setTimeout(function () {
      gate.classList.add('is-gone');
      if (gateVideo) { gateVideo.pause(); gateVideo.removeAttribute('src'); }
    }, reduced ? 0 : 950);
    var h1 = $('.hero__title'); if (h1) { h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }); }
  }
  if (gate) {
    body.style.overflow = 'hidden';
    if (reduced && gateVideo) { gateVideo.removeAttribute('autoplay'); gateVideo.pause(); }
    else if (gateVideo) {
      // phones only autoplay a video that is muted + inline; set both in script as well as in the markup
      gateVideo.muted = true; gateVideo.defaultMuted = true; gateVideo.loop = true;
      gateVideo.setAttribute('muted', ''); gateVideo.setAttribute('playsinline', ''); gateVideo.setAttribute('webkit-playsinline', '');
      var tryPlay = function () {
        if (gate.classList.contains('is-leaving')) return;
        var pl = gateVideo.play();
        if (pl && pl.then) pl.then(function () { gateVideo.classList.remove('is-blocked'); },
                                   function () { gateVideo.classList.add('is-blocked'); });   // blocked: show the logo, not a play button
      };
      tryPlay();
      gateVideo.addEventListener('canplay', tryPlay);
      ['touchstart', 'pointerdown', 'scroll'].forEach(function (ev) { gate.addEventListener(ev, tryPlay, { passive: true }); });
      doc.addEventListener('visibilitychange', function () { if (!doc.hidden) tryPlay(); });
    }
    $('#gate-enter').addEventListener('click', enterSite);
    $('#gate-enter').focus({ preventScroll: true });
    gate.addEventListener('keydown', function (e) { if (e.key === 'Escape') enterSite(); });
    if (gateSound && gateVideo) gateSound.addEventListener('click', function () {
      gateVideo.muted = !gateVideo.muted;
      if (gateVideo.paused) gateVideo.play();
      gateSound.textContent = gateVideo.muted ? 'Sound off' : 'Sound on';
      gateSound.setAttribute('aria-pressed', String(!gateVideo.muted));
    });
  } else body.classList.add('is-loaded');

  /* ---------- year ---------- */
  var y = $('#year'); if (y) y.textContent = new Date().getFullYear();

  /* ---------- toast ---------- */
  var toastEl = $('#toast'), toastT;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('on');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('on'); }, 2600);
  }

  /* ---------- nav: hide on scroll down, blur after scrolling, back-to-top ---------- */
  var nav = $('#nav'), totop = $('#totop'), hero = $('.hero');
  var lastY = window.pageYOffset, ticking = false;
  function onScroll() {
    var sy = window.pageYOffset;
    nav.classList.toggle('is-scrolled', sy > 40);
    if (!body.classList.contains('menu-open')) {
      if (sy > lastY + 4 && sy > 160) nav.classList.add('is-hidden');
      else if (sy < lastY - 4 || sy <= 160) nav.classList.remove('is-hidden');
    }
    totop.classList.toggle('on', sy > hero.offsetHeight * 0.9);
    lastY = sy;
    parallax();
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  totop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  });

  /* ---------- mobile menu ---------- */
  var burger = $('#burger'), menu = $('#menu');
  function setMenu(open) {
    body.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', String(!open));
    body.style.overflow = open ? 'hidden' : '';
    if (open) nav.classList.remove('is-hidden');
  }
  burger.addEventListener('click', function () { setMenu(!body.classList.contains('menu-open')); });
  $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
  window.addEventListener('resize', function () { if (window.innerWidth > 1000) setMenu(false); });

  /* ---------- parallax ---------- */
  var plx = $$('[data-speed]');
  var shots = $$('.ph img');
  function parallax() {
    if (reduced) return;
    var vh = window.innerHeight, i, el, r, mid;
    for (i = 0; i < plx.length; i++) {
      el = plx[i]; r = el.getBoundingClientRect();
      if (r.bottom < -200 || r.top > vh + 200) continue;
      mid = r.top + r.height / 2 - vh / 2;
      el.style.transform = 'translate3d(0,' + (mid * parseFloat(el.getAttribute('data-speed'))).toFixed(1) + 'px,0)';
    }
    for (i = 0; i < shots.length; i++) {
      el = shots[i].parentNode; r = el.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) continue;
      mid = (r.top + r.height / 2 - vh / 2) / vh;            // -1 … 1
      var lim = r.height * 0.05;
      shots[i].style.setProperty('--py', Math.max(-lim, Math.min(lim, -mid * lim * 1.6)).toFixed(1) + 'px');
    }
  }

  /* ---------- scroll reveals ---------- */
  var revealEls = $$('.reveal, .shot');
  $$('.reveal-group, .index, .stats, .foot__cols').forEach(function (g) {
    $$('.reveal', g).forEach(function (el, i) { el.style.setProperty('--d', (i * 0.09).toFixed(2) + 's'); });
  });
  if ('IntersectionObserver' in window && !reduced) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); ro.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    revealEls.forEach(function (el) { ro.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- count-up stats ---------- */
  var counters = $$('[data-count]');
  function runCount(el) {
    var end = parseInt(el.getAttribute('data-count'), 10), t0 = null, dur = 1600;
    function step(t) {
      if (!t0) t0 = t;
      var p = Math.min((t - t0) / dur, 1), eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(end * eased).toLocaleString('en-IN');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window && !reduced) {
    counters.forEach(function (el) { el.textContent = '0'; });
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { runCount(e.target); co.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  }

  /* ---------- services accordion + floating preview ---------- */
  var rows = $$('.row');
  rows.forEach(function (row) {
    var head = $('.row__head', row);
    head.addEventListener('click', function () {
      var open = !row.classList.contains('is-open');
      rows.forEach(function (r) {
        r.classList.remove('is-open');
        $('.row__head', r).setAttribute('aria-expanded', 'false');
      });
      if (open) { row.classList.add('is-open'); head.setAttribute('aria-expanded', 'true'); }
    });
  });
  var pv = $('#svc-preview');
  if (finePointer && pv) {
    var pvImg = $('img', pv), px = 0, py = 0, tx = 0, ty = 0, pvOn = false, pvRaf = null;
    var pvLoop = function () {
      px += (tx - px) * (reduced ? 1 : 0.14); py += (ty - py) * (reduced ? 1 : 0.14);
      pv.style.transform = 'translate3d(' + px.toFixed(1) + 'px,' + py.toFixed(1) + 'px,0)';
      pvRaf = pvOn ? requestAnimationFrame(pvLoop) : null;
    };
    rows.forEach(function (row) {
      var head = $('.row__head', row);
      head.addEventListener('mouseenter', function (e) {
        pvImg.src = row.getAttribute('data-preview');
        tx = px = e.clientX + 28; ty = py = e.clientY - 130;
        pvOn = true; pv.classList.add('on');
        if (!pvRaf) pvRaf = requestAnimationFrame(pvLoop);
      });
      head.addEventListener('mousemove', function (e) { tx = e.clientX + 28; ty = e.clientY - 130; });
      head.addEventListener('mouseleave', function () { pvOn = false; pv.classList.remove('on'); });
    });
  }

  /* ---------- testimonials ---------- */
  var quotes = $$('.quote'), qBar = $('#q-bar'), qCount = $('#q-count'), qi = 0, qTimer = null, QMS = 7000;
  function showQuote(n) {
    qi = (n + quotes.length) % quotes.length;
    quotes.forEach(function (q, i) { q.classList.toggle('is-on', i === qi); });
    qCount.textContent = pad(qi + 1) + ' / ' + pad(quotes.length);
    clearTimeout(qTimer);
    if (reduced) return;
    qBar.classList.remove('run'); void qBar.offsetWidth; qBar.classList.add('run');
    qTimer = setTimeout(function () { showQuote(qi + 1); }, QMS);
  }
  if (quotes.length) {
    $('#q-prev').addEventListener('click', function () { showQuote(qi - 1); });
    $('#q-next').addEventListener('click', function () { showQuote(qi + 1); });
    doc.addEventListener('visibilitychange', function () {
      if (doc.hidden) { clearTimeout(qTimer); qBar.classList.remove('run'); } else showQuote(qi);
    });
    showQuote(0);
  }

  /* ---------- lightbox ---------- */
  var lb = $('#lb'), lbImg = $('#lb-img'), lbTitle = $('#lb-title'), lbPlace = $('#lb-place'), lbCount = $('#lb-count');
  var items = $$('#gallery .ph'), li = 0, lastFocus = null;
  function lbShow(n) {
    li = (n + items.length) % items.length;
    var a = items[li], thumb = $('img', a);
    lbImg.classList.remove('ready');
    lbTitle.textContent = a.getAttribute('data-title');
    lbPlace.textContent = a.getAttribute('data-place');
    lbCount.textContent = pad(li + 1) + ' / ' + pad(items.length);
    lbImg.alt = thumb ? thumb.alt : a.getAttribute('data-title');
    var src = a.getAttribute('href');
    var pre = new Image();
    pre.onload = pre.onerror = function () {
      if (items[li] !== a) return;                 // user already moved on
      lbImg.src = src;
      requestAnimationFrame(function () { lbImg.classList.add('ready'); });
    };
    pre.src = src;
  }
  function lbOpen(n) {
    lastFocus = doc.activeElement;
    lb.classList.add('on'); lb.setAttribute('aria-hidden', 'false');
    body.style.overflow = 'hidden';
    lbShow(n);
    $('#lb-close').focus();
  }
  function lbClose() {
    lb.classList.remove('on'); lb.setAttribute('aria-hidden', 'true');
    body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  items.forEach(function (a, i) {
    a.addEventListener('click', function (e) { e.preventDefault(); lbOpen(i); });
  });
  $('#lb-close').addEventListener('click', lbClose);
  $('#lb-prev').addEventListener('click', function (e) { e.stopPropagation(); lbShow(li - 1); });
  $('#lb-next').addEventListener('click', function (e) { e.stopPropagation(); lbShow(li + 1); });
  lb.addEventListener('click', function (e) {
    if (e.target === lb || e.target.classList.contains('lb__fig')) lbClose();   // click outside
  });
  doc.addEventListener('keydown', function (e) {
    if (lb.classList.contains('on')) {
      if (e.key === 'Escape') lbClose();
      else if (e.key === 'ArrowLeft') lbShow(li - 1);
      else if (e.key === 'ArrowRight') lbShow(li + 1);
      else if (e.key === 'Tab') {                   // keep focus inside the dialog
        var f = $$('button', lb), first = f[0], last = f[f.length - 1];
        if (e.shiftKey && doc.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && doc.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    } else if (e.key === 'Escape' && body.classList.contains('menu-open')) setMenu(false);
  });
  var touchX = null;
  lb.addEventListener('touchstart', function (e) { touchX = e.changedTouches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (touchX === null) return;
    var dx = e.changedTouches[0].clientX - touchX; touchX = null;
    if (Math.abs(dx) > 50) lbShow(li + (dx < 0 ? 1 : -1));
  }, { passive: true });

  /* ---------- lazy Jotform embed ---------- */
  var frame = $('#jotform');
  function loadFrame() { if (frame && !frame.src) frame.src = frame.getAttribute('data-src'); }
  if (frame) {
    if ('IntersectionObserver' in window) {
      var fo = new IntersectionObserver(function (entries) {
        if (entries[0].isIntersecting) { loadFrame(); fo.disconnect(); }
      }, { rootMargin: '700px 0px' });
      fo.observe(frame);
    } else loadFrame();
  }

  /* ---------- copy email ---------- */
  var chip = $('#copy-email');
  if (chip) chip.addEventListener('click', function () {
    var email = chip.getAttribute('data-email');
    var done = function () { toast('Copied — ' + email); };
    var fallback = function () {
      var ta = doc.createElement('textarea');
      ta.value = email; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;left:-999px;top:0';
      body.appendChild(ta); ta.select();
      var ok = false; try { ok = doc.execCommand('copy'); } catch (err) {}
      body.removeChild(ta);
      if (ok) done(); else toast('Email: ' + email);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(email).then(done, fallback);
    else fallback();
  });

  /* ---------- footer wordmark: fit to full width ---------- */
  var wm = $('#wordmark');
  function fitWordmark() {
    if (!wm) return;
    wm.style.fontSize = '100px';
    var w = wm.getBoundingClientRect().width;
    if (w > 0) wm.style.fontSize = (100 * (root.clientWidth * 0.965) / w).toFixed(2) + 'px';
  }
  fitWordmark();
  window.addEventListener('resize', fitWordmark);
  window.addEventListener('load', fitWordmark);
  if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(fitWordmark);

  /* ---------- custom cursor (desktop only) ---------- */
  if (finePointer) {
    var dot = $('#cur-dot'), ring = $('#cur-ring');
    var mx = -100, my = -100, rx = -100, ry = -100;
    root.classList.add('has-cursor');
    var curLoop = function () {
      var k = reduced ? 1 : 0.17;
      rx += (mx - rx) * k; ry += (my - ry) * k;
      dot.style.transform = 'translate3d(' + mx + 'px,' + my + 'px,0)';
      ring.style.transform = 'translate3d(' + rx.toFixed(1) + 'px,' + ry.toFixed(1) + 'px,0)';
      requestAnimationFrame(curLoop);
    };
    doc.addEventListener('mousemove', function (e) {
      mx = e.clientX; my = e.clientY;
      dot.classList.remove('is-out'); ring.classList.remove('is-out');
      var t = e.target;
      var view = t.closest && t.closest('#gallery .ph');
      var link = !view && t.closest && t.closest('a, button, [role="button"]');
      ring.classList.toggle('is-view', !!view);
      ring.classList.toggle('is-link', !!link);
    }, { passive: true });
    doc.addEventListener('mouseleave', function () { dot.classList.add('is-out'); ring.classList.add('is-out'); });
    // the embedded form is another document: let the native cursor take over there
    var card = $('#formcard');
    if (card) {
      card.addEventListener('mouseenter', function () { dot.classList.add('is-out'); ring.classList.add('is-out'); });
    }
    requestAnimationFrame(curLoop);
  }

  onScroll();
})();

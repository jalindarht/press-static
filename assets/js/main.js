/* Shivansh Printers — site behaviour. No dependencies, no build step.
 *
 * Everything here is progressive enhancement. The page is complete and usable
 * without it: nav links are plain anchors, the gallery is a plain grid, and the
 * quote form's buttons are the only thing that genuinely needs script.
 */
(function () {
  'use strict';

  var PHONE = '917798232464';
  var EMAIL = 'shivanshprinters22@gmail.com';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  };

  /* ================================================================== year */
  var year = $('#year');
  if (year) year.textContent = new Date().getFullYear();

  /* ============================================================ mobile nav */
  (function nav() {
    var toggle = $('.nav-toggle');
    var menu = $('#primary-nav');
    if (!toggle || !menu) return;

    function close() {
      menu.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open menu');
    }

    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('open')) {
        close();
        toggle.focus();
      }
    });

    // a menu left open while the viewport widens past the breakpoint would
    // otherwise stay in the DOM as an orphaned dropdown
    window.matchMedia('(min-width: 821px)').addEventListener('change', function (e) {
      if (e.matches) close();
    });
  }());

  /* ==================================================== scroll-driven chrome
   * One rAF-throttled scroll listener drives the progress bar, the header
   * shadow and the back-to-top button, rather than three separate ones.
   */
  (function scrollChrome() {
    var bar = $('#scroll-progress-bar');
    var header = $('.site-header');
    var toTop = $('#to-top');
    var ticking = false;

    if (toTop) {
      toTop.hidden = false;
      toTop.addEventListener('click', function () {
        window.scrollTo({
          top: 0,
          behavior: reduceMotion.matches ? 'auto' : 'smooth'
        });
      });
    }

    function update() {
      ticking = false;
      var y = window.scrollY || document.documentElement.scrollTop;
      var max = document.documentElement.scrollHeight - window.innerHeight;

      if (bar) {
        var ratio = max > 0 ? Math.min(1, y / max) : 0;
        bar.style.transform = 'scaleX(' + ratio + ')';
      }
      if (header) header.classList.toggle('is-stuck', y > 8);
      if (toTop) toTop.classList.toggle('is-in', y > window.innerHeight * 0.8);
    }

    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    window.addEventListener('resize', update);
    update();
  }());

  /* ========================================================= scroll reveal
   * The hidden state lives in the stylesheet under html.js (see styles.css),
   * so this only has to add .is-in as things come into view.
   */
  (function reveal() {
    var GROUPS = [
      '.section-head',
      '.stat',
      '.unit',
      '.cat',
      '.supply',
      '.filter-bar',
      '.gallery figure',
      '.client-grid li',
      '.about-grid > div',
      '.contact-info',
      '.contact-form-wrap'
    ];

    var targets = [];
    GROUPS.forEach(function (sel) {
      var group = $$(sel);
      group.forEach(function (el, i) {
        el.classList.add('reveal-target');
        // stagger within a row, then reset — a 12-item grid should not end up
        // with a 1.2s delay on its last tile
        el.style.setProperty('--reveal-delay', (i % 4) * 70 + 'ms');
        targets.push(el);
      });
    });

    function revealAll() {
      targets.forEach(function (el) { el.classList.add('is-in'); });
    }

    // No observer, or a viewport with no size to observe against (a background
    // tab, a hidden iframe, a pane mid-resize). Either way an observer would
    // never report an intersection, so show everything at once instead.
    if (!('IntersectionObserver' in window) || !window.innerHeight) {
      revealAll();
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    targets.forEach(function (el) { io.observe(el); });

    // anything already above the fold on load should not wait for a scroll
    requestAnimationFrame(function () {
      targets.forEach(function (el) {
        if (el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add('is-in');
          io.unobserve(el);
        }
      });
    });

    // Failsafe. Content that is invisible because an animation never ran is
    // worse than content that appears without one, so give up after a moment
    // and show whatever is still hidden.
    setTimeout(function () {
      var stuck = targets.filter(function (el) {
        return !el.classList.contains('is-in');
      });
      if (stuck.length === targets.length) revealAll();
    }, 1500);
  }());

  /* ========================================================= stat counters */
  (function counters() {
    var nums = $$('[data-count-to]');
    if (!nums.length) return;

    if (reduceMotion.matches || !('IntersectionObserver' in window)) return;

    function run(el) {
      var to = parseInt(el.getAttribute('data-count-to'), 10);
      var suffix = el.getAttribute('data-count-suffix') || '';
      if (isNaN(to)) return;

      var duration = 900;
      var start = null;

      function frame(now) {
        if (start === null) start = now;
        var p = Math.min(1, (now - start) / duration);
        // ease-out cubic
        var eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(to * eased) + suffix;
        if (p < 1) requestAnimationFrame(frame);
        else el.textContent = to + suffix;
      }
      requestAnimationFrame(frame);
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        run(entry.target);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.5 });

    nums.forEach(function (el) { io.observe(el); });
  }());

  /* ================================================== nav active section */
  (function activeSection() {
    var links = $$('#primary-nav a[href^="#"]').filter(function (a) {
      return !a.classList.contains('btn');
    });
    if (!links.length || !('IntersectionObserver' in window)) return;

    var byId = {};
    var sections = [];
    links.forEach(function (a) {
      var id = a.getAttribute('href').slice(1);
      var section = document.getElementById(id);
      if (!section) return;
      byId[id] = a;
      sections.push(section);
    });

    var visible = {};

    function paint() {
      // topmost section currently in the band wins
      var current = null;
      for (var i = 0; i < sections.length; i++) {
        if (visible[sections[i].id]) { current = sections[i].id; break; }
      }
      links.forEach(function (a) {
        a.classList.toggle('is-current', a.getAttribute('href') === '#' + current);
      });
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        visible[entry.target.id] = entry.isIntersecting;
      });
      paint();
    }, { rootMargin: '-80px 0px -55% 0px' });

    sections.forEach(function (s) { io.observe(s); });
  }());

  /* ====================================================== hero parallax */
  (function parallax() {
    var art = $('.hero-art');
    if (!art || reduceMotion.matches || !finePointer.matches) return;

    var raf = null;
    var px = 0, py = 0;

    function apply() {
      raf = null;
      art.style.setProperty('--px', px.toFixed(3));
      art.style.setProperty('--py', py.toFixed(3));
    }

    art.addEventListener('pointermove', function (e) {
      var r = art.getBoundingClientRect();
      // -1 .. 1 from the centre of the collage
      px = ((e.clientX - r.left) / r.width - 0.5) * 2;
      py = ((e.clientY - r.top) / r.height - 0.5) * 2;
      if (!raf) raf = requestAnimationFrame(apply);
    });

    art.addEventListener('pointerleave', function () {
      px = 0; py = 0;
      if (!raf) raf = requestAnimationFrame(apply);
    });
  }());

  /* ============================================================= lightbox */
  var lightbox = (function () {
    var box = $('#lightbox');
    var grid = $('#gallery-grid');
    if (!box || !grid) return { setPool: function () {} };

    var img = $('#lb-img');
    var cap = $('#lb-cap');
    var count = $('#lb-count');
    var pool = $$('figure', grid);
    var index = 0;
    var lastFocus = null;

    function preload(i) {
      var fig = pool[(i + pool.length) % pool.length];
      if (!fig) return;
      var src = fig.querySelector('img').getAttribute('src');
      var pre = new Image();
      pre.src = src;
    }

    function show(i) {
      if (!pool.length) return;
      index = (i + pool.length) % pool.length;
      var fig = pool[index];
      var source = fig.querySelector('img');
      var caption = fig.querySelector('figcaption');
      img.src = source.getAttribute('src');
      img.alt = source.alt;
      cap.textContent = caption ? caption.textContent : '';
      if (count) count.textContent = (index + 1) + ' / ' + pool.length;
      preload(index + 1);
      preload(index - 1);
    }

    function open(fig) {
      var i = pool.indexOf(fig);
      if (i < 0) return;
      lastFocus = document.activeElement;
      show(i);
      box.hidden = false;
      requestAnimationFrame(function () { box.classList.add('is-open'); });
      document.body.style.overflow = 'hidden';
      $('.lb-close', box).focus();
    }

    function close() {
      box.classList.remove('is-open');
      box.hidden = true;
      document.body.style.overflow = '';
      img.src = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    // delegated, so filtering never leaves stale listeners behind
    grid.addEventListener('click', function (e) {
      var fig = e.target.closest('figure');
      if (fig) open(fig);
    });
    grid.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      var fig = e.target.closest('figure');
      if (!fig) return;
      e.preventDefault();
      open(fig);
    });

    $('.lb-close', box).addEventListener('click', close);
    $('.lb-prev', box).addEventListener('click', function () { show(index - 1); });
    $('.lb-next', box).addEventListener('click', function () { show(index + 1); });
    box.addEventListener('click', function (e) { if (e.target === box) close(); });

    document.addEventListener('keydown', function (e) {
      if (box.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(index - 1);
      else if (e.key === 'ArrowRight') show(index + 1);
      else if (e.key === 'Tab') {
        // keep focus inside the overlay while it is open
        var focusable = $$('button', box);
        var first = focusable[0];
        var last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    });

    // swipe between images on touch
    var startX = null, startY = null;
    box.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });
    box.addEventListener('touchend', function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      var dy = e.changedTouches[0].clientY - startY;
      // horizontal intent only, so a vertical scroll gesture does not page
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.5) {
        show(dx < 0 ? index + 1 : index - 1);
      }
      startX = startY = null;
    });

    function markInteractive(figures) {
      figures.forEach(function (fig) {
        fig.setAttribute('tabindex', '0');
        fig.setAttribute('role', 'button');
      });
    }
    markInteractive(pool);

    return {
      setPool: function (figures) {
        pool = figures;
        markInteractive(figures);
      }
    };
  }());

  /* ==================================================== gallery filtering */
  (function filters() {
    var grid = $('#gallery-grid');
    var chips = $$('.chip[data-filter]');
    var status = $('#filter-status');
    if (!grid || !chips.length) return;

    var figures = $$('figure', grid);

    function apply(filter) {
      var shown = 0;

      figures.forEach(function (fig) {
        var match = filter === 'all' || fig.getAttribute('data-cat') === filter;
        if (match) {
          shown++;
          if (fig.classList.contains('is-hidden')) {
            fig.classList.remove('is-hidden');
            // let the grid place it before animating it in, otherwise the
            // transition starts from the wrong box
            fig.classList.add('is-entering');
            requestAnimationFrame(function () {
              requestAnimationFrame(function () { fig.classList.remove('is-entering'); });
            });
          }
        } else {
          fig.classList.add('is-hidden');
          fig.classList.remove('is-entering');
        }
      });

      chips.forEach(function (c) {
        var on = c.getAttribute('data-filter') === filter;
        c.classList.toggle('is-active', on);
        c.setAttribute('aria-pressed', String(on));
      });

      if (status) {
        var label = filter === 'all'
          ? 'Showing all ' + shown + ' photographs.'
          : 'Showing ' + shown + ' of ' + figures.length + ' photographs.';
        status.textContent = label;
      }

      // the lightbox should walk only what is on screen
      lightbox.setPool(figures.filter(function (f) {
        return !f.classList.contains('is-hidden');
      }));
    }

    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        apply(chip.getAttribute('data-filter'));
      });
    });

    apply('all');
  }());

  /* ======================================================== copy to clipboard */
  (function copyButtons() {
    var buttons = $$('.copy-btn[data-copy]');
    if (!buttons.length) return;

    // no clipboard API (or a non-secure origin) means the button would lie
    if (!navigator.clipboard) {
      buttons.forEach(function (b) { b.remove(); });
      return;
    }

    buttons.forEach(function (btn) {
      var reset = null;
      btn.addEventListener('click', function () {
        navigator.clipboard.writeText(btn.getAttribute('data-copy')).then(function () {
          btn.classList.add('is-copied');
          btn.setAttribute('aria-label', 'Copied');
          clearTimeout(reset);
          reset = setTimeout(function () {
            btn.classList.remove('is-copied');
            btn.setAttribute('aria-label', 'Copy');
          }, 1600);
        }).catch(function () { /* clipboard denied — leave the text selectable */ });
      });
    });
  }());

  /* =========================================================== quote form */
  (function quoteForm() {
    var form = $('#quote-form');
    if (!form) return;

    var errorBox = $('#qf-error');
    var preview = $('#msg-preview');

    function val(id) {
      var el = document.getElementById(id);
      return el ? el.value.trim() : '';
    }

    function compose() {
      var lines = ['Quote request from the website', '', 'Name: ' + val('qf-name')];
      if (val('qf-company')) lines.push('Company: ' + val('qf-company'));
      lines.push('Requirement: ' + val('qf-job'));
      if (val('qf-qty')) lines.push('Quantity: ' + val('qf-qty'));
      if (val('qf-size')) lines.push('Size / material: ' + val('qf-size'));
      if (val('qf-notes')) lines.push('', 'Details:', val('qf-notes'));
      return lines.join('\n');
    }

    function fail(message, focusId) {
      errorBox.textContent = message;
      errorBox.hidden = false;
      var el = document.getElementById(focusId);
      if (el) { el.setAttribute('aria-invalid', 'true'); el.focus(); }
      return false;
    }

    function validate() {
      errorBox.hidden = true;
      ['qf-name', 'qf-job'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) el.removeAttribute('aria-invalid');
      });
      if (!val('qf-name')) return fail('Please add your name so we know who to reply to.', 'qf-name');
      if (!val('qf-job')) return fail('Please choose what you need printed.', 'qf-job');
      return true;
    }

    function send(channel) {
      if (!validate()) return;
      var body = compose();

      if (channel === 'email') {
        window.location.href = 'mailto:' + EMAIL +
          '?subject=' + encodeURIComponent('Quote request — ' + val('qf-name')) +
          '&body=' + encodeURIComponent(body);
      } else {
        window.open('https://wa.me/' + PHONE + '?text=' + encodeURIComponent(body),
          '_blank', 'noopener');
      }
    }

    // live preview of exactly what will be sent
    function refreshPreview() {
      if (!preview) return;
      var ready = val('qf-name') && val('qf-job');
      preview.classList.toggle('is-shown', !!ready);
      if (ready) preview.textContent = compose();
    }

    form.addEventListener('input', refreshPreview);
    form.addEventListener('change', refreshPreview);

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      send('whatsapp');
    });

    var emailBtn = form.querySelector('[data-send="email"]');
    if (emailBtn) emailBtn.addEventListener('click', function () { send('email'); });

    refreshPreview();
  }());
}());

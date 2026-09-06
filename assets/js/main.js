/* Shivansh Printers — site behaviour. No dependencies. */
(function () {
  'use strict';

  var PHONE = '917798232464';
  var EMAIL = 'shivanshprinters22@gmail.com';

  /* ---------------------------------------------------------------- year */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ------------------------------------------------------- mobile nav */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('primary-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        nav.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
      }
    });
  }

  /* --------------------------------------------------------- lightbox */
  var grid = document.getElementById('gallery-grid');
  var box = document.getElementById('lightbox');

  if (grid && box) {
    var figures = Array.prototype.slice.call(grid.querySelectorAll('figure'));
    var lbImg = document.getElementById('lb-img');
    var lbCap = document.getElementById('lb-cap');
    var index = 0;
    var lastFocus = null;

    function show(i) {
      index = (i + figures.length) % figures.length;
      var fig = figures[index];
      var img = fig.querySelector('img');
      var cap = fig.querySelector('figcaption');
      lbImg.src = img.src;
      lbImg.alt = img.alt;
      lbCap.textContent = cap ? cap.textContent : '';
    }

    function open(i) {
      lastFocus = document.activeElement;
      show(i);
      box.hidden = false;
      document.body.style.overflow = 'hidden';
      box.querySelector('.lb-close').focus();
    }

    function close() {
      box.hidden = true;
      document.body.style.overflow = '';
      lbImg.src = '';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    figures.forEach(function (fig, i) {
      fig.setAttribute('tabindex', '0');
      fig.setAttribute('role', 'button');
      fig.addEventListener('click', function () { open(i); });
      fig.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(i); }
      });
    });

    box.querySelector('.lb-close').addEventListener('click', close);
    box.querySelector('.lb-prev').addEventListener('click', function () { show(index - 1); });
    box.querySelector('.lb-next').addEventListener('click', function () { show(index + 1); });
    box.addEventListener('click', function (e) { if (e.target === box) close(); });

    document.addEventListener('keydown', function (e) {
      if (box.hidden) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') show(index - 1);
      else if (e.key === 'ArrowRight') show(index + 1);
    });
  }

  /* ------------------------------------------------------- quote form */
  var form = document.getElementById('quote-form');

  if (form) {
    var errorBox = document.getElementById('qf-error');

    function val(id) {
      var el = document.getElementById(id);
      return el ? el.value.trim() : '';
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

    function compose() {
      var lines = [
        'Quote request from the website',
        '',
        'Name: ' + val('qf-name')
      ];
      if (val('qf-company')) lines.push('Company: ' + val('qf-company'));
      lines.push('Requirement: ' + val('qf-job'));
      if (val('qf-qty')) lines.push('Quantity: ' + val('qf-qty'));
      if (val('qf-size')) lines.push('Size / material: ' + val('qf-size'));
      if (val('qf-notes')) lines.push('', 'Details:', val('qf-notes'));
      return lines.join('\n');
    }

    function send(channel) {
      if (!validate()) return;
      var body = compose();
      var url;

      if (channel === 'email') {
        url = 'mailto:' + EMAIL +
          '?subject=' + encodeURIComponent('Quote request — ' + val('qf-name')) +
          '&body=' + encodeURIComponent(body);
        window.location.href = url;
      } else {
        url = 'https://wa.me/' + PHONE + '?text=' + encodeURIComponent(body);
        window.open(url, '_blank', 'noopener');
      }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      send('whatsapp');
    });

    var emailBtn = form.querySelector('[data-send="email"]');
    if (emailBtn) {
      emailBtn.addEventListener('click', function () { send('email'); });
    }
  }
})();

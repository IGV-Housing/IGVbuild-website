document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Nav: hide on scroll down, show on scroll up ---------- */
  var nav = document.getElementById('siteNav');
  if (nav) {
    var lastScrollY = window.scrollY;
    window.addEventListener('scroll', function () {
      var current = window.scrollY;
      if (current > lastScrollY && current > 80) {
        nav.classList.add('nav--hidden');
      } else {
        nav.classList.remove('nav--hidden');
      }
      lastScrollY = current;
    });
  }

  /* ---------- Nav: mega dropdown triggers (desktop + mobile) ---------- */
  var triggers = document.querySelectorAll('.divisions[data-dropdown]');
  var megas = document.querySelectorAll('.mega[data-panel]');

  function closeAllMegas() {
    megas.forEach(function (m) { m.classList.remove('open'); });
    triggers.forEach(function (t) { t.setAttribute('aria-expanded', 'false'); });
  }

  triggers.forEach(function (trigger) {
    trigger.addEventListener('click', function () {
      var key = trigger.getAttribute('data-dropdown');
      var panel = document.querySelector('.mega[data-panel="' + key + '"]');
      var isOpen = panel && panel.classList.contains('open');
      closeAllMegas();
      if (panel && !isOpen) {
        panel.classList.add('open');
        document.querySelectorAll('.divisions[data-dropdown="' + key + '"]').forEach(function (t) {
          t.setAttribute('aria-expanded', 'true');
        });
      }
    });
  });

  document.addEventListener('click', function (e) {
    var inTrigger = e.target.closest('.divisions[data-dropdown]');
    var inMega = e.target.closest('.mega');
    if (!inTrigger && !inMega) closeAllMegas();
  });

  /* ---------- Nav: mobile burger menu ---------- */
  var burger = document.getElementById('burgerBtn');
  var menu = document.getElementById('mobileMenu');

  function closeMobileMenu() {
    if (!menu || !burger) return;
    menu.classList.remove('open');
    burger.setAttribute('aria-expanded', 'false');
  }

  if (burger && menu) {
    burger.addEventListener('click', function () {
      var isOpen = menu.classList.toggle('open');
      burger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (!isOpen) closeAllMegas();
    });
  }

  var navBreakpoint = window.matchMedia('(min-width: 1261px)');
  navBreakpoint.addEventListener('change', function (e) {
    if (e.matches) {
      closeMobileMenu();
      closeAllMegas();
    }
  });

  /* ---------- Homepage tabs (Who we serve) ---------- */
  var tabButtons = document.querySelectorAll('.tabs__menu button');
  var tabPanels = document.querySelectorAll('.tabs__panel');
  tabButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var key = btn.getAttribute('data-tab');
      tabButtons.forEach(function (b) { b.classList.remove('is-active'); });
      tabPanels.forEach(function (p) { p.classList.remove('is-active'); });
      btn.classList.add('is-active');
      var panel = document.querySelector('.tabs__panel[data-panel="' + key + '"]');
      if (panel) panel.classList.add('is-active');
    });
  });

  /* ---------- Video modal (lightbox) ---------- */
  var modal = document.getElementById('videoModal');
  var modalFrame = document.getElementById('videoModalFrame');
  var videoTrigger = document.getElementById('videoBandTrigger');
  var VIDEO_SRC = 'https://player.vimeo.com/video/1212682242?autoplay=1&byline=0&title=0';

  function openModal() {
    if (!modal || !modalFrame) return;
    modalFrame.src = VIDEO_SRC;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal || !modalFrame) return;
    modal.classList.remove('is-open');
    modalFrame.src = '';
    document.body.style.overflow = '';
  }

  if (videoTrigger) videoTrigger.addEventListener('click', openModal);
  if (modal) {
    modal.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', closeModal);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  /* ---------- Scroll-linked phrase swap ("Every ___") ---------- */
  var scrollBlock = document.getElementById('problemScroll');
  if (scrollBlock) {
    var phrases = [
      'delay costs money.',
      'change creates risk.',
      'unknown makes a project harder to finance, price, and deliver.'
    ];
    var phraseEl = scrollBlock.querySelector('[data-phrase]');
    var lastIndex = 0;

    window.addEventListener('scroll', function () {
      var rect = scrollBlock.getBoundingClientRect();
      var vh = window.innerHeight;
      var progress = (vh - rect.top) / (rect.height + vh);
      progress = Math.max(0, Math.min(1, progress));
      var index = Math.min(phrases.length - 1, Math.floor(progress * phrases.length));
      if (index !== lastIndex || phraseEl.textContent !== phrases[index]) {
        phraseEl.textContent = phrases[index];
        lastIndex = index;
      }
    });
  }
});

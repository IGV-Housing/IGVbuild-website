document.addEventListener('DOMContentLoaded', function () {

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

  /* ---------- Video modal (lightbox) ---------- */
  var modal = document.getElementById('videoModal');
  var modalFrame = document.getElementById('videoModalFrame');
  var videoTrigger = document.getElementById('videoBandTrigger');
  var VIDEO_SRC = 'https://player.vimeo.com/video/1212682242?autoplay=1&byline=0&title=0';

  function openModal(src) {
    if (!modal || !modalFrame) return;
    modalFrame.src = src || VIDEO_SRC;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal || !modalFrame) return;
    modal.classList.remove('is-open');
    modalFrame.src = '';
    document.body.style.overflow = '';
  }

  if (videoTrigger) videoTrigger.addEventListener('click', function () { openModal(VIDEO_SRC); });

  document.querySelectorAll('[data-video-src]').forEach(function (el) {
    el.addEventListener('click', function () { openModal(el.getAttribute('data-video-src')); });
  });

  if (modal) {
    modal.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', closeModal);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeModal();
  });

  /* ---------- How It Works hero: align media caption/play button with text-column ---------- */
  var howMedia = document.querySelector('.howitworks-hero__media');
  var howActions = document.querySelector('.howitworks-hero__actions');
  var howPlay = document.querySelector('.howitworks-hero__play');
  var howEyebrow = document.querySelector('.howitworks-hero__eyebrow');
  var howCaption = document.querySelector('.howitworks-hero__caption');

  function syncHowItWorksHero() {
    if (!howMedia) return;
    var mediaRect = howMedia.getBoundingClientRect();
    if (howActions && howPlay) {
      var actionsRect = howActions.getBoundingClientRect();
      var centerY = actionsRect.top + actionsRect.height / 2 - mediaRect.top;
      howPlay.style.top = centerY + 'px';
    }
    if (howEyebrow && howCaption) {
      var eyebrowRect = howEyebrow.getBoundingClientRect();
      howCaption.style.top = (eyebrowRect.top - mediaRect.top) + 'px';
    }
  }

  if (howMedia) {
    syncHowItWorksHero();
    window.addEventListener('resize', syncHowItWorksHero);
    window.addEventListener('load', syncHowItWorksHero);
  }

  /* ---------- How It Works: components hover-to-explore ---------- */
  var componentItems = document.querySelectorAll('.howitworks-components__item');
  var componentImage = document.getElementById('howitworksComponentsImage');

  function activateComponent(item) {
    componentItems.forEach(function (el) { el.classList.remove('is-active'); });
    item.classList.add('is-active');
    var src = item.getAttribute('data-image');
    var alt = item.getAttribute('data-alt');
    if (componentImage && componentImage.getAttribute('src') !== src) {
      componentImage.style.opacity = '0';
      setTimeout(function () {
        componentImage.setAttribute('src', src);
        componentImage.setAttribute('alt', alt || '');
        componentImage.style.opacity = '1';
      }, 150);
    }
  }

  componentItems.forEach(function (item) {
    item.addEventListener('mouseenter', function () { activateComponent(item); });
    item.addEventListener('focus', function () { activateComponent(item); });
    item.addEventListener('click', function () { activateComponent(item); });
  });

  /* ---------- Scroll-reveal animations ---------- */
  var revealTargets = document.querySelectorAll(
    '.video-band__caption, .video-band__play, .stat-item, .product-tile, .reveal-up'
  );

  if (revealTargets.length) {
    var revealObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    revealTargets.forEach(function (el) { revealObserver.observe(el); });
  }
});

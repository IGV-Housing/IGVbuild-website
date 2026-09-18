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

  /* ---------- Nav: highlight current page/section ---------- */
  (function highlightCurrentNav() {
    function pageKey(href) {
      if (!href) return null;
      href = href.split('#')[0].split('?')[0];
      var parts = href.split('/').filter(function (p) { return p && p !== '.' && p !== '..'; });
      if (!parts.length) return 'index';
      var last = parts[parts.length - 1].replace(/\.html$/, '');
      var first = parts[0].replace(/\.html$/, '');
      return (last === 'index' ? first : first) || 'index';
    }

    function isLocal(href) {
      return !!href && !/^https?:\/\//i.test(href) && href.indexOf('#') !== 0 && href.indexOf('mailto:') !== 0 && href.indexOf('tel:') !== 0;
    }

    var currentKey = pageKey(window.location.pathname);
    if (currentKey === 'index') return; // homepage has no nav item of its own to highlight

    document.querySelectorAll('nav.links > a, .mobile-menu > a').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!isLocal(href)) return;
      if (pageKey(href) === currentKey) a.classList.add('is-active');
    });

    document.querySelectorAll('.divisions[data-dropdown]').forEach(function (trigger) {
      var key = trigger.getAttribute('data-dropdown');
      var panel = document.querySelector('.mega[data-panel="' + key + '"]');
      if (!panel) return;
      var matches = [].some.call(panel.querySelectorAll('a[href]'), function (a) {
        var href = a.getAttribute('href');
        return isLocal(href) && pageKey(href) === currentKey;
      });
      if (matches) trigger.classList.add('is-active');
    });
  })();

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

  /* ---------- Palette render modal (lightbox) ---------- */
  var renderModal = document.getElementById('paletteRenderModal');
  var renderModalImg = document.getElementById('paletteRenderModalImg');
  var renderModalCaption = document.getElementById('paletteRenderModalCaption');

  function openRenderModal(src, caption) {
    if (!renderModal || !renderModalImg) return;
    renderModalImg.src = src;
    renderModalImg.alt = caption || '';
    if (renderModalCaption) renderModalCaption.textContent = caption || '';
    renderModal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeRenderModal() {
    if (!renderModal || !renderModalImg) return;
    renderModal.classList.remove('is-open');
    renderModalImg.src = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-render-src]').forEach(function (el) {
    el.addEventListener('click', function () {
      openRenderModal(el.getAttribute('data-render-src'), el.getAttribute('data-render-title'));
    });
  });

  if (renderModal) {
    renderModal.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', closeRenderModal);
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeRenderModal();
  });

  /* ---------- How It Works hero: align media play button with text-column ---------- */
  var howMedia = document.querySelector('.howitworks-hero__media');
  var howActions = document.querySelector('.howitworks-hero__actions');
  var howPlay = document.querySelector('.howitworks-hero__play');

  function syncHowItWorksHero() {
    if (!howMedia) return;
    var mediaRect = howMedia.getBoundingClientRect();
    if (howActions && howPlay) {
      var actionsRect = howActions.getBoundingClientRect();
      var centerY = actionsRect.top + actionsRect.height / 2 - mediaRect.top;
      if (centerY > 0 && centerY < mediaRect.height) {
        howPlay.style.top = centerY + 'px';
      } else {
        howPlay.style.removeProperty('top');
      }
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

  var componentMedia = document.querySelector('.howitworks-components__media');
  var componentBadge = document.getElementById('howitworksComponentsBadge');

  function activateComponent(item) {
    componentItems.forEach(function (el) { el.classList.remove('is-active'); });
    item.classList.add('is-active');
    var src = item.getAttribute('data-image');
    var alt = item.getAttribute('data-alt');
    var needsFrame = item.getAttribute('data-frame') === 'true';
    if (componentMedia) componentMedia.classList.toggle('howitworks-components__media--framed', needsFrame);
    if (componentBadge) componentBadge.style.display = needsFrame ? '' : 'none';
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

  /* ---------- Package items: jump to and activate the matching component ---------- */
  document.querySelectorAll('.howitworks-package__item[href^="#component-"]').forEach(function (link) {
    link.addEventListener('click', function () {
      var target = document.querySelector(link.getAttribute('href'));
      if (target) activateComponent(target);
    });
  });

  if (location.hash.indexOf('#component-') === 0) {
    var initialTarget = document.querySelector(location.hash);
    if (initialTarget) activateComponent(initialTarget);
  }

  /* ---------- How It Works: SmartCore numbered pin overlay ---------- */
  var smartcorePins = document.querySelectorAll('.howitworks-smartcore-detail__pin');
  var smartcoreSteps = document.querySelectorAll('.howitworks-smartcore-detail__step');
  var smartcoreDiagramImage = document.getElementById('smartcoreDiagramImage');

  function activateSmartcoreStep(stepNum) {
    smartcorePins.forEach(function (p) { p.classList.toggle('is-active', p.getAttribute('data-step') === stepNum); });
    smartcoreSteps.forEach(function (s) { s.classList.toggle('is-active', s.getAttribute('data-step') === stepNum); });

    var activePin = [].filter.call(smartcorePins, function (p) { return p.getAttribute('data-step') === stepNum; })[0];
    var src = activePin && activePin.getAttribute('data-image');
    if (smartcoreDiagramImage && src && smartcoreDiagramImage.getAttribute('src') !== src) {
      smartcoreDiagramImage.style.opacity = '0';
      setTimeout(function () {
        smartcoreDiagramImage.setAttribute('src', src);
        smartcoreDiagramImage.style.opacity = '1';
      }, 150);
    }
  }

  smartcorePins.forEach(function (pin) {
    pin.addEventListener('click', function () { activateSmartcoreStep(pin.getAttribute('data-step')); });
  });
  smartcoreSteps.forEach(function (step) {
    step.addEventListener('click', function () { activateSmartcoreStep(step.getAttribute('data-step')); });
  });
  if (smartcorePins.length) activateSmartcoreStep('1');

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

  /* ---------- Hybrid Construction: pinned scroll timeline ---------- */
  var hybridScrolly = document.getElementById('hybridScrolly');
  var hybridPanel = document.getElementById('hybridScrollyPanel');
  var hybridIntegration = document.getElementById('hybridIntegration');
  var hybridFill = document.getElementById('hybridIntegrationFill');
  var hybridPhoto = document.getElementById('hybridResultPhoto');
  var hybridSteps = hybridIntegration ? [].slice.call(hybridIntegration.querySelectorAll('.howitworks-hybrid__integration-item')) : [];
  var HYBRID_SCROLL_BUDGET_PER_STEP = 260;
  var HYBRID_BREAKPOINT = 900;

  function sizeHybridScrolly() {
    if (!hybridScrolly || !hybridPanel) return;
    if (window.innerWidth <= HYBRID_BREAKPOINT) {
      hybridScrolly.style.height = 'auto';
      return;
    }
    var extra = hybridSteps.length * HYBRID_SCROLL_BUDGET_PER_STEP;
    hybridScrolly.style.height = (hybridPanel.offsetHeight + extra) + 'px';
  }

  function updateHybridScrolly() {
    if (!hybridScrolly || !hybridPanel || window.innerWidth <= HYBRID_BREAKPOINT) return;

    var rect = hybridScrolly.getBoundingClientRect();
    var scrollable = hybridScrolly.offsetHeight - hybridPanel.offsetHeight;
    var stickyTop = parseFloat(getComputedStyle(hybridPanel).top) || 0;
    var progress;

    if (scrollable <= 0) {
      progress = rect.top <= stickyTop ? 1 : 0;
    } else {
      progress = (stickyTop - rect.top) / scrollable;
    }
    progress = Math.max(0, Math.min(1, progress));

    var activeIndex = Math.min(hybridSteps.length - 1, Math.floor(progress * hybridSteps.length));
    hybridSteps.forEach(function (el, i) {
      el.classList.remove('is-active', 'is-passed');
      if (i < activeIndex) el.classList.add('is-passed');
      else if (i === activeIndex) el.classList.add('is-active');
    });

    if (hybridFill && hybridIntegration) {
      var lineHeight = hybridIntegration.clientHeight - 40;
      hybridFill.style.height = Math.max(0, progress * lineHeight) + 'px';
    }

    if (hybridPhoto) {
      hybridPhoto.classList.toggle('is-revealed', progress > 0.9);
    }
  }

  if (hybridScrolly && hybridPanel && hybridSteps.length) {
    sizeHybridScrolly();
    updateHybridScrolly();

    var hybridTicking = false;
    window.addEventListener('scroll', function () {
      if (!hybridTicking) {
        hybridTicking = true;
        requestAnimationFrame(function () { updateHybridScrolly(); hybridTicking = false; });
      }
    }, { passive: true });

    var hybridResizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(hybridResizeTimer);
      hybridResizeTimer = setTimeout(function () { sizeHybridScrolly(); updateHybridScrolly(); }, 150);
    });
  }
});

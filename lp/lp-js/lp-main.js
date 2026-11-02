// Hamburger Menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const menuOverlay = document.getElementById('menuOverlay');
const menuClose = document.getElementById('menuClose');
const floatingCta = document.querySelector('.floating-cta');

function openMenu() {
  hamburger.classList.add('open');
  mobileMenu.classList.add('open');
  menuOverlay.classList.add('open');
  document.body.classList.add('menu-open');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  hamburger.classList.remove('open');
  mobileMenu.classList.remove('open');
  menuOverlay.classList.remove('open');
  document.body.classList.remove('menu-open');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', () => {
  mobileMenu.classList.contains('open') ? closeMenu() : openMenu();
});
menuClose.addEventListener('click', closeMenu);
menuOverlay.addEventListener('click', closeMenu);

// Close menu on nav link click
mobileMenu.querySelectorAll('nav a').forEach(a => {
  a.addEventListener('click', closeMenu);
});

// FAQ Accordion
document.querySelectorAll('.faq-question').forEach(q => {
  q.addEventListener('click', () => {
    const answer = q.nextElementSibling;
    const isOpen = q.classList.contains('open');

    document.querySelectorAll('.faq-question.open').forEach(oq => {
      oq.classList.remove('open');
      oq.nextElementSibling.classList.remove('open');
    });

    if (!isOpen) {
      q.classList.add('open');
      answer.classList.add('open');
    }
  });
});

// トップと同じ送信先（confirm.php）が要求する判定用フィールド
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('form[action="/confirm.php"]').forEach(form => {
    if (form.querySelector('input[name="human_token"]')) return;

    const honeypot = document.createElement('input');
    honeypot.type = 'text';
    honeypot.name = 'hp_field';
    honeypot.value = '';
    honeypot.autocomplete = 'off';
    honeypot.tabIndex = -1;
    honeypot.setAttribute('aria-hidden', 'true');
    honeypot.style.position = 'absolute';
    honeypot.style.left = '-9999px';
    honeypot.style.width = '1px';
    honeypot.style.height = '1px';
    honeypot.style.overflow = 'hidden';
    form.appendChild(honeypot);

    const humanToken = document.createElement('input');
    humanToken.type = 'hidden';
    humanToken.name = 'human_token';
    humanToken.value = 'verified';
    form.appendChild(humanToken);
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Hide floating CTA on scroll down (SP), show on scroll up
(function () {
  const mq = window.matchMedia('(max-width: 768px)');
  let lastY = window.scrollY || 0;
  let ticking = false;
  const THRESHOLD = 8;
  const SHOW_TOP = 40;

  function setHidden(hidden) {
    if (!mq.matches || document.body.classList.contains('menu-open')) {
      floatingCta?.classList.remove('is-hidden');
      return;
    }
    floatingCta?.classList.toggle('is-hidden', hidden);
  }

  function onScroll() {
    const y = window.scrollY || 0;
    const delta = y - lastY;

    if (y <= SHOW_TOP) {
      setHidden(false);
    } else if (delta > THRESHOLD) {
      setHidden(true);
    } else if (delta < -THRESHOLD) {
      setHidden(false);
    }

    lastY = y;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });

  mq.addEventListener?.('change', () => setHidden(false));
})();

// (function () {
//   "use strict";

//   /** 電話リンクはネイティブで動作。クリック計測や固定CTAなどを足す場合のフック */
//   document.querySelectorAll('a[href^="tel:"]').forEach(function (link) {
//     link.addEventListener("click", function () {
//       /* 解析タグを入れる場合はここに */
//     });
//   });
// })();

/**
 * Mobile Menu Controller - iOS Safari 対応
 */

const menuBtn = document.getElementById('menu-btn');
const spNav = document.getElementById('sp-nav');
const overlay = document.getElementById('nav-overlay');
const header = document.querySelector('.site-header');

let scrollPosition = 0;

function openMenu() {
    if (!menuBtn || !spNav || !overlay) return;

    scrollPosition = window.pageYOffset;

    document.body.style.top = `-${scrollPosition}px`;
    document.body.classList.add('menu-open');

    menuBtn.classList.add('open');
    menuBtn.classList.remove('is-hide');
    overlay.classList.add('active');
    spNav.classList.add('active');

    if (header) {
        header.classList.add('is-open');
        header.classList.remove('is-hide');
    }
}

function closeMenu() {
    if (!menuBtn || !spNav || !overlay) return;

    menuBtn.classList.remove('open');
    overlay.classList.remove('active');
    spNav.classList.remove('active');

    document.body.classList.remove('menu-open');
    document.body.style.top = '';

    window.scrollTo(0, scrollPosition);

    if (header) {
        header.classList.remove('is-open');
    }

    setTimeout(() => {
        document.querySelectorAll('.has-child').forEach(item => {
            item.classList.remove('active');
        });
    }, 300);
}

function toggleMenu() {
    if (spNav && spNav.classList.contains('active')) {
        closeMenu();
    } else {
        openMenu();
    }
}

if (menuBtn) {
    menuBtn.addEventListener('click', toggleMenu);
}

if (overlay) {
    overlay.addEventListener('click', closeMenu);
}

document.querySelectorAll('.sp-nav a').forEach(link => {
    link.addEventListener('click', function (e) {
        if (this.classList.contains('parent-link')) {
            e.preventDefault();
            e.stopPropagation();
            this.parentElement.classList.toggle('active');
        } else if (spNav && spNav.classList.contains('active')) {
            closeMenu();
        }
    });
});

document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && spNav && spNav.classList.contains('active')) {
        closeMenu();
    }
});

window.addEventListener('resize', function () {
    if (spNav && spNav.classList.contains('active')) {
        closeMenu();
    }
});

let lastScrollY = 0;

window.addEventListener('scroll', () => {
    if (!header || !menuBtn) return;

    const currentScrollY = window.scrollY;
    const isMenuOpen = menuBtn.classList.contains('open');

    if (!isMenuOpen) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            header.classList.add('is-hide');
            menuBtn.classList.add('is-hide');
        } else {
            header.classList.remove('is-hide');
            menuBtn.classList.remove('is-hide');
        }
    }
    lastScrollY = currentScrollY;
});

/**
 * Case Studies - アコーディオンUI & もっと見る
 * 事例のHTMLは index.html に記載。追加・編集はHTML側で行ってください。
 */

function resetCaseCard(card) {
    card.classList.remove('is-open');
    card.querySelectorAll('.case-card__trigger, .case-card__toggle').forEach(function (el) {
        el.setAttribute('aria-expanded', 'false');
    });
    const toggleText = card.querySelector('.case-card__toggle-text');
    if (toggleText) {
        toggleText.textContent = '詳細を見る';
    }
}

function initCaseStudies() {
    const caseMore = document.getElementById('case-more-content');
    const moreBtn = document.getElementById('case-more-btn');
    const casesSection = document.getElementById('case-studies');
    if (!casesSection) return;

    function setCardOpen(card, isOpen) {
        const triggers = card.querySelectorAll('.case-card__trigger, .case-card__toggle');
        const toggleText = card.querySelector('.case-card__toggle-text');

        card.classList.toggle('is-open', isOpen);
        triggers.forEach(function (el) {
            el.setAttribute('aria-expanded', String(isOpen));
        });
        if (toggleText) {
            toggleText.textContent = isOpen ? '閉じる' : '詳細を見る';
        }
    }

    casesSection.addEventListener('click', function (e) {
        if (e.target.closest('.case-more-wrapper')) return;

        const trigger = e.target.closest('.case-card__trigger, .case-card__toggle');
        if (!trigger) return;

        const card = trigger.closest('.case-card');
        if (!card) return;

        const isOpen = card.classList.contains('is-open');
        setCardOpen(card, !isOpen);

        if (!isOpen) {
            const cardRect = card.getBoundingClientRect();
            if (cardRect.top < 80) {
                const scrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
                    ? 'auto'
                    : 'smooth';
                requestAnimationFrame(function () {
                    card.scrollIntoView({ behavior: scrollBehavior, block: 'start' });
                });
            }
        }
    });

    casesSection.addEventListener('keydown', function (e) {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const trigger = e.target.closest('.case-card__trigger');
        if (!trigger) return;
        e.preventDefault();
        trigger.click();
    });

    if (moreBtn && caseMore) {
        const hiddenCount = caseMore.querySelectorAll('.case-card').length;
        if (hiddenCount === 0) {
            const wrapper = moreBtn.closest('.case-more-wrapper');
            if (wrapper) wrapper.style.display = 'none';
        }

        moreBtn.addEventListener('click', function () {
            const isExpanded = moreBtn.classList.contains('expanded');

            if (isExpanded) {
                caseMore.classList.remove('show');
                moreBtn.classList.remove('expanded');
                moreBtn.setAttribute('aria-expanded', 'false');
                moreBtn.querySelector('.voice-more-text').textContent = '施工事例をもっと見る';

                caseMore.querySelectorAll('.case-card.is-open').forEach(resetCaseCard);

                const scrollBehavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches
                    ? 'auto'
                    : 'smooth';
                casesSection.scrollIntoView({ behavior: scrollBehavior, block: 'start' });
            } else {
                caseMore.classList.add('show');
                moreBtn.classList.add('expanded');
                moreBtn.setAttribute('aria-expanded', 'true');
                moreBtn.querySelector('.voice-more-text').textContent = '閉じる';
            }
        });
    }
}

/**
 * Voice Cards - 開閉式レビューUI & More機能
 */

document.addEventListener('DOMContentLoaded', function () {
    initCaseStudies();

    const voiceList = document.querySelector('.voice-list');

    function resetVoiceCard(card) {
        card.classList.remove('active');
        const toggle = card.querySelector('.voice-card__toggle');
        if (toggle) {
            toggle.setAttribute('aria-expanded', 'false');
            toggle.textContent = '続きを読む';
        }
    }

    if (voiceList) {
        voiceList.addEventListener('click', function (e) {
            const toggle = e.target.closest('.voice-card__toggle');
            if (!toggle) return;

            const card = toggle.closest('.voice-card');
            if (!card) return;

            const isOpen = card.classList.contains('active');
            toggle.setAttribute('aria-expanded', String(!isOpen));

            if (isOpen) {
                card.classList.remove('active');
                toggle.textContent = '続きを読む';

                const cardRect = card.getBoundingClientRect();
                if (cardRect.top < 100) {
                    setTimeout(() => {
                        card.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }, 200);
                }
            } else {
                card.classList.add('active');
                toggle.textContent = '閉じる';
            }
        });

        if ('ontouchstart' in window) {
            let touchedCard = null;

            voiceList.addEventListener('touchstart', function (e) {
                touchedCard = e.target.closest('.voice-card');
                if (touchedCard) touchedCard.style.transform = 'scale(0.99)';
            }, { passive: true });

            voiceList.addEventListener('touchend', function () {
                if (touchedCard) {
                    touchedCard.style.transform = '';
                    touchedCard = null;
                }
            }, { passive: true });
        }
    }

    const moreBtn = document.getElementById('voice-more-btn');
    const moreContent = document.querySelector('.voice-more-content');

    if (moreBtn && moreContent) {
        moreBtn.addEventListener('click', function () {
            const isExpanded = moreBtn.classList.contains('expanded');

            if (isExpanded) {
                moreContent.classList.remove('show');
                moreBtn.classList.remove('expanded');
                moreBtn.querySelector('.voice-more-text').textContent = '他のお客様の声を見る';

                moreContent.querySelectorAll('.voice-card.active').forEach(resetVoiceCard);

                document.querySelector('.voices').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            } else {
                moreContent.classList.add('show');
                moreBtn.classList.add('expanded');
                moreBtn.querySelector('.voice-more-text').textContent = '閉じる';
            }
        });
    }
});


/**
 * スパムボット検知用の非表示フィールドを全フォームに自動追加
 */
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('form.contact-form').forEach(form => {
        if (form.querySelector('input[name="human_token"]')) {
            return;
        }

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
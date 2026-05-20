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

    // 現在のスクロール位置を保存
    scrollPosition = window.pageYOffset;

    // Body固定（iOS Safari対応）
    document.body.style.top = `-${scrollPosition}px`;
    document.body.classList.add('menu-open');

    // メニュー表示
    menuBtn.classList.add('open');
    overlay.classList.add('active');
    spNav.classList.add('active');

    // ヘッダーを強制表示
    if (header) {
        header.classList.add('is-open');
    }
}

function closeMenu() {
    if (!menuBtn || !spNav || !overlay) return;

    // メニュー非表示
    menuBtn.classList.remove('open');
    overlay.classList.remove('active');
    spNav.classList.remove('active');

    // Body固定解除
    document.body.classList.remove('menu-open');
    document.body.style.top = '';

    // スクロール位置復元
    window.scrollTo(0, scrollPosition);

    // ヘッダー状態リセット
    if (header) {
        header.classList.remove('is-open');
    }

    // アコーディオンをすべて閉じる
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

// イベントリスナー
if (menuBtn) {
    menuBtn.addEventListener('click', toggleMenu);
}

if (overlay) {
    overlay.addEventListener('click', closeMenu);
}

// メニュー内リンクのクリック処理
document.querySelectorAll('.sp-nav a').forEach(link => {
    link.addEventListener('click', function (e) {
        if (this.classList.contains('parent-link')) {
            // アコーディオン開閉
            e.preventDefault();
            e.stopPropagation();
            this.parentElement.classList.toggle('active');
        } else {
            // 通常リンク - メニューを閉じる
            if (spNav && spNav.classList.contains('active')) {
                closeMenu();
            }
        }
    });
});

// ESCキーでメニューを閉じる
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && spNav && spNav.classList.contains('active')) {
        closeMenu();
    }
});

// リサイズ時にメニューを閉じる（横向き→縦向きなど）
window.addEventListener('resize', function () {
    if (spNav && spNav.classList.contains('active')) {
        closeMenu();
    }
});

/**
 * スクロールによるヘッダーの出し入れ
 */
let lastScrollY = 0;

window.addEventListener('scroll', () => {
    if (!header || !menuBtn) return;

    const currentScrollY = window.scrollY;
    const isMenuOpen = menuBtn.classList.contains('open');

    if (!isMenuOpen) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
            header.classList.add('is-hide');
        } else {
            header.classList.remove('is-hide');
        }
    }
    lastScrollY = currentScrollY;
});

/**
 * Voice Cards - 開閉式レビューUI & More機能
 */

document.addEventListener('DOMContentLoaded', function() {
    const voiceList = document.querySelector('.voice-list');

    function resetVoiceCard(card) {
        card.classList.remove('active');
        const toggle = card.querySelector('.voice-card__toggle');
        if (toggle) {
            toggle.setAttribute('aria-expanded', 'false');
            toggle.textContent = '続きを読む';
        }
    }

    // イベント委譲で全カードの開閉を1リスナーで処理（二重登録を防ぐ）
    if (voiceList) {
        voiceList.addEventListener('click', function(e) {
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

            voiceList.addEventListener('touchstart', function(e) {
                touchedCard = e.target.closest('.voice-card');
                if (touchedCard) touchedCard.style.transform = 'scale(0.99)';
            }, { passive: true });

            voiceList.addEventListener('touchend', function() {
                if (touchedCard) {
                    touchedCard.style.transform = '';
                    touchedCard = null;
                }
            }, { passive: true });
        }
    }

    // もっと見る機能
    const moreBtn = document.getElementById('voice-more-btn');
    const moreContent = document.querySelector('.voice-more-content');

    if (moreBtn && moreContent) {
        moreBtn.addEventListener('click', function() {
            const isExpanded = moreBtn.classList.contains('expanded');

            if (isExpanded) {
                moreContent.classList.remove('show');
                moreBtn.classList.remove('expanded');
                moreBtn.querySelector('.voice-more-text').textContent = 'もっと見る';

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
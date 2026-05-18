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
    // 個別カードの開閉機能
    function initVoiceCards() {
        const voiceCards = document.querySelectorAll('.voice-card');
        
        voiceCards.forEach(card => {
            const toggle = card.querySelector('.voice-card__toggle');
            if (!toggle) return;
            
            toggle.addEventListener('click', function() {
                const isOpen = card.classList.contains('active');
                
                // アクセシビリティ対応
                toggle.setAttribute('aria-expanded', !isOpen);
                
                if (isOpen) {
                    // 閉じる
                    card.classList.remove('active');
                    toggle.textContent = '続きを読む';
                    
                    // スクロール位置調整（カードが画面上部にある場合）
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
                    // 開く
                    card.classList.add('active');
                    toggle.textContent = '閉じる';
                }
            });
        });
        
        // タッチデバイスでのホバー効果改善
        if ('ontouchstart' in window) {
            voiceCards.forEach(card => {
                card.addEventListener('touchstart', function() {
                    this.style.transform = 'scale(0.99)';
                });
                
                card.addEventListener('touchend', function() {
                    this.style.transform = '';
                });
            });
        }
    }
    
    // もっと見る機能
    const moreBtn = document.getElementById('voice-more-btn');
    const moreContent = document.querySelector('.voice-more-content');
    
    if (moreBtn && moreContent) {
        moreBtn.addEventListener('click', function() {
            const isExpanded = moreBtn.classList.contains('expanded');
            
            if (isExpanded) {
                // 閉じる
                moreContent.style.display = 'none';
                moreContent.classList.remove('show');
                moreBtn.classList.remove('expanded');
                moreBtn.querySelector('.voice-more-text').textContent = 'もっと見る';
                
                // 初期表示エリアにスクロール
                document.querySelector('.voices').scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            } else {
                // 開く
                moreContent.style.display = 'block';
                // アニメーション用に少し遅延
                setTimeout(() => {
                    moreContent.classList.add('show');
                }, 10);
                
                moreBtn.classList.add('expanded');
                moreBtn.querySelector('.voice-more-text').textContent = '閉じる';
                
                // 新しく表示されるカードの開閉機能を初期化
                initVoiceCards();
            }
        });
    }
    
    // 初期カードの開閉機能を初期化
    initVoiceCards();
});
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
 * スクロールによるヘッダーの出し入れ
 */
const menuBtn = document.getElementById('menu-btn');
const header = document.querySelector('.header');

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
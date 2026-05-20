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
    overlay.classList.add('active');
    spNav.classList.add('active');

    if (header) {
        header.classList.add('is-open');
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
        } else {
            header.classList.remove('is-hide');
        }
    }
    lastScrollY = currentScrollY;
});

/**
 * Case Studies - 施工事例データ & アコーディオンUI
 * 事例追加時は CASE_STUDIES 配列にオブジェクトを追加するだけで反映されます。
 */
const CASE_INITIAL_VISIBLE = 2;

const CASE_STUDIES = [
    {
        id: 'case-1',
        pest: 'ゴキブリ',
        area: '東京都・世田谷区',
        building: 'マンション（築15年）',
        consultation: 'キッチンと洗面所でゴキブリを頻繁に確認。子どもがいるため、早めの対応を希望。',
        response: '現地調査で排水管周辺と配管スペースを特定。薬剤処理に加え、侵入経路の目地補修とベイト設置を実施。',
        workTime: '約2時間（調査30分＋作業90分）',
        result: '作業後2週間の確認で目視ゼロ。再発防止の清掃・保管方法もアドバイス。',
        comment: '夜中に見かけて不安でしたが、説明が丁寧で安心してお任せできました。作業後は一匹も見ていません。'
    },
    {
        id: 'case-2',
        pest: 'スズメバチ',
        area: '神奈川県・横浜市',
        building: '一戸建て（2階建）',
        consultation: '軒下に直径20cmほどの巣を発見。小さな子どもがおり、当日中の対応を希望。',
        response: '防護装備で巣を除去し、巣跡周辺を薬剤処理。近隣への声かけも実施し安全に作業完了。',
        workTime: '約1.5時間',
        result: '巣の完全除去。1か月後の再確認でも新たな巣は確認されず。',
        comment: '電話ですぐに日程が決まり、当日中に来ていただけました。近所への配慮もありがたかったです。'
    },
    {
        id: 'case-3',
        pest: 'トコジラミ',
        area: '埼玉県・さいたま市',
        building: 'マンション（3LDK）',
        consultation: '寝室の壁際でトコジラミの活動を確認。他社で一時的に減ったが再発した経緯あり。',
        response: '全室の目視調査と土壌サンプル確認。侵入経路の塞ぎ、土壌処理、湿気対策をセットで実施。',
        workTime: '約3時間（2名体制）',
        result: '作業後1か月・3か月のフォローで再発なし。管理組合への報告書も提出済み。',
        comment: '根本から見てもらえたのがよかったです。再発の不安がなくなり、やっと眠れるようになりました。'
    },
    {
        id: 'case-4',
        pest: 'ダニ・ノミ',
        area: '千葉県・船橋市',
        building: '飲食店（路面店）',
        consultation: '客席付近でダニを確認。営業を止めずに対応したいが、衛生面は最優先。',
        response: '閉店後の深夜帯に薬剤処理と清掃指導。客席・厨房・倉庫を区分して安全な薬剤を選定。',
        workTime: '約2.5時間（深夜作業）',
        result: '翌営業日から通常営業。2週間後の点検でも被害なし。定期点検契約に移行。',
        comment: '営業に支障が出ないよう調整してくれ、スタッフ全員が安心しました。アドバイスも実用的でした。'
    },
    {
        id: 'case-5',
        pest: 'アリ',
        area: '東京都・練馬区',
        building: '戸建て（庭付き）',
        consultation: 'リビングから庭へ続くアリの行列。ペット（猫）がいるため薬剤選定に配慮が必要。',
        response: '侵入経路の特定後、ペットに配慮した低毒性薬剤で処理。巣の位置推定とベイト設置を実施。',
        workTime: '約2時間',
        result: '作業翌日から行列は消失。1週間後の再訪でも再発なし。',
        comment: '猫への影響が心配でしたが、事前に丁寧に説明いただき安心できました。女性スタッフ対応も助かりました。'
    },
    {
        id: 'case-6',
        pest: 'ハチ',
        area: '神奈川県・川崎市',
        building: 'マンション（最上階）',
        consultation: 'ベランダの雨どい付近にハチの巣。洗濯物を干せず、管理会社経由で相談。',
        response: '高所作業車なしで対応可能な範囲で巣を除去。ベランダ下方向への飛散防止シートを設置。',
        workTime: '約1時間',
        result: '巣除去完了。共用部への影響なく作業。管理会社へ完了報告書を提出。',
        comment: 'マンションなので手続きが心配でしたが、管理会社とのやり取りもサポートいただき助かりました。'
    },
    {
        id: 'case-7',
        pest: 'ムカデ',
        area: '千葉県・松戸市',
        building: 'マンション（1LDK）',
        consultation: 'ベランダと玄関先でムカデを複数確認。高齢の母と同居のため早めの駆除を希望。',
        response: '発生源の目視調査、ベランダ・共用廊下の処理、侵入防止テープと目地補修を実施。',
        workTime: '約1.5時間',
        result: '作業後2週間でムカデの目撃なし。季節変化に合わせた再発予防アドバイスを実施。',
        comment: '母の足元が心配でしたが、作業後は安心してベランダに出られるようになりました。説明もわかりやすかったです。'
    }
];

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function truncateText(text, maxLen) {
    if (text.length <= maxLen) return text;
    return text.slice(0, maxLen) + '…';
}

function buildFlowHtml(consultation, response, result) {
    const c = truncateText(consultation, 28);
    const r = truncateText(response, 28);
    const res = truncateText(result, 28);

    return (
        '<div class="case-card__flow">' +
        '<div class="case-card__flow-step"><span class="case-card__flow-label">ご相談</span>' +
        '<p class="case-card__flow-text">' + escapeHtml(c) + '</p></div>' +
        '<span class="case-card__flow-arrow" aria-hidden="true">→</span>' +
        '<div class="case-card__flow-step"><span class="case-card__flow-label">対応</span>' +
        '<p class="case-card__flow-text">' + escapeHtml(r) + '</p></div>' +
        '<span class="case-card__flow-arrow" aria-hidden="true">→</span>' +
        '<div class="case-card__flow-step case-card__flow-step--result"><span class="case-card__flow-label">結果</span>' +
        '<p class="case-card__flow-text">' + escapeHtml(res) + '</p></div>' +
        '</div>'
    );
}

function createCaseCard(item) {
    const detailId = item.id + '-detail';
    const article = document.createElement('article');
    article.className = 'case-card';
    article.setAttribute('role', 'listitem');
    article.dataset.caseId = item.id;

    article.innerHTML =
        '<div class="case-card__trigger" role="button" tabindex="0" aria-expanded="false" aria-controls="' + detailId + '">' +
        '<div class="case-card__summary">' +
        '<div class="case-card__tags">' +
        '<span class="case-card__tag case-card__tag--pest">' + escapeHtml(item.pest) + '</span>' +
        '<span class="case-card__tag case-card__tag--area">' + escapeHtml(item.area) + '</span>' +
        '<span class="case-card__tag case-card__tag--building">' + escapeHtml(item.building) + '</span>' +
        '</div>' +
        '<h3 class="case-card__title">' + escapeHtml(truncateText(item.consultation, 42)) + '</h3>' +
        buildFlowHtml(item.consultation, item.response, item.result) +
        '</div></div>' +
        '<div id="' + detailId + '" class="case-card__detail" role="region" aria-label="' + escapeHtml(item.pest) + 'の施工詳細">' +
        '<div class="case-card__detail-inner">' +
        '<dl class="case-card__fields">' +
        '<div class="case-card__field"><dt>害虫種</dt><dd>' + escapeHtml(item.pest) + '</dd></div>' +
        '<div class="case-card__field"><dt>地域</dt><dd>' + escapeHtml(item.area) + '</dd></div>' +
        '<div class="case-card__field"><dt>建物種別</dt><dd>' + escapeHtml(item.building) + '</dd></div>' +
        '<div class="case-card__field"><dt>ご相談</dt><dd>' + escapeHtml(item.consultation) + '</dd></div>' +
        '<div class="case-card__field"><dt>対応内容</dt><dd>' + escapeHtml(item.response) + '</dd></div>' +
        '<div class="case-card__field"><dt>作業時間</dt><dd>' + escapeHtml(item.workTime) + '</dd></div>' +
        '<div class="case-card__field"><dt>施工結果</dt><dd>' + escapeHtml(item.result) + '</dd></div>' +
        '</dl>' +
        '<blockquote class="case-card__comment">' +
        '<span class="case-card__comment-label">お客様コメント</span>' +
        '<p class="case-card__comment-text">' + escapeHtml(item.comment) + '</p>' +
        '</blockquote></div></div>' +
        '<button type="button" class="case-card__toggle" aria-expanded="false" aria-controls="' + detailId + '">' +
        '<span class="case-card__toggle-text">詳細を見る</span>' +
        '<span class="case-card__toggle-icon" aria-hidden="true">▼</span></button>';

    return article;
}

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

function renderCaseStudies() {
    const listEl = document.getElementById('case-list');
    const moreEl = document.getElementById('case-more-content');
    const moreBtn = document.getElementById('case-more-btn');
    if (!listEl || !moreEl) return;

    CASE_STUDIES.forEach(function (item, index) {
        const card = createCaseCard(item);
        if (index < CASE_INITIAL_VISIBLE) {
            listEl.appendChild(card);
        } else {
            moreEl.appendChild(card);
        }
    });

    if (CASE_STUDIES.length <= CASE_INITIAL_VISIBLE && moreBtn) {
        const wrapper = moreBtn.closest('.case-more-wrapper');
        if (wrapper) wrapper.style.display = 'none';
    }
}

function initCaseStudies() {
    renderCaseStudies();

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

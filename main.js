/* ================================================
   main.js
   ポートフォリオサイト のJavaScript
   ================================================ */

'use strict';

/* -----------------------------------------------
   スクロール時ヘッダースタイル切り替え
   ----------------------------------------------- */
const header = document.getElementById('site-header');

function onScroll() {
  if (window.scrollY > 20) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // 初期チェック


/* -----------------------------------------------
   スクロールアニメーション（Intersection Observer）
   .reveal クラスが付いた要素をフェードインさせる
   ----------------------------------------------- */
const revealElements = document.querySelectorAll('.reveal');

if (revealElements.length > 0) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target); // 一度表示したら監視終了
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));
}


/* -----------------------------------------------
   ナビゲーション スムーズスクロール
   （モバイル等でhref="#xxx"のデフォルト動作を補完）
   ----------------------------------------------- */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (!target) return;

    e.preventDefault();
    const headerH = parseInt(
      getComputedStyle(document.documentElement).getPropertyValue('--header-h'),
      10
    ) || 68;

    const targetTop = target.getBoundingClientRect().top + window.scrollY - headerH;

    window.scrollTo({ top: targetTop, behavior: 'smooth' });
  });
});


/* -----------------------------------------------
   お問い合わせフォーム バリデーション & 送信処理
   ----------------------------------------------- */
const form = document.getElementById('contact-form');
const successPanel = document.getElementById('contact-success');
const submitBtn = document.getElementById('submit-btn');

/* --- バリデーションルール --- */
const rules = {
  name: {
    validate: (v) => v.trim().length >= 1,
    message: 'お名前を入力してください。',
  },
  email: {
    validate: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    message: '有効なメールアドレスを入力してください。',
  },
  message: {
    validate: (v) => v.trim().length >= 10,
    message: 'お問い合わせ内容を10文字以上でご入力ください。',
  },
};

/**
 * 単一フィールドのバリデーション
 * @param {HTMLInputElement|HTMLTextAreaElement} field
 * @returns {boolean}
 */
function validateField(field) {
  const name = field.name;
  const rule = rules[name];
  const error = document.getElementById(`error-${name}`);
  if (!rule || !error) return true;

  const isValid = rule.validate(field.value);
  if (isValid) {
    field.classList.remove('is-error');
    error.textContent = '';
  } else {
    field.classList.add('is-error');
    error.textContent = rule.message;
  }
  return isValid;
}

/* リアルタイムバリデーション（フォーカスを外したとき） */
Object.keys(rules).forEach((name) => {
  const field = form.elements[name];
  if (field) {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.classList.contains('is-error')) validateField(field);
    });
  }
});

/* フォーム送信 */
form.addEventListener('submit', function (e) {
  e.preventDefault();

  /* 全フィールドをバリデーション */
  let isAllValid = true;
  Object.keys(rules).forEach((name) => {
    const field = form.elements[name];
    if (field && !validateField(field)) {
      isAllValid = false;
    }
  });

  if (!isAllValid) return;

  /* ===================================================
     ▼ 実際にメールを送信したい場合はここを書き換えてください
     ▼ 例）Formspree を使う場合:
          fetch('https://formspree.io/f/xxxxxxxx', {
            method: 'POST',
            body: new FormData(form),
            headers: { Accept: 'application/json' }
          });
     =================================================== */

  /* SSGform への送信を実行 */
  submitBtn.disabled = true;
  submitBtn.textContent = '送信中…';
  form.submit();
});

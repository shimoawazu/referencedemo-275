export default function decorate(block) {
  const rows = [...block.children];

  const slides = [];
  const buttons = [];
  let wideButton = null;

  rows.forEach((row) => {
    const cells = [...row.children];
    const rowtype = cells[0]?.textContent?.trim();

    if (rowtype === 'button-wide') {
      wideButton = { img: cells[1], text: cells[2], link: row.querySelector('a') };
    } else if (rowtype === 'button') {
      buttons.push({ img: cells[1], text: cells[2], link: row.querySelector('a') });
    } else {
      // slide: cells[1]=画像, cells[2]=オーバーレイテキスト
      slides.push({ img: cells[1], text: cells[2], link: row.querySelector('a') });
    }
  });

  // ========== Carousel ==========
  const carousel = document.createElement('div');
  carousel.className = 'smtc-hero-carousel';

  const slidesWrapper = document.createElement('div');
  slidesWrapper.className = 'smtc-hero-slides';

  slides.forEach((data, i) => {
    const slide = document.createElement('div');
    slide.className = 'smtc-hero-slide' + (i === 0 ? ' active' : '');

    if (data.img) {
      const imgWrap = document.createElement('div');
      imgWrap.className = 'smtc-hero-slide-img';
      imgWrap.innerHTML = data.img.innerHTML;
      slide.appendChild(imgWrap);
    }

    const overlay = document.createElement('div');
    overlay.className = 'smtc-hero-slide-overlay';
    if (data.text) overlay.innerHTML = data.text.innerHTML;
    slide.appendChild(overlay);

    slidesWrapper.appendChild(slide);
  });

  const prevBtn = document.createElement('button');
  prevBtn.className = 'smtc-hero-prev';
  prevBtn.setAttribute('aria-label', '前へ');
  prevBtn.innerHTML = '&#10094;';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'smtc-hero-next';
  nextBtn.setAttribute('aria-label', '次へ');
  nextBtn.innerHTML = '&#10095;';

  const dotsEl = document.createElement('div');
  dotsEl.className = 'smtc-hero-dots';
  slides.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'smtc-hero-dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `スライド ${i + 1}`);
    dot.dataset.index = i;
    dotsEl.appendChild(dot);
  });

  carousel.appendChild(prevBtn);
  carousel.appendChild(slidesWrapper);
  carousel.appendChild(nextBtn);
  carousel.appendChild(dotsEl);

  // ========== 右パネル ==========
  const panel = document.createElement('div');
  panel.className = 'smtc-hero-panel';

  // 4つの色付きボタン
  const grid4 = document.createElement('div');
  grid4.className = 'smtc-hero-grid4';

  const btnColors = ['#e8eef7', '#1a3a8f', '#1e6aad', '#2a8fc8'];
  const btnTextColors = ['#1a2d5a', '#ffffff', '#ffffff', '#ffffff'];

  buttons.forEach((data, i) => {
    const btn = document.createElement('a');
    btn.className = `smtc-hero-btn smtc-hero-btn-color`;
    btn.href = data.link ? data.link.href : '#';
    btn.style.backgroundColor = btnColors[i] || '#1a3a8f';
    btn.style.color = btnTextColors[i] || '#fff';

    // アイコン画像
    if (data.img) {
      const iconWrap = document.createElement('div');
      iconWrap.className = 'smtc-hero-btn-icon';
      iconWrap.innerHTML = data.img.innerHTML;
      btn.appendChild(iconWrap);
    }

    // テキスト（タイトル＋説明）
    if (data.text) {
      const textWrap = document.createElement('div');
      textWrap.className = 'smtc-hero-btn-text';
      textWrap.innerHTML = data.text.innerHTML;
      btn.appendChild(textWrap);
    }

    // 矢印
    const arrow = document.createElement('span');
    arrow.className = 'smtc-hero-btn-arrow';
    arrow.textContent = '→';
    btn.appendChild(arrow);

    grid4.appendChild(btn);
  });

  // 1つの白ボタン（横幅）
  const grid1 = document.createElement('div');
  grid1.className = 'smtc-hero-grid1';

  if (wideButton) {
    const btn = document.createElement('a');
    btn.className = 'smtc-hero-btn smtc-hero-btn-wide';
    btn.href = wideButton.link ? wideButton.link.href : '#';

    // 左半分：アイコン＋タイトル
    const leftWrap = document.createElement('div');
    leftWrap.className = 'smtc-hero-btn-wide-left';
    if (wideButton.img) {
      const iconWrap = document.createElement('div');
      iconWrap.className = 'smtc-hero-btn-icon';
      iconWrap.innerHTML = wideButton.img.innerHTML;
      leftWrap.appendChild(iconWrap);
    }
    if (wideButton.text) {
      // 最初のh要素をタイトルとして左側に
      const titleEl = wideButton.text.querySelector('h1,h2,h3,h4,h5,h6');
      if (titleEl) {
        const titleWrap = document.createElement('div');
        titleWrap.className = 'smtc-hero-btn-wide-title';
        titleWrap.innerHTML = titleEl.outerHTML;
        leftWrap.appendChild(titleWrap);
      }
    }

    // 右半分：説明テキスト
    const rightWrap = document.createElement('div');
    rightWrap.className = 'smtc-hero-btn-wide-right';
    if (wideButton.text) {
      const descEl = wideButton.text.querySelector('p');
      if (descEl) {
        rightWrap.innerHTML = descEl.outerHTML;
      }
    }

    // 矢印
    const arrow = document.createElement('span');
    arrow.className = 'smtc-hero-btn-arrow';
    arrow.textContent = '→';

    btn.appendChild(leftWrap);
    btn.appendChild(rightWrap);
    btn.appendChild(arrow);
    grid1.appendChild(btn);
  }

  panel.appendChild(grid4);
  panel.appendChild(grid1);

  // ========== 組み立て ==========
  block.textContent = '';
  const wrapper = document.createElement('div');
  wrapper.className = 'smtc-hero-wrapper';
  wrapper.appendChild(carousel);
  wrapper.appendChild(panel);
  block.appendChild(wrapper);

  // ========== カルーセル動作 ==========
  let current = 0;
  const slideEls = [...slidesWrapper.querySelectorAll('.smtc-hero-slide')];
  const dotEls = [...dotsEl.querySelectorAll('.smtc-hero-dot')];

  function goTo(n) {
    if (!slideEls.length) return;
    slideEls[current].classList.remove('active');
    dotEls[current].classList.remove('active');
    current = (n + slideEls.length) % slideEls.length;
    slideEls[current].classList.add('active');
    dotEls[current].classList.add('active');
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));
  dotEls.forEach((dot) => dot.addEventListener('click', () => goTo(+dot.dataset.index)));

  let timer = setInterval(() => goTo(current + 1), 5000);
  carousel.addEventListener('mouseenter', () => clearInterval(timer));
  carousel.addEventListener('mouseleave', () => {
    timer = setInterval(() => goTo(current + 1), 5000);
  });
}

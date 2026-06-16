export default function decorate(block) {
  const rows = [...block.children];

  // ========== Carousel ラッパー ==========
  const carousel = document.createElement('div');
  carousel.className = 'smtc-hero-carousel';

  const slidesWrap = document.createElement('div');
  slidesWrap.className = 'smtc-hero-slides';

  // スライド行を「移動」（削除ではない）して変換
  rows.slice(0, 5).forEach((row, i) => {
    row.classList.add('smtc-hero-slide');
    if (i === 0) row.classList.add('active');

    const cells = [...row.children];
    // cells[0] = 画像セル → スライド画像として表示
    if (cells[0]) cells[0].classList.add('smtc-hero-slide-img');
    // cells[1] = リンクセル → 非表示だがDOMは保持
    if (cells[1]) cells[1].classList.add('smtc-hero-slide-link');

    // リンクをスライド全体に適用
    const linkEl = cells[1]?.querySelector('a');
    if (linkEl) {
      row.style.cursor = 'pointer';
      row.addEventListener('click', () => { window.location.href = linkEl.href; });
    }

    slidesWrap.appendChild(row); // 移動（data-aue-* 保持）
  });

  // ナビゲーション
  const prevBtn = document.createElement('button');
  prevBtn.className = 'smtc-hero-prev';
  prevBtn.innerHTML = '&#10094;';

  const nextBtn = document.createElement('button');
  nextBtn.className = 'smtc-hero-next';
  nextBtn.innerHTML = '&#10095;';

  const dotsEl = document.createElement('div');
  dotsEl.className = 'smtc-hero-dots';
  for (let i = 0; i < 5; i++) {
    const dot = document.createElement('button');
    dot.className = 'smtc-hero-dot' + (i === 0 ? ' active' : '');
    dot.dataset.index = i;
    dotsEl.appendChild(dot);
  }

  carousel.appendChild(prevBtn);
  carousel.appendChild(slidesWrap);
  carousel.appendChild(nextBtn);
  carousel.appendChild(dotsEl);

  // ========== 右パネル ==========
  const panel = document.createElement('div');
  panel.className = 'smtc-hero-panel';

  const grid4 = document.createElement('div');
  grid4.className = 'smtc-hero-grid4';

  const btnColors = ['#e8eef7', '#1a3a8f', '#1e6aad', '#2a8fc8'];
  const btnTextColors = ['#1a2d5a', '#fff', '#fff', '#fff'];

  // ボタン行を「移動」して変換
  rows.slice(5, 9).forEach((row, i) => {
    row.classList.add('smtc-hero-btn');
    row.style.backgroundColor = btnColors[i];
    row.style.color = btnTextColors[i];

    const cells = [...row.children];
    if (cells[0]) cells[0].classList.add('smtc-hero-btn-icon');
    if (cells[1]) cells[1].classList.add('smtc-hero-btn-text');
    if (cells[2]) cells[2].classList.add('smtc-hero-btn-link');

    const arrow = document.createElement('span');
    arrow.className = 'smtc-hero-btn-arrow';
    arrow.textContent = '→';
    row.appendChild(arrow);

    // リンクをボタン全体に適用
    const linkEl = cells[2]?.querySelector('a');
    if (linkEl) {
      row.style.cursor = 'pointer';
      row.addEventListener('click', () => { window.location.href = linkEl.href; });
    }

    grid4.appendChild(row); // 移動
  });

  // 横幅ボタン
  const grid1 = document.createElement('div');
  grid1.className = 'smtc-hero-grid1';

  const wideRow = rows[9];
  if (wideRow) {
    wideRow.classList.add('smtc-hero-btn', 'smtc-hero-btn-wide');

    const cells = [...wideRow.children];
    if (cells[0]) cells[0].classList.add('smtc-hero-btn-wide-left');
    if (cells[1]) cells[1].classList.add('smtc-hero-btn-wide-right');
    if (cells[2]) cells[2].classList.add('smtc-hero-btn-link');

    const arrow = document.createElement('span');
    arrow.className = 'smtc-hero-btn-arrow';
    arrow.textContent = '→';
    wideRow.appendChild(arrow);

    const linkEl = cells[2]?.querySelector('a');
    if (linkEl) {
      wideRow.style.cursor = 'pointer';
      wideRow.addEventListener('click', () => { window.location.href = linkEl.href; });
    }

    grid1.appendChild(wideRow); // 移動
  }

  panel.appendChild(grid4);
  panel.appendChild(grid1);

  // ========== 組み立て ==========
  const inner = document.createElement('div');
  inner.className = 'smtc-hero-inner';
  inner.appendChild(carousel);
  inner.appendChild(panel);
  block.appendChild(inner);

  // ========== プレビューモードでのリンク動作 ==========
  const isEditor = document.querySelector('html').classList.contains('adobe-ue-edit')
    || window.location.href.includes('universal-editor');
  if (!isEditor) {
    rows.slice(0, 5).forEach((row) => {
      const linkEl = row.querySelector('.smtc-hero-slide-link a');
      if (linkEl) {
        row.style.cursor = 'pointer';
        row.addEventListener('click', (e) => {
          if (!e.target.closest('button')) {
            window.location.href = linkEl.href;
          }
        });
      }
    });
    rows.slice(5).forEach((row) => {
      const linkEl = row.querySelector('.smtc-hero-btn-link a');
      if (linkEl) {
        row.style.cursor = 'pointer';
        row.addEventListener('click', () => {
          window.location.href = linkEl.href;
        });
      }
    });
  }

  // ========== カルーセル動作 ==========
  let current = 0;
  const slideEls = [...slidesWrap.querySelectorAll('.smtc-hero-slide')];
  const dotEls = [...dotsEl.querySelectorAll('.smtc-hero-dot')];

  function goTo(n) {
    if (!slideEls.length) return;
    slideEls[current].classList.remove('active');
    dotEls[current].classList.remove('active');
    current = (n + slideEls.length) % slideEls.length;
    slideEls[current].classList.add('active');
    dotEls[current].classList.add('active');
  }

  prevBtn.addEventListener('click', (e) => { e.stopPropagation(); goTo(current - 1); });
  nextBtn.addEventListener('click', (e) => { e.stopPropagation(); goTo(current + 1); });
  dotEls.forEach(dot =>
    dot.addEventListener('click', (e) => { e.stopPropagation(); goTo(+dot.dataset.index); })
  );

  let timer = setInterval(() => goTo(current + 1), 5000);
  carousel.addEventListener('mouseenter', () => clearInterval(timer));
  carousel.addEventListener('mouseleave', () => {
    timer = setInterval(() => goTo(current + 1), 5000);
  });
}

export default function decorate(block) {
  const rows = [...block.children];

  // 最初の5行 = カルーセルスライド
  const slideRows = rows.slice(0, 5);
  // 次の4行 = 2×2ボタン
  const btn4Rows = rows.slice(5, 9);
  // 最後の1行 = 横幅ボタン
  const btn1Row = rows[9];

  // --- Carousel ---
  const carousel = document.createElement('div');
  carousel.className = 'smtc-hero-carousel';

  const slidesWrapper = document.createElement('div');
  slidesWrapper.className = 'smtc-hero-slides';

  slideRows.forEach((row, i) => {
    const slide = document.createElement('div');
    slide.className = 'smtc-hero-slide' + (i === 0 ? ' active' : '');
    slide.append(...row.children);
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
  slideRows.forEach((_, i) => {
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

  // --- ボタン右パネル ---
  const panel = document.createElement('div');
  panel.className = 'smtc-hero-panel';

  const grid4 = document.createElement('div');
  grid4.className = 'smtc-hero-grid4';
  btn4Rows.forEach((row, i) => {
    const btn = document.createElement('a');
    btn.className = 'smtc-hero-btn smtc-hero-btn-' + (i + 1);
    const anchor = row.querySelector('a');
    if (anchor) btn.href = anchor.href;
    btn.append(...row.children);
    grid4.appendChild(btn);
  });

  const grid1 = document.createElement('div');
  grid1.className = 'smtc-hero-grid1';
  if (btn1Row) {
    const btn = document.createElement('a');
    btn.className = 'smtc-hero-btn smtc-hero-btn-wide';
    const anchor = btn1Row.querySelector('a');
    if (anchor) btn.href = anchor.href;
    btn.append(...btn1Row.children);
    grid1.appendChild(btn);
  }

  panel.appendChild(grid4);
  panel.appendChild(grid1);

  // --- 組み立て ---
  block.textContent = '';
  const wrapper = document.createElement('div');
  wrapper.className = 'smtc-hero-wrapper';
  wrapper.appendChild(carousel);
  wrapper.appendChild(panel);
  block.appendChild(wrapper);

  // --- カルーセル動作 ---
  let current = 0;
  const slideEls = [...slidesWrapper.querySelectorAll('.smtc-hero-slide')];
  const dotEls = [...dotsEl.querySelectorAll('.smtc-hero-dot')];

  function goTo(n) {
    slideEls[current].classList.remove('active');
    dotEls[current].classList.remove('active');
    current = (n + slideEls.length) % slideEls.length;
    slideEls[current].classList.add('active');
    dotEls[current].classList.add('active');
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));
  dotEls.forEach((dot) => dot.addEventListener('click', () => goTo(+dot.dataset.index)));

  // 自動再生 5秒
  let timer = setInterval(() => goTo(current + 1), 5000);
  carousel.addEventListener('mouseenter', () => clearInterval(timer));
  carousel.addEventListener('mouseleave', () => {
    timer = setInterval(() => goTo(current + 1), 5000);
  });
}

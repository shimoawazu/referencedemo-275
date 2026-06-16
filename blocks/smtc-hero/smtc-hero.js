export default function decorate(block) {
  const rows = [...block.children];

  // 各行: cells[0]=image, cells[1]=text, cells[2]=link
  // アイテムの種別はインデックスで判定
  // 0-4: slide, 5-8: button, 9: button-wide

  const items = rows.map((row, index) => {
    const cells = [...row.children];
    const img = cells[0]?.querySelector('picture, img') || null;
    const textEl = cells[1] || null;
    const linkHref = cells[2]?.textContent?.trim() || cells[0]?.querySelector('a')?.href || '#';

    let type = 'slide';
    if (index >= 5 && index <= 8) type = 'button';
    if (index === 9) type = 'button-wide';

    return { type, img, textEl, linkHref };
  });

  const slides = items.filter(it => it.type === 'slide');
  const buttons = items.filter(it => it.type === 'button');
  const wideItem = items.find(it => it.type === 'button-wide');

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
      imgWrap.appendChild(data.img.cloneNode(true));
      slide.appendChild(imgWrap);
    }

    const overlay = document.createElement('div');
    overlay.className = 'smtc-hero-slide-overlay';
    if (data.textEl) overlay.innerHTML = data.textEl.innerHTML;
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

  const grid4 = document.createElement('div');
  grid4.className = 'smtc-hero-grid4';

  const btnColors = ['#e8eef7', '#1a3a8f', '#1e6aad', '#2a8fc8'];
  const btnTextColors = ['#1a2d5a', '#ffffff', '#ffffff', '#ffffff'];

  buttons.forEach((data, i) => {
    const btn = document.createElement('a');
    btn.className = 'smtc-hero-btn';
    btn.href = data.linkHref;
    btn.style.backgroundColor = btnColors[i] || '#1a3a8f';
    btn.style.color = btnTextColors[i] || '#fff';

    if (data.img) {
      const iconWrap = document.createElement('div');
      iconWrap.className = 'smtc-hero-btn-icon';
      iconWrap.appendChild(data.img.cloneNode(true));
      btn.appendChild(iconWrap);
    }

    if (data.textEl) {
      const textWrap = document.createElement('div');
      textWrap.className = 'smtc-hero-btn-text';
      textWrap.innerHTML = data.textEl.innerHTML;
      btn.appendChild(textWrap);
    }

    const arrow = document.createElement('span');
    arrow.className = 'smtc-hero-btn-arrow';
    arrow.textContent = '→';
    btn.appendChild(arrow);

    grid4.appendChild(btn);
  });

  const grid1 = document.createElement('div');
  grid1.className = 'smtc-hero-grid1';

  if (wideItem) {
    const btn = document.createElement('a');
    btn.className = 'smtc-hero-btn smtc-hero-btn-wide';
    btn.href = wideItem.linkHref;

    const leftWrap = document.createElement('div');
    leftWrap.className = 'smtc-hero-btn-wide-left';

    if (wideItem.img) {
      const iconWrap = document.createElement('div');
      iconWrap.className = 'smtc-hero-btn-icon';
      iconWrap.appendChild(wideItem.img.cloneNode(true));
      leftWrap.appendChild(iconWrap);
    }

    if (wideItem.textEl) {
      const titleEl = wideItem.textEl.querySelector('h1,h2,h3,h4,h5,h6');
      if (titleEl) {
        const t = document.createElement('div');
        t.className = 'smtc-hero-btn-wide-title';
        t.innerHTML = titleEl.outerHTML;
        leftWrap.appendChild(t);
      }
    }

    const rightWrap = document.createElement('div');
    rightWrap.className = 'smtc-hero-btn-wide-right';
    if (wideItem.textEl) {
      const descEl = wideItem.textEl.querySelector('p');
      if (descEl) rightWrap.innerHTML = descEl.outerHTML;
    }

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

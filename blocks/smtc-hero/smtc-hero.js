export default function decorate(block) {
  // data-aue-* 属性を再帰的に除去（UEツリーに重複表示させない）
  function stripAueAttrs(el) {
    if (el.nodeType !== 1) return;
    [...el.attributes].forEach(attr => {
      if (attr.name.startsWith('data-aue-')) el.removeAttribute(attr.name);
    });
    el.querySelectorAll('[data-aue-prop],[data-aue-type],[data-aue-label],[data-aue-resource]').forEach(child => {
      [...child.attributes].forEach(attr => {
        if (attr.name.startsWith('data-aue-')) child.removeAttribute(attr.name);
      });
    });
    return el;
  }

  const rows = [...block.children];

  // ========== データ取得 ==========
  const items = rows.map((row, index) => {
    const cells = [...row.children];
    const cell0 = cells[0]?.firstElementChild;
    const cell1 = cells[1]?.firstElementChild;
    const cell2 = cells[2]?.firstElementChild;

    const img = cell0?.querySelector('picture, img') || null;

    let type = 'slide';
    let textEl = null;
    let linkHref = '#';

    if (index >= 5 && index <= 8) {
      type = 'button';
      textEl = cell1 || null;
      linkHref = cell2?.querySelector('a')?.href
        || cell2?.textContent?.trim() || '#';
    } else if (index === 9) {
      type = 'button-wide';
      textEl = cell1 || null;
      linkHref = cell2?.querySelector('a')?.href
        || cell2?.textContent?.trim() || '#';
    } else {
      linkHref = cell1?.querySelector('a')?.href
        || cell1?.textContent?.trim() || '#';
    }

    return { type, img, textEl, linkHref, row };
  });

  const slides   = items.filter(it => it.type === 'slide');
  const buttons  = items.filter(it => it.type === 'button');
  const wideItem = items.find(it  => it.type === 'button-wide');

  // ========== 元の行を完全に削除（UEツリーに表示させない） ==========
  rows.forEach(row => {
    row.remove();
  });

  // ========== Carousel ==========
  const carousel = document.createElement('div');
  carousel.className = 'smtc-hero-carousel';

  const slidesWrapper = document.createElement('div');
  slidesWrapper.className = 'smtc-hero-slides';

  slides.forEach((data, i) => {
    const slide = document.createElement('a');
    slide.className = 'smtc-hero-slide' + (i === 0 ? ' active' : '');
    slide.href = data.linkHref;

    if (data.img) {
      const imgWrap = document.createElement('div');
      imgWrap.className = 'smtc-hero-slide-img';
      imgWrap.appendChild(stripAueAttrs(data.img.cloneNode(true)));
      slide.appendChild(imgWrap);
    }
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

  const btnColors     = ['#e8eef7', '#1a3a8f', '#1e6aad', '#2a8fc8'];
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
      iconWrap.appendChild(stripAueAttrs(data.img.cloneNode(true)));
      btn.appendChild(iconWrap);
    }
    if (data.textEl) {
      const textWrap = document.createElement('div');
      textWrap.className = 'smtc-hero-btn-text';
      textWrap.innerHTML = data.textEl.innerHTML;
      stripAueAttrs(textWrap);
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
      iconWrap.appendChild(stripAueAttrs(wideItem.img.cloneNode(true)));
      leftWrap.appendChild(iconWrap);
    }
    if (wideItem.textEl) {
      const titleEl = wideItem.textEl.querySelector('h1,h2,h3,h4,h5,h6');
      if (titleEl) {
        const t = document.createElement('div');
        t.className = 'smtc-hero-btn-wide-title';
        t.innerHTML = titleEl.outerHTML;
        stripAueAttrs(t);
        leftWrap.appendChild(t);
      }
    }
    const rightWrap = document.createElement('div');
    rightWrap.className = 'smtc-hero-btn-wide-right';
    if (wideItem.textEl) {
      const descEl = wideItem.textEl.querySelector('p');
      if (descEl) { rightWrap.innerHTML = descEl.outerHTML; stripAueAttrs(rightWrap); }
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
  const inner = document.createElement('div');
  inner.className = 'smtc-hero-inner';
  inner.appendChild(carousel);
  inner.appendChild(panel);
  block.appendChild(inner);

  // ========== カルーセル動作 ==========
  let current = 0;
  const slideEls = [...slidesWrapper.querySelectorAll('.smtc-hero-slide')];
  const dotEls   = [...dotsEl.querySelectorAll('.smtc-hero-dot')];

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
  dotEls.forEach(dot =>
    dot.addEventListener('click', () => goTo(+dot.dataset.index))
  );

  let timer = setInterval(() => goTo(current + 1), 5000);
  carousel.addEventListener('mouseenter', () => clearInterval(timer));
  carousel.addEventListener('mouseleave', () => {
    timer = setInterval(() => goTo(current + 1), 5000);
  });
}

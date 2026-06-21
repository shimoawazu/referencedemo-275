function hasWrapper(el) {
  return !!el.firstElementChild
    && window.getComputedStyle(el.firstElementChild).display === 'block';
}

export default function decorate(block) {
  [...block.children].forEach((row) => {
    const cols = [...row.children];
    const label = cols[0];
    const body = cols[1];
    if (!label) return;

    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    summary.append(...label.childNodes);
    if (!hasWrapper(summary)) {
      summary.innerHTML = `<p>${summary.innerHTML}</p>`;
    }

    const details = document.createElement('details');
    details.className = 'accordion-item';

    if (body) {
      body.className = 'accordion-item-body';
      if (!hasWrapper(body)) {
        body.innerHTML = `<p>${body.innerHTML}</p>`;
      }
      details.append(summary, body);
    } else {
      details.append(summary);
    }
    row.replaceWith(details);
  });

  // アンカーID付与
  const anchorMap = {
    'フィッシング詐欺': 'phishing',
    '繁華街': 'downtown',
    'なりすまし': 'police',
    'スパイウェア': 'spyware',
  };
  block.querySelectorAll('details').forEach((detail) => {
    const s = detail.querySelector('summary');
    if (!s) return;
    const text = s.textContent.trim();
    Object.entries(anchorMap).forEach(([keyword, id]) => {
      if (text.includes(keyword)) detail.setAttribute('id', id);
    });
  });

  // アンカーで自動展開
  const hash = window.location.hash.slice(1);
  if (hash) {
    const target = block.querySelector(`#${hash}`);
    if (target) {
      target.setAttribute('open', '');
      setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }
}

import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  [...block.children].forEach((row) => {
    const label = row.children[0];
    const summary = document.createElement('summary');
    summary.className = 'accordion-item-label';
    summary.append(...label.childNodes);
    const body = row.children[1];
    body.className = 'accordion-item-body';
    const details = document.createElement('details');
    moveInstrumentation(row, details);
    details.className = 'accordion-item';
    details.append(summary, body);
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

  const hash = window.location.hash.slice(1);
  if (hash) {
    const target = block.querySelector(`#${hash}`);
    if (target) {
      target.setAttribute('open', '');
      setTimeout(() => target.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  }
}

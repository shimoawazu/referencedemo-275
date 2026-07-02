import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  [...block.children].forEach((row) => {
    const [labelCell, bodyCell] = row.children;

    const label = document.createElement('div');
    label.className = 'wknd-accordion-item-label';
    label.setAttribute('role', 'button');
    label.setAttribute('tabindex', '0');
    label.setAttribute('aria-expanded', 'false');
    label.append(...labelCell.childNodes);

    const body = document.createElement('div');
    body.className = 'wknd-accordion-item-body';
    body.setAttribute('hidden', '');
    body.append(...bodyCell.childNodes);

    const item = document.createElement('div');
    moveInstrumentation(row, item);
    item.className = 'wknd-accordion-item';
    item.append(label, body);

    label.addEventListener('click', () => {
      const expanded = label.getAttribute('aria-expanded') === 'true';
      label.setAttribute('aria-expanded', String(!expanded));
      if (expanded) {
        body.setAttribute('hidden', '');
      } else {
        body.removeAttribute('hidden');
      }
    });

    label.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        label.click();
      }
    });

    row.replaceWith(item);
  });
}

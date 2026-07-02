import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const row = block.children[0];
  if (!row) return;

  [...row.children].forEach((cell) => {
    if (cell.querySelector('picture')) {
      cell.className = 'wknd-hero-image';
    } else {
      cell.className = 'wknd-hero-content';
      const cta = cell.querySelector('a');
      if (cta) cta.classList.add('button', 'primary');
    }
  });

  moveInstrumentation(row, block);
  while (row.firstElementChild) block.append(row.firstElementChild);
  row.remove();
}

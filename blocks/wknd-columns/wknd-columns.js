import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  [...block.children].forEach((row) => {
    [...row.children].forEach((cell) => {
      if (cell.querySelector('picture')) {
        cell.className = 'wknd-columns-col-image';
      } else {
        cell.className = 'wknd-columns-col-text';
      }
    });
    moveInstrumentation(row, row);
  });
}

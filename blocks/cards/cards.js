import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  // First row may be the style model property (from UE block model).
  // Detected by: no picture element, and text matches a known style class OR is empty.
  const firstRow = block.children[0];
  if (firstRow && !firstRow.querySelector('picture')) {
    const rowText = firstRow.textContent.trim();
    if (rowText.includes('image-contain')) {
      block.classList.add('image-contain');
      firstRow.remove();
    } else if (!rowText) {
      // Empty style row (default "cover" selected), remove silently.
      firstRow.remove();
    }
  }

  /* change to ul, li */
  const ul = document.createElement('ul');
  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);
    while (row.firstElementChild) li.append(row.firstElementChild);
    [...li.children].forEach((div) => {
      if (div.children.length === 1 && div.querySelector('picture')) div.className = 'cards-card-image';
      else div.className = 'cards-card-body';
    });
    ul.append(li);
  });
  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });
  block.replaceChildren(ul);
}

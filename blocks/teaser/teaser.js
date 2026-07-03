/**
 * Teaser block — image left, text+CTAs right.
 *
 * UE model renders one row per field:
 *   image           (reference)  → .teaser-image
 *   heading         (text)       → <h3> in .teaser-content
 *   body            (richtext)   → body copy in .teaser-content
 *   cta_primary     (aem-content)→ outline CTA button
 *   cta_primaryText (text)       → label for cta_primary (suffix-collapsed, 4-cell rule)
 *   cta_secondary   (aem-content)→ filled CTA button
 *   cta_secondaryText(text)      → label for cta_secondary (suffix-collapsed)
 *
 * cta_primary / cta_secondary share the "cta" group via underscore rule,
 * keeping the model within the 4-cell limit.
 */
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  let imagePicture = null;
  const contentCells = [];
  const ctaPairs = [];
  let pendingLink = null;

  rows.forEach((row) => {
    const cell = row.firstElementChild ?? row;
    if (cell.querySelector('picture')) {
      imagePicture = cell.querySelector('picture');
      moveInstrumentation(row, block);
    } else if (cell.querySelector('a') && !cell.querySelector('picture')) {
      pendingLink = cell.querySelector('a');
    } else if (pendingLink !== null) {
      // This text row is the label for the preceding aem-content link
      ctaPairs.push({ link: pendingLink, labelText: cell.textContent.trim() });
      pendingLink = null;
    } else if (cell.textContent.trim()) {
      contentCells.push(cell);
    }
  });
  if (pendingLink) ctaPairs.push({ link: pendingLink, labelText: '' });

  // Style CTAs: first → secondary (outline), second → primary (filled)
  ctaPairs.forEach(({ link, labelText }, i) => {
    if (labelText) link.textContent = labelText;
    link.classList.add('button');
    link.classList.add(i === 0 ? 'secondary' : 'primary');
  });

  // Build .teaser-image
  const imageDiv = document.createElement('div');
  imageDiv.className = 'teaser-image';
  if (imagePicture) imageDiv.append(imagePicture);

  // Build .teaser-content
  const content = document.createElement('div');
  content.className = 'teaser-content';

  const [headingCell, ...bodyCells] = contentCells;
  if (headingCell) {
    let headingEl = headingCell.querySelector('h1, h2, h3');
    if (!headingEl && headingCell.textContent.trim()) {
      headingEl = document.createElement('h3');
      headingEl.textContent = headingCell.textContent.trim();
    }
    if (headingEl) content.append(headingEl);
  }
  bodyCells.forEach((cell) => {
    [...cell.childNodes].forEach((node) => content.append(node.cloneNode(true)));
  });
  if (ctaPairs.length > 0) {
    const ctaWrap = document.createElement('p');
    ctaWrap.className = 'teaser-ctas';
    ctaPairs.forEach(({ link }) => ctaWrap.append(link));
    content.append(ctaWrap);
  }

  block.innerHTML = '';
  block.append(imageDiv, content);
}

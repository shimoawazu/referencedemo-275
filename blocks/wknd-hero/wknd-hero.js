/**
 * WKND Hero block — full-bleed background image with overlay text + CTA.
 *
 * UE model renders 5 separate rows (one per field):
 *   row with <picture>  → background image (image field)
 *   row with <a>        → cta (aem-content, renders path as link text)
 *   remaining text rows → in order: heading, body paragraphs, ctaText
 *
 * ctaText (text) collapses into cta group via xwalk/max-cells suffix rule,
 * keeping the model within the 4-cell limit.
 */
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];

  let imageEl = null;
  let ctaLinkEl = null;
  const textCells = [];

  rows.forEach((row) => {
    const cell = row.firstElementChild ?? row;
    if (cell.querySelector('picture')) {
      imageEl = cell.querySelector('picture');
      moveInstrumentation(row, block);
    } else if (cell.querySelector('a') && !cell.querySelector('picture')) {
      // aem-content field renders as <a href="path">path-or-title</a>
      ctaLinkEl = cell.querySelector('a');
    } else if (cell.textContent.trim()) {
      textCells.push(cell);
    }
  });

  // Text cells in document order: [heading, ...body?, ctaLabel?]
  // Pop the last plain-text cell as ctaLabel when a link exists
  const [headingCell, ...restCells] = textCells;
  const ctaLabelCell = (ctaLinkEl && restCells.length > 0) ? restCells.pop() : null;
  const bodyCells = restCells;

  // Merge ctaLabel text into the link element as button text
  if (ctaLinkEl && ctaLabelCell) {
    ctaLinkEl.textContent = ctaLabelCell.textContent.trim();
  }
  if (ctaLinkEl) {
    ctaLinkEl.classList.add('button');
    ctaLinkEl.classList.add('wknd-hero-btn');
  }

  // Build heading — promote plain text to <h2> if not already a heading
  let headingEl = headingCell?.querySelector('h1, h2, h3');
  if (!headingEl && headingCell?.textContent.trim()) {
    headingEl = document.createElement('h2');
    headingEl.textContent = headingCell.textContent.trim();
  }

  // Content overlay div
  const content = document.createElement('div');
  content.className = 'wknd-hero-content';
  if (headingEl) content.append(headingEl);
  bodyCells.forEach((cell) => {
    [...cell.childNodes].forEach((node) => content.append(node.cloneNode(true)));
  });
  if (ctaLinkEl) {
    const btnWrap = document.createElement('p');
    btnWrap.className = 'button-container';
    btnWrap.append(ctaLinkEl);
    content.append(btnWrap);
  }

  // Background image div
  const bg = document.createElement('div');
  bg.className = 'wknd-hero-bg';
  bg.setAttribute('aria-hidden', 'true');
  if (imageEl) bg.append(imageEl);

  block.innerHTML = '';
  block.append(bg, content);
}

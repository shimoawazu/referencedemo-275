/**
 * Teaser block — image left, text+CTAs right, multiple CTAs supported.
 *
 * Differs from wknd-hero:
 *   - wknd-hero: full-bleed background image, single CTA, centered hero layout.
 *   - teaser: side-by-side image/text, multiple CTAs (outline + filled),
 *             general-purpose promotional component.
 *
 * Authoring table (1 row, 2 cells):
 *   Cell 1 — image (picture element)
 *   Cell 2 — eyebrow text, heading (h2/h3), body copy, CTA links
 *             First <a> → secondary (outline) button
 *             Subsequent <a> → primary (filled) button
 */
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const row = block.children[0];
  if (!row) return;

  [...row.children].forEach((cell) => {
    if (cell.querySelector('picture')) {
      cell.className = 'teaser-image';
    } else {
      cell.className = 'teaser-content';
      // Style CTAs: first link → secondary (outline), rest → primary (filled)
      const links = [...cell.querySelectorAll('a')];
      links.forEach((a, i) => {
        a.classList.add('button');
        a.classList.add(i === 0 ? 'secondary' : 'primary');
      });
      // Wrap CTAs in a container for layout control
      if (links.length > 0) {
        const ctaWrap = document.createElement('p');
        ctaWrap.className = 'teaser-ctas';
        links.forEach((a) => {
          // Move the link's parent <p> content into the wrapper
          const parent = a.parentElement;
          ctaWrap.append(a);
          if (parent && parent !== cell && !parent.hasChildNodes()) {
            parent.remove();
          }
        });
        cell.append(ctaWrap);
      }
    }
  });

  moveInstrumentation(row, block);
  while (row.firstElementChild) block.append(row.firstElementChild);
  row.remove();
}

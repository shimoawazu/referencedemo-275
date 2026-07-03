import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const fieldDivs = [...row.children];
    let imagePicture = null;
    let ctaLinkEl = null;
    const textDivs = [];

    fieldDivs.forEach((div) => {
      if (div.querySelector('picture')) {
        imagePicture = div.querySelector('picture');
      } else if (div.querySelector('a') && !div.querySelector('picture')) {
        ctaLinkEl = div.querySelector('a');
      } else if (div.textContent.trim()) {
        textDivs.push(div);
      }
    });

    // ctaText (last text div) collapses into cta group → merge as button label
    const ctaTextDiv = ctaLinkEl && textDivs.length > 0 ? textDivs.pop() : null;
    if (ctaLinkEl && ctaTextDiv) {
      ctaLinkEl.textContent = ctaTextDiv.textContent.trim();
    }
    if (ctaLinkEl) ctaLinkEl.classList.add('button');

    // Image wrapper
    const imageDiv = document.createElement('div');
    imageDiv.className = 'wknd-cards-card-image';
    if (imagePicture) imageDiv.append(imagePicture);

    // Single body div: heading + body copy + CTA
    const body = document.createElement('div');
    body.className = 'wknd-cards-card-body';

    const [headingDiv, ...bodyDivs] = textDivs;
    if (headingDiv) {
      let headingEl = headingDiv.querySelector('h1, h2, h3');
      if (!headingEl && headingDiv.textContent.trim()) {
        headingEl = document.createElement('h3');
        headingEl.textContent = headingDiv.textContent.trim();
      }
      if (headingEl) body.append(headingEl);
    }
    bodyDivs.forEach((div) => {
      [...div.childNodes].forEach((node) => body.append(node.cloneNode(true)));
    });
    if (ctaLinkEl) {
      const btnWrap = document.createElement('p');
      btnWrap.className = 'button-container';
      btnWrap.append(ctaLinkEl);
      body.append(btnWrap);
    }

    li.append(imageDiv, body);
    ul.append(li);
  });

  ul.querySelectorAll('picture > img').forEach((img) => {
    const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
    moveInstrumentation(img, optimizedPic.querySelector('img'));
    img.closest('picture').replaceWith(optimizedPic);
  });

  block.replaceChildren(ul);
}

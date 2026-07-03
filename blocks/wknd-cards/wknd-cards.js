import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    // Field order matches wknd-card model: image(0), heading(1), body(2), cta(3), ctaText(4)
    const [imageFd, headingFd, bodyFd, ctaFd, ctaTextFd] = [...row.children];

    const imageDiv = document.createElement('div');
    imageDiv.className = 'wknd-cards-card-image';
    const pic = imageFd?.querySelector('picture');
    if (pic) imageDiv.append(pic);

    const ctaLink = ctaFd?.querySelector('a');
    if (ctaLink) {
      const label = ctaTextFd?.textContent?.trim();
      if (label) ctaLink.textContent = label;
      ctaLink.classList.add('button', 'tertiary');
    }

    const body = document.createElement('div');
    body.className = 'wknd-cards-card-body';

    if (headingFd) {
      let h = headingFd.querySelector('h1, h2, h3');
      if (!h && headingFd.textContent.trim()) {
        h = document.createElement('h3');
        h.textContent = headingFd.textContent.trim();
      }
      if (h) body.append(h);
    }

    if (bodyFd) {
      [...bodyFd.childNodes].forEach((n) => body.append(n.cloneNode(true)));
    }

    if (ctaLink) {
      const btnWrap = document.createElement('p');
      btnWrap.className = 'button-container';
      btnWrap.append(ctaLink);
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

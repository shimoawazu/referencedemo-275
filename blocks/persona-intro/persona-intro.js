/**
 * EDS Block: persona-intro
 *
 * Figma → EDS class mapping
 * ─────────────────────────────────────────────────────────
 * Persona intro lens 02 - light  → .persona-intro  (block root)
 *   Text                         → .content
 *     Title-Phase name           → .eyebrow
 *     Frame 26                   → .meta-list
 *     Lorem ipsum…               → .body
 *   Rectangle 3                  → .frame-border        (decorative)
 *   Personas                     → .media
 *     Masato_isolated            → .portrait-image
 *   Rectangle 2                  → .canvas-background   (decorative)
 *   Footer                       → .branding
 *     Adobe_Wordmark             → .logo
 *     Copyrights                 → .legal-note
 *
 * Authoring table row order:
 *   Row 0 → eyebrow       (plain text)
 *   Row 1 → meta-list     (pipe-separated cells → <li> items)
 *   Row 2 → body          (rich text)
 *   Row 3 → portrait img  (reference)
 *   Row 4 → col0=logo img | col1=legal-note text
 */
export default function decorate(block) {
  const rows = [...block.querySelectorAll(':scope > div')];
  const [eyebrowRow, metaRow, bodyRow, mediaRow, brandingRow] = rows;

  // .content
  const content = document.createElement('div');
  content.classList.add('content');

  if (eyebrowRow) {
    const eyebrow = document.createElement('p');
    eyebrow.classList.add('eyebrow');
    eyebrow.innerHTML = eyebrowRow.querySelector('div')?.innerHTML ?? '';
    content.append(eyebrow);
  }

  if (metaRow) {
    const metaList = document.createElement('ul');
    metaList.classList.add('meta-list');
    [...metaRow.querySelectorAll(':scope > div')].forEach((cell) => {
      const li = document.createElement('li');
      li.innerHTML = cell.innerHTML;
      metaList.append(li);
    });
    content.append(metaList);
  }

  if (bodyRow) {
    const bodyEl = bodyRow.querySelector('div');
    if (bodyEl) {
      bodyEl.classList.add('body');
      content.append(bodyEl);
    }
  }

  // .media
  const media = document.createElement('div');
  media.classList.add('media');
  if (mediaRow) {
    const img = mediaRow.querySelector('img');
    if (img) { img.classList.add('portrait-image'); media.append(img); }
  }

  // .branding
  const branding = document.createElement('div');
  branding.classList.add('branding');
  if (brandingRow) {
    const cells = [...brandingRow.querySelectorAll(':scope > div')];
    const logoImg = cells[0]?.querySelector('img');
    if (logoImg) { logoImg.classList.add('logo'); branding.append(logoImg); }
    if (cells[1]) {
      const legal = document.createElement('span');
      legal.classList.add('legal-note');
      legal.innerHTML = cells[1].innerHTML;
      branding.append(legal);
    }
  }

  // Decorative elements
  const canvasBg = document.createElement('div');
  canvasBg.classList.add('canvas-background');
  canvasBg.setAttribute('aria-hidden', 'true');

  const frameBorder = document.createElement('div');
  frameBorder.classList.add('frame-border');
  frameBorder.setAttribute('aria-hidden', 'true');

  block.innerHTML = '';
  block.append(canvasBg, frameBorder, content, media, branding);
}

async function fetchCfData(reference) {
  const cleanRef = reference.replace(/\.html$/, '');
  const url = cleanRef + '/jcr:content/data/master.json';
  try {
    const res = await fetch(url);
    if (res.ok) return res.json();
  } catch (e) { /* fallthrough */ }
  return null;
}

function getCfFieldValue(cfData, fieldName) {
  if (cfData && typeof cfData[fieldName] === 'string') {
    return cfData[fieldName];
  }
  return '';
}

export default async function decorate(block) {
  const link = block.querySelector('a');
  if (!link) return;

  const reference = link.getAttribute('href');
  if (!reference) return;

  const cfData = await fetchCfData(reference);
  if (!cfData) return;

  const title = getCfFieldValue(cfData, 'title');
  const date = getCfFieldValue(cfData, 'date');
  const summary = getCfFieldValue(cfData, 'summary');
  const body = getCfFieldValue(cfData, 'body');
  const linkUrl = getCfFieldValue(cfData, 'linkUrl');

  const dateFormatted = date
    ? new Date(date).toLocaleDateString('ja-JP')
    : '';

  block.innerHTML = `
    <div class="notice-content">
      ${dateFormatted ? `<p class="notice-date">${dateFormatted}</p>` : ''}
      ${title ? `<h1 class="notice-title">${title}</h1>` : ''}
      ${summary ? `<div class="notice-summary">${summary}</div>` : ''}
      ${body ? `<div class="notice-body">${body}</div>` : ''}
      ${linkUrl ? `<p><a href="${linkUrl}">詳細はこちら</a></p>` : ''}
    </div>
  `;
}

export default async function decorate(block) {
  const link = block.querySelector('a');
  if (!link) return;

  const cfPath = link.getAttribute('href');
  if (!cfPath) return;

  try {
    const response = await fetch(`${cfPath}.model.json`);
    const data = await response.json();

    const title = data.title || '';
    const date = data.date ? new Date(data.date).toLocaleDateString('ja-JP') : '';
    const summary = data.summary || '';
    const body = data.body || '';
    const linkUrl = data.linkUrl || '';

    block.innerHTML = `
      <div class="notice-content">
        <p class="notice-date">${date}</p>
        <h1 class="notice-title">${title}</h1>
        <div class="notice-summary">${summary}</div>
        ${body ? `<div class="notice-body">${body}</div>` : ''}
        ${linkUrl ? `<p><a href="${linkUrl}">詳細はこちら</a></p>` : ''}
      </div>
    `;
  } catch (e) {
    console.error('Notice CF fetch error:', e);
  }
}

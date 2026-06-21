export default async function decorate(block) {
  const link = block.querySelector('a');
  if (!link) return;

  const cfPath = link.getAttribute('href');
  if (!cfPath) return;

  try {
    const response = await fetch(`${cfPath}.model.json`);
    const data = await response.json();

    const title = data.title || '';
    const date = data.date || '';
    const summary = data.summary || '';
    const body = data.body || '';

    block.innerHTML = `
      <div class="notice-content">
        <p class="notice-date">${date}</p>
        <h2 class="notice-title">${title}</h2>
        <div class="notice-summary">${summary}</div>
        <div class="notice-body">${body}</div>
      </div>
    `;
  } catch (e) {
    console.error('Notice CF fetch error:', e);
  }
}

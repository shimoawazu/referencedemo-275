async function fetchPages(folderPath, maxItems, sortOrder) {
  const cleanPath = folderPath.replace(/\.html$/, '');
  const url = `${cleanPath}/jcr:content/children.json`;
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();

    const pages = Object.entries(data)
      .filter(([, v]) => v['jcr:primaryType'] === 'cq:Page')
      .map(([key, v]) => ({
        name: key,
        title: v['jcr:content']?.['jcr:title'] || key,
        publishDate: v['jcr:content']?.['cq:lastPublished'] || '',
        path: `${cleanPath}/${key}`,
      }));

    pages.sort((a, b) => {
      if (!a.publishDate) return 1;
      if (!b.publishDate) return -1;
      return sortOrder === 'asc'
        ? new Date(a.publishDate) - new Date(b.publishDate)
        : new Date(b.publishDate) - new Date(a.publishDate);
    });

    return pages.slice(0, maxItems);
  } catch (e) {
    console.error('List 1col fetch error:', e);
    return [];
  }
}

export default async function decorate(block) {
  const rows = [...block.children];

  const folderPathEl = rows[0]?.querySelector('a');
  const folderPath = folderPathEl?.getAttribute('href') || '';

  const maxItemsEl = rows[1]?.querySelector('div');
  const maxItems = parseInt(maxItemsEl?.textContent?.trim() || '3', 10);

  const sortOrderEl = rows[2]?.querySelector('div');
  const sortOrder = sortOrderEl?.textContent?.trim() || 'desc';

  if (!folderPath) return;

  const pages = await fetchPages(folderPath, maxItems, sortOrder);

  if (pages.length === 0) {
    block.innerHTML = '<p>記事が見つかりませんでした。</p>';
    return;
  }

  const ul = document.createElement('ul');
  ul.className = 'list-1col-items';

  pages.forEach((page) => {
    const li = document.createElement('li');
    const date = page.publishDate
      ? new Date(page.publishDate).toLocaleDateString('ja-JP')
      : '';
    li.innerHTML = `
      <a href="${page.path}.html" class="list-1col-link">
        ${date ? `<span class="list-1col-date">${date}</span>` : ''}
        <span class="list-1col-title">${page.title}</span>
      </a>
    `;
    ul.appendChild(li);
  });

  block.innerHTML = '';
  block.appendChild(ul);
}

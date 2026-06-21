async function fetchPages(folderPath, maxItems, sortOrder) {
  const cleanPath = folderPath.replace(/\.html$/, '');

  // Sling直接パスでページ一覧を取得
  const url = `${cleanPath}.model.json`;
  try {
    const res = await fetch(url);
    if (!res.ok) {
      // fallback: sitemap.json を試みる
      const res2 = await fetch(`${cleanPath}.infinity.json`);
      if (!res2.ok) return [];
      const data2 = await res2.json();
      return extractPages(data2, cleanPath, maxItems, sortOrder);
    }
    const data = await res.json();
    return extractPages(data, cleanPath, maxItems, sortOrder);
  } catch (e) {
    console.error('List 1col fetch error:', e);
    return [];
  }
}

function extractPages(data, basePath, maxItems, sortOrder) {
  const pages = [];
  Object.entries(data).forEach(([key, value]) => {
    if (
      value &&
      typeof value === 'object' &&
      value['jcr:primaryType'] === 'cq:Page'
    ) {
      const content = value['jcr:content'] || {};
      pages.push({
        title: content['jcr:title'] || key,
        path: `${basePath}/${key}`,
        publishDate: content['cq:lastPublished'] || content['jcr:created'] || '',
      });
    }
  });

  pages.sort((a, b) => {
    if (!a.publishDate) return 1;
    if (!b.publishDate) return -1;
    return sortOrder === 'asc'
      ? new Date(a.publishDate) - new Date(b.publishDate)
      : new Date(b.publishDate) - new Date(a.publishDate);
  });

  return pages.slice(0, maxItems);
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

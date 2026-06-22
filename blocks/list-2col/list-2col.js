async function fetchPages(folderPath, maxItems, sortOrder) {
  const cleanPath = folderPath.replace(/\.html$/, '');
  try {
    const res = await fetch(`${cleanPath}.infinity.json`);
    if (!res.ok) return [];
    const data = await res.json();

    const pages = [];
    Object.entries(data).forEach(([key, value]) => {
      if (value && typeof value === 'object' && value['jcr:primaryType'] === 'cq:Page') {
        const content = value['jcr:content'] || {};
        // Extract publish date from page name (e.g. inf-20260601 → 2026-06-01).
        // cq:lastPublished is not set by EDS Sidekick, so page name is the reliable source.
        const nameDate = key.match(/(\d{4})(\d{2})(\d{2})/);
        const publishDate = nameDate
          ? `${nameDate[1]}-${nameDate[2]}-${nameDate[3]}`
          : (content['cq:lastModified'] || content['jcr:created'] || '');
        pages.push({
          title: content['jcr:title'] || key,
          path: `${cleanPath}/${key}`,
          publishDate,
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
  } catch (e) {
    console.error('List 2col fetch error:', e);
    return [];
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  // ISO形式 YYYY-MM-DD...
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) return `${match[1]}.${match[2]}.${match[3]}`;
  // AEM形式 "Thu May 17 2025 ..." などのフォールバック
  const d = new Date(dateStr);
  if (!Number.isNaN(d.getTime())) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}.${m}.${day}`;
  }
  return '';
}

export default async function decorate(block) {
  const rows = [...block.children];

  // 左カラム設定
  const folderPathEl = rows[0]?.querySelector('a');
  const folderPath = folderPathEl?.getAttribute('href') || '';
  const maxItems = parseInt(rows[1]?.querySelector('div')?.textContent?.trim() || '5', 10);
  const sortOrder = rows[2]?.querySelector('div')?.textContent?.trim() || 'desc';

  // 右カラム設定
  const rightPageEl = rows[3]?.querySelector('a');
  const rightPage = (rightPageEl?.getAttribute('href') || '').replace(/\.html$/, '');

  const anchors = [];
  for (let i = 0; i < 5; i++) {
    const label = rows[4 + i * 2]?.querySelector('div')?.textContent?.trim() || '';
    const id = rows[5 + i * 2]?.querySelector('div')?.textContent?.trim() || '';
    if (label && id) anchors.push({ label, id });
  }

  // 左カラム：ファイル公開日付きページリスト生成
  let leftItems = '';
  if (folderPath) {
    const pages = await fetchPages(folderPath, maxItems, sortOrder);
    leftItems = pages.map((p) => `
      <li class="list-2col-item">
        <a href="${p.path}.html" class="list-2col-link">
          <span class="list-2col-date">${formatDate(p.publishDate)}</span>
          <span class="list-2col-title">${p.title}</span>
        </a>
      </li>`).join('');
  }

  // 右カラム：アンカーリスト生成
  const rightItems = anchors.map((a) => `
    <li class="list-2col-item">
      <a href="${rightPage}.html#${a.id}" class="list-2col-link">
        <span class="list-2col-arrow">›</span>
        <span class="list-2col-title">${a.label}</span>
      </a>
    </li>`).join('');

  block.innerHTML = `
    <div class="list-2col-left">
      <div class="list-2col-header">
        <span class="list-2col-label">お知らせ</span>
      </div>
      <div class="list-2col-body">
        ${leftItems ? `<ul class="list-2col-items">${leftItems}</ul>` : '<p>記事が見つかりませんでした。</p>'}
      </div>
    </div>
    <div class="list-2col-right">
      <div class="list-2col-header">
        <span class="list-2col-label">ご確認ください</span>
      </div>
      <div class="list-2col-body">
        ${rightItems ? `<ul class="list-2col-items">${rightItems}</ul>` : ''}
      </div>
    </div>
  `;
}

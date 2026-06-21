// CF参照パスを再帰的に検索
function findCfReference(obj) {
  if (!obj || typeof obj !== 'object') return '';
  if (typeof obj.reference === 'string' && obj.reference.startsWith('/content/dam/')) {
    return obj.reference;
  }
  for (const key of Object.keys(obj)) {
    if (key === 'jcr:primaryType' || key === 'jcr:uuid' || key === 'jcr:created') continue;
    const found = findCfReference(obj[key]);
    if (found) return found;
  }
  return '';
}

// CF の publishDate を取得
async function fetchCfDate(cfRef) {
  if (!cfRef) return '';
  try {
    const cleanRef = cfRef.replace(/\.html$/, '');
    const res = await fetch(`${cleanRef}/jcr:content/data/master.json`);
    if (!res.ok) return '';
    const data = await res.json();
    return data['publishDate'] || data['date'] || '';
  } catch (e) {
    return '';
  }
}

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
        const cfRef = findCfReference(content);
        pages.push({
          title: content['jcr:title'] || key,
          path: `${cleanPath}/${key}`,
          cfRef,
          publishDate: '',
          fileDate: content['cq:lastPublished'] || content['jcr:created'] || '',
        });
      }
    });

    // CF日付を並行取得
    await Promise.all(pages.map(async (p) => {
      p.publishDate = await fetchCfDate(p.cfRef);
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
    console.error('List 2col fetch error:', e);
    return [];
  }
}

// タイムゾーン問題を避けるため文字列から直接抽出
function formatDate(dateStr) {
  if (!dateStr) return '';
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) return `${match[1]}.${match[2]}.${match[3]}`;
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

  // 左カラム：CF日付付きページリスト生成
  let leftItems = '';
  if (folderPath) {
    const pages = await fetchPages(folderPath, maxItems, sortOrder);
    leftItems = pages.map((p) => `
      <li class="list-2col-item">
        <a href="${p.path}.html" class="list-2col-link">
          <span class="list-2col-date">${formatDate(p.fileDate)}</span>
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

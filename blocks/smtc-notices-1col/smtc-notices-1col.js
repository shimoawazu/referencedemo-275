/**
 * smtc-notices-1col block — 重要なお知らせ専用
 *
 * 2つのモードをサポート:
 *   1) CF モード: block に data-reference 属性がある場合、CF から取得して表示
 *   2) Direct モード: block 内の item 要素から直接表示（UE 直接編集時）
 *
 * CF モデルフィールド (smtc-notices-1col-model):
 *   sectionTitle, item1Text, item1Url, item2Text, item2Url, item3Text, item3Url
 */

/** CF JSON を取得してパース */
async function fetchCfData(reference) {
  // Assets HTTP API はパスから /content/dam/ を除去する必要がある
  const assetPath = reference.replace('/content/dam/', '/');

  // 方法1: Assets HTTP API
  try {
    const assetUrl = window.location.origin + '/api/assets' + assetPath + '.infinity.json';
    const res = await fetch(assetUrl, { credentials: 'same-origin' });
    if (res.ok) return res.json();
  } catch (e) {
    // fallthrough
  }

  // 方法2: CF Delivery API (UUID)
  try {
    const searchUrl = window.location.origin + '/api/assets' + assetPath + '.json';
    const res2 = await fetch(searchUrl, { credentials: 'same-origin' });
    if (res2.ok) return res2.json();
  } catch (e) {
    // fallthrough
  }

  return null;
}

/** CF JSON からフィールド値を取得 */
function getCfFieldValue(cfData, fieldName) {
  // Assets HTTP API: properties.elements.fieldName.value
  const elements = cfData?.properties?.elements;
  if (elements && elements[fieldName]) {
    return elements[fieldName].value || '';
  }
  // CF delivery API: fields[].name / values[]
  const fields = cfData?.fields;
  if (Array.isArray(fields)) {
    const f = fields.find((x) => x.name === fieldName);
    return f?.values?.[0] || '';
  }
  return '';
}

/** ブロックを描画 */
function render(block, heading, items) {
  const h2 = document.createElement('h2');
  h2.className = 'smtc-notices-1col-heading';
  h2.textContent = heading || '重要なお知らせ';

  const ul = document.createElement('ul');
  ul.className = 'smtc-notices-1col-list';

  items.forEach(({ text, link }) => {
    if (!text) return;
    const li = document.createElement('li');
    if (link) {
      const a = document.createElement('a');
      a.href = link;
      a.textContent = text;
      li.appendChild(a);
    } else {
      li.textContent = text;
    }
    ul.appendChild(li);
  });

  block.appendChild(h2);
  block.appendChild(ul);
}

export default async function decorate(block) {
  const rawItems = [...block.querySelectorAll(':scope > div')];

  // EDS は reference を <a href="/content/dam/..."> で出力する
  const firstDiv = rawItems[0]?.querySelector(':scope > div');
  const refLink = firstDiv?.querySelector('a');
  const refText = refLink ? new URL(refLink.href).pathname : (firstDiv?.textContent.trim() || '');
  const isCfReference = refText.startsWith('/content/dam/');

  if (isCfReference) {
    // UE 用に元 DOM を非表示ストアへ退避
    const store = document.createElement('div');
    store.className = 'smtc-notices-1col-store';
    store.setAttribute('aria-hidden', 'true');
    rawItems.forEach((el) => store.appendChild(el));
    block.appendChild(store);

    // CF データを取得
    const cfData = await fetchCfData(refText);
    if (cfData) {
      const heading  = getCfFieldValue(cfData, 'sectionTitle') || '重要なお知らせ';
      const items = [1, 2, 3].map((n) => ({
        text: getCfFieldValue(cfData, `item${n}Text`),
        link: getCfFieldValue(cfData, `item${n}Url`),
      })).filter((i) => i.text);
      render(block, heading, items);
    } else {
      // CF 取得失敗時のフォールバック表示
      const p = document.createElement('p');
      p.textContent = 'お知らせデータを読み込めませんでした。';
      block.appendChild(p);
    }
    return;
  }

  // --- Direct モード（UE ブロックアイテム直接入力） ---
  const store = document.createElement('div');
  store.className = 'smtc-notices-1col-store';
  store.setAttribute('aria-hidden', 'true');
  rawItems.forEach((el) => store.appendChild(el));
  block.appendChild(store);

  const items = rawItems.map((itemEl) => {
    const cells = [...itemEl.querySelectorAll(':scope > div')];
    return {
      text: cells[0] ? cells[0].textContent.trim() : '',
      link: cells[1] ? cells[1].textContent.trim() : '',
    };
  });

  render(block, '重要なお知らせ', items);
}

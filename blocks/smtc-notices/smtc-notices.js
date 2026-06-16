/**
 * smtc-notices block
 * ダイナースクラブ参照実装 – お知らせセクション
 *
 * レイアウト:
 *   上段: 重要なお知らせ (フル幅 grid-column: 1/-1)
 *   下段: お知らせ (左) | ご確認ください (右)
 *
 * ブロック item DOM (UE から生成):
 *   <div>          ← item wrapper
 *     <div>        ← category  (text: "important" | "news" | "check")
 *     <div>        ← date      (text: "2026年6月1日" / 空)
 *     <div>        ← text      (text or richtext: タイトル)
 *     <div>        ← link      (text: URL)
 *   </div>
 */

const CATEGORY_CONFIG = {
  important: {
    label: '重要なお知らせ',
    cls: 'smtc-notices-important',
  },
  news: {
    label: 'お知らせ',
    cls: 'smtc-notices-news',
    moreLink: 'https://www.diners.co.jp/ja/press.html',
    moreText: 'もっと見る',
  },
  check: {
    label: 'ご確認ください',
    cls: 'smtc-notices-check',
  },
};

/** item wrapper の各セルを取得 */
function parseItem(itemEl) {
  const cells = [...itemEl.querySelectorAll(':scope > div')];
  const getText = (i) => (cells[i] ? cells[i].textContent.trim() : '');
  return {
    category: getText(0) || 'important',
    date: getText(1),
    text: getText(2),
    link: getText(3),
  };
}

/**
 * お知らせアイテムの <li> を生成
 * - 重要なお知らせ: <li><a>テキスト</a></li>  (CSS で「・」付与)
 * - お知らせ:       <li><a>[日付] テキスト</a></li> (CSS で「▶」付与)
 * - ご確認ください: <li><a>テキスト</a></li>  (CSS で「▶」付与)
 */
function buildItem({ category, date, text, link }, itemEl) {
  const li = document.createElement('li');

  // UE インライン編集用 data-aue-* 属性を元要素からコピー
  if (itemEl) {
    [...itemEl.attributes].forEach((attr) => {
      if (attr.name.startsWith('data-aue-') || attr.name.startsWith('data-richtext-')) {
        li.setAttribute(attr.name, attr.value);
      }
    });
  }

  // リンクテキスト組み立て
  const plainText = text.replace(/<[^>]*>/g, '').trim();

  if (link) {
    const a = document.createElement('a');
    a.href = link;

    if (date && category === 'news') {
      // お知らせ: [日付] テキスト を1つのリンクに
      const dateSpan = document.createElement('span');
      dateSpan.className = 'smtc-notices-date';
      dateSpan.textContent = `[${date}]`;
      a.appendChild(dateSpan);
      a.appendChild(document.createTextNode(` ${plainText}`));
    } else {
      a.textContent = plainText;
    }
    li.appendChild(a);
  } else {
    if (date && category === 'news') {
      const dateSpan = document.createElement('span');
      dateSpan.className = 'smtc-notices-date';
      dateSpan.textContent = `[${date}]`;
      li.appendChild(dateSpan);
      li.appendChild(document.createTextNode(` ${plainText}`));
    } else {
      li.textContent = plainText;
    }
  }

  return li;
}

/** 1カテゴリ分の <section> を生成 */
function buildColumn(categoryKey, items) {
  const config = CATEGORY_CONFIG[categoryKey];
  const section = document.createElement('section');
  section.className = `smtc-notices-column ${config.cls}`;

  const heading = document.createElement('h2');
  heading.className = 'smtc-notices-heading';
  heading.textContent = config.label;
  section.appendChild(heading);

  const ul = document.createElement('ul');
  ul.className = 'smtc-notices-list';
  items.forEach(({ data, el }) => {
    ul.appendChild(buildItem(data, el));
  });
  section.appendChild(ul);

  if (config.moreLink) {
    const more = document.createElement('p');
    more.className = 'smtc-notices-more';
    const a = document.createElement('a');
    a.href = config.moreLink;
    a.textContent = config.moreText;
    more.appendChild(a);
    section.appendChild(more);
  }

  return section;
}

export default function decorate(block) {
  // 1. 元の DOM から item を収集
  const rawItems = [...block.querySelectorAll(':scope > div')];

  // カテゴリ別に分類
  const buckets = { important: [], news: [], check: [] };
  rawItems.forEach((itemEl) => {
    const data = parseItem(itemEl);
    const key = data.category in buckets ? data.category : 'important';
    buckets[key].push({ data, el: itemEl });
  });

  // 2. 新しいレイアウト構築
  // ⚠️ textContent = '' で削除しない → UE の data-aue-* 維持のため
  const wrapper = document.createElement('div');
  wrapper.className = 'smtc-notices-inner';

  // 順序: important (フル幅上段) → news (下段左) → check (下段右)
  ['important', 'news', 'check'].forEach((key) => {
    if (buckets[key].length > 0) {
      wrapper.appendChild(buildColumn(key, buckets[key]));
    }
  });

  // 3. 元 item を非表示ストアへ退避 (UE が追跡できるよう)
  const store = document.createElement('div');
  store.className = 'smtc-notices-store';
  store.setAttribute('aria-hidden', 'true');
  rawItems.forEach((el) => store.appendChild(el));

  block.appendChild(store);
  block.appendChild(wrapper);
}

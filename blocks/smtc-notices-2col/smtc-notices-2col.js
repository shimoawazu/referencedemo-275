/**
 * smtc-notices-2col block — お知らせ＋ご確認ください（2列）
 *
 * item DOM:
 *   <div>
 *     <div> category ("news" | "check")
 *     <div> date     ("2026年6月1日" など / 空可)
 *     <div> text     (リンクテキスト)
 *     <div> link     (URL)
 *   </div>
 */

const COLUMNS = {
  news:  { label: 'お知らせ',       cls: 'smtc-notices-2col-news',  moreLink: 'https://www.diners.co.jp/ja/press.html', moreText: 'もっと見る' },
  check: { label: 'ご確認ください', cls: 'smtc-notices-2col-check' },
};

function buildItem({ category, date, text, link }, itemEl) {
  const li = document.createElement('li');

  // UE data-aue-* 属性をコピー
  if (itemEl) {
    [...itemEl.attributes].forEach((attr) => {
      if (attr.name.startsWith('data-aue-') || attr.name.startsWith('data-richtext-')) {
        li.setAttribute(attr.name, attr.value);
      }
    });
  }

  if (link) {
    const a = document.createElement('a');
    a.href = link;

    if (date && category === 'news') {
      const dateSpan = document.createElement('span');
      dateSpan.className = 'smtc-notices-2col-date';
      dateSpan.textContent = `[${date}]`;
      a.appendChild(dateSpan);
      a.appendChild(document.createTextNode(` ${text}`));
    } else {
      a.textContent = text;
    }
    li.appendChild(a);
  } else {
    li.textContent = text;
  }

  return li;
}

function buildColumn(key, items) {
  const cfg = COLUMNS[key];
  const section = document.createElement('section');
  section.className = `smtc-notices-2col-column ${cfg.cls}`;

  const heading = document.createElement('h2');
  heading.className = 'smtc-notices-2col-heading';
  heading.textContent = cfg.label;
  section.appendChild(heading);

  const ul = document.createElement('ul');
  ul.className = 'smtc-notices-2col-list';
  items.forEach(({ data, el }) => ul.appendChild(buildItem(data, el)));
  section.appendChild(ul);

  if (cfg.moreLink) {
    const more = document.createElement('p');
    more.className = 'smtc-notices-2col-more';
    const a = document.createElement('a');
    a.href = cfg.moreLink;
    a.textContent = cfg.moreText;
    more.appendChild(a);
    section.appendChild(more);
  }

  return section;
}

export default function decorate(block) {
  const rawItems = [...block.querySelectorAll(':scope > div')];

  const buckets = { news: [], check: [] };
  rawItems.forEach((itemEl) => {
    const cells = [...itemEl.querySelectorAll(':scope > div')];
    const getText = (i) => (cells[i] ? cells[i].textContent.trim() : '');
    const data = {
      category: getText(0) || 'news',
      date:     getText(1),
      text:     getText(2),
      link:     getText(3),
    };
    const key = data.category in buckets ? data.category : 'news';
    buckets[key].push({ data, el: itemEl });
  });

  const wrapper = document.createElement('div');
  wrapper.className = 'smtc-notices-2col-inner';

  ['news', 'check'].forEach((key) => {
    if (buckets[key].length > 0) {
      wrapper.appendChild(buildColumn(key, buckets[key]));
    }
  });

  // UE 用に元 item を非表示ストアへ退避
  const store = document.createElement('div');
  store.className = 'smtc-notices-2col-store';
  store.setAttribute('aria-hidden', 'true');
  rawItems.forEach((el) => store.appendChild(el));

  block.appendChild(store);
  block.appendChild(wrapper);
}

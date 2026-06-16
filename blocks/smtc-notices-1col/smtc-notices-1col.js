/**
 * smtc-notices-1col block — 重要なお知らせ専用
 *
 * item DOM:
 *   <div>
 *     <div> text (リンクテキスト)
 *     <div> link (URL)
 *   </div>
 */
export default function decorate(block) {
  const rawItems = [...block.querySelectorAll(':scope > div')];

  // --- 見出し ---
  const heading = document.createElement('h2');
  heading.className = 'smtc-notices-1col-heading';
  heading.textContent = '重要なお知らせ';

  // --- リスト ---
  const ul = document.createElement('ul');
  ul.className = 'smtc-notices-1col-list';

  rawItems.forEach((itemEl) => {
    const cells = [...itemEl.querySelectorAll(':scope > div')];
    const text = cells[0] ? cells[0].textContent.trim() : '';
    const link = cells[1] ? cells[1].textContent.trim() : '';

    const li = document.createElement('li');

    // UE data-aue-* 属性をコピー
    [...itemEl.attributes].forEach((attr) => {
      if (attr.name.startsWith('data-aue-') || attr.name.startsWith('data-richtext-')) {
        li.setAttribute(attr.name, attr.value);
      }
    });

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

  // --- UE 用に元 item を非表示ストアへ退避 ---
  const store = document.createElement('div');
  store.className = 'smtc-notices-1col-store';
  store.setAttribute('aria-hidden', 'true');
  rawItems.forEach((el) => store.appendChild(el));

  block.appendChild(store);
  block.appendChild(heading);
  block.appendChild(ul);
}

import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const nav = document.createElement('nav');
  nav.id = 'nav';
  while (fragment.firstElementChild) nav.append(fragment.firstElementChild);

  // Section 0 → nav-brand（ロゴ）
  const navBrand = nav.children[0];
  if (navBrand) {
    navBrand.classList.add('nav-brand');
    // ボタンスタイルを除去してシンプルなリンクに
    navBrand.querySelectorAll('.button').forEach((btn) => btn.classList.remove('button'));
    navBrand.querySelectorAll('.button-container').forEach((c) => c.classList.remove('button-container'));
  }

  // Section 1以降（ナビリンク等）を非表示
  [...nav.children].forEach((child, i) => {
    if (i > 0) child.remove();
  });

  // 検索バーを追加
  const searchDiv = document.createElement('div');
  searchDiv.className = 'nav-search';
  searchDiv.innerHTML = `
    <form class="nav-search-form" role="search" action="/search" method="get">
      <input
        type="search"
        name="q"
        class="nav-search-input"
        placeholder="キーワードを入力"
        aria-label="サイト内検索"
      >
      <button type="submit" class="nav-search-btn" aria-label="検索">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20"
          fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </button>
    </form>
  `;
  nav.append(searchDiv);

  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';
  navWrapper.append(nav);
  block.append(navWrapper);
}

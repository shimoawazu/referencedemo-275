import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const rows = [...block.children];
  const tablist = document.createElement('div');
  tablist.className = 'tabs-list';
  tablist.setAttribute('role', 'tablist');

  const panels = [];

  rows.forEach((row, i) => {
    const [labelCell, panelCell] = row.children;
    const tabId = `tab-${block.id || Math.random().toString(36).slice(2)}-${i}`;
    const panelId = `panel-${block.id || Math.random().toString(36).slice(2)}-${i}`;

    const tab = document.createElement('button');
    tab.className = 'tabs-tab';
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    tab.setAttribute('aria-controls', panelId);
    tab.id = tabId;
    tab.innerHTML = labelCell.innerHTML;

    const panel = document.createElement('div');
    panel.className = 'tabs-panel';
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', tabId);
    panel.id = panelId;
    if (i !== 0) panel.setAttribute('hidden', '');
    moveInstrumentation(row, panel);
    panel.append(...panelCell.childNodes);

    tablist.append(tab);
    panels.push(panel);
  });

  function activateTab(index) {
    tablist.querySelectorAll('.tabs-tab').forEach((t, i) => {
      const active = i === index;
      t.setAttribute('aria-selected', String(active));
      t.classList.toggle('active', active);
    });
    panels.forEach((p, i) => {
      if (i === index) p.removeAttribute('hidden');
      else p.setAttribute('hidden', '');
    });
  }

  tablist.querySelectorAll('.tabs-tab').forEach((tab, i) => {
    tab.addEventListener('click', () => activateTab(i));
    tab.addEventListener('keydown', (e) => {
      const count = tablist.querySelectorAll('.tabs-tab').length;
      if (e.key === 'ArrowRight') activateTab((i + 1) % count);
      else if (e.key === 'ArrowLeft') activateTab((i - 1 + count) % count);
    });
  });

  tablist.querySelector('.tabs-tab')?.classList.add('active');

  block.innerHTML = '';
  block.append(tablist, ...panels);
}

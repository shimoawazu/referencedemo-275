import { moveInstrumentation } from '../../scripts/scripts.js';

export default function decorate(block) {
  const slides = [...block.children];
  const total = slides.length;

  const track = document.createElement('div');
  track.className = 'carousel-track';

  slides.forEach((row, i) => {
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.setAttribute('aria-hidden', i !== 0 ? 'true' : 'false');
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `${i + 1} / ${total}`);
    moveInstrumentation(row, slide);
    while (row.firstElementChild) slide.append(row.firstElementChild);
    track.append(slide);
  });

  const dots = document.createElement('div');
  dots.className = 'carousel-dots';
  dots.setAttribute('role', 'tablist');
  dots.setAttribute('aria-label', 'スライドナビゲーション');

  let current = 0;

  function goTo(index) {
    track.querySelectorAll('.carousel-slide').forEach((s, i) => {
      s.setAttribute('aria-hidden', i !== index ? 'true' : 'false');
    });
    dots.querySelectorAll('.carousel-dot').forEach((d, i) => {
      d.classList.toggle('active', i === index);
      d.setAttribute('aria-selected', String(i === index));
    });
    track.style.transform = `translateX(-${index * 100}%)`;
    current = index;
  }

  for (let i = 0; i < total; i += 1) {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    dot.setAttribute('role', 'tab');
    dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    dot.setAttribute('aria-label', `スライド ${i + 1}`);
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goTo(i));
    dots.append(dot);
  }

  block.innerHTML = '';
  block.setAttribute('aria-roledescription', 'carousel');
  block.append(track, dots);
}

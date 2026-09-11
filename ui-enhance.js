(() => {
  const sections = [...document.querySelectorAll('main section[id]')];
  const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
  const maskTitles = [...document.querySelectorAll('.mask-hole')];

  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.innerHTML = '<i></i>';
  document.body.appendChild(progress);
  const progressBar = progress.querySelector('i');

  const rail = document.createElement('nav');
  rail.className = 'section-rail';
  rail.setAttribute('aria-label', 'Navegação rápida');
  sections.forEach(section => {
    const a = document.createElement('a');
    a.href = `#${section.id}`;
    a.dataset.label = section.id.toUpperCase();
    a.setAttribute('aria-label', section.id);
    rail.appendChild(a);
  });
  document.body.appendChild(rail);

  const railLinks = [...rail.querySelectorAll('a')];

  function setActive(id) {
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
    railLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
  }

  function updateProgress() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const value = max > 0 ? (window.scrollY / max) * 100 : 0;
    progressBar.style.width = `${Math.min(100, Math.max(0, value))}%`;
  }

  function updateMaskScroll() {
    if (!maskTitles.length) return;

    const vh = window.innerHeight || 1;
    maskTitles.forEach(title => {
      const rect = title.getBoundingClientRect();
      const center = rect.top + rect.height / 2;
      const normalized = (center - vh / 2) / vh;
      const shift = Math.max(-90, Math.min(90, normalized * 150));
      title.style.setProperty('--mask-shift', `${shift.toFixed(1)}px`);
    });
  }

  let ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateProgress();
      updateMaskScroll();
      ticking = false;
    });
  }

  const observer = new IntersectionObserver(entries => {
    const visible = entries
      .filter(entry => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible) setActive(visible.target.id);
  }, {
    rootMargin: '-30% 0px -55% 0px',
    threshold: [0, .15, .35, .55]
  });

  sections.forEach(section => observer.observe(section));
  setActive(sections[0]?.id || 'home');
  updateProgress();
  updateMaskScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => {
    updateProgress();
    updateMaskScroll();
  });

  // Pequeno efeito de foco nos cards, sem atrapalhar touch/mobile.
  if (matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.project-card, .panel').forEach(el => {
      el.addEventListener('mousemove', e => {
        const r = el.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width) * 100;
        const y = ((e.clientY - r.top) / r.height) * 100;
        el.style.setProperty('--mx', `${x}%`);
        el.style.setProperty('--my', `${y}%`);
      });
    });
  }
})();

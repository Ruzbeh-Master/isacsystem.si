(() => {
  const video = document.querySelector('#bg-video');
  const year = document.querySelector('.year');
  const menu = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.desktop-nav');

  if (year) year.textContent = new Date().getFullYear();

  if (menu && nav) {
    menu.addEventListener('click', () => {
      const open = menu.getAttribute('aria-expanded') === 'true';
      menu.setAttribute('aria-expanded', String(!open));
      nav.classList.toggle('open', !open);
    });
    nav.addEventListener('click', (event) => {
      if (event.target.closest('a')) {
        nav.classList.remove('open');
        menu.setAttribute('aria-expanded', 'false');
      }
    });
  }

  const revealItems = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => revealObserver.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  if (video && document.body.classList.contains('si-page')) {
    video.pause();
    let duration = 0;
    let targetTime = 0;
    let currentTime = 0;
    let lastSetTime = 0;
    const smoothingFactor = 0.08;

    const updateDuration = () => { duration = Number.isFinite(video.duration) ? video.duration : 0; };
    const updateTarget = () => {
      if (!duration) return;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      targetTime = progress * Math.max(0, duration - 0.08);
    };
    const renderFlow = () => {
      if (duration) {
        currentTime += (targetTime - currentTime) * smoothingFactor;
        // Keep the seek cadence gentle so the browser's video decoder stays smooth.
        if (Math.abs(currentTime - lastSetTime) > 0.03) {
          video.currentTime = currentTime;
          lastSetTime = currentTime;
        }
      }
      window.requestAnimationFrame(renderFlow);
    };
    video.addEventListener('loadedmetadata', () => {
      updateDuration();
      updateTarget();
    }, { once: true });
    if (video.readyState >= 1) {
      updateDuration();
      updateTarget();
    }
    window.addEventListener('scroll', updateTarget, { passive: true });
    window.addEventListener('resize', updateTarget, { passive: true });
    window.requestAnimationFrame(renderFlow);
  } else if (video) {
    // Keep ISAC.XP's current section-proportional background scrub behavior.
    video.pause();
    let duration = 0;
    let queued = false;
    const updateDuration = () => { duration = Number.isFinite(video.duration) ? video.duration : 0; };
    video.addEventListener('loadedmetadata', updateDuration, { once: true });
    if (video.readyState >= 1) updateDuration();
    const scrub = () => {
      queued = false;
      if (!duration) return;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const progress = Math.min(1, Math.max(0, window.scrollY / maxScroll));
      const target = progress * Math.max(0, duration - 0.08);
      if (Math.abs(video.currentTime - target) > 0.035) video.currentTime = target;
    };
    const requestScrub = () => {
      if (!queued) {
        queued = true;
        window.requestAnimationFrame(scrub);
      }
    };
    window.addEventListener('scroll', requestScrub, { passive: true });
    window.addEventListener('resize', requestScrub, { passive: true });
    video.addEventListener('loadedmetadata', requestScrub, { once: true });
    requestScrub();
  }
})();

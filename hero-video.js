document.querySelectorAll('[data-scroll-video]').forEach((heroVideoFrame) => {
  const heroIntroVideo = heroVideoFrame.querySelector('video');
  const heroVideoPlay = heroVideoFrame.querySelector('.hero-video-play');
  if (!heroIntroVideo || !heroVideoPlay) return;

  let heroVideoInView = false;
  let hasStartedOnce = false;
  let initialStartTimer = 0;

  async function startHeroVideo() {
    if (!heroVideoInView || document.hidden) return;
    if (heroIntroVideo.ended) heroIntroVideo.currentTime = 0;

    heroIntroVideo.muted = false;
    try {
      await heroIntroVideo.play();
      if (!heroVideoInView || document.hidden) {
        heroIntroVideo.pause();
        return;
      }
      heroVideoFrame.classList.add('has-audio');
    } catch {
      // Browsers commonly block audible autoplay until the viewer interacts.
      if (!heroVideoInView || document.hidden) return;
      heroIntroVideo.muted = true;
      try {
        await heroIntroVideo.play();
        if (!heroVideoInView || document.hidden) heroIntroVideo.pause();
      } catch {
        heroVideoPlay.textContent = 'Play intro';
      }
    }
  }

  const heroVideoObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      heroVideoInView = entry.isIntersecting && entry.intersectionRatio >= 0.2;
      if (heroVideoInView) {
        if (hasStartedOnce) {
          startHeroVideo();
        } else if (!initialStartTimer) {
          // Give the page's first paint a short head start before fetching the large hero video.
          initialStartTimer = window.setTimeout(() => {
            initialStartTimer = 0;
            if (!heroVideoInView) return;
            hasStartedOnce = true;
            startHeroVideo();
          }, 900);
        }
      } else {
        window.clearTimeout(initialStartTimer);
        initialStartTimer = 0;
        heroIntroVideo.pause();
      }
    }
  }, { threshold: [0, 0.2] });

  heroVideoObserver.observe(heroVideoFrame);

  heroVideoPlay.addEventListener('click', async () => {
    heroIntroVideo.muted = false;
    try {
      if (heroIntroVideo.paused) await heroIntroVideo.play();
      heroVideoFrame.classList.add('has-audio');
    } catch {
      heroVideoPlay.textContent = 'Use the video controls to enable sound';
    }
  });

  heroIntroVideo.addEventListener('pause', () => heroVideoFrame.classList.remove('has-audio'));
  heroIntroVideo.addEventListener('ended', () => heroVideoFrame.classList.remove('has-audio'));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) heroIntroVideo.pause();
    else if (heroVideoInView) startHeroVideo();
  });
});

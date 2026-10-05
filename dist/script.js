const observer = new IntersectionObserver((entries) => {
  for (const entry of entries) {
    if (!entry.isIntersecting) continue;
    entry.target.classList.add('is-visible');
    observer.unobserve(entry.target);
  }
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const profiles = {
  si: {
    eyebrow: 'STRUCTURED INTELLIGENCE · LEARNING PLATFORM',
    title: 'Give learning<br/>a clearer structure.',
    copy: 'Built for MRDI programs, ISAC.SI helps students, tutors, and directors follow learning milestones, daily activity, and project progress in one shared place.',
    audience: 'Students, tutors & program directors',
    focus: 'Milestones, modules & progress',
    outcome: 'A shared view of learning',
    watermark: 'si.',
    link: 'isac-si.html',
    linkText: 'Explore ISAC.SI'
  },
  xp: {
    eyebrow: 'EXPERIENCE INTELLIGENCE · AI CAPABILITY PROFILER',
    title: 'Make your real<br/>strengths visible.',
    copy: 'Built for learners and professionals, ISAC.XP helps uncover strengths in the work you have done and gives you a practical capability profile to share.',
    audience: 'Engineering learners & professionals',
    focus: 'Six behavioral dimensions & reflection',
    outcome: 'A shareable capability portfolio',
    watermark: 'xp.',
    link: 'isac-xp.html',
    linkText: 'Discover ISAC.XP'
  }
};

document.querySelectorAll('.compare-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    const key = tab.dataset.product;
    const profile = profiles[key];
    document.querySelectorAll('.compare-tab').forEach((item) => {
      const selected = item === tab;
      item.classList.toggle('selected', selected);
      item.setAttribute('aria-selected', String(selected));
    });
    document.querySelector('#compare-eyebrow').textContent = profile.eyebrow;
    document.querySelector('#compare-title').innerHTML = profile.title;
    document.querySelector('#compare-copy').textContent = profile.copy;
    document.querySelector('#compare-audience').textContent = profile.audience;
    document.querySelector('#compare-focus').textContent = profile.focus;
    document.querySelector('#compare-outcome').textContent = profile.outcome;
    document.querySelector('#compare-watermark').textContent = profile.watermark;
    const link = document.querySelector('#compare-link');
    link.href = profile.link;
    link.innerHTML = `${profile.linkText} <span>↗</span>`;
  });
});

const dimensionPresets = {
  logic: [0, 1, -1, 0, -1, -1],
  velocity: [-1, 0, -1, -1, 0, 1],
  stability: [-1, -1, 0, 1, 0, -1],
  consistency: [0, -1, 1, 0, 1, -1],
  recall: [-1, 0, 0, 1, 0, 1],
  confidence: [-1, 1, -1, -1, 1, 0]
};
const basePoints = [[200, 82], [294, 146], [320, 269], [200, 302], [108, 253], [122, 155]];
const shape = document.querySelector('.radar-shape');
const points = [...document.querySelectorAll('.radar-point')];

document.querySelectorAll('.dimension-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.dimension-tab').forEach((item) => {
      const selected = item === tab;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-selected', String(selected));
    });
    const shifted = basePoints.map(([x, y], index) => {
      const amount = dimensionPresets[tab.dataset.dim][index] * 13;
      const dx = x - 200;
      const dy = y - 200;
      const length = Math.hypot(dx, dy) || 1;
      return [x + (dx / length) * amount, y + (dy / length) * amount];
    });
    shape.setAttribute('points', shifted.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' '));
    points.forEach((point, index) => {
      point.setAttribute('cx', shifted[index][0].toFixed(1));
      point.setAttribute('cy', shifted[index][1].toFixed(1));
    });
  });
});

const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.desktop-nav');
menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
});
nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
}));

document.querySelector('#year').textContent = new Date().getFullYear();

// Scrub the full-page background video to the document's scroll position.
const backgroundVideo = document.querySelector('#bg-video');
let scrollTarget = 0;
let scrollCurrent = 0;
let lastVideoTime = -1;
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

function updateScrollTarget() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  scrollTarget = progress * (Number.isFinite(backgroundVideo.duration) ? backgroundVideo.duration : 0);
}

window.addEventListener('scroll', updateScrollTarget, { passive: true });
window.addEventListener('resize', updateScrollTarget, { passive: true });
backgroundVideo.addEventListener('loadedmetadata', updateScrollTarget);

function scrubBackground() {
  if (!reducedMotion.matches && Number.isFinite(backgroundVideo.duration) && backgroundVideo.duration > 0) {
    scrollCurrent += (scrollTarget - scrollCurrent) * 0.09;
    if (Math.abs(scrollCurrent - lastVideoTime) > 0.04) {
      try {
        backgroundVideo.currentTime = scrollCurrent;
        lastVideoTime = scrollCurrent;
      } catch { /* The browser may still be seeking the previous frame. */ }
    }
  }
  requestAnimationFrame(scrubBackground);
}

updateScrollTarget();
requestAnimationFrame(scrubBackground);


const signalExamples = {
  workshop: {
    index: '01', kind: 'PRACTICAL REPETITION', title: 'Make. Test. Improve.',
    description: 'Returning to a hands-on task can reveal consistency, stability, and how a learner improves with practice.',
    dimensions: ['stability', 'consistency', 'velocity']
  },
  project: {
    index: '02', kind: 'PROJECT EVIDENCE', title: 'Solve. Build. Explain.',
    description: 'A project connects reasoning and recall to decisions a learner can show, discuss, and refine.',
    dimensions: ['logic', 'recall', 'confidence']
  },
  learning: {
    index: '03', kind: 'INDEPENDENT LEARNING', title: 'Follow the question.',
    description: 'Self-directed learning can show how someone explores unfamiliar ideas, adapts, and applies new knowledge.',
    dimensions: ['velocity', 'confidence', 'recall']
  }
};

document.querySelectorAll('.signal-option').forEach((option) => {
  option.addEventListener('click', () => {
    const example = signalExamples[option.dataset.signal];
    document.querySelectorAll('.signal-option').forEach((item) => {
      const selected = item === option;
      item.classList.toggle('selected', selected);
      item.setAttribute('aria-selected', String(selected));
    });
    document.querySelector('#signal-index').textContent = example.index;
    document.querySelector('#signal-kind').textContent = example.kind;
    document.querySelector('#signal-title').textContent = example.title;
    document.querySelector('#signal-description').textContent = example.description;
    document.querySelectorAll('.signal-label').forEach((label) => {
      label.classList.toggle('signal-active', example.dimensions.includes(label.textContent.toLowerCase()));
    });
  });
});

document.querySelector('.signal-option.selected')?.click();

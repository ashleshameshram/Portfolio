document.addEventListener('DOMContentLoaded', () => {

  /* ---------- 1. PRELOADER: progress ring counts 0 → 100 then fades out ---------- */
  const preloader = document.getElementById('preloader');
  const countEl = document.getElementById('preloaderCount');
  const ringFg = document.getElementById('ringFg');
  const CIRCUMFERENCE = 339.29;

  if (preloader && countEl && ringFg) {
    document.body.style.overflow = 'hidden';
    let progress = 0;
    const duration = 1400; // ms
    const start = performance.now();

    function tick(now) {
      const elapsed = now - start;
      progress = Math.min(100, Math.round((elapsed / duration) * 100));
      countEl.textContent = progress;
      ringFg.style.strokeDashoffset = CIRCUMFERENCE - (CIRCUMFERENCE * progress) / 100;

      if (progress < 100) {
        requestAnimationFrame(tick);
      } else {
        setTimeout(() => {
          preloader.classList.add('is-hidden');
          document.body.style.overflow = '';
        }, 350);
      }
    }
    requestAnimationFrame(tick);
  }

  /* ---------- 2. SPLIT TEXT INTO CHARACTERS ----------*/
  document.querySelectorAll('[data-split], .hero-hover').forEach(el => {
    const text = el.textContent;
    el.textContent = '';
    [...text].forEach(ch => {
      const span = document.createElement('span');
      span.className = 'char';
      span.textContent = ch === ' ' ? '\u00A0' : ch;
      el.appendChild(span);
    });
  });

  /* ---------- 2a. HERO TITLE ---------- */
  const heroTitleLoop = document.getElementById('heroTitleLoop');
  if (heroTitleLoop) {
    const phrases = ['Frontend Developer', 'React.js Developer'];
    let phraseIndex = 0;

    function renderPhrase(text) {
      heroTitleLoop.innerHTML = '';
      [...text].forEach((ch, i) => {
        const span = document.createElement('span');
        span.className = 'loop-char';
        span.textContent = ch === ' ' ? '\u00A0' : ch;
        span.style.transitionDelay = `${i * 28}ms`;
        heroTitleLoop.appendChild(span);
      });
      // trigger the fade-in on the next frame so the transition actually plays
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          heroTitleLoop.querySelectorAll('.loop-char').forEach(el => el.classList.add('is-in'));
        });
      });
    }

    function cyclePhrase() {
      const chars = heroTitleLoop.querySelectorAll('.loop-char');
      chars.forEach((el, i) => {
        el.style.transitionDelay = `${i * 14}ms`;
        el.classList.remove('is-in');
      });
      const exitDuration = chars.length * 14 + 450;
      setTimeout(() => {
        phraseIndex = (phraseIndex + 1) % phrases.length;
        renderPhrase(phrases[phraseIndex]);
      }, exitDuration);
    }

    renderPhrase(phrases[0]);
    setInterval(cyclePhrase, 2800);
  }

  /* ---------- 2b. TEXT LOOP  ---------- */
  const loopItems = document.querySelectorAll('.role-loop__item');
  if (loopItems.length) {
    let loopIndex = [...loopItems].findIndex(el => el.dataset.state === 'active');
    if (loopIndex < 0) loopIndex = 0;

    setInterval(() => {
      const current = loopItems[loopIndex];
      const nextIndex = (loopIndex + 1) % loopItems.length;
      const next = loopItems[nextIndex];

      current.dataset.state = 'exit';
      next.dataset.state = 'active';

      // reset the exited item back to its pre-entrance state, without animating the reset
      setTimeout(() => {
        current.classList.add('no-transition');
        current.dataset.state = 'enter';
        void current.offsetWidth; // force reflow
        current.classList.remove('no-transition');
      }, 520);

      loopIndex = nextIndex;
    }, 2400);
  }

  /* ---------- 3. CURSOR GLOW ---------- */
  const glow = document.getElementById('cursorGlow');
  if (glow && window.matchMedia('(hover: hover)').matches) {
    window.addEventListener('mousemove', e => {
      glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
    });
  }

  /* ---------- 4. NAV: burger toggle + scroll shrink ---------- */
  const nav = document.getElementById('siteNav');
  const burger = document.getElementById('navBurger');
  burger?.addEventListener('click', () => nav.classList.toggle('is-open'));
  document.querySelectorAll('.nav__link').forEach(link => {
    link.addEventListener('click', () => nav.classList.remove('is-open'));
  });

  /* ---------- 5. MAGNETIC BUTTONS ---------- */
  document.querySelectorAll('.btn-magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const r = btn.getBoundingClientRect();
      const x = e.clientX - r.left - r.width / 2;
      const y = e.clientY - r.top - r.height / 2;
      btn.style.transform = `translate(${x * 0.25}px, ${y * 0.4}px)`;
    });
    btn.addEventListener('mouseleave', () => { btn.style.transform = 'translate(0,0)'; });
  });

  /* ---------- 6. SCROLL REVEALS (curtain / fade-up / lid) ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-open', 'is-in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.25, rootMargin: '0px 0px -10% 0px' });

  document.querySelectorAll('.reveal-curtain, .reveal-up, .swing-reveal')
    .forEach(el => io.observe(el));

  // stagger project cards slightly
  document.querySelectorAll('.project-grid .swing-reveal').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.12}s`;
  });
  document.querySelectorAll('.stat-row .reveal-up').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.1}s`;
  });

  /* ---------- 6b. PROJECT CARDS: animated sliding background highlight on hover ---------- */
  const projectGrid = document.getElementById('projectGrid');
  const projectHighlight = document.getElementById('projectHighlight');
  if (projectGrid && projectHighlight) {
    const cards = projectGrid.querySelectorAll('.project-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        const gridRect = projectGrid.getBoundingClientRect();
        const cardRect = card.getBoundingClientRect();
        const pad = 6; // let the highlight peek out slightly around the card
        projectHighlight.style.width = `${cardRect.width + pad * 2}px`;
        projectHighlight.style.height = `${cardRect.height + pad * 2}px`;
        projectHighlight.style.transform =
          `translate(${cardRect.left - gridRect.left - pad}px, ${cardRect.top - gridRect.top - pad}px)`;
        projectHighlight.style.opacity = '1';
      });
    });
    projectGrid.addEventListener('mouseleave', () => {
      projectHighlight.style.opacity = '0';
    });
  }

  /* ---------- 7. PARALLAX ON HERO BLOBS ---------- */
  const blobs = document.querySelectorAll('.blob');
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const y = window.scrollY;
        blobs.forEach((b, i) => {
          const speed = 0.06 + i * 0.03;
          b.style.transform = `translate(${y * speed * 0.3}px, ${y * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  });

  /* ---------- 8. BACK TO TOP ---------- */
  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('is-visible', window.scrollY > 600);
  });
  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- 8b. THEME TOGGLE (light/dark) ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.querySelector('#themeToggle i');
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (themeIcon) 
      themeIcon.className = theme === 'light' 
        ? 'fa-solid fa-sun'
        : 'fa-solid fa-moon';
      themeIcon.style.color = theme === 'dark' ? 'white' : '';
    localStorage.setItem('theme', theme);
  }
  const savedTheme = localStorage.getItem('theme') || 'dark';
  applyTheme(savedTheme);
  
  themeToggle?.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme') || 'dark';
    applyTheme(current === 'dark' ? 'light' : 'dark');
  });

  /* ---------- 9. FOOTER YEAR ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

});
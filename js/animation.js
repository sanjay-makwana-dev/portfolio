/* =========================================================
   animation.js — loader, typing, counters, reveal, particles,
   magnetic buttons, ripple, cursor glow, skill bars
   ========================================================= */

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Loader ---------------- */
  function initLoader() {
    const loader = document.getElementById('loader');
    const typedEl = document.getElementById('loaderTyped');
    const progressEl = document.getElementById('loaderProgress');
    if (!loader) return;

    const bootLines = ['> whoami', 'Sanjay Makwana — .NET Full Stack Developer'];
    let lineIndex = 0, charIndex = 0;

    function typeLoader() {
      if (lineIndex >= bootLines.length) return;
      const line = bootLines[lineIndex];
      if (charIndex <= line.length) {
        typedEl.textContent = line.slice(0, charIndex);
        charIndex++;
        setTimeout(typeLoader, 22);
      } else {
        lineIndex++;
        charIndex = 0;
        if (lineIndex < bootLines.length) {
          setTimeout(typeLoader, 250);
        }
      }
    }
    typeLoader();

    let progress = 0;
    const progressTimer = setInterval(() => {
      progress += Math.random() * 18 + 6;
      if (progress >= 100) {
        progress = 100;
        clearInterval(progressTimer);
      }
      if (progressEl) progressEl.style.width = progress + '%';
    }, 140);

    window.addEventListener('load', () => {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.classList.remove('no-scroll');
        startPageAnimations();
      }, 650);
    });

    document.body.classList.add('no-scroll');
    // Safety fallback in case 'load' fires very late
    setTimeout(() => {
      if (!loader.classList.contains('hidden')) {
        loader.classList.add('hidden');
        document.body.classList.remove('no-scroll');
        startPageAnimations();
      }
    }, 3200);
  }

  /* ---------------- Hero typing effect ---------------- */
  function initTypedTitle() {
    const el = document.getElementById('typedTitle');
    if (!el) return;
    const phrases = [
      '.NET Full Stack Developer',
      'ASP.NET Core & Blazor Engineer',
      'Building scalable REST APIs',
      'Clean Architecture advocate'
    ];
    let p = 0, c = 0, deleting = false;

    function tick() {
      const phrase = phrases[p];
      if (!deleting) {
        c++;
        el.textContent = phrase.slice(0, c);
        if (c === phrase.length) {
          deleting = true;
          setTimeout(tick, 1400);
          return;
        }
      } else {
        c--;
        el.textContent = phrase.slice(0, c);
        if (c === 0) {
          deleting = false;
          p = (p + 1) % phrases.length;
        }
      }
      setTimeout(tick, deleting ? 28 : 46);
    }
    tick();
  }

  /* ---------------- Scroll reveal (Intersection Observer) ---------------- */
  function initReveal() {
    const targets = document.querySelectorAll('.reveal-up, .reveal-scale');
    if (!('IntersectionObserver' in window) || reduceMotion) {
      targets.forEach(t => t.classList.add('in-view'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
    targets.forEach(t => io.observe(t));
  }

  /* ---------------- Animated counters ---------------- */
  function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    if (!counters.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10) || 0;
        const suffix = el.dataset.suffix || '';
        const duration = 1400;
        const start = performance.now();

        function step(ts) {
          const progress = Math.min((ts - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        io.unobserve(el);
      });
    }, { threshold: 0.4 });
    counters.forEach(c => io.observe(c));
  }

  /* ---------------- Skill progress bars ---------------- */
  function initSkillBars() {
    const bars = document.querySelectorAll('.skill-bar');
    if (!bars.length) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const bar = entry.target;
        const fill = bar.querySelector('.skill-fill');
        const level = bar.dataset.level || 0;
        requestAnimationFrame(() => { fill.style.width = level + '%'; });
        io.unobserve(bar);
      });
    }, { threshold: 0.3 });
    bars.forEach(b => io.observe(b));
  }

  /* ---------------- Magnetic buttons ---------------- */
  function initMagnetic() {
    if (reduceMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const items = document.querySelectorAll('[data-magnetic]');
    items.forEach(el => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        el.style.transform = `translate3d(${x * 0.22}px, ${y * 0.32}px, 0)`;
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'translate3d(0,0,0)';
      });
    });
  }

  /* ---------------- Cursor glow ---------------- */
  function initCursorGlow() {
    const glow = document.getElementById('cursorGlow');
    if (!glow || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let raf = null;
    document.addEventListener('mousemove', (e) => {
      glow.classList.add('active');
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      });
    });
    document.addEventListener('mouseleave', () => glow.classList.remove('active'));
  }

  /* ---------------- Ripple click effect ---------------- */
  function initRipple() {
    document.querySelectorAll('.btn, .theme-toggle, .back-to-top').forEach(el => {
      el.style.position = el.style.position || 'relative';
      el.style.overflow = 'hidden';
      el.addEventListener('click', function (e) {
        const rect = el.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height) * 1.4;
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        el.appendChild(ripple);
        setTimeout(() => ripple.remove(), 650);
      });
    });
  }

  /* ---------------- Hero particle / dot-grid canvas ---------------- */
  function initHeroCanvas() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas || reduceMotion) return;
    const ctx = canvas.getContext('2d');
    let w, h, dots = [];
    const mouse = { x: -9999, y: -9999 };

    function resize() {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
      const gap = 42;
      dots = [];
      for (let x = gap / 2; x < w; x += gap) {
        for (let y = gap / 2; y < h; y += gap) {
          dots.push({ x, y, ox: x, oy: y });
        }
      }
    }

    function draw() {
      ctx.clearRect(0, 0, w, h);
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const baseColor = isLight ? '17,24,39' : '255,255,255';
      const primary = '59,130,246';

      dots.forEach(d => {
        const dx = mouse.x - d.x, dy = mouse.y - d.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const influence = Math.max(0, 1 - dist / 160);
        const px = d.x - dx * influence * 0.12;
        const py = d.y - dy * influence * 0.12;
        const radius = 1.1 + influence * 1.8;
        const color = influence > 0.05 ? primary : baseColor;
        const alpha = influence > 0.05 ? 0.15 + influence * 0.55 : 0.10;

        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${color},${alpha})`;
        ctx.fill();
      });
      requestAnimationFrame(draw);
    }

    canvas.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });
    canvas.addEventListener('mouseleave', () => { mouse.x = -9999; mouse.y = -9999; });
    window.addEventListener('resize', resize);

    resize();
    draw();
  }

  function startPageAnimations() {
    initTypedTitle();
    initReveal();
    initCounters();
    initSkillBars();
    initMagnetic();
    initCursorGlow();
    initRipple();
    initHeroCanvas();
  }

  document.addEventListener('DOMContentLoaded', initLoader);
})();

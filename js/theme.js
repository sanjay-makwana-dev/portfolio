/* =========================================================
   theme.js — dark/light theme + Telegram-style circular reveal
   ========================================================= */

(function () {
  const STORAGE_KEY = 'sm-portfolio-theme';
  const root = document.documentElement;
  const toggleBtn = document.getElementById('themeToggle');
  const canvas = document.getElementById('themeReveal');
  const ctx = canvas ? canvas.getContext('2d') : null;

  function getPreferredTheme() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme(theme) {
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
  }

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  function snapshotAsImage(cb) {
    // Simplest reliable cross-browser approach: capture nothing, just
    // animate a solid circular mask of the *incoming* theme's background
    // color expanding from the toggle button (Telegram-style reveal).
    cb();
  }

  function circularReveal(nextTheme, originEl) {
    if (!canvas || !ctx || prefersReducedMotion()) {
      applyTheme(nextTheme);
      localStorage.setItem(STORAGE_KEY, nextTheme);
      return;
    }

    const rect = originEl ? originEl.getBoundingClientRect() : { left: window.innerWidth - 40, top: 40, width: 0, height: 0 };
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    const maxRadius = Math.hypot(
      Math.max(originX, window.innerWidth - originX),
      Math.max(originY, window.innerHeight - originY)
    );

    const bgColor = nextTheme === 'light' ? '#F5F7FA' : '#0F1115';

    canvas.style.display = 'block';
    resizeCanvas();

    const duration = 620;
    let start = null;

    function frame(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
      const radius = eased * maxRadius;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = bgColor;
      ctx.beginPath();
      ctx.arc(originX, originY, radius, 0, Math.PI * 2);
      ctx.fill();

      // Swap the actual theme halfway through so the underlying page
      // matches the circle's color as it expands past content.
      if (progress > 0.02 && root.getAttribute('data-theme') !== (nextTheme === 'light' ? 'light' : null)) {
        applyTheme(nextTheme);
      }

      if (progress < 1) {
        requestAnimationFrame(frame);
      } else {
        localStorage.setItem(STORAGE_KEY, nextTheme);
        canvas.style.display = 'none';
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    requestAnimationFrame(frame);
  }

  function prefersReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  function currentTheme() {
    return root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  }

  // Init
  applyTheme(getPreferredTheme());

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const next = currentTheme() === 'light' ? 'dark' : 'light';
      circularReveal(next, toggleBtn);
    });
  }

  window.SMTheme = { currentTheme };
})();

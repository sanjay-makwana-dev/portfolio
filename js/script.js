/* =========================================================
   script.js — navbar, mobile nav, scroll spy, modal, form
   ========================================================= */

(function () {
  document.addEventListener('DOMContentLoaded', () => {
    initYear();
    initNavbarScroll();
    initMobileNav();
    initScrollSpy();
    initBackToTop();
    initProjectModal();
    initContactForm();
  });

  function initYear() {
    const el = document.getElementById('year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------------- Navbar blur on scroll ---------------- */
  function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    function update() {
      if (window.scrollY > 24) navbar.classList.add('scrolled');
      else navbar.classList.remove('scrolled');
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /* ---------------- Mobile hamburger nav ---------------- */
  function initMobileNav() {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    if (!hamburger || !navLinks) return;

    const backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);

    function closeMenu() {
      hamburger.classList.remove('active');
      hamburger.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('open');
      backdrop.classList.remove('open');
      document.body.classList.remove('no-scroll');
    }
    function openMenu() {
      hamburger.classList.add('active');
      hamburger.setAttribute('aria-expanded', 'true');
      navLinks.classList.add('open');
      backdrop.classList.add('open');
      document.body.classList.add('no-scroll');
    }

    hamburger.addEventListener('click', () => {
      hamburger.classList.contains('active') ? closeMenu() : openMenu();
    });
    backdrop.addEventListener('click', closeMenu);
    navLinks.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeMenu);
    });
  }

  /* ---------------- Scroll spy (active section indicator) ---------------- */
  function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const links = document.querySelectorAll('.nav-link');
    if (!sections.length || !links.length) return;

    function update() {
      let current = sections[0].id;
      const scrollPos = window.scrollY + window.innerHeight * 0.35;
      sections.forEach(sec => {
        if (scrollPos >= sec.offsetTop) current = sec.id;
      });
      links.forEach(link => {
        link.classList.toggle('active', link.dataset.section === current);
      });
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /* ---------------- Back to top ---------------- */
  function initBackToTop() {
    const btn = document.getElementById('backToTop');
    if (!btn) return;
    window.addEventListener('scroll', () => {
      btn.classList.toggle('visible', window.scrollY > 480);
    }, { passive: true });
    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------- Project details modal ---------------- */
  function initProjectModal() {
    const overlay = document.getElementById('modalOverlay');
    const closeBtn = document.getElementById('modalClose');
    if (!overlay) return;

    const roleEl = document.getElementById('modalRole');
    const titleEl = document.getElementById('modalTitle');
    const descEl = document.getElementById('modalDesc');
    const stackEl = document.getElementById('modalStack');
    const featuresEl = document.getElementById('modalFeatures');

    function openModal(card) {
      roleEl.textContent = card.dataset.role || '';
      titleEl.textContent = card.dataset.title || '';
      descEl.textContent = card.dataset.desc || '';

      stackEl.innerHTML = '';
      (card.dataset.stack || '').split(',').map(s => s.trim()).filter(Boolean).forEach(tech => {
        const span = document.createElement('span');
        span.className = 'tag';
        span.textContent = tech;
        stackEl.appendChild(span);
      });

      featuresEl.innerHTML = '';
      (card.dataset.features || '').split('·').map(s => s.trim()).filter(Boolean).forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        featuresEl.appendChild(li);
      });

      overlay.classList.add('open');
      document.body.classList.add('no-scroll');
    }

    function closeModal() {
      overlay.classList.remove('open');
      document.body.classList.remove('no-scroll');
    }

    document.querySelectorAll('.project-card').forEach(card => {
      const trigger = () => openModal(card);
      card.querySelector('.project-details-btn').addEventListener('click', (e) => {
        e.stopPropagation();
        trigger();
      });
      card.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') trigger();
      });
    });

    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  }

  /* ---------------- Contact form (client-side UI only) ---------------- */
  function initContactForm() {
    const form = document.getElementById('contactForm');
    const note = document.getElementById('formNote');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const message = form.message.value.trim();
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!name || !email || !message) {
        note.textContent = 'Please fill in every field before sending.';
        return;
      }
      if (!emailPattern.test(email)) {
        note.textContent = 'Please enter a valid email address.';
        return;
      }

      const btn = form.querySelector('button[type="submit"]');
      const btnText = btn.querySelector('.btn-text');
      const original = btnText.textContent;
      btnText.textContent = 'Sending...';
      btn.disabled = true;

      // No backend is wired up — this simulates a send so the UI is
      // fully functional and ready to connect to a real endpoint.
      setTimeout(() => {
        note.textContent = `Thanks ${name.split(' ')[0]}, your message has been noted. I'll reply at ${email} soon.`;
        btnText.textContent = original;
        btn.disabled = false;
        form.reset();
      }, 900);
    });
  }
})();

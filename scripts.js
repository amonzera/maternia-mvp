/**
 * Maternia — scripts.js
 * Interações e animações para o site Maternia
 * Vanilla JS — sem dependências externas
 */

(function () {
  'use strict';

  /* =============================================
   * 1. MOBILE MENU
   * ============================================= */
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuClose = document.querySelector('.mobile-menu__close');
  const mobileMenuLinks = document.querySelectorAll('.mobile-menu__nav a');

  function openMobileMenu() {
    mobileMenu.classList.add('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    mobileMenuBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', openMobileMenu);

    if (mobileMenuClose) {
      mobileMenuClose.addEventListener('click', closeMobileMenu);
    }

    // Close menu when clicking a link
    mobileMenuLinks.forEach(function (link) {
      link.addEventListener('click', closeMobileMenu);
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
      }
    });

    // Close menu when clicking outside
    mobileMenu.addEventListener('click', function (e) {
      if (e.target === mobileMenu) {
        closeMobileMenu();
      }
    });
  }

  /* =============================================
   * 2. SMOOTH SCROLL for anchor links
   * ============================================= */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
      const targetPosition = targetEl.getBoundingClientRect().top + window.scrollY - headerHeight - 16;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });

      // Update URL without triggering scroll
      history.pushState(null, '', targetId);
    });
  });

  /* =============================================
   * 3. SCROLL REVEAL — IntersectionObserver
   * ============================================= */
  const animateElements = document.querySelectorAll('.animate-on-scroll');

  if (animateElements.length > 0 && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            // Stagger animation for sibling elements
            const parent = entry.target.parentElement;
            const siblings = parent ? parent.querySelectorAll('.animate-on-scroll') : [];
            let delay = 0;

            siblings.forEach(function (sibling) {
              if (sibling === entry.target || entry.target.contains(sibling)) {
                return;
              }
            });

            entry.target.style.transitionDelay = delay + 'ms';
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -60px 0px'
      }
    );

    animateElements.forEach(function (el, index) {
      // Add staggered delay based on position in parent
      const parent = el.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter(function (child) {
          return child.classList.contains('animate-on-scroll');
        });
        const siblingIndex = siblings.indexOf(el);
        if (siblingIndex > 0) {
          el.style.transitionDelay = (siblingIndex * 100) + 'ms';
        }
      }
      revealObserver.observe(el);
    });
  } else {
    // Fallback: show all elements immediately
    animateElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* =============================================
   * 4. HEADER SCROLL EFFECT
   * ============================================= */
  const header = document.querySelector('.header');

  if (header) {
    let lastScroll = 0;
    let ticking = false;

    function updateHeader() {
      const scrollY = window.scrollY;

      if (scrollY > 10) {
        header.classList.add('header--scrolled');
      } else {
        header.classList.remove('header--scrolled');
      }

      lastScroll = scrollY;
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (!ticking) {
        requestAnimationFrame(updateHeader);
        ticking = true;
      }
    }, { passive: true });

    // Initial check
    updateHeader();
  }

  /* =============================================
   * 5. ACTIVE NAV TRACKING
   * ============================================= */
  const navLinks = document.querySelectorAll('.header-nav a');
  const sections = document.querySelectorAll('section[id]');

  if (navLinks.length > 0 && sections.length > 0 && 'IntersectionObserver' in window) {
    const navObserver = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('id');
            navLinks.forEach(function (link) {
              link.classList.remove('active');
              if (link.getAttribute('href') === '#' + id) {
                link.classList.add('active');
              }
            });
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: '-80px 0px -50% 0px'
      }
    );

    sections.forEach(function (section) {
      navObserver.observe(section);
    });
  }

  /* =============================================
   * 6. FAQ ACCORDION (smooth height animation)
   * ============================================= */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(function (details) {
    const summary = details.querySelector('summary');
    const answer = details.querySelector('.faq-answer');

    if (!summary || !answer) return;

    summary.addEventListener('click', function (e) {
      e.preventDefault();

      // If already open, close it
      if (details.open) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
        // Force reflow
        answer.offsetHeight;
        answer.style.maxHeight = '0';
        answer.style.opacity = '0';

        answer.addEventListener('transitionend', function handler() {
          details.open = false;
          answer.removeEventListener('transitionend', handler);
        });
      } else {
        // Open it
        details.open = true;
        const height = answer.scrollHeight;
        answer.style.maxHeight = '0';
        answer.style.opacity = '0';
        // Force reflow
        answer.offsetHeight;
        answer.style.maxHeight = height + 'px';
        answer.style.opacity = '1';

        answer.addEventListener('transitionend', function handler() {
          answer.style.maxHeight = 'none';
          answer.removeEventListener('transitionend', handler);
        });
      }
    });
  });

  /* =============================================
   * 7. PREFERS REDUCED MOTION
   * ============================================= */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (prefersReducedMotion.matches) {
    // Show all elements immediately
    animateElements.forEach(function (el) {
      el.classList.add('is-visible');
      el.style.transitionDelay = '0ms';
      el.style.transitionDuration = '0ms';
    });
  }

})();

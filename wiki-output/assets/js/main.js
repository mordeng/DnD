/**
 * D&D Campaign Wiki - Main JavaScript
 * Core functionality and initialization
 */

(function() {
  'use strict';

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    setupMobileMenu();
    setupCollapsibleNav();
    setupSmoothScroll();
    setupTableOfContents();
    setupMobileSwipeGestures();
    setupMobileTouchOptimizations();
    setupViewportHeight();
  }

  /**
   * Mobile menu toggle
   */
  function setupMobileMenu() {
    const toggle = document.querySelector('.mobile-menu-toggle');
    const sidebar = document.querySelector('.wiki-sidebar');

    if (!toggle || !sidebar) return;

    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
      const isOpen = sidebar.classList.contains('mobile-open');
      toggle.setAttribute('aria-expanded', isOpen);
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
        sidebar.classList.remove('mobile-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /**
   * Collapsible navigation items
   */
  function setupCollapsibleNav() {
    const toggles = document.querySelectorAll('.nav-toggle');

    toggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
        toggle.setAttribute('aria-expanded', !isExpanded);
      });
    });
  }

  /**
   * Smooth scroll for anchor links
   */
  function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);

        if (target) {
          const headerOffset = 80;
          const elementPosition = target.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      });
    });
  }

  /**
   * Highlight active TOC item on scroll
   */
  function setupTableOfContents() {
    const toc = document.querySelector('.toc-nav');
    if (!toc) return;

    const tocLinks = toc.querySelectorAll('.toc-link');
    const headings = Array.from(tocLinks).map(link => {
      const id = link.getAttribute('href').substring(1);
      return document.getElementById(id);
    }).filter(Boolean);

    if (headings.length === 0) return;

    function updateActiveTocItem() {
      const scrollPosition = window.scrollY + 100;

      let activeHeading = headings[0];
      for (const heading of headings) {
        if (heading.offsetTop <= scrollPosition) {
          activeHeading = heading;
        } else {
          break;
        }
      }

      tocLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === `#${activeHeading.id}`) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }

    window.addEventListener('scroll', debounce(updateActiveTocItem, 100));
    updateActiveTocItem();
  }

  /**
   * Debounce utility
   */
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  /**
   * Setup swipe gestures for mobile sidebar
   */
  function setupMobileSwipeGestures() {
    if (window.innerWidth > 968) return;

    const sidebar = document.querySelector('.wiki-sidebar');
    if (!sidebar) return;

    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;

    // Swipe from left edge to open
    document.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;

      // Only trigger if swipe starts from left edge
      if (touchStartX < 50 && !sidebar.classList.contains('mobile-open')) {
        sidebar.style.transition = 'none';
      }
    }, { passive: true });

    document.addEventListener('touchmove', (e) => {
      if (touchStartX < 50 && !sidebar.classList.contains('mobile-open')) {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchEndX - touchStartX;

        if (diff > 0 && diff < 280) {
          sidebar.style.transform = `translateX(${diff - 280}px)`;
        }
      }
    }, { passive: true });

    document.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      sidebar.style.transition = '';
      sidebar.style.transform = '';

      handleSwipe();
    }, { passive: true });

    // Swipe to close
    sidebar.addEventListener('touchstart', (e) => {
      if (sidebar.classList.contains('mobile-open')) {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      }
    }, { passive: true });

    sidebar.addEventListener('touchend', (e) => {
      if (sidebar.classList.contains('mobile-open')) {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;
        handleSwipe();
      }
    }, { passive: true });

    function handleSwipe() {
      const deltaX = touchEndX - touchStartX;
      const deltaY = touchEndY - touchStartY;

      // Only handle horizontal swipes
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Swipe right to open (from left edge)
        if (deltaX > 100 && touchStartX < 50) {
          sidebar.classList.add('mobile-open');
          document.querySelector('.mobile-menu-toggle')?.setAttribute('aria-expanded', 'true');
        }
        // Swipe left to close
        else if (deltaX < -100 && sidebar.classList.contains('mobile-open')) {
          sidebar.classList.remove('mobile-open');
          document.querySelector('.mobile-menu-toggle')?.setAttribute('aria-expanded', 'false');
        }
      }
    }
  }

  /**
   * Mobile touch optimizations
   */
  function setupMobileTouchOptimizations() {
    if (window.innerWidth > 968) return;

    // Prevent double-tap zoom on buttons
    const buttons = document.querySelectorAll('button, .btn, .link-card');
    buttons.forEach(button => {
      button.addEventListener('touchend', (e) => {
        e.preventDefault();
        button.click();
      }, { passive: false });
    });

    // Add active state for cards on touch
    const cards = document.querySelectorAll('.link-card, .character-card, .quest-card');
    cards.forEach(card => {
      card.addEventListener('touchstart', () => {
        card.style.transform = 'scale(0.98)';
      }, { passive: true });

      card.addEventListener('touchend', () => {
        setTimeout(() => {
          card.style.transform = '';
        }, 200);
      }, { passive: true });
    });

    // Improve scrolling performance
    const scrollElements = document.querySelectorAll('.wiki-content, .wiki-sidebar, .search-results');
    scrollElements.forEach(el => {
      el.style.webkitOverflowScrolling = 'touch';
    });

    // Close mobile menu on link click
    const sidebarLinks = document.querySelectorAll('.wiki-sidebar a');
    sidebarLinks.forEach(link => {
      link.addEventListener('click', () => {
        const sidebar = document.querySelector('.wiki-sidebar');
        if (sidebar && sidebar.classList.contains('mobile-open')) {
          sidebar.classList.remove('mobile-open');
          document.querySelector('.mobile-menu-toggle')?.setAttribute('aria-expanded', 'false');
        }
      });
    });
  }

  /**
   * Fix viewport height for mobile browsers (Safari address bar issue)
   */
  function setupViewportHeight() {
    // Set CSS variable for actual viewport height
    function setViewportHeight() {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    }

    setViewportHeight();
    window.addEventListener('resize', debounce(setViewportHeight, 100));

    // Update on orientation change
    window.addEventListener('orientationchange', () => {
      setTimeout(setViewportHeight, 100);
    });
  }

  // Expose utilities globally if needed
  window.WikiUtils = {
    debounce
  };

})();

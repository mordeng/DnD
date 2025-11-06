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

  // Expose utilities globally if needed
  window.WikiUtils = {
    debounce
  };

})();

/**
 * D&D Campaign Wiki - Navigation & DM Mode
 * Enhanced navigation features and DM mode toggle
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
    setupDMMode();
    setupActiveNavLinks();
  }

  /**
   * DM Mode Toggle
   * Shows/hides DM-only content (spoilers, secrets, etc.)
   */
  function setupDMMode() {
    const toggle = document.querySelector('.dm-mode-toggle');
    if (!toggle) return;

    // Check saved state
    const isDMMode = sessionStorage.getItem('dmMode') === 'true';
    if (isDMMode) {
      enableDMMode();
    }

    toggle.addEventListener('click', () => {
      const isEnabled = document.body.classList.contains('dm-mode');
      if (isEnabled) {
        disableDMMode();
      } else {
        enableDMMode();
      }
    });
  }

  function enableDMMode() {
    document.body.classList.add('dm-mode');
    sessionStorage.setItem('dmMode', 'true');

    // Show DM-only content
    document.querySelectorAll('.dm-only').forEach(el => {
      el.removeAttribute('hidden');
    });

    // Visual feedback
    const toggle = document.querySelector('.dm-mode-toggle');
    if (toggle) {
      toggle.style.background = 'rgba(212, 175, 55, 0.3)';
      toggle.style.borderColor = '#d4af37';
    }
  }

  function disableDMMode() {
    document.body.classList.remove('dm-mode');
    sessionStorage.setItem('dmMode', 'false');

    // Hide DM-only content
    document.querySelectorAll('.dm-only').forEach(el => {
      el.setAttribute('hidden', '');
    });

    // Reset visual feedback
    const toggle = document.querySelector('.dm-mode-toggle');
    if (toggle) {
      toggle.style.background = '';
      toggle.style.borderColor = '';
    }
  }

  /**
   * Highlight active navigation links
   */
  function setupActiveNavLinks() {
    const currentPath = window.location.pathname;

    // Header navigation
    document.querySelectorAll('.header-nav .nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href && (currentPath === href || currentPath.startsWith(href))) {
        link.classList.add('active');
      }
    });

    // Sidebar navigation
    document.querySelectorAll('.wiki-sidebar .nav-link').forEach(link => {
      const href = link.getAttribute('href');
      if (href && currentPath === href) {
        link.classList.add('active');

        // Expand parent menu if exists
        const parent = link.closest('.nav-submenu');
        if (parent) {
          const toggle = parent.previousElementSibling;
          if (toggle && toggle.classList.contains('nav-toggle')) {
            toggle.setAttribute('aria-expanded', 'true');
          }
        }
      }
    });
  }

})();

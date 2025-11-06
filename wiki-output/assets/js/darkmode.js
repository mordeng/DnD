/**
 * D&D Campaign Wiki - Dark Mode Toggle
 * Theme switching with localStorage persistence
 */

(function() {
  'use strict';

  class DarkMode {
    constructor() {
      this.init();
    }

    init() {
      // Check user preference
      const savedTheme = localStorage.getItem('wiki-theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      // Apply saved theme or system preference
      if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        this.enable();
      }

      // Set up toggle button
      const toggle = document.querySelector('.theme-toggle');
      if (toggle) {
        toggle.addEventListener('click', () => this.toggle());
      }

      // Listen for system theme changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('wiki-theme')) {
          if (e.matches) {
            this.enable();
          } else {
            this.disable();
          }
        }
      });
    }

    enable() {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('wiki-theme', 'dark');
    }

    disable() {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('wiki-theme', 'light');
    }

    toggle() {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        this.disable();
      } else {
        this.enable();
      }
    }
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new DarkMode());
  } else {
    new DarkMode();
  }

})();

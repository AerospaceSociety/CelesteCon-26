/**
 * CelesteCon 2026 Event Shell Integration Controller
 * Handles theme synchronization, header interactions, and mobile navigation.
 */
(function() {
  'use strict';

  // Apply saved theme immediately to prevent any flicker
  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    updateThemeIcon(theme);
  }

  function getStoredTheme() {
    var stored = localStorage.getItem('theme');
    if (stored) return stored;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function updateThemeIcon(theme) {
    var btn = document.getElementById('c26-theme-toggle');
    if (!btn) return;
    if (theme === 'light') {
      // Moon icon for switching to dark
      btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';
      btn.setAttribute('aria-label', 'Switch to dark theme');
    } else {
      // Sun icon for switching to light
      btn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"/></svg>';
      btn.setAttribute('aria-label', 'Switch to light theme');
    }
  }

  // Setup interactive listeners when DOM is loaded
  function initShell() {
    var currentTheme = getStoredTheme();
    applyTheme(currentTheme);

    var themeBtn = document.getElementById('c26-theme-toggle');
    if (themeBtn) {
      themeBtn.addEventListener('click', function() {
        var isCurrentlyLight = document.documentElement.getAttribute('data-theme') === 'light';
        var nextTheme = isCurrentlyLight ? 'dark' : 'light';
        localStorage.setItem('theme', nextTheme);
        applyTheme(nextTheme);
      });
    }

    // Register dropdown toggle
    var regToggle = document.getElementById('c26-reg-toggle');
    var regMenu = document.getElementById('c26-reg-menu');
    if (regToggle && regMenu) {
      regToggle.addEventListener('click', function(e) {
        e.stopPropagation();
        var isOpen = regMenu.classList.toggle('open');
        regToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      });

      document.addEventListener('click', function(e) {
        if (!regToggle.contains(e.target) && !regMenu.contains(e.target)) {
          regMenu.classList.remove('open');
          regToggle.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Mobile menu toggle
    var mobileToggle = document.getElementById('c26-mobile-toggle');
    var mobileMenu = document.getElementById('c26-mobile-menu');
    if (mobileToggle && mobileMenu) {
      mobileToggle.addEventListener('click', function() {
        var isHidden = mobileMenu.hasAttribute('hidden');
        if (isHidden) {
          mobileMenu.removeAttribute('hidden');
        } else {
          mobileMenu.setAttribute('hidden', '');
        }
      });
    }

    // Escape key closes menus
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        if (regMenu) {
          regMenu.classList.remove('open');
          if (regToggle) regToggle.setAttribute('aria-expanded', 'false');
        }
        if (mobileMenu && !mobileMenu.hasAttribute('hidden')) {
          mobileMenu.setAttribute('hidden', '');
        }
      }
    });

    // Listen for storage changes from other tabs / the main site
    window.addEventListener('storage', function(e) {
      if (e.key === 'theme') {
        applyTheme(e.newValue || 'dark');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShell);
  } else {
    initShell();
  }
})();

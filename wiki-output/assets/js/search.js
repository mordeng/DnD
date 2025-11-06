/**
 * D&D Campaign Wiki - Search Functionality
 * Client-side search using search index
 */

(function() {
  'use strict';

  let searchIndex = null;
  let searchData = null;

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  async function init() {
    // Load search index
    try {
      const response = await fetch('/search-index.json');
      searchData = await response.json();
      console.log('✓ Search index loaded:', searchData.documents.length, 'documents');
    } catch (error) {
      console.error('Failed to load search index:', error);
      return;
    }

    setupSearchUI();
  }

  /**
   * Setup search UI and event listeners
   */
  function setupSearchUI() {
    const searchToggle = document.querySelector('.header-search-toggle');
    const mobileSearchBtn = document.querySelector('.sidebar-search-btn');
    const searchOverlay = document.querySelector('.search-overlay');
    const searchInput = document.querySelector('.search-input');
    const searchClose = document.querySelector('.search-close');
    const searchResults = document.querySelector('.search-results');

    if (!searchToggle || !searchOverlay || !searchInput) return;

    // Open search modal
    function openSearch() {
      searchOverlay.removeAttribute('hidden');
      searchInput.focus();
    }

    // Close search modal
    function closeSearch() {
      searchOverlay.setAttribute('hidden', '');
      searchInput.value = '';
      searchResults.innerHTML = '';
    }

    // Event listeners
    searchToggle.addEventListener('click', openSearch);
    if (mobileSearchBtn) {
      mobileSearchBtn.addEventListener('click', openSearch);
    }

    if (searchClose) {
      searchClose.addEventListener('click', closeSearch);
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !searchOverlay.hasAttribute('hidden')) {
        closeSearch();
      }
    });

    // Close on overlay click
    searchOverlay.addEventListener('click', (e) => {
      if (e.target === searchOverlay) {
        closeSearch();
      }
    });

    // Keyboard shortcut (Cmd/Ctrl + K)
    document.addEventListener('keydown', (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        openSearch();
      }
    });

    // Search as you type
    searchInput.addEventListener('input', debounce((e) => {
      performSearch(e.target.value);
    }, 300));
  }

  /**
   * Perform search
   */
  function performSearch(query) {
    const searchResults = document.querySelector('.search-results');
    const searchEmpty = document.querySelector('.search-empty');
    const searchQuery = document.querySelector('.search-query');

    if (!query || query.length < 2) {
      searchResults.innerHTML = '';
      searchEmpty.setAttribute('hidden', '');
      return;
    }

    // Simple fuzzy search
    const results = fuzzySearch(query, searchData.documents);

    if (results.length === 0) {
      searchResults.innerHTML = '';
      searchEmpty.removeAttribute('hidden');
      if (searchQuery) searchQuery.textContent = query;
      return;
    }

    // Group results by type
    const grouped = groupByType(results);

    // Render results
    renderSearchResults(grouped, query);
    searchEmpty.setAttribute('hidden', '');
  }

  /**
   * Simple fuzzy search implementation
   */
  function fuzzySearch(query, documents) {
    const lowerQuery = query.toLowerCase();
    const results = [];

    for (const doc of documents) {
      let score = 0;

      // Search in title (highest weight)
      if (doc.title.toLowerCase().includes(lowerQuery)) {
        score += 10;
      }

      // Search in tags
      if (doc.tags && doc.tags.toLowerCase().includes(lowerQuery)) {
        score += 5;
      }

      // Search in content
      if (doc.content && doc.content.toLowerCase().includes(lowerQuery)) {
        score += 2;
      }

      // Search in excerpt
      if (doc.excerpt && doc.excerpt.toLowerCase().includes(lowerQuery)) {
        score += 3;
      }

      if (score > 0) {
        results.push({ ...doc, score });
      }
    }

    // Sort by score (descending)
    return results.sort((a, b) => b.score - a.score);
  }

  /**
   * Group results by type
   */
  function groupByType(results) {
    const groups = {};

    for (const result of results) {
      const type = result.type;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(result);
    }

    return groups;
  }

  /**
   * Render search results
   */
  function renderSearchResults(grouped, query) {
    const container = document.querySelector('.search-results');
    container.innerHTML = '';

    const typeLabels = {
      'characters': 'Charaktere',
      'sessions': 'Sessions',
      'locations': 'Orte',
      'quests': 'Quests',
      'items': 'Items',
      'factions': 'Fraktionen',
      'general': 'Allgemein'
    };

    const typeIcons = {
      'characters': '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 18v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2"/><circle cx="10" cy="5" r="4"/></svg>',
      'sessions': '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 2h12a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2z"/></svg>',
      'locations': '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 2a7 7 0 017 7c0 5-7 11-7 11S3 14 3 9a7 7 0 017-7z"/><circle cx="10" cy="9" r="2"/></svg>',
      'quests': '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10" cy="10" r="8"/><line x1="14" y1="6" x2="6" y2="14"/></svg>',
      'items': '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><polygon points="10,2 2,7 2,13 10,18 18,13 18,7"/></svg>',
      'factions': '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 2l8 4v6c0 4-8 8-8 8s-8-4-8-8V6l8-4z"/></svg>',
      'general': '<svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10" cy="10" r="8"/></svg>'
    };

    for (const [type, results] of Object.entries(grouped)) {
      const groupDiv = document.createElement('div');
      groupDiv.className = 'search-result-group';

      const title = document.createElement('h4');
      title.className = 'search-group-title';
      title.textContent = `${typeLabels[type] || type} (${results.length})`;
      groupDiv.appendChild(title);

      // Show top 5 results per type
      for (const result of results.slice(0, 5)) {
        const resultLink = document.createElement('a');
        resultLink.href = result.url;
        resultLink.className = 'search-result';

        const icon = document.createElement('div');
        icon.className = 'search-result-icon';
        icon.innerHTML = typeIcons[type] || typeIcons.general;
        resultLink.appendChild(icon);

        const content = document.createElement('div');
        content.className = 'search-result-content';

        const resultTitle = document.createElement('h5');
        resultTitle.className = 'search-result-title';
        resultTitle.innerHTML = highlight(result.title, query);
        content.appendChild(resultTitle);

        const excerpt = document.createElement('p');
        excerpt.className = 'search-result-excerpt';
        excerpt.innerHTML = highlight(result.excerpt || '', query);
        content.appendChild(excerpt);

        const meta = document.createElement('span');
        meta.className = 'search-result-meta';
        meta.textContent = typeLabels[type] || type;
        content.appendChild(meta);

        resultLink.appendChild(content);
        groupDiv.appendChild(resultLink);
      }

      container.appendChild(groupDiv);
    }
  }

  /**
   * Highlight query in text
   */
  function highlight(text, query) {
    if (!text || !query) return text;

    const regex = new RegExp(`(${escapeRegex(query)})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  /**
   * Escape regex special characters
   */
  function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
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

})();

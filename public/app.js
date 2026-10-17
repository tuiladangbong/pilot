// ==========================================================================
// YELLOW PAGES — FRONTEND INTERACTION & DIRECTORY ENGINE
// ==========================================================================

import {
  TOP_PICKS,
  LATEST_LISTINGS,
  FREE_THIS_WEEK,
  DIRECTORY_CATEGORIES,
  EDITORIAL_ARTICLES
} from './data/catalogData.js';

// Application State
const state = {
  searchQuery: '',
  activeCategory: 'all',
  activeLetter: null,
  activeSort: 'popular',
  filters: {
    category: 'all',
    pricing: 'all',
    platform: 'all',
    openSource: false,
  },
  isCurator: false,
  apiTools: [],
  allDirectoryTools: [],
  visitorFavorites: new Set(),
  selectedTool: null,
};

// DOM Elements
const el = {
  // Search & Navigation
  searchInput: document.getElementById('search-input'),
  categoryTabs: document.getElementById('category-tabs'),
  azLetters: document.getElementById('az-letters'),
  azClearBtn: document.getElementById('az-clear-btn'),
  
  // Sort & Filters
  sortGroup: document.getElementById('sort-group'),
  filterCategory: document.getElementById('filter-category'),
  filterPricing: document.getElementById('filter-pricing'),
  filterPlatform: document.getElementById('filter-platform'),
  filterOpenSource: document.getElementById('filter-opensource'),
  filterResetBtn: document.getElementById('filter-reset-btn'),
  filterActiveIndicator: document.getElementById('filter-active-indicator'),
  filterActiveText: document.getElementById('filter-active-text'),
  clearSearchBtn: document.getElementById('clear-search-btn'),
  
  // Containers
  topPicksSection: document.getElementById('top-picks-section'),
  topPicksContainer: document.getElementById('top-picks-container'),
  latestListingsContainer: document.getElementById('latest-listings-container'),
  freeThisWeekContainer: document.getElementById('free-this-week-container'),
  mainDirectoryGrid: document.getElementById('main-directory-grid'),
  searchResultsSection: document.getElementById('search-results-section'),
  searchResultsGrid: document.getElementById('search-results-grid'),
  searchResultsDesc: document.getElementById('search-results-desc'),
  btnSeeTopPicks: document.getElementById('btn-see-top-picks'),
  
  // Modals & Dialogs
  toolDetailDialog: document.getElementById('tool-detail-dialog'),
  modalCloseBtn: document.getElementById('modal-close-btn'),
  modalToolLogo: document.getElementById('modal-tool-logo'),
  modalToolName: document.getElementById('modal-tool-name'),
  modalToolHostname: document.getElementById('modal-tool-hostname'),
  modalToolCategory: document.getElementById('modal-tool-category'),
  modalToolDesc: document.getElementById('modal-tool-desc'),
  modalToolPricing: document.getElementById('modal-tool-pricing'),
  modalToolPlatforms: document.getElementById('modal-tool-platforms'),
  modalToolVerified: document.getElementById('modal-tool-verified'),
  modalToolFeatured: document.getElementById('modal-tool-featured'),
  modalToolOpenSource: document.getElementById('modal-tool-opensource'),
  modalVisitLink: document.getElementById('modal-visit-link'),
  modalCopyLinkBtn: document.getElementById('modal-copy-link-btn'),
  modalFavoriteBtn: document.getElementById('modal-favorite-btn'),
  modalCuratorFeatureBtn: document.getElementById('modal-curator-feature-btn'),
  modalCuratorEditBtn: document.getElementById('modal-curator-edit-btn'),
  modalCuratorDeleteBtn: document.getElementById('modal-curator-delete-btn'),

  // Curator Elements
  curatorPill: document.getElementById('curator-pill'),
  curatorExitBtn: document.getElementById('curator-exit-btn'),
  curatorAuthDialog: document.getElementById('curator-auth-dialog'),
  curatorAuthForm: document.getElementById('curator-auth-form'),
  curatorKeyInput: document.getElementById('curator-key-input'),
  curatorModalClose: document.getElementById('curator-modal-close'),
  curatorCancelBtn: document.getElementById('curator-cancel-btn'),
  footerCuratorBtn: document.getElementById('footer-curator-btn'),
  openCuratorLink: document.getElementById('open-curator-link'),
  curatorAddToolBtn: document.getElementById('curator-add-tool-btn'),
};

// ==========================================================================
// INITIALIZATION
// ==========================================================================

async function init() {
  // 1. Load visitor favorites from local storage
  try {
    const saved = localStorage.getItem('pilot_visitor_favorites');
    if (saved) {
      state.visitorFavorites = new Set(JSON.parse(saved));
    }
  } catch (err) {
    console.warn('Could not read visitor favorites:', err);
  }

  // 2. Aggregate all directory tools for universal search and indexing
  aggregateDirectoryTools();

  // 3. Render initial sections from structured data
  renderTopPicks();
  renderLatestListings();
  renderFreeThisWeek();
  renderAllCategories();

  // 4. Attach event listeners
  attachEventListeners();

  // 5. Fetch API catalog in background to augment local tools
  fetchApiCatalog();

  // 6. Check curator status and route
  checkCuratorStatus();
  if (window.location.pathname.startsWith('/admin') || window.location.hash === '#admin') {
    if (!state.isCurator) {
      el.curatorAuthDialog?.showModal();
    }
  }
}

function aggregateDirectoryTools() {
  const map = new Map();

  // Add category tools
  DIRECTORY_CATEGORIES.forEach(cat => {
    cat.tools.forEach(tool => {
      map.set(tool.slug || tool.id, { ...tool, category: cat.id });
    });
  });

  // Add top picks
  TOP_PICKS.forEach(tool => {
    map.set(tool.slug || tool.id, { ...tool });
  });

  // Add latest
  LATEST_LISTINGS.forEach(tool => {
    map.set(tool.slug || tool.id, { ...tool });
  });

  // Add free this week
  FREE_THIS_WEEK.forEach(tool => {
    map.set(tool.slug || tool.id, { ...tool });
  });

  state.allDirectoryTools = Array.from(map.values());
}

// ==========================================================================
// RENDERING FUNCTIONS
// ==========================================================================

function createBrandLogoHtml(tool, size = 24) {
  const color = tool.color || '#111111';
  const initials = tool.initials || (tool.name ? tool.name.substring(0, 2).toUpperCase() : 'YP');
  
  // Favicon fallback via Google / DuckDuckGo if website is available
  let faviconHtml = '';
  if (tool.website) {
    try {
      const hostname = new URL(tool.website).hostname;
      const faviconUrl = `https://icons.duckduckgo.com/ip3/${hostname}.ico`;
      return `
        <div class="${size > 30 ? 'tool-brand-logo' : 'tool-mini-logo'}" style="background-color: ${color};">
          <img src="${faviconUrl}" alt="${escapeHtml(tool.name)}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
          <span style="display: none;">${escapeHtml(initials)}</span>
        </div>
      `;
    } catch (e) {}
  }

  return `
    <div class="${size > 30 ? 'tool-brand-logo' : 'tool-mini-logo'}" style="background-color: ${color};">
      <span>${escapeHtml(initials)}</span>
    </div>
  `;
}

function renderTopPicks() {
  if (!el.topPicksContainer) return;
  el.topPicksContainer.innerHTML = TOP_PICKS.map(tool => {
    return `
      <div class="ranked-pick-row" data-tool-id="${escapeHtml(tool.id)}" data-slug="${escapeHtml(tool.slug)}">
        <div class="rank-indicator">${tool.rank || 1}</div>
        ${createBrandLogoHtml(tool, 38)}
        <div class="ranked-info">
          <div class="ranked-title-row">
            <span class="ranked-name">${escapeHtml(tool.name)}</span>
            <span class="ranked-meta">${escapeHtml(tool.pricingLabel)} | ${escapeHtml(tool.displayUrl || '')}</span>
          </div>
          <div class="ranked-desc">${escapeHtml(tool.description)}</div>
        </div>
      </div>
    `;
  }).join('');
}

function renderLatestListings() {
  if (!el.latestListingsContainer) return;
  el.latestListingsContainer.innerHTML = LATEST_LISTINGS.map(tool => {
    return `
      <div class="sidebar-tool-row" data-tool-id="${escapeHtml(tool.id)}" data-slug="${escapeHtml(tool.slug)}">
        ${createBrandLogoHtml(tool, 24)}
        <div class="tool-info">
          <div class="tool-name-line">
            <span class="tool-name">${escapeHtml(tool.name)}</span>
          </div>
          <div class="tool-desc">${escapeHtml(tool.description)}</div>
          <div class="tool-meta">${escapeHtml(tool.pricingLabel)} | ${escapeHtml(tool.displayUrl || '')}</div>
        </div>
      </div>
    `;
  }).join('');
}

function renderFreeThisWeek() {
  if (!el.freeThisWeekContainer) return;
  el.freeThisWeekContainer.innerHTML = FREE_THIS_WEEK.map(tool => {
    return `
      <div class="sidebar-tool-row" data-tool-id="${escapeHtml(tool.id)}" data-slug="${escapeHtml(tool.slug)}">
        ${createBrandLogoHtml(tool, 24)}
        <div class="tool-info">
          <div class="tool-name-line">
            <span class="tool-name">${escapeHtml(tool.name)}</span>
          </div>
          <div class="tool-desc">${escapeHtml(tool.description)}</div>
          ${tool.promoText ? `<div class="sidebar-promo-callout">${escapeHtml(tool.promoText)}</div>` : ''}
          <div class="tool-meta">${escapeHtml(tool.pricingLabel)} | ${escapeHtml(tool.displayUrl || '')}</div>
        </div>
      </div>
    `;
  }).join('');
}

function renderAllCategories() {
  DIRECTORY_CATEGORIES.forEach(cat => {
    const container = document.getElementById(`cat-list-${cat.id}`);
    if (!container) return;

    container.innerHTML = cat.tools.map(tool => {
      return `
        <div class="tool-row-item" data-tool-id="${escapeHtml(tool.id)}" data-slug="${escapeHtml(tool.slug)}" data-category="${escapeHtml(cat.id)}">
          ${createBrandLogoHtml(tool, 24)}
          <div class="tool-info">
            <div class="tool-name-line">
              <span class="tool-name">${escapeHtml(tool.name)}</span>
            </div>
            <div class="tool-desc">${escapeHtml(tool.description)}</div>
            <div class="tool-meta">${escapeHtml(tool.pricingLabel)} | ${escapeHtml(tool.displayUrl || '')}</div>
          </div>
        </div>
      `;
    }).join('');
  });
}

// ==========================================================================
// SEARCH, FILTERING & DYNAMIC MATCHING
// ==========================================================================

function applyFilters() {
  const hasSearch = state.searchQuery.trim().length > 0;
  const hasLetter = state.activeLetter !== null;
  const hasCategory = state.activeCategory !== 'all';
  const hasPricing = state.filters.pricing !== 'all';
  const hasPlatform = state.filters.platform !== 'all';
  const hasOpenSource = state.filters.openSource === true;

  const isFiltering = hasSearch || hasLetter || hasCategory || hasPricing || hasPlatform || hasOpenSource;

  if (!isFiltering) {
    // Show standard newspaper directory view
    el.searchResultsSection?.classList.add('hidden');
    el.mainDirectoryGrid?.classList.remove('hidden');
    el.topPicksSection?.classList.remove('hidden');
    el.filterActiveIndicator?.classList.add('hidden');
    return;
  }

  // Active filter state: show search results view
  el.searchResultsSection?.classList.remove('hidden');
  el.mainDirectoryGrid?.classList.add('hidden');
  el.topPicksSection?.classList.add('hidden');
  el.filterActiveIndicator?.classList.remove('hidden');

  // Filter combined pool of tools
  let results = [...state.allDirectoryTools];

  if (hasSearch) {
    const q = state.searchQuery.toLowerCase();
    results = results.filter(t => {
      const name = (t.name || '').toLowerCase();
      const desc = (t.description || '').toLowerCase();
      const cat = (t.category || '').toLowerCase();
      return name.includes(q) || desc.includes(q) || cat.includes(q);
    });
  }

  if (hasLetter) {
    const l = state.activeLetter.toUpperCase();
    results = results.filter(t => (t.name || '').toUpperCase().startsWith(l));
  }

  if (hasCategory) {
    results = results.filter(t => (t.category || '').toLowerCase() === state.activeCategory.toLowerCase());
  }

  if (hasPricing) {
    results = results.filter(t => (t.pricingType || '').toLowerCase() === state.filters.pricing.toLowerCase());
  }

  if (hasPlatform) {
    results = results.filter(t => Array.isArray(t.platforms) && t.platforms.some(p => p.toLowerCase().includes(state.filters.platform.toLowerCase())));
  }

  if (hasOpenSource) {
    results = results.filter(t => t.openSource === true);
  }

  // Sorting
  results = sortTools(results, state.activeSort);

  // Update indicators
  if (el.filterActiveText) {
    const terms = [];
    if (hasSearch) terms.push(`"${state.searchQuery}"`);
    if (hasLetter) terms.push(`Letter '${state.activeLetter}'`);
    if (hasCategory) terms.push(`Category: ${state.activeCategory.toUpperCase()}`);
    if (hasPricing) terms.push(`Pricing: ${state.filters.pricing}`);
    if (hasOpenSource) terms.push(`Open Source`);
    el.filterActiveText.textContent = `Showing ${results.length} tools matching ${terms.join(', ')}`;
  }

  if (el.searchResultsDesc) {
    el.searchResultsDesc.textContent = `Found ${results.length} verified listings`;
  }

  // Render cards
  if (el.searchResultsGrid) {
    if (results.length === 0) {
      el.searchResultsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 24px; text-align: center; border: 1.5px dashed var(--border-dark);">
          <p style="font-family: var(--font-headline); font-size: 16px; margin-bottom: 6px;">No tools found matching your criteria</p>
          <p style="font-size: 12px; color: var(--ink-secondary);">Try clearing some filters or searching for broader terms like "design", "coding", or "AI".</p>
        </div>
      `;
    } else {
      el.searchResultsGrid.innerHTML = results.map(tool => {
        return `
          <div class="search-result-card" data-tool-id="${escapeHtml(tool.id)}" data-slug="${escapeHtml(tool.slug)}">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              ${createBrandLogoHtml(tool, 26)}
              <div style="min-width: 0;">
                <div style="font-family: var(--font-directory); font-weight: 700; font-size: 13.5px; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                  ${escapeHtml(tool.name)}
                </div>
                <div style="font-size: 10px; color: var(--ink-muted); text-transform: uppercase;">
                  ${escapeHtml(tool.category || '')}
                </div>
              </div>
            </div>
            <p style="font-family: var(--font-directory); font-size: 11.5px; line-height: 1.25; color: var(--ink-secondary); margin-bottom: 6px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
              ${escapeHtml(tool.description)}
            </p>
            <div style="display: flex; justify-content: space-between; font-size: 10px; color: var(--ink-muted); border-top: 1px solid var(--border-subtle); padding-top: 4px;">
              <span>${escapeHtml(tool.pricingLabel || '')}</span>
              <span>${escapeHtml(tool.displayUrl || '')}</span>
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

function sortTools(tools, sortMode) {
  const sorted = [...tools];
  switch (sortMode) {
    case 'az':
      return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    case 'newest':
      return sorted.reverse();
    case 'free-first':
      return sorted.sort((a, b) => {
        const aFree = a.pricingType === 'free' ? 0 : 1;
        const bFree = b.pricingType === 'free' ? 0 : 1;
        return aFree - bFree;
      });
    case 'price-asc':
      return sorted.sort((a, b) => (a.pricingType === 'free' ? -1 : 1));
    case 'price-desc':
      return sorted.sort((a, b) => (a.pricingType === 'paid' ? -1 : 1));
    case 'popular':
    default:
      return sorted.sort((a, b) => (a.rank || 99) - (b.rank || 99));
  }
}

// ==========================================================================
// BACKGROUND API SYNC
// ==========================================================================

async function fetchApiCatalog() {
  try {
    const res = await fetch('/api/resources?limit=250');
    if (!res.ok) return;
    const json = await res.json();
    if (Array.isArray(json.data)) {
      state.apiTools = json.data.map(item => {
        return {
          id: item.id,
          name: item.title,
          slug: item.slug || item.id,
          description: item.description || '',
          category: (item.tools?.category || item.type || 'ai').toLowerCase(),
          pricingLabel: item.tools?.pricing || 'Unknown',
          pricingType: normalizePricing(item.tools?.pricing),
          website: item.tools?.url || '',
          displayUrl: item.tools?.hostname || '',
          platforms: ['Web'],
          openSource: (item.tags || []).some(t => t.name === 'open-source' || t.name === 'open source'),
          featured: Boolean(item.featured),
        };
      });

      // Merge unique items from API into allDirectoryTools
      const existingSlugs = new Set(state.allDirectoryTools.map(t => t.slug));
      state.apiTools.forEach(t => {
        if (!existingSlugs.has(t.slug)) {
          state.allDirectoryTools.push(t);
        }
      });
    }
  } catch (err) {
    console.warn('API background fetch skipped:', err.message);
  }
}

function normalizePricing(pricing) {
  if (!pricing) return 'freemium';
  const p = pricing.toLowerCase();
  if (p.includes('free') && !p.includes('$')) return 'free';
  if (p.includes('$') || p.includes('paid')) return 'paid';
  return 'freemium';
}

// ==========================================================================
// EVENT LISTENERS & INTERACTIONS
// ==========================================================================

function attachEventListeners() {
  // 1. Search Input
  let debounceTimer;
  el.searchInput?.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      state.searchQuery = e.target.value;
      applyFilters();
    }, 120);
  });

  // 2. Clear search button
  el.clearSearchBtn?.addEventListener('click', () => {
    resetAllFilters();
  });

  // 3. Category Tabs
  el.categoryTabs?.addEventListener('click', (e) => {
    const btn = e.target.closest('.cat-tab');
    if (!btn) return;
    const cat = btn.dataset.category;
    
    // Update active tab style
    document.querySelectorAll('.cat-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    state.activeCategory = cat;
    if (el.filterCategory) el.filterCategory.value = cat;
    applyFilters();
  });

  // 4. A-Z Letters
  el.azLetters?.addEventListener('click', (e) => {
    const btn = e.target.closest('.az-btn');
    if (!btn) return;
    const letter = btn.dataset.letter;

    if (state.activeLetter === letter) {
      state.activeLetter = null;
      btn.classList.remove('active');
    } else {
      document.querySelectorAll('.az-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.activeLetter = letter;
    }
    applyFilters();
  });

  el.azClearBtn?.addEventListener('click', () => {
    state.activeLetter = null;
    document.querySelectorAll('.az-btn').forEach(b => b.classList.remove('active'));
    applyFilters();
  });

  // 5. Sort Group
  el.sortGroup?.addEventListener('click', (e) => {
    const btn = e.target.closest('.sort-btn');
    if (!btn) return;
    document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.activeSort = btn.dataset.sort;
    applyFilters();
  });

  // 6. Filter Selects & Checkboxes
  el.filterCategory?.addEventListener('change', (e) => {
    state.activeCategory = e.target.value;
    document.querySelectorAll('.cat-tab').forEach(b => {
      b.classList.toggle('active', b.dataset.category === state.activeCategory);
    });
    applyFilters();
  });

  el.filterPricing?.addEventListener('change', (e) => {
    state.filters.pricing = e.target.value;
    applyFilters();
  });

  el.filterPlatform?.addEventListener('change', (e) => {
    state.filters.platform = e.target.value;
    applyFilters();
  });

  el.filterOpenSource?.addEventListener('change', (e) => {
    state.filters.openSource = e.target.checked;
    applyFilters();
  });

  // 7. Reset Button
  el.filterResetBtn?.addEventListener('click', () => {
    resetAllFilters();
  });

  // 8. "SEE ALL TOP PICKS" CTA
  el.btnSeeTopPicks?.addEventListener('click', () => {
    state.searchQuery = '';
    state.activeCategory = 'all';
    state.filters.pricing = 'all';
    state.filters.platform = 'all';
    state.filters.openSource = false;
    state.activeSort = 'popular';
    applyFilters();
    window.scrollTo({ top: el.topPicksSection.offsetTop - 20, behavior: 'smooth' });
  });

  // 9. Tool Clicks -> Open Detail Modal
  document.addEventListener('click', (e) => {
    const row = e.target.closest('[data-tool-id]');
    if (!row) return;
    const toolId = row.dataset.toolId;
    const slug = row.dataset.slug;
    const tool = state.allDirectoryTools.find(t => t.id === toolId || t.slug === slug);
    if (tool) {
      openToolModal(tool);
    }
  });

  // 10. Dialog Close Button
  el.modalCloseBtn?.addEventListener('click', () => {
    el.toolDetailDialog?.close();
  });

  // 11. Copy Link Button in Modal
  el.modalCopyLinkBtn?.addEventListener('click', () => {
    if (!state.selectedTool) return;
    const url = state.selectedTool.website || window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      el.modalCopyLinkBtn.textContent = 'COPIED!';
      setTimeout(() => el.modalCopyLinkBtn.textContent = 'COPY LINK', 1500);
    });
  });

  // 12. Bookmark / Favorite Button in Modal
  el.modalFavoriteBtn?.addEventListener('click', () => {
    if (!state.selectedTool) return;
    const id = state.selectedTool.id;
    if (state.visitorFavorites.has(id)) {
      state.visitorFavorites.delete(id);
      el.modalFavoriteBtn.textContent = '★ BOOKMARK';
    } else {
      state.visitorFavorites.add(id);
      el.modalFavoriteBtn.textContent = '★ BOOKMARKED';
    }
    localStorage.setItem('pilot_visitor_favorites', JSON.stringify(Array.from(state.visitorFavorites)));
  });

  // 13. Curator Auth Dialog Handlers
  el.footerCuratorBtn?.addEventListener('click', () => {
    el.curatorAuthDialog?.showModal();
  });

  el.openCuratorLink?.addEventListener('click', (e) => {
    e.preventDefault();
    el.curatorAuthDialog?.showModal();
  });

  el.curatorModalClose?.addEventListener('click', () => {
    el.curatorAuthDialog?.close();
  });

  el.curatorCancelBtn?.addEventListener('click', () => {
    el.curatorAuthDialog?.close();
  });

  el.curatorAuthForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const key = el.curatorKeyInput?.value.trim();
    if (!key) return;

    try {
      const res = await fetch('/api/curator/status', {
        headers: { 'X-Curator-Key': key }
      });
      const data = await res.json();
      if (data.isCurator) {
        localStorage.setItem('pilot_curator_key', key);
        state.isCurator = true;
        updateCuratorUI();
        el.curatorAuthDialog?.close();
        alert('Curator mode unlocked!');
      } else {
        alert('Invalid curator key. Please check your key.');
      }
    } catch (err) {
      alert('Authentication request failed: ' + err.message);
    }
  });

  el.curatorExitBtn?.addEventListener('click', () => {
    localStorage.removeItem('pilot_curator_key');
    state.isCurator = false;
    updateCuratorUI();
  });
}

function resetAllFilters() {
  state.searchQuery = '';
  state.activeCategory = 'all';
  state.activeLetter = null;
  state.activeSort = 'popular';
  state.filters = { category: 'all', pricing: 'all', platform: 'all', openSource: false };

  if (el.searchInput) el.searchInput.value = '';
  if (el.filterCategory) el.filterCategory.value = 'all';
  if (el.filterPricing) el.filterPricing.value = 'all';
  if (el.filterPlatform) el.filterPlatform.value = 'all';
  if (el.filterOpenSource) el.filterOpenSource.checked = false;

  document.querySelectorAll('.cat-tab').forEach(b => b.classList.toggle('active', b.dataset.category === 'all'));
  document.querySelectorAll('.az-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.sort-btn').forEach(b => b.classList.toggle('active', b.dataset.sort === 'popular'));

  applyFilters();
}

function openToolModal(tool) {
  state.selectedTool = tool;
  if (!el.toolDetailDialog) return;

  if (el.modalToolName) el.modalToolName.textContent = tool.name;
  if (el.modalToolDesc) el.modalToolDesc.textContent = tool.description;
  if (el.modalToolHostname) el.modalToolHostname.textContent = tool.displayUrl || (tool.website ? new URL(tool.website).hostname : '');
  if (el.modalToolCategory) el.modalToolCategory.textContent = (tool.category || 'TOOL').toUpperCase();
  if (el.modalToolPricing) el.modalToolPricing.textContent = tool.pricingLabel || 'Freemium';
  if (el.modalToolPlatforms) el.modalToolPlatforms.textContent = Array.isArray(tool.platforms) ? tool.platforms.join(', ') : 'Web';
  if (el.modalToolVerified) el.modalToolVerified.textContent = 'Verified Active (2026)';

  if (el.modalToolFeatured) {
    el.modalToolFeatured.classList.toggle('hidden', !tool.featured);
  }
  if (el.modalToolOpenSource) {
    el.modalToolOpenSource.classList.toggle('hidden', !tool.openSource);
  }

  if (el.modalToolLogo) {
    el.modalToolLogo.innerHTML = createBrandLogoHtml(tool, 44);
  }

  if (el.modalVisitLink) {
    el.modalVisitLink.href = tool.website || '#';
  }

  if (el.modalFavoriteBtn) {
    const isFav = state.visitorFavorites.has(tool.id);
    el.modalFavoriteBtn.textContent = isFav ? '★ BOOKMARKED' : '★ BOOKMARK';
  }

  el.toolDetailDialog.showModal();
}

// ==========================================================================
// CURATOR STATUS & CONTROLS
// ==========================================================================

async function checkCuratorStatus() {
  const storedKey = localStorage.getItem('pilot_curator_key');
  const headers = {};
  if (storedKey) headers['X-Curator-Key'] = storedKey;

  try {
    const res = await fetch('/api/curator/status', { headers });
    if (res.ok) {
      const data = await res.json();
      state.isCurator = Boolean(data.isCurator);
      updateCuratorUI();
    }
  } catch (err) {
    console.warn('Curator status check failed:', err);
  }
}

function updateCuratorUI() {
  if (el.curatorPill) {
    el.curatorPill.classList.toggle('hidden', !state.isCurator);
  }
  document.querySelectorAll('.curator-only').forEach(elem => {
    elem.classList.toggle('hidden', !state.isCurator);
  });
}

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Boot application when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

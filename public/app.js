// ==========================================================================
// HUMAN AFTER ALL! — FRONTEND DIRECTORY ENGINE & INTERACTION
// ==========================================================================

import {
  TOP_PICKS,
  LATEST_LISTINGS,
  FREE_THIS_WEEK,
  DIRECTORY_CATEGORIES,
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
  allDirectoryTools: [],
  categoryCounts: {
    ai: 0,
    code: 0,
    design: 0,
    automation: 0,
    video: 0,
    audio: 0,
    hosting: 0,
    productivity: 0,
  },
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
  tickerBar: document.querySelector('.retro-ticker-bar'),

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

  // 2. Aggregate initial static dataset (immediate render without layout shift)
  aggregateInitialTools();

  // 3. Render initial sections from structured data
  renderTopPicks();
  renderLatestListings();
  renderFreeThisWeek();
  renderAllCategories();
  updateCategoryCounts();

  // 4. Attach all event listeners
  attachEventListeners();

  // 5. Fetch full live API catalog to populate all 213+ verified tools & websites
  await fetchLiveCatalog();

  // 6. Check curator status and route
  checkCuratorStatus();
  if (window.location.pathname.startsWith('/admin') || window.location.hash === '#admin') {
    if (!state.isCurator) {
      el.curatorAuthDialog?.showModal();
    }
  }
}

function aggregateInitialTools() {
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
// LIVE CATALOG FETCHING & NORMALIZATION
// ==========================================================================

async function fetchLiveCatalog() {
  try {
    const res = await fetch('/api/tools?limit=500');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();

    if (Array.isArray(json.data) && json.data.length > 0) {
      const dbTools = json.data.map(item => {
        const tags = Array.isArray(item.tags)
          ? item.tags.map(t => (typeof t === 'string' ? t : (t.name || '')))
          : [];
        const dirCategory = mapToDirectoryCategory(item.category, item.type, tags);
        const pricingLabel = item.pricing || 'Freemium';
        const pricingType = normalizePricing(pricingLabel);
        const website = item.url || '';
        let displayUrl = item.hostname || '';
        if (!displayUrl && website) {
          try {
            displayUrl = new URL(website).hostname.replace(/^www\./, '');
          } catch (e) {}
        }
        const isOpenSource =
          pricingType === 'open-source' ||
          tags.some(t => {
            const s = t.toLowerCase();
            return s.includes('open-source') || s.includes('open source');
          });

        return {
          id: item.id,
          name: item.title,
          slug: item.slug || item.id,
          description: item.description || '',
          category: dirCategory,
          rawCategory: item.category || 'AI',
          pricingLabel,
          pricingType,
          website,
          displayUrl,
          platforms: ['Web'],
          openSource: isOpenSource,
          featured: Boolean(item.featured),
          tags,
          color: getItemBrandColor(item.title, dirCategory),
          initials: getItemInitials(item.title),
          provider: item.provider || '',
          verifiedAt: item.verifiedAt || '2026',
        };
      });

      // Merge unique items from API with any custom curated tools
      const dbSlugs = new Set(dbTools.map(t => t.slug));
      const additional = state.allDirectoryTools.filter(t => !dbSlugs.has(t.slug));
      state.allDirectoryTools = [...dbTools, ...additional];

      // Refresh category columns and counts
      renderAllCategories();
      updateCategoryCounts();
      updateTickerCount();

      // If user had already applied a search or filter, re-run with live data
      if (
        state.searchQuery ||
        state.activeCategory !== 'all' ||
        state.activeLetter !== null ||
        state.activeSort !== 'popular' ||
        state.filters.pricing !== 'all' ||
        state.filters.openSource
      ) {
        applyFilters();
      }
    }
  } catch (err) {
    console.warn('API catalog fetch fallback to static dataset:', err.message);
  }
}

function mapToDirectoryCategory(catStr, type = '', tags = []) {
  if (!catStr && type) {
    if (type === 'prompt') return 'ai';
    if (type === 'workflow') return 'automation';
    if (type === 'agent') return 'automation';
  }
  const s = String(catStr || '').toLowerCase();
  const tagList = Array.isArray(tags)
    ? tags.map(t => String(typeof t === 'string' ? t : (t.name || '')).toLowerCase())
    : [];

  if (s.includes('video') || tagList.some(t => t.includes('video'))) return 'video';
  if (
    s.includes('audio') ||
    s.includes('voice') ||
    s.includes('speech') ||
    s.includes('music') ||
    tagList.some(t => t.includes('audio') || t.includes('speech'))
  )
    return 'audio';
  if (
    s.includes('design') ||
    s.includes('image') ||
    s.includes('presentation') ||
    s.includes('3d') ||
    s.includes('canvas') ||
    tagList.some(t => t.includes('design') || t.includes('image-generation'))
  )
    return 'design';
  if (
    s.includes('coding') ||
    s.includes('code') ||
    s.includes('developer') ||
    s.includes('builder') ||
    s.includes('mcp') ||
    tagList.some(t => t.includes('coding') || t.includes('developer'))
  )
    return 'code';
  if (
    s.includes('automation') ||
    s.includes('agent') ||
    s.includes('workflow') ||
    tagList.some(t => t.includes('automation') || t.includes('agent'))
  )
    return 'automation';
  if (
    s.includes('hosting') ||
    s.includes('infrastructure') ||
    s.includes('inference') ||
    s.includes('cloud') ||
    s.includes('database') ||
    tagList.some(t => t.includes('inference') || t.includes('cloud'))
  )
    return 'hosting';
  if (
    s.includes('productivity') ||
    s.includes('note') ||
    s.includes('writing') ||
    s.includes('document') ||
    s.includes('task') ||
    tagList.some(t => t.includes('writing') || t.includes('documents') || t.includes('notes'))
  )
    return 'productivity';
  if (
    s.includes('open source') ||
    s.includes('local ai') ||
    tagList.some(t => t.includes('open-source') || t.includes('local-ai'))
  )
    return 'code';

  return 'ai';
}

function normalizePricing(pricing) {
  if (!pricing) return 'freemium';
  const p = pricing.toLowerCase();
  if (p.includes('open source') || p.includes('open-source')) return 'open-source';
  if (p.includes('free') && !p.includes('$') && !p.includes('paid')) return 'free';
  if (p.includes('$') || p.includes('paid') || p.includes('commercial')) return 'paid';
  return 'freemium';
}

function getItemBrandColor(name, category) {
  const palette = {
    ai: '#10A37F',
    code: '#238636',
    design: '#7B2CBF',
    automation: '#F97316',
    video: '#DC2626',
    audio: '#D97706',
    hosting: '#2563EB',
    productivity: '#0284C7',
  };
  return palette[category] || '#111111';
}

function getItemInitials(name) {
  if (!name) return 'YP';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function updateCategoryCounts() {
  const counts = {
    ai: 0,
    code: 0,
    design: 0,
    automation: 0,
    video: 0,
    audio: 0,
    hosting: 0,
    productivity: 0,
  };

  state.allDirectoryTools.forEach(t => {
    if (counts[t.category] !== undefined) {
      counts[t.category]++;
    }
  });

  state.categoryCounts = counts;

  // Update "View all" links in category column headers
  document.querySelectorAll('.cat-view-all').forEach(link => {
    const cat = link.dataset.category;
    const count = counts[cat] || 0;
    link.textContent = `View all (${count}) →`;
    link.title = `Browse all ${count} tools in ${cat.toUpperCase()}`;
  });
}

function updateTickerCount() {
  const total = state.allDirectoryTools.length;
  if (!total) return;

  const countElements = document.querySelectorAll('.ticker-content, .ticker-tag');
  document.querySelectorAll('.ticker-scroll-wrap').forEach(wrap => {
    const textNode = wrap.querySelector('.ticker-content');
    if (textNode) {
      textNode.innerHTML = `
        HOT LISTINGS: ${total} HAND-CURATED TOOLS FOR CREATIVE HUMANS!
        <span class="ticker-sep">★</span> NO TRACKERS • NO SIGNUP • 100% PUBLIC AI DIRECTORY
        <span class="ticker-sep">★</span> VERIFIED UTILITY SOFTWARE FOR CRAFTSPEOPLE
        <span class="ticker-sep">★</span> ALL ${total} TOOLS TESTED FOR 2026
      `;
    }
  });
}

// ==========================================================================
// RENDERING FUNCTIONS
// ==========================================================================

function createBrandLogoHtml(tool, size = 24) {
  const color = tool.color || getItemBrandColor(tool.name, tool.category);
  const initials = tool.initials || getItemInitials(tool.name);

  // Favicon fallback via DuckDuckGo if website is available
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
            <span class="ranked-meta">
              ${escapeHtml(tool.pricingLabel)}
              ${tool.displayUrl ? ` | <a href="${escapeHtml(tool.website)}" target="_blank" rel="noopener noreferrer" class="tool-url-link" onclick="event.stopPropagation()">${escapeHtml(tool.displayUrl)} ↗</a>` : ''}
            </span>
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
          <div class="tool-meta">
            ${escapeHtml(tool.pricingLabel)}
            ${tool.displayUrl ? ` | <a href="${escapeHtml(tool.website)}" target="_blank" rel="noopener noreferrer" class="tool-url-link" onclick="event.stopPropagation()">${escapeHtml(tool.displayUrl)} ↗</a>` : ''}
          </div>
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
          <div class="tool-meta">
            ${escapeHtml(tool.pricingLabel)}
            ${tool.displayUrl ? ` | <a href="${escapeHtml(tool.website)}" target="_blank" rel="noopener noreferrer" class="tool-url-link" onclick="event.stopPropagation()">${escapeHtml(tool.displayUrl)} ↗</a>` : ''}
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function renderAllCategories() {
  const categoryIds = ['ai', 'code', 'design', 'automation', 'video', 'audio', 'hosting', 'productivity'];

  categoryIds.forEach(catId => {
    const container = document.getElementById(`cat-list-${catId}`);
    if (!container) return;

    // Filter tools for this category
    const catTools = state.allDirectoryTools.filter(t => t.category === catId);

    // Pick top 5-6 tools for column view (featured or first in list)
    const displaySample = catTools.slice(0, 6);

    container.innerHTML = displaySample.map(tool => {
      return `
        <div class="tool-row-item" data-tool-id="${escapeHtml(tool.id)}" data-slug="${escapeHtml(tool.slug)}" data-category="${escapeHtml(catId)}">
          ${createBrandLogoHtml(tool, 24)}
          <div class="tool-info">
            <div class="tool-name-line">
              <span class="tool-name">${escapeHtml(tool.name)}</span>
            </div>
            <div class="tool-desc">${escapeHtml(tool.description)}</div>
            <div class="tool-meta">
              <span>${escapeHtml(tool.pricingLabel)}</span>
              ${tool.displayUrl ? ` | <a href="${escapeHtml(tool.website)}" target="_blank" rel="noopener noreferrer" class="tool-url-link" onclick="event.stopPropagation()">${escapeHtml(tool.displayUrl)} ↗</a>` : ''}
            </div>
          </div>
        </div>
      `;
    }).join('');
  });
}

// ==========================================================================
// SEARCH, FILTERING & DYNAMIC MATCHING
// ==========================================================================

function selectCategory(cat) {
  state.activeCategory = cat;
  state.filters.category = cat;
  state.activeLetter = null;
  document.querySelectorAll('.az-btn').forEach(b => b.classList.remove('active'));

  if (el.filterCategory) {
    el.filterCategory.value = cat;
  }

  // Update category tab button active state
  document.querySelectorAll('.cat-tab').forEach(b => {
    b.classList.toggle('active', b.dataset.category === cat);
  });

  applyFilters();

  if (cat !== 'all') {
    scrollToResults();
  }
}

function selectLetter(letter) {
  // If search query was present, reset search input so the letter list is clean
  if (state.searchQuery) {
    state.searchQuery = '';
    if (el.searchInput) el.searchInput.value = '';
  }

  if (state.activeLetter === letter) {
    state.activeLetter = null;
    document.querySelectorAll('.az-btn').forEach(b => b.classList.remove('active'));
  } else {
    state.activeLetter = letter;
    document.querySelectorAll('.az-btn').forEach(b => {
      b.classList.toggle('active', b.dataset.letter === letter);
    });
  }

  applyFilters();

  if (state.activeLetter !== null) {
    scrollToResults();
  }
}

function scrollToResults() {
  if (el.searchResultsSection && !el.searchResultsSection.classList.contains('hidden')) {
    const y = el.searchResultsSection.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
  }
}

function applyFilters() {
  const hasSearch = state.searchQuery.trim().length > 0;
  const hasLetter = state.activeLetter !== null;
  const hasCategory = state.activeCategory !== 'all';
  const hasPricing = state.filters.pricing !== 'all';
  const hasPlatform = state.filters.platform !== 'all';
  const hasOpenSource = state.filters.openSource === true;
  const hasSort = state.activeSort !== 'popular';

  const isFiltering = hasSearch || hasLetter || hasCategory || hasPricing || hasPlatform || hasOpenSource || hasSort;

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
    const q = state.searchQuery.toLowerCase().trim();
    results = results.filter(t => {
      const name = (t.name || '').toLowerCase();
      const desc = (t.description || '').toLowerCase();
      const cat = (t.category || '').toLowerCase();
      const rawCat = (t.rawCategory || '').toLowerCase();
      const displayUrl = (t.displayUrl || '').toLowerCase();
      const provider = (t.provider || '').toLowerCase();
      const tags = Array.isArray(t.tags) ? t.tags.join(' ').toLowerCase() : '';
      return (
        name.includes(q) ||
        desc.includes(q) ||
        cat.includes(q) ||
        rawCat.includes(q) ||
        displayUrl.includes(q) ||
        provider.includes(q) ||
        tags.includes(q)
      );
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
    results = results.filter(t =>
      Array.isArray(t.platforms) &&
      t.platforms.some(p => p.toLowerCase().includes(state.filters.platform.toLowerCase()))
    );
  }

  if (hasOpenSource) {
    results = results.filter(t => t.openSource === true);
  }

  // Sorting
  results = sortTools(results, state.activeSort);

  // Update indicators
  if (el.filterActiveText) {
    const terms = [];
    if (hasSearch) terms.push(`Search: "${state.searchQuery}"`);
    if (hasLetter) terms.push(`Letter: ${state.activeLetter}`);
    if (hasCategory) terms.push(`Category: ${state.activeCategory.toUpperCase()}`);
    if (hasPricing) terms.push(`Pricing: ${state.filters.pricing}`);
    if (hasOpenSource) terms.push(`Open Source`);
    if (hasSort) terms.push(`Sorted: ${getSortLabel(state.activeSort)}`);
    el.filterActiveText.textContent = `Showing ${results.length} of ${state.allDirectoryTools.length} tools (${terms.join(' • ')})`;
  }

  if (el.searchResultsDesc) {
    el.searchResultsDesc.textContent = `Found ${results.length} verified listings out of ${state.allDirectoryTools.length} total`;
  }

  // Render cards
  if (el.searchResultsGrid) {
    if (results.length === 0) {
      el.searchResultsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 32px 16px; text-align: center; border: 1.5px dashed var(--border-dark); background-color: var(--paper);">
          <p style="font-family: var(--font-headline); font-size: 18px; margin-bottom: 8px;">No tools found matching your criteria</p>
          <p style="font-size: 13px; color: var(--ink-secondary); margin-bottom: 14px;">Try clearing some filters, clicking "ALL", or searching for broader terms like "design", "coding", or "AI".</p>
          <button type="button" class="reset-btn" onclick="document.getElementById('filter-reset-btn').click()" style="padding: 6px 14px; font-weight: bold; cursor: pointer;">Reset All Filters</button>
        </div>
      `;
    } else {
      el.searchResultsGrid.innerHTML = results.map(tool => {
        const pricingBadgeStyle = getPricingBadgeStyle(tool.pricingType);
        return `
          <div class="search-result-card" data-tool-id="${escapeHtml(tool.id)}" data-slug="${escapeHtml(tool.slug)}">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <div style="display: flex; align-items: center; gap: 8px; min-width: 0;">
                ${createBrandLogoHtml(tool, 26)}
                <div style="min-width: 0;">
                  <div style="font-family: var(--font-directory); font-weight: 700; font-size: 14px; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ${escapeHtml(tool.name)}
                  </div>
                  <div style="font-size: 9.5px; color: var(--ink-muted); text-transform: uppercase; font-weight: bold;">
                    ${escapeHtml(tool.category || '')}
                  </div>
                </div>
              </div>
              <span style="${pricingBadgeStyle}; font-size: 9.5px; padding: 2px 6px; font-weight: 700; border-radius: 2px; text-transform: uppercase; border: 1px solid var(--border-dark);">
                ${escapeHtml(tool.pricingType || 'freemium')}
              </span>
            </div>
            <p style="font-family: var(--font-directory); font-size: 11.5px; line-height: 1.3; color: var(--ink-secondary); margin-bottom: 8px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
              ${escapeHtml(tool.description)}
            </p>
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 10.5px; color: var(--ink-muted); border-top: 1px solid var(--border-subtle); padding-top: 5px;">
              <span style="font-weight: 600;">${escapeHtml(tool.pricingLabel || '')}</span>
              ${tool.displayUrl ? `
                <a href="${escapeHtml(tool.website)}" target="_blank" rel="noopener noreferrer" class="tool-url-link" onclick="event.stopPropagation()">
                  ${escapeHtml(tool.displayUrl)} ↗
                </a>
              ` : ''}
            </div>
          </div>
        `;
      }).join('');
    }
  }
}

function getSortLabel(sortMode) {
  switch (sortMode) {
    case 'az':
      return 'A–Z';
    case 'newest':
      return 'Newest';
    case 'free-first':
      return 'Free First';
    case 'price-asc':
      return 'Price: Low → High';
    case 'price-desc':
      return 'Price: High → Low';
    case 'popular':
    default:
      return 'Popular';
  }
}

function getPricingBadgeStyle(type) {
  switch (type) {
    case 'free':
      return 'background-color: #D4EDDA; color: #155724;';
    case 'open-source':
      return 'background-color: #D1ECF1; color: #0C5460;';
    case 'paid':
      return 'background-color: #F8D7DA; color: #721C24;';
    case 'freemium':
    default:
      return 'background-color: var(--yellow-primary); color: #111111;';
  }
}

function sortTools(tools, sortMode) {
  const sorted = [...tools];
  switch (sortMode) {
    case 'az':
      return sorted.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    case 'newest':
      return sorted.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
    case 'free-first':
      return sorted.sort((a, b) => {
        const order = { free: 0, 'open-source': 1, freemium: 2, paid: 3 };
        return (order[a.pricingType] ?? 2) - (order[b.pricingType] ?? 2);
      });
    case 'price-asc':
      return sorted.sort((a, b) => {
        const order = { free: 0, 'open-source': 1, freemium: 2, paid: 3 };
        return (order[a.pricingType] ?? 2) - (order[b.pricingType] ?? 2);
      });
    case 'price-desc':
      return sorted.sort((a, b) => {
        const order = { paid: 0, freemium: 1, 'open-source': 2, free: 3 };
        return (order[a.pricingType] ?? 2) - (order[b.pricingType] ?? 2);
      });
    case 'popular':
    default:
      return sorted.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return (a.rank || 99) - (b.rank || 99);
      });
  }
}

// ==========================================================================
// EVENT LISTENERS & INTERACTIONS
// ==========================================================================

function attachEventListeners() {
  // 1. Search Input
  let debounceTimer;
  el.searchInput?.addEventListener('input', e => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      state.searchQuery = e.target.value;
      if (state.searchQuery.trim().length > 0 && state.activeLetter !== null) {
        state.activeLetter = null;
        document.querySelectorAll('.az-btn').forEach(b => b.classList.remove('active'));
      }
      applyFilters();
      if (state.searchQuery.trim().length > 0) {
        scrollToResults();
      }
    }, 100);
  });

  // 2. Clear search button
  el.clearSearchBtn?.addEventListener('click', () => {
    resetAllFilters();
  });

  // 3. Category Tabs
  el.categoryTabs?.addEventListener('click', e => {
    const btn = e.target.closest('.cat-tab');
    if (!btn) return;
    const cat = btn.dataset.category;
    selectCategory(cat);
  });

  // 4. "View all →" links on category column headers
  document.addEventListener('click', e => {
    const viewAllBtn = e.target.closest('.cat-view-all');
    if (!viewAllBtn) return;
    e.preventDefault();
    const cat = viewAllBtn.dataset.category;
    if (cat) {
      selectCategory(cat);
    }
  });

  // 5. A-Z Letters
  el.azLetters?.addEventListener('click', e => {
    const btn = e.target.closest('.az-btn');
    if (!btn) return;
    const letter = btn.dataset.letter;
    selectLetter(letter);
  });

  // 6. A-Z Clear / "ALL" button
  el.azClearBtn?.addEventListener('click', () => {
    state.activeLetter = null;
    document.querySelectorAll('.az-btn').forEach(b => b.classList.remove('active'));
    applyFilters();
  });

  // 7. Sort Group
  el.sortGroup?.addEventListener('click', e => {
    const btn = e.target.closest('.sort-btn');
    if (!btn) return;
    document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.activeSort = btn.dataset.sort;
    applyFilters();
    if (state.activeSort !== 'popular') {
      scrollToResults();
    }
  });

  // 8. Filter Selects & Checkboxes
  el.filterCategory?.addEventListener('change', e => {
    state.activeCategory = e.target.value;
    document.querySelectorAll('.cat-tab').forEach(b => {
      b.classList.toggle('active', b.dataset.category === state.activeCategory);
    });
    applyFilters();
    if (state.activeCategory !== 'all') {
      scrollToResults();
    }
  });

  el.filterPricing?.addEventListener('change', e => {
    state.filters.pricing = e.target.value;
    applyFilters();
    scrollToResults();
  });

  el.filterPlatform?.addEventListener('change', e => {
    state.filters.platform = e.target.value;
    applyFilters();
    scrollToResults();
  });

  el.filterOpenSource?.addEventListener('change', e => {
    state.filters.openSource = e.target.checked;
    applyFilters();
    scrollToResults();
  });

  // 9. Reset Button
  el.filterResetBtn?.addEventListener('click', () => {
    resetAllFilters();
  });

  // 10. "SEE ALL TOP PICKS" CTA
  el.btnSeeTopPicks?.addEventListener('click', () => {
    resetAllFilters();
    window.scrollTo({ top: el.topPicksSection.offsetTop - 20, behavior: 'smooth' });
  });

  // 11. Editorial Links Click Handlers
  document.querySelectorAll('.editorial-item a').forEach(link => {
    link.addEventListener('click', e => {
      const cat = link.dataset.category;
      const pricing = link.dataset.filterPricing;
      const openSource = link.dataset.filterOpensource;

      if (cat) {
        e.preventDefault();
        selectCategory(cat);
      } else if (pricing) {
        e.preventDefault();
        state.filters.pricing = pricing;
        if (el.filterPricing) el.filterPricing.value = pricing;
        applyFilters();
        scrollToResults();
      } else if (openSource) {
        e.preventDefault();
        state.filters.openSource = true;
        if (el.filterOpenSource) el.filterOpenSource.checked = true;
        applyFilters();
        scrollToResults();
      }
    });
  });

  // 12. Footer Category Links
  document.querySelectorAll('.footer-links a').forEach(link => {
    link.addEventListener('click', e => {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#sec-')) {
        const cat = href.replace('#sec-', '');
        e.preventDefault();
        selectCategory(cat);
      }
    });
  });

  // 13. Tool Clicks -> Open Detail Modal
  document.addEventListener('click', e => {
    const row = e.target.closest('[data-tool-id]');
    if (!row) return;

    // Ignore if clicked on an external link or button inside the row
    if (e.target.closest('a') || e.target.closest('button')) {
      return;
    }

    const toolId = row.dataset.toolId;
    const slug = row.dataset.slug;
    const tool = state.allDirectoryTools.find(t => t.id === toolId || t.slug === slug);
    if (tool) {
      openToolModal(tool);
    }
  });

  // 14. Dialog Close Button
  el.modalCloseBtn?.addEventListener('click', () => {
    el.toolDetailDialog?.close();
  });

  // 15. Copy Link Button in Modal
  el.modalCopyLinkBtn?.addEventListener('click', () => {
    if (!state.selectedTool) return;
    const url = state.selectedTool.website || window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      el.modalCopyLinkBtn.textContent = 'COPIED!';
      setTimeout(() => (el.modalCopyLinkBtn.textContent = 'COPY LINK'), 1500);
    });
  });

  // 16. Bookmark / Favorite Button in Modal
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

  // 17. Curator Auth Dialog Handlers
  el.footerCuratorBtn?.addEventListener('click', () => {
    el.curatorAuthDialog?.showModal();
  });

  el.openCuratorLink?.addEventListener('click', e => {
    e.preventDefault();
    el.curatorAuthDialog?.showModal();
  });

  el.curatorModalClose?.addEventListener('click', () => {
    el.curatorAuthDialog?.close();
  });

  el.curatorCancelBtn?.addEventListener('click', () => {
    el.curatorAuthDialog?.close();
  });

  el.curatorAuthForm?.addEventListener('submit', async e => {
    e.preventDefault();
    const key = el.curatorKeyInput?.value.trim();
    if (!key) return;

    try {
      const res = await fetch('/api/curator/status', {
        headers: { 'X-Curator-Key': key },
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
  if (el.modalToolHostname)
    el.modalToolHostname.textContent = tool.displayUrl || (tool.website ? new URL(tool.website).hostname : '');
  if (el.modalToolCategory) el.modalToolCategory.textContent = (tool.category || 'TOOL').toUpperCase();
  if (el.modalToolPricing) el.modalToolPricing.textContent = tool.pricingLabel || 'Freemium';
  if (el.modalToolPlatforms)
    el.modalToolPlatforms.textContent = Array.isArray(tool.platforms) ? tool.platforms.join(', ') : 'Web';
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
    el.modalVisitLink.target = '_blank';
    el.modalVisitLink.rel = 'noopener noreferrer';
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

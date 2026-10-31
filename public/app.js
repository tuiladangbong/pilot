// ==========================================================================
// HUMAN AFTER ALL! — FRONTEND DIRECTORY ENGINE & INTERACTION
// ==========================================================================

import {
  TOP_PICKS,
  LATEST_LISTINGS,
  FREE_THIS_WEEK,
  DIRECTORY_CATEGORIES,
} from './data/catalogData.js';

// ==========================================================================
// SOLUTION 4 FEATURE FLAG: Split All-Time Classics vs Fresh Discoveries
// Set to `false` to instantly revert back to raw updated_at order
// ==========================================================================
export const ENABLE_SEPARATED_FRESH_STREAM = true;

// Application State
const state = {
  activeHubTab: 'tools', // 'tools' | 'prompts' | 'workflows' | 'agents'
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
  promptsFilter: {
    search: '',
    model: 'all',
  },
  workflowsFilter: {
    search: '',
    difficulty: 'all',
  },
  agentsFilter: {
    search: '',
    autonomy: 'all',
  },
  isCurator: false,
  allDirectoryTools: [],
  allPrompts: [],
  allWorkflows: [],
  allAgents: [],
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
  selectedPrompt: null,
  selectedWorkflow: null,
  selectedAgent: null,
};

// DOM Elements
const el = {
  // Hub Navigation & Views
  resourceHubTabs: document.getElementById('resource-hub-tabs'),
  toolsView: document.getElementById('tools-view'),
  promptsView: document.getElementById('prompts-view'),
  workflowsView: document.getElementById('workflows-view'),
  agentsView: document.getElementById('agents-view'),
  countTools: document.getElementById('count-tools'),
  countPrompts: document.getElementById('count-prompts'),
  countWorkflows: document.getElementById('count-workflows'),
  countAgents: document.getElementById('count-agents'),

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

  // Prompts Controls & Grid
  promptsSearchInput: document.getElementById('prompts-search-input'),
  promptModelTabs: document.getElementById('prompt-model-tabs'),
  promptsGrid: document.getElementById('prompts-grid'),

  // Workflows Controls & List
  workflowsSearchInput: document.getElementById('workflows-search-input'),
  workflowDiffTabs: document.getElementById('workflow-diff-tabs'),
  workflowsList: document.getElementById('workflows-list'),

  // Agents Controls & Grid
  agentsSearchInput: document.getElementById('agents-search-input'),
  agentAutonomyTabs: document.getElementById('agent-autonomy-tabs'),
  agentsGrid: document.getElementById('agents-grid'),

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

  // Prompt Detail Dialog
  promptDetailDialog: document.getElementById('prompt-detail-dialog'),
  modalPromptCloseBtn: document.getElementById('modal-prompt-close-btn'),
  modalPromptTitle: document.getElementById('modal-prompt-title'),
  modalPromptModel: document.getElementById('modal-prompt-model'),
  modalPromptDesc: document.getElementById('modal-prompt-desc'),
  modalPromptTags: document.getElementById('modal-prompt-tags'),
  modalPromptContent: document.getElementById('modal-prompt-content'),
  modalPromptCopyBtn: document.getElementById('modal-prompt-copy-btn'),
  modalPromptCopyBottomBtn: document.getElementById('modal-prompt-copy-bottom-btn'),
  modalPromptCloseBottomBtn: document.getElementById('modal-prompt-close-bottom-btn'),

  // Workflow Detail Dialog
  workflowDetailDialog: document.getElementById('workflow-detail-dialog'),
  modalWorkflowCloseBtn: document.getElementById('modal-workflow-close-btn'),
  modalWorkflowTitle: document.getElementById('modal-workflow-title'),
  modalWorkflowPurpose: document.getElementById('modal-workflow-purpose'),
  modalWorkflowDiff: document.getElementById('modal-workflow-diff'),
  modalWorkflowTime: document.getElementById('modal-workflow-time'),
  modalWorkflowSteps: document.getElementById('modal-workflow-steps'),
  modalWorkflowCopyBtn: document.getElementById('modal-workflow-copy-btn'),
  modalWorkflowCloseBottomBtn: document.getElementById('modal-workflow-close-bottom-btn'),

  // Agent Detail Dialog
  agentDetailDialog: document.getElementById('agent-detail-dialog'),
  modalAgentCloseBtn: document.getElementById('modal-agent-close-btn'),
  modalAgentTitle: document.getElementById('modal-agent-title'),
  modalAgentRole: document.getElementById('modal-agent-role'),
  modalAgentGoal: document.getElementById('modal-agent-goal'),
  modalAgentAutonomy: document.getElementById('modal-agent-autonomy'),
  modalAgentRuntime: document.getElementById('modal-agent-runtime'),
  modalAgentInput: document.getElementById('modal-agent-input'),
  modalAgentOutput: document.getElementById('modal-agent-output'),
  modalAgentInstructions: document.getElementById('modal-agent-instructions'),
  modalAgentTools: document.getElementById('modal-agent-tools'),
  modalAgentCopyBtn: document.getElementById('modal-agent-copy-btn'),
  modalAgentCopyBottomBtn: document.getElementById('modal-agent-copy-bottom-btn'),
  modalAgentCloseBottomBtn: document.getElementById('modal-agent-close-bottom-btn'),

  // Retro Toast
  retroToast: document.getElementById('retro-toast'),
  toastMessage: document.getElementById('toast-message'),

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

  // 5. Fetch full live API catalog and resources across all modules
  await fetchAllHubResources();

  // 6. Check initial hash for direct tab linking (#tools, #prompts, #workflows, #agents)
  const initialHash = window.location.hash.replace('#', '').toLowerCase();
  if (['tools', 'prompts', 'workflows', 'agents'].includes(initialHash)) {
    switchHubTab(initialHash, false);
  }

  // 7. Check curator status and route
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
          origin: item.origin || 'curated',
          createdAt: item.createdAt || '',
          updatedAt: item.updatedAt || '',
        };
      });

      // Merge unique items from API with any custom curated tools
      const dbSlugs = new Set(dbTools.map(t => t.slug));
      const additional = state.allDirectoryTools.filter(t => !dbSlugs.has(t.slug));
      state.allDirectoryTools = [...dbTools, ...additional];

      // Refresh category columns, latest discoveries, and counts
      renderAllCategories();
      renderLatestListings();
      updateCategoryCounts();
      updateTickerCount();
      updateAllCounts();

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

// ==========================================================================
// MULTI-MODULE HUB RESOURCE FETCHING & COORDINATION
// ==========================================================================

async function fetchAllHubResources() {
  await Promise.allSettled([
    fetchLiveCatalog(),
    fetchPrompts(),
    fetchWorkflows(),
    fetchAgents()
  ]);
  updateAllCounts();
}

async function fetchPrompts() {
  try {
    const res = await fetch('/api/prompts?limit=100');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (Array.isArray(json.data)) {
      state.allPrompts = json.data;
      if (el.countPrompts) el.countPrompts.textContent = state.allPrompts.length;
      if (state.activeHubTab === 'prompts') renderPrompts();
    }
  } catch (err) {
    console.warn('Error fetching prompts:', err);
  }
}

async function fetchWorkflows() {
  try {
    const res = await fetch('/api/workflows?limit=100');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (Array.isArray(json.data)) {
      state.allWorkflows = json.data;
      if (el.countWorkflows) el.countWorkflows.textContent = state.allWorkflows.length;
      if (state.activeHubTab === 'workflows') renderWorkflows();
    }
  } catch (err) {
    console.warn('Error fetching workflows:', err);
  }
}

async function fetchAgents() {
  try {
    const res = await fetch('/api/agents?limit=100');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    if (Array.isArray(json.data)) {
      state.allAgents = json.data;
      if (el.countAgents) el.countAgents.textContent = state.allAgents.length;
      if (state.activeHubTab === 'agents') renderAgents();
    }
  } catch (err) {
    console.warn('Error fetching agents:', err);
  }
}

function updateAllCounts() {
  if (el.countTools) el.countTools.textContent = state.allDirectoryTools.length || '248';
  if (el.countPrompts) el.countPrompts.textContent = state.allPrompts.length || '11';
  if (el.countWorkflows) el.countWorkflows.textContent = state.allWorkflows.length || '7';
  if (el.countAgents) el.countAgents.textContent = state.allAgents.length || '5';
}

function switchHubTab(tabName, updateHash = true) {
  state.activeHubTab = tabName;

  // Update hub tab buttons
  document.querySelectorAll('.hub-tab').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabName);
  });

  // Toggle views
  el.toolsView?.classList.toggle('hidden', tabName !== 'tools');
  el.promptsView?.classList.toggle('hidden', tabName !== 'prompts');
  el.workflowsView?.classList.toggle('hidden', tabName !== 'workflows');
  el.agentsView?.classList.toggle('hidden', tabName !== 'agents');

  if (updateHash) {
    history.replaceState(null, '', '#' + tabName);
  }

  // Scroll to top of directory smoothly
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Render view-specific data
  if (tabName === 'prompts') renderPrompts();
  if (tabName === 'workflows') renderWorkflows();
  if (tabName === 'agents') renderAgents();
}

async function copyToClipboard(text, label = 'Copied to clipboard!') {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    showToast(label);
    return true;
  } catch (err) {
    console.error('Copy failed:', err);
    showToast('Failed to copy to clipboard');
    return false;
  }
}

let toastTimer;
function showToast(msg) {
  if (!el.retroToast || !el.toastMessage) return;
  el.toastMessage.textContent = msg;
  el.retroToast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    el.retroToast?.classList.add('hidden');
  }, 2200);
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

  let listings = LATEST_LISTINGS;
  if (ENABLE_SEPARATED_FRESH_STREAM && state.allDirectoryTools.length > 0) {
    // Solution 4: Extract live newly discovered/ingested resources
    const liveFresh = [...state.allDirectoryTools]
      .filter(t => t.createdAt)
      .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
      .slice(0, 5);

    if (liveFresh.length > 0) {
      listings = liveFresh;
    }
  }

  el.latestListingsContainer.innerHTML = listings.map(tool => {
    const isLiveNew = Boolean(tool.createdAt);
    return `
      <div class="sidebar-tool-row" data-tool-id="${escapeHtml(tool.id)}" data-slug="${escapeHtml(tool.slug)}">
        ${createBrandLogoHtml(tool, 24)}
        <div class="tool-info">
          <div class="tool-name-line">
            <span class="tool-name">${escapeHtml(tool.name)}</span>
          </div>
          <div class="tool-desc">${escapeHtml(tool.description)}</div>
          <div class="tool-meta">
            ${isLiveNew ? `<span style="background:var(--yellow-primary,#F4C62B);color:#111;padding:1px 4px;font-size:8.5px;font-weight:bold;border-radius:2px;margin-right:4px;">NEW</span>` : ''}
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
    let catTools = state.allDirectoryTools.filter(t => t.category === catId);

    // Sort newest tools first for the category columns ("lấy mới hết trong các cột đó")
    catTools.sort((a, b) => {
      const dateA = a.createdAt || '';
      const dateB = b.createdAt || '';
      if (dateA !== dateB) {
        return dateB.localeCompare(dateA);
      }
      return (a.name || '').localeCompare(b.name || '');
    });

    // Pick top 5-6 newest tools for column view
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
    if (state.activeCategory === 'classics') {
      results = results.filter(t => t.featured || (t.rank && t.rank <= 10) || t.origin === 'curated');
    } else {
      results = results.filter(t => (t.category || '').toLowerCase() === state.activeCategory.toLowerCase());
    }
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
    if (hasCategory) {
      if (state.activeCategory === 'classics') {
        terms.push(`★ ALL-TIME CLASSICS`);
      } else {
        terms.push(`Category: ${state.activeCategory.toUpperCase()}`);
      }
    }
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
        const isClassic = tool.featured || (tool.rank && tool.rank <= 10) || tool.origin === 'curated';
        return `
          <div class="search-result-card" data-tool-id="${escapeHtml(tool.id)}" data-slug="${escapeHtml(tool.slug)}">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;">
              <div style="display: flex; align-items: center; gap: 8px; min-width: 0;">
                ${createBrandLogoHtml(tool, 26)}
                <div style="min-width: 0;">
                  <div style="font-family: var(--font-directory); font-weight: 700; font-size: 14px; color: var(--ink); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 4px;">
                    <span>${escapeHtml(tool.name)}</span>
                    ${isClassic ? '<span class="badge-classic">★ CLASSIC</span>' : ''}
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
// PROMPTS RENDERING & INTERACTIONS
// ==========================================================================

function renderPrompts() {
  if (!el.promptsGrid) return;

  let filtered = [...state.allPrompts];

  // Model filter
  if (state.promptsFilter.model !== 'all') {
    const targetModel = state.promptsFilter.model.toLowerCase();
    filtered = filtered.filter(p => {
      const m = (p.model || '').toLowerCase();
      const tags = (p.tags || []).map(t => String(t).toLowerCase());
      return m.includes(targetModel) || tags.some(t => t.includes(targetModel));
    });
  }

  // Search filter
  if (state.promptsFilter.search.trim()) {
    const q = state.promptsFilter.search.toLowerCase().trim();
    filtered = filtered.filter(p => {
      const titleMatch = (p.title || '').toLowerCase().includes(q);
      const descMatch = (p.description || '').toLowerCase().includes(q);
      const contentMatch = (p.content || '').toLowerCase().includes(q);
      const tagsMatch = (p.tags || []).some(t => String(t).toLowerCase().includes(q));
      return titleMatch || descMatch || contentMatch || tagsMatch;
    });
  }

  if (filtered.length === 0) {
    el.promptsGrid.innerHTML = `
      <div class="no-results-box" style="grid-column: 1 / -1; padding: 24px; text-align: center; background: var(--paper-light); border: 1.5px solid var(--border-dark);">
        <p style="font-family: var(--font-headline); font-size: 16px; margin-bottom: 6px;">No system prompts matched your filter.</p>
        <p style="color: var(--ink-secondary); font-size: 12px;">Try selecting "ALL MODELS" or clearing search keywords.</p>
      </div>
    `;
    return;
  }

  el.promptsGrid.innerHTML = filtered.map(p => {
    const modelLabel = p.model || 'Universal / LLM';
    const tagsHtml = (p.tags || [])
      .map(t => `<span class="prompt-tag-pill">#${escapeHtml(t)}</span>`)
      .join('');
    
    const previewContent = p.content || '';

    return `
      <article class="prompt-card" data-id="${p.id}">
        <div class="prompt-card-head">
          <span class="prompt-model-badge">${escapeHtml(modelLabel)}</span>
          <button type="button" class="tool-bookmark-btn ${state.visitorFavorites.has(p.id) ? 'bookmarked' : ''}" data-id="${p.id}" title="Bookmark prompt">
            ${state.visitorFavorites.has(p.id) ? '★' : '☆'}
          </button>
        </div>

        <h3 class="prompt-card-title">${escapeHtml(p.title)}</h3>
        <p class="prompt-card-desc">${escapeHtml(p.description || '')}</p>

        <div class="prompt-tags-row">
          ${tagsHtml}
        </div>

        <div class="prompt-code-wrap">
          <div class="prompt-code-header">
            <span>PROMPT PREVIEW</span>
            <button type="button" class="copy-code-btn" data-copy-id="${p.id}" title="Copy full prompt text">📋 COPY PROMPT</button>
          </div>
          <pre class="prompt-code-block">${escapeHtml(previewContent)}</pre>
        </div>

        <div class="prompt-card-actions">
          <button type="button" class="btn-copy-prompt" data-copy-id="${p.id}">📋 COPY PROMPT</button>
          <button type="button" class="btn-view-prompt" data-view-id="${p.id}">EXPAND →</button>
        </div>
      </article>
    `;
  }).join('');
}

function openPromptModal(prompt) {
  state.selectedPrompt = prompt;
  if (!el.promptDetailDialog) return;

  if (el.modalPromptTitle) el.modalPromptTitle.textContent = prompt.title;
  if (el.modalPromptModel) el.modalPromptModel.textContent = prompt.model || 'Universal LLM';
  if (el.modalPromptDesc) el.modalPromptDesc.textContent = prompt.description || '';
  if (el.modalPromptContent) el.modalPromptContent.textContent = prompt.content || '';
  if (el.modalPromptTags) {
    el.modalPromptTags.textContent = (prompt.tags || []).map(t => `#${t}`).join('  ');
  }

  el.promptDetailDialog.showModal();
}

// ==========================================================================
// WORKFLOWS RENDERING & INTERACTIONS
// ==========================================================================

function renderWorkflows() {
  if (!el.workflowsList) return;

  let filtered = [...state.allWorkflows];

  // Difficulty filter
  if (state.workflowsFilter.difficulty !== 'all') {
    filtered = filtered.filter(w => (w.difficulty || '').toLowerCase() === state.workflowsFilter.difficulty.toLowerCase());
  }

  // Search filter
  if (state.workflowsFilter.search.trim()) {
    const q = state.workflowsFilter.search.toLowerCase().trim();
    filtered = filtered.filter(w => {
      const titleMatch = (w.title || '').toLowerCase().includes(q);
      const descMatch = (w.description || '').toLowerCase().includes(q);
      const purposeMatch = (w.purpose || '').toLowerCase().includes(q);
      const stepsMatch = (w.steps || []).some(s => 
        (s.title || '').toLowerCase().includes(q) || (s.instruction || '').toLowerCase().includes(q)
      );
      return titleMatch || descMatch || purposeMatch || stepsMatch;
    });
  }

  if (filtered.length === 0) {
    el.workflowsList.innerHTML = `
      <div class="no-results-box" style="padding: 24px; text-align: center; background: var(--paper-light); border: 1.5px solid var(--border-dark);">
        <p style="font-family: var(--font-headline); font-size: 16px; margin-bottom: 6px;">No workflows found matching your criteria.</p>
        <p style="color: var(--ink-secondary); font-size: 12px;">Try clearing filters to see all available workflows.</p>
      </div>
    `;
    return;
  }

  el.workflowsList.innerHTML = filtered.map(w => {
    const diffClass = `diff-${(w.difficulty || 'medium').toLowerCase()}`;
    const steps = w.steps || [];

    const stepsHtml = steps.map((s, idx) => {
      const stepNum = String(idx + 1).padStart(2, '0');
      const linkedTools = s.linkedResources || [];
      const toolPills = linkedTools.map(lr => `
        <span class="tool-link-pill" data-tool-slug="${escapeHtml(lr.slug || lr.resourceId)}" data-tool-title="${escapeHtml(lr.title)}" title="View ${escapeHtml(lr.title)} in directory">
          <span>🔗</span>
          <span>${escapeHtml(lr.title)}</span>
        </span>
      `).join('');

      return `
        <div class="step-item">
          <div class="step-num">${stepNum}</div>
          <div class="step-content">
            <h4 class="step-title">${escapeHtml(s.title)}</h4>
            <p class="step-instruction">${escapeHtml(s.instruction)}</p>
            ${s.notes ? `<p style="font-size: 11px; font-style: italic; color: var(--ink-muted); margin-bottom: 4px;">💡 Note: ${escapeHtml(s.notes)}</p>` : ''}
            ${linkedTools.length > 0 ? `
              <div class="step-tools-row">
                <span class="step-tools-label">USES:</span>
                ${toolPills}
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');

    return `
      <article class="workflow-card" data-id="${w.id}">
        <div class="workflow-card-head">
          <div class="workflow-badges-left">
            <span class="diff-badge ${diffClass}">${(w.difficulty || 'MEDIUM').toUpperCase()}</span>
            <span class="workflow-time-badge">⏱️ ${escapeHtml(w.estimatedTime || 'Varies')}</span>
            <span class="workflow-step-count">${steps.length} STEPS</span>
          </div>
          <button type="button" class="tool-bookmark-btn ${state.visitorFavorites.has(w.id) ? 'bookmarked' : ''}" data-id="${w.id}" title="Bookmark workflow">
            ${state.visitorFavorites.has(w.id) ? '★' : '☆'}
          </button>
        </div>

        <h3 class="workflow-title">${escapeHtml(w.title)}</h3>
        <p style="font-size: 13px; color: var(--ink-secondary); margin-bottom: 8px;">${escapeHtml(w.description || '')}</p>

        ${w.purpose ? `
          <div class="workflow-purpose-box">
            <strong>OUTCOME:</strong> ${escapeHtml(w.purpose)}
          </div>
        ` : ''}

        <div class="workflow-steps-timeline">
          ${stepsHtml}
        </div>

        <div class="workflow-card-footer">
          <div class="prompt-tags-row" style="margin: 0;">
            ${(w.tags || []).map(t => `<span class="prompt-tag-pill">#${escapeHtml(t)}</span>`).join('')}
          </div>
          <div style="display: flex; gap: 8px;">
            <button type="button" class="btn-copy-prompt" data-copy-workflow-id="${w.id}">📋 COPY WORKFLOW GUIDE</button>
            <button type="button" class="btn-view-prompt" data-view-workflow-id="${w.id}">FULL VIEW →</button>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

function openWorkflowModal(workflow) {
  state.selectedWorkflow = workflow;
  if (!el.workflowDetailDialog) return;

  if (el.modalWorkflowTitle) el.modalWorkflowTitle.textContent = workflow.title;
  if (el.modalWorkflowDiff) el.modalWorkflowDiff.textContent = (workflow.difficulty || 'MEDIUM').toUpperCase();
  if (el.modalWorkflowTime) el.modalWorkflowTime.textContent = `⏱️ ${workflow.estimatedTime || 'Varies'}`;
  if (el.modalWorkflowPurpose) el.modalWorkflowPurpose.textContent = workflow.purpose || workflow.description || '';

  if (el.modalWorkflowSteps) {
    const steps = workflow.steps || [];
    el.modalWorkflowSteps.innerHTML = steps.map((s, idx) => {
      const stepNum = String(idx + 1).padStart(2, '0');
      const linkedTools = s.linkedResources || [];
      const toolPills = linkedTools.map(lr => `
        <span class="tool-link-pill" data-tool-slug="${escapeHtml(lr.slug || lr.resourceId)}" data-tool-title="${escapeHtml(lr.title)}">
          <span>🔗</span>
          <span>${escapeHtml(lr.title)}</span>
        </span>
      `).join('');

      return `
        <div class="step-item">
          <div class="step-num">${stepNum}</div>
          <div class="step-content">
            <h4 class="step-title">${escapeHtml(s.title)}</h4>
            <p class="step-instruction">${escapeHtml(s.instruction)}</p>
            ${s.notes ? `<p style="font-size: 11px; font-style: italic; color: var(--ink-muted); margin-bottom: 4px;">💡 ${escapeHtml(s.notes)}</p>` : ''}
            ${linkedTools.length > 0 ? `
              <div class="step-tools-row">
                <span class="step-tools-label">USES:</span>
                ${toolPills}
              </div>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  el.workflowDetailDialog.showModal();
}

function formatWorkflowMarkdown(w) {
  const lines = [
    `# Workflow: ${w.title}`,
    ``,
    `**Difficulty:** ${w.difficulty || 'Medium'} | **Estimated Time:** ${w.estimatedTime || 'Varies'}`,
    `**Purpose:** ${w.purpose || w.description || ''}`,
    ``,
    `## Operational Steps:`
  ];

  (w.steps || []).forEach((s, idx) => {
    lines.push(`### Step ${idx + 1}: ${s.title}`);
    lines.push(s.instruction);
    if (s.notes) lines.push(`*Tip: ${s.notes}*`);
    if (s.linkedResources && s.linkedResources.length > 0) {
      lines.push(`**Recommended Tools:** ${s.linkedResources.map(r => `${r.title} (${r.url || ''})`).join(', ')}`);
    }
    lines.push('');
  });

  return lines.join('\n');
}

// ==========================================================================
// AGENTS RENDERING & INTERACTIONS
// ==========================================================================

async function renderAgents() {
  if (!el.agentsGrid) return;

  let filtered = [...state.allAgents];

  // Autonomy filter
  if (state.agentsFilter.autonomy !== 'all') {
    filtered = filtered.filter(a => (a.autonomyLevel || '').toLowerCase() === state.agentsFilter.autonomy.toLowerCase());
  }

  // Search filter
  if (state.agentsFilter.search.trim()) {
    const q = state.agentsFilter.search.toLowerCase().trim();
    filtered = filtered.filter(a => {
      const titleMatch = (a.title || '').toLowerCase().includes(q);
      const roleMatch = (a.role || '').toLowerCase().includes(q);
      const goalMatch = (a.goal || '').toLowerCase().includes(q);
      const runtimeMatch = (a.runtime || '').toLowerCase().includes(q);
      return titleMatch || roleMatch || goalMatch || runtimeMatch;
    });
  }

  if (filtered.length === 0) {
    el.agentsGrid.innerHTML = `
      <div class="no-results-box" style="grid-column: 1 / -1; padding: 24px; text-align: center; background: var(--paper-light); border: 1.5px solid var(--border-dark);">
        <p style="font-family: var(--font-headline); font-size: 16px; margin-bottom: 6px;">No agent blueprints matched your search.</p>
        <p style="color: var(--ink-secondary); font-size: 12px;">Try clearing search or autonomy filters.</p>
      </div>
    `;
    return;
  }

  el.agentsGrid.innerHTML = filtered.map(a => {
    const autonomy = a.autonomyLevel || 'Assisted';
    const isAuto = autonomy.toLowerCase() === 'autonomous';

    return `
      <article class="agent-card" data-id="${a.id}">
        <div class="agent-card-head">
          <span class="agent-role-pill">${escapeHtml((a.role || 'AGENT').toUpperCase())}</span>
          <span class="agent-autonomy-badge ${isAuto ? 'autonomous' : ''}">● ${escapeHtml(autonomy.toUpperCase())}</span>
        </div>

        <h3 class="agent-card-title">${escapeHtml(a.title)}</h3>
        <p class="agent-goal-text">"${escapeHtml(a.goal || a.description || '')}"</p>

        <div class="agent-contracts-box">
          <div class="contract-col">
            <span class="contract-label">RUNTIME &amp; MODEL</span>
            <p>${escapeHtml(a.runtime || 'Universal')} • ${escapeHtml(a.model || 'Claude 3.7 / GPT-4o')}</p>
          </div>
          <div class="contract-col">
            <span class="contract-label">SPECIALIZED TOOLS</span>
            <p>${a.linkedResourceCount ? `${a.linkedResourceCount} Linked Catalog Tools` : 'General CLI / Code'}</p>
          </div>
        </div>

        <div class="prompt-tags-row">
          ${(a.tags || []).map(t => `<span class="prompt-tag-pill">#${escapeHtml(t)}</span>`).join('')}
        </div>

        <div class="agent-card-actions">
          <button type="button" class="btn-copy-prompt" data-copy-agent-id="${a.id}">📋 COPY AGENT SPEC</button>
          <button type="button" class="btn-view-prompt" data-view-agent-id="${a.id}">FULL SPEC →</button>
        </div>
      </article>
    `;
  }).join('');
}

async function openAgentModal(agentSummary) {
  try {
    const res = await fetch(`/api/agents/${agentSummary.id}`);
    const json = res.ok ? await res.json() : null;
    const agent = json?.data || agentSummary;
    state.selectedAgent = agent;

    if (!el.agentDetailDialog) return;

    if (el.modalAgentTitle) el.modalAgentTitle.textContent = agent.title;
    if (el.modalAgentRole) el.modalAgentRole.textContent = agent.role || 'Agent';
    if (el.modalAgentGoal) el.modalAgentGoal.textContent = agent.goal || '';
    if (el.modalAgentAutonomy) el.modalAgentAutonomy.textContent = (agent.autonomyLevel || 'Assisted').toUpperCase();
    if (el.modalAgentRuntime) el.modalAgentRuntime.textContent = agent.runtime || 'Claude Code';
    if (el.modalAgentInput) el.modalAgentInput.textContent = agent.inputDescription || 'User prompts and codebase repository context.';
    if (el.modalAgentOutput) el.modalAgentOutput.textContent = agent.outputDescription || 'Deterministic code diffs and architectural plans.';
    if (el.modalAgentInstructions) el.modalAgentInstructions.textContent = agent.instructions || '';

    if (el.modalAgentTools) {
      const tools = agent.linkedResources || [];
      if (tools.length > 0) {
        el.modalAgentTools.innerHTML = `
          <span class="step-tools-label">SPECIALIZED TOOLS:</span>
          ${tools.map(t => `
            <span class="tool-link-pill" data-tool-slug="${escapeHtml(t.slug || t.resourceId)}" data-tool-title="${escapeHtml(t.title)}">
              <span>🔗</span>
              <span>${escapeHtml(t.title)}</span>
            </span>
          `).join('')}
        `;
      } else {
        el.modalAgentTools.innerHTML = '';
      }
    }

    el.agentDetailDialog.showModal();
  } catch (err) {
    console.error('Failed to load full agent details:', err);
  }
}

async function getFullAgentMarkdown(agentId) {
  try {
    const res = await fetch(`/api/agents/${agentId}/full-text`);
    if (res.ok) {
      return await res.text();
    }
  } catch (e) {}

  const a = state.allAgents.find(x => x.id === agentId);
  if (!a) return '';
  return `# Agent Blueprint: ${a.title}\nRole: ${a.role}\nGoal: ${a.goal}\nRuntime: ${a.runtime}\n\n## Instructions:\n${a.instructions || ''}`;
}

// ==========================================================================
// EVENT LISTENERS & INTERACTIONS
// ==========================================================================

function attachEventListeners() {
  // Hub Navigation Tabs
  el.resourceHubTabs?.addEventListener('click', e => {
    const btn = e.target.closest('.hub-tab');
    if (!btn) return;
    const tab = btn.dataset.tab;
    if (tab) switchHubTab(tab);
  });

  // Footer Hub navigation links
  document.querySelectorAll('.footer-hub-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const tab = link.dataset.tab;
      if (tab) switchHubTab(tab);
    });
  });

  // Hash Change Listener
  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '').toLowerCase();
    if (['tools', 'prompts', 'workflows', 'agents'].includes(hash)) {
      switchHubTab(hash, false);
    }
  });

  // Prompts Search & Filter
  el.promptsSearchInput?.addEventListener('input', e => {
    state.promptsFilter.search = e.target.value;
    renderPrompts();
  });

  el.promptModelTabs?.addEventListener('click', e => {
    const btn = e.target.closest('.hub-filter-btn');
    if (!btn) return;
    document.querySelectorAll('#prompt-model-tabs .hub-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.promptsFilter.model = btn.dataset.model || 'all';
    renderPrompts();
  });

  // Workflows Search & Filter
  el.workflowsSearchInput?.addEventListener('input', e => {
    state.workflowsFilter.search = e.target.value;
    renderWorkflows();
  });

  el.workflowDiffTabs?.addEventListener('click', e => {
    const btn = e.target.closest('.hub-filter-btn');
    if (!btn) return;
    document.querySelectorAll('#workflow-diff-tabs .hub-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.workflowsFilter.difficulty = btn.dataset.diff || 'all';
    renderWorkflows();
  });

  // Agents Search & Filter
  el.agentsSearchInput?.addEventListener('input', e => {
    state.agentsFilter.search = e.target.value;
    renderAgents();
  });

  el.agentAutonomyTabs?.addEventListener('click', e => {
    const btn = e.target.closest('.hub-filter-btn');
    if (!btn) return;
    document.querySelectorAll('#agent-autonomy-tabs .hub-filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.agentsFilter.autonomy = btn.dataset.autonomy || 'all';
    renderAgents();
  });

  // Dialog Close Buttons
  el.modalPromptCloseBtn?.addEventListener('click', () => el.promptDetailDialog?.close());
  el.modalPromptCloseBottomBtn?.addEventListener('click', () => el.promptDetailDialog?.close());
  el.modalWorkflowCloseBtn?.addEventListener('click', () => el.workflowDetailDialog?.close());
  el.modalWorkflowCloseBottomBtn?.addEventListener('click', () => el.workflowDetailDialog?.close());
  el.modalAgentCloseBtn?.addEventListener('click', () => el.agentDetailDialog?.close());
  el.modalAgentCloseBottomBtn?.addEventListener('click', () => el.agentDetailDialog?.close());

  // Modal Copy Buttons
  el.modalPromptCopyBtn?.addEventListener('click', () => {
    if (state.selectedPrompt) {
      copyToClipboard(state.selectedPrompt.content, `Copied "${state.selectedPrompt.title}"!`);
    }
  });
  el.modalPromptCopyBottomBtn?.addEventListener('click', () => {
    if (state.selectedPrompt) {
      copyToClipboard(state.selectedPrompt.content, `Copied "${state.selectedPrompt.title}"!`);
    }
  });

  el.modalWorkflowCopyBtn?.addEventListener('click', () => {
    if (state.selectedWorkflow) {
      const md = formatWorkflowMarkdown(state.selectedWorkflow);
      copyToClipboard(md, `Copied "${state.selectedWorkflow.title}" guide!`);
    }
  });

  el.modalAgentCopyBtn?.addEventListener('click', async () => {
    if (state.selectedAgent) {
      const md = await getFullAgentMarkdown(state.selectedAgent.id);
      copyToClipboard(md, `Copied "${state.selectedAgent.title}" specification!`);
    }
  });
  el.modalAgentCopyBottomBtn?.addEventListener('click', async () => {
    if (state.selectedAgent) {
      const md = await getFullAgentMarkdown(state.selectedAgent.id);
      copyToClipboard(md, `Copied "${state.selectedAgent.title}" specification!`);
    }
  });

  // Global Delegated Click Handler for Prompt, Workflow, Agent Cards and Linked Tools
  document.addEventListener('click', async e => {
    // 1. Copy Prompt
    const copyPromptBtn = e.target.closest('[data-copy-id]');
    if (copyPromptBtn) {
      e.stopPropagation();
      const id = copyPromptBtn.dataset.copyId;
      const prompt = state.allPrompts.find(p => p.id === id);
      if (prompt) {
        await copyToClipboard(prompt.content, `Copied "${prompt.title}" to clipboard!`);
        const origText = copyPromptBtn.textContent;
        copyPromptBtn.textContent = '✓ COPIED!';
        setTimeout(() => (copyPromptBtn.textContent = origText), 1800);
      }
      return;
    }

    // 2. View Prompt Detail
    const viewPromptBtn = e.target.closest('[data-view-id]');
    if (viewPromptBtn) {
      e.stopPropagation();
      const id = viewPromptBtn.dataset.viewId;
      const prompt = state.allPrompts.find(p => p.id === id);
      if (prompt) openPromptModal(prompt);
      return;
    }

    // 3. Copy Workflow Guide
    const copyWorkflowBtn = e.target.closest('[data-copy-workflow-id]');
    if (copyWorkflowBtn) {
      e.stopPropagation();
      const id = copyWorkflowBtn.dataset.copyWorkflowId;
      const workflow = state.allWorkflows.find(w => w.id === id);
      if (workflow) {
        const md = formatWorkflowMarkdown(workflow);
        await copyToClipboard(md, `Copied "${workflow.title}" guide!`);
        const origText = copyWorkflowBtn.textContent;
        copyWorkflowBtn.textContent = '✓ COPIED GUIDE!';
        setTimeout(() => (copyWorkflowBtn.textContent = origText), 1800);
      }
      return;
    }

    // 4. View Workflow Detail
    const viewWorkflowBtn = e.target.closest('[data-view-workflow-id]');
    if (viewWorkflowBtn) {
      e.stopPropagation();
      const id = viewWorkflowBtn.dataset.viewWorkflowId;
      const workflow = state.allWorkflows.find(w => w.id === id);
      if (workflow) openWorkflowModal(workflow);
      return;
    }

    // 5. Copy Agent Spec
    const copyAgentBtn = e.target.closest('[data-copy-agent-id]');
    if (copyAgentBtn) {
      e.stopPropagation();
      const id = copyAgentBtn.dataset.copyAgentId;
      const agent = state.allAgents.find(a => a.id === id);
      if (agent) {
        const md = await getFullAgentMarkdown(agent.id);
        await copyToClipboard(md, `Copied "${agent.title}" specification!`);
        const origText = copyAgentBtn.textContent;
        copyAgentBtn.textContent = '✓ COPIED SPEC!';
        setTimeout(() => (copyAgentBtn.textContent = origText), 1800);
      }
      return;
    }

    // 6. View Agent Detail
    const viewAgentBtn = e.target.closest('[data-view-agent-id]');
    if (viewAgentBtn) {
      e.stopPropagation();
      const id = viewAgentBtn.dataset.viewAgentId;
      const agent = state.allAgents.find(a => a.id === id);
      if (agent) openAgentModal(agent);
      return;
    }

    // 7. Click on a Linked Tool Pill (e.g. USES: [ 🔗 Superwhisper ])
    const toolPill = e.target.closest('.tool-link-pill');
    if (toolPill) {
      e.stopPropagation();
      const slug = toolPill.dataset.toolSlug;
      const title = toolPill.dataset.toolTitle;
      const tool = state.allDirectoryTools.find(t => 
        (slug && (t.slug === slug || t.id === slug)) || 
        (title && t.name.toLowerCase() === title.toLowerCase())
      );
      if (tool) {
        openToolModal(tool);
      } else if (slug) {
        // Fallback fetch resource
        try {
          const res = await fetch(`/api/resources/${slug}`);
          if (res.ok) {
            const data = await res.json();
            if (data.data) {
              openToolModal({
                id: data.data.id,
                name: data.data.title,
                slug: data.data.slug || slug,
                description: data.data.description,
                category: 'AI',
                pricingLabel: 'Verified',
                website: data.data.url,
                displayUrl: data.data.url ? new URL(data.data.url).hostname : '',
                platforms: ['Web'],
                featured: Boolean(data.data.featured),
              });
            }
          }
        } catch (e) {}
      }
      return;
    }
  });

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

  // 10. "VIEW ALL CLASSICS" CTA
  el.btnSeeTopPicks?.addEventListener('click', () => {
    selectCategory('classics');
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

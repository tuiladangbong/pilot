// Pilot - AI Resource Hub Frontend Application
// Vanilla JavaScript, Web Platform APIs, zero external dependencies

(function () {
  'use strict';

  // --- State ---
  const state = {
    items: [],
    total: 0,
    limit: 50,
    offset: 0,
    q: '',
    tag: null,
    model: null,
    toolKind: null,
    toolCategory: null,
    toolPricing: null,
    favorite: null, // true | null
    sort: 'updated_at',
    order: 'desc',
    viewMode: localStorage.getItem('pilot_view_mode') || 'list',
    currentNav: 'all-resources', // 'all-resources' | 'tools' | 'prompts' | 'favorites'
    activeDetailPrompt: null,
    activeDetailTool: null,
    itemToDelete: null, // { id, title, type: 'prompt' | 'tool' | 'website' }
    tags: [],
    models: [],
    categories: [],
    providers: [],
    isLoading: false,
  };

  // --- DOM Elements ---
  const el = {
    // Header & Global Search
    search: document.getElementById('global-search'),
    searchClear: document.getElementById('search-clear-btn'),
    searchKbd: document.getElementById('search-kbd-hint'),
    viewListBtn: document.getElementById('view-list-btn'),
    viewGridBtn: document.getElementById('view-grid-btn'),
    mobileMenuToggle: document.getElementById('mobile-menu-toggle'),
    sidebar: document.getElementById('app-sidebar'),

    // Add Dropdown
    addBtn: document.getElementById('add-btn'),
    addDropdownMenu: document.getElementById('add-dropdown-menu'),
    menuAddToolBtn: document.getElementById('menu-add-tool-btn'),
    menuAddPromptBtn: document.getElementById('menu-add-prompt-btn'),

    // View & Active Filters
    currentViewTitle: document.getElementById('current-view-title'),
    activeFiltersContainer: document.getElementById('active-filters-container'),
    sortSelect: document.getElementById('sort-select'),

    // Badges & Navigation
    badgeAllResourcesCount: document.getElementById('badge-all-resources-count'),
    badgeToolsCount: document.getElementById('badge-tools-count'),
    badgePromptsCount: document.getElementById('badge-prompts-count'),
    badgeFavCount: document.getElementById('badge-fav-count'),

    // Sidebar Filters
    sidebarToolsFilters: document.getElementById('sidebar-tools-filters'),
    toolKindFilterSelect: document.getElementById('tool-kind-filter-select'),
    toolCategoryFilterSelect: document.getElementById('tool-category-filter-select'),
    toolPricingFilterSelect: document.getElementById('tool-pricing-filter-select'),
    sidebarPromptsFilters: document.getElementById('sidebar-prompts-filters'),
    modelFilterSelect: document.getElementById('model-filter-select'),
    modelsDatalist: document.getElementById('models-datalist'),
    categoriesDatalist: document.getElementById('categories-datalist'),
    providersDatalist: document.getElementById('providers-datalist'),
    sidebarTagsList: document.getElementById('sidebar-tags-list'),
    clearTagBtn: document.getElementById('clear-tag-btn'),

    // Resource Stream & States
    resourcesList: document.getElementById('resources-list'),
    loadMoreWrapper: document.getElementById('load-more-wrapper'),
    loadMoreBtn: document.getElementById('load-more-btn'),
    loadingState: document.getElementById('loading-state'),
    loadingText: document.getElementById('loading-text'),
    emptyState: document.getElementById('empty-state'),
    emptyStateTitle: document.getElementById('empty-state-title'),
    emptyStateDesc: document.getElementById('empty-state-desc'),
    emptyAddToolBtn: document.getElementById('empty-add-tool-btn'),
    emptyAddPromptBtn: document.getElementById('empty-add-prompt-btn'),
    toastContainer: document.getElementById('toast-container'),

    // Tool Form Dialog
    toolFormDialog: document.getElementById('tool-form-dialog'),
    toolForm: document.getElementById('tool-form'),
    toolFormTitle: document.getElementById('tool-form-dialog-title'),
    toolFormError: document.getElementById('tool-form-error-banner'),
    toolFormWarning: document.getElementById('tool-form-warning-banner'),
    toolFormCloseBtn: document.getElementById('tool-form-close-btn'),
    toolFormCancelBtn: document.getElementById('tool-form-cancel-btn'),
    toolFormSubmitBtn: document.getElementById('tool-form-submit-btn'),
    inputToolId: document.getElementById('form-tool-id'),
    inputToolUrl: document.getElementById('tool-url'),
    toolFetchMetaBtn: document.getElementById('tool-fetch-meta-btn'),
    inputToolTitle: document.getElementById('tool-title'),
    inputToolKind: document.getElementById('tool-kind'),
    inputToolPricing: document.getElementById('tool-pricing'),
    inputToolFavorite: document.getElementById('tool-favorite'),
    inputToolProvider: document.getElementById('tool-provider'),
    inputToolCategory: document.getElementById('tool-category'),
    inputToolDescription: document.getElementById('tool-description'),
    inputToolNotes: document.getElementById('tool-notes'),
    inputToolTags: document.getElementById('tool-tags'),
    inputToolFaviconUrl: document.getElementById('tool-favicon-url'),

    // Tool Detail Dialog
    toolDetailDialog: document.getElementById('tool-detail-dialog'),
    toolDetailCloseBtn: document.getElementById('tool-detail-close-btn'),
    toolDetailFavBtn: document.getElementById('tool-detail-fav-btn'),
    toolDetailFavicon: document.getElementById('tool-detail-favicon'),
    toolDetailTitle: document.getElementById('tool-detail-title'),
    toolDetailKind: document.getElementById('tool-detail-kind'),
    toolDetailPricing: document.getElementById('tool-detail-pricing'),
    toolDetailCategory: document.getElementById('tool-detail-category'),
    toolDetailProvider: document.getElementById('tool-detail-provider'),
    toolDetailUpdated: document.getElementById('tool-detail-updated'),
    toolDetailUrl: document.getElementById('tool-detail-url'),
    toolDetailCopyUrlBtn: document.getElementById('tool-detail-copy-url-btn'),
    toolDetailOpenLink: document.getElementById('tool-detail-open-link'),
    toolDetailDescription: document.getElementById('tool-detail-description'),
    toolDetailNotesWrapper: document.getElementById('tool-detail-notes-wrapper'),
    toolDetailNotes: document.getElementById('tool-detail-notes'),
    toolDetailTagsRow: document.getElementById('tool-detail-tags-row'),
    toolDetailDeleteBtn: document.getElementById('tool-detail-delete-btn'),
    toolDetailDuplicateBtn: document.getElementById('tool-detail-duplicate-btn'),
    toolDetailEditBtn: document.getElementById('tool-detail-edit-btn'),

    // Prompt Form Dialog
    promptFormDialog: document.getElementById('prompt-form-dialog'),
    promptForm: document.getElementById('prompt-form'),
    promptFormTitle: document.getElementById('form-dialog-title'),
    promptFormError: document.getElementById('form-error-banner'),
    promptFormCloseBtn: document.getElementById('form-close-btn'),
    promptFormCancelBtn: document.getElementById('form-cancel-btn'),
    promptFormSubmitBtn: document.getElementById('form-submit-btn'),
    inputPromptId: document.getElementById('form-prompt-id'),
    inputPromptTitle: document.getElementById('prompt-title'),
    inputPromptModel: document.getElementById('prompt-model'),
    inputPromptFavorite: document.getElementById('prompt-favorite'),
    inputPromptDescription: document.getElementById('prompt-description'),
    inputPromptContent: document.getElementById('prompt-content'),
    inputPromptTags: document.getElementById('prompt-tags'),

    // Prompt Detail Dialog
    promptDetailDialog: document.getElementById('prompt-detail-dialog'),
    promptDetailCloseBtn: document.getElementById('detail-close-btn'),
    promptDetailFavBtn: document.getElementById('detail-fav-btn'),
    promptDetailTitle: document.getElementById('detail-title'),
    promptDetailModel: document.getElementById('detail-model'),
    promptDetailUpdated: document.getElementById('detail-updated'),
    promptDetailDescription: document.getElementById('detail-description'),
    promptDetailTagsRow: document.getElementById('detail-tags-row'),
    promptDetailContent: document.getElementById('detail-content'),
    promptDetailCopyBtn: document.getElementById('detail-copy-btn'),
    promptDetailEditBtn: document.getElementById('detail-edit-btn'),
    promptDetailDuplicateBtn: document.getElementById('detail-duplicate-btn'),
    promptDetailDeleteBtn: document.getElementById('detail-delete-btn'),

    // Delete Confirmation Dialog
    deleteDialog: document.getElementById('delete-confirm-dialog'),
    deleteDialogTitle: document.getElementById('delete-dialog-title'),
    deletePromptName: document.getElementById('delete-prompt-name'),
    deleteCancelBtn: document.getElementById('delete-cancel-btn'),
    deleteConfirmBtn: document.getElementById('delete-confirm-btn'),
  };

  // --- Utility Functions ---

  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    el.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(8px)';
      toast.style.transition = 'all 0.2s';
      setTimeout(() => toast.remove(), 200);
    }, 2500);
  }

  function formatRelativeDate(isoDateString) {
    if (!isoDateString) return '';
    try {
      const date = new Date(isoDateString);
      const now = new Date();
      const diffSec = Math.floor((now - date) / 1000);
      if (diffSec < 60) return 'just now';
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHours = Math.floor(diffMin / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return '';
    }
  }

  async function copyToClipboard(text, btnElement) {
    try {
      await navigator.clipboard.writeText(text);
      if (btnElement) {
        const originalContent = btnElement.innerHTML;
        btnElement.classList.add('copied');
        btnElement.textContent = 'Copied ✓';
        setTimeout(() => {
          btnElement.classList.remove('copied');
          btnElement.innerHTML = originalContent;
        }, 1800);
      }
      showToast('Copied to clipboard');
    } catch {
      showToast('Failed to copy to clipboard', 'error');
    }
  }

  function debounce(fn, ms) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  // --- API Requests ---

  async function apiFetch(endpoint, options = {}) {
    try {
      const response = await fetch(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
        ...options,
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const errorMsg = data?.error?.message || `Request failed (${response.status})`;
        throw new Error(errorMsg);
      }

      return data;
    } catch (err) {
      console.error('API Error:', err);
      throw err;
    }
  }

  // --- Data Loading & Navigation ---

  async function loadData(append = false) {
    if (!append) {
      state.offset = 0;
      el.resourcesList.innerHTML = '';
      el.loadingState.classList.remove('hidden');
      el.emptyState.classList.add('hidden');
    }

    state.isLoading = true;

    try {
      const params = new URLSearchParams();
      if (state.q) params.set('q', state.q);
      if (state.tag) params.set('tag', state.tag);
      if (state.favorite !== null) params.set('favorite', String(state.favorite));
      params.set('sort', state.sort);
      params.set('order', state.order);
      params.set('limit', String(state.limit));
      params.set('offset', String(state.offset));

      let endpoint = '/api/resources';

      if (state.currentNav === 'tools') {
        endpoint = '/api/tools';
        if (state.toolKind) params.set('kind', state.toolKind);
        if (state.toolCategory) params.set('category', state.toolCategory);
        if (state.toolPricing) params.set('pricing', state.toolPricing);
      } else if (state.currentNav === 'prompts') {
        endpoint = '/api/prompts';
        if (state.model) params.set('model', state.model);
      } else if (state.currentNav === 'favorites') {
        endpoint = '/api/resources';
        params.set('favorite', 'true');
      } else {
        // all-resources: generic mixed listing
        endpoint = '/api/resources';
        if (state.toolKind) params.set('type', state.toolKind);
      }

      const res = await apiFetch(`${endpoint}?${params.toString()}`);
      const newItems = res.data || [];
      state.total = res.meta?.total ?? 0;

      if (append) {
        state.items.push(...newItems);
      } else {
        state.items = newItems;
      }

      renderResourcesList(append);
      updateCounts();
      updateActiveFilters();

      // Load More Visibility
      if (state.items.length < state.total) {
        el.loadMoreWrapper.classList.remove('hidden');
      } else {
        el.loadMoreWrapper.classList.add('hidden');
      }
    } catch (err) {
      showToast(err.message, 'error');
      if (!append && state.items.length === 0) {
        showEmptyState('Error loading resources', err.message);
      }
    } finally {
      state.isLoading = false;
      el.loadingState.classList.add('hidden');
    }
  }

  async function loadTags() {
    try {
      const res = await apiFetch('/api/tags');
      state.tags = res.data || [];
      renderTagsList();
    } catch (err) {
      console.warn('Failed to load tags:', err);
    }
  }

  async function loadModels() {
    try {
      const res = await apiFetch('/api/models');
      state.models = res.data || [];
      renderModelOptions();
    } catch (err) {
      console.warn('Failed to load models:', err);
    }
  }

  async function loadToolMetadataOptions() {
    try {
      const [catRes, provRes] = await Promise.all([
        apiFetch('/api/tools/categories'),
        apiFetch('/api/tools/providers'),
      ]);
      state.categories = catRes.data || [];
      state.providers = provRes.data || [];
      renderCategoryAndProviderOptions();
    } catch (err) {
      console.warn('Failed to load tool options:', err);
    }
  }

  async function updateCounts() {
    try {
      const [allRes, toolsRes, promptsRes, favRes] = await Promise.all([
        apiFetch('/api/resources?limit=1'),
        apiFetch('/api/tools?limit=1'),
        apiFetch('/api/prompts?limit=1'),
        apiFetch('/api/resources?favorite=true&limit=1'),
      ]);

      el.badgeAllResourcesCount.textContent = allRes.meta?.total ?? 0;
      el.badgeToolsCount.textContent = toolsRes.meta?.total ?? 0;
      el.badgePromptsCount.textContent = promptsRes.meta?.total ?? 0;
      el.badgeFavCount.textContent = favRes.meta?.total ?? 0;
    } catch {
      // Non-critical badge counts
    }
  }

  // --- Rendering Functions (XSS Safe) ---

  function renderTagsList() {
    el.sidebarTagsList.innerHTML = '';

    if (state.tags.length === 0) {
      const hint = document.createElement('span');
      hint.className = 'empty-hint';
      hint.textContent = 'No tags yet';
      el.sidebarTagsList.appendChild(hint);
      el.clearTagBtn.classList.add('hidden');
      return;
    }

    el.clearTagBtn.classList.toggle('hidden', !state.tag);

    for (const tagItem of state.tags) {
      const btn = document.createElement('button');
      btn.className = `tag-nav-btn ${state.tag === tagItem.name ? 'active' : ''}`;

      const nameSpan = document.createElement('span');
      nameSpan.textContent = `#${tagItem.name}`;

      const countSpan = document.createElement('span');
      countSpan.className = 'tag-nav-count';
      countSpan.textContent = String(tagItem.count);

      btn.appendChild(nameSpan);
      btn.appendChild(countSpan);

      btn.addEventListener('click', () => {
        if (state.tag === tagItem.name) {
          state.tag = null;
        } else {
          state.tag = tagItem.name;
        }
        loadData();
        renderTagsList();
      });

      el.sidebarTagsList.appendChild(btn);
    }
  }

  function renderModelOptions() {
    const current = el.modelFilterSelect.value;
    el.modelFilterSelect.innerHTML = '<option value="">All Models</option>';
    el.modelsDatalist.innerHTML = '';

    for (const m of state.models) {
      const opt = document.createElement('option');
      opt.value = m;
      opt.textContent = m;
      if (m === current) opt.selected = true;
      el.modelFilterSelect.appendChild(opt);

      const dOpt = document.createElement('option');
      dOpt.value = m;
      el.modelsDatalist.appendChild(dOpt);
    }
  }

  function renderCategoryAndProviderOptions() {
    // Categories select & datalist
    const currentCat = el.toolCategoryFilterSelect.value;
    el.toolCategoryFilterSelect.innerHTML = '<option value="">All Categories</option>';
    el.categoriesDatalist.innerHTML = '';

    for (const c of state.categories) {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      if (c === currentCat) opt.selected = true;
      el.toolCategoryFilterSelect.appendChild(opt);

      const dOpt = document.createElement('option');
      dOpt.value = c;
      el.categoriesDatalist.appendChild(dOpt);
    }

    // Providers datalist
    el.providersDatalist.innerHTML = '';
    for (const p of state.providers) {
      const dOpt = document.createElement('option');
      dOpt.value = p;
      el.providersDatalist.appendChild(dOpt);
    }
  }

  function renderResourcesList(append = false) {
    if (!append) {
      el.resourcesList.innerHTML = '';
    }

    if (state.items.length === 0) {
      el.resourcesList.classList.add('hidden');
      if (state.q) {
        showEmptyState('No resources match this search', `No items matching "${state.q}".`);
      } else if (state.currentNav === 'favorites') {
        showEmptyState('Nothing favorited yet', 'Star useful prompts, tools, and websites to find them here.');
      } else if (state.tag) {
        showEmptyState(`No resources tagged #${state.tag}`, 'Try selecting another tag or clearing the filter.');
      } else if (state.currentNav === 'tools') {
        showEmptyState('No AI tools or websites yet', 'Save your first AI tool or reference site to build your collection.');
      } else if (state.currentNav === 'prompts') {
        showEmptyState('No prompts yet', 'Save your first AI prompt to build your operating library.');
      } else {
        showEmptyState('No resources found', 'Save your first AI tool, website, or prompt to get started.');
      }
      return;
    }

    el.emptyState.classList.add('hidden');
    el.resourcesList.classList.remove('hidden');

    const sliceItems = append ? state.items.slice(state.offset) : state.items;
    for (const item of sliceItems) {
      // Determine if item is prompt or tool
      const itemType = item.type || (item.content !== undefined ? 'prompt' : 'tool');
      if (itemType === 'prompt') {
        const card = createPromptCardElement(item);
        el.resourcesList.appendChild(card);
      } else {
        const card = createToolCardElement(item);
        el.resourcesList.appendChild(card);
      }
    }
  }

  // --- Card Elements Builders ---

  function createToolCardElement(tool) {
    const card = document.createElement('article');
    card.className = 'prompt-card';
    card.setAttribute('data-id', tool.id);

    // Kind & Pricing normalizers
    const kind = tool.kind || tool.type || 'tool';
    const pricing = tool.pricing || tool.extra?.pricing || 'Unknown';
    const hostname = tool.hostname || tool.extra?.hostname || '';
    const url = tool.url || tool.extra?.url || '#';
    const category = tool.category || tool.extra?.category || null;
    const provider = tool.provider || tool.extra?.provider || null;

    // Header Row
    const headerRow = document.createElement('div');
    headerRow.className = 'card-header-row';

    const titleGroup = document.createElement('div');
    titleGroup.className = 'card-title-group';

    // Favorite Button
    const favBtn = document.createElement('button');
    favBtn.className = `favorite-star-btn ${tool.favorite ? 'active' : ''}`;
    favBtn.title = tool.favorite ? 'Unfavorite' : 'Favorite';
    favBtn.setAttribute('aria-label', favBtn.title);
    favBtn.innerHTML = `
      <svg class="star-icon" width="16" height="16" viewBox="0 0 24 24" fill="${tool.favorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    `;
    favBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleToolFavorite(tool, favBtn);
    });

    // Favicon image or fallback globe
    const faviconImg = document.createElement('img');
    faviconImg.className = 'tool-favicon';
    faviconImg.alt = '';
    faviconImg.width = 18;
    faviconImg.height = 18;
    faviconImg.loading = 'lazy';
    faviconImg.src = tool.faviconUrl || `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
    faviconImg.onerror = () => {
      faviconImg.style.display = 'none';
    };

    const title = document.createElement('h2');
    title.className = 'card-title';
    title.textContent = tool.title;

    titleGroup.appendChild(favBtn);
    titleGroup.appendChild(faviconImg);
    titleGroup.appendChild(title);

    // Kind Badge
    const kindBadge = document.createElement('span');
    kindBadge.className = `badge badge-kind kind-${kind}`;
    kindBadge.textContent = kind === 'website' ? 'Website' : 'Tool';
    titleGroup.appendChild(kindBadge);

    // Pricing Badge
    if (pricing && pricing !== 'Unknown') {
      const pricingBadge = document.createElement('span');
      const pricingClass = pricing.toLowerCase().replace(/\s+/g, '');
      pricingBadge.className = `badge badge-pricing pricing-${pricingClass}`;
      pricingBadge.textContent = pricing;
      titleGroup.appendChild(pricingBadge);
    }

    // Quick Actions
    const quickActions = document.createElement('div');
    quickActions.className = 'card-actions-quick';

    const copyBtn = document.createElement('button');
    copyBtn.className = 'btn btn-copy';
    copyBtn.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
      <span>Copy URL</span>
    `;
    copyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      copyToClipboard(url, copyBtn);
    });

    const openLink = document.createElement('a');
    openLink.className = 'btn btn-secondary btn-sm';
    openLink.href = url;
    openLink.target = '_blank';
    openLink.rel = 'noopener noreferrer';
    openLink.innerHTML = `
      <span>Open</span>
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
    `;
    openLink.addEventListener('click', (e) => e.stopPropagation());

    quickActions.appendChild(copyBtn);
    quickActions.appendChild(openLink);

    headerRow.appendChild(titleGroup);
    headerRow.appendChild(quickActions);
    card.appendChild(headerRow);

    // Host & Provider & Category row
    const hostRow = document.createElement('div');
    hostRow.className = 'card-host-row';
    hostRow.style.display = 'flex';
    hostRow.style.alignItems = 'center';
    hostRow.style.gap = '0.5rem';
    hostRow.style.margin = '0.35rem 0';

    if (hostname) {
      const hostLink = document.createElement('a');
      hostLink.className = 'tool-host-link';
      hostLink.href = url;
      hostLink.target = '_blank';
      hostLink.rel = 'noopener noreferrer';
      hostLink.textContent = hostname;
      hostLink.addEventListener('click', (e) => e.stopPropagation());
      hostRow.appendChild(hostLink);
    }

    if (category) {
      const catBadge = document.createElement('span');
      catBadge.className = 'badge badge-category';
      catBadge.textContent = category;
      hostRow.appendChild(catBadge);
    }

    if (provider) {
      const provBadge = document.createElement('span');
      provBadge.className = 'badge badge-provider';
      provBadge.textContent = provider;
      hostRow.appendChild(provBadge);
    }

    card.appendChild(hostRow);

    // Optional Description
    if (tool.description) {
      const desc = document.createElement('p');
      desc.className = 'card-description';
      desc.textContent = tool.description;
      card.appendChild(desc);
    }

    // Optional Notes snippet if in list view and no description
    if (!tool.description && tool.notes) {
      const notesSnippet = document.createElement('p');
      notesSnippet.className = 'card-description';
      notesSnippet.style.fontStyle = 'italic';
      notesSnippet.textContent = tool.notes;
      card.appendChild(notesSnippet);
    }

    // Footer row: Tags & Date
    const footerRow = document.createElement('div');
    footerRow.className = 'card-footer-row';

    const metaLeft = document.createElement('div');
    metaLeft.className = 'card-meta-left';

    const tags = Array.isArray(tool.tags) ? tool.tags : [];
    if (tags.length > 0) {
      for (const t of tags.slice(0, 4)) {
        const tagPill = document.createElement('span');
        tagPill.className = 'card-tag';
        tagPill.textContent = `#${t}`;
        tagPill.addEventListener('click', (e) => {
          e.stopPropagation();
          state.tag = t;
          loadData();
          renderTagsList();
        });
        metaLeft.appendChild(tagPill);
      }
      if (tags.length > 4) {
        const moreTag = document.createElement('span');
        moreTag.className = 'card-tag';
        moreTag.textContent = `+${tags.length - 4}`;
        metaLeft.appendChild(moreTag);
      }
    }

    const timeSpan = document.createElement('span');
    timeSpan.textContent = formatRelativeDate(tool.updatedAt);
    metaLeft.appendChild(timeSpan);

    footerRow.appendChild(metaLeft);
    card.appendChild(footerRow);

    // Open detail dialog on card click
    card.addEventListener('click', () => {
      openToolDetailDialog(tool);
    });

    return card;
  }

  function createPromptCardElement(prompt) {
    const card = document.createElement('article');
    card.className = 'prompt-card';
    card.setAttribute('data-id', prompt.id);

    // Header row: Title + Actions (Favorite + Copy)
    const headerRow = document.createElement('div');
    headerRow.className = 'card-header-row';

    const titleGroup = document.createElement('div');
    titleGroup.className = 'card-title-group';

    // Favorite button
    const favBtn = document.createElement('button');
    favBtn.className = `favorite-star-btn ${prompt.favorite ? 'active' : ''}`;
    favBtn.title = prompt.favorite ? 'Unfavorite' : 'Favorite';
    favBtn.setAttribute('aria-label', favBtn.title);
    favBtn.innerHTML = `
      <svg class="star-icon" width="16" height="16" viewBox="0 0 24 24" fill="${prompt.favorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    `;
    favBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePromptFavorite(prompt, favBtn);
    });

    const title = document.createElement('h2');
    title.className = 'card-title';
    title.textContent = prompt.title;

    titleGroup.appendChild(favBtn);
    titleGroup.appendChild(title);

    // Prompt Badge
    const promptBadge = document.createElement('span');
    promptBadge.className = 'badge badge-kind kind-prompt';
    promptBadge.textContent = 'Prompt';
    titleGroup.appendChild(promptBadge);

    const quickActions = document.createElement('div');
    quickActions.className = 'card-actions-quick';

    const copyBtn = document.createElement('button');
    copyBtn.className = 'btn btn-copy';
    copyBtn.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
      <span>Copy</span>
    `;
    copyBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const content = prompt.content || prompt.extra?.content || '';
      copyToClipboard(content, copyBtn);
    });

    quickActions.appendChild(copyBtn);
    headerRow.appendChild(titleGroup);
    headerRow.appendChild(quickActions);
    card.appendChild(headerRow);

    // Optional Description
    if (prompt.description) {
      const desc = document.createElement('p');
      desc.className = 'card-description';
      desc.textContent = prompt.description;
      card.appendChild(desc);
    }

    // Snippet preview (in list view)
    const content = prompt.content || prompt.extra?.content;
    if (content) {
      const preview = document.createElement('div');
      preview.className = 'card-content-preview';
      preview.textContent = content;
      card.appendChild(preview);
    }

    // Footer row: Model, Tags, Date
    const footerRow = document.createElement('div');
    footerRow.className = 'card-footer-row';

    const metaLeft = document.createElement('div');
    metaLeft.className = 'card-meta-left';

    const model = prompt.model || prompt.extra?.model;
    if (model) {
      const modelBadge = document.createElement('span');
      modelBadge.className = 'model-badge';
      modelBadge.textContent = model;
      metaLeft.appendChild(modelBadge);
    }

    const tags = Array.isArray(prompt.tags) ? prompt.tags : [];
    if (tags.length > 0) {
      for (const t of tags.slice(0, 4)) {
        const tagPill = document.createElement('span');
        tagPill.className = 'card-tag';
        tagPill.textContent = `#${t}`;
        tagPill.addEventListener('click', (e) => {
          e.stopPropagation();
          state.tag = t;
          loadData();
          renderTagsList();
        });
        metaLeft.appendChild(tagPill);
      }
      if (tags.length > 4) {
        const moreTag = document.createElement('span');
        moreTag.className = 'card-tag';
        moreTag.textContent = `+${tags.length - 4}`;
        metaLeft.appendChild(moreTag);
      }
    }

    const timeSpan = document.createElement('span');
    timeSpan.textContent = formatRelativeDate(prompt.updatedAt);
    metaLeft.appendChild(timeSpan);

    footerRow.appendChild(metaLeft);
    card.appendChild(footerRow);

    // Open detail on card click
    card.addEventListener('click', () => {
      openPromptDetailDialog(prompt);
    });

    return card;
  }

  function showEmptyState(title, desc) {
    el.emptyStateTitle.textContent = title;
    el.emptyStateDesc.textContent = desc;
    el.emptyState.classList.remove('hidden');
  }

  function updateActiveFilters() {
    el.activeFiltersContainer.innerHTML = '';

    // Title text
    if (state.currentNav === 'favorites') {
      el.currentViewTitle.textContent = 'Favorites';
    } else if (state.currentNav === 'tools') {
      el.currentViewTitle.textContent = 'Tools & Websites';
    } else if (state.currentNav === 'prompts') {
      el.currentViewTitle.textContent = 'Prompts';
    } else {
      el.currentViewTitle.textContent = 'All Resources';
    }

    // Pill for Search
    if (state.q) {
      const pill = createFilterPill(`Search: "${state.q}"`, () => {
        state.q = '';
        el.search.value = '';
        el.searchClear.classList.add('hidden');
        loadData();
      });
      el.activeFiltersContainer.appendChild(pill);
    }

    // Pill for Tag
    if (state.tag) {
      const pill = createFilterPill(`#${state.tag}`, () => {
        state.tag = null;
        loadData();
        renderTagsList();
      });
      el.activeFiltersContainer.appendChild(pill);
    }

    // Pill for Tool Kind
    if (state.toolKind) {
      const pill = createFilterPill(`Kind: ${state.toolKind}`, () => {
        state.toolKind = null;
        el.toolKindFilterSelect.value = '';
        loadData();
      });
      el.activeFiltersContainer.appendChild(pill);
    }

    // Pill for Tool Category
    if (state.toolCategory) {
      const pill = createFilterPill(`Category: ${state.toolCategory}`, () => {
        state.toolCategory = null;
        el.toolCategoryFilterSelect.value = '';
        loadData();
      });
      el.activeFiltersContainer.appendChild(pill);
    }

    // Pill for Tool Pricing
    if (state.toolPricing) {
      const pill = createFilterPill(`Pricing: ${state.toolPricing}`, () => {
        state.toolPricing = null;
        el.toolPricingFilterSelect.value = '';
        loadData();
      });
      el.activeFiltersContainer.appendChild(pill);
    }

    // Pill for Prompt Model
    if (state.model) {
      const pill = createFilterPill(`Model: ${state.model}`, () => {
        state.model = null;
        el.modelFilterSelect.value = '';
        loadData();
      });
      el.activeFiltersContainer.appendChild(pill);
    }
  }

  function createFilterPill(text, onRemove) {
    const pill = document.createElement('span');
    pill.className = 'filter-pill';

    const textNode = document.createTextNode(text);
    const removeBtn = document.createElement('button');
    removeBtn.className = 'filter-pill-remove';
    removeBtn.setAttribute('aria-label', `Remove filter ${text}`);
    removeBtn.innerHTML = '&times;';
    removeBtn.addEventListener('click', onRemove);

    pill.appendChild(textNode);
    pill.appendChild(removeBtn);
    return pill;
  }

  // --- Favorites Toggle ---

  async function togglePromptFavorite(prompt, starButtonElement) {
    const nextState = !prompt.favorite;
    prompt.favorite = nextState;

    if (starButtonElement) {
      starButtonElement.classList.toggle('active', nextState);
      const starIcon = starButtonElement.querySelector('.star-icon');
      if (starIcon) {
        starIcon.setAttribute('fill', nextState ? 'currentColor' : 'none');
      }
    }

    try {
      await apiFetch(`/api/prompts/${prompt.id}/favorite`, {
        method: 'PATCH',
        body: JSON.stringify({ favorite: nextState }),
      });
      updateCounts();
      showToast(nextState ? 'Marked as favorite' : 'Removed from favorites');
      if (state.currentNav === 'favorites' && !nextState) {
        loadData();
      }
    } catch (err) {
      prompt.favorite = !nextState;
      if (starButtonElement) {
        starButtonElement.classList.toggle('active', !nextState);
      }
      showToast(err.message, 'error');
    }
  }

  async function toggleToolFavorite(tool, starButtonElement) {
    const nextState = !tool.favorite;
    tool.favorite = nextState;

    if (starButtonElement) {
      starButtonElement.classList.toggle('active', nextState);
      const starIcon = starButtonElement.querySelector('.star-icon');
      if (starIcon) {
        starIcon.setAttribute('fill', nextState ? 'currentColor' : 'none');
      }
    }

    try {
      await apiFetch(`/api/tools/${tool.id}/favorite`, {
        method: 'PATCH',
        body: JSON.stringify({ favorite: nextState }),
      });
      updateCounts();
      showToast(nextState ? 'Marked as favorite' : 'Removed from favorites');
      if (state.currentNav === 'favorites' && !nextState) {
        loadData();
      }
    } catch (err) {
      tool.favorite = !nextState;
      if (starButtonElement) {
        starButtonElement.classList.toggle('active', !nextState);
      }
      showToast(err.message, 'error');
    }
  }

  // --- Tool Detail Dialog ---

  async function openToolDetailDialog(toolOrId) {
    let tool = typeof toolOrId === 'string' ? null : toolOrId;

    if (!tool || !tool.url) {
      const id = typeof toolOrId === 'string' ? toolOrId : toolOrId.id;
      try {
        const res = await apiFetch(`/api/tools/${id}`);
        tool = res.data;
      } catch (err) {
        showToast('Failed to load tool details', 'error');
        return;
      }
    }

    state.activeDetailTool = tool;

    el.toolDetailTitle.textContent = tool.title;
    el.toolDetailFavBtn.classList.toggle('active', Boolean(tool.favorite));
    const starIcon = el.toolDetailFavBtn.querySelector('.star-icon');
    if (starIcon) {
      starIcon.setAttribute('fill', tool.favorite ? 'currentColor' : 'none');
    }

    // Favicon
    if (tool.faviconUrl || tool.hostname) {
      el.toolDetailFavicon.src = tool.faviconUrl || `https://www.google.com/s2/favicons?domain=${tool.hostname}&sz=32`;
      el.toolDetailFavicon.classList.remove('hidden');
    } else {
      el.toolDetailFavicon.classList.add('hidden');
    }

    // Meta badges
    el.toolDetailKind.textContent = tool.kind === 'website' ? 'Website' : 'Tool';
    el.toolDetailKind.className = `badge badge-kind kind-${tool.kind}`;

    const pricing = tool.pricing || 'Unknown';
    el.toolDetailPricing.textContent = pricing;
    el.toolDetailPricing.className = `badge badge-pricing pricing-${pricing.toLowerCase().replace(/\s+/g, '')}`;

    if (tool.category) {
      el.toolDetailCategory.textContent = tool.category;
      el.toolDetailCategory.classList.remove('hidden');
    } else {
      el.toolDetailCategory.classList.add('hidden');
    }

    if (tool.provider) {
      el.toolDetailProvider.textContent = tool.provider;
      el.toolDetailProvider.classList.remove('hidden');
    } else {
      el.toolDetailProvider.classList.add('hidden');
    }

    el.toolDetailUpdated.textContent = `Updated ${formatRelativeDate(tool.updatedAt)}`;

    // URL & Direct Open
    el.toolDetailUrl.textContent = tool.url;
    el.toolDetailOpenLink.href = tool.url;

    // Description
    if (tool.description) {
      el.toolDetailDescription.textContent = tool.description;
      el.toolDetailDescription.classList.remove('hidden');
    } else {
      el.toolDetailDescription.classList.add('hidden');
    }

    // Notes
    if (tool.notes) {
      el.toolDetailNotes.textContent = tool.notes;
      el.toolDetailNotesWrapper.classList.remove('hidden');
    } else {
      el.toolDetailNotesWrapper.classList.add('hidden');
    }

    // Tags
    el.toolDetailTagsRow.innerHTML = '';
    const tags = Array.isArray(tool.tags) ? tool.tags : [];
    if (tags.length > 0) {
      for (const t of tags) {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'card-tag';
        tagSpan.textContent = `#${t}`;
        tagSpan.addEventListener('click', () => {
          el.toolDetailDialog.close();
          state.tag = t;
          loadData();
          renderTagsList();
        });
        el.toolDetailTagsRow.appendChild(tagSpan);
      }
      el.toolDetailTagsRow.classList.remove('hidden');
    } else {
      el.toolDetailTagsRow.classList.add('hidden');
    }

    // Update URL query param without reload
    const currentUrl = new URL(window.location);
    currentUrl.searchParams.set('tool', tool.id);
    currentUrl.searchParams.delete('prompt');
    window.history.replaceState({}, '', currentUrl);

    el.toolDetailDialog.showModal();
  }

  function closeToolDetailDialog() {
    state.activeDetailTool = null;
    el.toolDetailDialog.close();

    const currentUrl = new URL(window.location);
    currentUrl.searchParams.delete('tool');
    window.history.replaceState({}, '', currentUrl);
  }

  // --- Prompt Detail Dialog ---

  async function openPromptDetailDialog(promptOrId) {
    let prompt = typeof promptOrId === 'string' ? null : promptOrId;

    if (!prompt || !prompt.content) {
      const id = typeof promptOrId === 'string' ? promptOrId : promptOrId.id;
      try {
        const res = await apiFetch(`/api/prompts/${id}`);
        prompt = res.data;
      } catch (err) {
        showToast('Failed to load prompt details', 'error');
        return;
      }
    }

    state.activeDetailPrompt = prompt;

    el.promptDetailTitle.textContent = prompt.title;
    el.promptDetailFavBtn.classList.toggle('active', Boolean(prompt.favorite));
    const starIcon = el.promptDetailFavBtn.querySelector('.star-icon');
    if (starIcon) {
      starIcon.setAttribute('fill', prompt.favorite ? 'currentColor' : 'none');
    }

    // Model
    if (prompt.model) {
      el.promptDetailModel.textContent = prompt.model;
      el.promptDetailModel.classList.remove('hidden');
    } else {
      el.promptDetailModel.classList.add('hidden');
    }

    // Dates
    el.promptDetailUpdated.textContent = `Updated ${formatRelativeDate(prompt.updatedAt)}`;

    // Description
    if (prompt.description) {
      el.promptDetailDescription.textContent = prompt.description;
      el.promptDetailDescription.classList.remove('hidden');
    } else {
      el.promptDetailDescription.classList.add('hidden');
    }

    // Tags
    el.promptDetailTagsRow.innerHTML = '';
    const tags = Array.isArray(prompt.tags) ? prompt.tags : [];
    if (tags.length > 0) {
      for (const t of tags) {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'card-tag';
        tagSpan.textContent = `#${t}`;
        tagSpan.addEventListener('click', () => {
          el.promptDetailDialog.close();
          state.tag = t;
          loadData();
          renderTagsList();
        });
        el.promptDetailTagsRow.appendChild(tagSpan);
      }
      el.promptDetailTagsRow.classList.remove('hidden');
    } else {
      el.promptDetailTagsRow.classList.add('hidden');
    }

    // Content
    el.promptDetailContent.textContent = prompt.content;

    // Update URL query param without reload
    const currentUrl = new URL(window.location);
    currentUrl.searchParams.set('prompt', prompt.id);
    currentUrl.searchParams.delete('tool');
    window.history.replaceState({}, '', currentUrl);

    el.promptDetailDialog.showModal();
  }

  function closePromptDetailDialog() {
    state.activeDetailPrompt = null;
    el.promptDetailDialog.close();

    const currentUrl = new URL(window.location);
    currentUrl.searchParams.delete('prompt');
    window.history.replaceState({}, '', currentUrl);
  }

  // --- Tool Form Dialog (Create / Edit) ---

  function openToolFormDialog(toolToEdit = null) {
    el.toolFormError.classList.add('hidden');
    el.toolFormError.textContent = '';
    el.toolFormWarning.classList.add('hidden');
    el.toolFormWarning.textContent = '';
    el.toolFormSubmitBtn.disabled = false;

    if (toolToEdit) {
      el.toolFormTitle.textContent = 'Edit Tool / Website';
      el.inputToolId.value = toolToEdit.id;
      el.inputToolUrl.value = toolToEdit.url;
      el.inputToolTitle.value = toolToEdit.title;
      el.inputToolKind.value = toolToEdit.kind || 'tool';
      el.inputToolPricing.value = toolToEdit.pricing || 'Freemium';
      el.inputToolFavorite.checked = Boolean(toolToEdit.favorite);
      el.inputToolProvider.value = toolToEdit.provider || '';
      el.inputToolCategory.value = toolToEdit.category || '';
      el.inputToolDescription.value = toolToEdit.description || '';
      el.inputToolNotes.value = toolToEdit.notes || '';
      el.inputToolTags.value = Array.isArray(toolToEdit.tags) ? toolToEdit.tags.join(', ') : '';
      el.inputToolFaviconUrl.value = toolToEdit.faviconUrl || '';
      el.toolFormSubmitBtn.querySelector('span').textContent = 'Save Changes';
    } else {
      el.toolFormTitle.textContent = 'New Tool / Website';
      el.toolForm.reset();
      el.inputToolId.value = '';
      el.inputToolKind.value = 'tool';
      el.inputToolPricing.value = 'Freemium';
      el.inputToolFavorite.checked = state.currentNav === 'favorites';
      if (state.tag) el.inputToolTags.value = state.tag;
      if (state.toolCategory) el.inputToolCategory.value = state.toolCategory;
      el.inputToolFaviconUrl.value = '';
      el.toolFormSubmitBtn.querySelector('span').textContent = 'Save Tool';
    }

    el.toolFormDialog.showModal();
    setTimeout(() => el.inputToolUrl.focus(), 50);
  }

  function closeToolFormDialog() {
    el.toolFormDialog.close();
  }

  async function handleFetchMetadata() {
    const rawUrl = el.inputToolUrl.value.trim();
    if (!rawUrl) {
      showToast('Enter a URL to fetch info', 'error');
      el.inputToolUrl.focus();
      return;
    }

    const btnText = el.toolFetchMetaBtn.querySelector('.btn-text');
    const spinner = el.toolFetchMetaBtn.querySelector('.spinner-sm');
    el.toolFetchMetaBtn.disabled = true;
    if (btnText) btnText.textContent = 'Fetching...';
    if (spinner) spinner.classList.remove('hidden');

    try {
      const res = await apiFetch('/api/tools/fetch-metadata', {
        method: 'POST',
        body: JSON.stringify({ url: rawUrl }),
      });

      const meta = res.data;
      if (meta) {
        if (meta.title && (!el.inputToolTitle.value || el.inputToolTitle.value.trim() === '')) {
          el.inputToolTitle.value = meta.title;
        }
        if (meta.description && (!el.inputToolDescription.value || el.inputToolDescription.value.trim() === '')) {
          el.inputToolDescription.value = meta.description;
        }
        if (meta.provider && (!el.inputToolProvider.value || el.inputToolProvider.value.trim() === '')) {
          el.inputToolProvider.value = meta.provider;
        }
        if (meta.faviconUrl) {
          el.inputToolFaviconUrl.value = meta.faviconUrl;
        }
        showToast('Site info fetched successfully!');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      el.toolFetchMetaBtn.disabled = false;
      if (btnText) btnText.textContent = '⚡ Fetch Info';
      if (spinner) spinner.classList.add('hidden');
    }
  }

  async function handleToolFormSubmit(e) {
    if (e) e.preventDefault();

    const title = el.inputToolTitle.value.trim();
    const url = el.inputToolUrl.value.trim();
    const kind = el.inputToolKind.value;
    const pricing = el.inputToolPricing.value;
    const favorite = el.inputToolFavorite.checked;
    const provider = el.inputToolProvider.value.trim() || null;
    const category = el.inputToolCategory.value.trim() || null;
    const description = el.inputToolDescription.value.trim() || null;
    const notes = el.inputToolNotes.value || null;
    const faviconUrl = el.inputToolFaviconUrl.value.trim() || null;
    const tags = el.inputToolTags.value
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (!title) {
      el.toolFormError.textContent = 'Title is required';
      el.toolFormError.classList.remove('hidden');
      el.inputToolTitle.focus();
      return;
    }

    if (!url) {
      el.toolFormError.textContent = 'URL is required';
      el.toolFormError.classList.remove('hidden');
      el.inputToolUrl.focus();
      return;
    }

    const toolId = el.inputToolId.value;
    const isEdit = Boolean(toolId);

    el.toolFormSubmitBtn.disabled = true;
    el.toolFormError.classList.add('hidden');

    try {
      const payload = {
        title,
        url,
        kind,
        pricing,
        favorite,
        provider,
        category,
        description,
        notes,
        faviconUrl,
        tags,
      };

      let saved;
      if (isEdit) {
        const res = await apiFetch(`/api/tools/${toolId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        saved = res.data;
        showToast('Tool updated successfully');
      } else {
        const res = await apiFetch('/api/tools', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        saved = res.data;
        if (res.warning) {
          showToast(res.warning, 'error');
        } else {
          showToast('Tool saved successfully');
        }
      }

      closeToolFormDialog();
      await loadData();
      await loadTags();
      await loadToolMetadataOptions();

      if (isEdit && state.activeDetailTool?.id === toolId) {
        openToolDetailDialog(saved);
      }
    } catch (err) {
      el.toolFormError.textContent = err.message;
      el.toolFormError.classList.remove('hidden');
    } finally {
      el.toolFormSubmitBtn.disabled = false;
    }
  }

  // --- Prompt Form Dialog (Create / Edit) ---

  function openPromptFormDialog(promptToEdit = null) {
    el.promptFormError.classList.add('hidden');
    el.promptFormError.textContent = '';
    el.promptFormSubmitBtn.disabled = false;

    if (promptToEdit) {
      el.promptFormTitle.textContent = 'Edit Prompt';
      el.inputPromptId.value = promptToEdit.id;
      el.inputPromptTitle.value = promptToEdit.title;
      el.inputPromptModel.value = promptToEdit.model || '';
      el.inputPromptFavorite.checked = Boolean(promptToEdit.favorite);
      el.inputPromptDescription.value = promptToEdit.description || '';
      el.inputPromptContent.value = promptToEdit.content || '';
      el.inputPromptTags.value = Array.isArray(promptToEdit.tags) ? promptToEdit.tags.join(', ') : '';
      el.promptFormSubmitBtn.querySelector('span').textContent = 'Save Changes';
    } else {
      el.promptFormTitle.textContent = 'New Prompt';
      el.promptForm.reset();
      el.inputPromptId.value = '';
      el.inputPromptFavorite.checked = state.currentNav === 'favorites';
      if (state.tag) el.inputPromptTags.value = state.tag;
      if (state.model) el.inputPromptModel.value = state.model;
      el.promptFormSubmitBtn.querySelector('span').textContent = 'Save Prompt';
    }

    el.promptFormDialog.showModal();
    setTimeout(() => el.inputPromptTitle.focus(), 50);
  }

  function closePromptFormDialog() {
    el.promptFormDialog.close();
  }

  async function handlePromptFormSubmit(e) {
    if (e) e.preventDefault();

    const title = el.inputPromptTitle.value.trim();
    const content = el.inputPromptContent.value;
    const model = el.inputPromptModel.value.trim() || null;
    const description = el.inputPromptDescription.value.trim() || null;
    const favorite = el.inputPromptFavorite.checked;
    const tags = el.inputPromptTags.value
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (!title) {
      el.promptFormError.textContent = 'Title is required';
      el.promptFormError.classList.remove('hidden');
      el.inputPromptTitle.focus();
      return;
    }

    if (!content || content.trim() === '') {
      el.promptFormError.textContent = 'Prompt content is required';
      el.promptFormError.classList.remove('hidden');
      el.inputPromptContent.focus();
      return;
    }

    const promptId = el.inputPromptId.value;
    const isEdit = Boolean(promptId);

    el.promptFormSubmitBtn.disabled = true;
    el.promptFormError.classList.add('hidden');

    try {
      const payload = { title, description, content, model, favorite, tags };
      let saved;

      if (isEdit) {
        const res = await apiFetch(`/api/prompts/${promptId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        saved = res.data;
        showToast('Prompt updated successfully');
      } else {
        const res = await apiFetch('/api/prompts', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        saved = res.data;
        showToast('Prompt created successfully');
      }

      closePromptFormDialog();
      await loadData();
      await loadTags();
      await loadModels();

      if (isEdit && state.activeDetailPrompt?.id === promptId) {
        openPromptDetailDialog(saved);
      }
    } catch (err) {
      el.promptFormError.textContent = err.message;
      el.promptFormError.classList.remove('hidden');
    } finally {
      el.promptFormSubmitBtn.disabled = false;
    }
  }

  // --- Duplicate Actions ---

  async function duplicatePrompt(prompt) {
    try {
      const res = await apiFetch(`/api/prompts/${prompt.id}/duplicate`, { method: 'POST' });
      showToast(`Duplicated "${prompt.title}"`);
      await loadData();
      await loadTags();
      if (res.data) {
        openPromptDetailDialog(res.data);
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async function duplicateTool(tool) {
    try {
      const res = await apiFetch(`/api/tools/${tool.id}/duplicate`, { method: 'POST' });
      showToast(`Duplicated "${tool.title}"`);
      await loadData();
      await loadTags();
      if (res.data) {
        openToolDetailDialog(res.data);
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  // --- Delete Dialog ---

  function openDeleteDialog(item, type) {
    state.itemToDelete = { id: item.id, title: item.title, type };
    el.deletePromptName.textContent = `"${item.title}"`;
    el.deleteDialogTitle.textContent = type === 'prompt' ? 'Delete Prompt' : 'Delete Resource';
    el.deleteDialog.showModal();
  }

  async function confirmDelete() {
    const item = state.itemToDelete;
    if (!item) return;

    el.deleteConfirmBtn.disabled = true;

    try {
      const endpoint = item.type === 'prompt' ? `/api/prompts/${item.id}` : `/api/tools/${item.id}`;
      await apiFetch(endpoint, { method: 'DELETE' });
      showToast(`Deleted "${item.title}"`);
      el.deleteDialog.close();

      if (state.activeDetailPrompt?.id === item.id) {
        closePromptDetailDialog();
      }
      if (state.activeDetailTool?.id === item.id) {
        closeToolDetailDialog();
      }

      await loadData();
      await loadTags();
      if (item.type === 'prompt') await loadModels();
      else await loadToolMetadataOptions();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      el.deleteConfirmBtn.disabled = false;
      state.itemToDelete = null;
    }
  }

  // --- Layout & View Mode ---

  function setViewMode(mode) {
    state.viewMode = mode;
    localStorage.setItem('pilot_view_mode', mode);

    el.viewListBtn.classList.toggle('active', mode === 'list');
    el.viewGridBtn.classList.toggle('active', mode === 'grid');

    el.resourcesList.classList.toggle('view-list', mode === 'list');
    el.resourcesList.classList.toggle('view-grid', mode === 'grid');
  }

  // --- Event Listeners Setup ---

  function initEventListeners() {
    // Add dropdown toggle
    el.addBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const parent = el.addBtn.closest('.dropdown-wrapper');
      const isExpanded = parent.classList.toggle('open');
      el.addDropdownMenu.classList.toggle('hidden', !isExpanded);
      el.addBtn.setAttribute('aria-expanded', String(isExpanded));
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.dropdown-wrapper')) {
        document.querySelectorAll('.dropdown-wrapper').forEach((d) => {
          d.classList.remove('open');
          const menu = d.querySelector('.dropdown-menu');
          if (menu) menu.classList.add('hidden');
        });
      }
    });

    el.menuAddToolBtn.addEventListener('click', () => {
      el.addDropdownMenu.classList.add('hidden');
      el.addBtn.closest('.dropdown-wrapper')?.classList.remove('open');
      openToolFormDialog();
    });

    el.menuAddPromptBtn.addEventListener('click', () => {
      el.addDropdownMenu.classList.add('hidden');
      el.addBtn.closest('.dropdown-wrapper')?.classList.remove('open');
      openPromptFormDialog();
    });

    // Empty state buttons
    el.emptyAddToolBtn.addEventListener('click', () => openToolFormDialog());
    el.emptyAddPromptBtn.addEventListener('click', () => openPromptFormDialog());

    // Search input with debounce
    const handleSearchDebounced = debounce((val) => {
      state.q = val.trim();
      el.searchClear.classList.toggle('hidden', state.q === '');
      loadData();
    }, 250);

    el.search.addEventListener('input', (e) => {
      handleSearchDebounced(e.target.value);
    });

    el.searchClear.addEventListener('click', () => {
      el.search.value = '';
      state.q = '';
      el.searchClear.classList.add('hidden');
      el.search.focus();
      loadData();
    });

    // View layout toggles
    el.viewListBtn.addEventListener('click', () => setViewMode('list'));
    el.viewGridBtn.addEventListener('click', () => setViewMode('grid'));

    // Navigation buttons (All Resources, Tools, Prompts, Favorites)
    document.querySelectorAll('[data-filter-view]').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('[data-filter-view]').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const view = btn.getAttribute('data-filter-view');
        state.currentNav = view;

        if (view === 'favorites') {
          state.favorite = true;
        } else {
          state.favorite = null;
        }

        // Sidebar filters visibility toggle
        if (view === 'tools') {
          el.sidebarToolsFilters.style.display = 'block';
          el.sidebarPromptsFilters.style.display = 'none';
        } else if (view === 'prompts') {
          el.sidebarToolsFilters.style.display = 'none';
          el.sidebarPromptsFilters.style.display = 'block';
        } else {
          el.sidebarToolsFilters.style.display = 'block';
          el.sidebarPromptsFilters.style.display = 'block';
        }

        loadData();
      });
    });

    // Tool filters in sidebar
    el.toolKindFilterSelect.addEventListener('change', (e) => {
      state.toolKind = e.target.value || null;
      loadData();
    });

    el.toolCategoryFilterSelect.addEventListener('change', (e) => {
      state.toolCategory = e.target.value || null;
      loadData();
    });

    el.toolPricingFilterSelect.addEventListener('change', (e) => {
      state.toolPricing = e.target.value || null;
      loadData();
    });

    // Prompt model filter
    el.modelFilterSelect.addEventListener('change', (e) => {
      state.model = e.target.value || null;
      loadData();
    });

    // Sort select
    el.sortSelect.addEventListener('change', (e) => {
      const [field, dir] = e.target.value.split(':');
      state.sort = field;
      state.order = dir;
      loadData();
    });

    // Clear tag button
    el.clearTagBtn.addEventListener('click', () => {
      state.tag = null;
      loadData();
      renderTagsList();
    });

    // Load More button
    el.loadMoreBtn.addEventListener('click', () => {
      state.offset += state.limit;
      loadData(true);
    });

    // Tool Form Dialog events
    el.toolForm.addEventListener('submit', handleToolFormSubmit);
    el.toolFormCloseBtn.addEventListener('click', closeToolFormDialog);
    el.toolFormCancelBtn.addEventListener('click', closeToolFormDialog);
    el.toolFetchMetaBtn.addEventListener('click', handleFetchMetadata);

    // Prompt Form Dialog events
    el.promptForm.addEventListener('submit', handlePromptFormSubmit);
    el.promptFormCloseBtn.addEventListener('click', closePromptFormDialog);
    el.promptFormCancelBtn.addEventListener('click', closePromptFormDialog);

    // Tool Detail Dialog events
    el.toolDetailCloseBtn.addEventListener('click', closeToolDetailDialog);
    el.toolDetailFavBtn.addEventListener('click', () => {
      if (state.activeDetailTool) {
        toggleToolFavorite(state.activeDetailTool, el.toolDetailFavBtn);
      }
    });

    el.toolDetailCopyUrlBtn.addEventListener('click', () => {
      if (state.activeDetailTool) {
        copyToClipboard(state.activeDetailTool.url, el.toolDetailCopyUrlBtn);
      }
    });

    el.toolDetailEditBtn.addEventListener('click', () => {
      if (state.activeDetailTool) {
        const t = state.activeDetailTool;
        closeToolDetailDialog();
        openToolFormDialog(t);
      }
    });

    el.toolDetailDuplicateBtn.addEventListener('click', () => {
      if (state.activeDetailTool) {
        duplicateTool(state.activeDetailTool);
      }
    });

    el.toolDetailDeleteBtn.addEventListener('click', () => {
      if (state.activeDetailTool) {
        openDeleteDialog(state.activeDetailTool, state.activeDetailTool.kind || 'tool');
      }
    });

    // Prompt Detail Dialog events
    el.promptDetailCloseBtn.addEventListener('click', closePromptDetailDialog);
    el.promptDetailFavBtn.addEventListener('click', () => {
      if (state.activeDetailPrompt) {
        togglePromptFavorite(state.activeDetailPrompt, el.promptDetailFavBtn);
      }
    });

    el.promptDetailCopyBtn.addEventListener('click', () => {
      if (state.activeDetailPrompt) {
        copyToClipboard(state.activeDetailPrompt.content, el.promptDetailCopyBtn);
      }
    });

    el.promptDetailEditBtn.addEventListener('click', () => {
      if (state.activeDetailPrompt) {
        const p = state.activeDetailPrompt;
        closePromptDetailDialog();
        openPromptFormDialog(p);
      }
    });

    el.promptDetailDuplicateBtn.addEventListener('click', () => {
      if (state.activeDetailPrompt) {
        duplicatePrompt(state.activeDetailPrompt);
      }
    });

    el.promptDetailDeleteBtn.addEventListener('click', () => {
      if (state.activeDetailPrompt) {
        openDeleteDialog(state.activeDetailPrompt, 'prompt');
      }
    });

    // Delete Confirmation events
    el.deleteCancelBtn.addEventListener('click', () => el.deleteDialog.close());
    el.deleteConfirmBtn.addEventListener('click', confirmDelete);

    // Mobile menu toggle
    el.mobileMenuToggle.addEventListener('click', () => {
      el.sidebar.classList.toggle('open');
    });

    // Close dialogs on outside click
    [el.toolFormDialog, el.toolDetailDialog, el.promptFormDialog, el.promptDetailDialog, el.deleteDialog].forEach((dialog) => {
      dialog.addEventListener('click', (e) => {
        const rect = dialog.getBoundingClientRect();
        const isInDialog =
          rect.top <= e.clientY &&
          e.clientY <= rect.top + rect.height &&
          rect.left <= e.clientX &&
          e.clientX <= rect.left + rect.width;
        if (!isInDialog) {
          dialog.close();
          if (dialog === el.promptDetailDialog) closePromptDetailDialog();
          if (dialog === el.toolDetailDialog) closeToolDetailDialog();
        }
      });
    });

    // Keyboard Shortcuts
    window.addEventListener('keydown', (e) => {
      // Cmd/Ctrl + K -> Focus Search
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        el.search.focus();
        el.search.select();
        return;
      }

      // Escape -> Close dialogs
      if (e.key === 'Escape') {
        if (el.deleteDialog.open) {
          el.deleteDialog.close();
          return;
        }
        if (el.toolFormDialog.open) {
          closeToolFormDialog();
          return;
        }
        if (el.promptFormDialog.open) {
          closePromptFormDialog();
          return;
        }
        if (el.toolDetailDialog.open) {
          closeToolDetailDialog();
          return;
        }
        if (el.promptDetailDialog.open) {
          closePromptDetailDialog();
          return;
        }
        if (document.activeElement === el.search && el.search.value) {
          el.search.value = '';
          state.q = '';
          el.searchClear.classList.add('hidden');
          loadData();
        }
        return;
      }

      // Cmd/Ctrl + Enter in Form Dialog -> Save
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        if (el.toolFormDialog.open) {
          e.preventDefault();
          handleToolFormSubmit();
          return;
        }
        if (el.promptFormDialog.open) {
          e.preventDefault();
          handlePromptFormSubmit();
          return;
        }
      }
    });

    // Handle browser popstate / back button
    window.addEventListener('popstate', checkUrlNavigation);
  }

  // --- Initial URL Navigation Check ---

  async function checkUrlNavigation() {
    const urlParams = new URLSearchParams(window.location.search);

    const toolId = urlParams.get('tool');
    const toolMatch = window.location.pathname.match(/^\/tool\/([^/]+)$/);
    const targetToolId = toolId || (toolMatch ? toolMatch[1] : null);

    if (targetToolId) {
      await openToolDetailDialog(targetToolId);
      return;
    }

    const promptId = urlParams.get('prompt');
    const promptMatch = window.location.pathname.match(/^\/prompt\/([^/]+)$/);
    const targetPromptId = promptId || (promptMatch ? promptMatch[1] : null);

    if (targetPromptId) {
      await openPromptDetailDialog(targetPromptId);
    }
  }

  // --- Application Initialization ---

  async function init() {
    setViewMode(state.viewMode);
    initEventListeners();

    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    if (isMac && el.searchKbd) {
      el.searchKbd.textContent = '⌘K';
    }

    await Promise.all([loadData(), loadTags(), loadModels(), loadToolMetadataOptions()]);
    await checkUrlNavigation();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

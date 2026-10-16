// Pilot V1 - Frontend Application
// Vanilla JavaScript, Web Platform APIs, zero external dependencies

(function () {
  'use strict';

  // --- State ---
  const state = {
    prompts: [],
    total: 0,
    limit: 50,
    offset: 0,
    q: '',
    tag: null,
    model: null,
    favorite: null, // true | null
    sort: 'updated_at',
    order: 'desc',
    viewMode: localStorage.getItem('pilot_view_mode') || 'list',
    currentNav: 'all', // 'all' | 'favorites'
    activeDetailPrompt: null,
    promptToDelete: null,
    tags: [],
    models: [],
    isLoading: false,
  };

  // --- DOM Elements ---
  const el = {
    search: document.getElementById('global-search'),
    searchClear: document.getElementById('search-clear-btn'),
    searchKbd: document.getElementById('search-kbd-hint'),
    viewListBtn: document.getElementById('view-list-btn'),
    viewGridBtn: document.getElementById('view-grid-btn'),
    newPromptBtn: document.getElementById('new-prompt-btn'),
    mobileMenuToggle: document.getElementById('mobile-menu-toggle'),
    sidebar: document.getElementById('app-sidebar'),
    currentViewTitle: document.getElementById('current-view-title'),
    activeFiltersContainer: document.getElementById('active-filters-container'),
    sortSelect: document.getElementById('sort-select'),
    modelFilterSelect: document.getElementById('model-filter-select'),
    modelsDatalist: document.getElementById('models-datalist'),
    sidebarTagsList: document.getElementById('sidebar-tags-list'),
    clearTagBtn: document.getElementById('clear-tag-btn'),
    badgeAllCount: document.getElementById('badge-all-count'),
    badgeFavCount: document.getElementById('badge-fav-count'),
    promptsList: document.getElementById('prompts-list'),
    loadMoreWrapper: document.getElementById('load-more-wrapper'),
    loadMoreBtn: document.getElementById('load-more-btn'),
    loadingState: document.getElementById('loading-state'),
    emptyState: document.getElementById('empty-state'),
    emptyStateTitle: document.getElementById('empty-state-title'),
    emptyStateDesc: document.getElementById('empty-state-desc'),
    emptyActionBtn: document.getElementById('empty-action-btn'),
    toastContainer: document.getElementById('toast-container'),

    // Form Dialog
    formDialog: document.getElementById('prompt-form-dialog'),
    form: document.getElementById('prompt-form'),
    formTitle: document.getElementById('form-dialog-title'),
    formError: document.getElementById('form-error-banner'),
    formCloseBtn: document.getElementById('form-close-btn'),
    formCancelBtn: document.getElementById('form-cancel-btn'),
    formSubmitBtn: document.getElementById('form-submit-btn'),
    inputPromptId: document.getElementById('form-prompt-id'),
    inputTitle: document.getElementById('prompt-title'),
    inputModel: document.getElementById('prompt-model'),
    inputFavorite: document.getElementById('prompt-favorite'),
    inputDescription: document.getElementById('prompt-description'),
    inputContent: document.getElementById('prompt-content'),
    inputTags: document.getElementById('prompt-tags'),

    // Detail Dialog
    detailDialog: document.getElementById('prompt-detail-dialog'),
    detailCloseBtn: document.getElementById('detail-close-btn'),
    detailFavBtn: document.getElementById('detail-fav-btn'),
    detailTitle: document.getElementById('detail-title'),
    detailModel: document.getElementById('detail-model'),
    detailUpdated: document.getElementById('detail-updated'),
    detailDescription: document.getElementById('detail-description'),
    detailTagsRow: document.getElementById('detail-tags-row'),
    detailContent: document.getElementById('detail-content'),
    detailCopyBtn: document.getElementById('detail-copy-btn'),
    detailEditBtn: document.getElementById('detail-edit-btn'),
    detailDuplicateBtn: document.getElementById('detail-duplicate-btn'),
    detailDeleteBtn: document.getElementById('detail-delete-btn'),

    // Delete Dialog
    deleteDialog: document.getElementById('delete-confirm-dialog'),
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
    } catch (err) {
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

  // --- Data Loading ---

  async function loadPrompts(append = false) {
    if (!append) {
      state.offset = 0;
      el.promptsList.innerHTML = '';
      el.loadingState.classList.remove('hidden');
      el.emptyState.classList.add('hidden');
    }

    state.isLoading = true;

    try {
      const params = new URLSearchParams();
      if (state.q) params.set('q', state.q);
      if (state.tag) params.set('tag', state.tag);
      if (state.model) params.set('model', state.model);
      if (state.favorite !== null) params.set('favorite', String(state.favorite));
      params.set('sort', state.sort);
      params.set('order', state.order);
      params.set('limit', String(state.limit));
      params.set('offset', String(state.offset));

      const res = await apiFetch(`/api/prompts?${params.toString()}`);
      const newPrompts = res.data || [];
      state.total = res.meta?.total ?? 0;

      if (append) {
        state.prompts.push(...newPrompts);
      } else {
        state.prompts = newPrompts;
      }

      renderPromptsList(append);
      updateCounts();
      updateActiveFilters();

      // Load More Visibility
      if (state.prompts.length < state.total) {
        el.loadMoreWrapper.classList.remove('hidden');
      } else {
        el.loadMoreWrapper.classList.add('hidden');
      }
    } catch (err) {
      showToast(err.message, 'error');
      if (!append && state.prompts.length === 0) {
        showEmptyState('Error loading prompts', err.message);
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

  async function updateCounts() {
    // Update badge counts
    try {
      const allRes = await apiFetch('/api/prompts?limit=1');
      el.badgeAllCount.textContent = allRes.meta?.total ?? 0;

      const favRes = await apiFetch('/api/prompts?favorite=true&limit=1');
      el.badgeFavCount.textContent = favRes.meta?.total ?? 0;
    } catch {
      // Non-critical badge count
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
        loadPrompts();
        renderTagsList();
      });

      el.sidebarTagsList.appendChild(btn);
    }
  }

  function renderModelOptions() {
    // Update sidebar select
    const currentSelected = el.modelFilterSelect.value;
    el.modelFilterSelect.innerHTML = '<option value="">All Models</option>';
    el.modelsDatalist.innerHTML = '';

    for (const model of state.models) {
      const opt = document.createElement('option');
      opt.value = model;
      opt.textContent = model;
      if (model === currentSelected) opt.selected = true;
      el.modelFilterSelect.appendChild(opt);

      const dataOpt = document.createElement('option');
      dataOpt.value = model;
      el.modelsDatalist.appendChild(dataOpt);
    }
  }

  function renderPromptsList(append = false) {
    if (!append) {
      el.promptsList.innerHTML = '';
    }

    if (state.prompts.length === 0) {
      el.promptsList.classList.add('hidden');
      if (state.q) {
        showEmptyState('No resources match this search', `No prompts matching "${state.q}".`);
      } else if (state.currentNav === 'favorites') {
        showEmptyState('Nothing favorited yet', 'Star useful prompts to easily find them here.');
      } else if (state.tag) {
        showEmptyState(`No prompts tagged #${state.tag}`, 'Try selecting another tag or clearing the filter.');
      } else {
        showEmptyState('No prompts yet', 'Save your first useful AI prompt to build your personal library.');
      }
      return;
    }

    el.emptyState.classList.add('hidden');
    el.promptsList.classList.remove('hidden');

    for (const prompt of (append ? state.prompts.slice(state.offset) : state.prompts)) {
      const card = createPromptCardElement(prompt);
      el.promptsList.appendChild(card);
    }
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
      toggleFavorite(prompt, favBtn);
    });

    const title = document.createElement('h2');
    title.className = 'card-title';
    title.textContent = prompt.title;

    titleGroup.appendChild(favBtn);
    titleGroup.appendChild(title);

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
      copyToClipboard(prompt.content, copyBtn);
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
    const preview = document.createElement('div');
    preview.className = 'card-content-preview';
    preview.textContent = prompt.content;
    card.appendChild(preview);

    // Footer row: Model, Tags, Date, Extra actions
    const footerRow = document.createElement('div');
    footerRow.className = 'card-footer-row';

    const metaLeft = document.createElement('div');
    metaLeft.className = 'card-meta-left';

    if (prompt.model) {
      const modelBadge = document.createElement('span');
      modelBadge.className = 'model-badge';
      modelBadge.textContent = prompt.model;
      metaLeft.appendChild(modelBadge);
    }

    if (Array.isArray(prompt.tags) && prompt.tags.length > 0) {
      for (const t of prompt.tags.slice(0, 4)) {
        const tagPill = document.createElement('span');
        tagPill.className = 'card-tag';
        tagPill.textContent = `#${t}`;
        tagPill.addEventListener('click', (e) => {
          e.stopPropagation();
          state.tag = t;
          loadPrompts();
          renderTagsList();
        });
        metaLeft.appendChild(tagPill);
      }
      if (prompt.tags.length > 4) {
        const moreTag = document.createElement('span');
        moreTag.className = 'card-tag';
        moreTag.textContent = `+${prompt.tags.length - 4}`;
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
      openDetailDialog(prompt);
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
      el.currentViewTitle.textContent = 'Favorite Prompts';
    } else if (state.q) {
      el.currentViewTitle.textContent = `Search: "${state.q}"`;
    } else if (state.tag) {
      el.currentViewTitle.textContent = `Tagged #${state.tag}`;
    } else {
      el.currentViewTitle.textContent = 'All Prompts';
    }

    // Pill for Tag
    if (state.tag) {
      const pill = createFilterPill(`#${state.tag}`, () => {
        state.tag = null;
        loadPrompts();
        renderTagsList();
      });
      el.activeFiltersContainer.appendChild(pill);
    }

    // Pill for Model
    if (state.model) {
      const pill = createFilterPill(`Model: ${state.model}`, () => {
        state.model = null;
        el.modelFilterSelect.value = '';
        loadPrompts();
      });
      el.activeFiltersContainer.appendChild(pill);
    }

    // Pill for Search
    if (state.q) {
      const pill = createFilterPill(`Search: "${state.q}"`, () => {
        state.q = '';
        el.search.value = '';
        el.searchClear.classList.add('hidden');
        loadPrompts();
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

  // --- Favorite Toggle ---

  async function toggleFavorite(prompt, starButtonElement) {
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
        loadPrompts();
      }
    } catch (err) {
      // Revert optimistic update
      prompt.favorite = !nextState;
      if (starButtonElement) {
        starButtonElement.classList.toggle('active', !nextState);
      }
      showToast(err.message, 'error');
    }
  }

  // --- Detail Dialog ---

  function openDetailDialog(prompt) {
    state.activeDetailPrompt = prompt;

    el.detailTitle.textContent = prompt.title;
    el.detailFavBtn.classList.toggle('active', Boolean(prompt.favorite));
    const starIcon = el.detailFavBtn.querySelector('.star-icon');
    if (starIcon) {
      starIcon.setAttribute('fill', prompt.favorite ? 'currentColor' : 'none');
    }

    // Model
    if (prompt.model) {
      el.detailModel.textContent = prompt.model;
      el.detailModel.classList.remove('hidden');
    } else {
      el.detailModel.classList.add('hidden');
    }

    // Dates
    el.detailUpdated.textContent = `Updated ${formatRelativeDate(prompt.updatedAt)}`;

    // Description
    if (prompt.description) {
      el.detailDescription.textContent = prompt.description;
      el.detailDescription.classList.remove('hidden');
    } else {
      el.detailDescription.classList.add('hidden');
    }

    // Tags
    el.detailTagsRow.innerHTML = '';
    if (Array.isArray(prompt.tags) && prompt.tags.length > 0) {
      for (const t of prompt.tags) {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'card-tag';
        tagSpan.textContent = `#${t}`;
        tagSpan.addEventListener('click', () => {
          el.detailDialog.close();
          state.tag = t;
          loadPrompts();
          renderTagsList();
        });
        el.detailTagsRow.appendChild(tagSpan);
      }
      el.detailTagsRow.classList.remove('hidden');
    } else {
      el.detailTagsRow.classList.add('hidden');
    }

    // Content (Preserve exact formatting)
    el.detailContent.textContent = prompt.content;

    // Update URL query param without reload
    const url = new URL(window.location);
    url.searchParams.set('prompt', prompt.id);
    window.history.replaceState({}, '', url);

    el.detailDialog.showModal();
  }

  function closeDetailDialog() {
    state.activeDetailPrompt = null;
    el.detailDialog.close();

    const url = new URL(window.location);
    url.searchParams.delete('prompt');
    window.history.replaceState({}, '', url);
  }

  // --- Form Dialog (Create / Edit) ---

  function openFormDialog(promptToEdit = null) {
    el.formError.classList.add('hidden');
    el.formError.textContent = '';
    el.formSubmitBtn.disabled = false;

    if (promptToEdit) {
      el.formTitle.textContent = 'Edit Prompt';
      el.inputPromptId.value = promptToEdit.id;
      el.inputTitle.value = promptToEdit.title;
      el.inputModel.value = promptToEdit.model || '';
      el.inputFavorite.checked = Boolean(promptToEdit.favorite);
      el.inputDescription.value = promptToEdit.description || '';
      el.inputContent.value = promptToEdit.content;
      el.inputTags.value = Array.isArray(promptToEdit.tags) ? promptToEdit.tags.join(', ') : '';
      el.formSubmitBtn.querySelector('span').textContent = 'Save Changes';
    } else {
      el.formTitle.textContent = 'New Prompt';
      el.form.reset();
      el.inputPromptId.value = '';
      el.inputFavorite.checked = state.currentNav === 'favorites';
      if (state.tag) el.inputTags.value = state.tag;
      if (state.model) el.inputModel.value = state.model;
      el.formSubmitBtn.querySelector('span').textContent = 'Save Prompt';
    }

    el.formDialog.showModal();
    setTimeout(() => el.inputTitle.focus(), 50);
  }

  function closeFormDialog() {
    el.formDialog.close();
  }

  async function handleFormSubmit(e) {
    if (e) e.preventDefault();

    const title = el.inputTitle.value.trim();
    const content = el.inputContent.value;
    const model = el.inputModel.value.trim() || null;
    const description = el.inputDescription.value.trim() || null;
    const favorite = el.inputFavorite.checked;
    const tags = el.inputTags.value
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (!title) {
      showFormError('Title is required');
      el.inputTitle.focus();
      return;
    }

    if (!content || content.trim() === '') {
      showFormError('Prompt content is required');
      el.inputContent.focus();
      return;
    }

    const promptId = el.inputPromptId.value;
    const isEdit = Boolean(promptId);

    el.formSubmitBtn.disabled = true;
    el.formError.classList.add('hidden');

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

      closeFormDialog();
      await loadPrompts();
      await loadTags();
      await loadModels();

      if (isEdit && state.activeDetailPrompt?.id === promptId) {
        openDetailDialog(saved);
      }
    } catch (err) {
      showFormError(err.message);
    } finally {
      el.formSubmitBtn.disabled = false;
    }
  }

  function showFormError(msg) {
    el.formError.textContent = msg;
    el.formError.classList.remove('hidden');
  }

  // --- Duplicate Prompt ---

  async function duplicatePrompt(prompt) {
    try {
      const res = await apiFetch(`/api/prompts/${prompt.id}/duplicate`, {
        method: 'POST',
      });
      showToast(`Duplicated "${prompt.title}"`);
      await loadPrompts();
      await loadTags();
      if (res.data) {
        openDetailDialog(res.data);
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  // --- Delete Prompt ---

  function openDeleteDialog(prompt) {
    state.promptToDelete = prompt;
    el.deletePromptName.textContent = `"${prompt.title}"`;
    el.deleteDialog.showModal();
  }

  async function confirmDelete() {
    const prompt = state.promptToDelete;
    if (!prompt) return;

    el.deleteConfirmBtn.disabled = true;

    try {
      await apiFetch(`/api/prompts/${prompt.id}`, {
        method: 'DELETE',
      });
      showToast(`Deleted "${prompt.title}"`);
      el.deleteDialog.close();

      if (state.activeDetailPrompt?.id === prompt.id) {
        closeDetailDialog();
      }

      await loadPrompts();
      await loadTags();
      await loadModels();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      el.deleteConfirmBtn.disabled = false;
      state.promptToDelete = null;
    }
  }

  // --- Layout & View Mode ---

  function setViewMode(mode) {
    state.viewMode = mode;
    localStorage.setItem('pilot_view_mode', mode);

    el.viewListBtn.classList.toggle('active', mode === 'list');
    el.viewGridBtn.classList.toggle('active', mode === 'grid');

    el.promptsList.classList.toggle('view-list', mode === 'list');
    el.promptsList.classList.toggle('view-grid', mode === 'grid');
  }

  // --- Event Listeners Setup ---

  function initEventListeners() {
    // Search input with debounce
    const handleSearchDebounced = debounce((val) => {
      state.q = val.trim();
      el.searchClear.classList.toggle('hidden', state.q === '');
      loadPrompts();
    }, 250);

    el.search.addEventListener('input', (e) => {
      handleSearchDebounced(e.target.value);
    });

    el.searchClear.addEventListener('click', () => {
      el.search.value = '';
      state.q = '';
      el.searchClear.classList.add('hidden');
      el.search.focus();
      loadPrompts();
    });

    // View toggles
    el.viewListBtn.addEventListener('click', () => setViewMode('list'));
    el.viewGridBtn.addEventListener('click', () => setViewMode('grid'));

    // Navigation buttons (All vs Favorites)
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

        loadPrompts();
      });
    });

    // Model filter select
    el.modelFilterSelect.addEventListener('change', (e) => {
      state.model = e.target.value || null;
      loadPrompts();
    });

    // Sort select
    el.sortSelect.addEventListener('change', (e) => {
      const [field, dir] = e.target.value.split(':');
      state.sort = field;
      state.order = dir;
      loadPrompts();
    });

    // Clear tag button
    el.clearTagBtn.addEventListener('click', () => {
      state.tag = null;
      loadPrompts();
      renderTagsList();
    });

    // Load More button
    el.loadMoreBtn.addEventListener('click', () => {
      state.offset += state.limit;
      loadPrompts(true);
    });

    // New Prompt buttons
    el.newPromptBtn.addEventListener('click', () => openFormDialog());
    el.emptyActionBtn.addEventListener('click', () => openFormDialog());

    // Form Dialog events
    el.form.addEventListener('submit', handleFormSubmit);
    el.formCloseBtn.addEventListener('click', closeFormDialog);
    el.formCancelBtn.addEventListener('click', closeFormDialog);

    // Detail Dialog events
    el.detailCloseBtn.addEventListener('click', closeDetailDialog);
    el.detailFavBtn.addEventListener('click', () => {
      if (state.activeDetailPrompt) {
        toggleFavorite(state.activeDetailPrompt, el.detailFavBtn);
      }
    });

    el.detailCopyBtn.addEventListener('click', () => {
      if (state.activeDetailPrompt) {
        copyToClipboard(state.activeDetailPrompt.content, el.detailCopyBtn);
      }
    });

    el.detailEditBtn.addEventListener('click', () => {
      if (state.activeDetailPrompt) {
        const p = state.activeDetailPrompt;
        closeDetailDialog();
        openFormDialog(p);
      }
    });

    el.detailDuplicateBtn.addEventListener('click', () => {
      if (state.activeDetailPrompt) {
        duplicatePrompt(state.activeDetailPrompt);
      }
    });

    el.detailDeleteBtn.addEventListener('click', () => {
      if (state.activeDetailPrompt) {
        openDeleteDialog(state.activeDetailPrompt);
      }
    });

    // Delete Dialog events
    el.deleteCancelBtn.addEventListener('click', () => el.deleteDialog.close());
    el.deleteConfirmBtn.addEventListener('click', confirmDelete);

    // Mobile menu toggle
    el.mobileMenuToggle.addEventListener('click', () => {
      el.sidebar.classList.toggle('open');
    });

    // Close dialogs on outside click
    [el.formDialog, el.detailDialog, el.deleteDialog].forEach((dialog) => {
      dialog.addEventListener('click', (e) => {
        const rect = dialog.getBoundingClientRect();
        const isInDialog =
          rect.top <= e.clientY &&
          e.clientY <= rect.top + rect.height &&
          rect.left <= e.clientX &&
          e.clientX <= rect.left + rect.width;
        if (!isInDialog) {
          dialog.close();
          if (dialog === el.detailDialog) {
            closeDetailDialog();
          }
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
        if (el.formDialog.open) {
          closeFormDialog();
          return;
        }
        if (el.detailDialog.open) {
          closeDetailDialog();
          return;
        }
        if (document.activeElement === el.search && el.search.value) {
          el.search.value = '';
          state.q = '';
          el.searchClear.classList.add('hidden');
          loadPrompts();
        }
        return;
      }

      // Cmd/Ctrl + Enter in Form Dialog -> Save
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        if (el.formDialog.open) {
          e.preventDefault();
          handleFormSubmit();
        }
      }
    });

    // Handle browser popstate / back button
    window.addEventListener('popstate', checkUrlNavigation);
  }

  // --- Initial URL Navigation Check ---

  async function checkUrlNavigation() {
    const urlParams = new URLSearchParams(window.location.search);
    const promptIdFromQuery = urlParams.get('prompt');
    const pathMatch = window.location.pathname.match(/^\/prompt\/([^/]+)$/);
    const targetId = promptIdFromQuery || (pathMatch ? pathMatch[1] : null);

    if (targetId) {
      try {
        const res = await apiFetch(`/api/prompts/${targetId}`);
        if (res.data) {
          openDetailDialog(res.data);
        }
      } catch (err) {
        console.warn('Could not load prompt from URL:', err);
      }
    }
  }

  // --- Application Initialization ---

  async function init() {
    setViewMode(state.viewMode);
    initEventListeners();

    // Adjust keyboard shortcut hint on Mac
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    if (isMac && el.searchKbd) {
      el.searchKbd.textContent = '⌘K';
    }

    await Promise.all([loadPrompts(), loadTags(), loadModels()]);
    await checkUrlNavigation();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

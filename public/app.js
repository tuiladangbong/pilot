// Pilot - AI Resource Hub Frontend Application
// Vanilla JavaScript, Web Platform APIs, zero external dependencies

(function () {
  'use strict';

  // --- Internationalization (i18n) ---
  const I18N = {
    en: {
      brand_subtitle: 'AI Resource Hub',
      search_placeholder: 'Search prompts, tools, websites, tags... (Ctrl+K)',
      search_clear: 'Clear search',
      view_list: 'List View',
      view_grid: 'Grid View',
      add_btn: '+ Add',
      menu_new_workflow: 'New Workflow',
      menu_new_workflow_desc: 'Structured steps & reusable AI process',
      menu_new_tool: 'New Tool / Website',
      menu_new_tool_desc: 'Save AI web app, service, or documentation',
      menu_new_prompt: 'New Prompt',
      menu_new_prompt_desc: 'Save reusable system or task prompt',

      // Sidebar
      nav_resources: 'Resources',
      nav_all_resources: 'All Resources',
      nav_workflows: 'Workflows',
      nav_tools: 'Tools & Websites',
      nav_prompts: 'Prompts',
      nav_favorites: 'Favorites',
      nav_filter_workflows: 'Filter Workflows',
      nav_all_statuses: 'All Statuses',
      nav_status_active: 'Active',
      nav_status_draft: 'Draft',
      nav_status_archived: 'Archived',
      nav_all_difficulties: 'All Difficulties',
      diff_easy: 'Easy',
      diff_medium: 'Medium',
      diff_advanced: 'Advanced',
      nav_filter_tools: 'Filter Tools',
      nav_all_types: 'All Types (Tools & Sites)',
      nav_tools_only: 'Tools only',
      nav_websites_only: 'Websites only',
      nav_all_categories: 'All Categories',
      nav_all_pricing: 'All Pricing',
      pricing_free: 'Free',
      pricing_freemium: 'Freemium',
      pricing_paid: 'Paid',
      pricing_opensource: 'Open Source',
      pricing_unknown: 'Unknown',
      nav_models: 'Models / AI',
      nav_all_models: 'All Models',
      nav_tags: 'Tags',
      nav_clear: 'Clear',
      nav_no_tags: 'No tags yet',
      nav_future_modules: 'Future Modules',
      future_workflows: 'Workflows',
      future_agents: 'Agents',
      future_collections: 'Collections',
      future_recipes: 'Recipes',

      // Toolbar
      sort_label: 'Sort:',
      sort_updated_desc: 'Recently Updated',
      sort_created_desc: 'Newest First',
      sort_created_asc: 'Oldest First',
      sort_title_asc: 'Title (A–Z)',
      sort_title_desc: 'Title (Z–A)',

      // Card & Badges
      badge_tool: 'Tool',
      badge_website: 'Website',
      badge_prompt: 'Prompt',
      badge_workflow: 'Workflow',
      btn_copy: 'Copy',
      btn_copy_prompt: 'Copy Prompt',
      btn_copy_url: 'Copy URL',
      btn_copied: 'Copied ✓',
      btn_open: 'Open',
      btn_open_site: 'Open Site',

      // Empty & Loading States
      loading_resources: 'Loading resources...',
      empty_no_resources: 'No resources found',
      empty_no_resources_desc: 'Save your first AI tool, website, or prompt to build your operating library.',
      empty_no_workflows: 'No workflows yet',
      empty_no_workflows_desc: 'Create structured AI processes to streamline your work.',
      empty_no_tools: 'No AI tools or websites yet',
      empty_no_tools_desc: 'Save your first AI tool or reference site to build your collection.',
      empty_no_prompts: 'No prompts yet',
      empty_no_prompts_desc: 'Save your first AI prompt to build your operating library.',
      empty_no_favs: 'Nothing favorited yet',
      empty_no_favs_desc: 'Star useful prompts, tools, websites, and workflows to find them here.',
      empty_search_no_match: 'No resources match this search',
      empty_search_desc: (q) => `No items matching "${q}".`,
      empty_tag_no_match: (tag) => `No resources tagged #${tag}`,
      empty_tag_desc: 'Try selecting another tag or clearing the filter.',
      btn_add_workflow: '+ Add Workflow',
      btn_add_tool: '+ Add Tool / Website',
      btn_add_prompt: '+ Add Prompt',
      btn_load_more: 'Load More',

      // Modals
      modal_new_workflow: 'New Workflow',
      modal_edit_workflow: 'Edit Workflow',
      modal_new_tool: 'New Tool / Website',
      modal_edit_tool: 'Edit Tool / Website',
      modal_new_prompt: 'New Prompt',
      modal_edit_prompt: 'Edit Prompt',
      label_purpose: 'Purpose / Goal',
      label_purpose_hint: '(what this workflow achieves)',
      label_status: 'Status',
      label_difficulty: 'Difficulty',
      label_estimated_time: 'Estimated Time',
      label_estimated_time_hint: '(e.g. 15 min, 1h)',
      label_steps: 'Workflow Steps',
      label_steps_hint: 'Ordered sequence of steps',
      btn_add_step: '+ Add Step',
      label_step_title: 'Step Title',
      label_step_instruction: 'Instructions & Prompts',
      label_step_optional: 'Optional step',
      label_step_notes: 'Notes / Tips',
      label_linked_resources: 'Linked Resources',
      btn_link_resource: '+ Link Resource',
      picker_title: 'Link a Resource',
      picker_search_placeholder: 'Search prompts, tools, websites...',
      picker_select: 'Link',
      picker_no_results: 'No matching resources found',
      btn_save_workflow: 'Save Workflow',
      btn_copy_workflow: 'Copy Markdown',
      label_url: 'URL',
      label_url_hint: 'Paste full URL with http:// or https://',
      btn_fetch_info: '⚡ Fetch Info',
      btn_fetching: 'Fetching...',
      label_title: 'Title',
      label_kind: 'Kind',
      opt_kind_tool: 'AI Tool / Web App',
      opt_kind_website: 'Website / Reference / Directory',
      label_pricing: 'Pricing',
      label_favorite: 'Favorite',
      label_mark_favorite: 'Mark as Favorite',
      label_provider: 'Provider / Creator',
      label_category: 'Category',
      label_description: 'Description',
      label_desc_hint: '(short tagline or summary)',
      label_notes: 'Personal Notes',
      label_notes_hint: '(usage notes, keyboard shortcuts, tips)',
      label_tags: 'Tags',
      label_tags_hint_tool: '(comma separated, e.g. coding, llm, fast, api)',
      label_tags_hint_prompt: '(comma separated, e.g. coding, refactor, architecture)',
      label_model: 'Intended Model / AI',
      label_prompt_desc_hint: '(optional summary or usage notes)',
      label_prompt_content: 'Prompt Content',
      label_prompt_content_hint: 'Plain text • Preserves exact whitespace',
      btn_cancel: 'Cancel',
      btn_save_tool: 'Save Tool',
      btn_save_prompt: 'Save Prompt',
      btn_save_changes: 'Save Changes',

      // Detail Dialogs
      notes_tips_title: 'Personal Notes & Tips',
      btn_duplicate: 'Duplicate',
      btn_edit: 'Edit',
      btn_delete: 'Delete',
      updated_recently: 'Updated recently',
      updated_at: (date) => `Updated ${date}`,

      // Delete Dialog
      delete_resource_title: 'Delete Resource',
      delete_prompt_title: 'Delete Prompt',
      delete_confirm_text: (name) => `Are you sure you want to permanently delete "${name}"?`,
      delete_warning: 'This action cannot be undone.',
      btn_delete_permanently: 'Delete Permanently',

      // Toasts & Errors
      toast_copied: 'Copied to clipboard',
      toast_copy_failed: 'Failed to copy to clipboard',
      toast_fav_added: 'Marked as favorite',
      toast_fav_removed: 'Removed from favorites',
      toast_site_fetched: 'Site info fetched successfully!',
      toast_enter_url: 'Enter a URL to fetch info',
      toast_workflow_created: 'Workflow saved successfully',
      toast_workflow_updated: 'Workflow updated successfully',
      toast_tool_created: 'Tool saved successfully',
      toast_tool_updated: 'Tool updated successfully',
      toast_prompt_created: 'Prompt created successfully',
      toast_prompt_updated: 'Prompt updated successfully',
      toast_duplicated: (title) => `Duplicated "${title}"`,
      toast_deleted: (title) => `Deleted "${title}"`,
      err_title_required: 'Title is required',
      err_url_required: 'URL is required',
      err_prompt_content_required: 'Prompt content is required',
      err_step_title_required: 'All steps must have a title and instruction',

      // Relative Dates
      time_just_now: 'just now',
      time_mins_ago: (n) => `${n}m ago`,
      time_hours_ago: (n) => `${n}h ago`,
      time_days_ago: (n) => `${n}d ago`,

      // Filter Pill Labels
      filter_search: (q) => `Search: "${q}"`,
      filter_tag: (t) => `#${t}`,
      filter_kind: (k) => `Kind: ${k}`,
      filter_category: (c) => `Category: ${c}`,
      filter_pricing: (p) => `Pricing: ${p}`,
      filter_model: (m) => `Model: ${m}`,
      filter_status: (s) => `Status: ${s}`,
      filter_difficulty: (d) => `Difficulty: ${d}`,
      workflow_progress: (done, total) => `${done}/${total} steps completed`,
    },

    vi: {
      brand_subtitle: 'Trung tâm tài nguyên AI',
      search_placeholder: 'Tìm kiếm prompt, công cụ, website, thẻ... (Ctrl+K)',
      search_clear: 'Xóa tìm kiếm',
      view_list: 'Xem danh sách',
      view_grid: 'Xem lưới',
      add_btn: '+ Thêm',
      menu_new_workflow: 'Thêm Quy trình',
      menu_new_workflow_desc: 'Các bước tuần tự & quy trình AI tái sử dụng',
      menu_new_tool: 'Thêm Công cụ / Website',
      menu_new_tool_desc: 'Lưu web app AI, dịch vụ hoặc trang tài liệu tham khảo',
      menu_new_prompt: 'Thêm Prompt',
      menu_new_prompt_desc: 'Lưu prompt hệ thống hoặc tác vụ tái sử dụng',

      // Sidebar
      nav_resources: 'Tài nguyên',
      nav_all_resources: 'Tất cả tài nguyên',
      nav_workflows: 'Quy trình',
      nav_tools: 'Công cụ & Website',
      nav_prompts: 'Prompts',
      nav_favorites: 'Yêu thích',
      nav_filter_workflows: 'Lọc quy trình',
      nav_all_statuses: 'Tất cả trạng thái',
      nav_status_active: 'Đang dùng',
      nav_status_draft: 'Bản nháp',
      nav_status_archived: 'Lưu trữ',
      nav_all_difficulties: 'Mọi mức độ',
      diff_easy: 'Dễ',
      diff_medium: 'Trung bình',
      diff_advanced: 'Nâng cao',
      nav_filter_tools: 'Lọc công cụ',
      nav_all_types: 'Tất cả loại (Công cụ & Trang)',
      nav_tools_only: 'Chỉ công cụ',
      nav_websites_only: 'Chỉ website',
      nav_all_categories: 'Tất cả danh mục',
      nav_all_pricing: 'Tất cả mức giá',
      pricing_free: 'Miễn phí',
      pricing_freemium: 'Freemium',
      pricing_paid: 'Trả phí',
      pricing_opensource: 'Mã nguồn mở',
      pricing_unknown: 'Chưa rõ',
      nav_models: 'Mô hình / AI',
      nav_all_models: 'Tất cả mô hình',
      nav_tags: 'Thẻ',
      nav_clear: 'Xóa lọc',
      nav_no_tags: 'Chưa có thẻ nào',
      nav_future_modules: 'Mô-đun sắp tới',
      future_workflows: 'Quy trình (Workflows)',
      future_agents: 'Tác nhân (Agents)',
      future_collections: 'Bộ sưu tập (Collections)',
      future_recipes: 'Công thức (Recipes)',

      // Toolbar
      sort_label: 'Sắp xếp:',
      sort_updated_desc: 'Cập nhật gần đây',
      sort_created_desc: 'Mới nhất trước',
      sort_created_asc: 'Cũ nhất trước',
      sort_title_asc: 'Tiêu đề (A–Z)',
      sort_title_desc: 'Tiêu đề (Z–A)',

      // Card & Badges
      badge_tool: 'Công cụ',
      badge_website: 'Website',
      badge_prompt: 'Prompt',
      badge_workflow: 'Quy trình',
      btn_copy: 'Sao chép',
      btn_copy_prompt: 'Sao chép Prompt',
      btn_copy_url: 'Chép URL',
      btn_copied: 'Đã chép ✓',
      btn_open: 'Mở',
      btn_open_site: 'Mở trang web',

      // Empty & Loading States
      loading_resources: 'Đang tải tài nguyên...',
      empty_no_resources: 'Không tìm thấy tài nguyên nào',
      empty_no_resources_desc: 'Lưu công cụ AI, website hoặc prompt đầu tiên của bạn để xây dựng kho vận hành.',
      empty_no_workflows: 'Chưa có quy trình nào',
      empty_no_workflows_desc: 'Tạo các quy trình làm việc có cấu trúc để tối ưu hóa công việc của bạn.',
      empty_no_tools: 'Chưa có công cụ hoặc website AI nào',
      empty_no_tools_desc: 'Lưu công cụ hoặc trang web AI đầu tiên để bắt đầu bộ sưu tập.',
      empty_no_prompts: 'Chưa có prompt nào',
      empty_no_prompts_desc: 'Lưu prompt AI đầu tiên để xây dựng thư viện vận hành cá nhân.',
      empty_no_favs: 'Chưa có mục yêu thích nào',
      empty_no_favs_desc: 'Đánh dấu sao các prompt, công cụ, website và quy trình hữu ích để tìm nhanh tại đây.',
      empty_search_no_match: 'Không tìm thấy tài nguyên phù hợp',
      empty_search_desc: (q) => `Không có mục nào khớp với "${q}".`,
      empty_tag_no_match: (tag) => `Không có tài nguyên gắn thẻ #${tag}`,
      empty_tag_desc: 'Thử chọn một thẻ khác hoặc xóa bộ lọc.',
      btn_add_workflow: '+ Thêm Quy trình',
      btn_add_tool: '+ Thêm Công cụ / Website',
      btn_add_prompt: '+ Thêm Prompt',
      btn_load_more: 'Tải thêm',

      // Modals
      modal_new_workflow: 'Thêm Quy trình mới',
      modal_edit_workflow: 'Chỉnh sửa Quy trình',
      modal_new_tool: 'Thêm Công cụ / Website mới',
      modal_edit_tool: 'Chỉnh sửa Công cụ / Website',
      modal_new_prompt: 'Thêm Prompt mới',
      modal_edit_prompt: 'Chỉnh sửa Prompt',
      label_purpose: 'Mục tiêu / Mục đích',
      label_purpose_hint: '(mục đích đạt được của quy trình)',
      label_status: 'Trạng thái',
      label_difficulty: 'Độ khó',
      label_estimated_time: 'Thời gian ước tính',
      label_estimated_time_hint: '(ví dụ: 15 phút, 1 giờ)',
      label_steps: 'Các bước thực hiện',
      label_steps_hint: 'Trình tự các bước thực hiện',
      btn_add_step: '+ Thêm bước',
      label_step_title: 'Tiêu đề bước',
      label_step_instruction: 'Hướng dẫn & Prompts',
      label_step_optional: 'Bước tùy chọn (không bắt buộc)',
      label_step_notes: 'Ghi chú / Mẹo',
      label_linked_resources: 'Tài nguyên liên kết',
      btn_link_resource: '+ Liên kết tài nguyên',
      picker_title: 'Chọn tài nguyên liên kết',
      picker_search_placeholder: 'Tìm kiếm prompt, công cụ, website...',
      picker_select: 'Chọn',
      picker_no_results: 'Không tìm thấy tài nguyên phù hợp',
      btn_save_workflow: 'Lưu Quy trình',
      btn_copy_workflow: 'Chép Markdown',
      label_url: 'URL',
      label_url_hint: 'Dán URL đầy đủ có http:// hoặc https://',
      btn_fetch_info: '⚡ Lấy thông tin',
      btn_fetching: 'Đang lấy...',
      label_title: 'Tiêu đề',
      label_kind: 'Loại',
      opt_kind_tool: 'Công cụ AI / Web App',
      opt_kind_website: 'Website / Tham khảo / Danh bạ',
      label_pricing: 'Mức giá',
      label_favorite: 'Yêu thích',
      label_mark_favorite: 'Đánh dấu yêu thích',
      label_provider: 'Nhà cung cấp / Tác giả',
      label_category: 'Danh mục',
      label_description: 'Mô tả',
      label_desc_hint: '(tóm tắt ngắn hoặc khẩu hiệu)',
      label_notes: 'Ghi chú cá nhân',
      label_notes_hint: '(ghi chú cách dùng, phím tắt, mẹo)',
      label_tags: 'Thẻ',
      label_tags_hint_tool: '(phân tách bằng dấu phẩy, vd: coding, llm, nhanh, api)',
      label_tags_hint_prompt: '(phân tách bằng dấu phẩy, vd: coding, refactor, python)',
      label_model: 'Mô hình / AI dự định dùng',
      label_prompt_desc_hint: '(tóm tắt hoặc ghi chú sử dụng tùy chọn)',
      label_prompt_content: 'Nội dung Prompt',
      label_prompt_content_hint: 'Văn bản thuần • Giữ nguyên khoảng trắng',
      btn_cancel: 'Hủy',
      btn_save_tool: 'Lưu công cụ',
      btn_save_prompt: 'Lưu Prompt',
      btn_save_changes: 'Lưu thay đổi',

      // Detail Dialogs
      notes_tips_title: 'Ghi chú & Mẹo cá nhân',
      btn_duplicate: 'Nhân bản',
      btn_edit: 'Chỉnh sửa',
      btn_delete: 'Xóa',
      updated_recently: 'Cập nhật gần đây',
      updated_at: (date) => `Đã cập nhật ${date}`,

      // Delete Dialog
      delete_resource_title: 'Xóa tài nguyên',
      delete_prompt_title: 'Xóa Prompt',
      delete_confirm_text: (name) => `Bạn có chắc chắn muốn xóa vĩnh viễn "${name}"?`,
      delete_warning: 'Hành động này không thể hoàn tác.',
      btn_delete_permanently: 'Xóa vĩnh viễn',

      // Toasts & Errors
      toast_copied: 'Đã sao chép vào bộ nhớ tạm',
      toast_copy_failed: 'Không thể sao chép vào bộ nhớ tạm',
      toast_fav_added: 'Đã thêm vào mục yêu thích',
      toast_fav_removed: 'Đã xóa khỏi mục yêu thích',
      toast_site_fetched: 'Đã lấy thông tin trang thành công!',
      toast_enter_url: 'Vui lòng nhập URL để lấy thông tin',
      toast_workflow_created: 'Đã lưu quy trình thành công',
      toast_workflow_updated: 'Đã cập nhật quy trình thành công',
      toast_tool_created: 'Đã lưu công cụ thành công',
      toast_tool_updated: 'Đã cập nhật công cụ thành công',
      toast_prompt_created: 'Đã tạo prompt thành công',
      toast_prompt_updated: 'Đã cập nhật prompt thành công',
      toast_duplicated: (title) => `Đã nhân bản "${title}"`,
      toast_deleted: (title) => `Đã xóa "${title}"`,
      err_title_required: 'Tiêu đề là bắt buộc',
      err_url_required: 'URL là bắt buộc',
      err_prompt_content_required: 'Nội dung Prompt là bắt buộc',
      err_step_title_required: 'Mỗi bước phải có tiêu đề và hướng dẫn',

      // Relative Dates
      time_just_now: 'vừa xong',
      time_mins_ago: (n) => `${n} phút trước`,
      time_hours_ago: (n) => `${n} giờ trước`,
      time_days_ago: (n) => `${n} ngày trước`,

      // Filter Pill Labels
      filter_search: (q) => `Tìm kiếm: "${q}"`,
      filter_tag: (t) => `#${t}`,
      filter_kind: (k) => `Loại: ${k === 'website' ? 'Website' : 'Công cụ'}`,
      filter_category: (c) => `Danh mục: ${c}`,
      filter_pricing: (p) => `Mức giá: ${p}`,
      filter_model: (m) => `Mô hình: ${m}`,
      filter_status: (s) => `Trạng thái: ${s}`,
      filter_difficulty: (d) => `Độ khó: ${d}`,
      workflow_progress: (done, total) => `Đã hoàn thành ${done}/${total} bước`,
    },
  };

  // --- State ---
  const state = {
    lang: localStorage.getItem('pilot_lang') || 'en', // strictly default to English
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
    workflowStatus: null,
    workflowDifficulty: null,
    favorite: null, // true | null
    sort: 'updated_at',
    order: 'desc',
    viewMode: localStorage.getItem('pilot_view_mode') || 'list',
    currentNav: 'all-resources', // 'all-resources' | 'workflows' | 'tools' | 'prompts' | 'favorites'
    activeDetailPrompt: null,
    activeDetailTool: null,
    activeDetailWorkflow: null,
    currentEditingWorkflowSteps: [],
    activeStepIndexForPicker: null,
    activeWorkflowChecklistState: {},
    itemToDelete: null, // { id, title, type: 'prompt' | 'tool' | 'website' | 'workflow' }
    tags: [],
    models: [],
    categories: [],
    providers: [],
    isLoading: false,
  };

  function t(key, ...args) {
    const langDict = I18N[state.lang] || I18N.en;
    const val = langDict[key] ?? I18N.en[key] ?? key;
    if (typeof val === 'function') {
      return val(...args);
    }
    return val;
  }

  function getLocalizedPricing(pricing) {
    if (!pricing || pricing === 'Unknown') return t('pricing_unknown');
    const lower = pricing.toLowerCase().replace(/\s+/g, '');
    if (lower === 'free') return t('pricing_free');
    if (lower === 'freemium') return t('pricing_freemium');
    if (lower === 'paid') return t('pricing_paid');
    if (lower === 'opensource') return t('pricing_opensource');
    return pricing;
  }

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
    langToggleBtn: document.getElementById('lang-toggle-btn'),
    langCode: document.getElementById('lang-code'),

    // Add Dropdown
    addBtn: document.getElementById('add-btn'),
    addDropdownMenu: document.getElementById('add-dropdown-menu'),
    menuAddWorkflowBtn: document.getElementById('menu-add-workflow-btn'),
    menuAddToolBtn: document.getElementById('menu-add-tool-btn'),
    menuAddPromptBtn: document.getElementById('menu-add-prompt-btn'),

    // View & Active Filters
    currentViewTitle: document.getElementById('current-view-title'),
    activeFiltersContainer: document.getElementById('active-filters-container'),
    sortSelect: document.getElementById('sort-select'),

    // Badges & Navigation
    badgeAllResourcesCount: document.getElementById('badge-all-resources-count'),
    badgeWorkflowsCount: document.getElementById('badge-workflows-count'),
    badgeToolsCount: document.getElementById('badge-tools-count'),
    badgePromptsCount: document.getElementById('badge-prompts-count'),
    badgeFavCount: document.getElementById('badge-fav-count'),

    // Sidebar Filters
    sidebarWorkflowsFilters: document.getElementById('sidebar-workflows-filters'),
    workflowStatusFilterSelect: document.getElementById('workflow-status-filter-select'),
    workflowDiffFilterSelect: document.getElementById('workflow-diff-filter-select'),
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
    emptyAddWorkflowBtn: document.getElementById('empty-add-workflow-btn'),
    emptyAddToolBtn: document.getElementById('empty-add-tool-btn'),
    emptyAddPromptBtn: document.getElementById('empty-add-prompt-btn'),
    toastContainer: document.getElementById('toast-container'),

    // Workflow Form Dialog
    workflowFormDialog: document.getElementById('workflow-form-dialog'),
    workflowForm: document.getElementById('workflow-form'),
    workflowFormTitle: document.getElementById('workflow-form-title'),
    workflowFormCloseBtn: document.getElementById('workflow-form-close-btn'),
    workflowFormCancelBtn: document.getElementById('workflow-form-cancel-btn'),
    workflowFormSubmitBtn: document.getElementById('workflow-form-submit-btn'),
    inputWorkflowId: document.getElementById('workflow-id'),
    inputWorkflowTitle: document.getElementById('workflow-title'),
    inputWorkflowPurpose: document.getElementById('workflow-purpose'),
    inputWorkflowStatus: document.getElementById('workflow-status'),
    inputWorkflowDifficulty: document.getElementById('workflow-difficulty'),
    inputWorkflowEstimatedTime: document.getElementById('workflow-estimated-time'),
    inputWorkflowFavorite: document.getElementById('workflow-favorite'),
    inputWorkflowDescription: document.getElementById('workflow-description'),
    inputWorkflowTags: document.getElementById('workflow-tags'),
    inputWorkflowNotes: document.getElementById('workflow-notes'),
    workflowAddStepBtn: document.getElementById('workflow-add-step-btn'),
    workflowFormStepsList: document.getElementById('workflow-form-steps-list'),

    // Workflow Detail Dialog
    workflowDetailDialog: document.getElementById('workflow-detail-dialog'),
    workflowDetailCloseBtn: document.getElementById('workflow-detail-close-btn'),
    workflowDetailFavBtn: document.getElementById('workflow-detail-fav-btn'),
    workflowDetailTitle: document.getElementById('workflow-detail-title'),
    workflowDetailStatus: document.getElementById('workflow-detail-status'),
    workflowDetailDifficulty: document.getElementById('workflow-detail-difficulty'),
    workflowDetailEstTime: document.getElementById('workflow-detail-est-time'),
    workflowDetailUpdated: document.getElementById('workflow-detail-updated'),
    workflowDetailPurposeBox: document.getElementById('workflow-detail-purpose-box'),
    workflowDetailPurpose: document.getElementById('workflow-detail-purpose'),
    workflowDetailDescription: document.getElementById('workflow-detail-description'),
    workflowProgressWrapper: document.getElementById('workflow-progress-wrapper'),
    workflowProgressText: document.getElementById('workflow-progress-text'),
    workflowProgressFill: document.getElementById('workflow-progress-fill'),
    workflowDetailStepsList: document.getElementById('workflow-detail-steps-list'),
    workflowDetailNotesWrapper: document.getElementById('workflow-detail-notes-wrapper'),
    workflowDetailNotes: document.getElementById('workflow-detail-notes'),
    workflowDetailTagsRow: document.getElementById('workflow-detail-tags-row'),
    workflowDetailDeleteBtn: document.getElementById('workflow-detail-delete-btn'),
    workflowDetailCopyMdBtn: document.getElementById('workflow-detail-copy-md-btn'),
    workflowDetailDuplicateBtn: document.getElementById('workflow-detail-duplicate-btn'),
    workflowDetailEditBtn: document.getElementById('workflow-detail-edit-btn'),

    // Resource Picker Dialog
    resourcePickerDialog: document.getElementById('resource-picker-dialog'),
    resourcePickerTitle: document.getElementById('resource-picker-title'),
    resourcePickerCloseBtn: document.getElementById('resource-picker-close-btn'),
    resourcePickerSearch: document.getElementById('resource-picker-search'),
    resourcePickerResults: document.getElementById('resource-picker-results'),
    resourcePickerCancelBtn: document.getElementById('resource-picker-cancel-btn'),

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
    deleteConfirmPromptMsg: document.getElementById('delete-confirm-prompt-msg'),
    deleteCancelBtn: document.getElementById('delete-cancel-btn'),
    deleteConfirmBtn: document.getElementById('delete-confirm-btn'),
  };

  // --- Utility Functions ---

  function setLanguage(lang) {
    if (lang !== 'en' && lang !== 'vi') lang = 'en';
    state.lang = lang;
    localStorage.setItem('pilot_lang', lang);
    document.documentElement.lang = lang;

    if (el.langCode) {
      el.langCode.textContent = lang.toUpperCase();
    }

    // Apply data-i18n attributes
    document.querySelectorAll('[data-i18n]').forEach((node) => {
      const k = node.getAttribute('data-i18n');
      if (k) node.textContent = t(k);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((node) => {
      const k = node.getAttribute('data-i18n-placeholder');
      if (k) node.placeholder = t(k);
    });

    document.querySelectorAll('[data-i18n-title]').forEach((node) => {
      const k = node.getAttribute('data-i18n-title');
      if (k) node.title = t(k);
    });

    // Refresh dynamic parts
    updateActiveFilters();
    renderTagsList();
    renderModelOptions();
    renderCategoryAndProviderOptions();
    renderResourcesList();
  }

  function toggleLanguage() {
    const nextLang = state.lang === 'en' ? 'vi' : 'en';
    setLanguage(nextLang);
    showToast(nextLang === 'vi' ? 'Đã chuyển sang Tiếng Việt' : 'Switched to English');
  }

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
      if (diffSec < 60) return t('time_just_now');
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return t('time_mins_ago', diffMin);
      const diffHours = Math.floor(diffMin / 60);
      if (diffHours < 24) return t('time_hours_ago', diffHours);
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return t('time_days_ago', diffDays);
      const locale = state.lang === 'vi' ? 'vi-VN' : 'en-US';
      return date.toLocaleDateString(locale, { month: 'short', day: 'numeric', year: 'numeric' });
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
        btnElement.textContent = t('btn_copied');
        setTimeout(() => {
          btnElement.classList.remove('copied');
          btnElement.innerHTML = originalContent;
        }, 1800);
      }
      showToast(t('toast_copied'));
    } catch {
      showToast(t('toast_copy_failed'), 'error');
    }
  }

  function debounce(fn, ms) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), ms);
    };
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
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

      if (state.currentNav === 'workflows') {
        endpoint = '/api/workflows';
        if (state.workflowStatus) params.set('status', state.workflowStatus);
        if (state.workflowDifficulty) params.set('difficulty', state.workflowDifficulty);
      } else if (state.currentNav === 'tools') {
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
        showEmptyState(t('empty_no_resources'), err.message);
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
      const [allRes, workflowsRes, toolsRes, promptsRes, favRes] = await Promise.all([
        apiFetch('/api/resources?limit=1'),
        apiFetch('/api/workflows?limit=1'),
        apiFetch('/api/tools?limit=1'),
        apiFetch('/api/prompts?limit=1'),
        apiFetch('/api/resources?favorite=true&limit=1'),
      ]);

      el.badgeAllResourcesCount.textContent = allRes.meta?.total ?? 0;
      if (el.badgeWorkflowsCount) el.badgeWorkflowsCount.textContent = workflowsRes.meta?.total ?? 0;
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
      hint.textContent = t('nav_no_tags');
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
    el.modelFilterSelect.innerHTML = `<option value="">${t('nav_all_models')}</option>`;
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
    el.toolCategoryFilterSelect.innerHTML = `<option value="">${t('nav_all_categories')}</option>`;
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
        showEmptyState(t('empty_search_no_match'), t('empty_search_desc', state.q));
      } else if (state.currentNav === 'favorites') {
        showEmptyState(t('empty_no_favs'), t('empty_no_favs_desc'));
      } else if (state.tag) {
        showEmptyState(t('empty_tag_no_match', state.tag), t('empty_tag_desc'));
      } else if (state.currentNav === 'workflows') {
        showEmptyState(t('empty_no_workflows'), t('empty_no_workflows_desc'));
      } else if (state.currentNav === 'tools') {
        showEmptyState(t('empty_no_tools'), t('empty_no_tools_desc'));
      } else if (state.currentNav === 'prompts') {
        showEmptyState(t('empty_no_prompts'), t('empty_no_prompts_desc'));
      } else {
        showEmptyState(t('empty_no_resources'), t('empty_no_resources_desc'));
      }
      return;
    }

    el.emptyState.classList.add('hidden');
    el.resourcesList.classList.remove('hidden');

    const sliceItems = append ? state.items.slice(state.offset) : state.items;
    for (const item of sliceItems) {
      const itemType = item.type || (item.content !== undefined ? 'prompt' : (item.steps !== undefined || item.extra?.stepCount !== undefined ? 'workflow' : 'tool'));
      if (itemType === 'prompt') {
        const card = createPromptCardElement(item);
        el.resourcesList.appendChild(card);
      } else if (itemType === 'workflow') {
        const card = createWorkflowCardElement(item);
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

    // Favicon image
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
    kindBadge.textContent = kind === 'website' ? t('badge_website') : t('badge_tool');
    titleGroup.appendChild(kindBadge);

    // Pricing Badge
    if (pricing && pricing !== 'Unknown') {
      const pricingBadge = document.createElement('span');
      const pricingClass = pricing.toLowerCase().replace(/\s+/g, '');
      pricingBadge.className = `badge badge-pricing pricing-${pricingClass}`;
      pricingBadge.textContent = getLocalizedPricing(pricing);
      titleGroup.appendChild(pricingBadge);
    }

    // Quick Actions
    const quickActions = document.createElement('div');
    quickActions.className = 'card-actions-quick';

    const copyBtn = document.createElement('button');
    copyBtn.className = 'btn btn-copy';
    copyBtn.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
      <span>${t('btn_copy_url')}</span>
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
      <span>${t('btn_open')}</span>
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
      for (const tag of tags.slice(0, 4)) {
        const tagPill = document.createElement('span');
        tagPill.className = 'card-tag';
        tagPill.textContent = `#${tag}`;
        tagPill.addEventListener('click', (e) => {
          e.stopPropagation();
          state.tag = tag;
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
    promptBadge.textContent = t('badge_prompt');
    titleGroup.appendChild(promptBadge);

    const quickActions = document.createElement('div');
    quickActions.className = 'card-actions-quick';

    const copyBtn = document.createElement('button');
    copyBtn.className = 'btn btn-copy';
    copyBtn.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
      <span>${t('btn_copy')}</span>
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
      for (const tag of tags.slice(0, 4)) {
        const tagPill = document.createElement('span');
        tagPill.className = 'card-tag';
        tagPill.textContent = `#${tag}`;
        tagPill.addEventListener('click', (e) => {
          e.stopPropagation();
          state.tag = tag;
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

  function createWorkflowCardElement(workflow) {
    const card = document.createElement('article');
    card.className = 'prompt-card';
    card.setAttribute('data-id', workflow.id);

    // Header row: Title + Actions (Favorite + Copy Markdown)
    const headerRow = document.createElement('div');
    headerRow.className = 'card-header-row';

    const titleGroup = document.createElement('div');
    titleGroup.className = 'card-title-group';

    // Favorite button
    const favBtn = document.createElement('button');
    favBtn.className = `favorite-star-btn ${workflow.favorite ? 'active' : ''}`;
    favBtn.title = workflow.favorite ? 'Unfavorite' : 'Favorite';
    favBtn.setAttribute('aria-label', favBtn.title);
    favBtn.innerHTML = `
      <svg class="star-icon" width="16" height="16" viewBox="0 0 24 24" fill="${workflow.favorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    `;
    favBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleWorkflowFavorite(workflow, favBtn);
    });

    const title = document.createElement('h2');
    title.className = 'card-title';
    title.textContent = workflow.title;

    titleGroup.appendChild(favBtn);
    titleGroup.appendChild(title);

    // Workflow Badge
    const wfBadge = document.createElement('span');
    wfBadge.className = 'badge badge-workflow';
    wfBadge.textContent = t('badge_workflow');
    titleGroup.appendChild(wfBadge);

    // Difficulty badge
    const difficulty = workflow.difficulty || workflow.extra?.difficulty || 'Medium';
    const diffBadge = document.createElement('span');
    diffBadge.className = `badge badge-difficulty diff-${difficulty.toLowerCase()}`;
    diffBadge.textContent = difficulty;
    titleGroup.appendChild(diffBadge);

    // Status badge if Draft or Archived
    const status = workflow.status || workflow.extra?.status || 'Active';
    if (status !== 'Active') {
      const statusBadge = document.createElement('span');
      statusBadge.className = `badge badge-status status-${status.toLowerCase()}`;
      statusBadge.textContent = status;
      titleGroup.appendChild(statusBadge);
    }

    const quickActions = document.createElement('div');
    quickActions.className = 'card-actions-quick';

    const copyBtn = document.createElement('button');
    copyBtn.className = 'btn btn-copy';
    copyBtn.innerHTML = `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
      <span>${t('btn_copy_workflow')}</span>
    `;
    copyBtn.addEventListener('click', async (e) => {
      e.stopPropagation();
      const md = await getWorkflowMarkdown(workflow);
      copyToClipboard(md, copyBtn);
    });

    quickActions.appendChild(copyBtn);
    headerRow.appendChild(titleGroup);
    headerRow.appendChild(quickActions);
    card.appendChild(headerRow);

    // Purpose or description snippet
    const summaryText = workflow.purpose || workflow.extra?.purpose || workflow.description;
    if (summaryText) {
      const desc = document.createElement('p');
      desc.className = 'card-description';
      desc.textContent = summaryText;
      card.appendChild(desc);
    }

    // Footer row: Step count, Est time, Tags, Date
    const footerRow = document.createElement('div');
    footerRow.className = 'card-footer-row';

    const metaLeft = document.createElement('div');
    metaLeft.className = 'card-meta-left';

    const stepCount = workflow.stepCount !== undefined
      ? workflow.stepCount
      : (workflow.steps ? workflow.steps.length : (workflow.extra?.stepCount ?? 0));
    const stepCountPill = document.createElement('span');
    stepCountPill.className = 'workflow-step-count-pill';
    stepCountPill.textContent = `${stepCount} ${stepCount === 1 ? 'step' : 'steps'}`;
    metaLeft.appendChild(stepCountPill);

    const estTime = workflow.estimatedTime || workflow.extra?.estimatedTime;
    if (estTime) {
      const timeBadge = document.createElement('span');
      timeBadge.className = 'model-badge';
      timeBadge.textContent = `⏱ ${estTime}`;
      metaLeft.appendChild(timeBadge);
    }

    const tags = Array.isArray(workflow.tags) ? workflow.tags : [];
    if (tags.length > 0) {
      for (const tag of tags.slice(0, 4)) {
        const tagPill = document.createElement('span');
        tagPill.className = 'card-tag';
        tagPill.textContent = `#${tag}`;
        tagPill.addEventListener('click', (e) => {
          e.stopPropagation();
          state.tag = tag;
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
    timeSpan.textContent = formatRelativeDate(workflow.updatedAt);
    metaLeft.appendChild(timeSpan);

    footerRow.appendChild(metaLeft);
    card.appendChild(footerRow);

    card.addEventListener('click', () => {
      openWorkflowDetailDialog(workflow);
    });

    return card;
  }

  async function getWorkflowMarkdown(wf) {
    let full = wf;
    if (!full.steps) {
      try {
        const res = await apiFetch(`/api/workflows/${wf.id}`);
        full = res.data;
      } catch {
        // fallback to summary
      }
    }
    return formatWorkflowToMarkdown(full);
  }

  function formatWorkflowToMarkdown(wf) {
    let md = `# ${wf.title}\n`;
    const purpose = wf.purpose || wf.extra?.purpose;
    if (purpose) md += `\n> ${purpose}\n`;
    if (wf.description && wf.description !== purpose) md += `\n${wf.description}\n`;

    md += `\n- **Status:** ${wf.status || 'Active'}`;
    md += `\n- **Difficulty:** ${wf.difficulty || 'Medium'}`;
    const estTime = wf.estimatedTime || wf.extra?.estimatedTime;
    if (estTime) md += `\n- **Estimated Time:** ${estTime}`;
    const tags = Array.isArray(wf.tags) ? wf.tags : [];
    if (tags.length > 0) md += `\n- **Tags:** ${tags.map((t) => '#' + t).join(' ')}`;
    md += '\n';

    if (Array.isArray(wf.steps) && wf.steps.length > 0) {
      md += `\n## Steps\n`;
      wf.steps.forEach((step, idx) => {
        md += `\n### Step ${idx + 1}: ${step.title}\n`;
        const stepInst = step.instructions || step.instruction;
        if (stepInst) {
          md += `\n${stepInst}\n`;
        }
        if (Array.isArray(step.linkedResources) && step.linkedResources.length > 0) {
          md += `\n**Linked Resources:**\n`;
          step.linkedResources.forEach((lr) => {
            const type = (lr.targetResourceType || 'Resource').toUpperCase();
            const title = lr.targetResourceTitle || lr.targetResourceId;
            md += `- [${type}] ${title}\n`;
          });
        }
      });
    }

    if (wf.notes) {
      md += `\n## Personal Notes & Tips\n\n${wf.notes}\n`;
    }

    return md.trim();
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
      el.currentViewTitle.textContent = t('nav_favorites');
    } else if (state.currentNav === 'workflows') {
      el.currentViewTitle.textContent = t('nav_workflows');
    } else if (state.currentNav === 'tools') {
      el.currentViewTitle.textContent = t('nav_tools');
    } else if (state.currentNav === 'prompts') {
      el.currentViewTitle.textContent = t('nav_prompts');
    } else {
      el.currentViewTitle.textContent = t('nav_all_resources');
    }

    // Pill for Search
    if (state.q) {
      const pill = createFilterPill(t('filter_search', state.q), () => {
        state.q = '';
        el.search.value = '';
        el.searchClear.classList.add('hidden');
        loadData();
      });
      el.activeFiltersContainer.appendChild(pill);
    }

    // Pill for Tag
    if (state.tag) {
      const pill = createFilterPill(t('filter_tag', state.tag), () => {
        state.tag = null;
        loadData();
        renderTagsList();
      });
      el.activeFiltersContainer.appendChild(pill);
    }

    // Pill for Workflow Status
    if (state.workflowStatus) {
      const pill = createFilterPill(t('filter_status', state.workflowStatus), () => {
        state.workflowStatus = null;
        if (el.workflowStatusFilterSelect) el.workflowStatusFilterSelect.value = '';
        loadData();
      });
      el.activeFiltersContainer.appendChild(pill);
    }

    // Pill for Workflow Difficulty
    if (state.workflowDifficulty) {
      const pill = createFilterPill(t('filter_difficulty', state.workflowDifficulty), () => {
        state.workflowDifficulty = null;
        if (el.workflowDiffFilterSelect) el.workflowDiffFilterSelect.value = '';
        loadData();
      });
      el.activeFiltersContainer.appendChild(pill);
    }

    // Pill for Tool Kind
    if (state.toolKind) {
      const pill = createFilterPill(t('filter_kind', state.toolKind), () => {
        state.toolKind = null;
        el.toolKindFilterSelect.value = '';
        loadData();
      });
      el.activeFiltersContainer.appendChild(pill);
    }

    // Pill for Tool Category
    if (state.toolCategory) {
      const pill = createFilterPill(t('filter_category', state.toolCategory), () => {
        state.toolCategory = null;
        el.toolCategoryFilterSelect.value = '';
        loadData();
      });
      el.activeFiltersContainer.appendChild(pill);
    }

    // Pill for Tool Pricing
    if (state.toolPricing) {
      const pill = createFilterPill(t('filter_pricing', getLocalizedPricing(state.toolPricing)), () => {
        state.toolPricing = null;
        el.toolPricingFilterSelect.value = '';
        loadData();
      });
      el.activeFiltersContainer.appendChild(pill);
    }

    // Pill for Prompt Model
    if (state.model) {
      const pill = createFilterPill(t('filter_model', state.model), () => {
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
      showToast(nextState ? t('toast_fav_added') : t('toast_fav_removed'));
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
      showToast(nextState ? t('toast_fav_added') : t('toast_fav_removed'));
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

  async function toggleWorkflowFavorite(wf, starButtonElement) {
    const nextState = !wf.favorite;
    wf.favorite = nextState;

    if (starButtonElement) {
      starButtonElement.classList.toggle('active', nextState);
      const starIcon = starButtonElement.querySelector('.star-icon');
      if (starIcon) {
        starIcon.setAttribute('fill', nextState ? 'currentColor' : 'none');
      }
    }

    try {
      await apiFetch(`/api/workflows/${wf.id}/favorite`, {
        method: 'PATCH',
        body: JSON.stringify({ favorite: nextState }),
      });
      updateCounts();
      showToast(nextState ? t('toast_fav_added') : t('toast_fav_removed'));
      if (state.currentNav === 'favorites' && !nextState) {
        loadData();
      }
    } catch (err) {
      wf.favorite = !nextState;
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
      } catch {
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
    el.toolDetailKind.textContent = tool.kind === 'website' ? t('badge_website') : t('badge_tool');
    el.toolDetailKind.className = `badge badge-kind kind-${tool.kind}`;

    const pricing = tool.pricing || 'Unknown';
    el.toolDetailPricing.textContent = getLocalizedPricing(pricing);
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

    el.toolDetailUpdated.textContent = t('updated_at', formatRelativeDate(tool.updatedAt));

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
      for (const tag of tags) {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'card-tag';
        tagSpan.textContent = `#${tag}`;
        tagSpan.addEventListener('click', () => {
          el.toolDetailDialog.close();
          state.tag = tag;
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
      } catch {
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
    el.promptDetailUpdated.textContent = t('updated_at', formatRelativeDate(prompt.updatedAt));

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
      for (const tag of tags) {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'card-tag';
        tagSpan.textContent = `#${tag}`;
        tagSpan.addEventListener('click', () => {
          el.promptDetailDialog.close();
          state.tag = tag;
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

  // --- Workflow Detail Dialog ---

  async function openWorkflowDetailDialog(wfOrId) {
    let wf = typeof wfOrId === 'string' ? null : wfOrId;

    if (!wf || !wf.steps) {
      const id = typeof wfOrId === 'string' ? wfOrId : wfOrId.id;
      try {
        const res = await apiFetch(`/api/workflows/${id}`);
        wf = res.data;
      } catch {
        showToast('Failed to load workflow details', 'error');
        return;
      }
    }

    state.activeDetailWorkflow = wf;

    el.workflowDetailTitle.textContent = wf.title;
    el.workflowDetailFavBtn.classList.toggle('active', Boolean(wf.favorite));
    const starIcon = el.workflowDetailFavBtn.querySelector('.star-icon');
    if (starIcon) {
      starIcon.setAttribute('fill', wf.favorite ? 'currentColor' : 'none');
    }

    // Status badge
    const status = wf.status || 'Active';
    el.workflowDetailStatus.textContent = status;
    el.workflowDetailStatus.className = `badge badge-status status-${status.toLowerCase()}`;

    // Difficulty badge
    const difficulty = wf.difficulty || 'Medium';
    el.workflowDetailDifficulty.textContent = difficulty;
    el.workflowDetailDifficulty.className = `badge badge-difficulty diff-${difficulty.toLowerCase()}`;

    // Estimated time
    const estTime = wf.estimatedTime || wf.extra?.estimatedTime;
    if (estTime) {
      el.workflowDetailEstTime.textContent = `⏱ ${estTime}`;
      el.workflowDetailEstTime.classList.remove('hidden');
    } else {
      el.workflowDetailEstTime.classList.add('hidden');
    }

    el.workflowDetailUpdated.textContent = t('updated_at', formatRelativeDate(wf.updatedAt));

    // Purpose Box
    const purpose = wf.purpose || wf.extra?.purpose;
    if (purpose) {
      el.workflowDetailPurpose.textContent = purpose;
      el.workflowDetailPurposeBox.classList.remove('hidden');
    } else {
      el.workflowDetailPurposeBox.classList.add('hidden');
    }

    // Description
    if (wf.description && wf.description !== purpose) {
      el.workflowDetailDescription.textContent = wf.description;
      el.workflowDetailDescription.classList.remove('hidden');
    } else {
      el.workflowDetailDescription.classList.add('hidden');
    }

    // Notes
    if (wf.notes) {
      el.workflowDetailNotes.textContent = wf.notes;
      el.workflowDetailNotesWrapper.classList.remove('hidden');
    } else {
      el.workflowDetailNotesWrapper.classList.add('hidden');
    }

    // Tags
    el.workflowDetailTagsRow.innerHTML = '';
    const tags = Array.isArray(wf.tags) ? wf.tags : [];
    if (tags.length > 0) {
      for (const tag of tags) {
        const tagSpan = document.createElement('span');
        tagSpan.className = 'card-tag';
        tagSpan.textContent = `#${tag}`;
        tagSpan.addEventListener('click', () => {
          el.workflowDetailDialog.close();
          state.tag = tag;
          loadData();
          renderTagsList();
        });
        el.workflowDetailTagsRow.appendChild(tagSpan);
      }
      el.workflowDetailTagsRow.classList.remove('hidden');
    } else {
      el.workflowDetailTagsRow.classList.add('hidden');
    }

    // Render interactive steps
    renderWorkflowDetailSteps(wf);

    // Update URL query param without reload
    const currentUrl = new URL(window.location);
    currentUrl.searchParams.set('workflow', wf.id);
    currentUrl.searchParams.delete('tool');
    currentUrl.searchParams.delete('prompt');
    window.history.replaceState({}, '', currentUrl);

    el.workflowDetailDialog.showModal();
  }

  function closeWorkflowDetailDialog() {
    state.activeDetailWorkflow = null;
    el.workflowDetailDialog.close();

    const currentUrl = new URL(window.location);
    currentUrl.searchParams.delete('workflow');
    window.history.replaceState({}, '', currentUrl);
  }

  function renderWorkflowDetailSteps(wf) {
    el.workflowDetailStepsList.innerHTML = '';
    const steps = Array.isArray(wf.steps) ? wf.steps : [];
    const totalSteps = steps.length;

    function updateProgress() {
      let doneCount = 0;
      steps.forEach((s, idx) => {
        const checkKey = `${wf.id}:${s.id || idx}`;
        if (state.activeWorkflowChecklistState[checkKey]) {
          doneCount++;
        }
      });

      el.workflowProgressText.textContent = t('workflow_progress', doneCount, totalSteps);
      const pct = totalSteps > 0 ? Math.round((doneCount / totalSteps) * 100) : 0;
      el.workflowProgressFill.style.width = `${pct}%`;
    }

    updateProgress();

    steps.forEach((step, idx) => {
      const stepKey = `${wf.id}:${step.id || idx}`;
      const isChecked = Boolean(state.activeWorkflowChecklistState[stepKey]);

      const card = document.createElement('div');
      card.className = `workflow-step-card ${isChecked ? 'completed' : ''}`;

      // Step header row
      const header = document.createElement('div');
      header.className = 'workflow-step-header';

      const left = document.createElement('div');
      left.className = 'step-header-left';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'step-checkbox';
      checkbox.id = `step-check-${idx}`;
      checkbox.checked = isChecked;

      checkbox.addEventListener('change', () => {
        state.activeWorkflowChecklistState[stepKey] = checkbox.checked;
        card.classList.toggle('completed', checkbox.checked);
        updateProgress();
      });

      const label = document.createElement('label');
      label.className = 'step-title-label';
      label.htmlFor = `step-check-${idx}`;
      label.textContent = `${idx + 1}. ${step.title}`;

      left.appendChild(checkbox);
      left.appendChild(label);

      const copyStepBtn = document.createElement('button');
      copyStepBtn.className = 'btn btn-copy btn-sm';
      copyStepBtn.title = t('btn_copy_step');
      copyStepBtn.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
        <span>${t('btn_copy_step')}</span>
      `;
      copyStepBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const instText = step.instructions || step.instruction || '';
        const copyText = `${step.title}\n\n${instText}`.trim();
        copyToClipboard(copyText, copyStepBtn);
      });

      header.appendChild(left);
      header.appendChild(copyStepBtn);
      card.appendChild(header);

      // Step instructions
      const inst = step.instructions || step.instruction || '';
      if (inst) {
        const instBox = document.createElement('div');
        instBox.className = 'step-instructions';
        instBox.textContent = inst;
        card.appendChild(instBox);
      }

      // Step linked resources
      const linked = Array.isArray(step.linkedResources) ? step.linkedResources : [];
      if (linked.length > 0) {
        const linkedSection = document.createElement('div');
        linkedSection.className = 'step-linked-section';

        const linkedLabel = document.createElement('div');
        linkedLabel.className = 'step-linked-label';
        linkedLabel.textContent = t('picker_linked_resources');
        linkedSection.appendChild(linkedLabel);

        const chipsWrap = document.createElement('div');
        chipsWrap.className = 'step-linked-chips';

        linked.forEach((lr) => {
          const chip = document.createElement('div');
          chip.className = 'linked-resource-chip';
          chip.title = `Click to view ${lr.targetResourceTitle}`;

          const typeBadge = document.createElement('span');
          typeBadge.className = `badge badge-kind kind-${lr.targetResourceType || 'tool'}`;
          typeBadge.textContent = lr.targetResourceType === 'prompt' ? t('badge_prompt') : (lr.targetResourceType === 'website' ? t('badge_website') : t('badge_tool'));

          const nameSpan = document.createElement('span');
          nameSpan.className = 'chip-title';
          nameSpan.textContent = lr.targetResourceTitle || lr.targetResourceId;

          const arrowIcon = document.createElement('span');
          arrowIcon.className = 'chip-arrow';
          arrowIcon.innerHTML = '&nearr;';

          chip.appendChild(typeBadge);
          chip.appendChild(nameSpan);
          chip.appendChild(arrowIcon);

          chip.addEventListener('click', () => {
            el.workflowDetailDialog.close();
            if (lr.targetResourceType === 'prompt') {
              openPromptDetailDialog(lr.targetResourceId);
            } else {
              openToolDetailDialog(lr.targetResourceId);
            }
          });

          chipsWrap.appendChild(chip);
        });

        linkedSection.appendChild(chipsWrap);
        card.appendChild(linkedSection);
      }

      el.workflowDetailStepsList.appendChild(card);
    });
  }

  // --- Tool Form Dialog (Create / Edit) ---

  function openToolFormDialog(toolToEdit = null) {
    el.toolFormError.classList.add('hidden');
    el.toolFormError.textContent = '';
    el.toolFormWarning.classList.add('hidden');
    el.toolFormWarning.textContent = '';
    el.toolFormSubmitBtn.disabled = false;

    if (toolToEdit) {
      el.toolFormTitle.textContent = t('modal_edit_tool');
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
      el.toolFormSubmitBtn.querySelector('span').textContent = t('btn_save_changes');
    } else {
      el.toolFormTitle.textContent = t('modal_new_tool');
      el.toolForm.reset();
      el.inputToolId.value = '';
      el.inputToolKind.value = 'tool';
      el.inputToolPricing.value = 'Freemium';
      el.inputToolFavorite.checked = state.currentNav === 'favorites';
      if (state.tag) el.inputToolTags.value = state.tag;
      if (state.toolCategory) el.inputToolCategory.value = state.toolCategory;
      el.inputToolFaviconUrl.value = '';
      el.toolFormSubmitBtn.querySelector('span').textContent = t('btn_save_tool');
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
      showToast(t('toast_enter_url'), 'error');
      el.inputToolUrl.focus();
      return;
    }

    const btnText = el.toolFetchMetaBtn.querySelector('.btn-text');
    const spinner = el.toolFetchMetaBtn.querySelector('.spinner-sm');
    el.toolFetchMetaBtn.disabled = true;
    if (btnText) btnText.textContent = t('btn_fetching');
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
        showToast(t('toast_site_fetched'));
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      el.toolFetchMetaBtn.disabled = false;
      if (btnText) btnText.textContent = t('btn_fetch_info');
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
      el.toolFormError.textContent = t('err_title_required');
      el.toolFormError.classList.remove('hidden');
      el.inputToolTitle.focus();
      return;
    }

    if (!url) {
      el.toolFormError.textContent = t('err_url_required');
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
        showToast(t('toast_tool_updated'));
      } else {
        const res = await apiFetch('/api/tools', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        saved = res.data;
        if (res.warning) {
          showToast(res.warning, 'error');
        } else {
          showToast(t('toast_tool_created'));
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
      el.promptFormTitle.textContent = t('modal_edit_prompt');
      el.inputPromptId.value = promptToEdit.id;
      el.inputPromptTitle.value = promptToEdit.title;
      el.inputPromptModel.value = promptToEdit.model || '';
      el.inputPromptFavorite.checked = Boolean(promptToEdit.favorite);
      el.inputPromptDescription.value = promptToEdit.description || '';
      el.inputPromptContent.value = promptToEdit.content || '';
      el.inputPromptTags.value = Array.isArray(promptToEdit.tags) ? promptToEdit.tags.join(', ') : '';
      el.promptFormSubmitBtn.querySelector('span').textContent = t('btn_save_changes');
    } else {
      el.promptFormTitle.textContent = t('modal_new_prompt');
      el.promptForm.reset();
      el.inputPromptId.value = '';
      el.inputPromptFavorite.checked = state.currentNav === 'favorites';
      if (state.tag) el.inputPromptTags.value = state.tag;
      if (state.model) el.inputPromptModel.value = state.model;
      el.promptFormSubmitBtn.querySelector('span').textContent = t('btn_save_prompt');
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
      el.promptFormError.textContent = t('err_title_required');
      el.promptFormError.classList.remove('hidden');
      el.inputPromptTitle.focus();
      return;
    }

    if (!content || content.trim() === '') {
      el.promptFormError.textContent = t('err_prompt_content_required');
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
        showToast(t('toast_prompt_updated'));
      } else {
        const res = await apiFetch('/api/prompts', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        saved = res.data;
        showToast(t('toast_prompt_created'));
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

  // --- Workflow Form Dialog (Create / Edit) ---

  function openWorkflowFormDialog(workflowToEdit = null) {
    if (workflowToEdit) {
      el.workflowFormTitle.textContent = t('modal_edit_workflow');
      el.inputWorkflowId.value = workflowToEdit.id;
      el.inputWorkflowTitle.value = workflowToEdit.title || '';
      el.inputWorkflowPurpose.value = workflowToEdit.purpose || '';
      el.inputWorkflowStatus.value = workflowToEdit.status || 'Active';
      el.inputWorkflowDifficulty.value = workflowToEdit.difficulty || 'Medium';
      el.inputWorkflowEstimatedTime.value = workflowToEdit.estimatedTime || '';
      el.inputWorkflowFavorite.checked = Boolean(workflowToEdit.favorite);
      el.inputWorkflowDescription.value = workflowToEdit.description || '';
      el.inputWorkflowNotes.value = workflowToEdit.notes || '';
      el.inputWorkflowTags.value = Array.isArray(workflowToEdit.tags) ? workflowToEdit.tags.join(', ') : '';
      state.currentEditingWorkflowSteps = JSON.parse(JSON.stringify(workflowToEdit.steps || [])).map((s) => ({
        ...s,
        instructions: s.instructions || s.instruction || '',
      }));
      el.workflowFormSubmitBtn.querySelector('span').textContent = t('btn_save_changes');
    } else {
      el.workflowFormTitle.textContent = t('modal_new_workflow');
      el.workflowForm.reset();
      el.inputWorkflowId.value = '';
      el.inputWorkflowStatus.value = 'Active';
      el.inputWorkflowDifficulty.value = 'Medium';
      el.inputWorkflowFavorite.checked = state.currentNav === 'favorites';
      if (state.tag) el.inputWorkflowTags.value = state.tag;

      state.currentEditingWorkflowSteps = [
        {
          title: '',
          instructions: '',
          linkedResources: [],
        },
      ];
      el.workflowFormSubmitBtn.querySelector('span').textContent = t('btn_save_workflow');
    }

    renderWorkflowFormSteps();
    el.workflowFormDialog.showModal();
    setTimeout(() => el.inputWorkflowTitle.focus(), 50);
  }

  function closeWorkflowFormDialog() {
    el.workflowFormDialog.close();
  }

  function renderWorkflowFormSteps() {
    el.workflowFormStepsList.innerHTML = '';

    if (state.currentEditingWorkflowSteps.length === 0) {
      state.currentEditingWorkflowSteps.push({
        title: '',
        instructions: '',
        linkedResources: [],
      });
    }

    const total = state.currentEditingWorkflowSteps.length;

    state.currentEditingWorkflowSteps.forEach((step, idx) => {
      const stepRow = document.createElement('div');
      stepRow.className = 'form-step-builder-card';

      // Step Header
      const header = document.createElement('div');
      header.className = 'step-builder-header';

      const numLabel = document.createElement('span');
      numLabel.className = 'step-builder-num';
      numLabel.textContent = `${t('label_step_number', idx + 1)}`;

      const stepControls = document.createElement('div');
      stepControls.className = 'step-builder-controls';

      // Move Up
      const moveUpBtn = document.createElement('button');
      moveUpBtn.type = 'button';
      moveUpBtn.className = 'btn btn-icon btn-sm';
      moveUpBtn.title = t('btn_step_move_up');
      moveUpBtn.textContent = '↑';
      moveUpBtn.disabled = idx === 0;
      moveUpBtn.addEventListener('click', () => {
        const item = state.currentEditingWorkflowSteps.splice(idx, 1)[0];
        state.currentEditingWorkflowSteps.splice(idx - 1, 0, item);
        renderWorkflowFormSteps();
      });

      // Move Down
      const moveDownBtn = document.createElement('button');
      moveDownBtn.type = 'button';
      moveDownBtn.className = 'btn btn-icon btn-sm';
      moveDownBtn.title = t('btn_step_move_down');
      moveDownBtn.textContent = '↓';
      moveDownBtn.disabled = idx === total - 1;
      moveDownBtn.addEventListener('click', () => {
        const item = state.currentEditingWorkflowSteps.splice(idx, 1)[0];
        state.currentEditingWorkflowSteps.splice(idx + 1, 0, item);
        renderWorkflowFormSteps();
      });

      // Delete Step
      const delStepBtn = document.createElement('button');
      delStepBtn.type = 'button';
      delStepBtn.className = 'btn btn-icon btn-danger btn-sm';
      delStepBtn.title = t('btn_step_delete');
      delStepBtn.textContent = '✕';
      delStepBtn.disabled = total <= 1;
      delStepBtn.addEventListener('click', () => {
        state.currentEditingWorkflowSteps.splice(idx, 1);
        renderWorkflowFormSteps();
      });

      stepControls.appendChild(moveUpBtn);
      stepControls.appendChild(moveDownBtn);
      stepControls.appendChild(delStepBtn);

      header.appendChild(numLabel);
      header.appendChild(stepControls);
      stepRow.appendChild(header);

      // Step Title Input
      const titleGroup = document.createElement('div');
      titleGroup.className = 'form-group';
      const titleInput = document.createElement('input');
      titleInput.type = 'text';
      titleInput.className = 'form-step-title-input';
      titleInput.placeholder = t('step_title_placeholder');
      titleInput.value = step.title || '';
      titleInput.addEventListener('input', (e) => {
        step.title = e.target.value;
      });
      titleGroup.appendChild(titleInput);
      stepRow.appendChild(titleGroup);

      // Step Instructions Textarea
      const instGroup = document.createElement('div');
      instGroup.className = 'form-group';
      const instTextarea = document.createElement('textarea');
      instTextarea.className = 'form-step-instructions-textarea';
      instTextarea.rows = 3;
      instTextarea.placeholder = t('step_instructions_placeholder');
      instTextarea.value = step.instructions || '';
      instTextarea.addEventListener('input', (e) => {
        step.instructions = e.target.value;
      });
      instGroup.appendChild(instTextarea);
      stepRow.appendChild(instGroup);

      // Linked Resources Section
      const linkedBox = document.createElement('div');
      linkedBox.className = 'step-builder-linked-box';

      const linkedHeader = document.createElement('div');
      linkedHeader.className = 'step-builder-linked-header';

      const linkedTitle = document.createElement('span');
      linkedTitle.className = 'label-hint';
      linkedTitle.textContent = t('picker_linked_resources');

      const addResourceBtn = document.createElement('button');
      addResourceBtn.type = 'button';
      addResourceBtn.className = 'btn btn-secondary btn-sm';
      addResourceBtn.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
        <span>${t('picker_link_btn')}</span>
      `;
      addResourceBtn.addEventListener('click', () => {
        openResourcePicker(idx);
      });

      linkedHeader.appendChild(linkedTitle);
      linkedHeader.appendChild(addResourceBtn);
      linkedBox.appendChild(linkedHeader);

      const linkedChips = document.createElement('div');
      linkedChips.className = 'step-linked-chips';

      const linked = Array.isArray(step.linkedResources) ? step.linkedResources : [];
      if (linked.length > 0) {
        linked.forEach((lr, lrIdx) => {
          const chip = document.createElement('div');
          chip.className = 'linked-resource-chip';

          const kindBadge = document.createElement('span');
          kindBadge.className = `badge badge-kind kind-${lr.targetResourceType || 'tool'}`;
          kindBadge.textContent = lr.targetResourceType === 'prompt' ? t('badge_prompt') : (lr.targetResourceType === 'website' ? t('badge_website') : t('badge_tool'));

          const titleSpan = document.createElement('span');
          titleSpan.className = 'chip-title';
          titleSpan.textContent = lr.targetResourceTitle || lr.targetResourceId;

          const removeBtn = document.createElement('button');
          removeBtn.type = 'button';
          removeBtn.className = 'chip-remove-btn';
          removeBtn.innerHTML = '&times;';
          removeBtn.title = 'Unlink';
          removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            step.linkedResources.splice(lrIdx, 1);
            renderWorkflowFormSteps();
          });

          chip.appendChild(kindBadge);
          chip.appendChild(titleSpan);
          chip.appendChild(removeBtn);
          linkedChips.appendChild(chip);
        });
      }

      linkedBox.appendChild(linkedChips);
      stepRow.appendChild(linkedBox);

      el.workflowFormStepsList.appendChild(stepRow);
    });
  }

  async function handleWorkflowFormSubmit(e) {
    if (e) e.preventDefault();

    const title = el.inputWorkflowTitle.value.trim();
    const purpose = el.inputWorkflowPurpose.value.trim() || null;
    const status = el.inputWorkflowStatus.value;
    const difficulty = el.inputWorkflowDifficulty.value;
    const estimatedTime = el.inputWorkflowEstimatedTime.value.trim() || null;
    const favorite = el.inputWorkflowFavorite.checked;
    const description = el.inputWorkflowDescription.value.trim() || null;
    const notes = el.inputWorkflowNotes.value.trim() || null;
    const tags = el.inputWorkflowTags.value
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (!title) {
      showToast(t('err_title_required'), 'error');
      el.inputWorkflowTitle.focus();
      return;
    }

    // Clean steps
    const steps = state.currentEditingWorkflowSteps
      .map((s, idx) => {
        const inst = (s.instructions || s.instruction || s.title || '').trim();
        return {
          stepOrder: idx + 1,
          title: s.title.trim(),
          instruction: inst,
          instructions: inst,
          linkedResources: Array.isArray(s.linkedResources) ? s.linkedResources : [],
        };
      })
      .filter((s) => s.title.length > 0);

    if (steps.length === 0) {
      showToast(t('err_workflow_steps_required'), 'error');
      return;
    }

    const workflowId = el.inputWorkflowId.value;
    const isEdit = Boolean(workflowId);

    el.workflowFormSubmitBtn.disabled = true;

    try {
      const payload = {
        title,
        purpose,
        status,
        difficulty,
        estimatedTime,
        favorite,
        description,
        notes,
        tags,
        steps,
      };

      let saved;
      if (isEdit) {
        const res = await apiFetch(`/api/workflows/${workflowId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        saved = res.data;
        showToast(t('toast_workflow_updated'));
      } else {
        const res = await apiFetch('/api/workflows', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        saved = res.data;
        showToast(t('toast_workflow_created'));
      }

      closeWorkflowFormDialog();
      await loadData();
      await loadTags();

      if (isEdit && state.activeDetailWorkflow?.id === workflowId) {
        openWorkflowDetailDialog(saved);
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      el.workflowFormSubmitBtn.disabled = false;
    }
  }

  // --- Resource Picker Dialog ---

  async function openResourcePicker(stepIndex) {
    state.activeStepIndexForPicker = stepIndex;
    el.resourcePickerSearch.value = '';
    el.resourcePickerDialog.showModal();
    setTimeout(() => el.resourcePickerSearch.focus(), 50);
    await searchResourcesForPicker('');
  }

  function closeResourcePicker() {
    state.activeStepIndexForPicker = null;
    el.resourcePickerDialog.close();
  }

  async function searchResourcesForPicker(query) {
    el.resourcePickerResults.innerHTML = `<div class="picker-loading">${t('loading_resources')}</div>`;
    try {
      const params = new URLSearchParams();
      if (query) params.set('q', query);
      params.set('limit', '40');

      const res = await apiFetch(`/api/resources?${params.toString()}`);
      const items = (res.data || []).filter((item) => item.type !== 'workflow'); // cannot link workflow to itself

      el.resourcePickerResults.innerHTML = '';
      if (items.length === 0) {
        el.resourcePickerResults.innerHTML = `<div class="picker-empty">${t('picker_no_results')}</div>`;
        return;
      }

      const activeStep = state.currentEditingWorkflowSteps[state.activeStepIndexForPicker];
      const linkedIds = new Set((activeStep?.linkedResources || []).map((lr) => lr.targetResourceId));

      items.forEach((item) => {
        const row = document.createElement('div');
        row.className = 'picker-resource-row';

        const left = document.createElement('div');
        left.className = 'picker-row-left';

        const kindBadge = document.createElement('span');
        kindBadge.className = `badge badge-kind kind-${item.type || 'tool'}`;
        kindBadge.textContent = item.type === 'prompt' ? t('badge_prompt') : (item.type === 'website' ? t('badge_website') : t('badge_tool'));

        const titleSpan = document.createElement('span');
        titleSpan.className = 'picker-resource-title';
        titleSpan.textContent = item.title;

        left.appendChild(kindBadge);
        left.appendChild(titleSpan);

        const isAlreadyLinked = linkedIds.has(item.id);
        const actionBtn = document.createElement('button');
        actionBtn.type = 'button';
        actionBtn.className = `btn btn-sm ${isAlreadyLinked ? 'btn-secondary' : 'btn-primary'}`;
        actionBtn.textContent = isAlreadyLinked ? t('btn_linked') : t('btn_link');
        actionBtn.disabled = isAlreadyLinked;

        actionBtn.addEventListener('click', () => {
          if (!activeStep.linkedResources) activeStep.linkedResources = [];
          activeStep.linkedResources.push({
            targetResourceId: item.id,
            targetResourceType: item.type,
            targetResourceTitle: item.title,
          });
          closeResourcePicker();
          renderWorkflowFormSteps();
        });

        row.appendChild(left);
        row.appendChild(actionBtn);
        el.resourcePickerResults.appendChild(row);
      });
    } catch (err) {
      el.resourcePickerResults.innerHTML = `<div class="picker-error">${err.message}</div>`;
    }
  }

  // --- Duplicate Actions ---

  async function duplicateWorkflow(workflow) {
    try {
      const res = await apiFetch(`/api/workflows/${workflow.id}/duplicate`, { method: 'POST' });
      showToast(t('toast_duplicated', workflow.title));
      await loadData();
      await loadTags();
      if (res.data) {
        openWorkflowDetailDialog(res.data);
      }
    } catch (err) {
      showToast(err.message, 'error');
    }
  }

  async function duplicatePrompt(prompt) {
    try {
      const res = await apiFetch(`/api/prompts/${prompt.id}/duplicate`, { method: 'POST' });
      showToast(t('toast_duplicated', prompt.title));
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
      showToast(t('toast_duplicated', tool.title));
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
    el.deleteDialogTitle.textContent =
      type === 'prompt' ? t('delete_prompt_title') : (type === 'workflow' ? t('delete_workflow_title') : t('delete_resource_title'));
    el.deleteConfirmPromptMsg.textContent =
      state.lang === 'vi' ? 'Bạn có chắc chắn muốn xóa vĩnh viễn' : 'Are you sure you want to permanently delete';
    el.deleteDialog.showModal();
  }

  async function confirmDelete() {
    const item = state.itemToDelete;
    if (!item) return;

    el.deleteConfirmBtn.disabled = true;

    try {
      let endpoint = `/api/tools/${item.id}`;
      if (item.type === 'prompt') endpoint = `/api/prompts/${item.id}`;
      else if (item.type === 'workflow') endpoint = `/api/workflows/${item.id}`;

      await apiFetch(endpoint, { method: 'DELETE' });
      showToast(t('toast_deleted', item.title));
      el.deleteDialog.close();

      if (state.activeDetailPrompt?.id === item.id) {
        closePromptDetailDialog();
      }
      if (state.activeDetailTool?.id === item.id) {
        closeToolDetailDialog();
      }
      if (state.activeDetailWorkflow?.id === item.id) {
        closeWorkflowDetailDialog();
      }

      await loadData();
      await loadTags();
      if (item.type === 'prompt') await loadModels();
      else if (item.type !== 'workflow') await loadToolMetadataOptions();
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
    // Language Toggle Button
    if (el.langToggleBtn) {
      el.langToggleBtn.addEventListener('click', () => {
        toggleLanguage();
      });
    }

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

    if (el.menuAddWorkflowBtn) {
      el.menuAddWorkflowBtn.addEventListener('click', () => {
        el.addDropdownMenu.classList.add('hidden');
        el.addBtn.closest('.dropdown-wrapper')?.classList.remove('open');
        openWorkflowFormDialog();
      });
    }

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
    if (el.emptyAddWorkflowBtn) el.emptyAddWorkflowBtn.addEventListener('click', () => openWorkflowFormDialog());
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

    // Navigation buttons (All Resources, Workflows, Tools, Prompts, Favorites)
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
        if (view === 'workflows') {
          if (el.sidebarWorkflowsFilters) el.sidebarWorkflowsFilters.style.display = 'block';
          el.sidebarToolsFilters.style.display = 'none';
          el.sidebarPromptsFilters.style.display = 'none';
        } else if (view === 'tools') {
          if (el.sidebarWorkflowsFilters) el.sidebarWorkflowsFilters.style.display = 'none';
          el.sidebarToolsFilters.style.display = 'block';
          el.sidebarPromptsFilters.style.display = 'none';
        } else if (view === 'prompts') {
          if (el.sidebarWorkflowsFilters) el.sidebarWorkflowsFilters.style.display = 'none';
          el.sidebarToolsFilters.style.display = 'none';
          el.sidebarPromptsFilters.style.display = 'block';
        } else {
          if (el.sidebarWorkflowsFilters) el.sidebarWorkflowsFilters.style.display = 'block';
          el.sidebarToolsFilters.style.display = 'block';
          el.sidebarPromptsFilters.style.display = 'block';
        }

        loadData();
      });
    });

    // Workflow filters in sidebar
    if (el.workflowStatusFilterSelect) {
      el.workflowStatusFilterSelect.addEventListener('change', (e) => {
        state.workflowStatus = e.target.value || null;
        loadData();
      });
    }

    if (el.workflowDiffFilterSelect) {
      el.workflowDiffFilterSelect.addEventListener('change', (e) => {
        state.workflowDifficulty = e.target.value || null;
        loadData();
      });
    }

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

    // Workflow Form Dialog events
    if (el.workflowForm) el.workflowForm.addEventListener('submit', handleWorkflowFormSubmit);
    if (el.workflowFormCloseBtn) el.workflowFormCloseBtn.addEventListener('click', closeWorkflowFormDialog);
    if (el.workflowFormCancelBtn) el.workflowFormCancelBtn.addEventListener('click', closeWorkflowFormDialog);
    if (el.workflowAddStepBtn) {
      el.workflowAddStepBtn.addEventListener('click', () => {
        state.currentEditingWorkflowSteps.push({
          title: '',
          instructions: '',
          linkedResources: [],
        });
        renderWorkflowFormSteps();
      });
    }

    // Resource Picker Dialog events
    if (el.resourcePickerCloseBtn) el.resourcePickerCloseBtn.addEventListener('click', closeResourcePicker);
    if (el.resourcePickerCancelBtn) el.resourcePickerCancelBtn.addEventListener('click', closeResourcePicker);
    if (el.resourcePickerSearch) {
      const handlePickerSearchDebounced = debounce((val) => {
        searchResourcesForPicker(val.trim());
      }, 200);
      el.resourcePickerSearch.addEventListener('input', (e) => {
        handlePickerSearchDebounced(e.target.value);
      });
    }

    // Tool Form Dialog events
    el.toolForm.addEventListener('submit', handleToolFormSubmit);
    el.toolFormCloseBtn.addEventListener('click', closeToolFormDialog);
    el.toolFormCancelBtn.addEventListener('click', closeToolFormDialog);
    el.toolFetchMetaBtn.addEventListener('click', handleFetchMetadata);

    // Prompt Form Dialog events
    el.promptForm.addEventListener('submit', handlePromptFormSubmit);
    el.promptFormCloseBtn.addEventListener('click', closePromptFormDialog);
    el.promptFormCancelBtn.addEventListener('click', closePromptFormDialog);

    // Workflow Detail Dialog events
    if (el.workflowDetailCloseBtn) el.workflowDetailCloseBtn.addEventListener('click', closeWorkflowDetailDialog);
    if (el.workflowDetailFavBtn) {
      el.workflowDetailFavBtn.addEventListener('click', () => {
        if (state.activeDetailWorkflow) {
          toggleWorkflowFavorite(state.activeDetailWorkflow, el.workflowDetailFavBtn);
        }
      });
    }
    if (el.workflowDetailCopyMdBtn) {
      el.workflowDetailCopyMdBtn.addEventListener('click', async () => {
        if (state.activeDetailWorkflow) {
          const md = await getWorkflowMarkdown(state.activeDetailWorkflow);
          copyToClipboard(md, el.workflowDetailCopyMdBtn);
        }
      });
    }
    if (el.workflowDetailEditBtn) {
      el.workflowDetailEditBtn.addEventListener('click', () => {
        if (state.activeDetailWorkflow) {
          const wf = state.activeDetailWorkflow;
          closeWorkflowDetailDialog();
          openWorkflowFormDialog(wf);
        }
      });
    }
    if (el.workflowDetailDuplicateBtn) {
      el.workflowDetailDuplicateBtn.addEventListener('click', () => {
        if (state.activeDetailWorkflow) {
          duplicateWorkflow(state.activeDetailWorkflow);
        }
      });
    }
    if (el.workflowDetailDeleteBtn) {
      el.workflowDetailDeleteBtn.addEventListener('click', () => {
        if (state.activeDetailWorkflow) {
          openDeleteDialog(state.activeDetailWorkflow, 'workflow');
        }
      });
    }

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
        const content = state.activeDetailPrompt.content || state.activeDetailPrompt.extra?.content || '';
        copyToClipboard(content, el.promptDetailCopyBtn);
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
    [
      el.workflowFormDialog,
      el.workflowDetailDialog,
      el.resourcePickerDialog,
      el.toolFormDialog,
      el.toolDetailDialog,
      el.promptFormDialog,
      el.promptDetailDialog,
      el.deleteDialog,
    ].filter(Boolean).forEach((dialog) => {
      dialog.addEventListener('click', (e) => {
        const rect = dialog.getBoundingClientRect();
        const isInDialog =
          rect.top <= e.clientY &&
          e.clientY <= rect.top + rect.height &&
          rect.left <= e.clientX &&
          e.clientX <= rect.left + rect.width;
        if (!isInDialog) {
          dialog.close();
          if (dialog === el.workflowDetailDialog) closeWorkflowDetailDialog();
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
        if (el.deleteDialog?.open) {
          el.deleteDialog.close();
          return;
        }
        if (el.resourcePickerDialog?.open) {
          closeResourcePicker();
          return;
        }
        if (el.workflowFormDialog?.open) {
          closeWorkflowFormDialog();
          return;
        }
        if (el.workflowDetailDialog?.open) {
          closeWorkflowDetailDialog();
          return;
        }
        if (el.toolFormDialog?.open) {
          closeToolFormDialog();
          return;
        }
        if (el.promptFormDialog?.open) {
          closePromptFormDialog();
          return;
        }
        if (el.toolDetailDialog?.open) {
          closeToolDetailDialog();
          return;
        }
        if (el.promptDetailDialog?.open) {
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
        if (el.workflowFormDialog?.open) {
          e.preventDefault();
          handleWorkflowFormSubmit();
          return;
        }
        if (el.toolFormDialog?.open) {
          e.preventDefault();
          handleToolFormSubmit();
          return;
        }
        if (el.promptFormDialog?.open) {
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

    const workflowId = urlParams.get('workflow');
    const workflowMatch = window.location.pathname.match(/^\/workflow\/([^/]+)$/);
    const targetWorkflowId = workflowId || (workflowMatch ? workflowMatch[1] : null);

    if (targetWorkflowId) {
      await openWorkflowDetailDialog(targetWorkflowId);
      return;
    }

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
    setLanguage(state.lang); // Defaults to English unless Vietnamese was saved
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

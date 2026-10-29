# 17 — Frontend Architecture & State Management

## Frontend Architecture Overview

- **Location:** `public/` directory (`index.html`, `app.js`, `styles.css`).
- **Framework:** None (Pure Vanilla Web APIs).
- **Asset Size:**
  - `app.js`: 73.9 KB
  - `styles.css`: 52.0 KB
  - `index.html`: 45.0 KB
  - Total uncompressed frontend payload: ~170.9 KB (Gzipped at edge to ~45 KB).
- **Delivery:** Cloudflare Workers Static Assets binding (`ASSETS`) with edge HTTP caching.

---

## State Management Evaluation

```javascript
// Global State Store in public/app.js
const state = {
  currentTab: 'tools',
  tools: [],
  prompts: [],
  workflows: [],
  agents: [],
  searchQuery: '',
  selectedCategory: 'all',
  activeToolDetail: null,
  activeWorkflowDetail: null,
  activeAgentDetail: null,
  isCurator: false,
  visitorFavorites: new Set(),
  theme: 'light',
  ...
};
```

### Strengths
- **Instant Boot:** No virtual DOM reconciliation, hydration overhead, or framework initialization delays. First Contentful Paint (FCP) is under 150ms on warm edge connections.
- **Client Persistence:** Theme preferences, visitor bookmarks, and curator tokens persist seamlessly in browser `localStorage`.
- **Deep Linking:** URL path routing (`/`, `/tools/:idOrSlug`, `/prompt/:id`, `/workflow/:id`, `/agent/:id`, `/admin`) is supported via HTML5 History API (`pushState`/`popstate`).

### Risks & Vulnerabilities
- **Global Mutable State Object:** All state is mutated directly across event handlers without immutable actions or state change subscribers.
- **DOM Re-rendering:** Functions like `renderDirectory()` rebuild large HTML strings and assign via `innerHTML`. While `escapeHtml` is used extensively, frequent full DOM tree replacements can trigger unnecessary layout recalculations and garbage collection pauses on low-end mobile devices.

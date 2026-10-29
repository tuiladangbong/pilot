# 07 — Business Correctness & Functional Audit

## Business Rules Evaluation

### 1. Catalog Search & Indexing Accuracy
- **Rule:** The platform must provide full-text search across all AI resources, matching title, description, and module-specific fields.
- **Implementation:** SQLite FTS5 virtual tables (`prompts_fts`, `tools_fts`, `workflows_fts`, `agents_fts`) with tokenized prefix matching (`"term"*`).
- **Audit Verification:**
  - `D1ResourceRepository.ts` line 44: `sanitizeFtsQuery(q)` strips malicious characters (`"` and `*`) and safely formats query tokens.
  - Fallback mechanism: If FTS query fails or produces zero tokens, query safely degrades to parameterized `LIKE %term%` queries across all sub-tables.
  - **Status: PASS.**

### 2. Duplication & Slug Generation
- **Rule:** Duplicating a resource must create an independent entity with a new UUID and distinct title/slug.
- **Implementation:** `DuplicatePromptUseCase`, `DuplicateToolUseCase`, etc.
  - Append `" (Copy)"` to title.
  - Generates a new `crypto.randomUUID()`.
  - Appends `"-copy-" + Date.now()` to the slug.
  - **Status: PASS.**

### 3. Robots & Crawler Directives Conflict
- **Defect:** In `src/index.ts`, `withNoRobotHeaders()` forces `X-Robots-Tag: noindex, nofollow, noarchive` on every response to block web scrapers during internal development.
- **Conflict:** Lines 60-96 simultaneously execute dynamic HTML rewriting for crawler social previews and OpenGraph SEO meta tags.
- **Impact:** Search engine bots and crawlers obeying `noindex` will discard the dynamically injected SEO meta tags.
- **Verdict:** Documented as an intended development mode flag, but must be made configurable via environment variable (`ENABLE_SEARCH_INDEXING=true/false`) before public SEO rollout.

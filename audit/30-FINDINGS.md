# 30 — Findings (independent audit, 2026-11-04)

Scale: P0 critical · P1 high · P2 medium · P3 low · P4 improvement.
Evidence is cited as `path:line` or command output. "NOT VERIFIED" = could not be established from the repo alone.
All findings are OPEN. No code was changed during this audit.

---
## P1 — HIGH

### AUD-SEC-001 · Unreviewed autonomous publishing of third-party content to production (scheduled, every 6h)
- Category: SECURITY / PROCESS · Confidence: High
- Evidence: `.github/workflows/auto-curate.yml` — `cron: '0 */6 * * *'`; `DRY_RUN="${{ github.event.inputs.dry_run }}"` is empty on scheduled runs, so the `else` branch runs `node scripts/auto-curate/index.mjs --publish`. `scripts/auto-curate/index.mjs:159-186` publishes tool + generated workflow + prompt via the curator API; the Telegram notification is `notifier.notifyPublished(...)` (index.mjs:189) i.e. *after* publication.
- Root cause: "human review" exists as a notification, not a gate. Admission is a heuristic score (stars/points/keywords, `qualityScorer.mjs`) over HackerNews/GitHub/HuggingFace data, which is attacker-influenceable (star farming, keyword-stuffed descriptions).
- Impact: an adversary can cause arbitrary URLs/text to appear on the production catalog under `origin=curated/discovered` with no human decision; reputational harm, phishing/malware link hosting, SEO abuse. The job holds the all-powerful write token.
- Failure scenario: attacker publishes a GitHub repo whose description meets the keyword/star heuristics and whose README/website later turns malicious → listed within 6h.
- Recommendation: make scheduled runs dry-run/"proposal" only (write candidates to a pending state or PR); require explicit human approval to publish; add a `status=pending` concept (does not exist today).
- Likelihood M · Impact M · Detectability L (post-hoc Telegram only) · Blast radius: whole public catalog · Recovery: easy (delete rows) but trust damage.
- Scope: Medium · Standards: OWASP API6 (sensitive business flow abuse), SLSA/OpenSSF (untrusted input to release path)

### AUD-SEC-002 · Single static shared bearer token = only authentication/authorization mechanism; optional header-trust mode has no signature verification
- Category: SECURITY · Confidence: High (token model) / Medium (header mode exposure)
- Evidence: `src/adapters/http/curatorAuth.ts` — any holder of `CURATOR_TOKEN` (or legacy `ADMIN_TOKEN` fallback, `bootstrap.ts`) is `curator@pilot`; identity is a constant string. `trustAccessHeader` accepts `cf-access-authenticated-user-email` with no JWT (`cf-access-jwt-assertion`) verification. `wrangler.jsonc` sets only a `custom_domain` route and does not set `workers_dev: false` (Wrangler default exposes `*.workers.dev`).
- Impact: (a) no per-actor attribution, rotation = break all automation, leaked CI/browser token = full write/delete on catalog; (b) if `TRUST_CF_ACCESS=true` is ever set in production and the worker is reachable outside Access (workers.dev, or any path not behind the Access app), the header is forgeable → full takeover. Whether the flag is set in production: NOT VERIFIED.
- No brute-force/rate limiting on the token check (WAF rules NOT VERIFIED). Comparison is constant-time on equal length only (acceptable).
- Recommendation: verify Access JWT (aud + signature via JWKS) instead of trusting the header; set `workers_dev: false`; per-principal tokens/identities; write an audit-log row for each mutation.
- Scope: Medium · Standards: OWASP ASVS V2/V4, API2/API5

### AUD-OPS-001 · Deployment and production verification are tribal knowledge; no automated deploy, no staging, no tested rollback
- Category: OPERATIONS · Confidence: High
- Evidence: `package.json` `deploy: wrangler deploy` run by hand; `.gitignore` ignores `deploy.bat` (commit 0fabcb5 "chore: ignore deploy.bat script") — i.e. the real deploy procedure exists only on one machine. CI (`.github/workflows/ci.yml`) has typecheck+tests only; no deploy job, no smoke test, no migration check. Single D1 database id in `wrangler.jsonc`; no staging environment. `docs/runbooks/disaster-recovery.md` documents `d1 export` / `time-travel restore`, but no evidence either was ever exercised.
- Impact: a new team cannot deploy safely; migration + code ordering is manual (`db:migrate:remote` is separate from `deploy`); no code-rollback procedure (Workers versions rollback not documented).
- Recommendation: document the deploy in-repo; add a CI deploy job gated on checks with post-deploy `/api/health` + `/api/db-health` smoke; define migration-then-deploy ordering and expand/contract rule; rehearse a restore into a scratch D1 and record the result.
- Scope: Medium

---
## P2 — MEDIUM

### AUD-SEC-003 · No browser security headers / CSP; curator key stored in `localStorage`; CORS `*`
- Evidence: `src/index.ts` adds only `X-Robots-Tag`/`X-Request-Id`; `public/app.js:1923` `localStorage.setItem('pilot_curator_key', key)`; `router.ts` `Access-Control-Allow-Origin: '*'`; 17 `innerHTML` assignments in `public/app.js`.
- Impact: any XSS (e.g. via one of the unescaped interpolations, see AUD-SEC-004) steals the permanent curator token. No clickjacking protection (`X-Frame-Options`/`frame-ancestors`), no `nosniff`, no `Referrer-Policy`. CORS `*` is tolerable only because auth is header-token based (no cookies) — keep it that way.
- Recommendation: CSP (no inline handlers — `onerror=`/`onclick=` currently used in templates block a strict CSP), `nosniff`, `frame-ancestors 'none'`; keep token in memory/sessionStorage or move to Access.
- Scope: Medium

### AUD-SEC-004 · Frontend HTML templating relies on per-call-site escaping; some interpolations are unescaped
- Evidence: `public/app.js:1112` `data-id="${p.id}"` (and sibling cards) unescaped; ids are caller-supplied (`CreateToolUseCase` accepts `body.id`), so a curator/pipeline-created id containing `"` breaks out of the attribute. `escapeHtml` exists (`app.js:2032`) and is used for most text, so this is a convention-dependent control, not a systemic hole.
- Impact: stored XSS for any actor able to write ids (compromised token / AUD-SEC-001 pipeline). Server does not constrain id format.
- Recommendation: validate ids server-side (UUID or slug regex); build DOM with `textContent`/`dataset`; add a lint rule banning `innerHTML` with `${}` of non-escaped values.
- Scope: Small–Medium

### AUD-SYS-001 · No error taxonomy; control flow by `err.message.includes('not found')`; raw internal messages returned to clients
- Category: SYSTEMIC · Confidence: High
- Manifestations: `router.ts` ~40 catch blocks of the form `err.message?.includes('not found') → 404 else jsonError(<X>_ERROR, err.message, 400|500)`; domain/use-cases `throw new Error(...)`. Examples: `DELETE_ERROR`/`DUPLICATION_ERROR` return `err.message` with status 500.
- Impact: (1) wording change silently turns a 404 into a 500; (2) DB/driver errors (constraint names, SQL fragments) can leak through `err.message`; (3) validation vs conflict vs infrastructure failures are indistinguishable → wrong status codes (e.g. unique slug violation → generic 400/500).
- Root cause: error semantics are not a project concern.
- Recommendation: small `DomainError` hierarchy (Validation/NotFound/Conflict) mapped once in the router; unknown errors → generic 500 + log.
- Scope: Medium

### AUD-ARCH-001 · `router.ts` is a 1,267-line hand-rolled regex dispatcher with copy-pasted CRUD for 4 modules; input validation is `any`-typed and ad hoc
- Evidence: `wc -l`: router.ts 1267; four near-identical blocks for prompts/tools/workflows/agents (duplicate/favorite/get/put/delete/collection); `let body: any`; `parseInt(...)` for paging with no NaN handling.
- Impact: every cross-cutting change (auth, caching, validation, logging) must be made N times; already inconsistent: `/api/resources` sends `PUBLIC_CACHE_HEADERS`, `/api/tools|prompts|…` do not; OPTIONS `Allow-Methods` omits `PATCH` though PATCH routes exist (breaks cross-origin preflight).
- Recommendation: route table + per-route handler + shared parse/validate helpers (only once two modules genuinely share — they do). Do **not** introduce a framework without need.
- Scope: Medium–Large

### AUD-TEST-001 · Tests cover pure domain code and regex architecture guards only; persistence, SQL, FTS, migrations and the router are untested
- Evidence: `npm test` → 37 pass/0 fail. Files: agents 7, catalog 2, curator-auth 8, domain 5, portability 3, tools 7, workflows 5. `grep -l router tests/*.mjs` hits only `portability.test.mjs` (a source-text check). No test touches any `D1*Repository`, a migration, or an HTTP request through `handleRequest`.
- Impact: the riskiest code (≈2,300 lines of SQL in adapters, 8 migrations, 1,267-line router) has zero executable verification; FTS triggers, slug uniqueness, cascade deletes, and auth gating at the route level are unproven.
- Recommendation: run migrations 0001–0008 against SQLite (`node:sqlite` or better-sqlite3 as devDependency, consistent with the portability goal) and test repositories + `handleRequest` with in-memory fakes; add golden tests for `GET /api/*` shapes.
- Also: `portability.test.mjs` checks imports by regex line scan — good start, but bypassable (dynamic import, multi-line import, type-only re-export).
- Scope: Medium

### AUD-DATA-001 · Multiple divergent sources of truth for the catalog; seed data embedded in migrations
- Evidence: `data/ai-tools-catalog.json` (4,510 lines), `src/data/catalogData.ts` (814), `public/data/catalogData.js` (906), `migrations/0007_*.sql` (632) and `0008_*.sql` (779) generated by `scripts/generate_seed_0008.js`; plus live D1 mutated by the curation pipeline. `migrations/0006_public_catalog.sql:17-22` backfills slugs by hard-coded row ids.
- Impact: nobody can say which is authoritative; production drifts from repo; editing a seed after the migration ran has no effect; a fresh environment ≠ production; frontend may display static data different from the API. `validate-catalog.mjs`/`import-catalog.mjs` exist but are not in CI.
- Recommendation: declare D1 as source of truth for runtime data; keep one seed artifact + idempotent importer outside `migrations/`; migrations contain DDL only.
- Scope: Medium

### AUD-OBS-001 · Observability is `console.error` on unhandled exceptions only
- Evidence: 1 `console.` use in `src/` (router.ts unhandled-error path). No structured logs, no mutation audit trail, no latency metrics, no `observability` block in `wrangler.jsonc`, `/api/db-health` is a connectivity probe. Request id exists (cf-ray / UUID) and is returned in `X-Request-Id` — good — but is not logged with the error for handled (4xx/5xx) paths.
- Impact: cannot answer "who changed/deleted this tool and when"; cannot compute availability/latency SLOs; incident response doc (`docs/runbooks/incident-response.md`) has nothing to query.
- Recommendation: enable Workers observability; one structured log line per request (id, route, status, ms) and per mutation (actor, resource id, action).
- Scope: Small–Medium

### AUD-CICD-001 · CI/workflow hardening gaps
- Evidence: `ci.yml`/`auto-curate.yml` lack a `permissions:` block (default token scope); actions pinned by tag (`@v4`) not SHA; `auto-curate.yml` interpolates `${{ github.event.inputs.* }}` directly into a shell script (script injection by anyone able to dispatch; low because write access required); `concurrency.cancel-in-progress: true` can cancel a run mid-publish leaving a tool published without its workflow/prompt (non-transactional multi-call publish); no `npm audit`, no secret scanning, no dependency-update automation; branch protection NOT VERIFIED.
- Scope: Small

### AUD-DOC-001 · Previous in-repo audit (`docs/audit/`) is stale and now contradicts the code
- Evidence: `docs/audit/30-FINDINGS.md` lists AUD-SEC-001 (hardcoded fallback token / spoofable header, "P0"), AUD-PERF-001 (Cartesian join) and AUD-OPS-001 (migration scripts) as open. Current code: no hardcoded token (`curatorAuth.ts`), counts use scalar subqueries (`D1ResourceRepository.ts`), and `package.json` uses `wrangler d1 migrations apply`. Fixes landed in commit 92b8464 *after* the audit commit 7e38a08, and the docs were not updated. `/api/architecture` returns hard-coded constants. README/architecture docs not re-verified line-by-line (NOT VERIFIED).
- Impact: incorrect docs are more dangerous than none; a reader would believe a P0 is live, or that fixed items still need work. Finding IDs collide with this audit's IDs.
- Recommendation: mark `docs/audit/` as historical snapshot with date; keep one living findings register; this audit uses an `audit/` directory to avoid overwriting history.

### AUD-AIOPS-001 · Curation pipeline: dead secret, misleading Telegram "approve" handler, no sender allow-list
- Evidence: `scripts/auto-curate/telegram-webhook.mjs:54-55` answers "Approved and published to Pilot!" on `approve_*` but never calls the curator client (grep: no `client.` call, no publish); it also does not check that the clicking user/chat equals `TELEGRAM_CHAT_ID`. The listener is not run by any workflow (long-polling script). `AI_API_KEY` is passed to the workflow and `evaluateCandidate(candidate, apiKey)` accepts it, but scoring is heuristic-only (no LLM call found). Candidate `kind` expression `x ? 'tool' : 'tool'` (qualityScorer.mjs).
- Impact: operators are told a candidate was approved/published when nothing happened (false success); unused secret increases leak surface; if later wired up, anyone in the chat could approve.
- Scope: Small

---
## P3 — LOW

- **AUD-BUG-001 Paging NaN**: `parseInt('abc')` → NaN; repo clamp `Math.min(Math.max(NaN,1),500)` = NaN (verified with node) → NaN bound to `LIMIT ?` → likely D1 error → 500 for a trivial malformed query (`router.ts` limit/offset sites; `D1ResourceRepository.ts` list). Also unbounded `offset` (deep OFFSET scans) and `limit` up to 500 with joined content columns (prompt content) per row.
- **AUD-SEC-005 SSRF filter is string-based**: `isPrivateOrBlockedHost` (`Tool.ts:180`) checks hostnames/dotted IPv4/some IPv6 prefixes; no DNS-resolution check (public name → private IP), IPv4-mapped IPv6 (`::ffff:…`) coverage NOT VERIFIED. Mitigations: endpoint is curator-gated; redirects are re-validated per hop (verified `FetchToolMetadataUseCase.ts`); Workers egress cannot reach RFC1918 networks. Residual: low. Redirect loop exhaustion returns graceful defaults.
- **AUD-SEC-006 Unbounded request bodies / no rate limiting** on public GETs (full-text + `LIKE '%q%'` fallback over prompt content/agent instructions when the FTS query sanitises to empty, e.g. `q=*`). Cloudflare WAF/rate-limit rules NOT VERIFIED.
- **AUD-DATA-002 Dual `favorite` semantics**: `resources.favorite` (global, curator-set, 0003) vs per-visitor favorites in `localStorage` (`pilot_visitor_favorites`) vs legacy `prompts.favorite` (0001, backfilled in 0003; whether still written NOT VERIFIED). Same word, three meanings.
- **AUD-DOM-001 Primitive obsession in the shared core**: `Resource.type: string`, `createResource` casts `origin as ResourceOrigin` without runtime validation (`Resource.ts`); timestamps are ISO `string`s created via `new Date()` inside domain functions (non-injectable clock → non-deterministic tests). Acceptable for a small hub, but invariants (type ∈ registered modules, origin ∈ enum) are enforced nowhere at the DB (no CHECK constraints in migrations).
- **AUD-FE-001 Frontend monolith & races**: `public/app.js` 2,047 lines, global `state`, no `AbortController` (grep: 0) — fast successive detail/search requests (`/api/agents/:id`, `/api/resources/:slug`) can render out of order (stale A overwrites C). Not reproduced at runtime (NOT VERIFIED).
- **AUD-A11Y-001 Accessibility risks (static inspection only)**: continuous "retro-blink" animations (`styles.css:263+`) with a single `prefers-reduced-motion` block (count = 1) — WCAG 2.2.2/2.3.1 risk if blink >5s without pause; only 13 aria/role/label occurrences across HTML+CSS for a 933-line page with modals; inline `onclick`/`onerror` handlers. No contrast/keyboard testing was run.
- **AUD-SUP-001 Dependencies**: `npm audit` → 3 vulns (1 high, 2 moderate) all via `undici ← miniflare ← wrangler` (devDependencies; not in the deployed bundle). Caret ranges + lockfile present. `allowScripts` pins esbuild/workerd.
- **AUD-MIG-001 Migration practices**: forward-only, no down/rollback notes; `ALTER TABLE ADD COLUMN` + data backfills by literal ids (0006); FTS update triggers on `AFTER UPDATE ON resources` (all columns, 0002) fire on every toggle; no check that applying 0001→0008 on an empty DB yields the schema the code expects (no test). Large-table safety is moot at current size (~hundreds of rows) — NOT VERIFIED at production scale.
- **AUD-DX-001 Typecheck scope**: `tsconfig` includes only `src/**`; `scripts/*.mjs`, `public/*.js`, tests are untyped/unlinted; no ESLint/Prettier; no import-boundary lint beyond regex test.

## P4 — IMPROVEMENT
- Add ADRs (none exist; `docs/architecture.md` states decisions but not alternatives/trade-offs).
- Add SLOs (availability of `/api/health`, p95 of `/api/resources`).
- `/api/architecture` endpoint leaks nothing sensitive but is hard-coded and will drift; remove or generate.
- Screenshots (`screenshots/*.png`, 14 files) committed to repo → repo bloat.

# 30 — Complete Findings Catalog

## Severity Scale
- **P0 Critical:** Severe security bypass or active data loss vector. Immediate remediation required.
- **P1 High:** Major scalability flaw, SSRF bypass, or broken deployment tooling. Remediation in current sprint.
- **P2 Moderate:** Observability gap, missing CORS, or unhandled edge cases. Remediation in next release cycle.
- **P3 Low:** Stylistic smell, documentation inconsistency, or minor cosmetic issue. Backlog item.

---

## Findings Registry

### `AUD-SEC-001` (P0 - Critical): Curator Authentication Bypass & Hardcoded Secret
- **Component:** `src/adapters/http/curatorAuth.ts` lines 24-27, 39-42.
- **Impact:** Unauthenticated remote actors can seize write privileges and mutate/delete all database records by injecting the `cf-access-authenticated-user-email` header or supplying `'pilot_curator_secret_2026'`.
- **Root Cause:** Trusting incoming client headers without verifying cryptographic JWT signatures (`cf-access-jwt-assertion`), combined with an insecure fallback default token.
- **Remediation:** Remove fallback string; validate Cloudflare Access JWT or enforce non-empty `deps.curatorToken`; use `crypto.timingSafeEqual`.

### `AUD-SEC-002` (P1 - High): SSRF via Unchecked HTTP Redirects in Metadata Scraper
- **Component:** `src/modules/tools/application/FetchToolMetadataUseCase.ts` lines 39-47.
- **Impact:** Attackers can trick the worker into scraping internal cloud metadata services (`http://169.254.169.254`) or internal worker ports via 302 redirects.
- **Root Cause:** `isPrivateOrBlockedHost` is only executed on the initial URL; `redirect: 'follow'` allows the runtime to follow arbitrary redirects without re-checking the destination host.
- **Remediation:** Set `redirect: 'manual'`, inspect `Location` header, and recursively validate with `isPrivateOrBlockedHost`.

### `AUD-PERF-001` (P1 - High): Multi-Table Cartesian Join Explosion in Catalog Query
- **Component:** `src/adapters/persistence/d1/D1ResourceRepository.ts` lines 206-229.
- **Impact:** High CPU/memory consumption and potential D1 statement timeouts at 10x-50x scale due to quadratic intermediate row generation across `workflow_steps` (1:N) and `resource_tags` (1:M).
- **Root Cause:** Flattened SQL join across two independent one-to-many child tables in a single query level.
- **Remediation:** Refactor to scalar subqueries for tags and step counts.

### `AUD-OPS-001` (P1 - High): Database Migration Tooling Drift & Script Omissions
- **Component:** `package.json` lines 11-12.
- **Impact:** Running `db:migrate:remote` executes only `0005_agents.sql`, leaving remote database unbootstrapped; migrations `0006`, `0007`, `0008` are omitted from `package.json`. Native Wrangler migration tracking (`d1_migrations`) is bypassed.
- **Root Cause:** Ad-hoc manual SQL execution commands rather than native `wrangler d1 migrations apply`.
- **Remediation:** Update `package.json` scripts to use `wrangler d1 migrations apply pilot-db [--local|--remote]`.

### `AUD-OBS-001` (P2 - Moderate): Absence of Structured Logging & Request Correlation
- **Component:** `src/index.ts`, `src/adapters/http/router.ts`.
- **Impact:** Production incidents cannot be traced end-to-end; no correlation between user errors and Cloudflare logs.
- **Remediation:** Pass `cf-ray` as `requestId` in response headers and emit structured JSON logs.

### `AUD-SEC-003` (P2 - Moderate): Missing CORS Configuration for Public API
- **Component:** `src/adapters/http/router.ts`.
- **Impact:** Third-party web clients cannot consume public catalog endpoints due to browser CORS blocking and unhandled `OPTIONS` preflights.
- **Remediation:** Add CORS middleware returning `Access-Control-Allow-Origin: *` on public GET endpoints.

### `AUD-REL-001` (P2 - Moderate): Lack of Global Request Error Boundary
- **Component:** `src/adapters/http/router.ts`.
- **Impact:** Unhandled exceptions outside inner route try-catch blocks return raw 500 HTML instead of structured JSON.
- **Remediation:** Wrap `handleRequest` in an outer try-catch block returning a standard `jsonError('INTERNAL_ERROR', 500)`.

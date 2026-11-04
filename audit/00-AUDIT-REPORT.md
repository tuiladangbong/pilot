# Pilot — Independent System Audit (2026-11-04)

Scope: repository `tuiladangbong/pilot` @ `bb6f0ed`. Method: static review of all `src/`, migrations, CI, scripts, frontend; executed `npm run typecheck` (clean) and `npm test` (37/37 pass); `npm audit`. **Not performed** (and therefore NOT VERIFIED): production inspection, runtime load/latency, D1 query plans, restore drills, git-history secret scan, WAF/branch-protection settings, browser/a11y testing. No code was modified.
Supporting files: `30-FINDINGS.md`, `29-CONTROL-MATRIX.md`, `32-ENGINEERING-CONSTITUTION.md`.

## 1. Executive summary
Pilot is a small, disciplined, genuinely portable modular monolith: one Cloudflare Worker, one D1 database, zero runtime dependencies, SQL fully parameterised, writes fail-closed behind a token, and the architecture rules in `AGENTS.md` are largely true in code. Its weaknesses are not in the core design but around it: **an unattended pipeline that publishes third-party content to production without a human gate**, **a single shared secret as the entire security model**, **no executable verification of persistence/router/migrations**, **no real deploy/rollback/observability story**, and **documentation (including a previous audit) that has drifted from the code**.

**Verdict: CONDITIONALLY READY** (no P0 found; 3 P1 open). As a low-stakes public directory it is safe to keep running; it is not ready for a team handover or for write access beyond one trusted operator until AUD-SEC-001, AUD-SEC-002 and AUD-OPS-001 are addressed.

Control matrix: 75 controls — 20 PASS, 22 PARTIAL, 24 FAIL, 7 NOT VERIFIED, 2 N/A. (Counts only; no percentage is claimed because controls are unweighted.)

## 2. Classification
Public web app + JSON API (read-mostly directory/catalog), single-tenant, no end-user accounts, one privileged curator role, plus an automation/curation CLI pipeline (GitHub Actions) and an AI-resource-hub domain. Not applicable: mobile, game, multi-tenant, payments, PII/privacy regimes (no PII stored; visitor favorites live in `localStorage`), message brokers.

## 3. System inventory
| Component | Type | Notes |
|---|---|---|
| Worker `src/index.ts` | Edge runtime entry | static assets, SEO injection for `/tools/*`, delegates `/api/*` |
| `adapters/http/router.ts` | HTTP adapter | 1,267 lines, all routes |
| `adapters/http/curatorAuth.ts` | Auth | bearer / `X-Curator-Key` / optional CF-Access header |
| `core/`, `modules/{prompts,tools,workflows,agents}` | Domain + use-cases + ports | pure TS, tested |
| `adapters/persistence/d1/*` | SQL adapters | ~2,900 lines, FTS5 |
| `platform/cloudflare/*` | Composition root + Env | only place with CF types (plus D1 adapters) |
| D1 `pilot-db` | SQLite | 8 migrations, FTS5 triggers |
| `public/` | Vanilla JS/CSS SPA | app.js 2,047 L, styles.css 2,637 L |
| `scripts/auto-curate/*` + `auto-curate.yml` | Automation | HN/GitHub/HF → score → publish → Telegram |
| GitHub Actions `ci.yml` | CI | typecheck + tests |
External: HackerNews, GitHub, HuggingFace APIs, Telegram, DuckDuckGo/Google favicon services (client-side hotlinking), Cloudflare.

## 4. Architecture map — intended vs implemented
Intended (`AGENTS.md`, `docs/architecture.md`): modular monolith + pragmatic hexagonal; module-owned tables; Cloudflare only at the edge.
Implemented: **matches.** Dependency direction `router → use-cases → ports ← D1 adapters`, composition in `platform/cloudflare/bootstrap.ts`; no module-to-module imports found; migrations give each module its own table keyed by `resources.id`; `resource_relationships` links modules. Drift: (a) the router (adapter) is the de-facto application layer for validation/error mapping/pagination (AUD-ARCH-001); (b) `ResourceRepository` reads every module's tables via JOINs, so "cross-module via public interfaces" is honoured at code level but not at data level (acceptable read-model; undocumented); (c) architecture rules are enforced by regex text scans only (`tests/portability.test.mjs`).
Trust boundaries: Internet → Worker (public GET / token-gated writes); Worker → D1; Worker → arbitrary public sites (metadata fetch, SSRF surface); GitHub Actions → API with the curator token; third-party feeds → pipeline → production.

## 5. Production readiness
Ready: fail-closed auth, parameterised SQL, health endpoints, request id header, CI gating on typecheck+tests, tiny dependency footprint. Not ready: deploy/rollback, staging, audit trail, observability, unattended publishing, restore proof.

## 6. Engineering maturity
Mostly levels 1–3: rules are written (`AGENTS.md`, level 2), a few enforced in CI (typecheck, portability regex, auth tests: level 3). Nothing is measured (level 4): no coverage, latency, error-rate or SLO data.

## 7. Domain score table (from matrix rows)
Strong (≥ most rows PASS): Architecture 4/7, Modularity 2/2, Database 3/7 (DB-04 NV), Supply chain 2/4 (small). Weak (FAIL ≥ PASS): Data, Domain, Testing, Code quality, Frontend, Performance, Reliability, Observability, Infrastructure, Documentation, AI/Automation, CI/CD (deploy side). Domain-by-domain tallies are reproducible with the grep in the matrix file.

## 8. Top systemic risks
1. **SYSTEMIC-TRUST-001**: Trust decisions rely on one secret and one heuristic (token, CF header, quality score), with no human or identity layer behind them (AUD-SEC-001/002/003).
2. **SYSTEMIC-VERIFY-001**: The riskiest layers (SQL, migrations, router) have no executable checks; architecture rules are text-scanned (AUD-TEST-001, ARCH-07).
3. **SYSTEMIC-OPS-001**: Operability lives in one person's machine (`deploy.bat`), untested runbooks, no logs/audit (AUD-OPS-001, AUD-OBS-001).
4. **SYSTEMIC-DRIFT-001**: Multiple copies of truth — data (5 catalog sources) and docs (stale audit, hard-coded `/api/architecture`) (AUD-DATA-001, AUD-DOC-001).
5. **SYSTEMIC-ERR-001**: No error/validation policy; string-matching control flow (AUD-SYS-001, AUD-BUG-001).

## 9–11. Findings
P0: none. P1: AUD-SEC-001, AUD-SEC-002, AUD-OPS-001. P2: AUD-SEC-003/004, AUD-SYS-001, AUD-ARCH-001, AUD-TEST-001, AUD-DATA-001, AUD-OBS-001, AUD-CICD-001, AUD-DOC-001, AUD-AIOPS-001. P3/P4 listed in `30-FINDINGS.md`. Note: three items the prior `docs/audit/` calls open (hard-coded secret, cartesian query, migration scripts) are **fixed in code** — verified by reading `curatorAuth.ts`, `D1ResourceRepository.ts`, `package.json`.

## 12. Architecture assessment
Strength: portability is real and tested; module-owned schema; ports are thin. Risk: router as god file; `ResourceDto`/`ResourceRepository` aggregate view couples to every module's columns (adding a 5th module requires editing a 30-column SELECT and mapper — fine for now, flag at module #6). Do not add abstraction layers; add a route table and shared parsing when touching the router.

## 13. Business correctness
Critical calculations: only the curation quality score (`qualityScorer.computeQualityScore`) and URL/host normalisation. The score is heuristic, unversioned, untested, depends on live external counts (stars/points) → non-reproducible by design; acceptable only if it stops gating publication (AUD-SEC-001). Recommend golden fixtures for score + `normalizeUrl`/`isPrivateOrBlockedHost` (the latter has tests).

## 14. Data
Source of truth should be D1; currently five artefacts compete (AUD-DATA-001). Derived data: FTS5 tables maintained by triggers (rebuildable via `INSERT INTO fts(fts) VALUES('rebuild')` — not documented). Favorites ambiguity (AUD-DATA-002). No CHECK constraints for enums. No retention/soft-delete concerns (public catalogue). Provenance: `origin` column exists (curated/user/discovered) but pipeline source metadata (`sourceMetadata`) is not persisted — NOT VERIFIED whether stored elsewhere.

## 15. Security
Positive: fail-closed token; constant-time compare; parameterised SQL; FTS input sanitised; SSRF redirects re-validated; `rel="noopener noreferrer"`; `escapeHtml` used broadly; `X-Robots-Tag`. Gaps: AUD-SEC-001/002/003/004/005/006. Threat model (condensed): anonymous attacker → read-only + search load (DoS/cost); token thief → full write; compromised upstream feed → catalog poisoning (highest-likelihood path); compromised CI → token exfiltration; operator mistake → manual deploy/migration mismatch. OWASP API Top 10 mapping: API2 (token model), API4 (no rate limiting, deep OFFSET), API6 (auto-curation flow), API8 (headers/CSP), API9 (stale docs/`workers.dev`), API10 (unsafe consumption of HN/GitHub/HF data).

## 16. Testing
37 fast deterministic tests, all pass; good quality for what they cover (domain invariants, auth gating, SSRF predicate). Missing: repositories, migrations, FTS, route-level auth, error mapping, frontend, pipeline. Coverage numbers do not exist. Regex-based architecture tests are a good seed, not a gate.

## 17–18. Performance & scalability (inference, not measured)
Dataset ≈ hundreds of rows; `/api/tools?limit=500` returns the whole catalog (frontend loads it in one call) → payload scales linearly with catalog size; at ~10× (low thousands) still fine, at ~50× the unpaginated bootstrap fetch, `LIMIT/OFFSET` deep paging, per-request `LIKE` fallbacks and JSON `null, 2` pretty-printing (bytes) become the first costs. First failure point: public search endpoints with no rate limiting/caching (`no-store` on module listings) hitting D1 read quotas, before any data-volume limit. D1 is the single dependency and single point of failure; Worker CPU is not a concern. Recommend budgets: p95 < 300 ms for `/api/resources`, payload < 200 KB/first paint (not currently measured).

## 19–20. Reliability & observability
Failure handling: unhandled errors → 500 with request id; metadata fetch degrades gracefully; D1 outage → `/api/db-health` 503 but no fallback/stale serving (`PUBLIC_CACHE_HEADERS` use stale-while-revalidate only on `/resources`). Pipeline publish is multi-call non-transactional. Observability: see AUD-OBS-001; an operator cannot currently answer who/when/what for a data change.

## 21–22. CI/CD & infrastructure
CI: typecheck + tests on PR/push, Node 22, `npm ci`. Missing: deploy, smoke tests, migration validation, dependency/secret scans, permissions hardening, SHA pinning. Infra: Cloudflare Workers + D1 + custom domain; single environment; `workers.dev` exposure unset. No containers/servers to audit (N/A).

## 23. UX / accessibility (static only)
Distinctive retro "Yellow Pages" theme; heavy blink animation and ~13 aria/role/label hits suggest accessibility is not engineered in; loading/empty/error/offline state handling and destructive-action confirmation were not inspected in depth → NOT VERIFIED. Use axe + keyboard walkthrough before claiming WCAG 2.2 AA.

## 24–25. Documentation & operations
README, architecture, portability, auto-curation docs and two runbooks exist and are readable — above average for the size. Faults: stale prior audit, no ADRs, deploy undocumented, runbooks unexercised, `/api/architecture` hard-coded. A new engineer can understand the architecture from the repo, run locally with `npm install`, `npm run db:migrate:local`, `npm run dev` (documented; not executed in this audit), but cannot safely deploy.

## 26. Technical debt map
Architecture debt: router duplication. Data debt: five catalog copies, seeds in migrations. Testing debt: persistence/router. Security debt: single token, no CSP, no audit log. Operational debt: deploy/rollback/observability. Documentation debt: stale audit, no ADRs. Dependency debt: dev-only undici advisories. Intentional debt worth keeping: vanilla frontend, no framework, no DI container, no microservices.

## 27. Quick wins (cheap, genuinely valuable)
1. Switch scheduled cron to dry-run/proposal; gate `--publish` behind manual dispatch (AUD-SEC-001). 2. `workers_dev: false`. 3. NaN-safe paging helper (AUD-BUG-001). 4. Add `permissions: contents: read` + SHA pins to workflows. 5. Add `nosniff`/`frame-ancestors`/`Referrer-Policy` headers. 6. Mark `docs/audit/` as superseded. 7. `npm audit fix` (dev tooling) when wrangler patch lands.
Not quick wins despite looking easy: reformatting/splitting `app.js`, renaming modules.

## 28. Roadmap (dependency-ordered)
- **A — Critical safety**: A1 gate autonomous publishing (AUD-SEC-001); A2 Access JWT verification or remove header mode, disable workers.dev (AUD-SEC-002). Effort S–M.
- **B — Foundations**: B1 error taxonomy + shared parse/validate (AUD-SYS-001, AUD-BUG-001) → B2 route-table refactor of router (AUD-ARCH-001, depends B1); B3 declare data source of truth, move seeds out of migrations (AUD-DATA-001); B4 DB CHECK constraints via new migration (AUD-DOM-001).
- **C — Reliability**: C1 audit log table + structured logs (AUD-OBS-001); C2 in-repo deploy procedure + CI deploy/smoke + restore rehearsal (AUD-OPS-001).
- **D — Scale**: D1 cache headers for public GETs, cap `limit`/`offset`, rate-limit rule (AUD-SEC-006), measure p95.
- **E — Quality**: E1 SQLite-backed repo/migration/router tests (AUD-TEST-001, needs B1/B2 for stable seams); E2 lint + import-boundary rule; E3 workflow hardening (AUD-CICD-001); E4 ADRs, refresh docs (AUD-DOC-001).
- **F — Product**: F1 CSP + remove inline handlers (AUD-SEC-003/004, depends on frontend event refactor); F2 a11y pass, reduced-motion/pause for blink (AUD-A11Y-001); F3 AbortController/race fixes (AUD-FE-001).

## 29. What NOT to refactor yet
- Do not split `app.js` or adopt a frontend framework before CSP/inline-handler decision (F1) and tests exist.
- Do not rewrite `router.ts` before the error taxonomy (B1) and route-level tests exist — otherwise there is no safety net.
- Do not add more resource modules until the router/DTO aggregation (30-column SELECT) strategy is decided.
- Do not "fix" the Telegram listener before deciding whether the review gate lives in Telegram, GitHub PRs or the app (AUD-SEC-001).
- Do not touch the migration history (0001–0008); add forward migrations only.
- Do not introduce an ORM, DI container, queue or microservices.

## 30. Engineering Constitution
See `32-ENGINEERING-CONSTITUTION.md`.

## 31. Answers to the 30 questions (short)
1 Modular monolith, hexagonal, on Workers+D1. 2 Yes (verified). 3 prompts/tools/workflows/agents over a shared `resources` core. 4 Router acts as application layer; read-model joins span modules. 5 Portability discipline, parameterised SQL, fail-closed auth, tiny dependency set. 6 Ops, observability, test depth, data provenance. 7 See §8. 8 Deploy, restore, token handling, Access flag. 9 Largely yes. 10 Likely yes (not executed). 11 No. 12 Not documented → unverified. 13 Procedure exists, never exercised → NOT VERIFIED. 14 Score is not reproducible; URL/SSRF predicates are. 15 Yes — via the auto-publish pipeline (AUD-SEC-001). 16 Writes: yes (route-level untested); reads: public by design. 17 No secrets found in tracked files; rotation/scope unmanaged; history scan NOT VERIFIED. 18 Only via regex tests. 19 Yes at code level. 20 No (persistence/router). 21 Barely. 22 No (no logs/audit). 23 Public search load/D1 read quota and the 500-row bootstrap call. 24 Same plus D1 single-DB limits and catalog payload. 25 D1 database (and the one operator's deploy machine). 26 Cloudflare (D1/Workers); then upstream feeds for data quality. 27 Vanilla frontend/no-framework, MD docs volume, retro styling. 28 Unattended publishing, shared token, missing audit trail. 29 AUD-SEC-001, then AUD-SEC-002, AUD-OPS-001. 30 Not yet — CONDITIONALLY READY.

## Final verdict: CONDITIONALLY READY
No P0; three P1s are process/trust issues rather than code defects. The foundation is better than its surroundings: fix the trust model and operability first, and add executable tests before any refactor.

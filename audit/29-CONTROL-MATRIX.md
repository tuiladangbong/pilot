# 29 — Control Matrix (audit 2026-11-04)

Maturity: 0 none · 1 ad hoc · 2 defined · 3 enforced · 4 measured · 5 improving.
Result: PASS / PARTIAL / FAIL / N/A / NOT VERIFIED. Scores below are derived by counting rows in this file, not estimated.

| ID | Domain | Control | Evidence | Result | Maturity | Notes |
|---|---|---|---|---|---|---|
| ARCH-01 | Architecture | Domain/ports/router free of Cloudflare types | `tests/portability.test.mjs` (3 tests pass); grep of src | PASS | 3 | Regex guard, bypassable |
| ARCH-02 | Architecture | Router depends only on `RouterDependencies` | router.ts imports; bootstrap.ts is sole composition root | PASS | 3 | |
| ARCH-03 | Architecture | SQL confined to `adapters/persistence/d1` | grep `prepare(` | PASS | 2 | Not machine-enforced |
| ARCH-04 | Architecture | Modules do not import each other's internals | router imports module internals directly (adapter layer, allowed); no module→module imports found | PASS | 2 | No test |
| ARCH-05 | Architecture | Router is maintainable / cohesive | 1,267 lines, 4× duplicated CRUD | FAIL | 1 | AUD-ARCH-001 |
| ARCH-06 | Architecture | Docs match implementation | `/api/architecture` hard-coded; old audit stale | PARTIAL | 2 | AUD-DOC-001 |
| ARCH-07 | Architecture | Fitness functions beyond regex scan | none | PARTIAL | 2 | |
| MOD-01 | Modularity | Module-owned tables referencing resources.id | migrations 0002–0005 | PASS | 2 | |
| MOD-02 | Modularity | Cross-module links via relationships | `resource_relationships` (0004) | PASS | 2 | |
| DOM-01 | Domain | Invariants enforced at DB (CHECK/enum) | no CHECK constraints | FAIL | 1 | AUD-DOM-001 |
| DOM-02 | Domain | Typed identifiers/enums in core | `type: string`, unchecked cast | PARTIAL | 2 | |
| DOM-03 | Domain | Deterministic time handling | `new Date()` in domain | PARTIAL | 1 | |
| BIZ-01 | Correctness | Critical calc golden tests | quality score only in scripts, untested | NOT VERIFIED | 1 | Scoring is heuristic, unversioned |
| DATA-01 | Data | Single source of truth declared | 5 catalog copies | FAIL | 1 | AUD-DATA-001 |
| DATA-02 | Data | Backups configured & restore tested | runbook only | NOT VERIFIED | 2 | |
| DATA-03 | Data | RPO/RTO defined | none stated | FAIL | 0 | |
| DB-01 | Database | Parameterised queries / no string-built SQL | all values bound; ORDER BY whitelisted | PASS | 3 | |
| DB-02 | Database | FKs with cascade, unique slug | 0001, 0006 | PASS | 2 | FK enforcement in D1 on by default |
| DB-03 | Database | Counting via scalar subqueries (no cartesian) | D1ResourceRepository list/find | PASS | 2 | Old audit claim obsolete |
| DB-04 | Database | Query plans reviewed (EXPLAIN) | not run | NOT VERIFIED | 0 | |
| DB-05 | Database | Migrations tested on empty DB | no test | FAIL | 1 | AUD-TEST-001 |
| DB-06 | Database | Migration rollback strategy | forward-only; time-travel doc | PARTIAL | 2 | |
| DB-07 | Database | Search fallback bounded | LIKE '%q%' over content | PARTIAL | 1 | AUD-SEC-006 |
| API-01 | API | Auth on all mutating methods | `enforceCuratorAuth` before routing; tests | PASS | 3 | |
| API-02 | API | Fail-closed when token unset | curatorAuth.ts + test | PASS | 3 | |
| API-03 | API | Input validation | ad-hoc, `any` | PARTIAL | 1 | |
| API-04 | API | Pagination bounds incl. NaN | NaN passes clamp | FAIL | 1 | AUD-BUG-001 |
| API-05 | API | Consistent error model/status | err.message string matching | FAIL | 1 | AUD-SYS-001 |
| API-06 | API | Rate limiting | none in code; WAF unknown | NOT VERIFIED | 0 | |
| API-07 | API | Consistent caching/CORS | cache only on /resources; PATCH missing | PARTIAL | 1 | |
| API-08 | API | Idempotency of mutations | favorite toggle w/o explicit value non-idempotent | PARTIAL | 1 | |
| SEC-01 | Security | AuthN strength / identity | static shared token | PARTIAL | 2 | AUD-SEC-002 |
| SEC-02 | Security | Constant-time token compare | safeCompareTokens | PASS | 3 | |
| SEC-03 | Security | CF Access header verified cryptographically | no JWT check | FAIL | 1 | Conditional on flag |
| SEC-04 | Security | Security headers / CSP | none | FAIL | 0 | AUD-SEC-003 |
| SEC-05 | Security | XSS-safe rendering | escapeHtml mostly; gaps | PARTIAL | 2 | AUD-SEC-004 |
| SEC-06 | Security | SSRF controls | per-hop revalidation; string denylist | PARTIAL | 3 | |
| SEC-07 | Security | Secrets not in repo | .dev.vars ignored; no secrets found in tracked files by grep | PASS | 2 | History scan NOT VERIFIED |
| SEC-08 | Security | Audit log of mutations | none | FAIL | 0 | |
| SUP-01 | Supply chain | Lockfile + npm ci | package-lock.json, CI uses `npm ci` | PASS | 3 | |
| SUP-02 | Supply chain | Vulnerability scan in CI | none; `npm audit`: 1 high, 2 moderate (dev) | FAIL | 1 | |
| SUP-03 | Supply chain | Actions pinned to SHA / least-privilege token | tag-pinned, no permissions | FAIL | 1 | AUD-CICD-001 |
| SUP-04 | Supply chain | Minimal dependencies | 3 devDeps, 0 runtime | PASS | 3 | Strength |
| QUAL-01 | Code quality | Typecheck clean | `npm run typecheck` exit 0 | PASS | 3 | CI enforced |
| QUAL-02 | Code quality | Lint/format enforced | none | FAIL | 0 | |
| QUAL-03 | Code quality | Scripts/frontend type-checked | tsconfig src only | FAIL | 0 | |
| TEST-01 | Testing | Unit suite passes | 37/37 | PASS | 3 | |
| TEST-02 | Testing | Persistence/router/migration tests | none | FAIL | 0 | AUD-TEST-001 |
| TEST-03 | Testing | SSRF/auth unit tests | tools.test, curator-auth.test | PASS | 3 | |
| TEST-04 | Testing | E2E/UI/a11y tests | `scripts/test-interactions.mjs` manual, not in CI | PARTIAL | 1 | |
| TEST-05 | Testing | Property/golden tests | none | FAIL | 0 | |
| FE-01 | Frontend | Request cancellation / race safety | no AbortController | FAIL | 1 | NOT VERIFIED at runtime |
| FE-02 | Frontend | Maintainable structure | single 2,047-line file | PARTIAL | 1 | Vanilla JS is policy-compliant |
| A11Y-01 | Accessibility | WCAG 2.2 AA verified | static grep only | NOT VERIFIED | 1 | AUD-A11Y-001 |
| UX-01 | UX | Destructive-action confirmation | NOT inspected in depth | NOT VERIFIED | 0 | |
| PERF-01 | Performance | Budgets/measurements exist | none | FAIL | 0 | |
| PERF-02 | Performance | Runtime load/latency measured | not run (no destructive tests on live) | NOT VERIFIED | 0 | |
| SCALE-01 | Scalability | Growth path identified | D1 single DB; tens of KB responses | PARTIAL | 2 | See report |
| REL-01 | Reliability | Graceful failure handling | unhandled → 500 + id; metadata fetch degrades | PARTIAL | 2 | |
| REL-02 | Reliability | Non-transactional multi-step publish | pipeline publishes tool→workflow→prompt via separate calls | FAIL | 1 | AUD-CICD-001 |
| OBS-01 | Observability | Structured logs/metrics/traces | none | FAIL | 0 | AUD-OBS-001 |
| OBS-02 | Observability | Request id propagation | X-Request-Id on responses | PARTIAL | 2 | Not logged |
| OBS-03 | Observability | Health endpoints | /api/health, /api/db-health | PASS | 2 | Shallow |
| CICD-01 | CI/CD | Typecheck+tests on PR | ci.yml | PASS | 3 | |
| CICD-02 | CI/CD | Automated deploy + smoke + rollback | none; deploy.bat ignored | FAIL | 0 | AUD-OPS-001 |
| CICD-03 | CI/CD | Branch protection/required checks | cannot see | NOT VERIFIED | 0 | |
| INFRA-01 | Infrastructure | Workers.dev exposure disabled | not set | PARTIAL | 1 | |
| INFRA-02 | Infrastructure | Env separation (staging/prod) | single D1 id | FAIL | 0 | |
| OPS-01 | Operations | Runbooks exist | incident-response, disaster-recovery | PARTIAL | 2 | Untested |
| OPS-02 | Operations | Local run documented | README; `npm run dev` + migrate:local | PARTIAL | 2 | Not executed here |
| DOC-01 | Documentation | Accurate & current | stale audit set | PARTIAL | 2 | |
| DOC-02 | Documentation | ADRs | none | FAIL | 0 | |
| PRIV-01 | Privacy | PII handling | no user accounts/PII stored | N/A | – | localStorage only |
| TEN-01 | Multi-tenancy | Tenant isolation | single tenant | N/A | – | |
| AI-01 | AI/Automation | Autonomous publish gated by human | scheduled live publish | FAIL | 1 | AUD-SEC-001 |
| AI-02 | AI/Automation | Prompt-injection exposure | no LLM call found; untrusted text published | PARTIAL | 1 | |

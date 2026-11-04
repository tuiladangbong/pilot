# 32 — Engineering Constitution (proposal for Pilot)

Each rule: ID · Rule · Reason · Enforcement. "Gate" = can be a CI quality gate.

| ID | Rule | Reason | Enforcement |
|---|---|---|---|
| ARCH-001 | `core/`, `modules/**`, `ports`, `router` MUST NOT import Cloudflare types or `adapters/persistence`. | Portability (AGENTS.md) | Gate: replace regex test with TS-AST/`dependency-cruiser` rule |
| ARCH-002 | SQL only under `adapters/persistence/d1/`. | Single place to review queries | Gate: grep test for `.prepare(` outside folder |
| ARCH-003 | A module MUST NOT import another module; links go through `resource_relationships`/ports. | Isolation | Gate: import-boundary test |
| ARCH-004 | New route = entry in the route table with declared auth level, schema, cache policy. | Prevent per-route drift | Review + route-table test enumerating routes vs auth |
| SEC-001 | Every non-GET route MUST be covered by an auth test that asserts 401 without credentials. | Fail-closed writes | Gate: generated from route table |
| SEC-002 | No identity may be derived from a client-supplied header without cryptographic verification. | Spoofing | Review + unit test |
| SEC-003 | Autonomous processes MAY propose, never publish; production writes require a human decision. | Content integrity | Workflow config check (no `--publish` on `schedule`) |
| SEC-004 | Every mutation writes an audit row (actor, action, resource, time). | Accountability | Repository-level test |
| SEC-005 | Responses carry CSP, nosniff, frame-ancestors; no inline handlers or `innerHTML` with unescaped values. | XSS blast radius | Gate: header test; lint rule |
| SEC-006 | Secrets only in Cloudflare/GitHub secret stores; CI secret scan on every push. | Leakage | Gate: gitleaks |
| DATA-001 | Every schema change = new numbered migration (DDL only); seeds live outside `migrations/`. | Reproducibility | Gate: CI applies all migrations to empty SQLite and runs schema assertions |
| DATA-002 | Enumerated columns have CHECK constraints. | Invariants at the source | Migration review + schema test |
| API-001 | Paging params are parsed by one helper (NaN-safe, capped). | Robustness | Unit test; grep ban on bare `parseInt(...searchParams` |
| ERR-001 | Throw typed errors (`ValidationError`, `NotFoundError`, `ConflictError`); never branch on `err.message`. Unknown errors → generic 500 + log. | Correct status codes, no leakage | Lint rule; router mapping test |
| TEST-001 | Repository and route behaviour tested against real SQLite with real migrations. | Test what can break | Gate: CI |
| TEST-002 | Business-critical pure functions have golden fixtures (score, URL normalisation, SSRF predicate). | Reproducibility | Gate: CI |
| FE-001 | Request-issuing UI code cancels superseded requests (AbortController/sequence id). | Stale overwrite | Review; e2e |
| UX-001 | Interactive controls are keyboard-operable; animation respects `prefers-reduced-motion`; blink ≤ 5 s or pausable. | WCAG 2.2 AA | Gate: axe in CI |
| PERF-001 | Budgets: p95 < 300 ms API, first-paint payload < 200 KB. | Measurability | Synthetic check post-deploy |
| OBS-001 | One structured log per request (id, route, status, ms) and per mutation. | Operability | Review; log-shape test |
| CICD-001 | Workflows declare minimal `permissions`, pin actions by SHA, never interpolate `inputs` into shell. | Supply chain | Gate: workflow linter (actionlint/zizmor) |
| CICD-002 | Deploy only from CI after checks; post-deploy smoke on `/api/health` and `/api/db-health`; rollback documented and rehearsed. | Safe delivery | Pipeline definition |
| DOC-001 | Decisions → ADR (context, decision, alternatives, consequences); audit/status docs carry a date and are superseded, not edited silently. | Prevent drift | Review checklist |

Candidates for immediate automation: ARCH-001/002/003, SEC-001, SEC-006, DATA-001, API-001, CICD-001, TEST-001/002.

# 16 — Testing Strategy & Quality Assurance Audit

## Test Suite Execution & Coverage

- **Test Framework:** Node.js native test runner (`node:test`, `node:assert/strict`).
- **Command:** `npm test` (`node --test tests/*.test.mjs`).
- **Execution Speed:** 35 passing tests in ~7,050 ms.

---

## Test Inventory & Assessment

| Test File | Test Count | Scope | Key Assertions / Verifications | Audit Assessment |
|:---|:---:|:---|:---|:---|
| `tests/domain.test.mjs` | 4 | Domain Entities | Entity creation, input validation, immutability, date formatting. | **Good** |
| `tests/tools.test.mjs` | 7 | Tools Domain | URL normalization, hostname extraction, kind/pricing validation, SSRF host blocking. | **Good** |
| `tests/workflows.test.mjs` | 4 | Workflows Domain | Workflow creation, step reordering, status/difficulty normalization. | **Good** |
| `tests/agents.test.mjs` | 7 | Agents Domain | Agent role/goal/instructions, contracts, formatting full agent text. | **Good** |
| `tests/catalog.test.mjs` | 6 | Catalog Data | Static catalog data integrity, required fields, unique IDs, slug formats. | **Good** |
| `tests/curator-auth.test.mjs` | 5 | Security Adapter | Anonymous rejection, token auth via headers, Cloudflare Access header auth. | **Highlights P0 Defect** (Explicitly tests spoofable header) |
| `tests/portability.test.mjs` | 3 | Architecture Fitness | Verifies 0 Cloudflare imports in domain/modules, verifies router dependencies decoupling. | **Exemplary** (Automated fitness function) |

---

## Testing Gaps & Deficiencies

1. **Zero Database Integration Tests:**
   - There are no tests asserting queries against a live local D1 SQLite database (e.g. using Miniflare or `@cloudflare/vitest-pool-workers`).
   - Complex SQL queries in `D1ResourceRepository`, `D1WorkflowRepository`, and FTS5 search are completely untested in automated CI.
2. **Zero End-to-End (E2E) Browser Tests:**
   - Frontend interactions (`public/app.js`), modal dialogs, tab switching, and search debouncing are not covered by automated tests.
   - Script `scripts/test-interactions.mjs` exists for manual execution, but is not run as part of `npm test`.
3. **No Concurrency or Load Tests:**
   - No automated tests simulating simultaneous read/write load on SQLite transactions.

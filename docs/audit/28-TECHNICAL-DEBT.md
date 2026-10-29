# 28 — Technical Debt Map & Prioritization

## Technical Debt Taxonomy

```mermaid
quadrantChart
    title Technical Debt: Risk vs Effort to Remediate
    x-axis Low Effort --> High Effort
    y-axis Low Risk --> High Risk
    quadrant-1 High Risk, High Effort (Plan Sprints)
    quadrant-2 High Risk, Low Effort (Hotfix Immediately)
    quadrant-3 Low Risk, Low Effort (Quick Wins)
    quadrant-4 Low Risk, High Effort (Leave Alone For Now)
    "AUD-SEC-001 (Auth Bypass)": [0.15, 0.95]
    "AUD-SEC-002 (SSRF Redirect)": [0.20, 0.85]
    "AUD-PERF-001 (Cartesian Join)": [0.35, 0.80]
    "AUD-OPS-001 (Migration Scripts)": [0.10, 0.75]
    "AUD-OBS-001 (Observability)": [0.45, 0.65]
    "AUD-SEC-003 (CORS Support)": [0.15, 0.50]
    "AUD-CODE-001 (Router Monolith)": [0.65, 0.40]
    "AUD-CODE-002 (Frontend Monolith)": [0.75, 0.30]
    "AUD-TEST-001 (D1 Vitest Pool)": [0.70, 0.45]
    "AUD-A11Y-001 (Dialog Element)": [0.30, 0.35]
```

---

## Detailed Debt Classification

### 1. Actively Dangerous Debt (Remediate in Sprint 0)
- **`AUD-SEC-001`:** Hardcoded secret fallback and raw header trust in `curatorAuth.ts`.
- **`AUD-SEC-002`:** Blind redirect following in `FetchToolMetadataUseCase.ts`.
- **`AUD-OPS-001`:** Broken migration commands in `package.json`.

### 2. Scalability & Stability Debt (Remediate in Sprint 1)
- **`AUD-PERF-001`:** Cartesian product join in `D1ResourceRepository.list()`.
- **`AUD-OBS-001`:** Lack of structured logging and request correlation IDs (`cf-ray`).
- **`AUD-SEC-003`:** Lack of CORS headers on public API endpoints.

### 3. Debt to Intentionally Leave Alone for Now
- **Monolithic Frontend (`public/app.js`):** At 73.9 KB with 0 build steps, vanilla JS is currently serving users with exceptional speed (<150ms FCP). Introducing React, Vue, or Next.js would add massive bundle weight, build complexity, and maintenance overhead for zero user benefit.
- **Large Single Router File (`src/adapters/http/router.ts`):** While 1,214 lines is long, the flow is straightforward and strictly verified by portability tests. Refactoring should wait until multiple engineers join the project to avoid premature abstraction.
- **SQLite Single Database Engine:** Cloudflare D1 effortlessly handles Pilot's current ~300 resources. Do not migrate to external PostgreSQL or multi-tenant database systems until data volume reaches hundreds of thousands of items.

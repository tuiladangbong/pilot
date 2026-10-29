# 29 — Engineering Control Matrix & Verification

## Comprehensive Verification Matrix

| Domain | Control ID | Engineering Control Description | Automated Verification | Production Status | Finding Reference |
|:---|:---|:---|:---:|:---:|:---|
| **Architecture** | `ARCH-01` | Hexagonal isolation: Core/modules have 0 Cloudflare imports | `npm test` (`portability.test.mjs`) | **PASS** | Exemplary fitness test |
| **Architecture** | `ARCH-02` | Router depends only on `RouterDependencies` interface | `npm test` (`portability.test.mjs`) | **PASS** | Exemplary fitness test |
| **Architecture** | `ARCH-03` | Composition root decouples platform from application | Code Inspection (`bootstrap.ts`) | **PASS** | Clean inversion of control |
| **Security** | `SEC-01` | Curator authentication validates signature / secrets | `npm test` (`curator-auth.test.mjs`) | **FAIL (P0)** | `AUD-SEC-001` (Header spoofable, hardcoded fallback) |
| **Security** | `SEC-02` | Constant-time secret comparison | Code Inspection (`curatorAuth.ts`) | **FAIL (P1)** | `AUD-SEC-001` (Uses standard `===`) |
| **Security** | `SEC-03` | Outbound request protection against SSRF | `npm test` (`tools.test.mjs`) | **FAIL (P1)** | `AUD-SEC-002` (Redirects bypass host filter) |
| **Security** | `SEC-04` | CORS headers configured for cross-origin callers | Manual HTTP Inspection | **FAIL (P2)** | `AUD-SEC-003` (No CORS headers) |
| **Security** | `SEC-05` | Secrets omitted from git repository | Git inspection (`.gitignore`) | **PASS** | `.dev.vars`, `.env` ignored |
| **Data / DB** | `DATA-01` | Foreign key constraints defined on relations | Schema inspection (`migrations/`) | **PASS** | `ON DELETE CASCADE` present |
| **Data / DB** | `DATA-02` | Full-text search queries sanitized against injection | `D1ResourceRepository.ts` | **PASS** | `sanitizeFtsQuery` strips `"` and `*` |
| **Data / DB** | `DATA-03` | Multi-table joins free of Cartesian explosion | SQL query analysis | **FAIL (P1)** | `AUD-PERF-001` (1:N join with 1:M join) |
| **Operations** | `OPS-01` | Migration scripts synchronize all schema files | `package.json` inspection | **FAIL (P1)** | `AUD-OPS-001` (Missing 0006, 0007, 0008) |
| **Operations** | `OPS-02` | CI/CD automated pipeline on merge | GitHub Actions check | **FAIL (P2)** | No CI workflow in repo |
| **Operations** | `OPS-03` | Off-site automated database backups | Cloudflare dashboard check | **NOT VERIFIED** | Cloudflare native only |
| **Observability**| `OBS-01` | Request correlation ID (`cf-ray` / UUID) in responses | Response headers check | **FAIL (P2)** | `AUD-OBS-001` (Missing request IDs) |
| **Observability**| `OBS-02` | Service liveness and DB health endpoints | HTTP test (`/api/health`, `/api/db-health`) | **PASS** | Functional probes exist |
| **Quality** | `QA-01` | TypeScript zero-error strict compilation | `npm run typecheck` | **PASS** | 0 TypeScript errors |
| **Quality** | `QA-02` | Domain business unit test coverage | `npm test` | **PASS** | 35 passing tests |
| **Quality** | `QA-03` | Local D1 integration test suite | Test suite inspection | **FAIL (P2)** | No live D1 SQLite tests |
| **UX / a11y** | `UX-01` | WCAG contrast ratio compliance | CSS inspection (`styles.css`) | **PASS** | > 10:1 contrast ratio |
| **UX / a11y** | `UX-02` | Modal focus trapping and keyboard navigation | Code inspection (`app.js`) | **PARTIAL** | Esc works; lacks `inert` trap |

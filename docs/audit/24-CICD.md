# 24 — CI/CD & Deployment Pipeline Audit

## Deployment Pipeline Analysis

### Current State
- **CI Tool:** None configured (`.github/workflows` does not exist in repository).
- **Deployment Script:** `npm run deploy` (`wrangler deploy`).
- **Migration Scripts in `package.json`:**
  - `"db:migrate:local": "wrangler d1 execute pilot-db --local --file=./migrations/0001_initial.sql && ... && wrangler d1 execute pilot-db --local --file=./migrations/0005_agents.sql"`
  - `"db:migrate:remote": "wrangler d1 execute pilot-db --remote --file=./migrations/0005_agents.sql"`

---

## Critical Operations Defect: Migration Drift & Script Breakdown (`AUD-OPS-001`)

### Evidence & Impact
1. **Hardcoded Remote Script Omission:**
   - `db:migrate:remote` is hardcoded to execute only `0005_agents.sql`.
   - Running `npm run db:migrate:remote` on a newly provisioned remote database fails because tables from `0001` through `0004` are never created!
   - Migration files `0006_public_catalog.sql`, `0007_ai_era_workflow_catalog.sql`, and `0008_prompts_workflows_agents.sql` are completely omitted from both `db:migrate:local` and `db:migrate:remote`.
2. **Bypass of Native Wrangler Migration Tracking:**
   - By running `wrangler d1 execute --file=...`, the database bypasses Wrangler's internal migration tracking table (`d1_migrations`).
   - Consequently, `wrangler d1 migrations list` cannot determine which migrations have been applied, creating severe risk of schema drift or duplicate execution errors.

---

## Remediation Requirements
1. **GitHub Actions Workflow:** Create `.github/workflows/deploy.yml` with:
   - Typecheck step (`npm run typecheck`)
   - Test step (`npm test`)
   - Automated deployment on merge to `main`.
2. **Native Migration Command:** Replace ad-hoc chained execute commands with:
   ```json
   "db:migrate:local": "wrangler d1 migrations apply pilot-db --local",
   "db:migrate:remote": "wrangler d1 migrations apply pilot-db --remote"
   ```

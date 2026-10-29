# 26 — Operations, Backups & Disaster Recovery

## Operational Runbook Assessment

### 1. Database Backups & Restore
- **Current State:** Cloudflare D1 provides automated daily snapshots and time-travel recovery (up to 30 days on paid tiers).
- **Audit Defect:** No automated off-site backup export or scheduled snapshot validation script exists in the repository.
- **Disaster Recovery RPO / RTO:**
  - **Recovery Point Objective (RPO):** ~24 hours via D1 automatic snapshots.
  - **Recovery Time Objective (RTO):** ~30 minutes to spin up a new D1 database and re-apply migrations.
- **Restoration Test:** Not formally verified via automated CI drill.

### 2. Incident Runbooks & Triage
- **Status:** **ABSENT.** No `docs/runbooks/` or incident response procedures exist for D1 outage, curator token compromise, or DDoS events.
- **Rollback Procedure:**
  - Worker code rollback can be executed via Cloudflare dashboard or `wrangler rollback`.
  - Database rollback is complex if forward migrations have mutated schemas or column names; down migrations (`down.sql`) are not authored in `migrations/`.

### 3. Recommendations
- Implement a scheduled GitHub Action or Cron trigger executing `wrangler d1 export pilot-db --remote` to an encrypted R2 bucket or off-site S3 storage.
- Author an explicit operational runbook in `docs/runbooks/incident-response.md`.

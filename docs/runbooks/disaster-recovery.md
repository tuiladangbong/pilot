# Operational Runbook: Disaster Recovery & Database Restoration

## 1. Objective & Scope
This runbook details step-by-step procedures for recovering Pilot infrastructure and data in the event of database corruption, accidental catalog truncation, Cloudflare D1 zone outage, or data center failure.

---

## 2. Recovery Objectives
- **Recovery Point Objective (RPO):** < 24 hours (Point-in-time recovery via D1 daily snapshots).
- **Recovery Time Objective (RTO):** < 30 minutes (Fresh deployment and schema hydration).

---

## 3. Routine Automated Backups

Cloudflare D1 automatically captures daily snapshots. To perform a manual off-site snapshot export:
```bash
# Export remote database to local SQL dump
wrangler d1 export pilot-db --remote --output="./backups/pilot-db-$(date +%Y%m%d_%H%M%S).sql"
```

---

## 4. Disaster Recovery Scenarios & Procedures

### Scenario A: Accidental Table Deletion or Data Corruption
If records are corrupted but the D1 database binding remains intact:
1. Locate the latest snapshot using Cloudflare Dashboard:
   - Navigate to **Workers & Pages** > **D1 SQL Database** > **pilot-db** > **Time Travel / Backups**.
2. Restore to a timestamp immediately prior to the incident:
   ```bash
   wrangler d1 time-travel restore pilot-db --timestamp="2026-10-29T00:00:00Z"
   ```
3. Verify data health:
   ```bash
   curl -s https://pilot.nodbits.com/api/db-health
   ```

### Scenario B: Catastrophic D1 Database Loss
If `pilot-db` is destroyed or inaccessible:
1. Provision a new D1 database instance:
   ```bash
   wrangler d1 create pilot-db-recovered
   ```
2. Copy the resulting `database_id` into `wrangler.jsonc`.
3. Apply all sequential schema migrations:
   ```bash
   npm run db:migrate:remote
   ```
4. If an off-site SQL dump exists, hydrate catalog data:
   ```bash
   wrangler d1 execute pilot-db-recovered --remote --file=./backups/latest.sql
   ```
5. Deploy worker to point to the new database binding:
   ```bash
   npm run deploy
   ```
6. Verify live health probes:
   ```bash
   curl -I https://pilot.nodbits.com/api/health
   curl -I https://pilot.nodbits.com/api/db-health
   ```

# Deployment & Rollback

Production: Cloudflare Worker `pilot` + D1 `pilot-db`, served at `https://pilot.nodbits.com` (custom domain only; `workers.dev` and preview URLs are disabled in `wrangler.jsonc`).

## Standard deploy (preferred)
GitHub → Actions → **Deploy** → *Run workflow* (approve in the `production` environment). It runs typecheck + tests, applies D1 migrations, deploys, then smoke-tests `/api/health`, `/api/db-health` and `/api/resources`.
Required repository secrets: `CLOUDFLARE_API_TOKEN` (Workers Scripts:Edit + D1:Edit), `CLOUDFLARE_ACCOUNT_ID`.

## Manual deploy (fallback)
```bash
npm ci && npm run typecheck && npm test
npm run db:migrate:remote   # wrangler d1 migrations apply pilot-db --remote
npm run deploy
curl -fsS https://pilot.nodbits.com/api/health && curl -fsS https://pilot.nodbits.com/api/db-health
```

## Ordering rule (expand / contract)
Migrations run **before** the new code. Therefore every migration must be backward compatible with the currently deployed code (add columns/tables/indexes; never drop or rename in the same release). Destructive changes ship in a later release after the code stopped using the old shape.

## Rollback
- **Code:** `npx wrangler rollback` (restores the previous Worker version), then re-run the smoke test.
- **Data:** D1 Time Travel — see `docs/runbooks/disaster-recovery.md`. Migrations are forward-only; to undo one, write a new corrective migration.
- Status: the rollback and restore procedures have **not yet been rehearsed**. Rehearse the restore into a scratch database (`wrangler d1 create pilot-db-restore-test`) and record the date here: _not yet done_.

## Secrets
`CURATOR_TOKEN` is set with `npx wrangler secret put CURATOR_TOKEN` and mirrored in the GitHub secret of the same name. Rotating it means updating both. Cloudflare Access header trust was removed; only the token authenticates writes.

## Autonomous curation
The scheduled workflow is dry-run only. Publishing requires a manual dispatch of **Auto Curate** with `dry_run=false`.

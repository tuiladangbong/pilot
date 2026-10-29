# 25 — Infrastructure as Code & Cloud Configuration

## Cloudflare Infrastructure Topology

- **Configuration File:** `wrangler.jsonc`
- **Compatibility Date:** `2024-11-01`
- **Compatibility Flags:** `["nodejs_compat"]`

```jsonc
{
  "$schema": "node_modules/wrangler/config-schema.json",
  "name": "pilot",
  "main": "src/index.ts",
  "compatibility_date": "2024-11-01",
  "compatibility_flags": ["nodejs_compat"],
  "assets": {
    "directory": "./public",
    "binding": "ASSETS"
  },
  "d1_databases": [
    {
      "binding": "DB",
      "database_name": "pilot-db",
      "database_id": "f2e24f4a-d8c8-4d42-ae32-14d9861e13f3"
    }
  ],
  "routes": [
    {
      "pattern": "pilot.nodbits.com",
      "custom_domain": true
    }
  ]
}
```

---

## Infrastructure Evaluation

### Strengths
- **Serverless & Edge Native:** Zero virtual machine or container patching overhead.
- **Unified Deployment:** Static assets and edge API deploy as a single atomic unit via Cloudflare Workers Static Assets.
- **Global Anycast Routing:** DNS and SSL termination handled automatically by Cloudflare Edge on `pilot.nodbits.com`.

### Weaknesses & Risks
- **No Staging / Preview Environment:** Only one database binding (`pilot-db`) and one custom domain route (`pilot.nodbits.com`) are configured. Developers modifying code or testing migrations locally vs remotely have no isolated staging environment.
- **Missing Secrets Declarations:** Environment variables like `CURATOR_TOKEN` and `ADMIN_TOKEN` are not declared in `wrangler.jsonc` (must be added via `wrangler secret put`).
- **No Rate Limiting Rules:** Cloudflare Rate Limiting rules are not configured in `wrangler.jsonc` to guard public endpoints.

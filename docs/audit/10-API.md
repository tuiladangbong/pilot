# 10 — API Design & Contract Audit

## REST API Specifications

The API exposes endpoints under `/api/*` responding with standard JSON payloads:
```json
{
  "ok": true,
  "data": { ... },
  "meta": { "total": 100, "limit": 50, "offset": 0 }
}
```
Error format:
```json
{
  "ok": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Resource with id or slug not found"
  }
}
```

---

## Endpoint Inventory

| Method | Path | Purpose | Auth Required | Cache-Control |
|:---|:---|:---|:---:|:---|
| `GET` | `/api/health` | Service liveness probe | No | `no-store` |
| `GET` | `/api/db-health` | D1 database health check | No | `no-store` |
| `GET` | `/api/architecture` | Architectural metadata | No | `no-store` |
| `GET` | `/api/curator/status` | Current session auth status | No | `no-store` |
| `GET` | `/api/resources` | Unified resource search & filter | No | `no-store` |
| `GET` | `/api/resources/:idOrSlug`| Get single resource details | No | `no-store` |
| `GET` | `/api/tools` | Tools catalog listing | No | `no-store` |
| `POST`| `/api/tools` | Create new tool | **Yes** (Curator) | `no-store` |
| `GET` | `/api/tools/:idOrSlug` | Tool details by ID or slug | No | `no-store` |
| `PUT` | `/api/tools/:idOrSlug` | Update existing tool | **Yes** (Curator) | `no-store` |
| `DELETE`| `/api/tools/:idOrSlug` | Delete tool | **Yes** (Curator) | `no-store` |
| `POST`| `/api/tools/fetch-metadata` | Scrape URL metadata | **Yes** (Curator) | `no-store` |
| `GET` | `/api/prompts` | Prompts listing | No | `no-store` |
| `POST`| `/api/prompts` | Create new prompt | **Yes** (Curator) | `no-store` |
| `GET` | `/api/workflows` | Workflows listing | No | `no-store` |
| `POST`| `/api/workflows` | Create workflow | **Yes** (Curator) | `no-store` |
| `GET` | `/api/agents` | Agents listing | No | `no-store` |
| `POST`| `/api/agents` | Create agent specification | **Yes** (Curator) | `no-store` |

---

## API Design Weaknesses & Defects

1. **Missing CORS Headers & Preflight Handling (`AUD-SEC-003`):**
   - No `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`, or `OPTIONS` handling in `router.ts`.
   - Third-party web apps or frontends on separate domains cannot consume the public catalog API without browser CORS errors.
2. **Aggressive `no-store` Cache Header:**
   - All API endpoints return `'Cache-Control': 'no-store'`.
   - Read-heavy catalog queries (`GET /api/tools`, `GET /api/resources`) never cache at Cloudflare edge PoPs or client browser HTTP caches, unnecessarily consuming D1 read quota.
   - Recommended: Use `'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600'` on public read queries.

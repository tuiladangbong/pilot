# 27 — Documentation & Tribal Knowledge Audit

## Documentation Inventory

| Document | Location | Purpose | Accuracy / Currency | Audit Notes |
|:---|:---|:---|:---:|:---|
| **README.md** | `README.md` | Getting started, commands, tech stack | **HIGH** | Accurate and concise; documents ports, dev commands, and D1 bindings. |
| **AGENTS.md** | `AGENTS.md` | Core engineering rules for AI agents and developers | **EXCELLENT** | Clear architectural guidelines; strictly defines agent boundaries and modular monolith rules. |
| **architecture.md** | `docs/architecture.md` | System design, data flow, ports & adapters | **HIGH** | Explains hexagonal boundaries, composition root, and entity lifecycles. |
| **portability.md** | `docs/portability.md` | Portability design, runtime decoupling | **HIGH** | Explains how to port Pilot from Cloudflare Workers to Node.js/Fastify. |

---

## Tribal Knowledge Deficiencies

1. **Undocumented Curator Credentials:**
   - How `CURATOR_TOKEN` is provisioned in Cloudflare Workers secrets is not documented in `README.md`.
   - The fallback to `'pilot_curator_secret_2026'` is undocumented and dangerous.
2. **Missing API Endpoint Specifications:**
   - No OpenAPI / Swagger 3.0 specification (`openapi.yaml`) exists for the REST API.
   - Endpoint request/response payloads must be deduced by inspecting `src/adapters/http/router.ts`.
3. **Migration Sequence Ambiguity:**
   - Why `0006`, `0007`, and `0008` exist without being referenced in `package.json` scripts is undocumented tribal context.

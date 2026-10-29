# 01 — Project Classification

## Classification Taxonomy

| Category | Applicable? | Evidence / Source In Code |
|:---|:---:|:---|
| **Web Application** | **YES** | Public-facing single-page application served via Cloudflare Workers Static Assets (`public/index.html`, `public/app.js`, `public/styles.css`). |
| **Backend / REST API** | **YES** | Platform-neutral HTTP router (`src/adapters/http/router.ts`) handling JSON API endpoints under `/api/*`. |
| **Edge Serverless Application** | **YES** | Native Cloudflare Worker entry point (`src/index.ts`) targeting V8 `workerd` runtime (`wrangler.jsonc`). |
| **Database-backed Hub** | **YES** | Cloudflare D1 distributed SQLite database storing resource taxonomy, tools, workflows, prompts, agents, and FTS5 indices. |
| **Directory / Catalog Platform**| **YES** | Curated catalog of AI tools, prompts, workflows, and autonomous agent specifications. |
| **Public API** | **PARTIAL** | REST API currently exposed publicly on `/api/*` for catalog read operations; mutating operations guarded by curator auth. |
| **Mobile / Desktop / CLI** | **NO** | Web browser only; no dedicated mobile, native desktop, or CLI distribution. |
| **AI / ML Execution System** | **NO** | Agent specifications and prompts are cataloged as data models, not executed in-process (strictly aligned with `AGENTS.md`). |

---

## Technical Stack & Constraints

- **Language:** TypeScript 5.6.3 (Strict compilation, `target: ES2022`, `isolatedModules: true`, `noEmit: true`).
- **Runtime:** Cloudflare Workers (V8 isolate `workerd` with `nodejs_compat` enabled).
- **Execution Model:** Edge Serverless Request-Response event lifecycle (`fetch(request, env, ctx)`).
- **Persistence:** Cloudflare D1 (SQLite 3 relational engine with FTS5 Full-Text Search).
- **Frontend Stack:** Vanilla Modern JavaScript (ES Modules, standard DOM APIs, CSS Custom Properties, no Node/Webpack bundling step).
- **Tooling & Build:** Wrangler 4.151.1, Node.js native test runner (`node --test`), TypeScript Compiler (`tsc`).
- **Hosting / CDN:** Cloudflare Global Anycast Edge Network with custom domain `pilot.nodbits.com`.

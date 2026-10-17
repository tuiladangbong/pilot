# Platform Portability Strategy

Pilot is architected so that **Cloudflare is treated as a deployment target, not as the application architecture**.

The long-term requirement is:
> Pilot should be able to run on a standard Linux VPS using Node.js and SQLite (or PostgreSQL) without rewriting its domain or application logic.

---

## Architecture Portability Boundary

```text
                               ┌─────────────────────────────────┐
                               │           Pilot Domain          │
                               │  (core/domain, modules/*/domain)│
                               └────────────────┬────────────────┘
                                                │
                                                ▼
                               ┌─────────────────────────────────┐
                               │        Application Layer        │
                               │(core/application, use cases/dto)│
                               └────────────────┬────────────────┘
                                                │
                                                ▼
                               ┌─────────────────────────────────┐
                               │       Repository Ports          │
                               │  (core/ports, modules/*/ports)  │
                               └────────────────┬────────────────┘
                                                │
                 ┌──────────────────────────────┴──────────────────────────────┐
                 │                                                             │
                 ▼                                                             ▼
┌─────────────────────────────────┐                           ┌─────────────────────────────────┐
│     Cloudflare Adapters         │                           │       Future VPS Adapters       │
│  (src/platform/cloudflare/)     │                           │     (src/platform/node/)        │
├─────────────────────────────────┤                           ├─────────────────────────────────┤
│ • Worker fetch handler          │                           │ • Node.js / Fastify / Native    │
│ • env.DB (Cloudflare D1)        │                           │ • better-sqlite3 / node:sqlite  │
│ • env.ASSETS (Static Assets)    │                           │ • Nginx / Caddy static files    │
│ • D1 persistence adapters       │                           │ • SQLite persistence adapters   │
└─────────────────────────────────┘                           └─────────────────────────────────┘
                 │                                                             │
                 └──────────────────────────────┬──────────────────────────────┘
                                                ▼
                               ┌─────────────────────────────────┐
                               │       Portable HTTP Router      │
                               │   (src/adapters/http/router.ts) │
                               │   Standard Request / Response   │
                               └─────────────────────────────────┘
```

---

## 1. Runtime Breakdown

### Portable Components (Platform-Independent)
These components contain **zero** Cloudflare imports, no runtime bindings (`env`, `ExecutionContext`, `D1Database`), and depend only on standard JavaScript and Web Platform APIs (`Request`, `Response`, `URL`, `crypto.randomUUID()`, `Date`):

- **Domain Entities & Validation** (`src/core/domain/`, `src/modules/*/domain/`):
  - `Resource.ts` (Universal entity)
  - `Prompt.ts` (Prompt entity, validation, tag normalization)
  - `Tool.ts` (Tool entity, URL validation, metadata sanitization, SSRF protection)
  - `Workflow.ts` (Workflow & WorkflowStep entities, reordering, validation)
- **Application Layer & Use Cases** (`src/modules/*/application/`, `src/core/application/`):
  - All use cases (`CreatePromptUseCase`, `ListToolsUseCase`, `UpdateWorkflowUseCase`, etc.) operate purely on DTOs and domain models.
- **Port Interfaces** (`src/core/ports/`, `src/modules/*/ports/`):
  - `ResourceRepository`, `PromptRepository`, `ToolRepository`, `WorkflowRepository` define plain asynchronous TypeScript interfaces.
- **HTTP Routing & API Handlers** (`src/adapters/http/router.ts`):
  - Uses standard Web Platform `Request` and `Response`.
  - Injected with `RouterDependencies` interface (ports only).
  - Contains no references to Cloudflare `Env`, `D1`, or Workers.
- **Client Web Assets** (`public/`):
  - Pure Vanilla HTML, CSS, JavaScript using browser Web APIs and relative `/api/...` calls. Zero hardcoded endpoints.

### Platform-Specific Components (Cloudflare-Targeted)
These components isolate Cloudflare platform features:

- **Composition Root & Bindings** (`src/platform/cloudflare/`):
  - `env.ts`: Defines Cloudflare `Env` (`DB: D1Database`, `ASSETS: Fetcher`).
  - `bootstrap.ts`: Instantiates D1 repositories from `env.DB` and provides `createCloudflareDependencies(env)`.
- **D1 Persistence Adapters** (`src/adapters/persistence/d1/`):
  - `D1PromptRepository.ts`, `D1ToolRepository.ts`, `D1WorkflowRepository.ts`, `D1ResourceRepository.ts`, `D1HealthCheck.ts`.
  - Contain D1-specific execution patterns (`db.batch()`, `stmt.bind()`).
- **Worker Entrypoint** (`src/index.ts`):
  - Default Cloudflare Worker `export default { async fetch(request, env, ctx) }`.
- **Infrastructure Configuration**:
  - `wrangler.toml`: Worker name, D1 database binding, static asset directory.

---

## 2. Target VPS Architecture (Future Node.js + SQLite)

When migrating or running Pilot on a Linux VPS:

| Responsibility | Cloudflare (Current) | Linux VPS (Target) |
|---|---|---|
| **Runtime** | Cloudflare Workers (V8 workerd) | Node.js (v20+ / v22+ LTS) |
| **HTTP Server** | Worker `fetch` handler | Fastify or Node `node:http` wrapping standard Web `Request`/`Response` |
| **Database** | Cloudflare D1 (SQLite-compatible) | SQLite (`better-sqlite3` or `node:sqlite`) |
| **Static Assets** | Workers Static Assets (`env.ASSETS`) | Caddy / Nginx or Fastify `@fastify/static` |
| **Configuration** | `wrangler.toml` + Cloudflare Dashboard | Environment variables (`process.env` / `.env`) |
| **Process Manager**| Cloudflare Edge | Systemd / Docker / PM2 |

---

## 3. How to Implement Outside Cloudflare (Zero Domain Changes)

To run Pilot on a VPS:

1. **Keep Unchanged**:
   - `src/core/` (100% unchanged)
   - `src/modules/` (100% unchanged)
   - `src/adapters/http/router.ts` (100% unchanged)
   - `public/` (100% unchanged)
   - `migrations/` (100% unchanged — standard SQLite DDL and FTS5)

2. **Implement VPS Adapters**:
   - Create SQLite repositories in `src/adapters/persistence/sqlite/` implementing the existing ports (`PromptRepository`, `ToolRepository`, `WorkflowRepository`, `ResourceRepository`).
   - Create a Node entry point (e.g. `src/platform/node/server.ts`):
     ```typescript
     import { createServer } from 'node:http';
     import Database from 'better-sqlite3';
     import { handleRequest } from '../../adapters/http/router';
     import { SqlitePromptRepository } from '../../adapters/persistence/sqlite/SqlitePromptRepository';
     // ... instantiate repositories and invoke handleRequest(webRequest, deps)
     ```

3. **Deploy with Caddy or Nginx**:
   - Configure Caddy / Nginx to serve `public/` directly for static files and proxy `/api/*` to the Node process on `localhost:3000`.

---

## 4. Known Portability Gaps & Mitigations

1. **D1 SQLite vs Standard SQLite**:
   - *Status*: D1 is built on SQLite 3. All schema migrations (`0001` through `0004`) use standard SQLite syntax: `CREATE TABLE`, `FOREIGN KEY`, `ON DELETE CASCADE`, `CREATE VIRTUAL TABLE USING fts5`, and standard SQLite triggers (`AFTER INSERT`, `AFTER UPDATE`, `AFTER DELETE`).
   - *Mitigation*: Migrations run directly on any SQLite 3.x engine with FTS5 enabled.
2. **Cloudflare `fetch()` SSRF & DNS**:
   - *Status*: The Tools module URL metadata fetcher uses global `fetch()`. On Cloudflare, public internet fetch is automatic.
   - *Mitigation*: `src/modules/tools/domain/Tool.ts` includes `isPrivateOrBlockedHost()` which prevents SSRF to `localhost`, `127.0.0.1`, `10.*`, `192.168.*`, `169.254.*` on any platform.
3. **Web Platform APIs**:
   - *Status*: Node.js 18+ provides global `Request`, `Response`, `Headers`, `fetch`, `URL`, `crypto.randomUUID()`.
   - *Mitigation*: No polyfills or shims required.

---

## 5. Architectural Guardrails

Portability is verified continuously in the test suite (`tests/portability.test.mjs`):
- **Core & Modules Guard**: Asserts zero imports of `@cloudflare/*`, `cloudflare:*`, `wrangler`, `D1Database`, `ExecutionContext`, `KVNamespace`, `R2Bucket`, `DurableObject` in `src/core/` and `src/modules/`.
- **HTTP Router Guard**: Asserts that `src/adapters/http/router.ts` does not import `Env`, `D1Database`, or D1 repository implementations.
- **Ports Guard**: Asserts that all repository port definitions remain strictly platform-agnostic.

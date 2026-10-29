# 32 — Engineering Constitution & Architecture Rules

## Preamble
This Constitution defines the immutable engineering laws governing the Pilot codebase. Any pull request or automated code generation violating these rules must be rejected by automated CI guards and human reviewers.

---

## Article I: The Modular Monolith & Portability
1. **Unified Deployment:** Pilot remains a single deployable Worker and one relational D1 database. No microservices, background queues, or separate workers may be introduced without written architectural justification.
2. **Platform Invariance:** All code under `src/core/` and `src/modules/` must be 100% free of Cloudflare-specific APIs, types, or bindings (`Env`, `D1Database`, `ASSETS`, `ExecutionContext`, `KVNamespace`, `R2Bucket`).
3. **Automated Enforcement:** The architectural fitness test (`tests/portability.test.mjs`) is an immutable CI gate. If a Cloudflare import leaks into core or modules, the build fails.

---

## Article II: Data Integrity & Persistence
1. **Migration Primacy:** All database changes must be written as sequential, numbered SQL migrations in `migrations/` and applied exclusively through `wrangler d1 migrations apply`. Ad-hoc SQL execution scripts are strictly forbidden.
2. **Module-Owned Tables:** Domain data specific to a resource type lives in dedicated module tables (`prompts`, `tools`, `workflows`, `agents`) referencing `resources.id`. Monolithic nullable columns on `resources` are prohibited.
3. **Graph Relationships:** Cross-module references must use `resource_relationships` (`USES`, `FOLLOWS`, `REFERENCES`, `ASSIGNS_TO`) rather than hardcoded foreign key columns between domain tables.

---

## Article III: Security & Boundary Defense
1. **No Unauthenticated Mutating Routes:** All `POST`, `PUT`, `PATCH`, and `DELETE` HTTP endpoints require cryptographically verified curator authorization.
2. **No Hardcoded Credentials:** Never store fallback passwords, tokens, or encryption keys in source code. If a required secret is missing from environment bindings, fail closed with an explicit configuration error.
3. **Constant-Time Comparison:** All authentication tokens and signatures must be evaluated using `crypto.timingSafeEqual`.
4. **Outbound Request Defense:** All outbound `fetch` calls to user-supplied URLs must enforce private IP blocking (`isPrivateOrBlockedHost`), disable automatic redirect following (`redirect: 'manual'`), and enforce request timeouts (`AbortSignal.timeout`).

---

## Article IV: Frontend Simplicity & Performance
1. **Zero Framework Bloat:** The frontend remains vanilla HTML, CSS, and modern browser Web APIs. Do not introduce React, Vue, Angular, or heavy UI frameworks without demonstrating clear, interactive requirements that standard Web Components or ES modules cannot satisfy.
2. **Content Sanitization:** All dynamic user inputs or external catalog data rendered into DOM trees must be escaped through `escapeHtml()` or inserted via `textContent`.

---

## Article V: Quality & Observability Gates
1. **Zero TypeScript Errors:** `npm run typecheck` (`tsc --noEmit`) must pass with zero warnings or errors on every commit.
2. **Traceability:** Every HTTP response must carry a unique correlation identifier (`cf-ray` or UUID) for production log correlation.

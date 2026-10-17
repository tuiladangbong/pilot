# Pilot Architecture

## Pilot: Personal Extensible AI Resource Hub

Pilot is designed from the beginning as a personal, extensible **AI Resource Hub**. It serves as an operating library for organizing, searching, connecting, and reusing useful AI-related resources.

**Prompts** is the first fully functional resource module. Pilot is explicitly **not** a prompt vault with random features bolted on; it is a modular platform where new resource types can be added without rewriting the existing application.

## Architectural Style: Modular Monolith + Hexagonal Architecture

Pilot operates as a **Modular Monolith** combined with pragmatic **Hexagonal Architecture** (Ports & Adapters):

```text
                   ┌───────────────────────────────┐
                   │    HTTP / UI (Static Assets)  │
                   └───────────────┬───────────────┘
                                   │
                   ┌───────────────▼───────────────┐
                   │    Application Use Cases      │
                   └───────────────┬───────────────┘
                                   │
                   ┌───────────────▼───────────────┐
                   │         Domain Layer          │
                   └───────────────┬───────────────┘
                                   │ (Ports)
                   ┌───────────────▼───────────────┐
                   │    Adapters (D1 Database)     │
                   └───────────────────────────────┘
```

### Dependency Direction

```text
HTTP Router / Static Frontend
             ↓
Application Use Cases & DTOs
             ↓
        Domain Layer
             ↑
      Persistence Ports
             ↑
   D1 Infrastructure Adapters
```

- **Domain Independence**: Pure domain entities in `src/core/domain/` and `src/modules/*/domain/` contain no Cloudflare or database imports.
- **Ports & Adapters**: Application use cases interact exclusively with ports (`ResourceRepository`, `PromptRepository`). D1 SQL statements live strictly inside `src/adapters/persistence/d1/`.
- **Module Ownership**: Each module owns its domain models, application use cases, and dedicated database tables.
- **Shared Core Minimality**: `src/core/domain/Resource.ts` contains only truly universal attributes: `id`, `type`, `title`, `description`, `createdAt`, `updatedAt`.

## Implemented Structure

```text
src/
├── core/
│   ├── domain/
│   │   └── Resource.ts            # Universal Resource entity
│   ├── ports/
│   │   └── ResourceRepository.ts  # Generic persistence port
│   └── application/
│       └── ResourceDto.ts         # Generic resource DTOs
│
├── modules/
│   ├── prompts/
│   │   ├── domain/
│   │   │   └── Prompt.ts          # Prompt entity, validation, tag normalization
│   │   ├── ports/
│   │   │   └── PromptRepository.ts# Prompt module persistence port
│   │   └── application/
│   │       ├── CreatePromptUseCase.ts
│   │       ├── GetPromptUseCase.ts
│   │       ├── ListPromptsUseCase.ts
│   │       ├── UpdatePromptUseCase.ts
│   │       ├── DeletePromptUseCase.ts
│   │       ├── DuplicatePromptUseCase.ts
│   │       ├── TogglePromptFavoriteUseCase.ts
│   │       └── PromptDto.ts
│   │
│   ├── tools/
│   │   ├── domain/
│   │   │   └── Tool.ts            # Tool/Website entity, URL normalization, metadata
│   │   ├── ports/
│   │   │   └── ToolRepository.ts  # Tool module persistence port
│   │   └── application/           # CRUD, duplicate, favorite, fetch-metadata use cases
│   │
│   └── workflows/
│       ├── domain/
│       │   └── Workflow.ts        # Workflow & Step entities, difficulty, status, links
│       ├── ports/
│       │   └── WorkflowRepository.ts # Workflow persistence port
│       └── application/           # CRUD, duplicate, favorite use cases & DTOs
│
├── adapters/
│   ├── http/
│   │   └── router.ts              # RESTful HTTP API & static fallback (Platform-independent)
│   └── persistence/
│       └── d1/
│           ├── D1PromptRepository.ts    # D1 SQL & FTS5 search
│           ├── D1ToolRepository.ts      # D1 SQL & tools FTS5 search
│           ├── D1WorkflowRepository.ts  # D1 SQL, steps, relationships, workflows FTS5
│           ├── D1ResourceRepository.ts  # Universal cross-module resource queries
│           └── D1HealthCheck.ts         # Database connectivity probe
│
├── platform/
│   └── cloudflare/
│       ├── env.ts                 # Worker bindings (DB, ASSETS)
│       └── bootstrap.ts           # Cloudflare composition root (RouterDependencies)
│
└── index.ts                       # Cloudflare Worker entry point
```

## Platform Portability

Pilot is architected so that Cloudflare is treated as a deployment target, not as the application architecture. Domain models, application use cases, and HTTP routing are strictly decoupled from Cloudflare bindings:

```text
                   Pilot Domain
                        │
                        ▼
                 Application Layer
                        │
                 Repository Ports
                        │
        ┌───────────────┴───────────────┐
        │                               │
 Cloudflare Adapters              Future VPS Adapters
        │                               │
 Workers HTTP / ASSETS             Node.js / Fastify / Native
 D1 SQLite Persistence             better-sqlite3 / node:sqlite
        │                               │
        └───────────────┬───────────────┘
                        │
                Decoupled Router
           (src/adapters/http/router.ts)
```

- **Router Independence**: `handleRequest(request, deps)` depends exclusively on the `RouterDependencies` interface, which wraps repository ports.
- **Persistence Decoupling**: SQL operations are isolated inside persistence adapters (`src/adapters/persistence/d1/`). SQLite FTS5 migrations run on standard SQLite 3.
- **Portability Verification**: Architectural guards in `tests/portability.test.mjs` verify zero Cloudflare dependencies in `src/core/`, `src/modules/`, and `src/adapters/http/router.ts`.
- See [portability.md](file:///c:/Users/dangbong/Documents/Projects/Nodbits%20PILOT/docs/portability.md) for full deployment migration guidelines.

## Database Schema & Migrations

D1 relational tables are structured to avoid nullable-column bloat:

```text
resources (Universal Metadata)
    ▲
    ├── prompts (Module-owned table referencing resources.id)
    ├── tools (Module-owned table referencing resources.id)
    ├── workflows (Module-owned table referencing resources.id)
    │     ▲
    │     └── workflow_steps (Ordered steps referencing workflows.id)
    │           ▲
    └── resource_relationships (Links workflows/steps to target resources: prompts, tools, websites)

tags (Universal Taxonomy)
    ▲
    └── resource_tags (Many-to-Many Join with resources.id)
```

### Migrations
1. `0001_initial.sql`: Core `resources`, `tags`, `resource_tags`, and initial `prompts` tables.
2. `0002_prompt_module.sql`: Full-Text Search (`prompts_fts` using SQLite FTS5) with automated trigger synchronization.
3. `0003_tools.sql`: `tools` table and `tools_fts` with automated trigger synchronization.
4. `0004_workflows.sql`: `workflows`, `workflow_steps`, `resource_relationships`, and `workflows_fts` with automated trigger synchronization.

## How to Add a Future Resource Module

When introducing a new resource type (e.g., `agents` or `collections`):

1. **Add Module Folder**: Create `src/modules/<module-name>/` with its own `domain/`, `ports/`, and `application/`.
2. **Define Database Table**: Add a numbered migration (e.g. `0005_<module-name>.sql`) creating `<module-name>` with a foreign key to `resources(id) ON DELETE CASCADE`.
3. **Implement Adapter**: Create `D1<Module>Repository.ts` in `src/adapters/persistence/d1/` implementing `<Module>Repository`.
4. **Expose HTTP Endpoints**: Wire REST routes under `/api/<module-name>` in `src/adapters/http/router.ts`.
5. **No Cross-Module Coupling**: Existing module internals are never modified or coupled to other resource modules. Cross-resource connections happen via `resource_relationships`.


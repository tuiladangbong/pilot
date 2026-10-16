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
│   └── prompts/
│       ├── domain/
│       │   └── Prompt.ts          # Prompt entity, validation, tag normalization
│       ├── ports/
│       │   └── PromptRepository.ts# Prompt module persistence port
│       └── application/
│           ├── CreatePromptUseCase.ts
│           ├── GetPromptUseCase.ts
│           ├── ListPromptsUseCase.ts
│           ├── UpdatePromptUseCase.ts
│           ├── DeletePromptUseCase.ts
│           ├── DuplicatePromptUseCase.ts
│           ├── TogglePromptFavoriteUseCase.ts
│           └── PromptDto.ts
│
├── adapters/
│   ├── http/
│   │   └── router.ts              # RESTful HTTP API & static fallback
│   └── persistence/
│       └── d1/
│           ├── D1PromptRepository.ts    # D1 SQL, FTS5 search & batch transactions
│           ├── D1ResourceRepository.ts  # Universal resource persistence
│           └── D1HealthCheck.ts         # Database connectivity probe
│
├── platform/
│   └── cloudflare/
│       └── env.ts                 # Worker bindings (DB, ASSETS)
│
└── index.ts                       # Cloudflare Worker entry point
```

## Database Schema & Migrations

D1 relational tables are structured to avoid nullable-column bloat:

```text
resources (Universal Metadata)
    ▲
    ├── prompts (Module-owned table referencing resources.id)
    ├── [future: tools]
    ├── [future: workflows]
    └── [future: articles]

tags (Universal Taxonomy)
    ▲
    └── resource_tags (Many-to-Many Join with resources.id)
```

### Migrations
1. `0001_initial.sql`: Core `resources`, `tags`, `resource_tags`, and initial `prompts` tables.
2. `0002_prompt_module.sql`: Full-Text Search (`prompts_fts` using SQLite FTS5) with automated trigger synchronization across insert, update, and delete.

## How to Add a Future Resource Module

When introducing a new resource type (e.g., `tools` or `workflows`):

1. **Add Module Folder**: Create `src/modules/<module-name>/` with its own `domain/`, `ports/`, and `application/`.
2. **Define Database Table**: Add a numbered migration (e.g. `0003_tools_module.sql`) creating `<module-name>` with a foreign key to `resources(id) ON DELETE CASCADE`.
3. **Implement Adapter**: Create `D1<Module>Repository.ts` in `src/adapters/persistence/d1/` implementing `<Module>Repository`.
4. **Expose HTTP Endpoints**: Wire REST routes under `/api/<module-name>` in `src/adapters/http/router.ts`.
5. **No Changes to Prompts**: The `prompts` module internals are never modified or coupled to other resource modules.

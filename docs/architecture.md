# Pilot Architecture

## Pilot

Pilot is an extensible **AI Resource Hub**. Its purpose is to collect, organize, search, connect, and reuse useful AI-related resources.

Prompts are the first resource module, but Pilot is not designed as a prompt-only vault. Pilot is architected from day one as a modular resource platform.

## Architecture Style

Pilot uses a **Modular Monolith** combined with **Hexagonal Architecture** (Ports and Adapters).

- **Modular Monolith**: One deployable Cloudflare Worker application, one D1 database, and clear logical module boundaries. Modules communicate via explicit application and domain APIs rather than cross-importing internal implementation files.
- **Hexagonal Architecture**: Clear inward-pointing dependency directions decoupling business logic from Cloudflare runtime specifics and database engines.

```text
                   ┌─────────────────┐
                   │   HTTP / UI     │
                   └────────┬────────┘
                            │
                   ┌────────▼────────┐
                   │   Application   │
                   └────────┬────────┘
                            │
                   ┌────────▼────────┐
                   │     Domain      │
                   └────────┬────────┘
                            │ Ports
                   ┌────────▼────────┐
                   │    Adapters     │
                   │      D1         │
                   └─────────────────┘
```

## Dependency Direction

```text
Cloudflare Worker HTTP
        ↓
Application Use Cases / DTOs
        ↓
Domain
        ↑
Persistence Ports
        ↑
D1 Adapters
```

## Core Architectural Rules

1. **Domain code does not depend on Cloudflare**: Pure TypeScript in `src/core/domain/` and `src/modules/*/domain/` with zero imports of Cloudflare Workers APIs.
2. **Application use cases depend on ports**: Application services interact with repositories through abstract ports.
3. **Infrastructure implements ports**: Persistence adapters (`src/adapters/persistence/d1/`) implement ports defined in core and modules.
4. **Modules own their domain logic and module-specific persistence**: The `prompts` module owns prompt domain concepts and the `prompts` D1 table schema.
5. **Shared Core contains only genuinely shared concepts**: The generic `Resource` entity contains only universal properties (`id`, `type`, `title`, `description`, `createdAt`, `updatedAt`). Never place module-specific fields (e.g. prompt text, model parameters, API keys, workflow steps) into the shared core.
6. **Modules must not import another module's internal implementation**: Cross-module communication must use published public APIs/DTOs.
7. **D1 SQL stays inside persistence adapters**: No SQL queries in domain or application layers.
8. **Cloudflare APIs stay in platform/adapters**: Worker bindings (`env.DB`, `env.ASSETS`) are encapsulated at the entry point and adapters.
9. **New modules should be addable without restructuring existing modules**: Adding `tools`, `workflows`, or `agents` requires only adding a new folder under `src/modules/<name>/` and its corresponding migration.
10. **Avoid abstractions until at least two concrete use cases justify them**: Pragmatic hexagonal architecture without ceremony (e.g. no fake clock ports, identity generator ports, or premature DI frameworks).

## Conceptual Domain Model

Pilot is centered around the concept of a **Resource**:

```text
Resource (Core)
  ├── Prompts (First established module)
  ├── AI Tools (Future module)
  ├── Workflows (Future module)
  ├── Agents (Future module)
  ├── Models (Future module)
  ├── Articles & References (Future module)
  ├── Snippets & Recipes (Future module)
  └── Collections (Future module)
```

### Relational Database Philosophy

D1 acts as the single relational database. The schema is organized to prevent nullable column bloat:

- `resources`: Universally shared metadata table (`id`, `type`, `title`, `description`, `created_at`, `updated_at`).
- `tags` and `resource_tags`: Universal categorization join table.
- `<module>` tables (e.g., `prompts`): Module-owned tables holding module-specific details, referencing `resources.id` via foreign key with `ON DELETE CASCADE`.

## Future Modules Roadmap

The following conceptual modules will fit into Pilot:

- **core**: Universal Resource entity, tagging, base repository ports.
- **prompts**: Prompt templates, variables, model targeting, versions (currently established).
- **tools**: External AI websites, SaaS tools, web apps, and developer utilities.
- **workflows**: Multi-step AI workflows connecting prompts, tools, and models.
- **collections**: Curated sets of mixed resources (e.g., "Full-stack Coding Stack", "Writing Toolkit").
- **search**: Cross-resource indexing and search querying across prompts, tools, workflows, and articles.
- **relationships**: Typed graphs connecting resources (`USES`, `RELATED_TO`, `ALTERNATIVE_TO`, `WORKS_WITH`, `EXPLAINS`, `DERIVED_FROM`).

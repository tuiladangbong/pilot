# 05 — Modules & Domain Boundaries

## Module Isolation Matrix

| Module | Location | Domain Entities | Data Table | Cross-Module Dependencies | Isolation Quality |
|:---|:---|:---|:---|:---|:---|
| **Core** | `src/core` | `Resource` | `resources`, `tags`, `resource_tags`, `resource_relationships` | Foundation for all modules | **Strict** |
| **Prompts** | `src/modules/prompts` | `Prompt` | `prompts`, `prompts_fts` | Extends `Resource` | **High** (Module-contained) |
| **Tools** | `src/modules/tools` | `Tool` | `tools`, `tools_fts` | Extends `Resource` | **High** (Module-contained) |
| **Workflows** | `src/modules/workflows` | `Workflow`, `WorkflowStep` | `workflows`, `workflow_steps`, `workflow_resources` | Links to `Tool` IDs via join table | **High** (Referential IDs only) |
| **Agents** | `src/modules/agents` | `Agent` | `agents`, `agents_fts` | Links to Prompts/Tools via `resource_relationships` | **High** (Relational graph) |

---

## Domain Boundary Violations & Smells

### 1. `D1ResourceRepository` Multi-Module Query Leakage
In `src/adapters/persistence/d1/D1ResourceRepository.ts`:
- The repository executes a large SQL query that joins `prompts`, `tools`, `workflows`, `workflow_steps`, and `agents` directly to assemble `ResourceWithDetails`.
- **Architectural Risk:** While convenient for polymorphic catalog listing, it means changes to any module's relational schema require modifying the core `D1ResourceRepository.ts` query, creating a subtle coupling at the persistence layer.
- **Remediation:** Keep the generic listing query focused on core `resources` metadata and taxonomy, loading module-specific details on-demand or through specialized view models.

### 2. Router Direct Instantiation of Use Cases
In `src/adapters/http/router.ts`:
- Use cases (e.g. `CreatePromptUseCase`, `ListToolsUseCase`) are instantiated on every request inside `handleRequest()`.
- While lightweight in V8 isolates, standard practice is to instantiate application services in the composition root (`bootstrap.ts`) and inject them into router handlers.

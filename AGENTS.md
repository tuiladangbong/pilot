# AGENTS.md

Instructions and rules for AI agents and developers working on the **Pilot** codebase:

- **Pilot is an AI Resource Hub, not a Prompt-only application**: Treat resources generically at the core.
- **Prompts are one module**: Never assume the entire system revolves exclusively around prompts.
- **Use Modular Monolith architecture**: Keep the application unified within one deployable Worker and one D1 database until explicit technical requirements demand otherwise.
- **Use Hexagonal Architecture pragmatically**: Maintain simple and clear inward dependency directions without unnecessary ceremony or boilerplate.
- **Keep domain logic independent from Cloudflare**: Do not import Cloudflare-specific APIs or bindings into domain code.
- **Keep D1 queries inside infrastructure adapters**: SQL belongs strictly in `src/adapters/persistence/d1/`.
- **Do not import another module's internal implementation**: Cross-module communication occurs only through public application interfaces and DTOs.
- **Shared Core must stay small**: Only truly universal attributes belong in `src/core/domain/Resource.ts`.
- **Prefer module-owned domain concepts**: Domain models specific to a resource type live inside their respective `src/modules/<module>/domain/` directories.
- **Prefer module-owned tables**: Module data lives in dedicated relational tables referencing `resources.id`, not stuffed into nullable columns on `resources`.
- **Do not create giant generic entities**: Avoid catching all possible resource attributes inside one monolithic class or interface.
- **Do not create giant nullable database tables**: Maintain clean relational schemas per module.
- **All database changes require migrations**: Never apply ad-hoc SQL changes directly; write numbered migration files in `migrations/`.
- **Do not introduce microservices**: Avoid distributed architectures, separate workers per module, or complex distributed messaging systems.
- **Do not introduce frontend frameworks without a concrete need**: Use vanilla HTML, CSS, and modern browser Web APIs unless complex interactive client requirements justify a framework.
- **Prefer Web Platform APIs**: Use standard `Request`, `Response`, `URL`, and Fetch API standards.
- **Prefer Cloudflare-native capabilities where appropriate**: Leverage Workers Static Assets, D1, and Cloudflare bindings naturally.
- **Keep dependencies minimal**: Avoid heavy npm dependencies, generic enterprise libraries, and DI containers.
- **Avoid premature abstractions**: Wait until at least two concrete use cases exist before creating abstract layers or helper abstractions.
- **Cloudflare is a deployment platform, not the application architecture**: Keep business logic and application orchestration portable to standard Node.js / Linux environments without rewrite.
- **Keep domain, application, ports, and router free of Cloudflare dependencies**: Cloudflare-specific types and bindings (`Env`, `D1Database`, `ASSETS`, `ExecutionContext`) are restricted exclusively to `src/platform/cloudflare/` and `src/adapters/persistence/d1/`.
- **Router must depend only on RouterDependencies**: `src/adapters/http/router.ts` receives standard Web `Request`/`Response` and repository interfaces via `RouterDependencies`, never instantiating platform-specific repositories directly.
- **Maintain SQLite 3 compatibility across all migrations**: Write migrations in standard SQLite DDL and SQLite FTS5 so schemas migrate seamlessly to standalone SQLite engines (e.g. `better-sqlite3`).
- **Never commit secrets**: Do not commit `.dev.vars`, API tokens, private credentials, or environment files.
- **Run typecheck before committing**: Always run `npm run typecheck` (`tsc --noEmit`) to verify zero TypeScript errors.
- **Verify production after deploy**: Ensure both local and production endpoints respond with 200 OK after deployment.
- **Make focused commits**: Keep commit messages concise, descriptive, and aligned with Conventional Commits.
- **Do not implement unrelated modules during a focused task**: Maintain tight scoping to avoid feature creep.
- **Agents are definitions, not execution runtimes**: An Agent is a reusable knowledge and role specification (identity, role, goal, instructions, input/output contract, runtime, model, autonomy level). Do NOT implement execution daemons, background workers, LLM API calls, or chat history in Pilot.
- **Agents are provider and runtime agnostic**: Treat runtime environments (Claude Code, Antigravity, OpenAI, etc.) and target models as descriptive metadata without vendor lock-in.
- **Connect agents via resource relationships**: Always use `resource_relationships` (`USES`, `FOLLOWS`, `REFERENCES`, `ASSIGNS_TO`) to link agents with Prompts, Tools, Websites, and Workflows rather than denormalizing resource data into the `agents` table.



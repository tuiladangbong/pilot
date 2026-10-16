# Pilot

Pilot is a personal, extensible **AI Resource Hub** built on Cloudflare Workers and D1.

Production: [https://pilot.nodbits.com](https://pilot.nodbits.com)

## Product Definition

Pilot is an operating library for organizing, searching, connecting, and reusing AI-related knowledge and resources.

**Prompts** is the first fully functional resource module. Pilot is designed from the core as a modular resource platform rather than a prompt-only application. Future modules will include:

- Prompts (Implemented in V1)
- AI Tools & Websites (Planned)
- Workflows (Planned)
- Agents (Planned)
- Models & APIs (Planned)
- Coding & Automation Recipes (Planned)
- Articles & Notes (Planned)
- Collections (Planned)

## Architecture

Pilot is built as a **Modular Monolith** using **Hexagonal Architecture** (Ports and Adapters):

```text
HTTP API / Static Assets UI (Vanilla JS, HTML, CSS)
                   ↓
     Application Use Cases & DTOs
                   ↓
              Domain Layer
                   ↑
            Persistence Ports
                   ↑
        Infrastructure Adapters (D1)
```

- **Shared Core** (`src/core`): Minimal generic `Resource` entity (`id`, `type`, `title`, `description`, `createdAt`, `updatedAt`) and universal `ResourceRepository` port.
- **Prompt Module** (`src/modules/prompts`): Prompt domain entity, validation, application use cases (Create, Get, List, Update, Delete, Duplicate, Favorite), and `PromptRepository` port.
- **Infrastructure Adapters** (`src/adapters`): D1 SQL adapters (`D1PromptRepository`, `D1ResourceRepository`, `D1HealthCheck`) with SQLite FTS5 search and transactional batching.
- **HTTP Routing** (`src/adapters/http`): RESTful API endpoints with JSON responses and consistent error envelopes.
- **Frontend Assets** (`public/`): Native Cloudflare Workers Static Assets delivering a responsive, keyboard-friendly vanilla UI.

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Apply Migrations

Locally:
```bash
npm run db:migrate:local
```

Remotely (Production):
```bash
npm run db:migrate:remote
```

### 3. Run Automated Tests

```bash
npm test
```

### 4. Type Check

```bash
npm run typecheck
```

### 5. Local Development Server

```bash
npm run dev
```

### 6. Production Deployment

```bash
npm run deploy
```

## API Reference

### System
- `GET /api/health` - Worker health status
- `GET /api/db-health` - Live D1 connectivity check
- `GET /api/architecture` - Architectural metadata

### Core Resources
- `GET /api/resources` - Universal list of all resources across modules

### Prompts Module
- `GET /api/prompts` - List prompts (supports `q`, `tag`, `model`, `favorite`, `sort`, `order`, `limit`, `offset`)
- `GET /api/prompts/:id` - Get prompt by ID
- `POST /api/prompts` - Create new prompt (`title`, `content`, `model`, `description`, `favorite`, `tags`)
- `PUT /api/prompts/:id` - Update prompt
- `DELETE /api/prompts/:id` - Delete prompt (cascades to prompt table and tag mappings)
- `POST /api/prompts/:id/duplicate` - Duplicate prompt with new ID
- `PATCH /api/prompts/:id/favorite` - Toggle or set favorite state

### Search & Taxonomy
- `GET /api/search?q=:query` - Full-text search across prompt titles, descriptions, and content
- `GET /api/tags` - List all tags with resource count
- `GET /api/models` - List distinct models used across prompts

## Keyboard Shortcuts

- `Cmd/Ctrl + K` - Focus global search
- `Escape` - Close open modal or drawer
- `Cmd/Ctrl + Enter` - Save prompt in form

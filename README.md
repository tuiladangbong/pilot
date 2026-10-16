# Pilot

Pilot is an extensible **AI Resource Hub** built on Cloudflare Workers and D1.

Production: [https://pilot.nodbits.com](https://pilot.nodbits.com)

## Architecture

Pilot is organized as a **Modular Monolith** adhering to **Hexagonal Architecture** (Ports & Adapters):

- **Shared Core** (`src/core`): Minimal generic Resource domain and repository ports.
- **Modules** (`src/modules`): Domain logic and module-specific persistence ports (e.g. `prompts`).
- **Adapters** (`src/adapters`): Infrastructure implementations, including Cloudflare D1 persistence and HTTP routing.
- **Platform** (`src/platform`): Cloudflare environment bindings and runtime integration.
- **Static Assets** (`public/`): Native Workers Static Assets (vanilla HTML, CSS, JavaScript).

For full architectural documentation, refer to [docs/architecture.md](docs/architecture.md) and development rules in [AGENTS.md](AGENTS.md).

## Technology Stack

- **Runtime**: Cloudflare Workers
- **Language**: TypeScript
- **Database**: Cloudflare D1 (`pilot-db`, bound as `DB`)
- **Assets**: Cloudflare Workers Static Assets
- **Deployment**: Wrangler

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Database Migrations

Locally:
```bash
npm run db:migrate:local
```

Remotely (Production):
```bash
npm run db:migrate:remote
```

### 3. Local Development

```bash
npm run dev
```

### 4. Type Checking

```bash
npm run typecheck
```

### 5. Deploy to Cloudflare

```bash
npm run deploy
```

## System Endpoints

- `GET /`: Static frontend / Pilot foundation status
- `GET /api/health`: Worker service health check
- `GET /api/db-health`: D1 database connectivity check
- `GET /api/architecture`: Architectural metadata

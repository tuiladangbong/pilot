# 06 — Domain Model Audit

## Domain Models & Invariants

### 1. Universal Resource (`src/core/domain/Resource.ts`)
- **Properties:** `id`, `type`, `title`, `description`, `slug`, `featured`, `origin`, `favorite`, `tags`, `relationships`, `createdAt`, `updatedAt`.
- **Validation:**
  - `title` non-empty string check.
  - `type` restricted to `'prompt' | 'tool' | 'workflow' | 'agent'`.
  - `slug` formatted with lowercase alphanumeric and hyphens.
  - `origin` restricted to `'curated' | 'community' | 'official' | 'system'`.
- **Finding:** Domain entity correctly preserves immutability via `readonly` properties and functional updater functions (`updateResource`).

### 2. Tools Module Domain (`src/modules/tools/domain/Tool.ts`)
- **Properties:** Extends `Resource` with `url`, `hostname`, `kind` (`'tool' | 'website'`), `category`, `pricing` (`'free' | 'freemium' | 'paid' | 'open_source'`), `notes`, `verifiedAt`.
- **Validation:**
  - `url` validated using standard `new URL(rawUrl)`. Protocols restricted to `http:` or `https:`.
  - `hostname` automatically extracted from validated URL.
  - `isPrivateOrBlockedHost(hostname)` provides initial protection against private IP ranges (`127.0.0.1`, `10.x.x.x`, `192.168.x.x`, `169.254.x.x`).

### 3. Workflows Module Domain (`src/modules/workflows/domain/Workflow.ts`)
- **Properties:** Extends `Resource` with `purpose`, `status` (`'draft' | 'active' | 'archived'`), `difficulty` (`'beginner' | 'intermediate' | 'advanced'`), `estimatedTime`, `notes`, `steps`.
- **Invariants:**
  - `WorkflowStep` has required `stepOrder`, `title`, `instruction`.
  - `createWorkflow` sorts steps by `stepOrder` ascending and normalizes index numbers `1..N`.

### 4. Agents Module Domain (`src/modules/agents/domain/Agent.ts`)
- **Properties:** Extends `Resource` with `role`, `goal`, `instructions`, `runtime`, `model`, `status`, `autonomyLevel` (`'manual' | 'assisted' | 'autonomous'`), `inputDescription`, `outputDescription`, `notes`.
- **Finding:** Strictly adheres to `AGENTS.md` directive ("Agents are definitions, not execution runtimes"). Contains zero execution loops or LLM API calls.

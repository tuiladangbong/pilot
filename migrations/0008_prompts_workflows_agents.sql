-- Migration: 0008_prompts_workflows_agents.sql
-- Description: Curate authentic, production-grade System Prompts, AI Workflows (with tool linkages), and Agent Blueprints.

-- ==========================================================================
-- 1. SYSTEM PROMPTS (10 Production Items)
-- ==========================================================================
-- Prompt: Anthropic Metaprompt: Production System Prompt Generator
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('631656c3-69e7-496e-a06d-53fd54554566', 'prompt', 'Anthropic Metaprompt: Production System Prompt Generator', 'The official system prompt engineering template developed by Anthropic to construct rigorous, well-scoped prompts with scratchpad and instructions.', 'anthropic-metaprompt', 1, 'curated', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z');
INSERT OR IGNORE INTO prompts (resource_id, content, model, favorite)
SELECT id, 'Today you will be writing a production-grade system prompt for an AI assistant. The prompt should be comprehensive, deterministic, and eliminate ambiguity.

To write the system prompt, follow these instructions:
1. Identify the core task, role, persona, and constraints of the assistant.
2. Structure the prompt cleanly into semantic XML tags:
   - <role>: Define who the assistant is and its operational philosophy.
   - <context>: Define background information, target audience, and environment assumptions.
   - <instructions>: List step-by-step behavioral directives, edge-case handling, and rules.
   - <scratchpad>: Mandate a private thinking step before producing the final response to reason through edge cases.
   - <output_format>: Specify the exact output schema, tone, language, and formatting requirements.
   - <examples>: Provide concrete few-shot examples illustrating correct vs incorrect behavior.
3. Negative constraints: Explicitly declare what the assistant must NEVER do (e.g. hallucinating missing fields, apologizing excessively, executing unvalidated code).
4. Fallback behavior: Specify exact phrasing when inputs are underspecified or out-of-scope.

Produce only the final system prompt wrapped in a clean, reusable markdown block.', 'Claude 3.7 Sonnet', 0 FROM resources WHERE slug = 'anthropic-metaprompt';
INSERT OR IGNORE INTO tags (id, name) VALUES ('5142cbc4-e175-4a75-a0df-a546cc2c46a5', 'anthropic');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'anthropic-metaprompt' AND t.name = 'anthropic';
INSERT OR IGNORE INTO tags (id, name) VALUES ('9231443e-b079-4b8c-854b-6753271b18a3', 'prompt-engineering');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'anthropic-metaprompt' AND t.name = 'prompt-engineering';
INSERT OR IGNORE INTO tags (id, name) VALUES ('3637db4d-f691-461c-952e-70ec3def3a20', 'system-prompt');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'anthropic-metaprompt' AND t.name = 'system-prompt';
INSERT OR IGNORE INTO tags (id, name) VALUES ('8d610e56-f422-4f49-9325-d7257699ba38', 'metaprompt');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'anthropic-metaprompt' AND t.name = 'metaprompt';

-- Prompt: Next.js 15 App Router & React 19 Strict Cursor Rules
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('5adca4e7-780f-48ed-860a-8865c7a5c177', 'prompt', 'Next.js 15 App Router & React 19 Strict Cursor Rules', 'Production-ready .cursorrules configuration enforcing Server Components by default, Server Actions with Zod validation, and zero any types.', 'nextjs-react19-cursorrules', 1, 'curated', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z');
INSERT OR IGNORE INTO prompts (resource_id, content, model, favorite)
SELECT id, 'You are an expert Next.js 15, React 19, TypeScript, and Tailwind CSS engineer.

Core Architecture Principles:
- Treat all components in app/ as Server Components by default. Only add ''use client'' when explicitly requiring useState, useEffect, browser APIs, or client-side interactivity.
- Push ''use client'' boundaries as deep down the component tree as possible (leaf components).
- Never use React.FC or React.ReactNode as an import when modern React 19 primitives suffice.
- Strict TypeScript: No ''any'', no ''unknown'' casts without immediate type guards. Enable verbatimModuleSyntax.

Data Fetching & Mutations:
- Fetch data directly in Server Components using async/await with native fetch or DB calls.
- Use Next.js 15 cacheLife and cacheTag where appropriate; avoid legacy revalidate options.
- Handle mutations strictly via Server Actions in actions/ or collocated action.ts files.
- Always validate Server Action inputs using Zod schemas before database queries.
- Return structured { success: true, data } or { success: false, error: string } from all Server Actions.

Styling & UI Components:
- Use modern Tailwind CSS utility classes with clsx and tailwind-merge (cn() helper).
- Ensure all interactive elements have visible focus rings (:focus-visible), proper ARIA tags, and keyboard support.
- Icons: Use lucide-react exclusively.

Error Handling & State:
- Wrap dynamic data fetches in <Suspense fallback={<Skeleton />}>.
- Use error.tsx boundaries for runtime recovery and not-found.tsx for missing entities.', 'Cursor / Claude 3.7', 0 FROM resources WHERE slug = 'nextjs-react19-cursorrules';
INSERT OR IGNORE INTO tags (id, name) VALUES ('08a99723-f710-4299-9fd0-fb5cc5a8cc4d', 'cursor');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'nextjs-react19-cursorrules' AND t.name = 'cursor';
INSERT OR IGNORE INTO tags (id, name) VALUES ('84b44e6f-d55a-4903-a357-1ad3ffaf4cb7', 'cursorrules');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'nextjs-react19-cursorrules' AND t.name = 'cursorrules';
INSERT OR IGNORE INTO tags (id, name) VALUES ('9cea7c7b-6f5a-4fc1-86ba-ac522b0ab854', 'nextjs');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'nextjs-react19-cursorrules' AND t.name = 'nextjs';
INSERT OR IGNORE INTO tags (id, name) VALUES ('36d7048c-6aca-4b6d-b258-8d86e2e471aa', 'react19');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'nextjs-react19-cursorrules' AND t.name = 'react19';
INSERT OR IGNORE INTO tags (id, name) VALUES ('2dbae3da-b6bb-48c4-bf24-77190bb206d0', 'typescript');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'nextjs-react19-cursorrules' AND t.name = 'typescript';

-- Prompt: Senior Security & OWASP Code Reviewer
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('d6471678-f7de-421e-b0ff-e29adc21d20c', 'prompt', 'Senior Security & OWASP Code Reviewer', 'Penetration tester and AppSec auditor prompt detecting SSRF, SQLi, prototype pollution, secret leakage, and timing attacks.', 'security-owasp-code-reviewer', 1, 'curated', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z');
INSERT OR IGNORE INTO prompts (resource_id, content, model, favorite)
SELECT id, 'You are a Principal Application Security Auditor conducting an adversarial code review against OWASP Top 10 vulnerabilities.

When auditing code diffs, evaluate every line against this security checklist:
1. Server-Side Request Forgery (SSRF):
   - Are outbound network requests (fetch, axios, curl) made with user-controlled URLs?
   - Is there strict protocol validation (only http/https)?
   - Are private IPv4/IPv6 ranges blocked (10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 127.0.0.1, 169.254.169.254, ::1, fc00::/7)?
   - Are DNS rebinding attacks mitigated by resolving DNS before validating the destination IP?

2. Injection & Memory Safety:
   - SQL Injection: Are queries parameterized? Any string concatenation in SQL or ORM raw queries?
   - Command Injection: Are child processes executed with user input without shell escaping?
   - ReDoS: Do regular expressions contain nested quantifiers (e.g. (a+)+) susceptible to catastrophic backtracking?

3. Authentication & Authorization:
   - Are mutations protected by authentication checks?
   - Is Object-Level Authorization (IDOR) verified (can User A edit User B''s resource by guessing the ID)?
   - Are cryptographic token comparisons performed using constant-time algorithms (crypto.timingSafeEqual)?

4. Data Exposure & Secrets:
   - Are API tokens, private keys, or passwords logged or checked into source code?
   - Are sensitive attributes stripped from API JSON responses before returning to clients?

Output Format:
- Severity: CRITICAL | HIGH | MEDIUM | LOW | INFORMATIONAL
- Location: File path and line numbers
- Vulnerability: Clear explanation of the exploit vector
- Recommended Fix: Secure drop-in replacement code snippet.', 'Claude 3.5 Sonnet / GPT-4o', 0 FROM resources WHERE slug = 'security-owasp-code-reviewer';
INSERT OR IGNORE INTO tags (id, name) VALUES ('af8b3202-d6ab-410a-8e6c-9196382eebc1', 'security');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'security-owasp-code-reviewer' AND t.name = 'security';
INSERT OR IGNORE INTO tags (id, name) VALUES ('f62d4378-a977-4034-9dc2-93f8f8eb90bd', 'owasp');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'security-owasp-code-reviewer' AND t.name = 'owasp';
INSERT OR IGNORE INTO tags (id, name) VALUES ('689cdbb6-37b8-456e-acb2-0568c81595be', 'code-review');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'security-owasp-code-reviewer' AND t.name = 'code-review';
INSERT OR IGNORE INTO tags (id, name) VALUES ('8560b650-33c4-4c88-a2a9-aa894bc66799', 'appsec');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'security-owasp-code-reviewer' AND t.name = 'appsec';

-- Prompt: Autonomous Test-Driven Development (TDD) Protocol
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('075ba4bb-8a73-4574-8916-98b5d60542d4', 'prompt', 'Autonomous Test-Driven Development (TDD) Protocol', 'Strict Red-Green-Refactor system prompt requiring failing test suites before any implementation code is authored.', 'autonomous-tdd-protocol', 0, 'curated', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z');
INSERT OR IGNORE INTO prompts (resource_id, content, model, favorite)
SELECT id, 'You are an autonomous Test-Driven Development (TDD) engineer practicing strict Red-Green-Refactor discipline.

Rules of Engagement:
1. RED: Never author production implementation code before authoring a failing automated test that precisely captures the requirement or bug reproduction.
2. VERIFY FAILURE: Run the test suite and confirm that the new test fails for the expected reason (assertion failure or missing symbol), not a syntax or runtime configuration error.
3. GREEN: Write the minimum possible production code required to make the failing test pass. Do not speculate or add premature features.
4. REFACTOR: Once tests are green, refactor the implementation for clarity, performance, and adherence to clean architecture principles without altering external behavior. Re-run tests to confirm 100% pass rate.

Testing Guidelines:
- Write expressive test descriptions following: it(''should <expected behavior> when <condition>'')
- Mock only at external I/O boundaries (HTTP, Database, File System); test domain entities and use cases with real memory objects.
- Keep tests isolated: zero shared mutable state between tests.', 'Claude Code / Cursor', 0 FROM resources WHERE slug = 'autonomous-tdd-protocol';
INSERT OR IGNORE INTO tags (id, name) VALUES ('d8b634ed-8d93-47de-9437-c703cba6cfa4', 'tdd');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'autonomous-tdd-protocol' AND t.name = 'tdd';
INSERT OR IGNORE INTO tags (id, name) VALUES ('de1b0b78-77e2-44ce-9be2-90a2950992be', 'testing');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'autonomous-tdd-protocol' AND t.name = 'testing';
INSERT OR IGNORE INTO tags (id, name) VALUES ('34c24bcd-2006-40a5-9689-9171d992c348', 'vitest');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'autonomous-tdd-protocol' AND t.name = 'vitest';
INSERT OR IGNORE INTO tags (id, name) VALUES ('9e2e95fb-40a7-463d-86b9-9c097e2a8d62', 'unit-testing');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'autonomous-tdd-protocol' AND t.name = 'unit-testing';

-- Prompt: Deterministic JSON & Tool Schema Extractor
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('c091ba0b-59e9-4ecf-8731-7dce52ee1f5b', 'prompt', 'Deterministic JSON & Tool Schema Extractor', 'Zero-shot structured data extraction prompt with strict adherence to JSON schema, null-handling, and fallback error recovery.', 'deterministic-json-schema-extractor', 0, 'curated', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z');
INSERT OR IGNORE INTO prompts (resource_id, content, model, favorite)
SELECT id, 'You are a high-speed, deterministic structured data extraction engine.

Operational Directives:
1. Output ONLY a valid RFC 8259 JSON object. Never include conversational text, markdown fences (```json), explanations, or preambles.
2. Conformance: Follow the provided JSON schema strictly. All required keys must be present.
3. Null Safety & Fallbacks:
   - If an optional field cannot be determined with high confidence from the context, set its value to null.
   - Do not substitute null with empty strings, "N/A", or placeholder text unless explicitly requested by the schema.
4. Dates & Numbers:
   - All timestamps must be formatted in ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ).
   - Numeric quantities must be output as numbers, not formatted currency strings (e.g. 49.99, not "$49.99").
5. Error Payload:
   - If the input text contains no extractable data or is completely unreadable, return:
     {"error": "EXTRACTION_FAILED", "reason": "No relevant entities found in source context"}', 'GPT-4o-mini / Claude 3.5 Haiku', 0 FROM resources WHERE slug = 'deterministic-json-schema-extractor';
INSERT OR IGNORE INTO tags (id, name) VALUES ('6da46521-0a81-4ef8-89cf-2af22275f1e9', 'json');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'deterministic-json-schema-extractor' AND t.name = 'json';
INSERT OR IGNORE INTO tags (id, name) VALUES ('a71a48de-a5f0-4369-82bc-bfcc63118f08', 'schema');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'deterministic-json-schema-extractor' AND t.name = 'schema';
INSERT OR IGNORE INTO tags (id, name) VALUES ('e1c685c5-1a68-4ab4-9208-0445d8122aa6', 'tool-use');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'deterministic-json-schema-extractor' AND t.name = 'tool-use';
INSERT OR IGNORE INTO tags (id, name) VALUES ('ff3fc830-565b-4cdc-bb3c-2a6279a2d63d', 'data-extraction');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'deterministic-json-schema-extractor' AND t.name = 'data-extraction';

-- Prompt: Anti-Hallucination RAG Synthesis & Citation Guard
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('81e58574-2eff-465b-a919-84d74003099b', 'prompt', 'Anti-Hallucination RAG Synthesis & Citation Guard', 'High-fidelity retrieval augmented generation system prompt enforcing strict inline citation tags and verifiable refusals for out-of-corpus queries.', 'anti-hallucination-rag-synthesis', 1, 'curated', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z');
INSERT OR IGNORE INTO prompts (resource_id, content, model, favorite)
SELECT id, 'You are an enterprise retrieval-augmented synthesis agent. Your sole purpose is to provide factual answers strictly substantiated by the provided context.

Operating Constraints:
1. Source Grounding:
   - Every substantive claim, metric, recommendation, or statement you make MUST be directly attributed to one of the provided context documents.
   - Cite your sources inline immediately following each claim using the format: [Doc <id>, §<section>]
   - Do NOT use prior world knowledge to fill in gaps or extrapolate facts that are not present in the context.

2. Refusal Protocol:
   - If the provided context does not contain sufficient factual evidence to answer the user''s question, you must explicitly refuse to speculate.
   - Refusal formula: "Based on the provided documentation, I cannot confirm [topic]. The available context only discusses [brief summary of actual contents]."

3. Conflicting Evidence:
   - If context documents disagree or present conflicting figures, present both perspectives clearly:
     "Document A states [X], whereas Document B indicates [Y]."

4. Tone & Brevity:
   - Respond with objective, precise technical language. Avoid fluff, filler adjectives, or sycophancy.', 'Claude 3.5 Sonnet / GPT-4o', 0 FROM resources WHERE slug = 'anti-hallucination-rag-synthesis';
INSERT OR IGNORE INTO tags (id, name) VALUES ('e276b28c-8e49-48a2-9289-8f6372ddf5de', 'rag');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'anti-hallucination-rag-synthesis' AND t.name = 'rag';
INSERT OR IGNORE INTO tags (id, name) VALUES ('6a513ac9-1f52-4a25-9fe2-37dfddf58b1d', 'hallucination-guard');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'anti-hallucination-rag-synthesis' AND t.name = 'hallucination-guard';
INSERT OR IGNORE INTO tags (id, name) VALUES ('fabe99e8-503d-48ff-bc2d-100975014ba6', 'citations');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'anti-hallucination-rag-synthesis' AND t.name = 'citations';
INSERT OR IGNORE INTO tags (id, name) VALUES ('c861d2e4-692b-4c56-b55d-ec36c521f8ac', 'llmops');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'anti-hallucination-rag-synthesis' AND t.name = 'llmops';

-- Prompt: Hexagonal Architecture & Clean Domain Modeler
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('06e1fd8f-8dfe-4605-b05a-ad916f982757', 'prompt', 'Hexagonal Architecture & Clean Domain Modeler', 'Domain-driven design system prompt enforcing inward dependency rules, platform-agnostic ports, and immutable domain entities.', 'hexagonal-architecture-modeler', 0, 'curated', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z');
INSERT OR IGNORE INTO prompts (resource_id, content, model, favorite)
SELECT id, 'You are a Principal Software Architect specializing in Hexagonal Architecture (Ports and Adapters) and Domain-Driven Design (DDD).

Design Rules:
1. Inward Dependency Direction:
   - Domain Layer (Entities, Value Objects, Domain Events) sits at the core. It has ZERO dependencies on frameworks, databases, or HTTP protocols.
   - Application Layer (Use Cases, DTOs) orchestrates business workflows using abstract Ports.
   - Adapters Layer (HTTP Controllers, D1/Postgres Repositories, Third-party APIs) implements Ports.
   - Outer layers depend on inner layers; inner layers NEVER import outer layers.

2. Domain Entities:
   - Entities must encapsulate their own invariants and validation logic.
   - Disallow public property mutations; expose meaningful domain methods (e.g. order.cancel() instead of order.status = ''cancelled'').
   - Keep entities immutable or self-validating on creation.

3. Ports (Interfaces):
   - Ports must be expressed in domain language (e.g. UserRepository, PaymentGateway), never technology-specific terms (e.g. D1DatabaseClient, StripeSdkClient).
   - Return plain domain models or domain exceptions from repository ports, never raw SQL rows or HTTP error codes.', 'Claude 3.7 Sonnet / DeepSeek R1', 0 FROM resources WHERE slug = 'hexagonal-architecture-modeler';
INSERT OR IGNORE INTO tags (id, name) VALUES ('d9eefd00-f37a-4f12-bfd1-241873fb936b', 'architecture');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'hexagonal-architecture-modeler' AND t.name = 'architecture';
INSERT OR IGNORE INTO tags (id, name) VALUES ('0a23f867-098b-4c97-9e2c-9a739cabb9f0', 'hexagonal');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'hexagonal-architecture-modeler' AND t.name = 'hexagonal';
INSERT OR IGNORE INTO tags (id, name) VALUES ('24a17467-5c9b-4b1f-bb61-c53b374fb601', 'ddd');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'hexagonal-architecture-modeler' AND t.name = 'ddd';
INSERT OR IGNORE INTO tags (id, name) VALUES ('24a96cb5-70ff-4428-b51e-f06e8b69de15', 'clean-code');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'hexagonal-architecture-modeler' AND t.name = 'clean-code';

-- Prompt: Technical Spec & PRD Architect
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('a92457f9-f6d1-4a90-b58e-1f9b83e465fc', 'prompt', 'Technical Spec & PRD Architect', 'Turns ambiguous feature ideas into actionable 1-page PRDs with domain models, API routes, edge cases, and test acceptance criteria.', 'technical-spec-prd-architect', 0, 'curated', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z');
INSERT OR IGNORE INTO prompts (resource_id, content, model, favorite)
SELECT id, 'You are a Staff Technical Product Manager converting ambiguous business ideas into concise, developer-ready Product Requirements Documents (PRDs).

Generate a structured 1-Page Technical Specification following this exact schema:

# [Feature Name] — Technical Specification

## 1. Problem Statement & User Value
- What exact user friction is being solved?
- Measurable success criteria (e.g. reduce checkout drop-off by 15%, sub-50ms API response).

## 2. Non-Goals & Scope Boundaries
- Explicit list of what this implementation will NOT do (preventing feature creep).

## 3. Data Schema & Entities
- New tables, columns, indexes, and relationship cardinality (1:1, 1:N, N:M).

## 4. API & Interface Contracts
- Endpoint, HTTP method, request payload, response schema, and status codes.

## 5. Security & Edge Cases
- Rate limiting, authentication guards, concurrent modification handling, network failure fallback.

## 6. Acceptance Criteria & Test Matrix
- Given / When / Then scenarios covering happy path, validation errors, and boundary limits.', 'Claude 3.7 Sonnet', 0 FROM resources WHERE slug = 'technical-spec-prd-architect';
INSERT OR IGNORE INTO tags (id, name) VALUES ('17fdfb9c-8d86-4f2b-8dcb-a02dc310d825', 'prd');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'technical-spec-prd-architect' AND t.name = 'prd';
INSERT OR IGNORE INTO tags (id, name) VALUES ('5628acdb-e769-44f9-a954-16ed7af909d7', 'product-management');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'technical-spec-prd-architect' AND t.name = 'product-management';
INSERT OR IGNORE INTO tags (id, name) VALUES ('4dbb87eb-2f3f-4bdc-a056-451d7276c78a', 'specs');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'technical-spec-prd-architect' AND t.name = 'specs';
INSERT OR IGNORE INTO tags (id, name) VALUES ('3a0379d3-a0b6-43ce-a572-1cb371ddd7ee', 'architecture');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'technical-spec-prd-architect' AND t.name = 'architecture';

-- Prompt: Production FastAPI & Async Python 3.12 Rules
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('75118777-faeb-472e-b346-7a37a4647a39', 'prompt', 'Production FastAPI & Async Python 3.12 Rules', 'High-performance async Python system prompt featuring Pydantic V2, connection pooling, structlog logging, and OpenTelemetry tracing.', 'fastapi-async-python-rules', 0, 'curated', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z');
INSERT OR IGNORE INTO prompts (resource_id, content, model, favorite)
SELECT id, 'You are an expert Python 3.12+ and FastAPI engineer building mission-critical async microservices.

Core Engineering Standards:
1. Asynchronous I/O:
   - Use async def for all route handlers performing database queries, HTTP requests, or Redis operations.
   - Never run blocking I/O calls (e.g. requests.get, time.sleep) inside an async event loop; use httpx.AsyncClient or run_in_threadpool.

2. Pydantic V2:
   - Use BaseModel with ConfigDict(from_attributes=True, extra=''forbid'') for strict schemas.
   - Use Annotated with Field(...) for runtime parameter validation.
   - Separate Request DTOs from Response DTOs to prevent accidental credential leakage.

3. Lifecycle & Connection Pooling:
   - Manage database connection pools, HTTP clients, and background workers via FastAPI lifespan context managers (asynccontextmanager).
   - Never instantiate a new DB pool or HTTP client per request.

4. Structured Observability:
   - Use structlog for JSON-formatted structured logging with correlation IDs (X-Request-ID).
   - Use OpenTelemetry trace contexts for distributed tracing.', 'GPT-4o / Claude 3.5 Sonnet', 0 FROM resources WHERE slug = 'fastapi-async-python-rules';
INSERT OR IGNORE INTO tags (id, name) VALUES ('231e2a1d-bcdc-4f26-a456-67d81dfb531c', 'python');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'fastapi-async-python-rules' AND t.name = 'python';
INSERT OR IGNORE INTO tags (id, name) VALUES ('09e3ed4a-67db-4879-a24f-1ef02731a42b', 'fastapi');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'fastapi-async-python-rules' AND t.name = 'fastapi';
INSERT OR IGNORE INTO tags (id, name) VALUES ('75556740-f9af-4ec5-81ef-a86b494a3122', 'async');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'fastapi-async-python-rules' AND t.name = 'async';
INSERT OR IGNORE INTO tags (id, name) VALUES ('03503612-9d77-4370-b1d8-393954bd47f9', 'pydantic');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'fastapi-async-python-rules' AND t.name = 'pydantic';

-- Prompt: Accessible Tailwind CSS & Radix Component Builder
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('4af8ccfe-17c7-4c27-9bb4-3298d998d2d0', 'prompt', 'Accessible Tailwind CSS & Radix Component Builder', 'Generates WCAG 2.2 AA compliant, keyboard-navigable UI components with modern Tailwind CSS and full ARIA semantics.', 'accessible-tailwind-radix-builder', 0, 'curated', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z');
INSERT OR IGNORE INTO prompts (resource_id, content, model, favorite)
SELECT id, 'You are a Senior Frontend Accessibility (a11y) and Design Systems Specialist.

When authoring UI components, enforce these criteria:
1. Semantic HTML & ARIA:
   - Use native interactive elements (<button>, <a>, <input>, <dialog>) instead of <div> with onClick.
   - Apply proper ARIA states: aria-expanded, aria-controls, aria-haspopup, role="dialog", aria-modal="true".
   - Connect labels to form inputs via htmlFor and matching id.

2. Keyboard Navigation:
   - Escape key dismisses modals, dropdowns, and flyout menus.
   - Tab and Shift+Tab maintain proper focus trapping inside active modals.
   - Arrow keys navigate between menu items and tab list options.
   - Always ensure a distinct, visible focus ring: focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2.

3. Contrast & Typography:
   - Maintain at least 4.5:1 contrast ratio for normal text and 3:1 for large text / graphical controls under both light and dark modes.
   - Touch targets must measure at least 44x44px on mobile viewports.', 'v0 / Claude 3.7 Sonnet', 0 FROM resources WHERE slug = 'accessible-tailwind-radix-builder';
INSERT OR IGNORE INTO tags (id, name) VALUES ('851c36b3-9ce7-4c39-9720-cbc4b1ea341d', 'tailwind');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'accessible-tailwind-radix-builder' AND t.name = 'tailwind';
INSERT OR IGNORE INTO tags (id, name) VALUES ('b71ca809-9cbb-476a-a296-e22965d7e822', 'radix-ui');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'accessible-tailwind-radix-builder' AND t.name = 'radix-ui';
INSERT OR IGNORE INTO tags (id, name) VALUES ('674675da-ef40-46c6-88b0-83334d42c54c', 'accessibility');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'accessible-tailwind-radix-builder' AND t.name = 'accessibility';
INSERT OR IGNORE INTO tags (id, name) VALUES ('fe4ee7f5-cf0b-4185-b38b-f5faf82f6bc5', 'frontend');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'accessible-tailwind-radix-builder' AND t.name = 'frontend';

-- ==========================================================================
-- 2. AI WORKFLOWS (6 Multi-Step Workflows with Tool USES Relationships)
-- ==========================================================================
-- Workflow: Voice Memo to Shipped Web App in 60 Minutes
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('19a75127-f192-4399-b05b-7b81a2d8521f', 'workflow', 'Voice Memo to Shipped Web App in 60 Minutes', 'Transform a spontaneous audio brain-dump into a deployed full-stack application with database and auth in under an hour.', 'voice-memo-to-shipped-web-app', 1, 'curated', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z');
INSERT OR IGNORE INTO workflows (resource_id, purpose, status, difficulty, estimated_time, notes)
SELECT id, 'Rapidly prototype and ship working software directly from voice dictation without getting stuck in blank-editor paralysis.', 'Active', 'Medium', '45-60 min', 'Ideal for solopreneurs, hackathon teams, and founders capturing spontaneous product insights on the move.' FROM resources WHERE slug = 'voice-memo-to-shipped-web-app';
INSERT OR IGNORE INTO tags (id, name) VALUES ('54ede1a3-0386-4bf7-bad4-5f87af6a36d3', 'voice-to-code');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'voice-memo-to-shipped-web-app' AND t.name = 'voice-to-code';
INSERT OR IGNORE INTO tags (id, name) VALUES ('9b1e4ecd-119d-4d01-ad9f-02b9acf8b596', 'fullstack');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'voice-memo-to-shipped-web-app' AND t.name = 'fullstack';
INSERT OR IGNORE INTO tags (id, name) VALUES ('27e15564-ae70-46ff-8e34-a0a44c1f4495', 'rapid-prototyping');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'voice-memo-to-shipped-web-app' AND t.name = 'rapid-prototyping';
INSERT OR IGNORE INTO tags (id, name) VALUES ('ec8d6f33-6642-4fa6-ba39-17c36b108414', 'solopreneur');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'voice-memo-to-shipped-web-app' AND t.name = 'solopreneur';
-- Step 1: Voice Capture & Instant Transcription
INSERT OR IGNORE INTO workflow_steps (id, workflow_id, position, title, instruction, notes, optional, created_at, updated_at)
SELECT 'b823355a-dbe7-4e29-8f3a-68fc60cff3d8', id, 1, 'Voice Capture & Instant Transcription', 'Record your raw product idea, user flow, and entity thoughts using an offline, high-accuracy speech-to-text tool. Speak freely without worrying about structure.', 'Offline transcription ensures zero latency and total privacy for sensitive startup ideas.', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z' FROM resources WHERE slug = 'voice-memo-to-shipped-web-app';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT '291b0d68-7edd-4c11-85f3-0af7c488bbe9', r_src.id, r_tgt.id, 'USES', 'b823355a-dbe7-4e29-8f3a-68fc60cff3d8', 0, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'voice-memo-to-shipped-web-app' AND r_tgt.slug = 'superwhisper';
-- Step 2: Spec Synthesis & Technical PRD
INSERT OR IGNORE INTO workflow_steps (id, workflow_id, position, title, instruction, notes, optional, created_at, updated_at)
SELECT '7bf4a03d-2151-499e-8796-84da3a095808', id, 2, 'Spec Synthesis & Technical PRD', 'Paste the raw transcript into an advanced LLM using the Technical Spec PRD prompt. Instruct it to generate a 1-page PRD, data schema, and API endpoint list.', 'Review the generated schema for edge cases and non-goals before moving to code generation.', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z' FROM resources WHERE slug = 'voice-memo-to-shipped-web-app';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT '2c0921da-6dee-4cd6-9a7f-58e4458b74d7', r_src.id, r_tgt.id, 'USES', '7bf4a03d-2151-499e-8796-84da3a095808', 0, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'voice-memo-to-shipped-web-app' AND r_tgt.slug = 'claude';
-- Step 3: Full-Stack UI Scaffolding & Component Generation
INSERT OR IGNORE INTO workflow_steps (id, workflow_id, position, title, instruction, notes, optional, created_at, updated_at)
SELECT 'd5aca940-6489-49d2-b019-9fab499f8825', id, 3, 'Full-Stack UI Scaffolding & Component Generation', 'Feed the PRD component specifications into a generative UI builder to generate accessible React components, page layouts, and forms.', 'Export the clean code directly into your local IDE workspace.', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z' FROM resources WHERE slug = 'voice-memo-to-shipped-web-app';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT 'da6bcd1e-1752-4b13-9bec-185f250bc1b4', r_src.id, r_tgt.id, 'USES', 'd5aca940-6489-49d2-b019-9fab499f8825', 0, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'voice-memo-to-shipped-web-app' AND r_tgt.slug = 'v0';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT 'd772260f-25f2-4685-a2c9-5630689485a4', r_src.id, r_tgt.id, 'USES', 'd5aca940-6489-49d2-b019-9fab499f8825', 1, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'voice-memo-to-shipped-web-app' AND r_tgt.slug = 'cursor';
-- Step 4: Backend BaaS & Serverless Deployment
INSERT OR IGNORE INTO workflow_steps (id, workflow_id, position, title, instruction, notes, optional, created_at, updated_at)
SELECT '870d6674-aee5-4c16-b819-58553d908399', id, 4, 'Backend BaaS & Serverless Deployment', 'Run the generated SQL schema migration against your managed Postgres database. Wire up authentication and deploy your frontend to edge infrastructure.', 'Test end-to-end user sign-up and entity creation to verify production readiness.', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z' FROM resources WHERE slug = 'voice-memo-to-shipped-web-app';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT 'f558ac49-c028-4bd5-baf6-1d495416b69b', r_src.id, r_tgt.id, 'USES', '870d6674-aee5-4c16-b819-58553d908399', 0, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'voice-memo-to-shipped-web-app' AND r_tgt.slug = 'supabase';

-- Workflow: Autonomous TDD Feature Delivery via Claude Code
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('ec90f3c0-659f-4649-a490-b0b56264981f', 'workflow', 'Autonomous TDD Feature Delivery via Claude Code', 'Ship robust, production-tested pull requests using AI agent loops with isolated git worktrees and strict Red-Green-Refactor testing.', 'autonomous-tdd-feature-delivery', 1, 'curated', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z');
INSERT OR IGNORE INTO workflows (resource_id, purpose, status, difficulty, estimated_time, notes)
SELECT id, 'Safely delegate complex feature implementation to autonomous agent CLI tools while maintaining 100% test pass rates and zero regressions.', 'Active', 'Advanced', '25 min', 'Using git worktrees prevents agent experiments from clobbering your active development branch.' FROM resources WHERE slug = 'autonomous-tdd-feature-delivery';
INSERT OR IGNORE INTO tags (id, name) VALUES ('eeef958d-d4d4-4f60-8bb7-226a5367c6eb', 'tdd');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'autonomous-tdd-feature-delivery' AND t.name = 'tdd';
INSERT OR IGNORE INTO tags (id, name) VALUES ('45a74ba1-8256-4e5b-879f-bfdc212f4efb', 'claude-code');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'autonomous-tdd-feature-delivery' AND t.name = 'claude-code';
INSERT OR IGNORE INTO tags (id, name) VALUES ('0453ba54-9eda-43e8-aec9-f849e7ba35ef', 'testing');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'autonomous-tdd-feature-delivery' AND t.name = 'testing';
INSERT OR IGNORE INTO tags (id, name) VALUES ('1b0ad88b-7a48-4760-8f6c-77ddb06345a7', 'git-worktrees');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'autonomous-tdd-feature-delivery' AND t.name = 'git-worktrees';
-- Step 1: Isolated Git Worktree Creation
INSERT OR IGNORE INTO workflow_steps (id, workflow_id, position, title, instruction, notes, optional, created_at, updated_at)
SELECT 'df9154c7-d6f6-420c-888f-724bbdda044e', id, 1, 'Isolated Git Worktree Creation', 'Create a clean, isolated git worktree linked to a new feature branch. This ensures your working directory remains untouched during automated agent execution.', 'Run: git worktree add ../feature-worktree -b feat/new-capability', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z' FROM resources WHERE slug = 'autonomous-tdd-feature-delivery';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT '23dd47cb-d42e-4c12-9b9b-b189840d2aad', r_src.id, r_tgt.id, 'USES', 'df9154c7-d6f6-420c-888f-724bbdda044e', 0, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'autonomous-tdd-feature-delivery' AND r_tgt.slug = 'cursor';
-- Step 2: Failing End-to-End Test Suite Authoring
INSERT OR IGNORE INTO workflow_steps (id, workflow_id, position, title, instruction, notes, optional, created_at, updated_at)
SELECT 'b5e8fae4-31fe-4696-951a-ea7626701edd', id, 2, 'Failing End-to-End Test Suite Authoring', 'Provide the task issue and acceptance criteria to the coding agent. Instruct it to write failing integration and unit tests capturing all requirements before writing any code.', 'Confirm tests fail with expected assertion errors rather than compilation issues.', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z' FROM resources WHERE slug = 'autonomous-tdd-feature-delivery';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT '408acb1e-b206-40fa-88bf-dba54157a910', r_src.id, r_tgt.id, 'USES', 'b5e8fae4-31fe-4696-951a-ea7626701edd', 0, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'autonomous-tdd-feature-delivery' AND r_tgt.slug = 'claude-code';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT 'd7dbc82b-7cd6-430d-9178-e6c69d6d37a6', r_src.id, r_tgt.id, 'USES', 'b5e8fae4-31fe-4696-951a-ea7626701edd', 1, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'autonomous-tdd-feature-delivery' AND r_tgt.slug = 'aider';
-- Step 3: Autonomous Implementation & Green Test Loop
INSERT OR IGNORE INTO workflow_steps (id, workflow_id, position, title, instruction, notes, optional, created_at, updated_at)
SELECT '7f4a8794-9e53-45bf-8b49-524ad0f03f5b', id, 3, 'Autonomous Implementation & Green Test Loop', 'Run the agent in iterative loop mode against the local test runner. The agent analyzes failures, adjusts code, and repeats until all test assertions pass.', 'Agent must stop as soon as all tests pass without introducing out-of-scope refactorings.', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z' FROM resources WHERE slug = 'autonomous-tdd-feature-delivery';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT '58986e8c-b736-4f5c-88cc-7098bd1d339d', r_src.id, r_tgt.id, 'USES', '7f4a8794-9e53-45bf-8b49-524ad0f03f5b', 0, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'autonomous-tdd-feature-delivery' AND r_tgt.slug = 'claude-code';
-- Step 4: Security Review & Pull Request Assembly
INSERT OR IGNORE INTO workflow_steps (id, workflow_id, position, title, instruction, notes, optional, created_at, updated_at)
SELECT 'ca2f8e8a-b3a3-4187-913e-4b97eff40131', id, 4, 'Security Review & Pull Request Assembly', 'Run a security and AST audit against the git diff. Format a conventional commit message and open a pull request with an automated summary of changes.', 'Verify zero secrets or unintended file modifications before merging.', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z' FROM resources WHERE slug = 'autonomous-tdd-feature-delivery';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT 'a0552dfe-a29d-43d7-971a-b27097e23a38', r_src.id, r_tgt.id, 'USES', 'ca2f8e8a-b3a3-4187-913e-4b97eff40131', 0, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'autonomous-tdd-feature-delivery' AND r_tgt.slug = 'github-copilot';

-- Workflow: Multimodal Technical Explainer Video Production
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('d584c624-b0fd-4c92-96c2-e5cfd3c1ce51', 'workflow', 'Multimodal Technical Explainer Video Production', 'Produce engaging, high-fidelity technical announcement videos with custom voice narration, motion graphics, and subtitles.', 'multimodal-explainer-video-production', 1, 'curated', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z');
INSERT OR IGNORE INTO workflows (resource_id, purpose, status, difficulty, estimated_time, notes)
SELECT id, 'Deliver high-retention video explainers and product demo reels without cameras, studio microphones, or expensive video editing suites.', 'Active', 'Medium', '90 min', 'Combining dedicated voice synthesis with diffusion b-roll achieves studio-grade production values.' FROM resources WHERE slug = 'multimodal-explainer-video-production';
INSERT OR IGNORE INTO tags (id, name) VALUES ('dfc8dd9d-b9f8-4245-8123-4c74c00adbcd', 'video-generation');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'multimodal-explainer-video-production' AND t.name = 'video-generation';
INSERT OR IGNORE INTO tags (id, name) VALUES ('966bdb84-af04-4018-aa53-c81d7631bf1c', 'multimodal');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'multimodal-explainer-video-production' AND t.name = 'multimodal';
INSERT OR IGNORE INTO tags (id, name) VALUES ('251fae07-3481-4872-98a2-8190c436368e', 'elevenlabs');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'multimodal-explainer-video-production' AND t.name = 'elevenlabs';
INSERT OR IGNORE INTO tags (id, name) VALUES ('d1795d0a-f4e6-4cb7-b9e2-ef0338ea1d93', 'content-creation');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'multimodal-explainer-video-production' AND t.name = 'content-creation';
-- Step 1: Technical Script & Visual Storyboarding
INSERT OR IGNORE INTO workflow_steps (id, workflow_id, position, title, instruction, notes, optional, created_at, updated_at)
SELECT '91d71bad-a16f-47ed-832b-95a16106a42c', id, 1, 'Technical Script & Visual Storyboarding', 'Draft a compelling 90-second technical narrative with timestamped visual descriptions, scene transitions, and callout moments.', 'Keep each scene to 4-7 seconds to maintain high viewer engagement.', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z' FROM resources WHERE slug = 'multimodal-explainer-video-production';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT '6e310876-37bb-4626-96ff-0ed207ddffdf', r_src.id, r_tgt.id, 'USES', '91d71bad-a16f-47ed-832b-95a16106a42c', 0, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'multimodal-explainer-video-production' AND r_tgt.slug = 'claude';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT 'ac006e00-333c-48ea-afa3-fba21fe0a1a3', r_src.id, r_tgt.id, 'USES', '91d71bad-a16f-47ed-832b-95a16106a42c', 1, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'multimodal-explainer-video-production' AND r_tgt.slug = 'chatgpt';
-- Step 2: Voice Synthesis & Emotional Timing
INSERT OR IGNORE INTO workflow_steps (id, workflow_id, position, title, instruction, notes, optional, created_at, updated_at)
SELECT '14b427e7-0a1a-48bf-805f-fe8bb9664f23', id, 2, 'Voice Synthesis & Emotional Timing', 'Generate clear, human-grade voice narration using custom voice models with natural pacing, micro-pauses, and emphasis on key terminology.', 'Export high-resolution uncompressed WAV audio files for timeline alignment.', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z' FROM resources WHERE slug = 'multimodal-explainer-video-production';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT 'a6c2e541-795f-4d2b-b703-4dc01bb437d9', r_src.id, r_tgt.id, 'USES', '14b427e7-0a1a-48bf-805f-fe8bb9664f23', 0, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'multimodal-explainer-video-production' AND r_tgt.slug = 'elevenlabs';
-- Step 3: Cinematic Visuals & Diffusion B-Roll Generation
INSERT OR IGNORE INTO workflow_steps (id, workflow_id, position, title, instruction, notes, optional, created_at, updated_at)
SELECT '960c7f8d-3356-4c0b-9581-25932ba00c49', id, 3, 'Cinematic Visuals & Diffusion B-Roll Generation', 'Prompt state-of-the-art diffusion models for scene visuals, UI hero shots, and abstract 3D motion backgrounds corresponding to each storyboard segment.', 'Maintain consistent color palettes and lighting styles across all generated clips.', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z' FROM resources WHERE slug = 'multimodal-explainer-video-production';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT '1290d9e7-1a69-4a77-9996-f389bc458b8b', r_src.id, r_tgt.id, 'USES', '960c7f8d-3356-4c0b-9581-25932ba00c49', 0, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'multimodal-explainer-video-production' AND r_tgt.slug = 'runway';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT 'db32b6d1-0cc3-4ac6-a33b-2d6e0257bc3a', r_src.id, r_tgt.id, 'USES', '960c7f8d-3356-4c0b-9581-25932ba00c49', 1, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'multimodal-explainer-video-production' AND r_tgt.slug = 'midjourney';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT '7b0c81ff-1bc8-4fea-8c61-2127bfb01785', r_src.id, r_tgt.id, 'USES', '960c7f8d-3356-4c0b-9581-25932ba00c49', 2, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'multimodal-explainer-video-production' AND r_tgt.slug = 'luma-dream-machine';
-- Step 4: Dynamic Captions & Video Assembly
INSERT OR IGNORE INTO workflow_steps (id, workflow_id, position, title, instruction, notes, optional, created_at, updated_at)
SELECT '6e179972-640c-413f-8700-be27e00dbc89', id, 4, 'Dynamic Captions & Video Assembly', 'Import audio narration and video clips into your editor. Auto-generate animated subtitles, balance background sound levels, and export in 4K.', 'Verify subtitle timing and contrast against background footage.', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z' FROM resources WHERE slug = 'multimodal-explainer-video-production';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT '195f202e-0290-4c0e-8c19-a0e687018087', r_src.id, r_tgt.id, 'USES', '6e179972-640c-413f-8700-be27e00dbc89', 0, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'multimodal-explainer-video-production' AND r_tgt.slug = 'descript';

-- Workflow: Enterprise Document Ingestion & High-Precision Hybrid RAG
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('e8db3fef-63a3-4967-96a9-d784615cef84', 'workflow', 'Enterprise Document Ingestion & High-Precision Hybrid RAG', 'Build an enterprise-grade document search and question-answering system combining layout-aware parsing, vector search, and BM25.', 'enterprise-hybrid-rag-pipeline', 1, 'curated', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z');
INSERT OR IGNORE INTO workflows (resource_id, purpose, status, difficulty, estimated_time, notes)
SELECT id, 'Eliminate hallucinations and semantic retrieval misses across complex multi-page PDF contracts, tables, and financial reports.', 'Active', 'Advanced', '2 hours', 'Layout-aware parsing preserves tabular data relationships that naive text extractors destroy.' FROM resources WHERE slug = 'enterprise-hybrid-rag-pipeline';
INSERT OR IGNORE INTO tags (id, name) VALUES ('6cfa4e62-d6c3-4db1-bebe-2b24d5af2359', 'rag');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'enterprise-hybrid-rag-pipeline' AND t.name = 'rag';
INSERT OR IGNORE INTO tags (id, name) VALUES ('324224a1-dd70-4d3c-89d8-19543e530260', 'vector-database');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'enterprise-hybrid-rag-pipeline' AND t.name = 'vector-database';
INSERT OR IGNORE INTO tags (id, name) VALUES ('79b84551-7f8a-41ae-8ece-fdcad1d68c24', 'enterprise-ai');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'enterprise-hybrid-rag-pipeline' AND t.name = 'enterprise-ai';
INSERT OR IGNORE INTO tags (id, name) VALUES ('50ab62a9-de5a-40d3-a68f-b4e729c2abf7', 'llamaparse');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'enterprise-hybrid-rag-pipeline' AND t.name = 'llamaparse';
-- Step 1: Document OCR & Vision-Based Layout Parsing
INSERT OR IGNORE INTO workflow_steps (id, workflow_id, position, title, instruction, notes, optional, created_at, updated_at)
SELECT '624bcfaf-9460-45af-bdf5-36bf19b47acb', id, 1, 'Document OCR & Vision-Based Layout Parsing', 'Parse complex enterprise PDFs containing multi-column text, charts, and embedded tables into clean, structural Markdown with vision-assisted extractors.', 'Tables are converted directly into valid Markdown tables to retain row/column integrity.', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z' FROM resources WHERE slug = 'enterprise-hybrid-rag-pipeline';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT '81982162-a9ce-4ebf-b311-9ad7d5239b9b', r_src.id, r_tgt.id, 'USES', '624bcfaf-9460-45af-bdf5-36bf19b47acb', 0, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'enterprise-hybrid-rag-pipeline' AND r_tgt.slug = 'llamaparse';
-- Step 2: Semantic Chunking & Metadata Enrichment
INSERT OR IGNORE INTO workflow_steps (id, workflow_id, position, title, instruction, notes, optional, created_at, updated_at)
SELECT 'aae7ea70-b338-47f2-a020-8197536d424a', id, 2, 'Semantic Chunking & Metadata Enrichment', 'Split parsed Markdown into hierarchical chunks respecting header boundaries. Attach document metadata (author, date, classification level) to each chunk.', 'Ensure a 10% sliding window overlap between adjacent text blocks.', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z' FROM resources WHERE slug = 'enterprise-hybrid-rag-pipeline';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT '563cbc17-563a-48ef-8845-3cad163c681f', r_src.id, r_tgt.id, 'USES', 'aae7ea70-b338-47f2-a020-8197536d424a', 0, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'enterprise-hybrid-rag-pipeline' AND r_tgt.slug = 'langchain';
-- Step 3: Hybrid Dense & Sparse Vector Storage
INSERT OR IGNORE INTO workflow_steps (id, workflow_id, position, title, instruction, notes, optional, created_at, updated_at)
SELECT 'e06c1868-c714-43c4-ae34-a91bb53735c8', id, 3, 'Hybrid Dense & Sparse Vector Storage', 'Embed chunk texts using state-of-the-art dense embedding models. Ingest vectors into a high-performance database with reciprocal rank fusion (RRF) BM25 keyword matching.', 'Hybrid search catches exact acronyms and IDs that semantic embeddings occasionally miss.', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z' FROM resources WHERE slug = 'enterprise-hybrid-rag-pipeline';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT '0c7d02b1-475d-4f08-87af-99c3cbd0c897', r_src.id, r_tgt.id, 'USES', 'e06c1868-c714-43c4-ae34-a91bb53735c8', 0, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'enterprise-hybrid-rag-pipeline' AND r_tgt.slug = 'qdrant';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT '52950240-d315-4d00-a4d5-23445cf2e3b4', r_src.id, r_tgt.id, 'USES', 'e06c1868-c714-43c4-ae34-a91bb53735c8', 1, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'enterprise-hybrid-rag-pipeline' AND r_tgt.slug = 'pinecone';
-- Step 4: Retrieval Tracing & Faithfulness Evaluation
INSERT OR IGNORE INTO workflow_steps (id, workflow_id, position, title, instruction, notes, optional, created_at, updated_at)
SELECT '04039a1a-f471-4a53-895f-631b93470c47', id, 4, 'Retrieval Tracing & Faithfulness Evaluation', 'Instrument query pipelines with LLMOps observability to monitor retrieval latency, context relevance scores, and synthesis faithfulness.', 'Set up alerting when retrieval relevance scores drop below 0.75.', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z' FROM resources WHERE slug = 'enterprise-hybrid-rag-pipeline';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT 'be6c228a-af18-4198-a546-8df8e8cd8f32', r_src.id, r_tgt.id, 'USES', '04039a1a-f471-4a53-895f-631b93470c47', 0, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'enterprise-hybrid-rag-pipeline' AND r_tgt.slug = 'langfuse';

-- Workflow: Real-Time Competitor Web Intelligence & Pricing Monitor
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('05d944c5-3b54-46c0-8aa7-e62ff46c7c36', 'workflow', 'Real-Time Competitor Web Intelligence & Pricing Monitor', 'Automate competitor tracking, pricing updates, and feature announcements with headless web extraction and schema normalization.', 'real-time-competitor-intelligence', 1, 'curated', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z');
INSERT OR IGNORE INTO workflows (resource_id, purpose, status, difficulty, estimated_time, notes)
SELECT id, 'Gain instant awareness of competitor product launches, tier shifts, and market positioning without manual web browsing.', 'Active', 'Medium', '30 min', 'Headless markdown extractors bypass JavaScript heavy single-page apps seamlessly.' FROM resources WHERE slug = 'real-time-competitor-intelligence';
INSERT OR IGNORE INTO tags (id, name) VALUES ('d58b5ae7-66e2-4425-8161-bbe9450396f0', 'web-scraping');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'real-time-competitor-intelligence' AND t.name = 'web-scraping';
INSERT OR IGNORE INTO tags (id, name) VALUES ('d5364150-57b9-488d-9bb5-65c8590237fa', 'market-intelligence');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'real-time-competitor-intelligence' AND t.name = 'market-intelligence';
INSERT OR IGNORE INTO tags (id, name) VALUES ('95343cfc-0832-48ce-8b0b-0b75789a37ff', 'firecrawl');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'real-time-competitor-intelligence' AND t.name = 'firecrawl';
INSERT OR IGNORE INTO tags (id, name) VALUES ('39501167-9d17-40ac-8057-95a17fc0f9a3', 'automation');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'real-time-competitor-intelligence' AND t.name = 'automation';
-- Step 1: Anti-Bot Web Scraping & Markdown Extraction
INSERT OR IGNORE INTO workflow_steps (id, workflow_id, position, title, instruction, notes, optional, created_at, updated_at)
SELECT '089b1a22-ede0-40ab-a884-c85915105e0c', id, 1, 'Anti-Bot Web Scraping & Markdown Extraction', 'Configure automated scraping jobs against target competitor pricing and documentation pages, extracting raw DOM contents into clean, sanitized Markdown.', 'Proxy rotation handles Cloudflare Turnstile and anti-scraping challenges automatically.', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z' FROM resources WHERE slug = 'real-time-competitor-intelligence';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT '2f0b4192-3fc0-4fca-86e5-410b030592f0', r_src.id, r_tgt.id, 'USES', '089b1a22-ede0-40ab-a884-c85915105e0c', 0, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'real-time-competitor-intelligence' AND r_tgt.slug = 'firecrawl';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT '85009d1f-c3d7-4e4d-a2e9-9bd1266f37ae', r_src.id, r_tgt.id, 'USES', '089b1a22-ede0-40ab-a884-c85915105e0c', 1, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'real-time-competitor-intelligence' AND r_tgt.slug = 'jina-ai';
-- Step 2: Structured Schema Extraction & Normalization
INSERT OR IGNORE INTO workflow_steps (id, workflow_id, position, title, instruction, notes, optional, created_at, updated_at)
SELECT '4d3aca91-1b00-4376-8740-4c30c03cd42a', id, 2, 'Structured Schema Extraction & Normalization', 'Pass extracted Markdown through an LLM extraction prompt to parse pricing tiers, features, limits, and add-ons into a standardized JSON schema.', 'Normalize all currency amounts to USD and billing periods to monthly/annual.', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z' FROM resources WHERE slug = 'real-time-competitor-intelligence';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT '27da2b9b-ff1c-458f-a4e8-fad98a36840b', r_src.id, r_tgt.id, 'USES', '4d3aca91-1b00-4376-8740-4c30c03cd42a', 0, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'real-time-competitor-intelligence' AND r_tgt.slug = 'claude';
-- Step 3: Snapshot Diffing & Historical Vector Storage
INSERT OR IGNORE INTO workflow_steps (id, workflow_id, position, title, instruction, notes, optional, created_at, updated_at)
SELECT '38aa3915-adb6-4c8b-87aa-d0b450b273cd', id, 3, 'Snapshot Diffing & Historical Vector Storage', 'Compare newly extracted records against previous crawl snapshots. Record modifications, deletions, or price increases into a relational database.', 'Store timestamps to track historical pricing trends over quarters.', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z' FROM resources WHERE slug = 'real-time-competitor-intelligence';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT '18059390-d9df-4f00-8d01-30e8cbdf91fe', r_src.id, r_tgt.id, 'USES', '38aa3915-adb6-4c8b-87aa-d0b450b273cd', 0, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'real-time-competitor-intelligence' AND r_tgt.slug = 'supabase';
-- Step 4: Automated Alert Dispatch & Weekly Digest
INSERT OR IGNORE INTO workflow_steps (id, workflow_id, position, title, instruction, notes, optional, created_at, updated_at)
SELECT '1c1c86e7-5bc7-4d34-a845-89e337a9fc59', id, 4, 'Automated Alert Dispatch & Weekly Digest', 'Trigger instant notifications via Slack, email, or webhook whenever pricing changes or new enterprise tiers are detected.', 'Bundle minor copy changes into a weekly executive briefing digest.', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z' FROM resources WHERE slug = 'real-time-competitor-intelligence';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT '8cb7c233-05a7-4149-9453-384b9306ca81', r_src.id, r_tgt.id, 'USES', '1c1c86e7-5bc7-4d34-a845-89e337a9fc59', 0, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'real-time-competitor-intelligence' AND r_tgt.slug = 'make';

-- Workflow: Local-First Knowledge Graph: Web & Audio to Markdown
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('f6e88bcb-bf17-4606-8f86-adedab5a2487', 'workflow', 'Local-First Knowledge Graph: Web & Audio to Markdown', 'Curate a decentralized personal knowledge vault using local LLMs, offline speech-to-text, and bidirectional wikilinks.', 'local-first-knowledge-graph', 1, 'curated', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z');
INSERT OR IGNORE INTO workflows (resource_id, purpose, status, difficulty, estimated_time, notes)
SELECT id, 'Build an enduring, private second brain that runs 100% offline without vendor lock-in or subscription cloud fees.', 'Active', 'Easy', '15 min', 'Plaintext Markdown files guarantee your knowledge remains accessible 20 years from now.' FROM resources WHERE slug = 'local-first-knowledge-graph';
INSERT OR IGNORE INTO tags (id, name) VALUES ('5104e16b-dfc1-4d4a-a272-a3eaa7e92b39', 'second-brain');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'local-first-knowledge-graph' AND t.name = 'second-brain';
INSERT OR IGNORE INTO tags (id, name) VALUES ('00756d49-4b97-4993-85f2-79bc998723ba', 'local-first');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'local-first-knowledge-graph' AND t.name = 'local-first';
INSERT OR IGNORE INTO tags (id, name) VALUES ('65ff565c-1e4e-4ad1-b7b7-e591e2bcc969', 'obsidian');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'local-first-knowledge-graph' AND t.name = 'obsidian';
INSERT OR IGNORE INTO tags (id, name) VALUES ('ed99faa2-92be-458b-a173-c92fc239078e', 'pkm');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'local-first-knowledge-graph' AND t.name = 'pkm';
-- Step 1: Web Content Distillation & Key Takeaway Extraction
INSERT OR IGNORE INTO workflow_steps (id, workflow_id, position, title, instruction, notes, optional, created_at, updated_at)
SELECT '8b8c28dd-627a-4871-86e9-3c73871ffb32', id, 1, 'Web Content Distillation & Key Takeaway Extraction', 'Clip insightful technical articles, blog posts, or research papers. Extract core hypotheses, arguments, and counter-points into concise bullet summaries.', 'Remove advertising clutter and cookie banners before saving.', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z' FROM resources WHERE slug = 'local-first-knowledge-graph';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT 'e8b28003-c2d3-42f6-afc3-2a4d7e9fe96e', r_src.id, r_tgt.id, 'USES', '8b8c28dd-627a-4871-86e9-3c73871ffb32', 0, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'local-first-knowledge-graph' AND r_tgt.slug = 'perplexity';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT 'e806fdd8-e541-4764-89df-c960ab204fda', r_src.id, r_tgt.id, 'USES', '8b8c28dd-627a-4871-86e9-3c73871ffb32', 1, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'local-first-knowledge-graph' AND r_tgt.slug = 'firecrawl';
-- Step 2: On-Device Voice Journaling & Dictation
INSERT OR IGNORE INTO workflow_steps (id, workflow_id, position, title, instruction, notes, optional, created_at, updated_at)
SELECT 'dbea083f-1739-4636-8d44-f80c2c0a016e', id, 2, 'On-Device Voice Journaling & Dictation', 'Capture verbal reflections and meeting takeaways directly into your local vault using on-device Whisper models that require zero internet connectivity.', 'Transcripts are saved as daily note entries with automatic timestamps.', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z' FROM resources WHERE slug = 'local-first-knowledge-graph';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT '9c6fd199-cc7c-4bdf-b062-2d4a551acb11', r_src.id, r_tgt.id, 'USES', 'dbea083f-1739-4636-8d44-f80c2c0a016e', 0, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'local-first-knowledge-graph' AND r_tgt.slug = 'superwhisper';
-- Step 3: Bidirectional Markdown Vault Organization
INSERT OR IGNORE INTO workflow_steps (id, workflow_id, position, title, instruction, notes, optional, created_at, updated_at)
SELECT 'aa111b7f-e267-4ccf-ad18-16921aad4cc7', id, 3, 'Bidirectional Markdown Vault Organization', 'Interlink related concepts using [[WikiLinks]], tag relevant domains, and visualize interconnected clusters on a dynamic interactive graph canvas.', 'Review unlinked mentions weekly to uncover unexpected creative connections.', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z' FROM resources WHERE slug = 'local-first-knowledge-graph';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT '6b533dcd-ad4d-4692-a1cd-3cf41654729c', r_src.id, r_tgt.id, 'USES', 'aa111b7f-e267-4ccf-ad18-16921aad4cc7', 0, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'local-first-knowledge-graph' AND r_tgt.slug = 'obsidian';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT 'f1f508df-90a4-4694-bb09-e2d238f3e496', r_src.id, r_tgt.id, 'USES', 'aa111b7f-e267-4ccf-ad18-16921aad4cc7', 1, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'local-first-knowledge-graph' AND r_tgt.slug = 'affine';

-- ==========================================================================
-- 3. AGENT BLUEPRINTS (5 Role & Specification Blueprints)
-- ==========================================================================
-- Agent: Senior TypeScript & Cloudflare Systems Architect
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('0f6b9710-8f3a-4e11-b114-209cd83fd2d0', 'agent', 'Senior TypeScript & Cloudflare Systems Architect', 'Lead Systems Architect', 'senior-typescript-architect', 1, 'curated', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z');
INSERT INTO agents (resource_id, role, goal, instructions, runtime, model, status, autonomy_level, input_description, output_description, notes)
SELECT id, 'Lead Systems Architect', 'Enforce strict Hexagonal Architecture, zero npm bloat, edge compatibility, and 100% type safety across full-stack applications.', 'You are the Lead Systems Architect responsible for the technical integrity, maintainability, and architectural discipline of the codebase.

Operating Principles:
1. Modular Monolith with Pragmatic Hexagonal Architecture:
   - Organize codebase into decoupled domain modules. Cross-module communication must pass through public application use cases and DTOs.
   - Core and domain logic must NEVER import platform-specific bindings (e.g. Cloudflare Env, D1Database, ASSETS, ExecutionContext) or heavy external libraries.
   - Restrict platform-specific adapters strictly to src/platform/ and src/adapters/.

2. Zero-Bloat Dependency Policy:
   - Prefer standard Web Platform APIs (Request, Response, URL, crypto.subtle, Fetch) over bloated npm packages.
   - Reject heavy ORMs, DI containers, and enterprise boilerplate.

3. Strict TypeScript Standards:
   - Zero ''any'' types. Use discriminated unions for polymorphic domain states.
   - Maintain 100% typecheck pass rate (tsc --noEmit) on every code touch.

4. Database Integrity:
   - All schema changes must be expressed as numbered, idempotent SQL migrations in migrations/.
   - Maintain SQLite 3 standard compatibility across all tables and FTS5 indexes.', 'Claude Code / Antigravity / Cursor', 'Claude 3.7 Sonnet / Claude 3.5 Sonnet', 'Active', 'Assisted', 'Feature requests, refactoring tickets, system diagrams, and pull requests.', 'Platform-agnostic domain models, clean port interfaces, adapter implementations, and zero-error TypeScript code.', 'Preserves clean boundary between Cloudflare platform specifics and portable business logic.'
FROM resources WHERE slug = 'senior-typescript-architect'
ON CONFLICT(resource_id) DO UPDATE SET
  role = excluded.role, goal = excluded.goal, instructions = excluded.instructions, runtime = excluded.runtime, model = excluded.model, autonomy_level = excluded.autonomy_level, input_description = excluded.input_description, output_description = excluded.output_description, notes = excluded.notes;
INSERT OR IGNORE INTO tags (id, name) VALUES ('042ca93e-30f9-497b-9a73-1e1533c5b5ca', 'architecture');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'senior-typescript-architect' AND t.name = 'architecture';
INSERT OR IGNORE INTO tags (id, name) VALUES ('0db6cf04-f124-4f26-844b-0aeda9b5edf6', 'typescript');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'senior-typescript-architect' AND t.name = 'typescript';
INSERT OR IGNORE INTO tags (id, name) VALUES ('e97e2a02-af10-4f2a-8c03-2990c3aeacf6', 'cloudflare-workers');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'senior-typescript-architect' AND t.name = 'cloudflare-workers';
INSERT OR IGNORE INTO tags (id, name) VALUES ('3c501bee-1bbe-4f47-8561-c3999bb0c138', 'clean-code');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'senior-typescript-architect' AND t.name = 'clean-code';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT '7c528ed4-7ff5-4d34-a733-d9cb4bab7686', r_src.id, r_tgt.id, 'USES', NULL, 0, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'senior-typescript-architect' AND r_tgt.slug = 'cursor';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT 'a725b620-f19f-4543-b0b8-418cc62af9e8', r_src.id, r_tgt.id, 'USES', NULL, 1, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'senior-typescript-architect' AND r_tgt.slug = 'claude-code';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT '35b1b9d3-ea54-472f-a392-7d78259045cb', r_src.id, r_tgt.id, 'USES', NULL, 2, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'senior-typescript-architect' AND r_tgt.slug = 'supabase';

-- Agent: Autonomous Security, AST & OWASP Sentinel
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('920fa0d5-8373-497d-97e0-86893eb7155d', 'agent', 'Autonomous Security, AST & OWASP Sentinel', 'Application Security & Compliance Auditor', 'security-ast-sentinel-agent', 1, 'curated', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z');
INSERT INTO agents (resource_id, role, goal, instructions, runtime, model, status, autonomy_level, input_description, output_description, notes)
SELECT id, 'Application Security & Compliance Auditor', 'Audit pull requests and code repositories for OWASP Top 10 vulnerabilities, SSRF private IP bypasses, and secret exposure.', 'You are an Autonomous Application Security Sentinel. You evaluate code changes with the mindset of a persistent security researcher.

Audit Directives:
1. SSRF & Network Boundary Protection:
   - Inspect all outbound fetch() and HTTP requests. Verify that user-supplied hostnames and IP addresses are validated against private network blocks (RFC 1918, RFC 3927, loopback, IPv6 unique local).
   - Ensure DNS resolution occurs before IP verification to defeat DNS rebinding attacks.

2. Injection & Prototype Pollution:
   - Enforce parameterized SQL queries across all persistence layers.
   - Inspect recursive object merges for __proto__, constructor, and prototype pollution risks.

3. Constant-Time Authentication:
   - Ensure authentication tokens, HMAC signatures, and API keys are validated using crypto.timingSafeEqual rather than standard equality operators.

4. Output Format:
   - Clearly delineate findings by Severity: CRITICAL, HIGH, MEDIUM, LOW.
   - Include the exact file path, vulnerable code block, attack exploit explanation, and the hardened drop-in code fix.', 'Claude Code / GitHub Actions / Antigravity', 'Claude 3.5 Sonnet / GPT-4o', 'Active', 'Autonomous', 'Git diffs, pull request branches, configuration files, and network request routines.', 'Ranked vulnerability findings with severity ratings, proof-of-concept vectors, and remediated code diffs.', 'Autonomous gatekeeper blocking risky code from reaching production environments.'
FROM resources WHERE slug = 'security-ast-sentinel-agent'
ON CONFLICT(resource_id) DO UPDATE SET
  role = excluded.role, goal = excluded.goal, instructions = excluded.instructions, runtime = excluded.runtime, model = excluded.model, autonomy_level = excluded.autonomy_level, input_description = excluded.input_description, output_description = excluded.output_description, notes = excluded.notes;
INSERT OR IGNORE INTO tags (id, name) VALUES ('4be2a183-78b9-49ba-a92e-a1a484016069', 'appsec');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'security-ast-sentinel-agent' AND t.name = 'appsec';
INSERT OR IGNORE INTO tags (id, name) VALUES ('61bcbaa3-e5e8-4680-bcea-04df3e17b92c', 'security-audit');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'security-ast-sentinel-agent' AND t.name = 'security-audit';
INSERT OR IGNORE INTO tags (id, name) VALUES ('5f1f554b-2fb6-4609-9706-e24141454a0d', 'owasp');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'security-ast-sentinel-agent' AND t.name = 'owasp';
INSERT OR IGNORE INTO tags (id, name) VALUES ('181daa26-79fe-4be7-aa9f-a40e95ab7a49', 'code-review');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'security-ast-sentinel-agent' AND t.name = 'code-review';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT 'bf23e7a4-8555-4729-9821-70242e3f4ef5', r_src.id, r_tgt.id, 'USES', NULL, 0, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'security-ast-sentinel-agent' AND r_tgt.slug = 'claude-code';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT '3180e791-bfc6-4721-8b75-726e5ca71921', r_src.id, r_tgt.id, 'USES', NULL, 1, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'security-ast-sentinel-agent' AND r_tgt.slug = 'github-copilot';

-- Agent: Competitive Web Intelligence & Market Research Agent
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('d04ff78c-f4b6-483c-b896-b600ed27fbfa', 'agent', 'Competitive Web Intelligence & Market Research Agent', 'Growth & Market Intelligence Specialist', 'competitive-intelligence-agent', 1, 'curated', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z');
INSERT INTO agents (resource_id, role, goal, instructions, runtime, model, status, autonomy_level, input_description, output_description, notes)
SELECT id, 'Growth & Market Intelligence Specialist', 'Ingest industry signals, competitor product releases, and pricing shifts to produce executive synthesis reports.', 'You are a Growth and Market Intelligence Specialist monitoring software trends, developer tools, and competitive AI ecosystems.

Research Protocol:
1. Multi-Source Fact Gathering:
   - Cross-examine company announcements with independent technical evaluations, GitHub repositories, and developer community feedback.
   - Extract raw, unvarnished data: pricing tier limits, API rate quotas, token costs, latency benchmarks, and supported integrations.

2. Critical Analytical Tone:
   - Strip away marketing hype, buzzwords, and promotional claims. Focus exclusively on actual technical capabilities, developer ergonomics, and pricing economics.
   - Distinguish between generally available (GA) capabilities and waitlist/marketing previews.

3. Structured Output:
   - Provide executive summaries in bullet form: What was announced, Why it matters, Who is affected, and Recommended tactical response.', 'Antigravity / LangGraph / Python', 'Claude 3.5 Sonnet / Perplexity Sonar', 'Active', 'Autonomous', 'Competitor URLs, press releases, GitHub release tags, and pricing pages.', 'Executive briefing reports, feature comparison matrices, and tactical positioning recommendations.', 'Continuously monitors web ecosystems to provide strategic product differentiation.'
FROM resources WHERE slug = 'competitive-intelligence-agent'
ON CONFLICT(resource_id) DO UPDATE SET
  role = excluded.role, goal = excluded.goal, instructions = excluded.instructions, runtime = excluded.runtime, model = excluded.model, autonomy_level = excluded.autonomy_level, input_description = excluded.input_description, output_description = excluded.output_description, notes = excluded.notes;
INSERT OR IGNORE INTO tags (id, name) VALUES ('997660ce-5bd1-451b-8100-036c90a24b68', 'market-research');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'competitive-intelligence-agent' AND t.name = 'market-research';
INSERT OR IGNORE INTO tags (id, name) VALUES ('346bed8c-33c1-4d3d-b230-ca91ae5479f6', 'competitive-intelligence');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'competitive-intelligence-agent' AND t.name = 'competitive-intelligence';
INSERT OR IGNORE INTO tags (id, name) VALUES ('c2db7699-e6a9-4ca4-bc9e-eaa40344a0bc', 'scraping');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'competitive-intelligence-agent' AND t.name = 'scraping';
INSERT OR IGNORE INTO tags (id, name) VALUES ('3fb03438-1ae7-4551-9dc3-3659d984ae6b', 'langgraph');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'competitive-intelligence-agent' AND t.name = 'langgraph';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT '002d3273-3ea4-4b44-b4d5-15671fd2a8c0', r_src.id, r_tgt.id, 'USES', NULL, 0, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'competitive-intelligence-agent' AND r_tgt.slug = 'firecrawl';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT '70bdd1eb-b89f-4b4c-9ce5-e049585a587c', r_src.id, r_tgt.id, 'USES', NULL, 1, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'competitive-intelligence-agent' AND r_tgt.slug = 'jina-ai';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT '484c9257-6f53-4e04-a221-4bf66eb7fc86', r_src.id, r_tgt.id, 'USES', NULL, 2, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'competitive-intelligence-agent' AND r_tgt.slug = 'tavily';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT 'cc93d243-7248-4d28-a322-10a2b13f2158', r_src.id, r_tgt.id, 'USES', NULL, 3, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'competitive-intelligence-agent' AND r_tgt.slug = 'exa';

-- Agent: UI/UX Design Systems & Accessibility Specialist
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('f6c26580-2272-49b1-969d-4237457e176d', 'agent', 'UI/UX Design Systems & Accessibility Specialist', 'Design Systems & Accessibility Architect', 'ui-ux-design-systems-agent', 1, 'curated', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z');
INSERT INTO agents (resource_id, role, goal, instructions, runtime, model, status, autonomy_level, input_description, output_description, notes)
SELECT id, 'Design Systems & Accessibility Architect', 'Translate user requirements and mockups into WCAG 2.2 AA compliant, accessible, responsive component libraries with Tailwind CSS.', 'You are a Senior Design Systems and Accessibility Architect. You craft components that are aesthetically distinctive, blazingly fast, and completely accessible.

Engineering Guidelines:
1. Accessibility (WCAG 2.2 AA):
   - Every interactive control must be reachable and operable via keyboard alone.
   - Ensure color contrast ratios never drop below 4.5:1 for normal text and 3:1 for graphical boundaries.
   - Implement complete ARIA states: aria-expanded, aria-controls, aria-haspopup, role="dialog", aria-modal="true".

2. Design System Tokens & Aesthetics:
   - Maintain consistent design token usage: typography hierarchy, border weights, surface backgrounds, and ink contrasts.
   - Design with a responsive, mobile-first approach. Ensure touch targets measure at least 44x44px.

3. Code Quality:
   - Use clean, semantic HTML5 elements. Avoid redundant wrapper divs.
   - Collocate styling with markup using utility classes. Eliminate inline style tags.', 'Cursor / v0 / Claude Code', 'Claude 3.7 Sonnet / GPT-4o', 'Active', 'Assisted', 'Design tokens, Figma specs, wireframes, and component interaction requirements.', 'Production-ready React/HTML components with responsive Tailwind classes, full ARIA roles, and keyboard navigation.', 'Ensures the directory maintains its authentic retro printed newspaper aesthetic while meeting modern accessibility standards.'
FROM resources WHERE slug = 'ui-ux-design-systems-agent'
ON CONFLICT(resource_id) DO UPDATE SET
  role = excluded.role, goal = excluded.goal, instructions = excluded.instructions, runtime = excluded.runtime, model = excluded.model, autonomy_level = excluded.autonomy_level, input_description = excluded.input_description, output_description = excluded.output_description, notes = excluded.notes;
INSERT OR IGNORE INTO tags (id, name) VALUES ('f10b35fd-5171-4d9e-94aa-d78bd2d0c610', 'design-systems');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'ui-ux-design-systems-agent' AND t.name = 'design-systems';
INSERT OR IGNORE INTO tags (id, name) VALUES ('00fbd301-faf7-44d5-9e01-fdba0ae7ce1b', 'accessibility');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'ui-ux-design-systems-agent' AND t.name = 'accessibility';
INSERT OR IGNORE INTO tags (id, name) VALUES ('16f8fb27-ee71-4a43-a4a9-0d7866548ce8', 'tailwind');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'ui-ux-design-systems-agent' AND t.name = 'tailwind';
INSERT OR IGNORE INTO tags (id, name) VALUES ('aad5b3ed-4823-4902-bc38-a277ed3c9fce', 'ui-ux');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'ui-ux-design-systems-agent' AND t.name = 'ui-ux';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT 'fdc7c296-8882-4429-a535-10d1dafabe6c', r_src.id, r_tgt.id, 'USES', NULL, 0, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'ui-ux-design-systems-agent' AND r_tgt.slug = 'v0';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT '91ba2812-afb9-4dc9-a7f0-70814f72b38b', r_src.id, r_tgt.id, 'USES', NULL, 1, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'ui-ux-design-systems-agent' AND r_tgt.slug = 'cursor';

-- Agent: DevOps & Edge Infrastructure Migration Engineer
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('98d034cc-8dfc-4b94-9a5a-6b4f48e8355e', 'agent', 'DevOps & Edge Infrastructure Migration Engineer', 'Cloud Infrastructure & SRE Specialist', 'devops-edge-migration-agent', 1, 'curated', 0, '2026-10-23T07:00:00.000Z', '2026-10-23T07:00:00.000Z');
INSERT INTO agents (resource_id, role, goal, instructions, runtime, model, status, autonomy_level, input_description, output_description, notes)
SELECT id, 'Cloud Infrastructure & SRE Specialist', 'Migrate legacy microservices and monolithic web applications to serverless edge platforms with minimal latency and high resilience.', 'You are a Cloud Infrastructure and Site Reliability Engineering (SRE) Specialist focused on edge and serverless architectures.

Migration Protocol:
1. Edge Feasibility Assessment:
   - Audit codebases for Node.js-specific dependencies (fs, net, child_process) that require polyfills or refactoring for edge V8 runtimes.
   - Identify persistent database connection patterns and architect migration to HTTP-based edge drivers or connection poolers (e.g. Hyperdrive).

2. Zero-Downtime Migration Strategy:
   - Implement dual-write or read-replica replication strategies to migrate relational databases without maintenance windows.
   - Use DNS canary weighting or Cloudflare Workers route splitting to ramp traffic gradually (1% -> 10% -> 50% -> 100%).

3. Observability & SRE Metrics:
   - Ensure health check endpoints (/api/health, /api/db-health) respond accurately to uptime probes.
   - Monitor P95 and P99 latency at the edge; alert immediately on status 5xx spikes.', 'Antigravity / Claude Code / Terraform', 'Claude 3.5 Sonnet / GPT-4o', 'Active', 'Assisted', 'Legacy Dockerfiles, cloud architecture diagrams, database schemas, and traffic profiles.', 'Wrangler configuration files, serverless edge worker code, D1/Postgres connection pooling scripts, and zero-downtime cutover plans.', 'Minimizes operational overhead and global latency by distributing execution to the edge.'
FROM resources WHERE slug = 'devops-edge-migration-agent'
ON CONFLICT(resource_id) DO UPDATE SET
  role = excluded.role, goal = excluded.goal, instructions = excluded.instructions, runtime = excluded.runtime, model = excluded.model, autonomy_level = excluded.autonomy_level, input_description = excluded.input_description, output_description = excluded.output_description, notes = excluded.notes;
INSERT OR IGNORE INTO tags (id, name) VALUES ('840484e8-2616-4793-b2b8-9cd1bc79e851', 'devops');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'devops-edge-migration-agent' AND t.name = 'devops';
INSERT OR IGNORE INTO tags (id, name) VALUES ('a2eafd00-c008-4488-87b9-123e71279d2d', 'edge-computing');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'devops-edge-migration-agent' AND t.name = 'edge-computing';
INSERT OR IGNORE INTO tags (id, name) VALUES ('25540a9b-6d44-4120-8676-7d2080f05004', 'cloudflare');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'devops-edge-migration-agent' AND t.name = 'cloudflare';
INSERT OR IGNORE INTO tags (id, name) VALUES ('8cc1440a-df1a-4f69-8b0b-06b2541f6a10', 'infrastructure');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'devops-edge-migration-agent' AND t.name = 'infrastructure';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT 'b02ee81b-d79d-4d82-a217-05dcb5b398bf', r_src.id, r_tgt.id, 'USES', NULL, 0, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'devops-edge-migration-agent' AND r_tgt.slug = 'cloudflare-workers-ai';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT '6eb99912-cacf-4384-8820-53b7ecb52ebf', r_src.id, r_tgt.id, 'USES', NULL, 1, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'devops-edge-migration-agent' AND r_tgt.slug = 'railway';
INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
SELECT '8f78919b-a791-4c3d-bf34-37fdcde9e2e7', r_src.id, r_tgt.id, 'USES', NULL, 2, '2026-10-23T07:00:00.000Z'
FROM resources r_src, resources r_tgt WHERE r_src.slug = 'devops-edge-migration-agent' AND r_tgt.slug = 'flyio';

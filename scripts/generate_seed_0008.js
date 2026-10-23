import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

function uuid() {
  return crypto.randomUUID();
}

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

// Target Tool Slugs to Tool IDs in D1
const TOOL_MAP = {
  'claude': 'a23e972f-f8bb-4e81-813a-c1814818cac6',
  'chatgpt': '83d281d0-c2fc-4ec2-b9a0-312694eacad6',
  'cursor': '907ebb8f-f98a-4e46-989c-5cf6b2591e6b',
  'windsurf': 'eee7c391-2b2e-4b18-a65a-de0e510fe2d7',
  'claude-code': '67ab5bb5-2225-4d0f-9dfd-8e2f36c11f80',
  'aider': 'fdaceb01-2425-4b4c-8dec-1de771114f47',
  'github-copilot': '2725cf52-2f79-4db7-b0c1-76e0aaeb31f6',
  'v0': '6a5b61d9-7061-44d6-9a9c-f94e6a881e3c',
  'supabase': '173530c0-12f3-4f3a-8072-5ec345a2c54f',
  'elevenlabs': 'e5317bdc-1de1-4e96-8d02-ec6846a24698',
  'runway': '807073aa-68e1-4ed2-91fa-f1733cbaa164',
  'midjourney': 'd386eae1-ca99-4c57-a61b-ee06cc75cfa9',
  'luma-dream-machine': '8ea91617-8e22-460f-98de-2d623374bdd6',
  'descript': '317d7e17-1dbb-430b-99f6-6c1d18228189',
  'superwhisper': 'be4091ce-edac-41f1-a6d0-1ca5641c5a9b',
  'llamaparse': '1b82aab4-82a0-4ebb-a09a-a5b2a6f1b8e8',
  'langchain': 'dbd43a12-87f5-46aa-b2b9-e160a2b00513',
  'qdrant': 'd5f88861-fa18-47a7-b104-84f726d7ebd3',
  'pinecone': '661ab4c3-2e47-4da0-9d17-397b3bbda1a1',
  'langfuse': '1ce439fe-5f42-40ff-9fd4-6386b616b874',
  'firecrawl': 'a3d47164-5482-4bb7-902b-abef8e39165f',
  'jina-ai': 'b734e129-314d-4d81-839a-5cbb3ea85133',
  'tavily': '5775b07b-7cd5-43e6-b31c-3eef49c4d309',
  'exa': '3a62fa58-e4bb-48e9-8ac3-912d847a7bcb',
  'make': 'fc02be1b-ee3c-4c07-b28e-5b12da61bb8a',
  'perplexity': 'b05b21ef-8625-45a4-8bbc-5cbbac599287',
  'obsidian': 'e435bf05-0563-4bf8-af1e-f99a2ee19464',
  'affine': '3360201e-0a4e-48f2-b6bc-912090f2a95b',
  'cloudflare-workers-ai': '72fcf3ad-b570-4fbf-94e8-8a2bf19db7f0',
  'railway': '77c2167b-7ff6-4827-a9a3-d5f73dedd8b9',
  'flyio': '5273ab1d-1f36-44df-997e-29e78982feaf'
};

const NOW = '2026-10-23T07:00:00.000Z';

// ==========================================
// 1. PROMPTS DATA (10 Battle-Tested Prompts)
// ==========================================
const PROMPTS = [
  {
    title: 'Anthropic Metaprompt: Production System Prompt Generator',
    slug: 'anthropic-metaprompt',
    description: 'The official system prompt engineering template developed by Anthropic to construct rigorous, well-scoped prompts with scratchpad and instructions.',
    model: 'Claude 3.7 Sonnet',
    tags: ['anthropic', 'prompt-engineering', 'system-prompt', 'metaprompt'],
    featured: true,
    content: `Today you will be writing a production-grade system prompt for an AI assistant. The prompt should be comprehensive, deterministic, and eliminate ambiguity.

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

Produce only the final system prompt wrapped in a clean, reusable markdown block.`
  },
  {
    title: 'Next.js 15 App Router & React 19 Strict Cursor Rules',
    slug: 'nextjs-react19-cursorrules',
    description: 'Production-ready .cursorrules configuration enforcing Server Components by default, Server Actions with Zod validation, and zero any types.',
    model: 'Cursor / Claude 3.7',
    tags: ['cursor', 'cursorrules', 'nextjs', 'react19', 'typescript'],
    featured: true,
    content: `You are an expert Next.js 15, React 19, TypeScript, and Tailwind CSS engineer.

Core Architecture Principles:
- Treat all components in app/ as Server Components by default. Only add 'use client' when explicitly requiring useState, useEffect, browser APIs, or client-side interactivity.
- Push 'use client' boundaries as deep down the component tree as possible (leaf components).
- Never use React.FC or React.ReactNode as an import when modern React 19 primitives suffice.
- Strict TypeScript: No 'any', no 'unknown' casts without immediate type guards. Enable verbatimModuleSyntax.

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
- Use error.tsx boundaries for runtime recovery and not-found.tsx for missing entities.`
  },
  {
    title: 'Senior Security & OWASP Code Reviewer',
    slug: 'security-owasp-code-reviewer',
    description: 'Penetration tester and AppSec auditor prompt detecting SSRF, SQLi, prototype pollution, secret leakage, and timing attacks.',
    model: 'Claude 3.5 Sonnet / GPT-4o',
    tags: ['security', 'owasp', 'code-review', 'appsec'],
    featured: true,
    content: `You are a Principal Application Security Auditor conducting an adversarial code review against OWASP Top 10 vulnerabilities.

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
   - Is Object-Level Authorization (IDOR) verified (can User A edit User B's resource by guessing the ID)?
   - Are cryptographic token comparisons performed using constant-time algorithms (crypto.timingSafeEqual)?

4. Data Exposure & Secrets:
   - Are API tokens, private keys, or passwords logged or checked into source code?
   - Are sensitive attributes stripped from API JSON responses before returning to clients?

Output Format:
- Severity: CRITICAL | HIGH | MEDIUM | LOW | INFORMATIONAL
- Location: File path and line numbers
- Vulnerability: Clear explanation of the exploit vector
- Recommended Fix: Secure drop-in replacement code snippet.`
  },
  {
    title: 'Autonomous Test-Driven Development (TDD) Protocol',
    slug: 'autonomous-tdd-protocol',
    description: 'Strict Red-Green-Refactor system prompt requiring failing test suites before any implementation code is authored.',
    model: 'Claude Code / Cursor',
    tags: ['tdd', 'testing', 'vitest', 'unit-testing'],
    featured: false,
    content: `You are an autonomous Test-Driven Development (TDD) engineer practicing strict Red-Green-Refactor discipline.

Rules of Engagement:
1. RED: Never author production implementation code before authoring a failing automated test that precisely captures the requirement or bug reproduction.
2. VERIFY FAILURE: Run the test suite and confirm that the new test fails for the expected reason (assertion failure or missing symbol), not a syntax or runtime configuration error.
3. GREEN: Write the minimum possible production code required to make the failing test pass. Do not speculate or add premature features.
4. REFACTOR: Once tests are green, refactor the implementation for clarity, performance, and adherence to clean architecture principles without altering external behavior. Re-run tests to confirm 100% pass rate.

Testing Guidelines:
- Write expressive test descriptions following: it('should <expected behavior> when <condition>')
- Mock only at external I/O boundaries (HTTP, Database, File System); test domain entities and use cases with real memory objects.
- Keep tests isolated: zero shared mutable state between tests.`
  },
  {
    title: 'Deterministic JSON & Tool Schema Extractor',
    slug: 'deterministic-json-schema-extractor',
    description: 'Zero-shot structured data extraction prompt with strict adherence to JSON schema, null-handling, and fallback error recovery.',
    model: 'GPT-4o-mini / Claude 3.5 Haiku',
    tags: ['json', 'schema', 'tool-use', 'data-extraction'],
    featured: false,
    content: `You are a high-speed, deterministic structured data extraction engine.

Operational Directives:
1. Output ONLY a valid RFC 8259 JSON object. Never include conversational text, markdown fences (\`\`\`json), explanations, or preambles.
2. Conformance: Follow the provided JSON schema strictly. All required keys must be present.
3. Null Safety & Fallbacks:
   - If an optional field cannot be determined with high confidence from the context, set its value to null.
   - Do not substitute null with empty strings, "N/A", or placeholder text unless explicitly requested by the schema.
4. Dates & Numbers:
   - All timestamps must be formatted in ISO 8601 (YYYY-MM-DDTHH:mm:ss.sssZ).
   - Numeric quantities must be output as numbers, not formatted currency strings (e.g. 49.99, not "$49.99").
5. Error Payload:
   - If the input text contains no extractable data or is completely unreadable, return:
     {"error": "EXTRACTION_FAILED", "reason": "No relevant entities found in source context"}`
  },
  {
    title: 'Anti-Hallucination RAG Synthesis & Citation Guard',
    slug: 'anti-hallucination-rag-synthesis',
    description: 'High-fidelity retrieval augmented generation system prompt enforcing strict inline citation tags and verifiable refusals for out-of-corpus queries.',
    model: 'Claude 3.5 Sonnet / GPT-4o',
    tags: ['rag', 'hallucination-guard', 'citations', 'llmops'],
    featured: true,
    content: `You are an enterprise retrieval-augmented synthesis agent. Your sole purpose is to provide factual answers strictly substantiated by the provided context.

Operating Constraints:
1. Source Grounding:
   - Every substantive claim, metric, recommendation, or statement you make MUST be directly attributed to one of the provided context documents.
   - Cite your sources inline immediately following each claim using the format: [Doc <id>, §<section>]
   - Do NOT use prior world knowledge to fill in gaps or extrapolate facts that are not present in the context.

2. Refusal Protocol:
   - If the provided context does not contain sufficient factual evidence to answer the user's question, you must explicitly refuse to speculate.
   - Refusal formula: "Based on the provided documentation, I cannot confirm [topic]. The available context only discusses [brief summary of actual contents]."

3. Conflicting Evidence:
   - If context documents disagree or present conflicting figures, present both perspectives clearly:
     "Document A states [X], whereas Document B indicates [Y]."

4. Tone & Brevity:
   - Respond with objective, precise technical language. Avoid fluff, filler adjectives, or sycophancy.`
  },
  {
    title: 'Hexagonal Architecture & Clean Domain Modeler',
    slug: 'hexagonal-architecture-modeler',
    description: 'Domain-driven design system prompt enforcing inward dependency rules, platform-agnostic ports, and immutable domain entities.',
    model: 'Claude 3.7 Sonnet / DeepSeek R1',
    tags: ['architecture', 'hexagonal', 'ddd', 'clean-code'],
    featured: false,
    content: `You are a Principal Software Architect specializing in Hexagonal Architecture (Ports and Adapters) and Domain-Driven Design (DDD).

Design Rules:
1. Inward Dependency Direction:
   - Domain Layer (Entities, Value Objects, Domain Events) sits at the core. It has ZERO dependencies on frameworks, databases, or HTTP protocols.
   - Application Layer (Use Cases, DTOs) orchestrates business workflows using abstract Ports.
   - Adapters Layer (HTTP Controllers, D1/Postgres Repositories, Third-party APIs) implements Ports.
   - Outer layers depend on inner layers; inner layers NEVER import outer layers.

2. Domain Entities:
   - Entities must encapsulate their own invariants and validation logic.
   - Disallow public property mutations; expose meaningful domain methods (e.g. order.cancel() instead of order.status = 'cancelled').
   - Keep entities immutable or self-validating on creation.

3. Ports (Interfaces):
   - Ports must be expressed in domain language (e.g. UserRepository, PaymentGateway), never technology-specific terms (e.g. D1DatabaseClient, StripeSdkClient).
   - Return plain domain models or domain exceptions from repository ports, never raw SQL rows or HTTP error codes.`
  },
  {
    title: 'Technical Spec & PRD Architect',
    slug: 'technical-spec-prd-architect',
    description: 'Turns ambiguous feature ideas into actionable 1-page PRDs with domain models, API routes, edge cases, and test acceptance criteria.',
    model: 'Claude 3.7 Sonnet',
    tags: ['prd', 'product-management', 'specs', 'architecture'],
    featured: false,
    content: `You are a Staff Technical Product Manager converting ambiguous business ideas into concise, developer-ready Product Requirements Documents (PRDs).

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
- Given / When / Then scenarios covering happy path, validation errors, and boundary limits.`
  },
  {
    title: 'Production FastAPI & Async Python 3.12 Rules',
    slug: 'fastapi-async-python-rules',
    description: 'High-performance async Python system prompt featuring Pydantic V2, connection pooling, structlog logging, and OpenTelemetry tracing.',
    model: 'GPT-4o / Claude 3.5 Sonnet',
    tags: ['python', 'fastapi', 'async', 'pydantic'],
    featured: false,
    content: `You are an expert Python 3.12+ and FastAPI engineer building mission-critical async microservices.

Core Engineering Standards:
1. Asynchronous I/O:
   - Use async def for all route handlers performing database queries, HTTP requests, or Redis operations.
   - Never run blocking I/O calls (e.g. requests.get, time.sleep) inside an async event loop; use httpx.AsyncClient or run_in_threadpool.

2. Pydantic V2:
   - Use BaseModel with ConfigDict(from_attributes=True, extra='forbid') for strict schemas.
   - Use Annotated with Field(...) for runtime parameter validation.
   - Separate Request DTOs from Response DTOs to prevent accidental credential leakage.

3. Lifecycle & Connection Pooling:
   - Manage database connection pools, HTTP clients, and background workers via FastAPI lifespan context managers (asynccontextmanager).
   - Never instantiate a new DB pool or HTTP client per request.

4. Structured Observability:
   - Use structlog for JSON-formatted structured logging with correlation IDs (X-Request-ID).
   - Use OpenTelemetry trace contexts for distributed tracing.`
  },
  {
    title: 'Accessible Tailwind CSS & Radix Component Builder',
    slug: 'accessible-tailwind-radix-builder',
    description: 'Generates WCAG 2.2 AA compliant, keyboard-navigable UI components with modern Tailwind CSS and full ARIA semantics.',
    model: 'v0 / Claude 3.7 Sonnet',
    tags: ['tailwind', 'radix-ui', 'accessibility', 'frontend'],
    featured: false,
    content: `You are a Senior Frontend Accessibility (a11y) and Design Systems Specialist.

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
   - Touch targets must measure at least 44x44px on mobile viewports.`
  }
];

// ==========================================
// 2. WORKFLOWS DATA (6 Production Workflows)
// ==========================================
const WORKFLOWS = [
  {
    title: 'Voice Memo to Shipped Web App in 60 Minutes',
    slug: 'voice-memo-to-shipped-web-app',
    description: 'Transform a spontaneous audio brain-dump into a deployed full-stack application with database and auth in under an hour.',
    purpose: 'Rapidly prototype and ship working software directly from voice dictation without getting stuck in blank-editor paralysis.',
    difficulty: 'Medium',
    estimatedTime: '45-60 min',
    notes: 'Ideal for solopreneurs, hackathon teams, and founders capturing spontaneous product insights on the move.',
    tags: ['voice-to-code', 'fullstack', 'rapid-prototyping', 'solopreneur'],
    steps: [
      {
        title: 'Voice Capture & Instant Transcription',
        instruction: 'Record your raw product idea, user flow, and entity thoughts using an offline, high-accuracy speech-to-text tool. Speak freely without worrying about structure.',
        notes: 'Offline transcription ensures zero latency and total privacy for sensitive startup ideas.',
        tools: ['superwhisper']
      },
      {
        title: 'Spec Synthesis & Technical PRD',
        instruction: 'Paste the raw transcript into an advanced LLM using the Technical Spec PRD prompt. Instruct it to generate a 1-page PRD, data schema, and API endpoint list.',
        notes: 'Review the generated schema for edge cases and non-goals before moving to code generation.',
        tools: ['claude']
      },
      {
        title: 'Full-Stack UI Scaffolding & Component Generation',
        instruction: 'Feed the PRD component specifications into a generative UI builder to generate accessible React components, page layouts, and forms.',
        notes: 'Export the clean code directly into your local IDE workspace.',
        tools: ['v0', 'cursor']
      },
      {
        title: 'Backend BaaS & Serverless Deployment',
        instruction: 'Run the generated SQL schema migration against your managed Postgres database. Wire up authentication and deploy your frontend to edge infrastructure.',
        notes: 'Test end-to-end user sign-up and entity creation to verify production readiness.',
        tools: ['supabase']
      }
    ]
  },
  {
    title: 'Autonomous TDD Feature Delivery via Claude Code',
    slug: 'autonomous-tdd-feature-delivery',
    description: 'Ship robust, production-tested pull requests using AI agent loops with isolated git worktrees and strict Red-Green-Refactor testing.',
    purpose: 'Safely delegate complex feature implementation to autonomous agent CLI tools while maintaining 100% test pass rates and zero regressions.',
    difficulty: 'Advanced',
    estimatedTime: '25 min',
    notes: 'Using git worktrees prevents agent experiments from clobbering your active development branch.',
    tags: ['tdd', 'claude-code', 'testing', 'git-worktrees'],
    steps: [
      {
        title: 'Isolated Git Worktree Creation',
        instruction: 'Create a clean, isolated git worktree linked to a new feature branch. This ensures your working directory remains untouched during automated agent execution.',
        notes: 'Run: git worktree add ../feature-worktree -b feat/new-capability',
        tools: ['cursor']
      },
      {
        title: 'Failing End-to-End Test Suite Authoring',
        instruction: 'Provide the task issue and acceptance criteria to the coding agent. Instruct it to write failing integration and unit tests capturing all requirements before writing any code.',
        notes: 'Confirm tests fail with expected assertion errors rather than compilation issues.',
        tools: ['claude-code', 'aider']
      },
      {
        title: 'Autonomous Implementation & Green Test Loop',
        instruction: 'Run the agent in iterative loop mode against the local test runner. The agent analyzes failures, adjusts code, and repeats until all test assertions pass.',
        notes: 'Agent must stop as soon as all tests pass without introducing out-of-scope refactorings.',
        tools: ['claude-code']
      },
      {
        title: 'Security Review & Pull Request Assembly',
        instruction: 'Run a security and AST audit against the git diff. Format a conventional commit message and open a pull request with an automated summary of changes.',
        notes: 'Verify zero secrets or unintended file modifications before merging.',
        tools: ['github-copilot']
      }
    ]
  },
  {
    title: 'Multimodal Technical Explainer Video Production',
    slug: 'multimodal-explainer-video-production',
    description: 'Produce engaging, high-fidelity technical announcement videos with custom voice narration, motion graphics, and subtitles.',
    purpose: 'Deliver high-retention video explainers and product demo reels without cameras, studio microphones, or expensive video editing suites.',
    difficulty: 'Medium',
    estimatedTime: '90 min',
    notes: 'Combining dedicated voice synthesis with diffusion b-roll achieves studio-grade production values.',
    tags: ['video-generation', 'multimodal', 'elevenlabs', 'content-creation'],
    steps: [
      {
        title: 'Technical Script & Visual Storyboarding',
        instruction: 'Draft a compelling 90-second technical narrative with timestamped visual descriptions, scene transitions, and callout moments.',
        notes: 'Keep each scene to 4-7 seconds to maintain high viewer engagement.',
        tools: ['claude', 'chatgpt']
      },
      {
        title: 'Voice Synthesis & Emotional Timing',
        instruction: 'Generate clear, human-grade voice narration using custom voice models with natural pacing, micro-pauses, and emphasis on key terminology.',
        notes: 'Export high-resolution uncompressed WAV audio files for timeline alignment.',
        tools: ['elevenlabs']
      },
      {
        title: 'Cinematic Visuals & Diffusion B-Roll Generation',
        instruction: 'Prompt state-of-the-art diffusion models for scene visuals, UI hero shots, and abstract 3D motion backgrounds corresponding to each storyboard segment.',
        notes: 'Maintain consistent color palettes and lighting styles across all generated clips.',
        tools: ['runway', 'midjourney', 'luma-dream-machine']
      },
      {
        title: 'Dynamic Captions & Video Assembly',
        instruction: 'Import audio narration and video clips into your editor. Auto-generate animated subtitles, balance background sound levels, and export in 4K.',
        notes: 'Verify subtitle timing and contrast against background footage.',
        tools: ['descript']
      }
    ]
  },
  {
    title: 'Enterprise Document Ingestion & High-Precision Hybrid RAG',
    slug: 'enterprise-hybrid-rag-pipeline',
    description: 'Build an enterprise-grade document search and question-answering system combining layout-aware parsing, vector search, and BM25.',
    purpose: 'Eliminate hallucinations and semantic retrieval misses across complex multi-page PDF contracts, tables, and financial reports.',
    difficulty: 'Advanced',
    estimatedTime: '2 hours',
    notes: 'Layout-aware parsing preserves tabular data relationships that naive text extractors destroy.',
    tags: ['rag', 'vector-database', 'enterprise-ai', 'llamaparse'],
    steps: [
      {
        title: 'Document OCR & Vision-Based Layout Parsing',
        instruction: 'Parse complex enterprise PDFs containing multi-column text, charts, and embedded tables into clean, structural Markdown with vision-assisted extractors.',
        notes: 'Tables are converted directly into valid Markdown tables to retain row/column integrity.',
        tools: ['llamaparse']
      },
      {
        title: 'Semantic Chunking & Metadata Enrichment',
        instruction: 'Split parsed Markdown into hierarchical chunks respecting header boundaries. Attach document metadata (author, date, classification level) to each chunk.',
        notes: 'Ensure a 10% sliding window overlap between adjacent text blocks.',
        tools: ['langchain']
      },
      {
        title: 'Hybrid Dense & Sparse Vector Storage',
        instruction: 'Embed chunk texts using state-of-the-art dense embedding models. Ingest vectors into a high-performance database with reciprocal rank fusion (RRF) BM25 keyword matching.',
        notes: 'Hybrid search catches exact acronyms and IDs that semantic embeddings occasionally miss.',
        tools: ['qdrant', 'pinecone']
      },
      {
        title: 'Retrieval Tracing & Faithfulness Evaluation',
        instruction: 'Instrument query pipelines with LLMOps observability to monitor retrieval latency, context relevance scores, and synthesis faithfulness.',
        notes: 'Set up alerting when retrieval relevance scores drop below 0.75.',
        tools: ['langfuse']
      }
    ]
  },
  {
    title: 'Real-Time Competitor Web Intelligence & Pricing Monitor',
    slug: 'real-time-competitor-intelligence',
    description: 'Automate competitor tracking, pricing updates, and feature announcements with headless web extraction and schema normalization.',
    purpose: 'Gain instant awareness of competitor product launches, tier shifts, and market positioning without manual web browsing.',
    difficulty: 'Medium',
    estimatedTime: '30 min',
    notes: 'Headless markdown extractors bypass JavaScript heavy single-page apps seamlessly.',
    tags: ['web-scraping', 'market-intelligence', 'firecrawl', 'automation'],
    steps: [
      {
        title: 'Anti-Bot Web Scraping & Markdown Extraction',
        instruction: 'Configure automated scraping jobs against target competitor pricing and documentation pages, extracting raw DOM contents into clean, sanitized Markdown.',
        notes: 'Proxy rotation handles Cloudflare Turnstile and anti-scraping challenges automatically.',
        tools: ['firecrawl', 'jina-ai']
      },
      {
        title: 'Structured Schema Extraction & Normalization',
        instruction: 'Pass extracted Markdown through an LLM extraction prompt to parse pricing tiers, features, limits, and add-ons into a standardized JSON schema.',
        notes: 'Normalize all currency amounts to USD and billing periods to monthly/annual.',
        tools: ['claude']
      },
      {
        title: 'Snapshot Diffing & Historical Vector Storage',
        instruction: 'Compare newly extracted records against previous crawl snapshots. Record modifications, deletions, or price increases into a relational database.',
        notes: 'Store timestamps to track historical pricing trends over quarters.',
        tools: ['supabase']
      },
      {
        title: 'Automated Alert Dispatch & Weekly Digest',
        instruction: 'Trigger instant notifications via Slack, email, or webhook whenever pricing changes or new enterprise tiers are detected.',
        notes: 'Bundle minor copy changes into a weekly executive briefing digest.',
        tools: ['make']
      }
    ]
  },
  {
    title: 'Local-First Knowledge Graph: Web & Audio to Markdown',
    slug: 'local-first-knowledge-graph',
    description: 'Curate a decentralized personal knowledge vault using local LLMs, offline speech-to-text, and bidirectional wikilinks.',
    purpose: 'Build an enduring, private second brain that runs 100% offline without vendor lock-in or subscription cloud fees.',
    difficulty: 'Easy',
    estimatedTime: '15 min',
    notes: 'Plaintext Markdown files guarantee your knowledge remains accessible 20 years from now.',
    tags: ['second-brain', 'local-first', 'obsidian', 'pkm'],
    steps: [
      {
        title: 'Web Content Distillation & Key Takeaway Extraction',
        instruction: 'Clip insightful technical articles, blog posts, or research papers. Extract core hypotheses, arguments, and counter-points into concise bullet summaries.',
        notes: 'Remove advertising clutter and cookie banners before saving.',
        tools: ['perplexity', 'firecrawl']
      },
      {
        title: 'On-Device Voice Journaling & Dictation',
        instruction: 'Capture verbal reflections and meeting takeaways directly into your local vault using on-device Whisper models that require zero internet connectivity.',
        notes: 'Transcripts are saved as daily note entries with automatic timestamps.',
        tools: ['superwhisper']
      },
      {
        title: 'Bidirectional Markdown Vault Organization',
        instruction: 'Interlink related concepts using [[WikiLinks]], tag relevant domains, and visualize interconnected clusters on a dynamic interactive graph canvas.',
        notes: 'Review unlinked mentions weekly to uncover unexpected creative connections.',
        tools: ['obsidian', 'affine']
      }
    ]
  }
];

// ==========================================
// 3. AGENTS DATA (5 Production Blueprints)
// ==========================================
const AGENTS = [
  {
    title: 'Senior TypeScript & Cloudflare Systems Architect',
    slug: 'senior-typescript-architect',
    role: 'Lead Systems Architect',
    goal: 'Enforce strict Hexagonal Architecture, zero npm bloat, edge compatibility, and 100% type safety across full-stack applications.',
    runtime: 'Claude Code / Antigravity / Cursor',
    model: 'Claude 3.7 Sonnet / Claude 3.5 Sonnet',
    status: 'Active',
    autonomyLevel: 'Assisted',
    inputDescription: 'Feature requests, refactoring tickets, system diagrams, and pull requests.',
    outputDescription: 'Platform-agnostic domain models, clean port interfaces, adapter implementations, and zero-error TypeScript code.',
    notes: 'Preserves clean boundary between Cloudflare platform specifics and portable business logic.',
    tags: ['architecture', 'typescript', 'cloudflare-workers', 'clean-code'],
    tools: ['cursor', 'claude-code', 'supabase'],
    instructions: `You are the Lead Systems Architect responsible for the technical integrity, maintainability, and architectural discipline of the codebase.

Operating Principles:
1. Modular Monolith with Pragmatic Hexagonal Architecture:
   - Organize codebase into decoupled domain modules. Cross-module communication must pass through public application use cases and DTOs.
   - Core and domain logic must NEVER import platform-specific bindings (e.g. Cloudflare Env, D1Database, ASSETS, ExecutionContext) or heavy external libraries.
   - Restrict platform-specific adapters strictly to src/platform/ and src/adapters/.

2. Zero-Bloat Dependency Policy:
   - Prefer standard Web Platform APIs (Request, Response, URL, crypto.subtle, Fetch) over bloated npm packages.
   - Reject heavy ORMs, DI containers, and enterprise boilerplate.

3. Strict TypeScript Standards:
   - Zero 'any' types. Use discriminated unions for polymorphic domain states.
   - Maintain 100% typecheck pass rate (tsc --noEmit) on every code touch.

4. Database Integrity:
   - All schema changes must be expressed as numbered, idempotent SQL migrations in migrations/.
   - Maintain SQLite 3 standard compatibility across all tables and FTS5 indexes.`
  },
  {
    title: 'Autonomous Security, AST & OWASP Sentinel',
    slug: 'security-ast-sentinel-agent',
    role: 'Application Security & Compliance Auditor',
    goal: 'Audit pull requests and code repositories for OWASP Top 10 vulnerabilities, SSRF private IP bypasses, and secret exposure.',
    runtime: 'Claude Code / GitHub Actions / Antigravity',
    model: 'Claude 3.5 Sonnet / GPT-4o',
    status: 'Active',
    autonomyLevel: 'Autonomous',
    inputDescription: 'Git diffs, pull request branches, configuration files, and network request routines.',
    outputDescription: 'Ranked vulnerability findings with severity ratings, proof-of-concept vectors, and remediated code diffs.',
    notes: 'Autonomous gatekeeper blocking risky code from reaching production environments.',
    tags: ['appsec', 'security-audit', 'owasp', 'code-review'],
    tools: ['claude-code', 'github-copilot'],
    instructions: `You are an Autonomous Application Security Sentinel. You evaluate code changes with the mindset of a persistent security researcher.

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
   - Include the exact file path, vulnerable code block, attack exploit explanation, and the hardened drop-in code fix.`
  },
  {
    title: 'Competitive Web Intelligence & Market Research Agent',
    slug: 'competitive-intelligence-agent',
    role: 'Growth & Market Intelligence Specialist',
    goal: 'Ingest industry signals, competitor product releases, and pricing shifts to produce executive synthesis reports.',
    runtime: 'Antigravity / LangGraph / Python',
    model: 'Claude 3.5 Sonnet / Perplexity Sonar',
    status: 'Active',
    autonomyLevel: 'Autonomous',
    inputDescription: 'Competitor URLs, press releases, GitHub release tags, and pricing pages.',
    outputDescription: 'Executive briefing reports, feature comparison matrices, and tactical positioning recommendations.',
    notes: 'Continuously monitors web ecosystems to provide strategic product differentiation.',
    tags: ['market-research', 'competitive-intelligence', 'scraping', 'langgraph'],
    tools: ['firecrawl', 'jina-ai', 'tavily', 'exa'],
    instructions: `You are a Growth and Market Intelligence Specialist monitoring software trends, developer tools, and competitive AI ecosystems.

Research Protocol:
1. Multi-Source Fact Gathering:
   - Cross-examine company announcements with independent technical evaluations, GitHub repositories, and developer community feedback.
   - Extract raw, unvarnished data: pricing tier limits, API rate quotas, token costs, latency benchmarks, and supported integrations.

2. Critical Analytical Tone:
   - Strip away marketing hype, buzzwords, and promotional claims. Focus exclusively on actual technical capabilities, developer ergonomics, and pricing economics.
   - Distinguish between generally available (GA) capabilities and waitlist/marketing previews.

3. Structured Output:
   - Provide executive summaries in bullet form: What was announced, Why it matters, Who is affected, and Recommended tactical response.`
  },
  {
    title: 'UI/UX Design Systems & Accessibility Specialist',
    slug: 'ui-ux-design-systems-agent',
    role: 'Design Systems & Accessibility Architect',
    goal: 'Translate user requirements and mockups into WCAG 2.2 AA compliant, accessible, responsive component libraries with Tailwind CSS.',
    runtime: 'Cursor / v0 / Claude Code',
    model: 'Claude 3.7 Sonnet / GPT-4o',
    status: 'Active',
    autonomyLevel: 'Assisted',
    inputDescription: 'Design tokens, Figma specs, wireframes, and component interaction requirements.',
    outputDescription: 'Production-ready React/HTML components with responsive Tailwind classes, full ARIA roles, and keyboard navigation.',
    notes: 'Ensures the directory maintains its authentic retro printed newspaper aesthetic while meeting modern accessibility standards.',
    tags: ['design-systems', 'accessibility', 'tailwind', 'ui-ux'],
    tools: ['v0', 'cursor'],
    instructions: `You are a Senior Design Systems and Accessibility Architect. You craft components that are aesthetically distinctive, blazingly fast, and completely accessible.

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
   - Collocate styling with markup using utility classes. Eliminate inline style tags.`
  },
  {
    title: 'DevOps & Edge Infrastructure Migration Engineer',
    slug: 'devops-edge-migration-agent',
    role: 'Cloud Infrastructure & SRE Specialist',
    goal: 'Migrate legacy microservices and monolithic web applications to serverless edge platforms with minimal latency and high resilience.',
    runtime: 'Antigravity / Claude Code / Terraform',
    model: 'Claude 3.5 Sonnet / GPT-4o',
    status: 'Active',
    autonomyLevel: 'Assisted',
    inputDescription: 'Legacy Dockerfiles, cloud architecture diagrams, database schemas, and traffic profiles.',
    outputDescription: 'Wrangler configuration files, serverless edge worker code, D1/Postgres connection pooling scripts, and zero-downtime cutover plans.',
    notes: 'Minimizes operational overhead and global latency by distributing execution to the edge.',
    tags: ['devops', 'edge-computing', 'cloudflare', 'infrastructure'],
    tools: ['cloudflare-workers-ai', 'railway', 'flyio'],
    instructions: `You are a Cloud Infrastructure and Site Reliability Engineering (SRE) Specialist focused on edge and serverless architectures.

Migration Protocol:
1. Edge Feasibility Assessment:
   - Audit codebases for Node.js-specific dependencies (fs, net, child_process) that require polyfills or refactoring for edge V8 runtimes.
   - Identify persistent database connection patterns and architect migration to HTTP-based edge drivers or connection poolers (e.g. Hyperdrive).

2. Zero-Downtime Migration Strategy:
   - Implement dual-write or read-replica replication strategies to migrate relational databases without maintenance windows.
   - Use DNS canary weighting or Cloudflare Workers route splitting to ramp traffic gradually (1% -> 10% -> 50% -> 100%).

3. Observability & SRE Metrics:
   - Ensure health check endpoints (/api/health, /api/db-health) respond accurately to uptime probes.
   - Monitor P95 and P99 latency at the edge; alert immediately on status 5xx spikes.`
  }
];

// ==========================================
// GENERATOR LOGIC
// ==========================================
function generateSql() {
  const lines = [
    '-- Migration: 0008_prompts_workflows_agents.sql',
    '-- Description: Curate authentic, production-grade System Prompts, AI Workflows (with tool linkages), and Agent Blueprints.',
    '',
    '-- ==========================================================================',
    '-- 1. SYSTEM PROMPTS (10 Production Items)',
    '-- =========================================================================='
  ];

  for (const p of PROMPTS) {
    const resId = uuid();
    lines.push(`-- Prompt: ${p.title}`);
    lines.push(`INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)`);
    lines.push(`VALUES (${escapeSql(resId)}, 'prompt', ${escapeSql(p.title)}, ${escapeSql(p.description)}, ${escapeSql(p.slug)}, ${p.featured ? 1 : 0}, 'curated', 0, ${escapeSql(NOW)}, ${escapeSql(NOW)});`);
    lines.push(`INSERT OR IGNORE INTO prompts (resource_id, content, model, favorite)`);
    lines.push(`SELECT id, ${escapeSql(p.content)}, ${escapeSql(p.model)}, 0 FROM resources WHERE slug = ${escapeSql(p.slug)};`);

    for (const tag of p.tags) {
      const tagId = uuid();
      lines.push(`INSERT OR IGNORE INTO tags (id, name) VALUES (${escapeSql(tagId)}, ${escapeSql(tag)});`);
      lines.push(`INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = ${escapeSql(p.slug)} AND t.name = ${escapeSql(tag)};`);
    }
    lines.push('');
  }

  lines.push('-- ==========================================================================');
  lines.push('-- 2. AI WORKFLOWS (6 Multi-Step Workflows with Tool USES Relationships)');
  lines.push('-- ==========================================================================');

  for (const w of WORKFLOWS) {
    const resId = uuid();
    lines.push(`-- Workflow: ${w.title}`);
    lines.push(`INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)`);
    lines.push(`VALUES (${escapeSql(resId)}, 'workflow', ${escapeSql(w.title)}, ${escapeSql(w.description)}, ${escapeSql(w.slug)}, 1, 'curated', 0, ${escapeSql(NOW)}, ${escapeSql(NOW)});`);
    lines.push(`INSERT OR IGNORE INTO workflows (resource_id, purpose, status, difficulty, estimated_time, notes)`);
    lines.push(`SELECT id, ${escapeSql(w.purpose)}, 'Active', ${escapeSql(w.difficulty)}, ${escapeSql(w.estimatedTime)}, ${escapeSql(w.notes)} FROM resources WHERE slug = ${escapeSql(w.slug)};`);

    for (const tag of w.tags) {
      const tagId = uuid();
      lines.push(`INSERT OR IGNORE INTO tags (id, name) VALUES (${escapeSql(tagId)}, ${escapeSql(tag)});`);
      lines.push(`INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = ${escapeSql(w.slug)} AND t.name = ${escapeSql(tag)};`);
    }

    // Insert Steps and Tool Links
    for (let i = 0; i < w.steps.length; i++) {
      const step = w.steps[i];
      const stepId = uuid();
      const pos = i + 1;
      lines.push(`-- Step ${pos}: ${step.title}`);
      lines.push(`INSERT OR IGNORE INTO workflow_steps (id, workflow_id, position, title, instruction, notes, optional, created_at, updated_at)`);
      lines.push(`SELECT ${escapeSql(stepId)}, id, ${pos}, ${escapeSql(step.title)}, ${escapeSql(step.instruction)}, ${escapeSql(step.notes)}, 0, ${escapeSql(NOW)}, ${escapeSql(NOW)} FROM resources WHERE slug = ${escapeSql(w.slug)};`);

      for (let tIdx = 0; tIdx < step.tools.length; tIdx++) {
        const toolSlug = step.tools[tIdx];
        const relId = uuid();
        lines.push(`INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)`);
        lines.push(`SELECT ${escapeSql(relId)}, r_src.id, r_tgt.id, 'USES', ${escapeSql(stepId)}, ${tIdx}, ${escapeSql(NOW)}`);
        lines.push(`FROM resources r_src, resources r_tgt WHERE r_src.slug = ${escapeSql(w.slug)} AND r_tgt.slug = ${escapeSql(toolSlug)};`);
      }
    }
    lines.push('');
  }

  lines.push('-- ==========================================================================');
  lines.push('-- 3. AGENT BLUEPRINTS (5 Role & Specification Blueprints)');
  lines.push('-- ==========================================================================');

  for (const a of AGENTS) {
    const resId = uuid();
    lines.push(`-- Agent: ${a.title}`);
    lines.push(`INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)`);
    lines.push(`VALUES (${escapeSql(resId)}, 'agent', ${escapeSql(a.title)}, ${escapeSql(a.role)}, ${escapeSql(a.slug)}, 1, 'curated', 0, ${escapeSql(NOW)}, ${escapeSql(NOW)});`);
    
    // Update or insert into agents
    lines.push(`INSERT INTO agents (resource_id, role, goal, instructions, runtime, model, status, autonomy_level, input_description, output_description, notes)`);
    lines.push(`SELECT id, ${escapeSql(a.role)}, ${escapeSql(a.goal)}, ${escapeSql(a.instructions)}, ${escapeSql(a.runtime)}, ${escapeSql(a.model)}, 'Active', ${escapeSql(a.autonomyLevel)}, ${escapeSql(a.inputDescription)}, ${escapeSql(a.outputDescription)}, ${escapeSql(a.notes)}`);
    lines.push(`FROM resources WHERE slug = ${escapeSql(a.slug)}`);
    lines.push(`ON CONFLICT(resource_id) DO UPDATE SET`);
    lines.push(`  role = excluded.role, goal = excluded.goal, instructions = excluded.instructions, runtime = excluded.runtime, model = excluded.model, autonomy_level = excluded.autonomy_level, input_description = excluded.input_description, output_description = excluded.output_description, notes = excluded.notes;`);

    for (const tag of a.tags) {
      const tagId = uuid();
      lines.push(`INSERT OR IGNORE INTO tags (id, name) VALUES (${escapeSql(tagId)}, ${escapeSql(tag)});`);
      lines.push(`INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = ${escapeSql(a.slug)} AND t.name = ${escapeSql(tag)};`);
    }

    // Link tools to agent via resource_relationships
    for (let tIdx = 0; tIdx < a.tools.length; tIdx++) {
      const toolSlug = a.tools[tIdx];
      const relId = uuid();
      lines.push(`INSERT OR IGNORE INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)`);
      lines.push(`SELECT ${escapeSql(relId)}, r_src.id, r_tgt.id, 'USES', NULL, ${tIdx}, ${escapeSql(NOW)}`);
      lines.push(`FROM resources r_src, resources r_tgt WHERE r_src.slug = ${escapeSql(a.slug)} AND r_tgt.slug = ${escapeSql(toolSlug)};`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

const sql = generateSql();
const outPath = path.resolve('migrations', '0008_prompts_workflows_agents.sql');
fs.writeFileSync(outPath, sql, 'utf8');
console.log(`Successfully generated ${outPath} (${sql.length} bytes)`);

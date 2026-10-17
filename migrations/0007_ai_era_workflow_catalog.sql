-- Migration: 0007_ai_era_workflow_catalog.sql
-- Description: Expand catalog with essential AI-era workflow tools (BaaS, Vector DB, Web Scraping, LLMOps, 3D, and Local-First PKM).

-- Product: Supabase
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('173530c0-12f3-4f3a-8072-5ec345a2c54f', 'tool', 'Supabase', 'Open-source Firebase alternative featuring Postgres database, authentication, instant APIs, edge functions, and pgvector embeddings.', 'supabase', 1, 'curated', 0, '2026-10-17T10:00:00.000Z', '2026-10-17T10:00:00.000Z');
INSERT OR IGNORE INTO tools (resource_id, kind, url, hostname, provider, category, pricing, notes, favicon_url, verified_at)
SELECT id, 'tool', 'https://supabase.com', 'supabase.com', 'Supabase', 'AI Infrastructure', 'Open Source', NULL, NULL, '2026-10-17' FROM resources WHERE slug = 'supabase';
INSERT OR IGNORE INTO tags (id, name) VALUES ('08089e71-bc9d-45a4-87a2-d58cd7c4fa81', 'baas');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'supabase' AND t.name = 'baas';
INSERT OR IGNORE INTO tags (id, name) VALUES ('efbd1f43-e11d-40e5-8a1d-09ea692b7a28', 'database');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'supabase' AND t.name = 'database';
INSERT OR IGNORE INTO tags (id, name) VALUES ('ae680cda-f9b8-46e4-a1ff-48e700d03e82', 'postgres');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'supabase' AND t.name = 'postgres';
INSERT OR IGNORE INTO tags (id, name) VALUES ('3b69ae12-c10f-40ff-af06-22aa0dfb9c13', 'vector-db');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'supabase' AND t.name = 'vector-db';
INSERT OR IGNORE INTO tags (id, name) VALUES ('86a76f31-0472-4b7c-89cd-afb2fd56044e', 'open-source');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'supabase' AND t.name = 'open-source';
INSERT OR IGNORE INTO tools_fts (rowid, title, description, provider, category, notes)
SELECT r.rowid, r.title, r.description, t.provider, t.category, t.notes FROM resources r JOIN tools t ON t.resource_id = r.id WHERE r.slug = 'supabase';

-- Product: Firebase
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('c7ed771a-12a3-4352-b939-69a40ce88d35', 'tool', 'Firebase', 'Google''s app development platform providing NoSQL databases, authentication, hosting, cloud functions, and Firebase Genkit for AI workflows.', 'firebase', 1, 'curated', 0, '2026-10-17T10:00:00.000Z', '2026-10-17T10:00:00.000Z');
INSERT OR IGNORE INTO tools (resource_id, kind, url, hostname, provider, category, pricing, notes, favicon_url, verified_at)
SELECT id, 'tool', 'https://firebase.google.com', 'firebase.google.com', 'Google', 'AI Infrastructure', 'Freemium', NULL, NULL, '2026-10-17' FROM resources WHERE slug = 'firebase';
INSERT OR IGNORE INTO tags (id, name) VALUES ('93f5c30a-286c-46f5-a234-25bc34b613d5', 'baas');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'firebase' AND t.name = 'baas';
INSERT OR IGNORE INTO tags (id, name) VALUES ('2743b76a-282b-43be-9a83-c95437045a56', 'database');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'firebase' AND t.name = 'database';
INSERT OR IGNORE INTO tags (id, name) VALUES ('ef370e06-cc1c-4d9d-854a-d735e00fa898', 'google');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'firebase' AND t.name = 'google';
INSERT OR IGNORE INTO tags (id, name) VALUES ('79a6ff86-25ad-44df-8ab6-e32c137de5ae', 'cloud-functions');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'firebase' AND t.name = 'cloud-functions';
INSERT OR IGNORE INTO tags (id, name) VALUES ('498b8982-4643-4eb6-8d58-5c59175273a5', 'genkit');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'firebase' AND t.name = 'genkit';
INSERT OR IGNORE INTO tools_fts (rowid, title, description, provider, category, notes)
SELECT r.rowid, r.title, r.description, t.provider, t.category, t.notes FROM resources r JOIN tools t ON t.resource_id = r.id WHERE r.slug = 'firebase';

-- Product: PocketBase
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('8718d4c1-1e73-4c7d-b6a5-0a6fcfc1ba59', 'tool', 'PocketBase', 'Open-source backend in 1 file consisting of embedded SQLite database with realtime subscriptions, built-in auth, and file storage.', 'pocketbase', 0, 'curated', 0, '2026-10-17T10:00:00.000Z', '2026-10-17T10:00:00.000Z');
INSERT OR IGNORE INTO tools (resource_id, kind, url, hostname, provider, category, pricing, notes, favicon_url, verified_at)
SELECT id, 'tool', 'https://pocketbase.io', 'pocketbase.io', 'PocketBase', 'Open Source & Local AI', 'Open Source', NULL, NULL, '2026-10-17' FROM resources WHERE slug = 'pocketbase';
INSERT OR IGNORE INTO tags (id, name) VALUES ('a8cadbff-84eb-45be-a73d-54cd2c19ae44', 'baas');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'pocketbase' AND t.name = 'baas';
INSERT OR IGNORE INTO tags (id, name) VALUES ('ffdc4bf3-1a9e-460b-b28a-ebf0fd339325', 'sqlite');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'pocketbase' AND t.name = 'sqlite';
INSERT OR IGNORE INTO tags (id, name) VALUES ('b2c5ff18-3ad1-4034-a83e-3e1691f4d6a8', 'embedded');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'pocketbase' AND t.name = 'embedded';
INSERT OR IGNORE INTO tags (id, name) VALUES ('9f587440-3bd9-4266-9ab8-30f2eff89b4f', 'open-source');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'pocketbase' AND t.name = 'open-source';
INSERT OR IGNORE INTO tags (id, name) VALUES ('295faf33-9617-4150-ba6d-5c22967713d8', 'realtime');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'pocketbase' AND t.name = 'realtime';
INSERT OR IGNORE INTO tools_fts (rowid, title, description, provider, category, notes)
SELECT r.rowid, r.title, r.description, t.provider, t.category, t.notes FROM resources r JOIN tools t ON t.resource_id = r.id WHERE r.slug = 'pocketbase';

-- Product: Appwrite
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('bb3f2651-7e19-4e46-8f49-eb2d4ae9c3ae', 'tool', 'Appwrite', 'Secure, open-source self-hosted backend platform delivering authentication, databases, storage, and serverless functions for web and mobile.', 'appwrite', 0, 'curated', 0, '2026-10-17T10:00:00.000Z', '2026-10-17T10:00:00.000Z');
INSERT OR IGNORE INTO tools (resource_id, kind, url, hostname, provider, category, pricing, notes, favicon_url, verified_at)
SELECT id, 'tool', 'https://appwrite.io', 'appwrite.io', 'Appwrite', 'AI Infrastructure', 'Open Source', NULL, NULL, '2026-10-17' FROM resources WHERE slug = 'appwrite';
INSERT OR IGNORE INTO tags (id, name) VALUES ('ba326cf3-e450-47d2-a890-c102021a10fd', 'baas');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'appwrite' AND t.name = 'baas';
INSERT OR IGNORE INTO tags (id, name) VALUES ('d84fd2f3-24a2-4adb-bcdf-7fe5930e9290', 'self-hosted');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'appwrite' AND t.name = 'self-hosted';
INSERT OR IGNORE INTO tags (id, name) VALUES ('c72061e1-037d-453b-8183-9f60b7c064c9', 'database');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'appwrite' AND t.name = 'database';
INSERT OR IGNORE INTO tags (id, name) VALUES ('ede343c8-9cae-4222-9446-c0b1d0d4651c', 'auth');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'appwrite' AND t.name = 'auth';
INSERT OR IGNORE INTO tags (id, name) VALUES ('f4c34b0f-532d-4307-bcad-e7140f714cd6', 'open-source');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'appwrite' AND t.name = 'open-source';
INSERT OR IGNORE INTO tools_fts (rowid, title, description, provider, category, notes)
SELECT r.rowid, r.title, r.description, t.provider, t.category, t.notes FROM resources r JOIN tools t ON t.resource_id = r.id WHERE r.slug = 'appwrite';

-- Product: Convex
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('3cfb9772-19d5-4840-960c-c470103638ab', 'tool', 'Convex', 'Reactive backend application platform for full-stack TypeScript and AI apps with automatic sync, ACID transactions, and server functions.', 'convex', 1, 'curated', 0, '2026-10-17T10:00:00.000Z', '2026-10-17T10:00:00.000Z');
INSERT OR IGNORE INTO tools (resource_id, kind, url, hostname, provider, category, pricing, notes, favicon_url, verified_at)
SELECT id, 'tool', 'https://www.convex.dev', 'convex.dev', 'Convex', 'AI Infrastructure', 'Freemium', NULL, NULL, '2026-10-17' FROM resources WHERE slug = 'convex';
INSERT OR IGNORE INTO tags (id, name) VALUES ('2c91584f-c5ab-4f32-9b55-83cfeae9887c', 'baas');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'convex' AND t.name = 'baas';
INSERT OR IGNORE INTO tags (id, name) VALUES ('8c478f4d-7003-4f35-ada9-a8fd3d927cc3', 'reactive');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'convex' AND t.name = 'reactive';
INSERT OR IGNORE INTO tags (id, name) VALUES ('8939337f-81b6-452b-88fd-29b1b378137a', 'typescript');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'convex' AND t.name = 'typescript';
INSERT OR IGNORE INTO tags (id, name) VALUES ('da680572-c9b0-4ba3-ba91-8d2d6b9e2232', 'fullstack');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'convex' AND t.name = 'fullstack';
INSERT OR IGNORE INTO tags (id, name) VALUES ('b71e66b5-8e4a-4363-84a3-76cf3992d2ac', 'realtime');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'convex' AND t.name = 'realtime';
INSERT OR IGNORE INTO tools_fts (rowid, title, description, provider, category, notes)
SELECT r.rowid, r.title, r.description, t.provider, t.category, t.notes FROM resources r JOIN tools t ON t.resource_id = r.id WHERE r.slug = 'convex';

-- Product: Neon
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('69d6b18c-f97e-4de3-8049-16cd63c77fc3', 'tool', 'Neon', 'Serverless PostgreSQL platform with scale-to-zero compute, instantaneous database branching for dev/test workflows, and pgvector support.', 'neon', 1, 'curated', 0, '2026-10-17T10:00:00.000Z', '2026-10-17T10:00:00.000Z');
INSERT OR IGNORE INTO tools (resource_id, kind, url, hostname, provider, category, pricing, notes, favicon_url, verified_at)
SELECT id, 'tool', 'https://neon.tech', 'neon.tech', 'Neon', 'AI Infrastructure', 'Freemium', NULL, NULL, '2026-10-17' FROM resources WHERE slug = 'neon';
INSERT OR IGNORE INTO tags (id, name) VALUES ('6958f2ba-4cbc-4c54-a103-f5a9242d6dc4', 'serverless');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'neon' AND t.name = 'serverless';
INSERT OR IGNORE INTO tags (id, name) VALUES ('60a93206-6160-45c0-9a0a-c7a67e3254b4', 'postgres');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'neon' AND t.name = 'postgres';
INSERT OR IGNORE INTO tags (id, name) VALUES ('3b0da501-9ef9-4adc-a6fe-1188be28601a', 'database-branching');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'neon' AND t.name = 'database-branching';
INSERT OR IGNORE INTO tags (id, name) VALUES ('82891556-bd9e-41c8-b9f4-97f75545211d', 'vector-db');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'neon' AND t.name = 'vector-db';
INSERT OR IGNORE INTO tags (id, name) VALUES ('77d6bcec-4f4a-4632-96c2-c1f84537fbdc', 'cloud');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'neon' AND t.name = 'cloud';
INSERT OR IGNORE INTO tools_fts (rowid, title, description, provider, category, notes)
SELECT r.rowid, r.title, r.description, t.provider, t.category, t.notes FROM resources r JOIN tools t ON t.resource_id = r.id WHERE r.slug = 'neon';

-- Product: Turso
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('387c1003-5eab-40ee-b239-fadbea467371', 'tool', 'Turso', 'Edge-hosted distributed SQLite database powered by libSQL, offering microsecond latency replication and database-per-tenant architecture.', 'turso', 0, 'curated', 0, '2026-10-17T10:00:00.000Z', '2026-10-17T10:00:00.000Z');
INSERT OR IGNORE INTO tools (resource_id, kind, url, hostname, provider, category, pricing, notes, favicon_url, verified_at)
SELECT id, 'tool', 'https://turso.tech', 'turso.tech', 'ChiselStrike', 'AI Infrastructure', 'Freemium', NULL, NULL, '2026-10-17' FROM resources WHERE slug = 'turso';
INSERT OR IGNORE INTO tags (id, name) VALUES ('d20872fd-6dd3-4978-9a7d-ee2da959a2db', 'sqlite');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'turso' AND t.name = 'sqlite';
INSERT OR IGNORE INTO tags (id, name) VALUES ('9117d3c9-b03f-4a23-973c-b3d91505bb95', 'libsql');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'turso' AND t.name = 'libsql';
INSERT OR IGNORE INTO tags (id, name) VALUES ('51af8f66-82cd-4f7b-bf91-769d784b2299', 'edge-computing');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'turso' AND t.name = 'edge-computing';
INSERT OR IGNORE INTO tags (id, name) VALUES ('be460b86-52ab-48b1-b927-f889741ae07e', 'distributed');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'turso' AND t.name = 'distributed';
INSERT OR IGNORE INTO tags (id, name) VALUES ('8cd3652f-ea44-47df-98f9-1aac72111969', 'serverless');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'turso' AND t.name = 'serverless';
INSERT OR IGNORE INTO tools_fts (rowid, title, description, provider, category, notes)
SELECT r.rowid, r.title, r.description, t.provider, t.category, t.notes FROM resources r JOIN tools t ON t.resource_id = r.id WHERE r.slug = 'turso';

-- Product: Upstash
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('9ae101f5-db13-4641-9918-5c0629a691a8', 'tool', 'Upstash', 'Serverless data platform for developers providing low-latency Redis, Kafka messaging, QStash scheduling, and Vector search on the Edge.', 'upstash', 0, 'curated', 0, '2026-10-17T10:00:00.000Z', '2026-10-17T10:00:00.000Z');
INSERT OR IGNORE INTO tools (resource_id, kind, url, hostname, provider, category, pricing, notes, favicon_url, verified_at)
SELECT id, 'tool', 'https://upstash.com', 'upstash.com', 'Upstash', 'AI Infrastructure', 'Freemium', NULL, NULL, '2026-10-17' FROM resources WHERE slug = 'upstash';
INSERT OR IGNORE INTO tags (id, name) VALUES ('82d5d378-45f1-4fd7-80f1-8a9f0089aeb2', 'serverless');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'upstash' AND t.name = 'serverless';
INSERT OR IGNORE INTO tags (id, name) VALUES ('b18017a1-2bb7-4bf4-be53-a633b62c7998', 'redis');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'upstash' AND t.name = 'redis';
INSERT OR IGNORE INTO tags (id, name) VALUES ('124f7512-9022-4008-b465-3fa1887a34f0', 'vector-db');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'upstash' AND t.name = 'vector-db';
INSERT OR IGNORE INTO tags (id, name) VALUES ('d072a676-84c3-4940-be68-5bb24ff3db42', 'edge');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'upstash' AND t.name = 'edge';
INSERT OR IGNORE INTO tags (id, name) VALUES ('3a0c8067-3609-4f3f-aed3-b087a96d5fd4', 'kafka');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'upstash' AND t.name = 'kafka';
INSERT OR IGNORE INTO tools_fts (rowid, title, description, provider, category, notes)
SELECT r.rowid, r.title, r.description, t.provider, t.category, t.notes FROM resources r JOIN tools t ON t.resource_id = r.id WHERE r.slug = 'upstash';

-- Product: Clerk
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('a086239a-13ce-4717-bb6d-cee737521c85', 'tool', 'Clerk', 'Comprehensive user authentication, identity management, and session handling purpose-built for modern Next.js and React applications.', 'clerk', 1, 'curated', 0, '2026-10-17T10:00:00.000Z', '2026-10-17T10:00:00.000Z');
INSERT OR IGNORE INTO tools (resource_id, kind, url, hostname, provider, category, pricing, notes, favicon_url, verified_at)
SELECT id, 'tool', 'https://clerk.com', 'clerk.com', 'Clerk', 'Developer Tools & MCP', 'Freemium', NULL, NULL, '2026-10-17' FROM resources WHERE slug = 'clerk';
INSERT OR IGNORE INTO tags (id, name) VALUES ('3e488aae-47ac-4f85-85b6-82f4bf1bc99e', 'auth');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'clerk' AND t.name = 'auth';
INSERT OR IGNORE INTO tags (id, name) VALUES ('e7dc0bd2-67ee-4ff1-ad62-62cfeca89c54', 'identity');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'clerk' AND t.name = 'identity';
INSERT OR IGNORE INTO tags (id, name) VALUES ('9a8bd0a6-ea5a-4243-b7ba-abb1b96b4418', 'nextjs');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'clerk' AND t.name = 'nextjs';
INSERT OR IGNORE INTO tags (id, name) VALUES ('15755c73-2c10-4aa2-80b0-debf49bb4e72', 'react');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'clerk' AND t.name = 'react';
INSERT OR IGNORE INTO tags (id, name) VALUES ('649ebbdd-693f-4bde-8bd0-07eb8ea06ab2', 'security');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'clerk' AND t.name = 'security';
INSERT OR IGNORE INTO tools_fts (rowid, title, description, provider, category, notes)
SELECT r.rowid, r.title, r.description, t.provider, t.category, t.notes FROM resources r JOIN tools t ON t.resource_id = r.id WHERE r.slug = 'clerk';

-- Product: Pinecone
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('de8b9272-1695-46fd-9595-e2f9e69906e9', 'tool', 'Pinecone', 'Managed cloud-native vector database designed for high-performance similarity search, RAG pipelines, and semantic AI recommendation systems.', 'pinecone', 1, 'curated', 0, '2026-10-17T10:00:00.000Z', '2026-10-17T10:00:00.000Z');
INSERT OR IGNORE INTO tools (resource_id, kind, url, hostname, provider, category, pricing, notes, favicon_url, verified_at)
SELECT id, 'tool', 'https://www.pinecone.io', 'pinecone.io', 'Pinecone Systems', 'AI Infrastructure', 'Freemium', NULL, NULL, '2026-10-17' FROM resources WHERE slug = 'pinecone';
INSERT OR IGNORE INTO tags (id, name) VALUES ('dabb9ed6-be23-43b2-b496-0d35fcbf0ce9', 'vector-db');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'pinecone' AND t.name = 'vector-db';
INSERT OR IGNORE INTO tags (id, name) VALUES ('9e33d9ba-38b6-4d31-b4e9-4e260027758f', 'rag');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'pinecone' AND t.name = 'rag';
INSERT OR IGNORE INTO tags (id, name) VALUES ('55988b30-5828-4c5a-b49b-35cda5a5b890', 'embeddings');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'pinecone' AND t.name = 'embeddings';
INSERT OR IGNORE INTO tags (id, name) VALUES ('7dcaf888-1286-43ac-99b2-7e71c98b3202', 'similarity-search');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'pinecone' AND t.name = 'similarity-search';
INSERT OR IGNORE INTO tags (id, name) VALUES ('af9ebf00-ad92-4b31-9229-6425afe4ba13', 'cloud');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'pinecone' AND t.name = 'cloud';
INSERT OR IGNORE INTO tools_fts (rowid, title, description, provider, category, notes)
SELECT r.rowid, r.title, r.description, t.provider, t.category, t.notes FROM resources r JOIN tools t ON t.resource_id = r.id WHERE r.slug = 'pinecone';

-- Product: Qdrant
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('1e7446c0-ecbd-4a96-b664-ca2e1e17f72c', 'tool', 'Qdrant', 'Production-grade open-source vector similarity search engine and database written in Rust with advanced payload-based filtering.', 'qdrant', 1, 'curated', 0, '2026-10-17T10:00:00.000Z', '2026-10-17T10:00:00.000Z');
INSERT OR IGNORE INTO tools (resource_id, kind, url, hostname, provider, category, pricing, notes, favicon_url, verified_at)
SELECT id, 'tool', 'https://qdrant.tech', 'qdrant.tech', 'Qdrant', 'AI Infrastructure', 'Open Source', NULL, NULL, '2026-10-17' FROM resources WHERE slug = 'qdrant';
INSERT OR IGNORE INTO tags (id, name) VALUES ('4ece1621-09c0-4426-a9fc-ead6f1338d14', 'vector-db');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'qdrant' AND t.name = 'vector-db';
INSERT OR IGNORE INTO tags (id, name) VALUES ('bfc8b7ad-ec3c-46c4-8834-4414b6466a50', 'rust');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'qdrant' AND t.name = 'rust';
INSERT OR IGNORE INTO tags (id, name) VALUES ('c14e044f-6f4a-49aa-8958-b71a1a6becb3', 'open-source');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'qdrant' AND t.name = 'open-source';
INSERT OR IGNORE INTO tags (id, name) VALUES ('ff410550-4d94-4f85-8566-13384e672007', 'rag');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'qdrant' AND t.name = 'rag';
INSERT OR IGNORE INTO tags (id, name) VALUES ('858eae59-9c1c-4bed-b2a2-9019952249fc', 'similarity-search');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'qdrant' AND t.name = 'similarity-search';
INSERT OR IGNORE INTO tools_fts (rowid, title, description, provider, category, notes)
SELECT r.rowid, r.title, r.description, t.provider, t.category, t.notes FROM resources r JOIN tools t ON t.resource_id = r.id WHERE r.slug = 'qdrant';

-- Product: Chroma
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('290c42e1-ed2f-4ca0-bb40-934a84f4f890', 'tool', 'Chroma', 'AI-native open-source embedding database designed to make it simple to build LLM apps by making knowledge and documents searchable.', 'chroma', 0, 'curated', 0, '2026-10-17T10:00:00.000Z', '2026-10-17T10:00:00.000Z');
INSERT OR IGNORE INTO tools (resource_id, kind, url, hostname, provider, category, pricing, notes, favicon_url, verified_at)
SELECT id, 'tool', 'https://www.trychroma.com', 'trychroma.com', 'Chroma', 'Open Source & Local AI', 'Open Source', NULL, NULL, '2026-10-17' FROM resources WHERE slug = 'chroma';
INSERT OR IGNORE INTO tags (id, name) VALUES ('416471cf-25a7-4548-8d70-5dbc2331fb6c', 'vector-db');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'chroma' AND t.name = 'vector-db';
INSERT OR IGNORE INTO tags (id, name) VALUES ('ae549b0d-43f8-40f8-8da9-0285ae615fb2', 'open-source');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'chroma' AND t.name = 'open-source';
INSERT OR IGNORE INTO tags (id, name) VALUES ('d4d8c4f5-1119-4758-88ed-94595cdf7171', 'python');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'chroma' AND t.name = 'python';
INSERT OR IGNORE INTO tags (id, name) VALUES ('f0bcb76e-d833-4f70-82a5-db95dbc05cf9', 'embeddings');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'chroma' AND t.name = 'embeddings';
INSERT OR IGNORE INTO tags (id, name) VALUES ('11f92b46-9cfe-472c-b061-65d07596542f', 'rag');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'chroma' AND t.name = 'rag';
INSERT OR IGNORE INTO tools_fts (rowid, title, description, provider, category, notes)
SELECT r.rowid, r.title, r.description, t.provider, t.category, t.notes FROM resources r JOIN tools t ON t.resource_id = r.id WHERE r.slug = 'chroma';

-- Product: Weaviate
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('c04bbfc1-68d2-4ebe-8273-804b7652dfa7', 'tool', 'Weaviate', 'Open-source, AI-native vector database offering hybrid search combining dense vector search and BM25 sparse keyword search.', 'weaviate', 0, 'curated', 0, '2026-10-17T10:00:00.000Z', '2026-10-17T10:00:00.000Z');
INSERT OR IGNORE INTO tools (resource_id, kind, url, hostname, provider, category, pricing, notes, favicon_url, verified_at)
SELECT id, 'tool', 'https://weaviate.io', 'weaviate.io', 'Weaviate', 'AI Infrastructure', 'Open Source', NULL, NULL, '2026-10-17' FROM resources WHERE slug = 'weaviate';
INSERT OR IGNORE INTO tags (id, name) VALUES ('f2ef9ba8-7f67-4643-8609-1e79183ff071', 'vector-db');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'weaviate' AND t.name = 'vector-db';
INSERT OR IGNORE INTO tags (id, name) VALUES ('ca5c0a54-ac8e-4935-bee3-d3e28194fdab', 'hybrid-search');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'weaviate' AND t.name = 'hybrid-search';
INSERT OR IGNORE INTO tags (id, name) VALUES ('ae74a802-e2cd-42f0-9330-97c42ce521f1', 'open-source');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'weaviate' AND t.name = 'open-source';
INSERT OR IGNORE INTO tags (id, name) VALUES ('c6e7383e-1855-430f-a239-0bf8a38108f2', 'rag');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'weaviate' AND t.name = 'rag';
INSERT OR IGNORE INTO tags (id, name) VALUES ('8a0b6484-c40e-4bd4-b99b-0bf590623653', 'multimodal');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'weaviate' AND t.name = 'multimodal';
INSERT OR IGNORE INTO tools_fts (rowid, title, description, provider, category, notes)
SELECT r.rowid, r.title, r.description, t.provider, t.category, t.notes FROM resources r JOIN tools t ON t.resource_id = r.id WHERE r.slug = 'weaviate';

-- Product: Milvus
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('343cb073-c7e2-49a4-b524-2f3d07c4ae43', 'tool', 'Milvus', 'Highly scalable open-source vector database built for massive enterprise unstructured data search and billions of vector queries.', 'milvus', 0, 'curated', 0, '2026-10-17T10:00:00.000Z', '2026-10-17T10:00:00.000Z');
INSERT OR IGNORE INTO tools (resource_id, kind, url, hostname, provider, category, pricing, notes, favicon_url, verified_at)
SELECT id, 'tool', 'https://milvus.io', 'milvus.io', 'LF AI & Data Foundation', 'AI Infrastructure', 'Open Source', NULL, NULL, '2026-10-17' FROM resources WHERE slug = 'milvus';
INSERT OR IGNORE INTO tags (id, name) VALUES ('3cacf8e2-251d-447e-9b1e-c508a3236087', 'vector-db');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'milvus' AND t.name = 'vector-db';
INSERT OR IGNORE INTO tags (id, name) VALUES ('a45b97b9-4b80-435e-9cf0-e884adfc501d', 'enterprise');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'milvus' AND t.name = 'enterprise';
INSERT OR IGNORE INTO tags (id, name) VALUES ('bf805dbd-e1c8-4475-bb5a-ae208a9aa7d5', 'open-source');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'milvus' AND t.name = 'open-source';
INSERT OR IGNORE INTO tags (id, name) VALUES ('1068461f-3146-429c-81de-18afac252f12', 'scalability');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'milvus' AND t.name = 'scalability';
INSERT OR IGNORE INTO tags (id, name) VALUES ('b638d8d7-4d7d-403d-9b4a-61f67994aff2', 'similarity-search');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'milvus' AND t.name = 'similarity-search';
INSERT OR IGNORE INTO tools_fts (rowid, title, description, provider, category, notes)
SELECT r.rowid, r.title, r.description, t.provider, t.category, t.notes FROM resources r JOIN tools t ON t.resource_id = r.id WHERE r.slug = 'milvus';

-- Product: Firecrawl
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('535ef1a7-e6e3-46e8-8a5f-80c1768ae18d', 'tool', 'Firecrawl', 'The de-facto open-source web scraper API that turns any website into clean, LLM-ready markdown format with crawling and extraction.', 'firecrawl', 1, 'curated', 0, '2026-10-17T10:00:00.000Z', '2026-10-17T10:00:00.000Z');
INSERT OR IGNORE INTO tools (resource_id, kind, url, hostname, provider, category, pricing, notes, favicon_url, verified_at)
SELECT id, 'tool', 'https://www.firecrawl.dev', 'firecrawl.dev', 'Mendable', 'Developer Tools & MCP', 'Open Source', NULL, NULL, '2026-10-17' FROM resources WHERE slug = 'firecrawl';
INSERT OR IGNORE INTO tags (id, name) VALUES ('2a62289d-878a-4ef0-ab24-75af493a683f', 'web-scraping');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'firecrawl' AND t.name = 'web-scraping';
INSERT OR IGNORE INTO tags (id, name) VALUES ('a1633468-74a4-4e91-9851-22363089cd25', 'markdown');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'firecrawl' AND t.name = 'markdown';
INSERT OR IGNORE INTO tags (id, name) VALUES ('dd19b5f7-64f7-4fbe-af1c-efbb44ab426b', 'open-source');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'firecrawl' AND t.name = 'open-source';
INSERT OR IGNORE INTO tags (id, name) VALUES ('e24c5795-34a7-406b-8e41-dc05eb87b3b0', 'llm-ready');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'firecrawl' AND t.name = 'llm-ready';
INSERT OR IGNORE INTO tags (id, name) VALUES ('014a14dd-ccca-4de7-b9f0-07864329d3cf', 'crawling');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'firecrawl' AND t.name = 'crawling';
INSERT OR IGNORE INTO tools_fts (rowid, title, description, provider, category, notes)
SELECT r.rowid, r.title, r.description, t.provider, t.category, t.notes FROM resources r JOIN tools t ON t.resource_id = r.id WHERE r.slug = 'firecrawl';

-- Product: Jina AI
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('8b34e2f3-127f-4a2e-b6db-3c1b91c16328', 'tool', 'Jina AI', 'Developer platform providing Reader API to fetch and parse web content for LLMs, along with high-performance embeddings and rerankers.', 'jina-ai', 0, 'curated', 0, '2026-10-17T10:00:00.000Z', '2026-10-17T10:00:00.000Z');
INSERT OR IGNORE INTO tools (resource_id, kind, url, hostname, provider, category, pricing, notes, favicon_url, verified_at)
SELECT id, 'tool', 'https://jina.ai', 'jina.ai', 'Jina AI', 'Developer Tools & MCP', 'Freemium', NULL, NULL, '2026-10-17' FROM resources WHERE slug = 'jina-ai';
INSERT OR IGNORE INTO tags (id, name) VALUES ('c90e9472-ef18-4a0b-b4ee-c1a3518bdad3', 'reader-api');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'jina-ai' AND t.name = 'reader-api';
INSERT OR IGNORE INTO tags (id, name) VALUES ('67cda09e-471d-4dba-a37d-df0f63bb5835', 'embeddings');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'jina-ai' AND t.name = 'embeddings';
INSERT OR IGNORE INTO tags (id, name) VALUES ('e9c46ae5-4a5f-4832-a2fe-790deeaafc7e', 'reranker');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'jina-ai' AND t.name = 'reranker';
INSERT OR IGNORE INTO tags (id, name) VALUES ('f5e36b8b-e417-4330-845e-6ab40edf06a9', 'search');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'jina-ai' AND t.name = 'search';
INSERT OR IGNORE INTO tags (id, name) VALUES ('a91a59f9-413b-430f-9450-b491f0ba02b7', 'developer-tools');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'jina-ai' AND t.name = 'developer-tools';
INSERT OR IGNORE INTO tools_fts (rowid, title, description, provider, category, notes)
SELECT r.rowid, r.title, r.description, t.provider, t.category, t.notes FROM resources r JOIN tools t ON t.resource_id = r.id WHERE r.slug = 'jina-ai';

-- Product: Tavily
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('e6bd7d8c-ed95-4e6f-935d-d294c30900a0', 'tool', 'Tavily', 'Search engine specifically engineered for AI agents and LLMs to retrieve accurate, factual, and real-time web knowledge with citations.', 'tavily', 1, 'curated', 0, '2026-10-17T10:00:00.000Z', '2026-10-17T10:00:00.000Z');
INSERT OR IGNORE INTO tools (resource_id, kind, url, hostname, provider, category, pricing, notes, favicon_url, verified_at)
SELECT id, 'tool', 'https://tavily.com', 'tavily.com', 'Tavily', 'Search & Research', 'Freemium', NULL, NULL, '2026-10-17' FROM resources WHERE slug = 'tavily';
INSERT OR IGNORE INTO tags (id, name) VALUES ('4b4eaf95-3331-455b-a578-cbeca0c08284', 'search-api');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'tavily' AND t.name = 'search-api';
INSERT OR IGNORE INTO tags (id, name) VALUES ('66f013c4-dc48-47d4-addc-d7e7bafa6769', 'ai-agents');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'tavily' AND t.name = 'ai-agents';
INSERT OR IGNORE INTO tags (id, name) VALUES ('ee7d0466-df7d-4b13-bef2-3db04dd60611', 'citations');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'tavily' AND t.name = 'citations';
INSERT OR IGNORE INTO tags (id, name) VALUES ('b20e3a8d-4db0-4366-857b-82665a1c44a3', 'realtime');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'tavily' AND t.name = 'realtime';
INSERT OR IGNORE INTO tags (id, name) VALUES ('78515e26-a140-4b20-a661-b9ad8f6f83d9', 'research');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'tavily' AND t.name = 'research';
INSERT OR IGNORE INTO tools_fts (rowid, title, description, provider, category, notes)
SELECT r.rowid, r.title, r.description, t.provider, t.category, t.notes FROM resources r JOIN tools t ON t.resource_id = r.id WHERE r.slug = 'tavily';

-- Product: Exa
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('6a300f19-ba10-4894-bfaf-ba1b201d7539', 'tool', 'Exa', 'Neural search engine and web API designed for AI that searches using embeddings rather than keyword matching to find high-signal knowledge.', 'exa', 0, 'curated', 0, '2026-10-17T10:00:00.000Z', '2026-10-17T10:00:00.000Z');
INSERT OR IGNORE INTO tools (resource_id, kind, url, hostname, provider, category, pricing, notes, favicon_url, verified_at)
SELECT id, 'tool', 'https://exa.ai', 'exa.ai', 'Exa', 'Search & Research', 'Freemium', NULL, NULL, '2026-10-17' FROM resources WHERE slug = 'exa';
INSERT OR IGNORE INTO tags (id, name) VALUES ('dd0b9ab2-5317-4c02-a044-293e3b37198a', 'neural-search');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'exa' AND t.name = 'neural-search';
INSERT OR IGNORE INTO tags (id, name) VALUES ('80a1af27-1987-4c83-832c-16e842d4e14b', 'embeddings');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'exa' AND t.name = 'embeddings';
INSERT OR IGNORE INTO tags (id, name) VALUES ('97d04053-54e4-474e-9c48-81ea467693c6', 'api');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'exa' AND t.name = 'api';
INSERT OR IGNORE INTO tags (id, name) VALUES ('8e443594-94b7-41e3-a599-3490c7cf72e4', 'research');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'exa' AND t.name = 'research';
INSERT OR IGNORE INTO tags (id, name) VALUES ('69f230be-c24a-421a-8e6b-c3d687b9d13a', 'semantic-search');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'exa' AND t.name = 'semantic-search';
INSERT OR IGNORE INTO tools_fts (rowid, title, description, provider, category, notes)
SELECT r.rowid, r.title, r.description, t.provider, t.category, t.notes FROM resources r JOIN tools t ON t.resource_id = r.id WHERE r.slug = 'exa';

-- Product: Browserbase
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('1e8eebe1-285b-44f1-b3b0-42b0c776a38c', 'tool', 'Browserbase', 'Serverless headless browser infrastructure designed specifically to run, manage, and monitor autonomous AI browser agents at scale.', 'browserbase', 0, 'curated', 0, '2026-10-17T10:00:00.000Z', '2026-10-17T10:00:00.000Z');
INSERT OR IGNORE INTO tools (resource_id, kind, url, hostname, provider, category, pricing, notes, favicon_url, verified_at)
SELECT id, 'tool', 'https://www.browserbase.com', 'browserbase.com', 'Browserbase', 'Automation & Workflows', 'Freemium', NULL, NULL, '2026-10-17' FROM resources WHERE slug = 'browserbase';
INSERT OR IGNORE INTO tags (id, name) VALUES ('f5ff198f-4dec-4706-9e69-7398b90b234f', 'headless-browser');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'browserbase' AND t.name = 'headless-browser';
INSERT OR IGNORE INTO tags (id, name) VALUES ('f1f3fd09-0676-4afb-9d75-c0faeaaae3b5', 'ai-agents');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'browserbase' AND t.name = 'ai-agents';
INSERT OR IGNORE INTO tags (id, name) VALUES ('5bd5eb5c-71aa-435d-ae8d-e3d98b46fd59', 'automation');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'browserbase' AND t.name = 'automation';
INSERT OR IGNORE INTO tags (id, name) VALUES ('1fdfccc7-9750-499d-8b35-d4b1bd2a7638', 'infrastructure');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'browserbase' AND t.name = 'infrastructure';
INSERT OR IGNORE INTO tags (id, name) VALUES ('ca65658a-2e2f-4c6e-b0e2-8e9019d30d33', 'puppeteer');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'browserbase' AND t.name = 'puppeteer';
INSERT OR IGNORE INTO tools_fts (rowid, title, description, provider, category, notes)
SELECT r.rowid, r.title, r.description, t.provider, t.category, t.notes FROM resources r JOIN tools t ON t.resource_id = r.id WHERE r.slug = 'browserbase';

-- Product: LlamaParse
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('06000421-6c87-48a9-84f1-0e22c15f3e22', 'tool', 'LlamaParse', 'GenAI-native document parsing service by LlamaIndex that converts complex PDFs with embedded tables, diagrams, and charts into structured data.', 'llamaparse', 1, 'curated', 0, '2026-10-17T10:00:00.000Z', '2026-10-17T10:00:00.000Z');
INSERT OR IGNORE INTO tools (resource_id, kind, url, hostname, provider, category, pricing, notes, favicon_url, verified_at)
SELECT id, 'tool', 'https://cloud.llamaindex.ai', 'cloud.llamaindex.ai', 'LlamaIndex', 'Developer Tools & MCP', 'Freemium', NULL, NULL, '2026-10-17' FROM resources WHERE slug = 'llamaparse';
INSERT OR IGNORE INTO tags (id, name) VALUES ('ca7a8e51-c6f9-4d07-a989-4db80effd307', 'pdf-parser');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'llamaparse' AND t.name = 'pdf-parser';
INSERT OR IGNORE INTO tags (id, name) VALUES ('3ff46f1a-6706-4b0d-9c99-0a998ffe784e', 'documents');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'llamaparse' AND t.name = 'documents';
INSERT OR IGNORE INTO tags (id, name) VALUES ('7236e552-478b-429c-ab6d-089cae174cbf', 'rag');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'llamaparse' AND t.name = 'rag';
INSERT OR IGNORE INTO tags (id, name) VALUES ('ad00fbcd-7a29-430f-9860-fc97f3bfee12', 'llamaindex');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'llamaparse' AND t.name = 'llamaindex';
INSERT OR IGNORE INTO tags (id, name) VALUES ('4aae52a5-bd5a-42f2-b16c-a162ac7f7a99', 'tables');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'llamaparse' AND t.name = 'tables';
INSERT OR IGNORE INTO tools_fts (rowid, title, description, provider, category, notes)
SELECT r.rowid, r.title, r.description, t.provider, t.category, t.notes FROM resources r JOIN tools t ON t.resource_id = r.id WHERE r.slug = 'llamaparse';

-- Product: Docling
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('a6e63c5f-7f3f-4ef3-bf4c-34dc4ce06312', 'tool', 'Docling', 'Open-source document conversion and parsing toolkit by IBM converting PDF, DOCX, and PPTX into clean Markdown and JSON for LLMs.', 'docling', 0, 'curated', 0, '2026-10-17T10:00:00.000Z', '2026-10-17T10:00:00.000Z');
INSERT OR IGNORE INTO tools (resource_id, kind, url, hostname, provider, category, pricing, notes, favicon_url, verified_at)
SELECT id, 'tool', 'https://github.com/DS4SD/docling', 'github.com', 'IBM Research', 'Open Source & Local AI', 'Open Source', NULL, NULL, '2026-10-17' FROM resources WHERE slug = 'docling';
INSERT OR IGNORE INTO tags (id, name) VALUES ('aa4a1331-2435-4970-aace-b3d4010a7cbc', 'document-parsing');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'docling' AND t.name = 'document-parsing';
INSERT OR IGNORE INTO tags (id, name) VALUES ('f0cb2719-6e97-49ac-ba4e-dee0a74b86c5', 'pdf');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'docling' AND t.name = 'pdf';
INSERT OR IGNORE INTO tags (id, name) VALUES ('335812e4-d0d0-405e-a73b-4a8aa76918fb', 'markdown');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'docling' AND t.name = 'markdown';
INSERT OR IGNORE INTO tags (id, name) VALUES ('567100cb-9e69-4c64-9334-50c957a7cc6e', 'open-source');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'docling' AND t.name = 'open-source';
INSERT OR IGNORE INTO tags (id, name) VALUES ('069ca720-7af8-42e6-99fb-cde564741640', 'ibm');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'docling' AND t.name = 'ibm';
INSERT OR IGNORE INTO tools_fts (rowid, title, description, provider, category, notes)
SELECT r.rowid, r.title, r.description, t.provider, t.category, t.notes FROM resources r JOIN tools t ON t.resource_id = r.id WHERE r.slug = 'docling';

-- Product: LangGraph
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('54bf75b2-dc82-43ed-b1b9-00c18ce30bb7', 'tool', 'LangGraph', 'Cyclic computational framework by LangChain for coordinating multi-agent workflows with state persistence, human-in-the-loop, and branching.', 'langgraph', 1, 'curated', 0, '2026-10-17T10:00:00.000Z', '2026-10-17T10:00:00.000Z');
INSERT OR IGNORE INTO tools (resource_id, kind, url, hostname, provider, category, pricing, notes, favicon_url, verified_at)
SELECT id, 'tool', 'https://langchain-ai.github.io/langgraph', 'langchain-ai.github.io', 'LangChain', 'Automation & Workflows', 'Open Source', NULL, NULL, '2026-10-17' FROM resources WHERE slug = 'langgraph';
INSERT OR IGNORE INTO tags (id, name) VALUES ('7809d859-e601-4d73-89d8-82011fff2346', 'multi-agent');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'langgraph' AND t.name = 'multi-agent';
INSERT OR IGNORE INTO tags (id, name) VALUES ('66491b1d-a486-425e-baf3-d6e01b917f5b', 'graph');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'langgraph' AND t.name = 'graph';
INSERT OR IGNORE INTO tags (id, name) VALUES ('fd72e32c-b9ca-4883-8588-4eabd513bf86', 'langchain');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'langgraph' AND t.name = 'langchain';
INSERT OR IGNORE INTO tags (id, name) VALUES ('cdb17c6c-15b6-441d-b2e2-e87af2ea47d5', 'orchestration');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'langgraph' AND t.name = 'orchestration';
INSERT OR IGNORE INTO tags (id, name) VALUES ('70af7be2-ac80-49c0-b62c-69afa3bfac77', 'open-source');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'langgraph' AND t.name = 'open-source';
INSERT OR IGNORE INTO tools_fts (rowid, title, description, provider, category, notes)
SELECT r.rowid, r.title, r.description, t.provider, t.category, t.notes FROM resources r JOIN tools t ON t.resource_id = r.id WHERE r.slug = 'langgraph';

-- Product: DSPy
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('a2b28702-6368-486e-970a-50f2175fd067', 'tool', 'DSPy', 'Stanford NLP framework for algorithmically optimizing LLM prompts and weights instead of manual prompt engineering tricks.', 'dspy', 1, 'curated', 0, '2026-10-17T10:00:00.000Z', '2026-10-17T10:00:00.000Z');
INSERT OR IGNORE INTO tools (resource_id, kind, url, hostname, provider, category, pricing, notes, favicon_url, verified_at)
SELECT id, 'tool', 'https://github.com/stanfordnlp/dspy', 'github.com', 'Stanford NLP', 'Coding', 'Open Source', NULL, NULL, '2026-10-17' FROM resources WHERE slug = 'dspy';
INSERT OR IGNORE INTO tags (id, name) VALUES ('4bc5f5c3-ea3d-4144-a62b-0f12dbc646f8', 'prompt-optimization');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'dspy' AND t.name = 'prompt-optimization';
INSERT OR IGNORE INTO tags (id, name) VALUES ('77dd97c0-cef3-41a7-9334-b415ab049a01', 'stanford');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'dspy' AND t.name = 'stanford';
INSERT OR IGNORE INTO tags (id, name) VALUES ('6abd440c-57e5-41bd-84c0-e4863c860234', 'open-source');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'dspy' AND t.name = 'open-source';
INSERT OR IGNORE INTO tags (id, name) VALUES ('992b6410-de0c-489f-9980-02c04ba7278a', 'nlp');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'dspy' AND t.name = 'nlp';
INSERT OR IGNORE INTO tags (id, name) VALUES ('e32fb9bf-c270-44fc-b1ca-1616e5e6a6da', 'llmops');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'dspy' AND t.name = 'llmops';
INSERT OR IGNORE INTO tools_fts (rowid, title, description, provider, category, notes)
SELECT r.rowid, r.title, r.description, t.provider, t.category, t.notes FROM resources r JOIN tools t ON t.resource_id = r.id WHERE r.slug = 'dspy';

-- Product: Langfuse
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('c0fce54b-15e9-41c4-9f8c-7d78694d3ba3', 'tool', 'Langfuse', 'Open-source LLM engineering and observability platform providing detailed execution tracing, evaluations, prompt management, and metrics.', 'langfuse', 1, 'curated', 0, '2026-10-17T10:00:00.000Z', '2026-10-17T10:00:00.000Z');
INSERT OR IGNORE INTO tools (resource_id, kind, url, hostname, provider, category, pricing, notes, favicon_url, verified_at)
SELECT id, 'tool', 'https://langfuse.com', 'langfuse.com', 'Langfuse', 'Evaluation & Benchmarks', 'Open Source', NULL, NULL, '2026-10-17' FROM resources WHERE slug = 'langfuse';
INSERT OR IGNORE INTO tags (id, name) VALUES ('e2f83789-50b2-44e2-be11-79c2a9256fdf', 'llmops');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'langfuse' AND t.name = 'llmops';
INSERT OR IGNORE INTO tags (id, name) VALUES ('8b12abdf-cd63-4237-8743-9371592c23f7', 'observability');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'langfuse' AND t.name = 'observability';
INSERT OR IGNORE INTO tags (id, name) VALUES ('83cc6d2b-548b-4dbd-98ea-bf3722af648e', 'tracing');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'langfuse' AND t.name = 'tracing';
INSERT OR IGNORE INTO tags (id, name) VALUES ('baaf1a85-47a5-460c-aa8e-a8791a9fe0c2', 'evals');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'langfuse' AND t.name = 'evals';
INSERT OR IGNORE INTO tags (id, name) VALUES ('094f8333-7e87-44e9-890a-7740bbaeb192', 'open-source');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'langfuse' AND t.name = 'open-source';
INSERT OR IGNORE INTO tools_fts (rowid, title, description, provider, category, notes)
SELECT r.rowid, r.title, r.description, t.provider, t.category, t.notes FROM resources r JOIN tools t ON t.resource_id = r.id WHERE r.slug = 'langfuse';

-- Product: Arize Phoenix
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('d079531c-701b-46e9-b7dc-fd20d8074592', 'tool', 'Arize Phoenix', 'AI observability and evaluation library for tracing LLM applications, diagnosing hallucinations, analyzing RAG retrieval, and benchmarking.', 'arize-phoenix', 0, 'curated', 0, '2026-10-17T10:00:00.000Z', '2026-10-17T10:00:00.000Z');
INSERT OR IGNORE INTO tools (resource_id, kind, url, hostname, provider, category, pricing, notes, favicon_url, verified_at)
SELECT id, 'tool', 'https://phoenix.arize.com', 'phoenix.arize.com', 'Arize AI', 'Evaluation & Benchmarks', 'Open Source', NULL, NULL, '2026-10-17' FROM resources WHERE slug = 'arize-phoenix';
INSERT OR IGNORE INTO tags (id, name) VALUES ('47875267-436f-4de5-ae95-3002fcb197ee', 'observability');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'arize-phoenix' AND t.name = 'observability';
INSERT OR IGNORE INTO tags (id, name) VALUES ('3ccb6dcc-3597-4116-87f8-10a330266d6a', 'evals');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'arize-phoenix' AND t.name = 'evals';
INSERT OR IGNORE INTO tags (id, name) VALUES ('2019e9a6-8fd6-4442-8f99-441546e867fa', 'rag');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'arize-phoenix' AND t.name = 'rag';
INSERT OR IGNORE INTO tags (id, name) VALUES ('d50a2e6d-cec5-4619-8bda-3317dcd40379', 'hallucination');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'arize-phoenix' AND t.name = 'hallucination';
INSERT OR IGNORE INTO tags (id, name) VALUES ('7f72056c-02dc-4d56-a596-695bb1fd428b', 'open-source');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'arize-phoenix' AND t.name = 'open-source';
INSERT OR IGNORE INTO tools_fts (rowid, title, description, provider, category, notes)
SELECT r.rowid, r.title, r.description, t.provider, t.category, t.notes FROM resources r JOIN tools t ON t.resource_id = r.id WHERE r.slug = 'arize-phoenix';

-- Product: Weights & Biases
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('40646713-4377-4682-9dfb-70d6fb2fdfad', 'tool', 'Weights & Biases', 'The AI developer platform for tracking machine learning experiments, hyperparameter tuning, model evaluation, and collaborative LLMOps.', 'weights-biases', 0, 'curated', 0, '2026-10-17T10:00:00.000Z', '2026-10-17T10:00:00.000Z');
INSERT OR IGNORE INTO tools (resource_id, kind, url, hostname, provider, category, pricing, notes, favicon_url, verified_at)
SELECT id, 'tool', 'https://wandb.ai', 'wandb.ai', 'Weights & Biases', 'Evaluation & Benchmarks', 'Freemium', NULL, NULL, '2026-10-17' FROM resources WHERE slug = 'weights-biases';
INSERT OR IGNORE INTO tags (id, name) VALUES ('1976eaa9-33cc-4b06-b8eb-78858a55d019', 'mlops');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'weights-biases' AND t.name = 'mlops';
INSERT OR IGNORE INTO tags (id, name) VALUES ('ff2a1b8e-c8a6-4db9-9366-230b34e6449c', 'experiment-tracking');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'weights-biases' AND t.name = 'experiment-tracking';
INSERT OR IGNORE INTO tags (id, name) VALUES ('229acfd2-db70-4a42-a7ff-644e1fe8f9bc', 'llmops');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'weights-biases' AND t.name = 'llmops';
INSERT OR IGNORE INTO tags (id, name) VALUES ('f688ff79-19d0-4414-91f5-bc7d2ca0a4d0', 'evaluation');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'weights-biases' AND t.name = 'evaluation';
INSERT OR IGNORE INTO tags (id, name) VALUES ('d3024145-eb99-4882-b029-f9ef1ba277f6', 'machine-learning');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'weights-biases' AND t.name = 'machine-learning';
INSERT OR IGNORE INTO tools_fts (rowid, title, description, provider, category, notes)
SELECT r.rowid, r.title, r.description, t.provider, t.category, t.notes FROM resources r JOIN tools t ON t.resource_id = r.id WHERE r.slug = 'weights-biases';

-- Product: Railway
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('101e58ae-5822-4805-a688-135f167bf1e5', 'tool', 'Railway', 'Instant cloud platform for deploying full-stack web applications, databases, AI workers, and containerized microservices without DevOps hassle.', 'railway', 1, 'curated', 0, '2026-10-17T10:00:00.000Z', '2026-10-17T10:00:00.000Z');
INSERT OR IGNORE INTO tools (resource_id, kind, url, hostname, provider, category, pricing, notes, favicon_url, verified_at)
SELECT id, 'tool', 'https://railway.app', 'railway.app', 'Railway', 'AI Infrastructure', 'Paid', NULL, NULL, '2026-10-17' FROM resources WHERE slug = 'railway';
INSERT OR IGNORE INTO tags (id, name) VALUES ('821e7cb3-6fc1-4e93-b886-a8526fe3510d', 'cloud-hosting');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'railway' AND t.name = 'cloud-hosting';
INSERT OR IGNORE INTO tags (id, name) VALUES ('84d93a55-6f78-43db-bfe4-b97e37aee581', 'deployment');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'railway' AND t.name = 'deployment';
INSERT OR IGNORE INTO tags (id, name) VALUES ('0777dadd-ee0f-497c-be88-245a15a2e14f', 'databases');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'railway' AND t.name = 'databases';
INSERT OR IGNORE INTO tags (id, name) VALUES ('dd08ef81-26fb-4831-ae58-33317217315b', 'docker');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'railway' AND t.name = 'docker';
INSERT OR IGNORE INTO tags (id, name) VALUES ('fd12b248-eebd-4f04-8de4-98d6c2355016', 'developer-tools');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'railway' AND t.name = 'developer-tools';
INSERT OR IGNORE INTO tools_fts (rowid, title, description, provider, category, notes)
SELECT r.rowid, r.title, r.description, t.provider, t.category, t.notes FROM resources r JOIN tools t ON t.resource_id = r.id WHERE r.slug = 'railway';

-- Product: Render
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('363a5ef8-9f16-4afa-9f49-853fe63f39af', 'tool', 'Render', 'Unified cloud platform to build and run all your apps and websites with free TLS, global CDN, private networks, and managed PostgreSQL.', 'render', 0, 'curated', 0, '2026-10-17T10:00:00.000Z', '2026-10-17T10:00:00.000Z');
INSERT OR IGNORE INTO tools (resource_id, kind, url, hostname, provider, category, pricing, notes, favicon_url, verified_at)
SELECT id, 'tool', 'https://render.com', 'render.com', 'Render', 'AI Infrastructure', 'Freemium', NULL, NULL, '2026-10-17' FROM resources WHERE slug = 'render';
INSERT OR IGNORE INTO tags (id, name) VALUES ('b2916b32-f4a9-4bac-aacf-782f76a3b180', 'cloud-hosting');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'render' AND t.name = 'cloud-hosting';
INSERT OR IGNORE INTO tags (id, name) VALUES ('58746773-0da7-48e2-a729-b4176e74e143', 'deployment');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'render' AND t.name = 'deployment';
INSERT OR IGNORE INTO tags (id, name) VALUES ('511a182b-42bb-4d05-8e4e-c491c901e698', 'postgres');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'render' AND t.name = 'postgres';
INSERT OR IGNORE INTO tags (id, name) VALUES ('c6cae276-da94-40b4-9833-edd4f9c24ef2', 'web-services');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'render' AND t.name = 'web-services';
INSERT OR IGNORE INTO tags (id, name) VALUES ('7454f28f-4866-4168-b6f2-fb85af2e59bb', 'developer-tools');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'render' AND t.name = 'developer-tools';
INSERT OR IGNORE INTO tools_fts (rowid, title, description, provider, category, notes)
SELECT r.rowid, r.title, r.description, t.provider, t.category, t.notes FROM resources r JOIN tools t ON t.resource_id = r.id WHERE r.slug = 'render';

-- Product: Fly.io
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('c9ea9b2f-a5e7-47fd-91b5-3b61c46476dc', 'tool', 'Fly.io', 'Global application platform that transforms Docker containers into microVMs running close to users in cities all over the world.', 'flyio', 0, 'curated', 0, '2026-10-17T10:00:00.000Z', '2026-10-17T10:00:00.000Z');
INSERT OR IGNORE INTO tools (resource_id, kind, url, hostname, provider, category, pricing, notes, favicon_url, verified_at)
SELECT id, 'tool', 'https://fly.io', 'fly.io', 'Fly.io', 'AI Infrastructure', 'Paid', NULL, NULL, '2026-10-17' FROM resources WHERE slug = 'flyio';
INSERT OR IGNORE INTO tags (id, name) VALUES ('35da9012-b692-4af6-bf1f-a05d3b194be2', 'microvm');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'flyio' AND t.name = 'microvm';
INSERT OR IGNORE INTO tags (id, name) VALUES ('a0258a22-cf9e-4533-a6ef-970655296b9b', 'edge');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'flyio' AND t.name = 'edge';
INSERT OR IGNORE INTO tags (id, name) VALUES ('143fe235-60eb-4b1a-b2eb-b39b96bed03d', 'docker');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'flyio' AND t.name = 'docker';
INSERT OR IGNORE INTO tags (id, name) VALUES ('b45212fc-cc11-4ccf-bd27-2e7d69b0650b', 'cloud-hosting');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'flyio' AND t.name = 'cloud-hosting';
INSERT OR IGNORE INTO tags (id, name) VALUES ('01ec3f01-c445-4e08-879f-21221a277074', 'global');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'flyio' AND t.name = 'global';
INSERT OR IGNORE INTO tools_fts (rowid, title, description, provider, category, notes)
SELECT r.rowid, r.title, r.description, t.provider, t.category, t.notes FROM resources r JOIN tools t ON t.resource_id = r.id WHERE r.slug = 'flyio';

-- Product: Tripo3D
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('4fba07b6-04e3-401b-ada2-c77eef7e25c2', 'tool', 'Tripo3D', 'Fast generative AI 3D model platform turning simple text descriptions or single images into production-ready 3D meshes in seconds.', 'tripo3d', 0, 'curated', 0, '2026-10-17T10:00:00.000Z', '2026-10-17T10:00:00.000Z');
INSERT OR IGNORE INTO tools (resource_id, kind, url, hostname, provider, category, pricing, notes, favicon_url, verified_at)
SELECT id, 'tool', 'https://www.tripo3d.ai', 'tripo3d.ai', 'Tripo AI', 'Presentations & Design', 'Freemium', NULL, NULL, '2026-10-17' FROM resources WHERE slug = 'tripo3d';
INSERT OR IGNORE INTO tags (id, name) VALUES ('2448798a-7571-4556-9c63-20466d8336f0', '3d-generation');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'tripo3d' AND t.name = '3d-generation';
INSERT OR IGNORE INTO tags (id, name) VALUES ('520fd7e5-520a-4a59-9e45-59f76b56239c', 'meshes');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'tripo3d' AND t.name = 'meshes';
INSERT OR IGNORE INTO tags (id, name) VALUES ('d9586ce5-f3a2-4561-af93-972b55ee2d32', 'text-to-3d');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'tripo3d' AND t.name = 'text-to-3d';
INSERT OR IGNORE INTO tags (id, name) VALUES ('b94074d4-95f3-4dbe-a1eb-852fbe46bdc0', 'gaming');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'tripo3d' AND t.name = 'gaming';
INSERT OR IGNORE INTO tags (id, name) VALUES ('8f907407-b16e-45bf-a8de-e8d55ea47398', 'design');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'tripo3d' AND t.name = 'design';
INSERT OR IGNORE INTO tools_fts (rowid, title, description, provider, category, notes)
SELECT r.rowid, r.title, r.description, t.provider, t.category, t.notes FROM resources r JOIN tools t ON t.resource_id = r.id WHERE r.slug = 'tripo3d';

-- Product: Meshy
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('45c2d63d-a1b8-4353-bb58-f9b74d40e3fa', 'tool', 'Meshy', 'Generative 3D creation toolkit for game developers and 3D artists, generating textured 3D models from text prompts and 2D images.', 'meshy', 0, 'curated', 0, '2026-10-17T10:00:00.000Z', '2026-10-17T10:00:00.000Z');
INSERT OR IGNORE INTO tools (resource_id, kind, url, hostname, provider, category, pricing, notes, favicon_url, verified_at)
SELECT id, 'tool', 'https://www.meshy.ai', 'meshy.ai', 'Meshy', 'Presentations & Design', 'Freemium', NULL, NULL, '2026-10-17' FROM resources WHERE slug = 'meshy';
INSERT OR IGNORE INTO tags (id, name) VALUES ('e3f92f6f-7e37-4c98-9258-d1902e57f2ba', '3d-assets');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'meshy' AND t.name = '3d-assets';
INSERT OR IGNORE INTO tags (id, name) VALUES ('eead1b8b-675f-4f27-93c3-64c9d34012e9', 'game-dev');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'meshy' AND t.name = 'game-dev';
INSERT OR IGNORE INTO tags (id, name) VALUES ('db22e3e0-d3f0-4365-9c30-f8241e8edac1', 'textures');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'meshy' AND t.name = 'textures';
INSERT OR IGNORE INTO tags (id, name) VALUES ('9fa57b13-a9e6-4a8a-b296-5817cf2011a5', 'text-to-3d');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'meshy' AND t.name = 'text-to-3d';
INSERT OR IGNORE INTO tags (id, name) VALUES ('0340aa72-d9e2-47de-8528-2433023ff4a9', 'design');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'meshy' AND t.name = 'design';
INSERT OR IGNORE INTO tools_fts (rowid, title, description, provider, category, notes)
SELECT r.rowid, r.title, r.description, t.provider, t.category, t.notes FROM resources r JOIN tools t ON t.resource_id = r.id WHERE r.slug = 'meshy';

-- Product: Napkin AI
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('cb5215e4-1137-42f3-a22c-42c2603bc39f', 'tool', 'Napkin AI', 'Visual storytelling tool that transforms written text, concepts, and business documents into engaging diagrams, flowcharts, and infographics.', 'napkin-ai', 1, 'curated', 0, '2026-10-17T10:00:00.000Z', '2026-10-17T10:00:00.000Z');
INSERT OR IGNORE INTO tools (resource_id, kind, url, hostname, provider, category, pricing, notes, favicon_url, verified_at)
SELECT id, 'tool', 'https://www.napkin.ai', 'napkin.ai', 'Napkin', 'Presentations & Design', 'Freemium', NULL, NULL, '2026-10-17' FROM resources WHERE slug = 'napkin-ai';
INSERT OR IGNORE INTO tags (id, name) VALUES ('bf158f8e-1ed5-4a49-8ea6-68182a0c84a0', 'diagrams');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'napkin-ai' AND t.name = 'diagrams';
INSERT OR IGNORE INTO tags (id, name) VALUES ('d7aef1d7-2a1a-484f-843e-2b188251c660', 'infographics');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'napkin-ai' AND t.name = 'infographics';
INSERT OR IGNORE INTO tags (id, name) VALUES ('0da6fcb6-0bf4-45ac-942f-32e865b157ce', 'visual-thinking');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'napkin-ai' AND t.name = 'visual-thinking';
INSERT OR IGNORE INTO tags (id, name) VALUES ('0eefc52c-5c64-4312-b1fc-f2d4028fb0be', 'flowcharts');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'napkin-ai' AND t.name = 'flowcharts';
INSERT OR IGNORE INTO tags (id, name) VALUES ('79d48eda-1b4d-422b-9cea-467d1805a998', 'design');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'napkin-ai' AND t.name = 'design';
INSERT OR IGNORE INTO tools_fts (rowid, title, description, provider, category, notes)
SELECT r.rowid, r.title, r.description, t.provider, t.category, t.notes FROM resources r JOIN tools t ON t.resource_id = r.id WHERE r.slug = 'napkin-ai';

-- Product: Obsidian
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('39094165-588e-4876-92c4-4a2b85ad4a30', 'tool', 'Obsidian', 'Private, flexible local-first markdown note-taking app that adapts to the way you think with local file storage and rich AI plugins.', 'obsidian', 1, 'curated', 0, '2026-10-17T10:00:00.000Z', '2026-10-17T10:00:00.000Z');
INSERT OR IGNORE INTO tools (resource_id, kind, url, hostname, provider, category, pricing, notes, favicon_url, verified_at)
SELECT id, 'tool', 'https://obsidian.md', 'obsidian.md', 'Dynalist', 'Productivity & Notes', 'Free', NULL, NULL, '2026-10-17' FROM resources WHERE slug = 'obsidian';
INSERT OR IGNORE INTO tags (id, name) VALUES ('e351f5f6-0412-4056-9936-4e0eefe0cdb7', 'markdown');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'obsidian' AND t.name = 'markdown';
INSERT OR IGNORE INTO tags (id, name) VALUES ('601e7be6-46d6-45c2-a2cd-802a8f615002', 'local-first');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'obsidian' AND t.name = 'local-first';
INSERT OR IGNORE INTO tags (id, name) VALUES ('607577d2-d37a-4af8-b20b-7df286b37daa', 'pkm');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'obsidian' AND t.name = 'pkm';
INSERT OR IGNORE INTO tags (id, name) VALUES ('3394c437-4aa8-4709-92f9-f0a12fea937e', 'knowledge-base');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'obsidian' AND t.name = 'knowledge-base';
INSERT OR IGNORE INTO tags (id, name) VALUES ('a31b23d0-4c7e-45c3-9be0-dd4b554b6e0d', 'notes');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'obsidian' AND t.name = 'notes';
INSERT OR IGNORE INTO tools_fts (rowid, title, description, provider, category, notes)
SELECT r.rowid, r.title, r.description, t.provider, t.category, t.notes FROM resources r JOIN tools t ON t.resource_id = r.id WHERE r.slug = 'obsidian';

-- Product: AFFiNE
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('6d839eb0-c05e-427a-9e61-d184f7035fa9', 'tool', 'AFFiNE', 'Next-generation open-source workspace merging docs, whiteboards, and database tables with local-first multimodal AI integration.', 'affine', 0, 'curated', 0, '2026-10-17T10:00:00.000Z', '2026-10-17T10:00:00.000Z');
INSERT OR IGNORE INTO tools (resource_id, kind, url, hostname, provider, category, pricing, notes, favicon_url, verified_at)
SELECT id, 'tool', 'https://affine.pro', 'affine.pro', 'Toeverything', 'Productivity & Notes', 'Open Source', NULL, NULL, '2026-10-17' FROM resources WHERE slug = 'affine';
INSERT OR IGNORE INTO tags (id, name) VALUES ('7b54d749-6c95-495a-8ab6-81e738480700', 'workspace');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'affine' AND t.name = 'workspace';
INSERT OR IGNORE INTO tags (id, name) VALUES ('6c6d2323-cb97-489f-9eee-696e82d5362f', 'whiteboard');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'affine' AND t.name = 'whiteboard';
INSERT OR IGNORE INTO tags (id, name) VALUES ('1e579886-fca7-45a4-a663-8a36522a6a31', 'open-source');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'affine' AND t.name = 'open-source';
INSERT OR IGNORE INTO tags (id, name) VALUES ('16e1110a-3660-4a6f-87c4-21690d5c39d6', 'notion-alternative');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'affine' AND t.name = 'notion-alternative';
INSERT OR IGNORE INTO tags (id, name) VALUES ('6c9d39fe-373a-4e51-b76c-95359e0626b1', 'local-first');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'affine' AND t.name = 'local-first';
INSERT OR IGNORE INTO tools_fts (rowid, title, description, provider, category, notes)
SELECT r.rowid, r.title, r.description, t.provider, t.category, t.notes FROM resources r JOIN tools t ON t.resource_id = r.id WHERE r.slug = 'affine';

-- Product: Superwhisper
INSERT OR IGNORE INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
VALUES ('33649435-1b5f-43c4-9724-890e590f2141', 'tool', 'Superwhisper', 'AI-powered voice-to-text dictation application that runs completely offline and locally on your device with high transcription accuracy.', 'superwhisper', 0, 'curated', 0, '2026-10-17T10:00:00.000Z', '2026-10-17T10:00:00.000Z');
INSERT OR IGNORE INTO tools (resource_id, kind, url, hostname, provider, category, pricing, notes, favicon_url, verified_at)
SELECT id, 'tool', 'https://superwhisper.com', 'superwhisper.com', 'Superwhisper', 'Voice & Audio', 'Freemium', NULL, NULL, '2026-10-17' FROM resources WHERE slug = 'superwhisper';
INSERT OR IGNORE INTO tags (id, name) VALUES ('6b8b6cf6-dd16-4a54-b483-08debfb34133', 'dictation');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'superwhisper' AND t.name = 'dictation';
INSERT OR IGNORE INTO tags (id, name) VALUES ('10cbd3fd-5eed-45a3-a08b-7529979d582a', 'voice-to-text');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'superwhisper' AND t.name = 'voice-to-text';
INSERT OR IGNORE INTO tags (id, name) VALUES ('7dee986c-b20e-47a3-9862-e4741b5e0d1f', 'local-ai');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'superwhisper' AND t.name = 'local-ai';
INSERT OR IGNORE INTO tags (id, name) VALUES ('3ef8fd84-4927-43a2-8de7-dd2ceca43e33', 'whisper');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'superwhisper' AND t.name = 'whisper';
INSERT OR IGNORE INTO tags (id, name) VALUES ('4dfa8ef7-48b2-4b28-be95-ab577085b626', 'offline');
INSERT OR IGNORE INTO resource_tags (resource_id, tag_id) SELECT r.id, t.id FROM resources r, tags t WHERE r.slug = 'superwhisper' AND t.name = 'offline';
INSERT OR IGNORE INTO tools_fts (rowid, title, description, provider, category, notes)
SELECT r.rowid, r.title, r.description, t.provider, t.category, t.notes FROM resources r JOIN tools t ON t.resource_id = r.id WHERE r.slug = 'superwhisper';

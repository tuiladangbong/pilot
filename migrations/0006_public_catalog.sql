-- Migration: 0006_public_catalog.sql
-- Description: Public AI catalog enhancements - slug, featured status, provenance origin, and verification date.

-- 1. Add slug, featured, and origin to core resources
ALTER TABLE resources ADD COLUMN slug TEXT;
ALTER TABLE resources ADD COLUMN featured INTEGER NOT NULL DEFAULT 0;
ALTER TABLE resources ADD COLUMN origin TEXT NOT NULL DEFAULT 'curated';

CREATE UNIQUE INDEX IF NOT EXISTS idx_resources_slug ON resources(slug);
CREATE INDEX IF NOT EXISTS idx_resources_featured ON resources(featured);
CREATE INDEX IF NOT EXISTS idx_resources_origin ON resources(origin);

-- 2. Add verified_at to tools
ALTER TABLE tools ADD COLUMN verified_at TEXT;
CREATE INDEX IF NOT EXISTS idx_tools_verified ON tools(verified_at);

-- 3. Backfill initial slugs for existing resources
UPDATE resources SET slug = 'pair-programming-prompt' WHERE id = '307fd293-8d1a-4bc6-9453-7cc3818a6298' AND slug IS NULL;
UPDATE resources SET slug = 'claude' WHERE id = 'a23e972f-f8bb-4e81-813a-c1814818cac6' AND slug IS NULL;
UPDATE resources SET slug = 'artificial-analysis' WHERE id = '653db546-0f78-421a-b903-d1944fe2ffab' AND slug IS NULL;
UPDATE resources SET slug = 'fullstack-feature-delivery' WHERE id = '43340d4c-3e81-4447-8f49-8b22ca1b4dd1' AND slug IS NULL;
UPDATE resources SET slug = 'senior-typescript-architect' WHERE id = 'b6f27f14-4df3-4735-aef5-5cd7004083eb' AND slug IS NULL;

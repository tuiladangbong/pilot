-- Migration: 0003_tools_websites.sql
-- Description: AI Tools & Websites module schema, shared resource favorites, and FTS5 search.

-- 1. Elevate favorites to universal resources metadata
ALTER TABLE resources ADD COLUMN favorite INTEGER NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_resources_favorite ON resources(favorite);

-- Backfill existing favorites from prompts table into resources
UPDATE resources
SET favorite = (SELECT p.favorite FROM prompts p WHERE p.resource_id = resources.id)
WHERE type = 'prompt' AND EXISTS (SELECT 1 FROM prompts p WHERE p.resource_id = resources.id);

-- 2. Tools module-owned table
CREATE TABLE IF NOT EXISTS tools (
    resource_id TEXT PRIMARY KEY NOT NULL,
    kind TEXT NOT NULL,                     -- 'tool' | 'website'
    url TEXT NOT NULL,
    hostname TEXT NOT NULL,
    provider TEXT,
    category TEXT,
    pricing TEXT,                          -- 'Free' | 'Freemium' | 'Paid' | 'Open Source' | 'Unknown'
    notes TEXT,
    favicon_url TEXT,
    FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_tools_kind ON tools(kind);
CREATE INDEX IF NOT EXISTS idx_tools_hostname ON tools(hostname);
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category);
CREATE INDEX IF NOT EXISTS idx_tools_provider ON tools(provider);
CREATE INDEX IF NOT EXISTS idx_tools_pricing ON tools(pricing);

-- 3. Full-Text Search (FTS5) for Tools & Websites
CREATE VIRTUAL TABLE IF NOT EXISTS tools_fts USING fts5(
    resource_id UNINDEXED,
    title,
    description,
    url,
    hostname,
    provider,
    category,
    notes,
    tokenize = 'unicode61 remove_diacritics 2'
);

-- Triggers for tools_fts synchronization
CREATE TRIGGER IF NOT EXISTS trg_tools_fts_insert AFTER INSERT ON tools
BEGIN
    INSERT INTO tools_fts(resource_id, title, description, url, hostname, provider, category, notes)
    SELECT new.resource_id, r.title, COALESCE(r.description, ''), new.url, new.hostname, COALESCE(new.provider, ''), COALESCE(new.category, ''), COALESCE(new.notes, '')
    FROM resources r WHERE r.id = new.resource_id;
END;

CREATE TRIGGER IF NOT EXISTS trg_tools_fts_update_tool AFTER UPDATE ON tools
BEGIN
    UPDATE tools_fts
    SET url = new.url,
        hostname = new.hostname,
        provider = COALESCE(new.provider, ''),
        category = COALESCE(new.category, ''),
        notes = COALESCE(new.notes, '')
    WHERE resource_id = new.resource_id;
END;

CREATE TRIGGER IF NOT EXISTS trg_tools_fts_update_resource AFTER UPDATE OF title, description ON resources
BEGIN
    UPDATE tools_fts
    SET title = new.title,
        description = COALESCE(new.description, '')
    WHERE resource_id = new.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_tools_fts_delete AFTER DELETE ON tools
BEGIN
    DELETE FROM tools_fts WHERE resource_id = old.resource_id;
END;

-- Populate existing tools into FTS (if any exist)
INSERT INTO tools_fts(resource_id, title, description, url, hostname, provider, category, notes)
SELECT t.resource_id, r.title, COALESCE(r.description, ''), t.url, t.hostname, COALESCE(t.provider, ''), COALESCE(t.category, ''), COALESCE(t.notes, '')
FROM tools t
JOIN resources r ON r.id = t.resource_id
WHERE t.resource_id NOT IN (SELECT resource_id FROM tools_fts);

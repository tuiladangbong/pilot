-- Migration: 0002_prompt_module.sql
-- Description: Full-text search (FTS5) for Prompts and performance indexes.

-- Additional query indexes on resources
CREATE INDEX IF NOT EXISTS idx_resources_updated_at ON resources(updated_at);
CREATE INDEX IF NOT EXISTS idx_resources_title ON resources(title);
CREATE INDEX IF NOT EXISTS idx_prompts_model ON prompts(model);

-- Full-Text Search (FTS5) virtual table for prompt search
-- Covers prompt title, description, and content
CREATE VIRTUAL TABLE IF NOT EXISTS prompts_fts USING fts5(
    resource_id UNINDEXED,
    title,
    description,
    content,
    tokenize = 'unicode61 remove_diacritics 2'
);

-- Triggers to maintain prompts_fts index automatically on insert, update, delete

-- On Prompt Insert
CREATE TRIGGER IF NOT EXISTS trg_prompts_fts_insert AFTER INSERT ON prompts
BEGIN
    INSERT INTO prompts_fts(resource_id, title, description, content)
    SELECT new.resource_id, r.title, COALESCE(r.description, ''), new.content
    FROM resources r WHERE r.id = new.resource_id;
END;

-- On Prompt Content Update
CREATE TRIGGER IF NOT EXISTS trg_prompts_fts_update_content AFTER UPDATE OF content ON prompts
BEGIN
    UPDATE prompts_fts
    SET content = new.content
    WHERE resource_id = new.resource_id;
END;

-- On Resource (Title / Description) Update
CREATE TRIGGER IF NOT EXISTS trg_prompts_fts_update_resource AFTER UPDATE ON resources
BEGIN
    UPDATE prompts_fts
    SET title = new.title,
        description = COALESCE(new.description, '')
    WHERE resource_id = new.id;
END;

-- On Prompt Delete
CREATE TRIGGER IF NOT EXISTS trg_prompts_fts_delete AFTER DELETE ON prompts
BEGIN
    DELETE FROM prompts_fts WHERE resource_id = old.resource_id;
END;

-- Populate existing prompts into FTS (if any exist)
INSERT INTO prompts_fts(resource_id, title, description, content)
SELECT p.resource_id, r.title, COALESCE(r.description, ''), p.content
FROM prompts p
JOIN resources r ON r.id = p.resource_id
WHERE p.resource_id NOT IN (SELECT resource_id FROM prompts_fts);

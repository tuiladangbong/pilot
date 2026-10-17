-- Migration: 0005_agents.sql
-- Description: Agents module schema, module-owned table, indexes, and FTS5 search.

-- 1. Agents module-owned table
CREATE TABLE IF NOT EXISTS agents (
    resource_id TEXT PRIMARY KEY NOT NULL,
    role TEXT NOT NULL,
    goal TEXT,
    instructions TEXT NOT NULL,
    runtime TEXT,                                  -- flexible text, e.g. 'Claude Code', 'Antigravity', 'Gemini'
    model TEXT,                                    -- flexible text, e.g. 'Claude 3.5 Sonnet', 'GPT-4o'
    status TEXT NOT NULL DEFAULT 'Active',         -- 'Draft' | 'Active' | 'Archived'
    autonomy_level TEXT NOT NULL DEFAULT 'Manual', -- 'Manual' | 'Assisted' | 'Autonomous'
    input_description TEXT,
    output_description TEXT,
    notes TEXT,
    FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status);
CREATE INDEX IF NOT EXISTS idx_agents_autonomy ON agents(autonomy_level);
CREATE INDEX IF NOT EXISTS idx_agents_runtime ON agents(runtime);
CREATE INDEX IF NOT EXISTS idx_agents_model ON agents(model);

-- 2. Full-Text Search (FTS5) for Agents
CREATE VIRTUAL TABLE IF NOT EXISTS agents_fts USING fts5(
    resource_id UNINDEXED,
    title,
    description,
    role,
    goal,
    instructions,
    runtime,
    model,
    input_description,
    output_description,
    notes,
    tokenize = 'unicode61 remove_diacritics 2'
);

-- Triggers for agents_fts synchronization

-- On Agent Insert
CREATE TRIGGER IF NOT EXISTS trg_agents_fts_insert AFTER INSERT ON agents
BEGIN
    INSERT INTO agents_fts(
        resource_id, title, description, role, goal, instructions,
        runtime, model, input_description, output_description, notes
    )
    SELECT
        new.resource_id,
        r.title,
        COALESCE(r.description, ''),
        new.role,
        COALESCE(new.goal, ''),
        new.instructions,
        COALESCE(new.runtime, ''),
        COALESCE(new.model, ''),
        COALESCE(new.input_description, ''),
        COALESCE(new.output_description, ''),
        COALESCE(new.notes, '')
    FROM resources r WHERE r.id = new.resource_id;
END;

-- On Agent Update
CREATE TRIGGER IF NOT EXISTS trg_agents_fts_update AFTER UPDATE ON agents
BEGIN
    UPDATE agents_fts
    SET role = new.role,
        goal = COALESCE(new.goal, ''),
        instructions = new.instructions,
        runtime = COALESCE(new.runtime, ''),
        model = COALESCE(new.model, ''),
        input_description = COALESCE(new.input_description, ''),
        output_description = COALESCE(new.output_description, ''),
        notes = COALESCE(new.notes, '')
    WHERE resource_id = new.resource_id;
END;

-- On Resource (title / description) Update
CREATE TRIGGER IF NOT EXISTS trg_agents_fts_update_resource AFTER UPDATE OF title, description ON resources
BEGIN
    UPDATE agents_fts
    SET title = new.title,
        description = COALESCE(new.description, '')
    WHERE resource_id = new.id;
END;

-- On Agent Delete
CREATE TRIGGER IF NOT EXISTS trg_agents_fts_delete AFTER DELETE ON agents
BEGIN
    DELETE FROM agents_fts WHERE resource_id = old.resource_id;
END;

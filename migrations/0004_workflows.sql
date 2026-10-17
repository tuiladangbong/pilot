-- Migration: 0004_workflows.sql
-- Description: Workflows module schema, workflow steps, resource relationships, and FTS5 search.

-- 1. Workflows module-owned table
CREATE TABLE IF NOT EXISTS workflows (
    resource_id TEXT PRIMARY KEY NOT NULL,
    purpose TEXT,
    status TEXT NOT NULL DEFAULT 'Active',         -- 'Draft' | 'Active' | 'Archived'
    difficulty TEXT NOT NULL DEFAULT 'Medium',     -- 'Easy' | 'Medium' | 'Advanced'
    estimated_time TEXT,                           -- e.g. '15 min', '1 hour', 'Varies'
    notes TEXT,
    FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_workflows_status ON workflows(status);
CREATE INDEX IF NOT EXISTS idx_workflows_difficulty ON workflows(difficulty);

-- 2. Workflow Steps table
CREATE TABLE IF NOT EXISTS workflow_steps (
    id TEXT PRIMARY KEY NOT NULL,
    workflow_id TEXT NOT NULL,
    position INTEGER NOT NULL,
    title TEXT NOT NULL,
    instruction TEXT NOT NULL,
    notes TEXT,
    optional INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (workflow_id) REFERENCES resources(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_workflow_steps_workflow_id ON workflow_steps(workflow_id);
CREATE INDEX IF NOT EXISTS idx_workflow_steps_pos ON workflow_steps(workflow_id, position);

-- 3. Generic Resource Relationships table (foundational cross-resource linking)
CREATE TABLE IF NOT EXISTS resource_relationships (
    id TEXT PRIMARY KEY NOT NULL,
    source_resource_id TEXT NOT NULL,
    target_resource_id TEXT NOT NULL,
    relationship_type TEXT NOT NULL DEFAULT 'USES',  -- 'USES' | 'REFERENCES'
    step_id TEXT,                                    -- nullable: links to specific workflow step if applicable
    position INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    FOREIGN KEY (source_resource_id) REFERENCES resources(id) ON DELETE CASCADE,
    FOREIGN KEY (target_resource_id) REFERENCES resources(id) ON DELETE CASCADE,
    FOREIGN KEY (step_id) REFERENCES workflow_steps(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_resource_rel_source ON resource_relationships(source_resource_id);
CREATE INDEX IF NOT EXISTS idx_resource_rel_target ON resource_relationships(target_resource_id);
CREATE INDEX IF NOT EXISTS idx_resource_rel_step ON resource_relationships(step_id);

-- 4. Full-Text Search (FTS5) for Workflows
CREATE VIRTUAL TABLE IF NOT EXISTS workflows_fts USING fts5(
    resource_id UNINDEXED,
    title,
    description,
    purpose,
    notes,
    step_text,
    tokenize = 'unicode61 remove_diacritics 2'
);

-- Triggers for workflows_fts synchronization

-- On Workflow Insert
CREATE TRIGGER IF NOT EXISTS trg_workflows_fts_insert AFTER INSERT ON workflows
BEGIN
    INSERT INTO workflows_fts(resource_id, title, description, purpose, notes, step_text)
    SELECT new.resource_id, r.title, COALESCE(r.description, ''), COALESCE(new.purpose, ''), COALESCE(new.notes, ''), ''
    FROM resources r WHERE r.id = new.resource_id;
END;

-- On Workflow (purpose / notes) Update
CREATE TRIGGER IF NOT EXISTS trg_workflows_fts_update AFTER UPDATE OF purpose, notes ON workflows
BEGIN
    UPDATE workflows_fts
    SET purpose = COALESCE(new.purpose, ''),
        notes = COALESCE(new.notes, '')
    WHERE resource_id = new.resource_id;
END;

-- On Resource (title / description) Update
CREATE TRIGGER IF NOT EXISTS trg_workflows_fts_update_resource AFTER UPDATE OF title, description ON resources
BEGIN
    UPDATE workflows_fts
    SET title = new.title,
        description = COALESCE(new.description, '')
    WHERE resource_id = new.id;
END;

-- On Workflow Delete
CREATE TRIGGER IF NOT EXISTS trg_workflows_fts_delete AFTER DELETE ON workflows
BEGIN
    DELETE FROM workflows_fts WHERE resource_id = old.resource_id;
END;

-- On Workflow Steps Insert
CREATE TRIGGER IF NOT EXISTS trg_workflow_steps_fts_insert AFTER INSERT ON workflow_steps
BEGIN
    UPDATE workflows_fts
    SET step_text = (SELECT GROUP_CONCAT(title || ' ' || instruction, ' ') FROM workflow_steps WHERE workflow_id = new.workflow_id)
    WHERE resource_id = new.workflow_id;
END;

-- On Workflow Steps Update
CREATE TRIGGER IF NOT EXISTS trg_workflow_steps_fts_update AFTER UPDATE OF title, instruction ON workflow_steps
BEGIN
    UPDATE workflows_fts
    SET step_text = (SELECT GROUP_CONCAT(title || ' ' || instruction, ' ') FROM workflow_steps WHERE workflow_id = new.workflow_id)
    WHERE resource_id = new.workflow_id;
END;

-- On Workflow Steps Delete
CREATE TRIGGER IF NOT EXISTS trg_workflow_steps_fts_delete AFTER DELETE ON workflow_steps
BEGIN
    UPDATE workflows_fts
    SET step_text = (SELECT COALESCE(GROUP_CONCAT(title || ' ' || instruction, ' '), '') FROM workflow_steps WHERE workflow_id = old.workflow_id)
    WHERE resource_id = old.workflow_id;
END;

-- Populate existing workflows into FTS (if any exist)
INSERT INTO workflows_fts(resource_id, title, description, purpose, notes, step_text)
SELECT w.resource_id, r.title, COALESCE(r.description, ''), COALESCE(w.purpose, ''), COALESCE(w.notes, ''),
       COALESCE((SELECT GROUP_CONCAT(ws.title || ' ' || ws.instruction, ' ') FROM workflow_steps ws WHERE ws.workflow_id = w.resource_id), '')
FROM workflows w
JOIN resources r ON r.id = w.resource_id
WHERE w.resource_id NOT IN (SELECT resource_id FROM workflows_fts);

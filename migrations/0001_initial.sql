-- Migration: 0001_initial.sql
-- Description: Core resources schema, taxonomy (tags), and initial prompts module table.

-- Core Resources: Universally shared metadata for all AI resources
CREATE TABLE IF NOT EXISTS resources (
    id TEXT PRIMARY KEY NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_resources_type ON resources(type);
CREATE INDEX IF NOT EXISTS idx_resources_created_at ON resources(created_at);

-- Tags: Generic taxonomy for organizing resources
CREATE TABLE IF NOT EXISTS tags (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL UNIQUE
);

CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);

-- Resource Tags: Join table linking resources with tags
CREATE TABLE IF NOT EXISTS resource_tags (
    resource_id TEXT NOT NULL,
    tag_id TEXT NOT NULL,
    PRIMARY KEY (resource_id, tag_id),
    FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_resource_tags_tag_id ON resource_tags(tag_id);

-- Prompts: First module-specific table extending core resources
CREATE TABLE IF NOT EXISTS prompts (
    resource_id TEXT PRIMARY KEY NOT NULL,
    content TEXT NOT NULL,
    model TEXT,
    favorite INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (resource_id) REFERENCES resources(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_prompts_favorite ON prompts(favorite);

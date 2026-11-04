import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readdirSync, readFileSync } from 'node:fs';

const dir = new URL('../migrations/', import.meta.url);
const files = readdirSync(dir).filter((f) => /^\d{4}_.*\.sql$/.test(f)).sort();

function migratedDb() {
  const db = new DatabaseSync(':memory:');
  db.exec('PRAGMA foreign_keys = ON');
  for (const f of files) {
    db.exec(readFileSync(new URL(f, dir), 'utf8'));
  }
  return db;
}

test('migrations are numbered contiguously from 0001', () => {
  files.forEach((f, i) => assert.equal(f.slice(0, 4), String(i + 1).padStart(4, '0')));
});

test('all migrations apply in order on an empty SQLite database (incl. FTS5 + triggers)', () => {
  const db = migratedDb();
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type IN ('table','view')").all().map((r) => r.name);
  for (const t of ['resources', 'tags', 'resource_tags', 'prompts', 'tools', 'workflows', 'workflow_steps', 'agents', 'resource_relationships', 'prompts_fts', 'tools_fts', 'workflows_fts', 'agents_fts']) {
    assert.ok(tables.includes(t), `missing table ${t}`);
  }
});

test('resources.slug is unique', () => {
  const db = migratedDb();
  const now = new Date().toISOString();
  const ins = db.prepare("INSERT INTO resources (id, type, title, slug, created_at, updated_at) VALUES (?, 'tool', 't', ?, ?, ?)");
  ins.run('slug-test-1', 'unique-slug-xyz', now, now);
  assert.throws(() => ins.run('slug-test-2', 'unique-slug-xyz', now, now));
});

test('FTS stays in sync: inserted tool is searchable and removed on delete', () => {
  const db = migratedDb();
  const now = new Date().toISOString();
  db.prepare("INSERT INTO resources (id, type, title, description, created_at, updated_at) VALUES ('fts-1', 'tool', 'Zanzibarium', 'unique marker', ?, ?)").run(now, now);
  db.prepare("INSERT INTO tools (resource_id, url, hostname, kind) VALUES ('fts-1', 'https://example.com', 'example.com', 'tool')").run();
  const hit = db.prepare("SELECT resource_id FROM tools_fts WHERE tools_fts MATCH '\"zanzibarium\"*'").all();
  assert.equal(hit.length, 1);
  db.prepare("DELETE FROM resources WHERE id = 'fts-1'").run();
  const after = db.prepare("SELECT resource_id FROM tools_fts WHERE tools_fts MATCH '\"zanzibarium\"*'").all();
  assert.equal(after.length, 0);
});

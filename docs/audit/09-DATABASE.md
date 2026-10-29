# 09 — Database & Query Performance Audit

## D1 (SQLite Engine) Audit

- **Binding Name:** `DB`
- **Database Name:** `pilot-db`
- **Database UUID:** `f2e24f4a-d8c8-4d42-ae32-14d9861e13f3`
- **Dialect:** SQLite 3 + FTS5 full-text search

---

## Critical Query Finding: Cartesian Join Explosion (`AUD-PERF-001`)

### Finding Reference
- **Location:** `src/adapters/persistence/d1/D1ResourceRepository.ts` lines 206-230.
- **Severity:** P1 (High Scalability / Latency Risk)

### Query Snippet
```sql
SELECT r.id, r.type, r.title, r.description, r.slug, r.featured, r.origin, r.favorite, r.created_at, r.updated_at,
       GROUP_CONCAT(DISTINCT t.name) as tag_names,
       p.content as prompt_content, p.model as prompt_model,
       tl.url as tool_url, tl.hostname as tool_hostname, tl.kind as tool_kind,
       tl.category as tool_category, tl.pricing as tool_pricing, tl.verified_at as tool_verified_at,
       w.purpose as workflow_purpose, w.status as workflow_status,
       w.difficulty as workflow_difficulty, w.estimated_time as workflow_estimated_time,
       COUNT(DISTINCT ws.id) as workflow_step_count,
       ag.role as agent_role, ag.goal as agent_goal, ag.runtime as agent_runtime,
       ag.model as agent_model, ag.status as agent_status, ag.autonomy_level as agent_autonomy_level
FROM resources r
LEFT JOIN prompts p ON p.resource_id = r.id
LEFT JOIN tools tl ON tl.resource_id = r.id
LEFT JOIN workflows w ON w.resource_id = r.id
LEFT JOIN workflow_steps ws ON ws.workflow_id = r.id
LEFT JOIN agents ag ON ag.resource_id = r.id
LEFT JOIN resource_tags rt ON rt.resource_id = r.id
LEFT JOIN tags t ON t.id = rt.tag_id
WHERE ...
GROUP BY r.id
ORDER BY r.updated_at DESC
LIMIT ? OFFSET ?
```

### Analysis & Mechanics
1. **Cartesian Product Problem:**
   - Both `workflow_steps` (1:N) and `resource_tags` (1:M) are joined at the same query level.
   - For a workflow with 8 steps and 6 tags, SQLite computes $8 \times 6 = 48$ intermediate joined rows before applying `GROUP BY r.id`, `COUNT(DISTINCT ws.id)`, and `GROUP_CONCAT(DISTINCT t.name)`.
   - As catalog size grows, this Cartesian product across multiple one-to-many tables in SQLite causes quadratic intermediate row generation, burning CPU and memory in edge workers.
2. **Missing Index for Foreign Keys:**
   - `workflow_steps` has an index on `workflow_id` (`idx_workflow_steps_workflow_id`).
   - However, `workflow_resources` and `resource_relationships` require compound indexes on `(from_resource_id, relationship_type)` to accelerate graph traversals.

### Recommended Refactoring
Replace the Cartesian join with scalar subqueries or split query aggregation:
```sql
SELECT r.id, r.type, r.title, r.description, r.slug, r.featured, r.origin, r.favorite, r.created_at, r.updated_at,
       (SELECT GROUP_CONCAT(t.name) FROM resource_tags rt JOIN tags t ON t.id = rt.tag_id WHERE rt.resource_id = r.id) as tag_names,
       (SELECT COUNT(*) FROM workflow_steps ws WHERE ws.workflow_id = r.id) as workflow_step_count,
       p.content as prompt_content, p.model as prompt_model,
       tl.url as tool_url, tl.hostname as tool_hostname, tl.kind as tool_kind,
       tl.category as tool_category, tl.pricing as tool_pricing, tl.verified_at as tool_verified_at,
       w.purpose as workflow_purpose, w.status as workflow_status, w.difficulty as workflow_difficulty, w.estimated_time as workflow_estimated_time,
       ag.role as agent_role, ag.goal as agent_goal, ag.runtime as agent_runtime, ag.model as agent_model, ag.status as agent_status, ag.autonomy_level as agent_autonomy_level
FROM resources r
LEFT JOIN prompts p ON p.resource_id = r.id
LEFT JOIN tools tl ON tl.resource_id = r.id
LEFT JOIN workflows w ON w.resource_id = r.id
LEFT JOIN agents ag ON ag.resource_id = r.id
WHERE ...
ORDER BY r.updated_at DESC
LIMIT ? OFFSET ?
```
This produces linear $O(N)$ row scans instead of polynomial $O(N \times M)$ memory inflation.

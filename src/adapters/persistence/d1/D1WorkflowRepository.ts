import {
  LinkedResourceSummary,
  Workflow,
  WorkflowDifficulty,
  WorkflowStatus,
  WorkflowStep,
} from '../../../modules/workflows/domain/Workflow';
import {
  ListWorkflowsFilter,
  WorkflowRepository,
} from '../../../modules/workflows/ports/WorkflowRepository';
import { TagWithCount } from '../../../modules/prompts/ports/PromptRepository';

interface WorkflowRow {
  id: string;
  title: string;
  description: string | null;
  purpose: string | null;
  status: string;
  difficulty: string;
  estimated_time: string | null;
  notes: string | null;
  favorite: number;
  tag_names: string | null;
  step_count: number;
  created_at: string;
  updated_at: string;
}

interface StepRow {
  id: string;
  workflow_id: string;
  position: number;
  title: string;
  instruction: string;
  notes: string | null;
  optional: number;
  created_at: string;
  updated_at: string;
}

interface RelationshipRow {
  id: string;
  source_resource_id: string;
  target_resource_id: string;
  relationship_type: string;
  step_id: string | null;
  position: number;
  target_title: string;
  target_type: string;
  target_description: string | null;
  target_model: string | null;
  target_url: string | null;
}

export class D1WorkflowRepository implements WorkflowRepository {
  constructor(private readonly db: D1Database) {}

  private sanitizeFtsQuery(q: string): string {
    const tokens = q
      .trim()
      .split(/\s+/)
      .map((t) => t.replace(/["*]/g, ''))
      .filter((t) => t.length > 0);

    if (tokens.length === 0) return '';
    return tokens.map((t) => `"${t}"*`).join(' ');
  }

  async findById(id: string): Promise<Workflow | null> {
    const query = `
      SELECT r.id, r.title, r.description, r.favorite, r.created_at, r.updated_at,
             w.purpose, w.status, w.difficulty, w.estimated_time, w.notes,
             GROUP_CONCAT(DISTINCT tg.name) as tag_names,
             COUNT(DISTINCT ws.id) as step_count
      FROM resources r
      JOIN workflows w ON w.resource_id = r.id
      LEFT JOIN resource_tags rt ON rt.resource_id = r.id
      LEFT JOIN tags tg ON tg.id = rt.tag_id
      LEFT JOIN workflow_steps ws ON ws.workflow_id = r.id
      WHERE r.id = ?
      GROUP BY r.id
    `;

    const row = await this.db.prepare(query).bind(id).first<WorkflowRow>();
    if (!row) {
      return null;
    }

    // Load steps
    const stepsQuery = `
      SELECT id, workflow_id, position, title, instruction, notes, optional, created_at, updated_at
      FROM workflow_steps
      WHERE workflow_id = ?
      ORDER BY position ASC
    `;
    const { results: stepResults } = await this.db.prepare(stepsQuery).bind(id).all<StepRow>();
    const stepRows = stepResults ?? [];

    // Load relationships (both step-level and workflow-level)
    const relQuery = `
      SELECT rel.id, rel.source_resource_id, rel.target_resource_id, rel.relationship_type, rel.step_id, rel.position,
             tr.title as target_title, tr.type as target_type, tr.description as target_description,
             tp.model as target_model,
             tt.url as target_url
      FROM resource_relationships rel
      JOIN resources tr ON tr.id = rel.target_resource_id
      LEFT JOIN prompts tp ON tp.resource_id = tr.id
      LEFT JOIN tools tt ON tt.resource_id = tr.id
      WHERE rel.source_resource_id = ?
      ORDER BY rel.position ASC, rel.created_at ASC
    `;
    const { results: relResults } = await this.db.prepare(relQuery).bind(id).all<RelationshipRow>();
    const relRows = relResults ?? [];

    // Group relationships by stepId or workflow-level
    const stepRelMap = new Map<string, LinkedResourceSummary[]>();
    const workflowRels: LinkedResourceSummary[] = [];

    for (const rel of relRows) {
      const summary: LinkedResourceSummary = {
        id: rel.id,
        resourceId: rel.target_resource_id,
        relationshipType: (rel.relationship_type === 'REFERENCES' ? 'REFERENCES' : 'USES'),
        stepId: rel.step_id,
        title: rel.target_title,
        type: rel.target_type,
        description: rel.target_description,
        model: rel.target_model,
        url: rel.target_url,
      };

      if (rel.step_id) {
        if (!stepRelMap.has(rel.step_id)) {
          stepRelMap.set(rel.step_id, []);
        }
        stepRelMap.get(rel.step_id)!.push(summary);
      } else {
        workflowRels.push(summary);
      }
    }

    const steps: WorkflowStep[] = stepRows.map((s) => ({
      id: s.id,
      workflowId: s.workflow_id,
      position: s.position,
      title: s.title,
      instruction: s.instruction,
      notes: s.notes,
      optional: Boolean(s.optional),
      linkedResources: stepRelMap.get(s.id) || [],
      createdAt: s.created_at,
      updatedAt: s.updated_at,
    }));

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      purpose: row.purpose,
      status: (row.status as WorkflowStatus) || 'Active',
      difficulty: (row.difficulty as WorkflowDifficulty) || 'Medium',
      estimatedTime: row.estimated_time,
      notes: row.notes,
      favorite: Boolean(row.favorite),
      tags: row.tag_names ? row.tag_names.split(',').filter(Boolean) : [],
      steps,
      linkedResources: workflowRels,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async list(filter?: ListWorkflowsFilter): Promise<{ workflows: Workflow[]; total: number }> {
    const limit = Math.min(Math.max(filter?.limit ?? 50, 1), 500);
    const offset = Math.max(filter?.offset ?? 0, 0);

    const conditions: string[] = ['r.type = ?'];
    const bindings: (string | number)[] = ['workflow'];

    if (filter?.status && filter.status.trim() !== '') {
      conditions.push('w.status = ?');
      bindings.push(filter.status);
    }

    if (filter?.difficulty && filter.difficulty.trim() !== '') {
      conditions.push('w.difficulty = ?');
      bindings.push(filter.difficulty);
    }

    if (filter?.favorite !== undefined) {
      conditions.push('r.favorite = ?');
      bindings.push(filter.favorite ? 1 : 0);
    }

    if (filter?.tag && filter.tag.trim() !== '') {
      conditions.push(`EXISTS (
        SELECT 1 FROM resource_tags rt2
        JOIN tags t2 ON t2.id = rt2.tag_id
        WHERE rt2.resource_id = r.id AND t2.name = ?
      )`);
      bindings.push(filter.tag.trim().toLowerCase());
    }

    const rawQ = filter?.q?.trim();
    if (rawQ) {
      const ftsFormatted = this.sanitizeFtsQuery(rawQ);
      if (ftsFormatted) {
        conditions.push('r.id IN (SELECT resource_id FROM workflows_fts WHERE workflows_fts MATCH ?)');
        bindings.push(ftsFormatted);
      } else {
        conditions.push(`(
          r.title LIKE ? OR r.description LIKE ? OR w.purpose LIKE ? OR w.notes LIKE ?
          OR EXISTS (
            SELECT 1 FROM workflow_steps ws2
            WHERE ws2.workflow_id = r.id AND (ws2.title LIKE ? OR ws2.instruction LIKE ?)
          )
        )`);
        const likeTerm = `%${rawQ}%`;
        bindings.push(likeTerm, likeTerm, likeTerm, likeTerm, likeTerm, likeTerm);
      }
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Total Count
    const countSql = `
      SELECT COUNT(DISTINCT r.id) as total
      FROM resources r
      JOIN workflows w ON w.resource_id = r.id
      ${whereClause}
    `;
    const countResult = await this.db.prepare(countSql).bind(...bindings).first<{ total: number }>();
    const total = countResult?.total ?? 0;

    // Sorting
    let orderBy = 'r.updated_at DESC';
    const orderDirection = filter?.order === 'asc' ? 'ASC' : 'DESC';
    if (filter?.sort === 'created_at') {
      orderBy = `r.created_at ${orderDirection}`;
    } else if (filter?.sort === 'title') {
      orderBy = `r.title COLLATE NOCASE ${orderDirection}`;
    } else {
      orderBy = `r.updated_at ${orderDirection}`;
    }

    const dataSql = `
      SELECT r.id, r.title, r.description, r.favorite, r.created_at, r.updated_at,
             w.purpose, w.status, w.difficulty, w.estimated_time, w.notes,
             GROUP_CONCAT(DISTINCT tg.name) as tag_names,
             COUNT(DISTINCT ws.id) as step_count
      FROM resources r
      JOIN workflows w ON w.resource_id = r.id
      LEFT JOIN resource_tags rt ON rt.resource_id = r.id
      LEFT JOIN tags tg ON tg.id = rt.tag_id
      LEFT JOIN workflow_steps ws ON ws.workflow_id = r.id
      ${whereClause}
      GROUP BY r.id
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `;

    const dataStmt = this.db.prepare(dataSql).bind(...bindings, limit, offset);
    const { results } = await dataStmt.all<WorkflowRow>();
    const workflowRows = results ?? [];

    if (workflowRows.length === 0) {
      return { workflows: [], total };
    }

    // Fetch steps for all returned workflows
    const workflowIds = workflowRows.map((r) => r.id);
    const placeholders = workflowIds.map(() => '?').join(',');

    const stepsSql = `
      SELECT id, workflow_id, position, title, instruction, notes, optional, created_at, updated_at
      FROM workflow_steps
      WHERE workflow_id IN (${placeholders})
      ORDER BY workflow_id, position ASC
    `;
    const { results: stepResults } = await this.db.prepare(stepsSql).bind(...workflowIds).all<StepRow>();
    const stepRows = stepResults ?? [];

    // Fetch relationships for all returned workflows
    const relsSql = `
      SELECT rel.id, rel.source_resource_id, rel.target_resource_id, rel.relationship_type, rel.step_id, rel.position,
             tr.title as target_title, tr.type as target_type, tr.description as target_description,
             tp.model as target_model,
             tt.url as target_url
      FROM resource_relationships rel
      JOIN resources tr ON tr.id = rel.target_resource_id
      LEFT JOIN prompts tp ON tp.resource_id = tr.id
      LEFT JOIN tools tt ON tt.resource_id = tr.id
      WHERE rel.source_resource_id IN (${placeholders})
      ORDER BY rel.position ASC, rel.created_at ASC
    `;
    const { results: relResults } = await this.db.prepare(relsSql).bind(...workflowIds).all<RelationshipRow>();
    const relRows = relResults ?? [];

    const stepRelMap = new Map<string, LinkedResourceSummary[]>();
    const workflowRelMap = new Map<string, LinkedResourceSummary[]>();

    for (const rel of relRows) {
      const summary: LinkedResourceSummary = {
        id: rel.id,
        resourceId: rel.target_resource_id,
        relationshipType: (rel.relationship_type === 'REFERENCES' ? 'REFERENCES' : 'USES'),
        stepId: rel.step_id,
        title: rel.target_title,
        type: rel.target_type,
        description: rel.target_description,
        model: rel.target_model,
        url: rel.target_url,
      };

      if (rel.step_id) {
        if (!stepRelMap.has(rel.step_id)) {
          stepRelMap.set(rel.step_id, []);
        }
        stepRelMap.get(rel.step_id)!.push(summary);
      } else {
        if (!workflowRelMap.has(rel.source_resource_id)) {
          workflowRelMap.set(rel.source_resource_id, []);
        }
        workflowRelMap.get(rel.source_resource_id)!.push(summary);
      }
    }

    const stepsByWorkflow = new Map<string, WorkflowStep[]>();
    for (const s of stepRows) {
      if (!stepsByWorkflow.has(s.workflow_id)) {
        stepsByWorkflow.set(s.workflow_id, []);
      }
      stepsByWorkflow.get(s.workflow_id)!.push({
        id: s.id,
        workflowId: s.workflow_id,
        position: s.position,
        title: s.title,
        instruction: s.instruction,
        notes: s.notes,
        optional: Boolean(s.optional),
        linkedResources: stepRelMap.get(s.id) || [],
        createdAt: s.created_at,
        updatedAt: s.updated_at,
      });
    }

    const workflows: Workflow[] = workflowRows.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      purpose: r.purpose,
      status: (r.status as WorkflowStatus) || 'Active',
      difficulty: (r.difficulty as WorkflowDifficulty) || 'Medium',
      estimatedTime: r.estimated_time,
      notes: r.notes,
      favorite: Boolean(r.favorite),
      tags: r.tag_names ? r.tag_names.split(',').filter(Boolean) : [],
      steps: stepsByWorkflow.get(r.id) || [],
      linkedResources: workflowRelMap.get(r.id) || [],
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));

    return { workflows, total };
  }

  async save(
    workflow: Workflow,
    stepResourceLinks?: { stepId: string; targetResourceIds: string[] }[],
    workflowResourceLinks?: string[]
  ): Promise<void> {
    const statements: D1PreparedStatement[] = [];

    // 1. Insert into resources
    statements.push(
      this.db
        .prepare(
          `INSERT INTO resources (id, type, title, description, favorite, created_at, updated_at)
           VALUES (?, 'workflow', ?, ?, ?, ?, ?)`
        )
        .bind(
          workflow.id,
          workflow.title,
          workflow.description,
          workflow.favorite ? 1 : 0,
          workflow.createdAt,
          workflow.updatedAt
        )
    );

    // 2. Insert into workflows
    statements.push(
      this.db
        .prepare(
          `INSERT INTO workflows (resource_id, purpose, status, difficulty, estimated_time, notes)
           VALUES (?, ?, ?, ?, ?, ?)`
        )
        .bind(
          workflow.id,
          workflow.purpose,
          workflow.status,
          workflow.difficulty,
          workflow.estimatedTime,
          workflow.notes
        )
    );

    // 3. Insert tags
    for (const tag of workflow.tags) {
      const tagId = crypto.randomUUID();
      statements.push(
        this.db
          .prepare(`INSERT INTO tags (id, name) VALUES (?, ?) ON CONFLICT(name) DO NOTHING`)
          .bind(tagId, tag)
      );
      statements.push(
        this.db
          .prepare(
            `INSERT INTO resource_tags (resource_id, tag_id)
             VALUES (?, (SELECT id FROM tags WHERE name = ?))
             ON CONFLICT DO NOTHING`
          )
          .bind(workflow.id, tag)
      );
    }

    // 4. Insert steps
    for (const step of workflow.steps) {
      statements.push(
        this.db
          .prepare(
            `INSERT INTO workflow_steps (id, workflow_id, position, title, instruction, notes, optional, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
          )
          .bind(
            step.id,
            workflow.id,
            step.position,
            step.title,
            step.instruction,
            step.notes,
            step.optional ? 1 : 0,
            step.createdAt,
            step.updatedAt
          )
      );
    }

    // 5. Insert step resource relationships
    if (stepResourceLinks && Array.isArray(stepResourceLinks)) {
      for (const linkGroup of stepResourceLinks) {
        if (!linkGroup.targetResourceIds) continue;
        linkGroup.targetResourceIds.forEach((targetId, pos) => {
          const relId = crypto.randomUUID();
          statements.push(
            this.db
              .prepare(
                `INSERT INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
                 VALUES (?, ?, ?, 'USES', ?, ?, ?)`
              )
              .bind(relId, workflow.id, targetId, linkGroup.stepId, pos, workflow.createdAt)
          );
        });
      }
    }

    // 6. Insert workflow-level resource relationships
    if (workflowResourceLinks && Array.isArray(workflowResourceLinks)) {
      workflowResourceLinks.forEach((targetId, pos) => {
        const relId = crypto.randomUUID();
        statements.push(
          this.db
            .prepare(
              `INSERT INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
               VALUES (?, ?, ?, 'USES', NULL, ?, ?)`
            )
            .bind(relId, workflow.id, targetId, pos, workflow.createdAt)
        );
      });
    }

    await this.db.batch(statements);
  }

  async update(
    workflow: Workflow,
    stepResourceLinks?: { stepId: string; targetResourceIds: string[] }[],
    workflowResourceLinks?: string[]
  ): Promise<void> {
    const statements: D1PreparedStatement[] = [];

    // 1. Update resources
    statements.push(
      this.db
        .prepare(
          `UPDATE resources
           SET title = ?, description = ?, favorite = ?, updated_at = ?
           WHERE id = ?`
        )
        .bind(
          workflow.title,
          workflow.description,
          workflow.favorite ? 1 : 0,
          workflow.updatedAt,
          workflow.id
        )
    );

    // 2. Update workflows
    statements.push(
      this.db
        .prepare(
          `UPDATE workflows
           SET purpose = ?, status = ?, difficulty = ?, estimated_time = ?, notes = ?
           WHERE resource_id = ?`
        )
        .bind(
          workflow.purpose,
          workflow.status,
          workflow.difficulty,
          workflow.estimatedTime,
          workflow.notes,
          workflow.id
        )
    );

    // 3. Reset and update tags
    statements.push(
      this.db.prepare('DELETE FROM resource_tags WHERE resource_id = ?').bind(workflow.id)
    );
    for (const tag of workflow.tags) {
      const tagId = crypto.randomUUID();
      statements.push(
        this.db
          .prepare(`INSERT INTO tags (id, name) VALUES (?, ?) ON CONFLICT(name) DO NOTHING`)
          .bind(tagId, tag)
      );
      statements.push(
        this.db
          .prepare(
            `INSERT INTO resource_tags (resource_id, tag_id)
             VALUES (?, (SELECT id FROM tags WHERE name = ?))
             ON CONFLICT DO NOTHING`
          )
          .bind(workflow.id, tag)
      );
    }

    // 4. Update steps if provided
    // Deleting workflow_steps cascades to delete step-level resource_relationships (via ON DELETE CASCADE)
    statements.push(
      this.db.prepare('DELETE FROM workflow_steps WHERE workflow_id = ?').bind(workflow.id)
    );

    for (const step of workflow.steps) {
      statements.push(
        this.db
          .prepare(
            `INSERT INTO workflow_steps (id, workflow_id, position, title, instruction, notes, optional, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
          )
          .bind(
            step.id,
            workflow.id,
            step.position,
            step.title,
            step.instruction,
            step.notes,
            step.optional ? 1 : 0,
            step.createdAt,
            step.updatedAt
          )
      );
    }

    // 5. Update step relationships
    if (stepResourceLinks && Array.isArray(stepResourceLinks)) {
      for (const linkGroup of stepResourceLinks) {
        if (!linkGroup.targetResourceIds) continue;
        linkGroup.targetResourceIds.forEach((targetId, pos) => {
          const relId = crypto.randomUUID();
          statements.push(
            this.db
              .prepare(
                `INSERT INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
                 VALUES (?, ?, ?, 'USES', ?, ?, ?)`
              )
              .bind(relId, workflow.id, targetId, linkGroup.stepId, pos, workflow.updatedAt)
          );
        });
      }
    }

    // 6. Update workflow-level relationships
    if (workflowResourceLinks !== undefined) {
      statements.push(
        this.db
          .prepare(
            'DELETE FROM resource_relationships WHERE source_resource_id = ? AND step_id IS NULL'
          )
          .bind(workflow.id)
      );

      workflowResourceLinks.forEach((targetId, pos) => {
        const relId = crypto.randomUUID();
        statements.push(
          this.db
            .prepare(
              `INSERT INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
               VALUES (?, ?, ?, 'USES', NULL, ?, ?)`
            )
            .bind(relId, workflow.id, targetId, pos, workflow.updatedAt)
        );
      });
    }

    await this.db.batch(statements);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.db.prepare('DELETE FROM resources WHERE id = ?').bind(id).run();
    return (result.meta.changes ?? 0) > 0;
  }

  async setFavorite(id: string, favorite: boolean): Promise<boolean> {
    const now = new Date().toISOString();
    const result = await this.db
      .prepare('UPDATE resources SET favorite = ?, updated_at = ? WHERE id = ?')
      .bind(favorite ? 1 : 0, now, id)
      .run();
    return (result.meta.changes ?? 0) > 0;
  }

  async getAllTags(): Promise<TagWithCount[]> {
    const query = `
      SELECT t.id, t.name, COUNT(DISTINCT r.id) as count
      FROM tags t
      JOIN resource_tags rt ON rt.tag_id = t.id
      JOIN resources r ON r.id = rt.resource_id
      WHERE r.type = 'workflow'
      GROUP BY t.id, t.name
      ORDER BY count DESC, t.name ASC
    `;
    const { results } = await this.db.prepare(query).all<{ id: string; name: string; count: number }>();
    return (results ?? []).map((row) => ({
      id: row.id,
      name: row.name,
      count: row.count,
    }));
  }
}

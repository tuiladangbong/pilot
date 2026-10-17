import {
  Agent,
  AgentAutonomyLevel,
  AgentRelationshipType,
  AgentStatus,
  LinkedResourceSummary,
  validateAutonomyLevel,
  validateRelationshipType,
  validateStatus,
} from '../../../modules/agents/domain/Agent';
import {
  AgentRepository,
  ListAgentsFilter,
} from '../../../modules/agents/ports/AgentRepository';
import { TagWithCount } from '../../../modules/prompts/ports/PromptRepository';

interface AgentRow {
  id: string;
  title: string;
  description: string | null;
  role: string;
  goal: string | null;
  instructions: string;
  runtime: string | null;
  model: string | null;
  status: string;
  autonomy_level: string;
  input_description: string | null;
  output_description: string | null;
  notes: string | null;
  favorite: number;
  tag_names: string | null;
  created_at: string;
  updated_at: string;
}

interface RelationshipRow {
  id: string;
  source_resource_id: string;
  target_resource_id: string;
  relationship_type: string;
  position: number;
  target_title: string;
  target_type: string;
  target_description: string | null;
  target_model: string | null;
  target_url: string | null;
  target_role: string | null;
}

export class D1AgentRepository implements AgentRepository {
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

  async findById(id: string): Promise<Agent | null> {
    const query = `
      SELECT r.id, r.title, r.description, r.favorite, r.created_at, r.updated_at,
             a.role, a.goal, a.instructions, a.runtime, a.model, a.status,
             a.autonomy_level, a.input_description, a.output_description, a.notes,
             GROUP_CONCAT(DISTINCT tg.name) as tag_names
      FROM resources r
      JOIN agents a ON a.resource_id = r.id
      LEFT JOIN resource_tags rt ON rt.resource_id = r.id
      LEFT JOIN tags tg ON tg.id = rt.tag_id
      WHERE r.id = ?
      GROUP BY r.id
    `;

    const row = await this.db.prepare(query).bind(id).first<AgentRow>();
    if (!row) {
      return null;
    }

    // Load relationships
    const relQuery = `
      SELECT rel.id, rel.source_resource_id, rel.target_resource_id, rel.relationship_type, rel.position,
             tr.title as target_title, tr.type as target_type, tr.description as target_description,
             tp.model as target_model,
             tt.url as target_url,
             ta.role as target_role
      FROM resource_relationships rel
      JOIN resources tr ON tr.id = rel.target_resource_id
      LEFT JOIN prompts tp ON tp.resource_id = tr.id
      LEFT JOIN tools tt ON tt.resource_id = tr.id
      LEFT JOIN agents ta ON ta.resource_id = tr.id
      WHERE rel.source_resource_id = ?
      ORDER BY rel.position ASC, rel.created_at ASC
    `;
    const { results: relResults } = await this.db.prepare(relQuery).bind(id).all<RelationshipRow>();
    const relRows = relResults ?? [];

    const linkedResources: LinkedResourceSummary[] = relRows.map((rel) => ({
      id: rel.id,
      resourceId: rel.target_resource_id,
      relationshipType: validateRelationshipType(rel.relationship_type),
      title: rel.target_title,
      type: rel.target_type,
      description: rel.target_description,
      model: rel.target_model,
      url: rel.target_url,
      role: rel.target_role,
    }));

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      role: row.role,
      goal: row.goal,
      instructions: row.instructions,
      runtime: row.runtime,
      model: row.model,
      status: validateStatus(row.status),
      autonomyLevel: validateAutonomyLevel(row.autonomy_level),
      inputDescription: row.input_description,
      outputDescription: row.output_description,
      notes: row.notes,
      favorite: Boolean(row.favorite),
      tags: row.tag_names ? row.tag_names.split(',').filter(Boolean) : [],
      linkedResources,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async list(filter?: ListAgentsFilter): Promise<{ agents: Agent[]; total: number }> {
    const limit = Math.min(Math.max(filter?.limit ?? 50, 1), 100);
    const offset = Math.max(filter?.offset ?? 0, 0);

    const conditions: string[] = ["r.type = 'agent'"];
    const bindings: (string | number)[] = [];

    if (filter?.status) {
      conditions.push('a.status = ?');
      bindings.push(filter.status);
    }

    if (filter?.autonomy) {
      conditions.push('a.autonomy_level = ?');
      bindings.push(filter.autonomy);
    }

    if (filter?.runtime && filter.runtime.trim() !== '') {
      conditions.push('LOWER(a.runtime) = ?');
      bindings.push(filter.runtime.trim().toLowerCase());
    }

    if (filter?.model && filter.model.trim() !== '') {
      conditions.push('LOWER(a.model) = ?');
      bindings.push(filter.model.trim().toLowerCase());
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
        conditions.push('r.id IN (SELECT resource_id FROM agents_fts WHERE agents_fts MATCH ?)');
        bindings.push(ftsFormatted);
      } else {
        conditions.push(`(
          r.title LIKE ? OR r.description LIKE ? OR a.role LIKE ? OR a.goal LIKE ? OR
          a.instructions LIKE ? OR a.runtime LIKE ? OR a.model LIKE ? OR a.notes LIKE ?
        )`);
        const likeTerm = `%${rawQ}%`;
        bindings.push(likeTerm, likeTerm, likeTerm, likeTerm, likeTerm, likeTerm, likeTerm, likeTerm);
      }
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Count
    const countSql = `
      SELECT COUNT(DISTINCT r.id) as total
      FROM resources r
      JOIN agents a ON a.resource_id = r.id
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
             a.role, a.goal, a.instructions, a.runtime, a.model, a.status,
             a.autonomy_level, a.input_description, a.output_description, a.notes,
             GROUP_CONCAT(DISTINCT tg.name) as tag_names
      FROM resources r
      JOIN agents a ON a.resource_id = r.id
      LEFT JOIN resource_tags rt ON rt.resource_id = r.id
      LEFT JOIN tags tg ON tg.id = rt.tag_id
      ${whereClause}
      GROUP BY r.id
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `;

    const { results } = await this.db.prepare(dataSql).bind(...bindings, limit, offset).all<AgentRow>();
    const agentRows = results ?? [];

    if (agentRows.length === 0) {
      return { agents: [], total };
    }

    // Fetch relationships for all returned agents
    const agentIds = agentRows.map((r) => r.id);
    const placeholders = agentIds.map(() => '?').join(',');

    const relsSql = `
      SELECT rel.id, rel.source_resource_id, rel.target_resource_id, rel.relationship_type, rel.position,
             tr.title as target_title, tr.type as target_type, tr.description as target_description,
             tp.model as target_model,
             tt.url as target_url,
             ta.role as target_role
      FROM resource_relationships rel
      JOIN resources tr ON tr.id = rel.target_resource_id
      LEFT JOIN prompts tp ON tp.resource_id = tr.id
      LEFT JOIN tools tt ON tt.resource_id = tr.id
      LEFT JOIN agents ta ON ta.resource_id = tr.id
      WHERE rel.source_resource_id IN (${placeholders})
      ORDER BY rel.position ASC, rel.created_at ASC
    `;
    const { results: relResults } = await this.db.prepare(relsSql).bind(...agentIds).all<RelationshipRow>();
    const relRows = relResults ?? [];

    const relMap = new Map<string, LinkedResourceSummary[]>();
    for (const rel of relRows) {
      if (!relMap.has(rel.source_resource_id)) {
        relMap.set(rel.source_resource_id, []);
      }
      relMap.get(rel.source_resource_id)!.push({
        id: rel.id,
        resourceId: rel.target_resource_id,
        relationshipType: validateRelationshipType(rel.relationship_type),
        title: rel.target_title,
        type: rel.target_type,
        description: rel.target_description,
        model: rel.target_model,
        url: rel.target_url,
        role: rel.target_role,
      });
    }

    const agents: Agent[] = agentRows.map((r) => ({
      id: r.id,
      title: r.title,
      description: r.description,
      role: r.role,
      goal: r.goal,
      instructions: r.instructions,
      runtime: r.runtime,
      model: r.model,
      status: validateStatus(r.status),
      autonomyLevel: validateAutonomyLevel(r.autonomy_level),
      inputDescription: r.input_description,
      outputDescription: r.output_description,
      notes: r.notes,
      favorite: Boolean(r.favorite),
      tags: r.tag_names ? r.tag_names.split(',').filter(Boolean) : [],
      linkedResources: relMap.get(r.id) || [],
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));

    return { agents, total };
  }

  async save(
    agent: Agent,
    linkedResources?: { targetResourceId: string; relationshipType?: string }[]
  ): Promise<void> {
    const statements: D1PreparedStatement[] = [];

    // 1. Insert into resources
    statements.push(
      this.db
        .prepare(
          `INSERT INTO resources (id, type, title, description, favorite, created_at, updated_at)
           VALUES (?, 'agent', ?, ?, ?, ?, ?)`
        )
        .bind(
          agent.id,
          agent.title,
          agent.description,
          agent.favorite ? 1 : 0,
          agent.createdAt,
          agent.updatedAt
        )
    );

    // 2. Insert into agents
    statements.push(
      this.db
        .prepare(
          `INSERT INTO agents (resource_id, role, goal, instructions, runtime, model, status, autonomy_level, input_description, output_description, notes)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          agent.id,
          agent.role,
          agent.goal,
          agent.instructions,
          agent.runtime,
          agent.model,
          agent.status,
          agent.autonomyLevel,
          agent.inputDescription,
          agent.outputDescription,
          agent.notes
        )
    );

    // 3. Insert tags
    for (const tag of agent.tags) {
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
          .bind(agent.id, tag)
      );
    }

    // 4. Insert resource relationships
    if (linkedResources && linkedResources.length > 0) {
      linkedResources.forEach((lr, idx) => {
        const relId = crypto.randomUUID();
        const relType = validateRelationshipType(lr.relationshipType);
        statements.push(
          this.db
            .prepare(
              `INSERT INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
               VALUES (?, ?, ?, ?, NULL, ?, ?)`
            )
            .bind(relId, agent.id, lr.targetResourceId, relType, idx + 1, agent.createdAt)
        );
      });
    }

    await this.db.batch(statements);
  }

  async update(
    agent: Agent,
    linkedResources?: { targetResourceId: string; relationshipType?: string }[]
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
        .bind(agent.title, agent.description, agent.favorite ? 1 : 0, agent.updatedAt, agent.id)
    );

    // 2. Update agents
    statements.push(
      this.db
        .prepare(
          `UPDATE agents
           SET role = ?, goal = ?, instructions = ?, runtime = ?, model = ?,
               status = ?, autonomy_level = ?, input_description = ?, output_description = ?, notes = ?
           WHERE resource_id = ?`
        )
        .bind(
          agent.role,
          agent.goal,
          agent.instructions,
          agent.runtime,
          agent.model,
          agent.status,
          agent.autonomyLevel,
          agent.inputDescription,
          agent.outputDescription,
          agent.notes,
          agent.id
        )
    );

    // 3. Sync tags
    statements.push(
      this.db.prepare('DELETE FROM resource_tags WHERE resource_id = ?').bind(agent.id)
    );
    for (const tag of agent.tags) {
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
          .bind(agent.id, tag)
      );
    }

    // 4. Sync relationships if provided
    if (linkedResources !== undefined) {
      statements.push(
        this.db
          .prepare('DELETE FROM resource_relationships WHERE source_resource_id = ?')
          .bind(agent.id)
      );
      linkedResources.forEach((lr, idx) => {
        const relId = crypto.randomUUID();
        const relType = validateRelationshipType(lr.relationshipType);
        statements.push(
          this.db
            .prepare(
              `INSERT INTO resource_relationships (id, source_resource_id, target_resource_id, relationship_type, step_id, position, created_at)
               VALUES (?, ?, ?, ?, NULL, ?, ?)`
            )
            .bind(relId, agent.id, lr.targetResourceId, relType, idx + 1, agent.updatedAt)
        );
      });
    }

    await this.db.batch(statements);
  }

  async delete(id: string): Promise<boolean> {
    const res = await this.db
      .prepare("DELETE FROM resources WHERE id = ? AND type = 'agent'")
      .bind(id)
      .run();
    return (res.meta.changes ?? 0) > 0;
  }

  async setFavorite(id: string, favorite: boolean): Promise<boolean> {
    const now = new Date().toISOString();
    const res = await this.db
      .prepare('UPDATE resources SET favorite = ?, updated_at = ? WHERE id = ?')
      .bind(favorite ? 1 : 0, now, id)
      .run();
    return (res.meta.changes ?? 0) > 0;
  }

  async getDistinctRuntimes(): Promise<string[]> {
    const query = `
      SELECT DISTINCT runtime FROM agents
      WHERE runtime IS NOT NULL AND TRIM(runtime) != ''
      ORDER BY runtime COLLATE NOCASE ASC
    `;
    const { results } = await this.db.prepare(query).all<{ runtime: string }>();
    return (results ?? []).map((r) => r.runtime).filter(Boolean);
  }

  async getDistinctModels(): Promise<string[]> {
    const query = `
      SELECT DISTINCT model FROM agents
      WHERE model IS NOT NULL AND TRIM(model) != ''
      ORDER BY model COLLATE NOCASE ASC
    `;
    const { results } = await this.db.prepare(query).all<{ model: string }>();
    return (results ?? []).map((r) => r.model).filter(Boolean);
  }

  async getAllTags(): Promise<TagWithCount[]> {
    const query = `
      SELECT t.id, t.name, COUNT(rt.resource_id) as count
      FROM tags t
      JOIN resource_tags rt ON rt.tag_id = t.id
      JOIN resources r ON r.id = rt.resource_id
      WHERE r.type = 'agent'
      GROUP BY t.id, t.name
      ORDER BY count DESC, t.name ASC
    `;
    const { results } = await this.db.prepare(query).all<TagWithCount>();
    return results ?? [];
  }
}

import { Resource } from '../../../core/domain/Resource';
import {
  ListResourcesFilter,
  ResourceRepository,
  ResourceWithDetails,
} from '../../../core/ports/ResourceRepository';

interface ResourceExtendedRow {
  id: string;
  type: string;
  title: string;
  description: string | null;
  favorite: number;
  created_at: string;
  updated_at: string;
  tag_names: string | null;
  prompt_content: string | null;
  prompt_model: string | null;
  tool_url: string | null;
  tool_hostname: string | null;
  tool_kind: string | null;
  tool_category: string | null;
  tool_pricing: string | null;
}

export class D1ResourceRepository implements ResourceRepository {
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

  async findById(id: string): Promise<ResourceWithDetails | null> {
    const query = `
      SELECT r.id, r.type, r.title, r.description, r.favorite, r.created_at, r.updated_at,
             GROUP_CONCAT(DISTINCT t.name) as tag_names,
             p.content as prompt_content, p.model as prompt_model,
             tl.url as tool_url, tl.hostname as tool_hostname, tl.kind as tool_kind,
             tl.category as tool_category, tl.pricing as tool_pricing
      FROM resources r
      LEFT JOIN prompts p ON p.resource_id = r.id
      LEFT JOIN tools tl ON tl.resource_id = r.id
      LEFT JOIN resource_tags rt ON rt.resource_id = r.id
      LEFT JOIN tags t ON t.id = rt.tag_id
      WHERE r.id = ?
      GROUP BY r.id
    `;

    const row = await this.db.prepare(query).bind(id).first<ResourceExtendedRow>();
    if (!row) {
      return null;
    }

    return this.mapRow(row);
  }

  async list(filter?: ListResourcesFilter): Promise<{ resources: ResourceWithDetails[]; total: number }> {
    const limit = Math.min(Math.max(filter?.limit ?? 50, 1), 100);
    const offset = Math.max(filter?.offset ?? 0, 0);

    const conditions: string[] = [];
    const bindings: (string | number)[] = [];

    // Filter by type
    if (filter?.type && filter.type.trim() !== '') {
      conditions.push('r.type = ?');
      bindings.push(filter.type.trim().toLowerCase());
    }

    // Filter by favorite
    if (filter?.favorite !== undefined) {
      conditions.push('r.favorite = ?');
      bindings.push(filter.favorite ? 1 : 0);
    }

    // Filter by tag
    if (filter?.tag && filter.tag.trim() !== '') {
      conditions.push(`EXISTS (
        SELECT 1 FROM resource_tags rt2
        JOIN tags t2 ON t2.id = rt2.tag_id
        WHERE rt2.resource_id = r.id AND t2.name = ?
      )`);
      bindings.push(filter.tag.trim().toLowerCase());
    }

    // Full-Text Search across resources
    const rawQ = filter?.q?.trim();
    if (rawQ) {
      const ftsFormatted = this.sanitizeFtsQuery(rawQ);
      if (ftsFormatted) {
        conditions.push(`(
          r.id IN (SELECT resource_id FROM prompts_fts WHERE prompts_fts MATCH ?)
          OR
          r.id IN (SELECT resource_id FROM tools_fts WHERE tools_fts MATCH ?)
        )`);
        bindings.push(ftsFormatted, ftsFormatted);
      } else {
        conditions.push(`(
          r.title LIKE ? OR r.description LIKE ?
          OR EXISTS (SELECT 1 FROM prompts p2 WHERE p2.resource_id = r.id AND p2.content LIKE ?)
          OR EXISTS (SELECT 1 FROM tools tl2 WHERE tl2.resource_id = r.id AND (tl2.url LIKE ? OR tl2.notes LIKE ?))
        )`);
        const likeTerm = `%${rawQ}%`;
        bindings.push(likeTerm, likeTerm, likeTerm, likeTerm, likeTerm);
      }
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Total Count
    const countSql = `SELECT COUNT(DISTINCT r.id) as total FROM resources r ${whereClause}`;
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
      SELECT r.id, r.type, r.title, r.description, r.favorite, r.created_at, r.updated_at,
             GROUP_CONCAT(DISTINCT t.name) as tag_names,
             p.content as prompt_content, p.model as prompt_model,
             tl.url as tool_url, tl.hostname as tool_hostname, tl.kind as tool_kind,
             tl.category as tool_category, tl.pricing as tool_pricing
      FROM resources r
      LEFT JOIN prompts p ON p.resource_id = r.id
      LEFT JOIN tools tl ON tl.resource_id = r.id
      LEFT JOIN resource_tags rt ON rt.resource_id = r.id
      LEFT JOIN tags t ON t.id = rt.tag_id
      ${whereClause}
      GROUP BY r.id
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `;

    const dataStmt = this.db.prepare(dataSql).bind(...bindings, limit, offset);
    const { results } = await dataStmt.all<ResourceExtendedRow>();

    const resources = (results ?? []).map((row) => this.mapRow(row));
    return { resources, total };
  }

  async save(resource: Resource): Promise<void> {
    await this.db
      .prepare(
        `INSERT INTO resources (id, type, title, description, favorite, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           type = excluded.type,
           title = excluded.title,
           description = excluded.description,
           favorite = excluded.favorite,
           updated_at = excluded.updated_at`
      )
      .bind(
        resource.id,
        resource.type,
        resource.title,
        resource.description,
        resource.favorite ? 1 : 0,
        resource.createdAt,
        resource.updatedAt
      )
      .run();
  }

  async delete(id: string): Promise<void> {
    await this.db
      .prepare('DELETE FROM resources WHERE id = ?')
      .bind(id)
      .run();
  }

  async setFavorite(id: string, favorite: boolean): Promise<boolean> {
    const now = new Date().toISOString();
    const statements: D1PreparedStatement[] = [
      this.db
        .prepare('UPDATE resources SET favorite = ?, updated_at = ? WHERE id = ?')
        .bind(favorite ? 1 : 0, now, id),
      this.db
        .prepare('UPDATE prompts SET favorite = ? WHERE resource_id = ?')
        .bind(favorite ? 1 : 0, id),
    ];
    await this.db.batch(statements);
    return true;
  }

  private mapRow(row: ResourceExtendedRow): ResourceWithDetails {
    const extra: Record<string, unknown> = {};

    if (row.type === 'prompt') {
      if (row.prompt_content) extra.content = row.prompt_content;
      if (row.prompt_model) extra.model = row.prompt_model;
    } else if (row.type === 'tool' || row.type === 'website') {
      if (row.tool_url) extra.url = row.tool_url;
      if (row.tool_hostname) extra.hostname = row.tool_hostname;
      if (row.tool_kind) extra.kind = row.tool_kind;
      if (row.tool_category) extra.category = row.tool_category;
      if (row.tool_pricing) extra.pricing = row.tool_pricing;
    }

    return {
      id: row.id,
      type: row.type,
      title: row.title,
      description: row.description,
      favorite: Boolean(row.favorite),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      tags: row.tag_names ? row.tag_names.split(',').filter(Boolean) : [],
      extra,
    };
  }
}

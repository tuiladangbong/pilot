import { Tool, ToolKind, ToolPricing } from '../../../modules/tools/domain/Tool';
import {
  ListToolsFilter,
  ToolRepository,
} from '../../../modules/tools/ports/ToolRepository';
import { TagWithCount } from '../../../modules/prompts/ports/PromptRepository';

interface ToolRow {
  id: string;
  kind: string;
  title: string;
  description: string | null;
  url: string;
  hostname: string;
  provider: string | null;
  category: string | null;
  pricing: string | null;
  notes: string | null;
  favicon_url: string | null;
  favorite: number;
  tag_names: string | null;
  created_at: string;
  updated_at: string;
}

export class D1ToolRepository implements ToolRepository {
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

  private mapRow(row: ToolRow): Tool {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      url: row.url,
      hostname: row.hostname,
      kind: (row.kind === 'website' ? 'website' : 'tool') as ToolKind,
      provider: row.provider,
      category: row.category,
      pricing: (row.pricing ?? 'Unknown') as ToolPricing,
      notes: row.notes,
      faviconUrl: row.favicon_url,
      favorite: Boolean(row.favorite),
      tags: row.tag_names ? row.tag_names.split(',').filter(Boolean) : [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async findById(id: string): Promise<Tool | null> {
    const query = `
      SELECT r.id, r.title, r.description, r.favorite, r.created_at, r.updated_at,
             t.kind, t.url, t.hostname, t.provider, t.category, t.pricing, t.notes, t.favicon_url,
             GROUP_CONCAT(tg.name) as tag_names
      FROM resources r
      JOIN tools t ON t.resource_id = r.id
      LEFT JOIN resource_tags rt ON rt.resource_id = r.id
      LEFT JOIN tags tg ON tg.id = rt.tag_id
      WHERE r.id = ?
      GROUP BY r.id
    `;

    const row = await this.db.prepare(query).bind(id).first<ToolRow>();
    if (!row) {
      return null;
    }

    return this.mapRow(row);
  }

  async findByUrl(url: string): Promise<Tool | null> {
    const query = `
      SELECT r.id, r.title, r.description, r.favorite, r.created_at, r.updated_at,
             t.kind, t.url, t.hostname, t.provider, t.category, t.pricing, t.notes, t.favicon_url,
             GROUP_CONCAT(tg.name) as tag_names
      FROM resources r
      JOIN tools t ON t.resource_id = r.id
      LEFT JOIN resource_tags rt ON rt.resource_id = r.id
      LEFT JOIN tags tg ON tg.id = rt.tag_id
      WHERE t.url = ?
      GROUP BY r.id
      LIMIT 1
    `;

    const row = await this.db.prepare(query).bind(url).first<ToolRow>();
    if (!row) {
      return null;
    }

    return this.mapRow(row);
  }

  async list(filter?: ListToolsFilter): Promise<{ tools: Tool[]; total: number }> {
    const limit = Math.min(Math.max(filter?.limit ?? 50, 1), 100);
    const offset = Math.max(filter?.offset ?? 0, 0);

    const conditions: string[] = [];
    const bindings: (string | number)[] = [];

    // Filter by kind (tool | website)
    if (filter?.kind && (filter.kind === 'tool' || filter.kind === 'website')) {
      conditions.push('t.kind = ?');
      bindings.push(filter.kind);
    }

    // Filter by category
    if (filter?.category && filter.category.trim() !== '') {
      conditions.push('LOWER(t.category) = LOWER(?)');
      bindings.push(filter.category.trim());
    }

    // Filter by provider
    if (filter?.provider && filter.provider.trim() !== '') {
      conditions.push('LOWER(t.provider) = LOWER(?)');
      bindings.push(filter.provider.trim());
    }

    // Filter by pricing
    if (filter?.pricing && filter.pricing.trim() !== '') {
      conditions.push('LOWER(t.pricing) = LOWER(?)');
      bindings.push(filter.pricing.trim());
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
        JOIN tags tg2 ON tg2.id = rt2.tag_id
        WHERE rt2.resource_id = r.id AND tg2.name = ?
      )`);
      bindings.push(filter.tag.trim().toLowerCase());
    }

    // FTS or text query
    const rawQ = filter?.q?.trim();
    if (rawQ) {
      const ftsFormatted = this.sanitizeFtsQuery(rawQ);
      if (ftsFormatted) {
        conditions.push(`r.id IN (SELECT resource_id FROM tools_fts WHERE tools_fts MATCH ?)`);
        bindings.push(ftsFormatted);
      } else {
        conditions.push(
          `(r.title LIKE ? OR r.description LIKE ? OR t.url LIKE ? OR t.hostname LIKE ? OR t.notes LIKE ? OR t.provider LIKE ?)`
        );
        const likeTerm = `%${rawQ}%`;
        bindings.push(likeTerm, likeTerm, likeTerm, likeTerm, likeTerm, likeTerm);
      }
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Count total query
    const countSql = `
      SELECT COUNT(DISTINCT r.id) as total
      FROM resources r
      JOIN tools t ON t.resource_id = r.id
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

    // Select query
    const dataSql = `
      SELECT r.id, r.title, r.description, r.favorite, r.created_at, r.updated_at,
             t.kind, t.url, t.hostname, t.provider, t.category, t.pricing, t.notes, t.favicon_url,
             GROUP_CONCAT(tg.name) as tag_names
      FROM resources r
      JOIN tools t ON t.resource_id = r.id
      LEFT JOIN resource_tags rt ON rt.resource_id = r.id
      LEFT JOIN tags tg ON tg.id = rt.tag_id
      ${whereClause}
      GROUP BY r.id
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `;

    const dataStmt = this.db.prepare(dataSql).bind(...bindings, limit, offset);
    const { results } = await dataStmt.all<ToolRow>();

    const tools = (results ?? []).map((row) => this.mapRow(row));
    return { tools, total };
  }

  async save(tool: Tool): Promise<void> {
    const statements: D1PreparedStatement[] = [];

    // 1. Insert into resources
    statements.push(
      this.db
        .prepare(
          `INSERT INTO resources (id, type, title, description, favorite, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          tool.id,
          tool.kind,
          tool.title,
          tool.description,
          tool.favorite ? 1 : 0,
          tool.createdAt,
          tool.updatedAt
        )
    );

    // 2. Insert into tools
    statements.push(
      this.db
        .prepare(
          `INSERT INTO tools (resource_id, kind, url, hostname, provider, category, pricing, notes, favicon_url)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .bind(
          tool.id,
          tool.kind,
          tool.url,
          tool.hostname,
          tool.provider,
          tool.category,
          tool.pricing,
          tool.notes,
          tool.faviconUrl
        )
    );

    // 3. Insert tags and link in resource_tags
    for (const tag of tool.tags) {
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
          .bind(tool.id, tag)
      );
    }

    await this.db.batch(statements);
  }

  async update(tool: Tool): Promise<void> {
    const statements: D1PreparedStatement[] = [];

    // 1. Update resources
    statements.push(
      this.db
        .prepare(
          `UPDATE resources
           SET type = ?, title = ?, description = ?, favorite = ?, updated_at = ?
           WHERE id = ?`
        )
        .bind(
          tool.kind,
          tool.title,
          tool.description,
          tool.favorite ? 1 : 0,
          tool.updatedAt,
          tool.id
        )
    );

    // 2. Update tools
    statements.push(
      this.db
        .prepare(
          `UPDATE tools
           SET kind = ?, url = ?, hostname = ?, provider = ?, category = ?, pricing = ?, notes = ?, favicon_url = ?
           WHERE resource_id = ?`
        )
        .bind(
          tool.kind,
          tool.url,
          tool.hostname,
          tool.provider,
          tool.category,
          tool.pricing,
          tool.notes,
          tool.faviconUrl,
          tool.id
        )
    );

    // 3. Clear existing tag associations
    statements.push(
      this.db
        .prepare('DELETE FROM resource_tags WHERE resource_id = ?')
        .bind(tool.id)
    );

    // 4. Re-link tags
    for (const tag of tool.tags) {
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
          .bind(tool.id, tag)
      );
    }

    await this.db.batch(statements);
  }

  async delete(id: string): Promise<boolean> {
    const statements: D1PreparedStatement[] = [
      this.db.prepare('DELETE FROM resource_tags WHERE resource_id = ?').bind(id),
      this.db.prepare('DELETE FROM tools WHERE resource_id = ?').bind(id),
      this.db.prepare('DELETE FROM resources WHERE id = ?').bind(id),
    ];
    await this.db.batch(statements);
    return true;
  }

  async setFavorite(id: string, favorite: boolean): Promise<boolean> {
    const now = new Date().toISOString();
    await this.db
      .prepare('UPDATE resources SET favorite = ?, updated_at = ? WHERE id = ?')
      .bind(favorite ? 1 : 0, now, id)
      .run();
    return true;
  }

  async getDistinctCategories(): Promise<string[]> {
    const query = `
      SELECT DISTINCT category
      FROM tools
      WHERE category IS NOT NULL AND TRIM(category) != ''
      ORDER BY category COLLATE NOCASE ASC
    `;
    const { results } = await this.db.prepare(query).all<{ category: string }>();
    return (results ?? []).map((r) => r.category);
  }

  async getDistinctProviders(): Promise<string[]> {
    const query = `
      SELECT DISTINCT provider
      FROM tools
      WHERE provider IS NOT NULL AND TRIM(provider) != ''
      ORDER BY provider COLLATE NOCASE ASC
    `;
    const { results } = await this.db.prepare(query).all<{ provider: string }>();
    return (results ?? []).map((r) => r.provider);
  }

  async getAllTags(): Promise<TagWithCount[]> {
    const query = `
      SELECT tg.id, tg.name, COUNT(rt.resource_id) as count
      FROM tags tg
      JOIN resource_tags rt ON rt.tag_id = tg.id
      JOIN tools t ON t.resource_id = rt.resource_id
      GROUP BY tg.id, tg.name
      HAVING count > 0
      ORDER BY count DESC, tg.name COLLATE NOCASE ASC
    `;
    const { results } = await this.db.prepare(query).all<TagWithCount>();
    return results ?? [];
  }
}

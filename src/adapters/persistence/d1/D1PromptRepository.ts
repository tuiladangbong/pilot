import { Prompt } from '../../../modules/prompts/domain/Prompt';
import {
  ListPromptsFilter,
  PromptRepository,
  TagWithCount,
} from '../../../modules/prompts/ports/PromptRepository';

interface PromptRow {
  id: string;
  title: string;
  description: string | null;
  content: string;
  model: string | null;
  favorite: number;
  tag_names: string | null;
  created_at: string;
  updated_at: string;
}

export class D1PromptRepository implements PromptRepository {
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

  async findById(id: string): Promise<Prompt | null> {
    const query = `
      SELECT r.id, r.title, r.description, r.created_at, r.updated_at,
             p.content, p.model, p.favorite,
             GROUP_CONCAT(t.name) as tag_names
      FROM resources r
      JOIN prompts p ON p.resource_id = r.id
      LEFT JOIN resource_tags rt ON rt.resource_id = r.id
      LEFT JOIN tags t ON t.id = rt.tag_id
      WHERE r.id = ?
      GROUP BY r.id
    `;

    const row = await this.db.prepare(query).bind(id).first<PromptRow>();
    if (!row) {
      return null;
    }

    return {
      id: row.id,
      title: row.title,
      description: row.description,
      content: row.content,
      model: row.model,
      favorite: Boolean(row.favorite),
      tags: row.tag_names ? row.tag_names.split(',').filter(Boolean) : [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async list(filter?: ListPromptsFilter): Promise<{ prompts: Prompt[]; total: number }> {
    const limit = Math.min(Math.max(filter?.limit ?? 50, 1), 100);
    const offset = Math.max(filter?.offset ?? 0, 0);

    const conditions: string[] = ["r.type = 'prompt'"];
    const bindings: (string | number)[] = [];

    // FTS or text query
    const rawQ = filter?.q?.trim();
    if (rawQ) {
      const ftsFormatted = this.sanitizeFtsQuery(rawQ);
      if (ftsFormatted) {
        conditions.push(`r.id IN (SELECT resource_id FROM prompts_fts WHERE prompts_fts MATCH ?)`);
        bindings.push(ftsFormatted);
      } else {
        conditions.push(`(r.title LIKE ? OR r.description LIKE ? OR p.content LIKE ?)`);
        const likeTerm = `%${rawQ}%`;
        bindings.push(likeTerm, likeTerm, likeTerm);
      }
    }

    // Filter by tag
    if (filter?.tag && filter.tag.trim() !== '') {
      conditions.push(
        `EXISTS (
          SELECT 1 FROM resource_tags rt2
          JOIN tags t2 ON t2.id = rt2.tag_id
          WHERE rt2.resource_id = r.id AND t2.name = ?
        )`
      );
      bindings.push(filter.tag.trim().toLowerCase());
    }

    // Filter by model
    if (filter?.model && filter.model.trim() !== '') {
      conditions.push(`LOWER(p.model) = LOWER(?)`);
      bindings.push(filter.model.trim());
    }

    // Filter by favorite
    if (filter?.favorite !== undefined) {
      conditions.push(`p.favorite = ?`);
      bindings.push(filter.favorite ? 1 : 0);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Count total query
    const countSql = `
      SELECT COUNT(DISTINCT r.id) as total
      FROM resources r
      JOIN prompts p ON p.resource_id = r.id
      ${whereClause}
    `;
    const countStmt = this.db.prepare(countSql).bind(...bindings);
    const countResult = await countStmt.first<{ total: number }>();
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
      SELECT r.id, r.title, r.description, r.created_at, r.updated_at,
             p.content, p.model, p.favorite,
             GROUP_CONCAT(t.name) as tag_names
      FROM resources r
      JOIN prompts p ON p.resource_id = r.id
      LEFT JOIN resource_tags rt ON rt.resource_id = r.id
      LEFT JOIN tags t ON t.id = rt.tag_id
      ${whereClause}
      GROUP BY r.id
      ORDER BY ${orderBy}
      LIMIT ? OFFSET ?
    `;

    const dataStmt = this.db.prepare(dataSql).bind(...bindings, limit, offset);
    const { results } = await dataStmt.all<PromptRow>();

    const prompts: Prompt[] = (results ?? []).map((row) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      content: row.content,
      model: row.model,
      favorite: Boolean(row.favorite),
      tags: row.tag_names ? row.tag_names.split(',').filter(Boolean) : [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return { prompts, total };
  }

  async save(prompt: Prompt): Promise<void> {
    const statements: D1PreparedStatement[] = [];

    // 1. Insert into resources
    statements.push(
      this.db
        .prepare(
          `INSERT INTO resources (id, type, title, description, created_at, updated_at)
           VALUES (?, 'prompt', ?, ?, ?, ?)`
        )
        .bind(
          prompt.id,
          prompt.title,
          prompt.description,
          prompt.createdAt,
          prompt.updatedAt
        )
    );

    // 2. Insert into prompts
    statements.push(
      this.db
        .prepare(
          `INSERT INTO prompts (resource_id, content, model, favorite)
           VALUES (?, ?, ?, ?)`
        )
        .bind(
          prompt.id,
          prompt.content,
          prompt.model,
          prompt.favorite ? 1 : 0
        )
    );

    // 3. Insert tags and link in resource_tags
    for (const tag of prompt.tags) {
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
          .bind(prompt.id, tag)
      );
    }

    await this.db.batch(statements);
  }

  async update(prompt: Prompt): Promise<void> {
    const statements: D1PreparedStatement[] = [];

    // 1. Update resources
    statements.push(
      this.db
        .prepare(
          `UPDATE resources
           SET title = ?, description = ?, updated_at = ?
           WHERE id = ?`
        )
        .bind(prompt.title, prompt.description, prompt.updatedAt, prompt.id)
    );

    // 2. Update prompts
    statements.push(
      this.db
        .prepare(
          `UPDATE prompts
           SET content = ?, model = ?, favorite = ?
           WHERE resource_id = ?`
        )
        .bind(prompt.content, prompt.model, prompt.favorite ? 1 : 0, prompt.id)
    );

    // 3. Clear existing tag associations
    statements.push(
      this.db
        .prepare('DELETE FROM resource_tags WHERE resource_id = ?')
        .bind(prompt.id)
    );

    // 4. Re-link tags
    for (const tag of prompt.tags) {
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
          .bind(prompt.id, tag)
      );
    }

    await this.db.batch(statements);
  }

  async delete(id: string): Promise<boolean> {
    // With PRAGMA foreign_keys = ON, deleting from resources cascades to prompts & resource_tags
    // Explicitly delete from both to guarantee cleanup even if FK pragma was toggled
    const statements: D1PreparedStatement[] = [
      this.db.prepare('DELETE FROM resource_tags WHERE resource_id = ?').bind(id),
      this.db.prepare('DELETE FROM prompts WHERE resource_id = ?').bind(id),
      this.db.prepare('DELETE FROM resources WHERE id = ?').bind(id),
    ];
    await this.db.batch(statements);
    return true;
  }

  async setFavorite(id: string, favorite: boolean): Promise<boolean> {
    const now = new Date().toISOString();
    const statements = [
      this.db
        .prepare('UPDATE prompts SET favorite = ? WHERE resource_id = ?')
        .bind(favorite ? 1 : 0, id),
      this.db
        .prepare('UPDATE resources SET updated_at = ? WHERE id = ?')
        .bind(now, id),
    ];
    await this.db.batch(statements);
    return true;
  }

  async getDistinctModels(): Promise<string[]> {
    const query = `
      SELECT DISTINCT model
      FROM prompts
      WHERE model IS NOT NULL AND TRIM(model) != ''
      ORDER BY model COLLATE NOCASE ASC
    `;
    const { results } = await this.db.prepare(query).all<{ model: string }>();
    return (results ?? []).map((r) => r.model);
  }

  async getAllTags(): Promise<TagWithCount[]> {
    const query = `
      SELECT t.id, t.name, COUNT(rt.resource_id) as count
      FROM tags t
      JOIN resource_tags rt ON rt.tag_id = t.id
      GROUP BY t.id, t.name
      HAVING count > 0
      ORDER BY count DESC, t.name COLLATE NOCASE ASC
    `;
    const { results } = await this.db.prepare(query).all<TagWithCount>();
    return results ?? [];
  }
}

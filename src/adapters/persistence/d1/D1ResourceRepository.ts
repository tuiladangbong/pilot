import { Resource } from '../../../core/domain/Resource';
import { ResourceRepository } from '../../../core/ports/ResourceRepository';

interface ResourceRow {
  id: string;
  type: string;
  title: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export class D1ResourceRepository implements ResourceRepository {
  constructor(private readonly db: D1Database) {}

  async findById(id: string): Promise<Resource | null> {
    const row = await this.db
      .prepare('SELECT id, type, title, description, created_at, updated_at FROM resources WHERE id = ?')
      .bind(id)
      .first<ResourceRow>();

    if (!row) {
      return null;
    }

    return {
      id: row.id,
      type: row.type,
      title: row.title,
      description: row.description,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async list(filter?: { type?: string; limit?: number; offset?: number }): Promise<Resource[]> {
    const limit = filter?.limit ?? 50;
    const offset = filter?.offset ?? 0;

    let stmt: D1PreparedStatement;
    if (filter?.type) {
      stmt = this.db
        .prepare('SELECT id, type, title, description, created_at, updated_at FROM resources WHERE type = ? ORDER BY created_at DESC LIMIT ? OFFSET ?')
        .bind(filter.type, limit, offset);
    } else {
      stmt = this.db
        .prepare('SELECT id, type, title, description, created_at, updated_at FROM resources ORDER BY created_at DESC LIMIT ? OFFSET ?')
        .bind(limit, offset);
    }

    const { results } = await stmt.all<ResourceRow>();
    return (results ?? []).map((row) => ({
      id: row.id,
      type: row.type,
      title: row.title,
      description: row.description,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  async save(resource: Resource): Promise<void> {
    await this.db
      .prepare(
        `INSERT INTO resources (id, type, title, description, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           type = excluded.type,
           title = excluded.title,
           description = excluded.description,
           updated_at = excluded.updated_at`
      )
      .bind(
        resource.id,
        resource.type,
        resource.title,
        resource.description,
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
}

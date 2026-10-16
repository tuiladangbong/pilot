import { PromptDetails } from '../../../modules/prompts/domain/Prompt';
import { PromptRepository } from '../../../modules/prompts/ports/PromptRepository';

interface PromptRow {
  resource_id: string;
  content: string;
  model: string | null;
  favorite: number;
}

export class D1PromptRepository implements PromptRepository {
  constructor(private readonly db: D1Database) {}

  async findByResourceId(resourceId: string): Promise<PromptDetails | null> {
    const row = await this.db
      .prepare('SELECT resource_id, content, model, favorite FROM prompts WHERE resource_id = ?')
      .bind(resourceId)
      .first<PromptRow>();

    if (!row) {
      return null;
    }

    return {
      resourceId: row.resource_id,
      content: row.content,
      model: row.model,
      favorite: Boolean(row.favorite),
    };
  }

  async save(prompt: PromptDetails): Promise<void> {
    await this.db
      .prepare(
        `INSERT INTO prompts (resource_id, content, model, favorite)
         VALUES (?, ?, ?, ?)
         ON CONFLICT(resource_id) DO UPDATE SET
           content = excluded.content,
           model = excluded.model,
           favorite = excluded.favorite`
      )
      .bind(
        prompt.resourceId,
        prompt.content,
        prompt.model,
        prompt.favorite ? 1 : 0
      )
      .run();
  }

  async delete(resourceId: string): Promise<void> {
    await this.db
      .prepare('DELETE FROM prompts WHERE resource_id = ?')
      .bind(resourceId)
      .run();
  }
}

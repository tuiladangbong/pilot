import { createTool } from '../domain/Tool';
import { ToolRepository } from '../ports/ToolRepository';
import { ToolDto, toToolDto } from './ToolDto';

export class DuplicateToolUseCase {
  constructor(private readonly toolRepo: ToolRepository) {}

  async execute(id: string): Promise<ToolDto> {
    const existing = await this.toolRepo.findById(id);
    if (!existing) {
      throw new Error(`Tool with id "${id}" not found`);
    }

    const duplicate = createTool({
      id: crypto.randomUUID(),
      title: `${existing.title} Copy`,
      description: existing.description,
      url: existing.url,
      kind: existing.kind,
      provider: existing.provider,
      category: existing.category,
      pricing: existing.pricing,
      notes: existing.notes,
      faviconUrl: existing.faviconUrl,
      favorite: false,
      tags: [...existing.tags],
    });

    await this.toolRepo.save(duplicate);
    return toToolDto(duplicate);
  }
}

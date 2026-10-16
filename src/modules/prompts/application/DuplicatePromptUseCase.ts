import { createPrompt } from '../domain/Prompt';
import { PromptRepository } from '../ports/PromptRepository';
import { PromptDto, toPromptDto } from './PromptDto';

export class DuplicatePromptUseCase {
  constructor(private readonly promptRepo: PromptRepository) {}

  async execute(id: string): Promise<PromptDto> {
    const existing = await this.promptRepo.findById(id);
    if (!existing) {
      throw new Error(`Prompt with id "${id}" not found`);
    }

    const duplicate = createPrompt({
      id: crypto.randomUUID(),
      title: `${existing.title} Copy`,
      description: existing.description,
      content: existing.content,
      model: existing.model,
      favorite: false,
      tags: [...existing.tags],
    });

    await this.promptRepo.save(duplicate);
    return toPromptDto(duplicate);
  }
}

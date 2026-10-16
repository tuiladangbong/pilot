import { updatePrompt, UpdatePromptInput } from '../domain/Prompt';
import { PromptRepository } from '../ports/PromptRepository';
import { PromptDto, toPromptDto } from './PromptDto';

export class UpdatePromptUseCase {
  constructor(private readonly promptRepo: PromptRepository) {}

  async execute(id: string, input: UpdatePromptInput): Promise<PromptDto> {
    const existing = await this.promptRepo.findById(id);
    if (!existing) {
      throw new Error(`Prompt with id "${id}" not found`);
    }

    const updated = updatePrompt(existing, input);
    await this.promptRepo.update(updated);
    return toPromptDto(updated);
  }
}

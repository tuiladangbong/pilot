import { PromptRepository } from '../ports/PromptRepository';
import { PromptDto, toPromptDto } from './PromptDto';

export class GetPromptUseCase {
  constructor(private readonly promptRepo: PromptRepository) {}

  async execute(id: string): Promise<PromptDto | null> {
    const prompt = await this.promptRepo.findById(id);
    return prompt ? toPromptDto(prompt) : null;
  }
}

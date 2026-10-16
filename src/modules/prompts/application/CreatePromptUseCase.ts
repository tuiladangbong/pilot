import { createPrompt, CreatePromptInput } from '../domain/Prompt';
import { PromptRepository } from '../ports/PromptRepository';
import { PromptDto, toPromptDto } from './PromptDto';

export class CreatePromptUseCase {
  constructor(private readonly promptRepo: PromptRepository) {}

  async execute(input: CreatePromptInput): Promise<PromptDto> {
    const prompt = createPrompt(input);
    await this.promptRepo.save(prompt);
    return toPromptDto(prompt);
  }
}

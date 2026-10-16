import { PromptRepository } from '../ports/PromptRepository';

export class DeletePromptUseCase {
  constructor(private readonly promptRepo: PromptRepository) {}

  async execute(id: string): Promise<boolean> {
    return await this.promptRepo.delete(id);
  }
}

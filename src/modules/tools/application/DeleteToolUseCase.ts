import { ToolRepository } from '../ports/ToolRepository';

export class DeleteToolUseCase {
  constructor(private readonly toolRepo: ToolRepository) {}

  async execute(id: string): Promise<boolean> {
    return await this.toolRepo.delete(id);
  }
}

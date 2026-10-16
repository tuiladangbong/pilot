import { ListPromptsFilter, PromptRepository } from '../ports/PromptRepository';
import { PromptDto, toPromptDto } from './PromptDto';

export interface ListPromptsResult {
  prompts: PromptDto[];
  total: number;
  limit: number;
  offset: number;
}

export class ListPromptsUseCase {
  constructor(private readonly promptRepo: PromptRepository) {}

  async execute(filter?: ListPromptsFilter): Promise<ListPromptsResult> {
    const limit = Math.min(Math.max(filter?.limit ?? 50, 1), 100);
    const offset = Math.max(filter?.offset ?? 0, 0);

    const { prompts, total } = await this.promptRepo.list({
      ...filter,
      limit,
      offset,
    });

    return {
      prompts: prompts.map(toPromptDto),
      total,
      limit,
      offset,
    };
  }
}

import { ListToolsFilter, ToolRepository } from '../ports/ToolRepository';
import { ToolDto, toToolDto } from './ToolDto';

export interface ListToolsResult {
  tools: ToolDto[];
  total: number;
  limit: number;
  offset: number;
}

export class ListToolsUseCase {
  constructor(private readonly toolRepo: ToolRepository) {}

  async execute(filter?: ListToolsFilter): Promise<ListToolsResult> {
    const limit = Math.min(Math.max(filter?.limit ?? 50, 1), 100);
    const offset = Math.max(filter?.offset ?? 0, 0);

    const { tools, total } = await this.toolRepo.list({
      ...filter,
      limit,
      offset,
    });

    return {
      tools: tools.map(toToolDto),
      total,
      limit,
      offset,
    };
  }
}

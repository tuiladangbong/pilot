import { ToolRepository } from '../ports/ToolRepository';
import { ToolDto, toToolDto } from './ToolDto';

export class GetToolUseCase {
  constructor(private readonly toolRepo: ToolRepository) {}

  async execute(idOrSlug: string): Promise<ToolDto | null> {
    const tool = await this.toolRepo.findByIdOrSlug(idOrSlug);
    return tool ? toToolDto(tool) : null;
  }
}

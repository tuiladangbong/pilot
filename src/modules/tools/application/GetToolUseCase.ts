import { ToolRepository } from '../ports/ToolRepository';
import { ToolDto, toToolDto } from './ToolDto';

export class GetToolUseCase {
  constructor(private readonly toolRepo: ToolRepository) {}

  async execute(id: string): Promise<ToolDto | null> {
    const tool = await this.toolRepo.findById(id);
    return tool ? toToolDto(tool) : null;
  }
}

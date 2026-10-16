import { updateTool, UpdateToolInput } from '../domain/Tool';
import { ToolRepository } from '../ports/ToolRepository';
import { ToolDto, toToolDto } from './ToolDto';

export class UpdateToolUseCase {
  constructor(private readonly toolRepo: ToolRepository) {}

  async execute(id: string, input: UpdateToolInput): Promise<ToolDto> {
    const existing = await this.toolRepo.findById(id);
    if (!existing) {
      throw new Error(`Tool with id "${id}" not found`);
    }

    const updated = updateTool(existing, input);
    await this.toolRepo.update(updated);
    return toToolDto(updated);
  }
}

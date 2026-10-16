import { createTool, CreateToolInput } from '../domain/Tool';
import { ToolRepository } from '../ports/ToolRepository';
import { ToolDto, toToolDto } from './ToolDto';

export interface CreateToolResult {
  tool: ToolDto;
  warning?: string;
}

export class CreateToolUseCase {
  constructor(private readonly toolRepo: ToolRepository) {}

  async execute(input: CreateToolInput): Promise<CreateToolResult> {
    const tool = createTool(input);

    // Check if URL already exists to surface a friendly warning (non-blocking)
    const existing = await this.toolRepo.findByUrl(tool.url);
    let warning: string | undefined;
    if (existing) {
      warning = `A resource with this URL already exists in Pilot: "${existing.title}".`;
    }

    await this.toolRepo.save(tool);
    return {
      tool: toToolDto(tool),
      warning,
    };
  }
}

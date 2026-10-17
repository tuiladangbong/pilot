import { updateAgent, UpdateAgentInput } from '../domain/Agent';
import { AgentRepository } from '../ports/AgentRepository';
import { AgentDto, toAgentDto } from './AgentDto';

export class UpdateAgentUseCase {
  constructor(private readonly agentRepo: AgentRepository) {}

  async execute(id: string, input: UpdateAgentInput): Promise<AgentDto | null> {
    const existing = await this.agentRepo.findById(id);
    if (!existing) return null;

    const updated = updateAgent(existing, input);
    const linkedResourceLinks = input.relationships !== undefined
      ? input.relationships.map((r) => ({
          targetResourceId: r.targetResourceId,
          relationshipType: r.relationshipType,
        }))
      : undefined;

    await this.agentRepo.update(updated, linkedResourceLinks);
    const saved = await this.agentRepo.findById(id);
    return toAgentDto(saved ?? updated);
  }
}

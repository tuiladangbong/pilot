import { AgentRepository } from '../ports/AgentRepository';
import { AgentDto, toAgentDto } from './AgentDto';

export class GetAgentUseCase {
  constructor(private readonly agentRepo: AgentRepository) {}

  async execute(id: string): Promise<AgentDto | null> {
    const agent = await this.agentRepo.findById(id);
    if (!agent) return null;
    return toAgentDto(agent);
  }
}

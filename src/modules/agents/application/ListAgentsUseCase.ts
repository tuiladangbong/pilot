import { AgentRepository, ListAgentsFilter } from '../ports/AgentRepository';
import { AgentSummaryDto, toAgentSummaryDto } from './AgentDto';

export class ListAgentsUseCase {
  constructor(private readonly agentRepo: AgentRepository) {}

  async execute(filter?: ListAgentsFilter): Promise<{ agents: AgentSummaryDto[]; total: number }> {
    const result = await this.agentRepo.list(filter);
    return {
      agents: result.agents.map(toAgentSummaryDto),
      total: result.total,
    };
  }
}

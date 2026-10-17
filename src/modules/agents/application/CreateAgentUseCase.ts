import { createAgent, CreateAgentInput } from '../domain/Agent';
import { AgentRepository } from '../ports/AgentRepository';
import { AgentDto, toAgentDto } from './AgentDto';

export class CreateAgentUseCase {
  constructor(private readonly agentRepo: AgentRepository) {}

  async execute(input: CreateAgentInput): Promise<AgentDto> {
    const agent = createAgent(input);
    const linkedResourceLinks = (input.relationships || []).map((r) => ({
      targetResourceId: r.targetResourceId,
      relationshipType: r.relationshipType,
    }));

    await this.agentRepo.save(agent, linkedResourceLinks);
    const saved = await this.agentRepo.findById(agent.id);
    return toAgentDto(saved ?? agent);
  }
}

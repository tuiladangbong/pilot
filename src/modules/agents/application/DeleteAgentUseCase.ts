import { AgentRepository } from '../ports/AgentRepository';

export class DeleteAgentUseCase {
  constructor(private readonly agentRepo: AgentRepository) {}

  async execute(id: string): Promise<boolean> {
    return this.agentRepo.delete(id);
  }
}

import { AgentRepository } from '../ports/AgentRepository';

export class ToggleAgentFavoriteUseCase {
  constructor(private readonly agentRepo: AgentRepository) {}

  async execute(id: string, explicitFavorite?: boolean): Promise<{ id: string; favorite: boolean }> {
    const agent = await this.agentRepo.findById(id);
    if (!agent) {
      throw new Error(`Agent with id "${id}" not found`);
    }

    const nextFavorite = explicitFavorite !== undefined ? explicitFavorite : !agent.favorite;
    await this.agentRepo.setFavorite(id, nextFavorite);

    return {
      id,
      favorite: nextFavorite,
    };
  }
}

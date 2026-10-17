import { createAgent } from '../domain/Agent';
import { AgentRepository } from '../ports/AgentRepository';
import { AgentDto, toAgentDto } from './AgentDto';

export class DuplicateAgentUseCase {
  constructor(private readonly agentRepo: AgentRepository) {}

  async execute(id: string): Promise<AgentDto | null> {
    const original = await this.agentRepo.findById(id);
    if (!original) return null;

    const duplicate = createAgent({
      title: `${original.title} Copy`,
      description: original.description,
      role: original.role,
      goal: original.goal,
      instructions: original.instructions,
      runtime: original.runtime,
      model: original.model,
      status: original.status,
      autonomyLevel: original.autonomyLevel,
      inputDescription: original.inputDescription,
      outputDescription: original.outputDescription,
      notes: original.notes,
      favorite: original.favorite,
      tags: [...original.tags],
    });

    const relationships = (original.linkedResources || []).map((r) => ({
      targetResourceId: r.resourceId,
      relationshipType: r.relationshipType,
    }));

    await this.agentRepo.save(duplicate, relationships);
    const saved = await this.agentRepo.findById(duplicate.id);
    return toAgentDto(saved ?? duplicate);
  }
}

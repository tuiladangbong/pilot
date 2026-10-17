import { WorkflowRepository } from '../ports/WorkflowRepository';

export class ToggleWorkflowFavoriteUseCase {
  constructor(private readonly workflowRepo: WorkflowRepository) {}

  async execute(id: string, explicitFavorite?: boolean): Promise<{ id: string; favorite: boolean }> {
    const existing = await this.workflowRepo.findById(id);
    if (!existing) {
      throw new Error(`Workflow with id "${id}" not found`);
    }

    const newFavorite = explicitFavorite !== undefined ? explicitFavorite : !existing.favorite;
    await this.workflowRepo.setFavorite(id, newFavorite);
    return { id, favorite: newFavorite };
  }
}

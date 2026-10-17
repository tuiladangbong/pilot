import { WorkflowRepository } from '../ports/WorkflowRepository';

export class DeleteWorkflowUseCase {
  constructor(private readonly workflowRepo: WorkflowRepository) {}

  async execute(id: string): Promise<boolean> {
    return this.workflowRepo.delete(id);
  }
}

import { WorkflowRepository } from '../ports/WorkflowRepository';
import { toWorkflowDto, WorkflowDto } from './WorkflowDto';

export class GetWorkflowUseCase {
  constructor(private readonly workflowRepo: WorkflowRepository) {}

  async execute(id: string): Promise<WorkflowDto | null> {
    const workflow = await this.workflowRepo.findById(id);
    if (!workflow) {
      return null;
    }
    return toWorkflowDto(workflow);
  }
}

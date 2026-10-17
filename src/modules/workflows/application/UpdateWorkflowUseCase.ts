import { updateWorkflow, UpdateWorkflowInput } from '../domain/Workflow';
import { WorkflowRepository } from '../ports/WorkflowRepository';
import { toWorkflowDto, WorkflowDto } from './WorkflowDto';

export class UpdateWorkflowUseCase {
  constructor(private readonly workflowRepo: WorkflowRepository) {}

  async execute(id: string, input: UpdateWorkflowInput): Promise<WorkflowDto | null> {
    const existing = await this.workflowRepo.findById(id);
    if (!existing) {
      return null;
    }

    const updated = updateWorkflow(existing, input);

    let stepResourceLinks: { stepId: string; targetResourceIds: string[] }[] | undefined;
    if (input.steps !== undefined && Array.isArray(input.steps)) {
      stepResourceLinks = [];
      for (let i = 0; i < input.steps.length; i++) {
        const stepInput = input.steps[i];
        const step = updated.steps[i];
        if (step && stepInput.linkedResourceIds && Array.isArray(stepInput.linkedResourceIds)) {
          stepResourceLinks.push({
            stepId: step.id,
            targetResourceIds: stepInput.linkedResourceIds.filter((tid: string) => typeof tid === 'string' && tid.trim().length > 0),
          });
        }
      }
    }

    let workflowResourceLinks: string[] | undefined;
    if (input.linkedResourceIds !== undefined && Array.isArray(input.linkedResourceIds)) {
      workflowResourceLinks = input.linkedResourceIds.filter(
        (tid) => typeof tid === 'string' && tid.trim().length > 0
      );
    }

    await this.workflowRepo.update(updated, stepResourceLinks, workflowResourceLinks);

    const reloaded = await this.workflowRepo.findById(id);
    return toWorkflowDto(reloaded || updated);
  }
}

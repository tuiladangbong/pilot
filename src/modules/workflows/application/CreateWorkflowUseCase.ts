import { createWorkflow, CreateWorkflowInput } from '../domain/Workflow';
import { WorkflowRepository } from '../ports/WorkflowRepository';
import { toWorkflowDto, WorkflowDto } from './WorkflowDto';

export class CreateWorkflowUseCase {
  constructor(private readonly workflowRepo: WorkflowRepository) {}

  async execute(input: CreateWorkflowInput): Promise<WorkflowDto> {
    const workflow = createWorkflow(input);

    const stepResourceLinks: { stepId: string; targetResourceIds: string[] }[] = [];
    if (input.steps && Array.isArray(input.steps)) {
      for (let i = 0; i < input.steps.length; i++) {
        const stepInput = input.steps[i];
        const step = workflow.steps[i];
        if (step && stepInput.linkedResourceIds && Array.isArray(stepInput.linkedResourceIds)) {
          stepResourceLinks.push({
            stepId: step.id,
            targetResourceIds: stepInput.linkedResourceIds.filter((id: string) => typeof id === 'string' && id.trim().length > 0),
          });
        }
      }
    }

    const workflowResourceLinks = (input.linkedResourceIds || []).filter(
      (id) => typeof id === 'string' && id.trim().length > 0
    );

    await this.workflowRepo.save(workflow, stepResourceLinks, workflowResourceLinks);

    const reloaded = await this.workflowRepo.findById(workflow.id);
    return toWorkflowDto(reloaded || workflow);
  }
}

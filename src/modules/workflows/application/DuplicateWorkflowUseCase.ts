import { createWorkflow } from '../domain/Workflow';
import { WorkflowRepository } from '../ports/WorkflowRepository';
import { toWorkflowDto, WorkflowDto } from './WorkflowDto';

export class DuplicateWorkflowUseCase {
  constructor(private readonly workflowRepo: WorkflowRepository) {}

  async execute(id: string): Promise<WorkflowDto | null> {
    const existing = await this.workflowRepo.findById(id);
    if (!existing) {
      return null;
    }

    const newWorkflowId = crypto.randomUUID();
    const newStepIds = existing.steps.map(() => crypto.randomUUID());

    const stepResourceLinks: { stepId: string; targetResourceIds: string[] }[] = [];
    const stepInputs = existing.steps.map((step, index) => {
      const stepId = newStepIds[index];
      const targetResourceIds = (step.linkedResources || []).map((lr) => lr.resourceId);
      if (targetResourceIds.length > 0) {
        stepResourceLinks.push({
          stepId,
          targetResourceIds,
        });
      }

      return {
        id: stepId,
        title: step.title,
        instruction: step.instruction,
        notes: step.notes,
        optional: step.optional,
        position: step.position,
      };
    });

    const workflowResourceLinks = (existing.linkedResources || []).map((lr) => lr.resourceId);

    const cloned = createWorkflow({
      id: newWorkflowId,
      title: `${existing.title} Copy`,
      description: existing.description,
      purpose: existing.purpose,
      status: existing.status,
      difficulty: existing.difficulty,
      estimatedTime: existing.estimatedTime,
      notes: existing.notes,
      favorite: false,
      tags: existing.tags,
      steps: stepInputs,
    });

    await this.workflowRepo.save(cloned, stepResourceLinks, workflowResourceLinks);

    const reloaded = await this.workflowRepo.findById(newWorkflowId);
    return toWorkflowDto(reloaded || cloned);
  }
}

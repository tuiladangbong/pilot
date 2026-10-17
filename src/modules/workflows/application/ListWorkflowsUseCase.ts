import { ListWorkflowsFilter, WorkflowRepository } from '../ports/WorkflowRepository';
import { TagWithCount } from '../../prompts/ports/PromptRepository';
import { toWorkflowDto, WorkflowDto } from './WorkflowDto';

export interface ListWorkflowsResult {
  workflows: WorkflowDto[];
  total: number;
  tags: TagWithCount[];
}

export class ListWorkflowsUseCase {
  constructor(private readonly workflowRepo: WorkflowRepository) {}

  async execute(filter?: ListWorkflowsFilter): Promise<ListWorkflowsResult> {
    const [{ workflows, total }, tags] = await Promise.all([
      this.workflowRepo.list(filter),
      this.workflowRepo.getAllTags(),
    ]);

    return {
      workflows: workflows.map(toWorkflowDto),
      total,
      tags,
    };
  }
}

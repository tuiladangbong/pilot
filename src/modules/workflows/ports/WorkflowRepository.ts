import { Workflow, WorkflowDifficulty, WorkflowStatus } from '../domain/Workflow';
import { TagWithCount } from '../../prompts/ports/PromptRepository';

export interface ListWorkflowsFilter {
  readonly q?: string;
  readonly status?: WorkflowStatus;
  readonly difficulty?: WorkflowDifficulty;
  readonly tag?: string;
  readonly favorite?: boolean;
  readonly sort?: 'updated_at' | 'created_at' | 'title';
  readonly order?: 'asc' | 'desc';
  readonly limit?: number;
  readonly offset?: number;
}

export interface WorkflowRepository {
  findById(id: string): Promise<Workflow | null>;
  list(filter?: ListWorkflowsFilter): Promise<{ workflows: Workflow[]; total: number }>;
  save(
    workflow: Workflow,
    stepResourceLinks?: { stepId: string; targetResourceIds: string[] }[],
    workflowResourceLinks?: string[]
  ): Promise<void>;
  update(
    workflow: Workflow,
    stepResourceLinks?: { stepId: string; targetResourceIds: string[] }[],
    workflowResourceLinks?: string[]
  ): Promise<void>;
  delete(id: string): Promise<boolean>;
  setFavorite(id: string, favorite: boolean): Promise<boolean>;
  getAllTags(): Promise<TagWithCount[]>;
}

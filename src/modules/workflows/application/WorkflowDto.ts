import { LinkedResourceSummary, Workflow, WorkflowDifficulty, WorkflowStatus, WorkflowStep } from '../domain/Workflow';

export interface LinkedResourceDto {
  id: string;
  resourceId: string;
  relationshipType: 'USES' | 'REFERENCES';
  stepId?: string | null;
  title: string;
  type: string;
  description: string | null;
  url?: string | null;
  model?: string | null;
}

export interface WorkflowStepDto {
  id: string;
  workflowId: string;
  position: number;
  title: string;
  instruction: string;
  instructions: string;
  notes: string | null;
  optional: boolean;
  linkedResources: LinkedResourceDto[];
  createdAt: string;
  updatedAt: string;
}

export interface WorkflowDto {
  id: string;
  type: 'workflow';
  title: string;
  description: string | null;
  purpose: string | null;
  status: WorkflowStatus;
  difficulty: WorkflowDifficulty;
  estimatedTime: string | null;
  notes: string | null;
  favorite: boolean;
  tags: string[];
  stepCount: number;
  steps: WorkflowStepDto[];
  linkedResources: LinkedResourceDto[];
  createdAt: string;
  updatedAt: string;
}

export function toLinkedResourceDto(lr: LinkedResourceSummary): LinkedResourceDto {
  return {
    id: lr.id,
    resourceId: lr.resourceId,
    relationshipType: lr.relationshipType,
    stepId: lr.stepId,
    title: lr.title,
    type: lr.type,
    description: lr.description,
    url: lr.url ?? null,
    model: lr.model ?? null,
  };
}

export function toWorkflowStepDto(step: WorkflowStep): WorkflowStepDto {
  return {
    id: step.id,
    workflowId: step.workflowId,
    position: step.position,
    title: step.title,
    instruction: step.instruction,
    instructions: step.instruction,
    notes: step.notes,
    optional: step.optional,
    linkedResources: (step.linkedResources || []).map(toLinkedResourceDto),
    createdAt: step.createdAt,
    updatedAt: step.updatedAt,
  };
}

export function toWorkflowDto(workflow: Workflow): WorkflowDto {
  return {
    id: workflow.id,
    type: 'workflow',
    title: workflow.title,
    description: workflow.description,
    purpose: workflow.purpose,
    status: workflow.status,
    difficulty: workflow.difficulty,
    estimatedTime: workflow.estimatedTime,
    notes: workflow.notes,
    favorite: workflow.favorite,
    tags: [...workflow.tags],
    stepCount: workflow.steps.length,
    steps: workflow.steps.map(toWorkflowStepDto),
    linkedResources: (workflow.linkedResources || []).map(toLinkedResourceDto),
    createdAt: workflow.createdAt,
    updatedAt: workflow.updatedAt,
  };
}

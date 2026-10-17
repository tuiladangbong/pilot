/**
 * Module-specific Domain Model for Workflows.
 * Represents reusable, structured AI workflows composed of ordered steps and linked resources.
 */

export type WorkflowStatus = 'Draft' | 'Active' | 'Archived';
export type WorkflowDifficulty = 'Easy' | 'Medium' | 'Advanced';

export interface LinkedResourceSummary {
  readonly id: string; // resource_relationship id
  readonly resourceId: string; // target resource id
  readonly relationshipType: 'USES' | 'REFERENCES';
  readonly stepId?: string | null;
  readonly title: string;
  readonly type: string;
  readonly description: string | null;
  readonly url?: string | null;
  readonly model?: string | null;
}

export interface WorkflowStep {
  readonly id: string;
  readonly workflowId: string;
  readonly position: number;
  readonly title: string;
  readonly instruction: string;
  readonly notes: string | null;
  readonly optional: boolean;
  readonly linkedResources: readonly LinkedResourceSummary[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface Workflow {
  readonly id: string;
  readonly title: string;
  readonly description: string | null;
  readonly purpose: string | null;
  readonly status: WorkflowStatus;
  readonly difficulty: WorkflowDifficulty;
  readonly estimatedTime: string | null;
  readonly notes: string | null;
  readonly favorite: boolean;
  readonly tags: readonly string[];
  readonly steps: readonly WorkflowStep[];
  readonly linkedResources: readonly LinkedResourceSummary[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CreateWorkflowStepInput {
  readonly id?: string;
  readonly title: string;
  readonly instruction?: string;
  readonly instructions?: string;
  readonly notes?: string | null;
  readonly optional?: boolean;
  readonly position?: number;
  readonly linkedResourceIds?: readonly string[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

export interface CreateWorkflowInput {
  readonly id?: string;
  readonly title: string;
  readonly description?: string | null;
  readonly purpose?: string | null;
  readonly status?: WorkflowStatus;
  readonly difficulty?: WorkflowDifficulty;
  readonly estimatedTime?: string | null;
  readonly notes?: string | null;
  readonly favorite?: boolean;
  readonly tags?: readonly string[];
  readonly steps?: readonly CreateWorkflowStepInput[];
  readonly linkedResourceIds?: readonly string[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

export interface UpdateWorkflowInput {
  readonly title?: string;
  readonly description?: string | null;
  readonly purpose?: string | null;
  readonly status?: WorkflowStatus;
  readonly difficulty?: WorkflowDifficulty;
  readonly estimatedTime?: string | null;
  readonly notes?: string | null;
  readonly favorite?: boolean;
  readonly tags?: readonly string[];
  readonly steps?: readonly CreateWorkflowStepInput[];
  readonly linkedResourceIds?: readonly string[];
}

export function normalizeTag(tag: string): string {
  return tag.trim().replace(/\s+/g, ' ').toLowerCase();
}

export function normalizeTags(tags?: readonly string[]): string[] {
  if (!tags || !Array.isArray(tags)) return [];
  const set = new Set<string>();
  for (const t of tags) {
    if (typeof t === 'string') {
      const normalized = normalizeTag(t);
      if (normalized.length > 0) {
        set.add(normalized);
      }
    }
  }
  return Array.from(set);
}

export function validateStatus(raw?: string | null): WorkflowStatus {
  if (!raw) return 'Active';
  const clean = raw.trim().toLowerCase();
  if (clean === 'draft') return 'Draft';
  if (clean === 'archived') return 'Archived';
  return 'Active';
}

export function validateDifficulty(raw?: string | null): WorkflowDifficulty {
  if (!raw) return 'Medium';
  const clean = raw.trim().toLowerCase();
  if (clean === 'easy') return 'Easy';
  if (clean === 'advanced') return 'Advanced';
  return 'Medium';
}

export function createWorkflowStep(
  workflowId: string,
  input: CreateWorkflowStepInput,
  position: number,
  linkedResources: readonly LinkedResourceSummary[] = []
): WorkflowStep {
  if (!input.title || input.title.trim() === '') {
    throw new Error('Step title must be non-empty');
  }
  const rawInstruction = input.instruction ?? input.instructions;
  if (!rawInstruction || rawInstruction.trim() === '') {
    throw new Error('Step instruction must be non-empty');
  }

  const now = new Date().toISOString();
  return {
    id: input.id && input.id.trim() !== '' ? input.id.trim() : crypto.randomUUID(),
    workflowId,
    position,
    title: input.title.trim(),
    instruction: rawInstruction.trim(),
    notes: input.notes?.trim() || null,
    optional: Boolean(input.optional),
    linkedResources,
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? now,
  };
}

export function createWorkflow(input: CreateWorkflowInput): Workflow {
  if (!input.title || input.title.trim() === '') {
    throw new Error('Workflow title must be non-empty');
  }

  const now = new Date().toISOString();
  const id = input.id && input.id.trim() !== '' ? input.id.trim() : crypto.randomUUID();

  const rawSteps = input.steps ?? [];
  const steps: WorkflowStep[] = rawSteps.map((stepInput, index) =>
    createWorkflowStep(id, stepInput, index + 1, [])
  );

  return {
    id,
    title: input.title.trim(),
    description: input.description?.trim() || null,
    purpose: input.purpose?.trim() || null,
    status: validateStatus(input.status),
    difficulty: validateDifficulty(input.difficulty),
    estimatedTime: input.estimatedTime?.trim() || null,
    notes: input.notes?.trim() || null,
    favorite: Boolean(input.favorite),
    tags: normalizeTags(input.tags),
    steps,
    linkedResources: [],
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? now,
  };
}

export function updateWorkflow(existing: Workflow, input: UpdateWorkflowInput): Workflow {
  const title = input.title !== undefined ? input.title.trim() : existing.title;
  if (!title) {
    throw new Error('Workflow title must be non-empty');
  }

  const now = new Date().toISOString();
  const description = input.description !== undefined ? input.description?.trim() || null : existing.description;
  const purpose = input.purpose !== undefined ? input.purpose?.trim() || null : existing.purpose;
  const status = input.status !== undefined ? validateStatus(input.status) : existing.status;
  const difficulty = input.difficulty !== undefined ? validateDifficulty(input.difficulty) : existing.difficulty;
  const estimatedTime = input.estimatedTime !== undefined ? input.estimatedTime?.trim() || null : existing.estimatedTime;
  const notes = input.notes !== undefined ? input.notes?.trim() || null : existing.notes;
  const favorite = input.favorite !== undefined ? Boolean(input.favorite) : existing.favorite;
  const tags = input.tags !== undefined ? normalizeTags(input.tags) : existing.tags;

  let steps: WorkflowStep[] = [...existing.steps];
  if (input.steps !== undefined) {
    steps = input.steps.map((stepInput, index) =>
      createWorkflowStep(existing.id, stepInput, index + 1, [])
    );
  }

  return {
    ...existing,
    title,
    description,
    purpose,
    status,
    difficulty,
    estimatedTime,
    notes,
    favorite,
    tags,
    steps,
    updatedAt: now,
  };
}

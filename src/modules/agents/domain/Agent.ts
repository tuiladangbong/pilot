/**
 * Module-specific Domain Model for Agents.
 * Represents a reusable AI role or worker definition, including instructions,
 * persona, autonomy level, expected inputs/outputs, and linked resources.
 *
 * Domain code is strictly decoupled from Cloudflare APIs and persistence details.
 */

export type AgentStatus = 'Draft' | 'Active' | 'Archived';
export type AgentAutonomyLevel = 'Manual' | 'Assisted' | 'Autonomous';
export type AgentRelationshipType = 'USES' | 'FOLLOWS' | 'REFERENCES' | 'ASSIGNS_TO';

export interface LinkedResourceSummary {
  readonly id: string; // resource_relationship id
  readonly resourceId: string; // target resource id
  readonly relationshipType: AgentRelationshipType;
  readonly title: string;
  readonly type: string;
  readonly description: string | null;
  readonly url?: string | null;
  readonly model?: string | null;
  readonly role?: string | null;
}

export interface Agent {
  readonly id: string;
  readonly title: string;
  readonly description: string | null;
  readonly role: string;
  readonly goal: string | null;
  readonly instructions: string;
  readonly runtime: string | null;
  readonly model: string | null;
  readonly status: AgentStatus;
  readonly autonomyLevel: AgentAutonomyLevel;
  readonly inputDescription: string | null;
  readonly outputDescription: string | null;
  readonly notes: string | null;
  readonly favorite: boolean;
  readonly tags: readonly string[];
  readonly linkedResources: readonly LinkedResourceSummary[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface LinkedResourceInput {
  readonly targetResourceId: string;
  readonly relationshipType?: AgentRelationshipType | string;
}

export interface CreateAgentInput {
  readonly id?: string;
  readonly title: string;
  readonly description?: string | null;
  readonly role: string;
  readonly goal?: string | null;
  readonly instructions: string;
  readonly runtime?: string | null;
  readonly model?: string | null;
  readonly status?: AgentStatus | string;
  readonly autonomyLevel?: AgentAutonomyLevel | string;
  readonly inputDescription?: string | null;
  readonly outputDescription?: string | null;
  readonly notes?: string | null;
  readonly favorite?: boolean;
  readonly tags?: readonly string[];
  readonly relationships?: readonly LinkedResourceInput[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

export interface UpdateAgentInput {
  readonly title?: string;
  readonly description?: string | null;
  readonly role?: string;
  readonly goal?: string | null;
  readonly instructions?: string;
  readonly runtime?: string | null;
  readonly model?: string | null;
  readonly status?: AgentStatus | string;
  readonly autonomyLevel?: AgentAutonomyLevel | string;
  readonly inputDescription?: string | null;
  readonly outputDescription?: string | null;
  readonly notes?: string | null;
  readonly favorite?: boolean;
  readonly tags?: readonly string[];
  readonly relationships?: readonly LinkedResourceInput[];
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

export function validateStatus(status?: string): AgentStatus {
  if (!status) return 'Active';
  const clean = status.trim().toLowerCase();
  if (clean === 'draft') return 'Draft';
  if (clean === 'archived') return 'Archived';
  return 'Active';
}

export function validateAutonomyLevel(level?: string): AgentAutonomyLevel {
  if (!level) return 'Manual';
  const clean = level.trim().toLowerCase();
  if (clean === 'assisted') return 'Assisted';
  if (clean === 'autonomous') return 'Autonomous';
  return 'Manual';
}

export function validateRelationshipType(type?: string): AgentRelationshipType {
  if (!type) return 'USES';
  const clean = type.trim().toUpperCase();
  if (clean === 'FOLLOWS') return 'FOLLOWS';
  if (clean === 'REFERENCES') return 'REFERENCES';
  if (clean === 'ASSIGNS_TO') return 'ASSIGNS_TO';
  return 'USES';
}

export function createAgent(input: CreateAgentInput): Agent {
  if (!input.title || typeof input.title !== 'string' || input.title.trim() === '') {
    throw new Error('Title is required');
  }
  if (!input.role || typeof input.role !== 'string' || input.role.trim() === '') {
    throw new Error('Role is required');
  }
  if (!input.instructions || typeof input.instructions !== 'string' || input.instructions.trim() === '') {
    throw new Error('Instructions are required');
  }

  const now = new Date().toISOString();
  const id = input.id && input.id.trim().length > 0 ? input.id.trim() : crypto.randomUUID();

  return {
    id,
    title: input.title.trim(),
    description: input.description && input.description.trim().length > 0 ? input.description.trim() : null,
    role: input.role.trim(),
    goal: input.goal && input.goal.trim().length > 0 ? input.goal.trim() : null,
    instructions: input.instructions, // Preserve raw whitespace & formatting
    runtime: input.runtime && input.runtime.trim().length > 0 ? input.runtime.trim() : null,
    model: input.model && input.model.trim().length > 0 ? input.model.trim() : null,
    status: validateStatus(input.status),
    autonomyLevel: validateAutonomyLevel(input.autonomyLevel),
    inputDescription: input.inputDescription && input.inputDescription.trim().length > 0 ? input.inputDescription.trim() : null,
    outputDescription: input.outputDescription && input.outputDescription.trim().length > 0 ? input.outputDescription.trim() : null,
    notes: input.notes && input.notes.trim().length > 0 ? input.notes.trim() : null,
    favorite: Boolean(input.favorite),
    tags: normalizeTags(input.tags),
    linkedResources: [],
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? now,
  };
}

export function updateAgent(existing: Agent, input: UpdateAgentInput): Agent {
  const updatedTitle = input.title !== undefined ? input.title.trim() : existing.title;
  if (!updatedTitle) {
    throw new Error('Title cannot be empty');
  }

  const updatedRole = input.role !== undefined ? input.role.trim() : existing.role;
  if (!updatedRole) {
    throw new Error('Role cannot be empty');
  }

  const updatedInstructions = input.instructions !== undefined ? input.instructions : existing.instructions;
  if (!updatedInstructions || updatedInstructions.trim() === '') {
    throw new Error('Instructions cannot be empty');
  }

  return {
    ...existing,
    title: updatedTitle,
    description: input.description !== undefined ? (input.description ? input.description.trim() : null) : existing.description,
    role: updatedRole,
    goal: input.goal !== undefined ? (input.goal ? input.goal.trim() : null) : existing.goal,
    instructions: updatedInstructions,
    runtime: input.runtime !== undefined ? (input.runtime ? input.runtime.trim() : null) : existing.runtime,
    model: input.model !== undefined ? (input.model ? input.model.trim() : null) : existing.model,
    status: input.status !== undefined ? validateStatus(input.status) : existing.status,
    autonomyLevel: input.autonomyLevel !== undefined ? validateAutonomyLevel(input.autonomyLevel) : existing.autonomyLevel,
    inputDescription: input.inputDescription !== undefined ? (input.inputDescription ? input.inputDescription.trim() : null) : existing.inputDescription,
    outputDescription: input.outputDescription !== undefined ? (input.outputDescription ? input.outputDescription.trim() : null) : existing.outputDescription,
    notes: input.notes !== undefined ? (input.notes ? input.notes.trim() : null) : existing.notes,
    favorite: input.favorite !== undefined ? Boolean(input.favorite) : existing.favorite,
    tags: input.tags !== undefined ? normalizeTags(input.tags) : existing.tags,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Generates a clean, plain-text exportable format of the Agent definition,
 * suitable for copying into prompt engineers, external LLM sessions, or documentation.
 */
export function formatFullAgentText(agent: Agent): string {
  const sections: string[] = [];

  sections.push(`Title: ${agent.title}`);
  sections.push(`Role:\n${agent.role}`);

  if (agent.goal) {
    sections.push(`Goal:\n${agent.goal}`);
  }

  const metaParts: string[] = [];
  if (agent.runtime) metaParts.push(`Runtime: ${agent.runtime}`);
  if (agent.model) metaParts.push(`Model: ${agent.model}`);
  metaParts.push(`Autonomy: ${agent.autonomyLevel}`);
  metaParts.push(`Status: ${agent.status}`);
  sections.push(metaParts.join(' | '));

  sections.push(`Instructions:\n${agent.instructions}`);

  if (agent.inputDescription) {
    sections.push(`Expected Input:\n${agent.inputDescription}`);
  }

  if (agent.outputDescription) {
    sections.push(`Expected Output:\n${agent.outputDescription}`);
  }

  if (agent.linkedResources && agent.linkedResources.length > 0) {
    const uses = agent.linkedResources.filter((r) => r.relationshipType === 'USES');
    const follows = agent.linkedResources.filter((r) => r.relationshipType === 'FOLLOWS');
    const refs = agent.linkedResources.filter((r) => r.relationshipType === 'REFERENCES');
    const assigns = agent.linkedResources.filter((r) => r.relationshipType === 'ASSIGNS_TO');

    const lines: string[] = ['Linked Resources:'];
    if (uses.length > 0) {
      lines.push('  Uses:');
      uses.forEach((u) => lines.push(`    - [${u.type.toUpperCase()}] ${u.title}`));
    }
    if (follows.length > 0) {
      lines.push('  Follows:');
      follows.forEach((f) => lines.push(`    - [${f.type.toUpperCase()}] ${f.title}`));
    }
    if (refs.length > 0) {
      lines.push('  References:');
      refs.forEach((r) => lines.push(`    - [${r.type.toUpperCase()}] ${r.title}`));
    }
    if (assigns.length > 0) {
      lines.push('  Assigns To:');
      assigns.forEach((a) => lines.push(`    - [${a.type.toUpperCase()}] ${a.title}`));
    }
    sections.push(lines.join('\n'));
  }

  if (agent.notes) {
    sections.push(`Notes:\n${agent.notes}`);
  }

  return sections.join('\n\n');
}

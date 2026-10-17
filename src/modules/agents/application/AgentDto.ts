import { Agent, AgentAutonomyLevel, AgentStatus, LinkedResourceSummary } from '../domain/Agent';

export interface AgentDto {
  readonly id: string;
  readonly type: 'agent';
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

export interface AgentSummaryDto {
  readonly id: string;
  readonly type: 'agent';
  readonly title: string;
  readonly description: string | null;
  readonly role: string;
  readonly goal: string | null;
  readonly runtime: string | null;
  readonly model: string | null;
  readonly status: AgentStatus;
  readonly autonomyLevel: AgentAutonomyLevel;
  readonly favorite: boolean;
  readonly tags: readonly string[];
  readonly linkedResourceCount: number;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export function toAgentDto(agent: Agent): AgentDto {
  return {
    id: agent.id,
    type: 'agent',
    title: agent.title,
    description: agent.description,
    role: agent.role,
    goal: agent.goal,
    instructions: agent.instructions,
    runtime: agent.runtime,
    model: agent.model,
    status: agent.status,
    autonomyLevel: agent.autonomyLevel,
    inputDescription: agent.inputDescription,
    outputDescription: agent.outputDescription,
    notes: agent.notes,
    favorite: agent.favorite,
    tags: agent.tags,
    linkedResources: agent.linkedResources,
    createdAt: agent.createdAt,
    updatedAt: agent.updatedAt,
  };
}

export function toAgentSummaryDto(agent: Agent): AgentSummaryDto {
  return {
    id: agent.id,
    type: 'agent',
    title: agent.title,
    description: agent.description,
    role: agent.role,
    goal: agent.goal,
    runtime: agent.runtime,
    model: agent.model,
    status: agent.status,
    autonomyLevel: agent.autonomyLevel,
    favorite: agent.favorite,
    tags: agent.tags,
    linkedResourceCount: agent.linkedResources ? agent.linkedResources.length : 0,
    createdAt: agent.createdAt,
    updatedAt: agent.updatedAt,
  };
}

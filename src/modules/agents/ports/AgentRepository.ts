import { Agent, AgentAutonomyLevel, AgentStatus } from '../domain/Agent';
import { TagWithCount } from '../../prompts/ports/PromptRepository';

export interface ListAgentsFilter {
  readonly q?: string;
  readonly status?: AgentStatus;
  readonly autonomy?: AgentAutonomyLevel;
  readonly runtime?: string;
  readonly model?: string;
  readonly tag?: string;
  readonly favorite?: boolean;
  readonly sort?: 'updated_at' | 'created_at' | 'title';
  readonly order?: 'asc' | 'desc';
  readonly limit?: number;
  readonly offset?: number;
}

export interface AgentRepository {
  findById(id: string): Promise<Agent | null>;
  list(filter?: ListAgentsFilter): Promise<{ agents: Agent[]; total: number }>;
  save(agent: Agent, linkedResources?: { targetResourceId: string; relationshipType?: string }[]): Promise<void>;
  update(agent: Agent, linkedResources?: { targetResourceId: string; relationshipType?: string }[]): Promise<void>;
  delete(id: string): Promise<boolean>;
  setFavorite(id: string, favorite: boolean): Promise<boolean>;
  getDistinctRuntimes(): Promise<string[]>;
  getDistinctModels(): Promise<string[]>;
  getAllTags(): Promise<TagWithCount[]>;
}

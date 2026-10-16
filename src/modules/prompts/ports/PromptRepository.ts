import { Prompt } from '../domain/Prompt';

export interface ListPromptsFilter {
  readonly q?: string;
  readonly tag?: string;
  readonly favorite?: boolean;
  readonly model?: string;
  readonly sort?: 'updated_at' | 'created_at' | 'title';
  readonly order?: 'asc' | 'desc';
  readonly limit?: number;
  readonly offset?: number;
}

export interface TagWithCount {
  readonly id: string;
  readonly name: string;
  readonly count: number;
}

export interface PromptRepository {
  findById(id: string): Promise<Prompt | null>;
  list(filter?: ListPromptsFilter): Promise<{ prompts: Prompt[]; total: number }>;
  save(prompt: Prompt): Promise<void>;
  update(prompt: Prompt): Promise<void>;
  delete(id: string): Promise<boolean>;
  setFavorite(id: string, favorite: boolean): Promise<boolean>;
  getDistinctModels(): Promise<string[]>;
  getAllTags(): Promise<TagWithCount[]>;
}

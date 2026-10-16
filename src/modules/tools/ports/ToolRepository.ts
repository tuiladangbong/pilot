import { Tool, ToolKind, ToolPricing } from '../domain/Tool';
import { TagWithCount } from '../../prompts/ports/PromptRepository';

export interface ListToolsFilter {
  readonly q?: string;
  readonly kind?: ToolKind;
  readonly category?: string;
  readonly provider?: string;
  readonly pricing?: ToolPricing;
  readonly tag?: string;
  readonly favorite?: boolean;
  readonly sort?: 'updated_at' | 'created_at' | 'title';
  readonly order?: 'asc' | 'desc';
  readonly limit?: number;
  readonly offset?: number;
}

export interface ToolRepository {
  findById(id: string): Promise<Tool | null>;
  findByUrl(url: string): Promise<Tool | null>;
  list(filter?: ListToolsFilter): Promise<{ tools: Tool[]; total: number }>;
  save(tool: Tool): Promise<void>;
  update(tool: Tool): Promise<void>;
  delete(id: string): Promise<boolean>;
  setFavorite(id: string, favorite: boolean): Promise<boolean>;
  getDistinctCategories(): Promise<string[]>;
  getDistinctProviders(): Promise<string[]>;
  getAllTags(): Promise<TagWithCount[]>;
}

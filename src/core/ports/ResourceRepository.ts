import { Resource } from '../domain/Resource';

export interface ListResourcesFilter {
  type?: string;
  favorite?: boolean;
  tag?: string;
  q?: string;
  sort?: 'updated_at' | 'created_at' | 'title';
  order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface ResourceWithDetails extends Resource {
  tags: string[];
  extra?: Record<string, unknown>;
}

export interface ResourceRepository {
  findById(id: string): Promise<ResourceWithDetails | null>;
  list(filter?: ListResourcesFilter): Promise<{ resources: ResourceWithDetails[]; total: number }>;
  save(resource: Resource): Promise<void>;
  delete(id: string): Promise<void>;
  setFavorite(id: string, favorite: boolean): Promise<boolean>;
}

import { Resource } from '../domain/Resource';

/**
 * Persistence Port for Core Resources
 * Implemented by infrastructure adapters (e.g. D1).
 */
export interface ResourceRepository {
  findById(id: string): Promise<Resource | null>;
  list(filter?: { type?: string; limit?: number; offset?: number }): Promise<Resource[]>;
  save(resource: Resource): Promise<void>;
  delete(id: string): Promise<void>;
}

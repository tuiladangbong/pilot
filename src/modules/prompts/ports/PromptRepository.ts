import { PromptDetails } from '../domain/Prompt';

/**
 * Module-specific persistence port for Prompts.
 * Implemented by infrastructure adapters (e.g. D1).
 */
export interface PromptRepository {
  findByResourceId(resourceId: string): Promise<PromptDetails | null>;
  save(prompt: PromptDetails): Promise<void>;
  delete(resourceId: string): Promise<void>;
}

import { Resource } from '../../../core/domain/Resource';

/**
 * Module-specific domain model for Prompts.
 * A Prompt extends or pairs with a Core Resource via resourceId.
 */
export interface PromptDetails {
  readonly resourceId: string;
  readonly content: string;
  readonly model: string | null;
  readonly favorite: boolean;
}

export interface PromptResource {
  readonly resource: Resource;
  readonly prompt: PromptDetails;
}

export interface CreatePromptInput {
  readonly resourceId: string;
  readonly content: string;
  readonly model?: string | null;
  readonly favorite?: boolean;
}

export function createPromptDetails(input: CreatePromptInput): PromptDetails {
  if (!input.resourceId || input.resourceId.trim() === '') {
    throw new Error('Prompt resourceId must be non-empty');
  }
  if (!input.content || input.content.trim() === '') {
    throw new Error('Prompt content must be non-empty');
  }

  return {
    resourceId: input.resourceId.trim(),
    content: input.content,
    model: input.model?.trim() ?? null,
    favorite: input.favorite ?? false,
  };
}

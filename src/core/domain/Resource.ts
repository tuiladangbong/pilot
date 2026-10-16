/**
 * Core Resource Domain Entity
 * 
 * Represents universally shared metadata for any AI-related resource in Pilot.
 * Domain code is strictly decoupled from Cloudflare APIs and persistence details.
 */
export interface Resource {
  readonly id: string;
  readonly type: string;
  readonly title: string;
  readonly description: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CreateResourceInput {
  readonly id: string;
  readonly type: string;
  readonly title: string;
  readonly description?: string | null;
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

export function createResource(input: CreateResourceInput): Resource {
  if (!input.id || input.id.trim() === '') {
    throw new Error('Resource id must be non-empty');
  }
  if (!input.type || input.type.trim() === '') {
    throw new Error('Resource type must be non-empty');
  }
  if (!input.title || input.title.trim() === '') {
    throw new Error('Resource title must be non-empty');
  }

  const now = new Date().toISOString();
  return {
    id: input.id.trim(),
    type: input.type.trim().toLowerCase(),
    title: input.title.trim(),
    description: input.description?.trim() ?? null,
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? now,
  };
}

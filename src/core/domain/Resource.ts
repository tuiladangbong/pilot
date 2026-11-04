/**
 * Core Resource Domain Entity
 * 
 * Represents universally shared metadata for any AI-related resource in Pilot.
 * Domain code is strictly decoupled from Cloudflare APIs and persistence details.
 */

export type ResourceOrigin = 'curated' | 'user' | 'discovered';

export interface Resource {
  readonly id: string;
  readonly type: string;
  readonly title: string;
  readonly description: string | null;
  readonly slug?: string | null;
  readonly featured: boolean;
  readonly origin: ResourceOrigin;
  readonly favorite: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CreateResourceInput {
  readonly id: string;
  readonly type: string;
  readonly title: string;
  readonly description?: string | null;
  readonly slug?: string | null;
  readonly featured?: boolean;
  readonly origin?: ResourceOrigin;
  readonly favorite?: boolean;
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
    slug: input.slug && input.slug.trim() !== '' ? input.slug.trim().toLowerCase() : null,
    featured: Boolean(input.featured),
    origin: (input.origin ?? 'curated') as ResourceOrigin,
    favorite: Boolean(input.favorite),
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? now,
  };
}

const RESOURCE_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;

/**
 * Resolves a caller-supplied resource id (or generates a UUID when absent).
 * Ids end up in URLs and HTML attributes, so only a conservative charset is accepted.
 */
export function resolveResourceId(rawId?: string | null): string {
  const trimmed = typeof rawId === 'string' ? rawId.trim() : '';
  if (trimmed === '') {
    return crypto.randomUUID();
  }
  if (!RESOURCE_ID_PATTERN.test(trimmed)) {
    throw new Error('Resource id may only contain letters, digits, ".", "_" and "-" (max 128 chars)');
  }
  return trimmed;
}

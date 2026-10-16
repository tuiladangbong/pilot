/**
 * Module-specific Domain Model for Prompts.
 * A Prompt is the first functional resource in Pilot.
 * 
 * Prompts extend the core Resource concept with prompt-specific fields
 * (content, model, favorite, tags).
 */

export interface Prompt {
  readonly id: string;
  readonly title: string;
  readonly description: string | null;
  readonly content: string;
  readonly model: string | null;
  readonly favorite: boolean;
  readonly tags: readonly string[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CreatePromptInput {
  readonly id?: string;
  readonly title: string;
  readonly description?: string | null;
  readonly content: string;
  readonly model?: string | null;
  readonly favorite?: boolean;
  readonly tags?: readonly string[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

export interface UpdatePromptInput {
  readonly title?: string;
  readonly description?: string | null;
  readonly content?: string;
  readonly model?: string | null;
  readonly favorite?: boolean;
  readonly tags?: readonly string[];
}

export function normalizeTag(tag: string): string {
  return tag.trim().replace(/\s+/g, ' ').toLowerCase();
}

export function normalizeTags(tags?: readonly string[]): string[] {
  if (!tags || !Array.isArray(tags)) return [];
  const set = new Set<string>();
  for (const t of tags) {
    if (typeof t === 'string') {
      const normalized = normalizeTag(t);
      if (normalized.length > 0) {
        set.add(normalized);
      }
    }
  }
  return Array.from(set);
}

export function createPrompt(input: CreatePromptInput): Prompt {
  if (!input.title || input.title.trim() === '') {
    throw new Error('Title is required');
  }
  if (!input.content || input.content.trim() === '') {
    throw new Error('Prompt content is required');
  }

  const now = new Date().toISOString();
  const id = input.id && input.id.trim() !== '' ? input.id.trim() : crypto.randomUUID();

  return {
    id,
    title: input.title.trim(),
    description: input.description !== undefined && input.description !== null && input.description.trim() !== ''
      ? input.description.trim()
      : null,
    content: input.content, // Preserve exact formatting and whitespace
    model: input.model !== undefined && input.model !== null && input.model.trim() !== ''
      ? input.model.trim()
      : null,
    favorite: Boolean(input.favorite),
    tags: normalizeTags(input.tags),
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? now,
  };
}

export function updatePrompt(current: Prompt, input: UpdatePromptInput): Prompt {
  const newTitle = input.title !== undefined ? input.title.trim() : current.title;
  if (newTitle === '') {
    throw new Error('Title cannot be empty');
  }

  const newContent = input.content !== undefined ? input.content : current.content;
  if (newContent.trim() === '') {
    throw new Error('Prompt content cannot be empty');
  }

  const newDescription = input.description !== undefined
    ? (input.description && input.description.trim() !== '' ? input.description.trim() : null)
    : current.description;

  const newModel = input.model !== undefined
    ? (input.model && input.model.trim() !== '' ? input.model.trim() : null)
    : current.model;

  const newFavorite = input.favorite !== undefined ? Boolean(input.favorite) : current.favorite;
  const newTags = input.tags !== undefined ? normalizeTags(input.tags) : current.tags;

  return {
    ...current,
    title: newTitle,
    description: newDescription,
    content: newContent,
    model: newModel,
    favorite: newFavorite,
    tags: newTags,
    updatedAt: new Date().toISOString(),
  };
}

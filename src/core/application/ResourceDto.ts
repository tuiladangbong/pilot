import { Resource } from '../domain/Resource';
import { ResourceWithDetails } from '../ports/ResourceRepository';

export interface ResourceSummaryDto {
  id: string;
  type: string;
  title: string;
  description: string | null;
  slug?: string | null;
  featured: boolean;
  origin: string;
  favorite: boolean;
  createdAt: string;
  updatedAt: string;
  tags?: string[];
  extra?: Record<string, unknown>;
}

export function toResourceSummaryDto(resource: ResourceWithDetails | Resource): ResourceSummaryDto {
  const tags = 'tags' in resource && Array.isArray(resource.tags) ? resource.tags : [];
  const extra = 'extra' in resource ? resource.extra : undefined;
  return {
    id: resource.id,
    type: resource.type,
    title: resource.title,
    description: resource.description,
    slug: resource.slug,
    featured: Boolean(resource.featured),
    origin: resource.origin ?? 'curated',
    favorite: resource.favorite,
    createdAt: resource.createdAt,
    updatedAt: resource.updatedAt,
    tags,
    extra,
  };
}

import { Resource } from '../domain/Resource';

export interface ResourceSummaryDto {
  id: string;
  type: string;
  title: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

export function toResourceSummaryDto(resource: Resource): ResourceSummaryDto {
  return {
    id: resource.id,
    type: resource.type,
    title: resource.title,
    description: resource.description,
    createdAt: resource.createdAt,
    updatedAt: resource.updatedAt,
  };
}

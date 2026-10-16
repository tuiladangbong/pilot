import { PromptDetails } from '../domain/Prompt';
import { ResourceSummaryDto } from '../../../core/application/ResourceDto';

export interface PromptDto {
  resource: ResourceSummaryDto;
  content: string;
  model: string | null;
  favorite: boolean;
}

export function toPromptDetailsDto(details: PromptDetails) {
  return {
    resourceId: details.resourceId,
    content: details.content,
    model: details.model,
    favorite: details.favorite,
  };
}

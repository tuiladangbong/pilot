import { Prompt } from '../domain/Prompt';

export interface PromptDto {
  id: string;
  type: 'prompt';
  title: string;
  description: string | null;
  content: string;
  model: string | null;
  favorite: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export function toPromptDto(prompt: Prompt): PromptDto {
  return {
    id: prompt.id,
    type: 'prompt',
    title: prompt.title,
    description: prompt.description,
    content: prompt.content,
    model: prompt.model,
    favorite: prompt.favorite,
    tags: [...prompt.tags],
    createdAt: prompt.createdAt,
    updatedAt: prompt.updatedAt,
  };
}

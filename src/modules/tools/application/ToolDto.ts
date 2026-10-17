import { Tool, ToolKind, ToolPricing } from '../domain/Tool';

export interface ToolDto {
  id: string;
  slug?: string | null;
  type: ToolKind;
  title: string;
  description: string | null;
  url: string;
  hostname: string;
  kind: ToolKind;
  provider: string | null;
  category: string | null;
  pricing: ToolPricing;
  notes: string | null;
  faviconUrl: string | null;
  favorite: boolean;
  featured: boolean;
  origin: string;
  verifiedAt: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export function toToolDto(tool: Tool): ToolDto {
  return {
    id: tool.id,
    slug: tool.slug,
    type: tool.kind,
    title: tool.title,
    description: tool.description,
    url: tool.url,
    hostname: tool.hostname,
    kind: tool.kind,
    provider: tool.provider,
    category: tool.category,
    pricing: tool.pricing,
    notes: tool.notes,
    faviconUrl: tool.faviconUrl,
    favorite: tool.favorite,
    featured: tool.featured,
    origin: tool.origin,
    verifiedAt: tool.verifiedAt,
    tags: [...tool.tags],
    createdAt: tool.createdAt,
    updatedAt: tool.updatedAt,
  };
}

/**
 * Module-specific Domain Model for AI Tools & Websites.
 * Represents useful AI tools, web apps, SaaS services, playgrounds, and reference websites.
 */

export type ToolKind = 'tool' | 'website';

export type ToolPricing = 'Free' | 'Freemium' | 'Paid' | 'Open Source' | 'Unknown';

export interface Tool {
  readonly id: string;
  readonly title: string;
  readonly description: string | null;
  readonly url: string;
  readonly hostname: string;
  readonly kind: ToolKind;
  readonly provider: string | null;
  readonly category: string | null;
  readonly pricing: ToolPricing;
  readonly notes: string | null;
  readonly faviconUrl: string | null;
  readonly favorite: boolean;
  readonly tags: readonly string[];
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface CreateToolInput {
  readonly id?: string;
  readonly title: string;
  readonly description?: string | null;
  readonly url: string;
  readonly kind?: ToolKind;
  readonly provider?: string | null;
  readonly category?: string | null;
  readonly pricing?: ToolPricing;
  readonly notes?: string | null;
  readonly faviconUrl?: string | null;
  readonly favorite?: boolean;
  readonly tags?: readonly string[];
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

export interface UpdateToolInput {
  readonly title?: string;
  readonly description?: string | null;
  readonly url?: string;
  readonly kind?: ToolKind;
  readonly provider?: string | null;
  readonly category?: string | null;
  readonly pricing?: ToolPricing;
  readonly notes?: string | null;
  readonly faviconUrl?: string | null;
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

/**
 * Validates and normalizes HTTP/HTTPS URLs.
 * Preserves query strings and hash while trimming and normalizing scheme/host.
 */
export function normalizeUrl(rawUrl: string): string {
  if (!rawUrl || typeof rawUrl !== 'string') {
    throw new Error('URL is required');
  }

  const trimmed = rawUrl.trim();
  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error('Invalid URL format');
  }

  if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
    throw new Error('URL must use http:// or https://');
  }

  return parsed.toString();
}

/**
 * Extracts clean, human-friendly hostname for display and indexing.
 * e.g. "https://www.anthropic.com/claude" -> "anthropic.com"
 */
export function extractHostname(url: string): string {
  try {
    const parsed = new URL(url);
    let host = parsed.hostname.toLowerCase();
    if (host.startsWith('www.')) {
      host = host.slice(4);
    }
    return host;
  } catch {
    return '';
  }
}

export function validateKind(kind?: string): ToolKind {
  if (kind === 'website') return 'website';
  return 'tool'; // default to 'tool'
}

export function validatePricing(pricing?: string): ToolPricing {
  const allowed: ToolPricing[] = ['Free', 'Freemium', 'Paid', 'Open Source', 'Unknown'];
  if (!pricing) return 'Unknown';
  const match = allowed.find((p) => p.toLowerCase() === pricing.trim().toLowerCase());
  return match ?? 'Unknown';
}

export function isPrivateOrBlockedHost(hostname: string): boolean {
  const host = hostname.toLowerCase().trim();
  if (!host) return true;

  if (
    host === 'localhost' ||
    host.endsWith('.localhost') ||
    host.endsWith('.local') ||
    host.endsWith('.internal') ||
    host === 'metadata.google.internal'
  ) {
    return true;
  }

  // IPv4 check
  const ipv4Match = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    const [, b0, b1, b2, b3] = ipv4Match.map(Number);
    if (b0 > 255 || b1 > 255 || b2 > 255 || b3 > 255) return true;

    // 0.0.0.0/8
    if (b0 === 0) return true;
    // 127.0.0.0/8 loopback
    if (b0 === 127) return true;
    // 10.0.0.0/8 private
    if (b0 === 10) return true;
    // 172.16.0.0/12 private (172.16 - 172.31)
    if (b0 === 172 && b1 >= 16 && b1 <= 31) return true;
    // 192.168.0.0/16 private
    if (b0 === 192 && b1 === 168) return true;
    // 169.254.0.0/16 link-local / cloud metadata (e.g. AWS 169.254.169.254)
    if (b0 === 169 && b1 === 254) return true;
    // 100.64.0.0/10 carrier-grade NAT
    if (b0 === 100 && b1 >= 64 && b1 <= 127) return true;
  }

  // IPv6 check
  if (
    host === '::1' ||
    host === '[::1]' ||
    host.startsWith('fe80:') ||
    host.startsWith('fc00:') ||
    host.startsWith('fd00:') ||
    host.startsWith('[fe80:') ||
    host.startsWith('[fc00:') ||
    host.startsWith('[fd00:')
  ) {
    return true;
  }

  return false;
}

export function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&quot;/gi, '"')
    .replace(/&apos;/gi, "'")
    .replace(/&#39;/gi, "'")
    .replace(/&#x27;/gi, "'")
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&mdash;/gi, '—')
    .replace(/&ndash;/gi, '–')
    .replace(/&hellip;/gi, '…')
    .replace(/&copy;/gi, '©')
    .replace(/&bull;/gi, '•')
    .replace(/&rsquo;|&lsquo;/gi, "'")
    .replace(/&rdquo;|&ldquo;/gi, '"')
    .replace(/&#(\d+);/g, (_, dec) => {
      const code = parseInt(dec, 10);
      return !isNaN(code) && code > 0 && code < 65536 ? String.fromCharCode(code) : '';
    })
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => {
      const code = parseInt(hex, 16);
      return !isNaN(code) && code > 0 && code < 65536 ? String.fromCharCode(code) : '';
    });
}

export function createTool(input: CreateToolInput): Tool {
  if (!input.title || input.title.trim() === '') {
    throw new Error('Title is required');
  }

  const url = normalizeUrl(input.url);
  const hostname = extractHostname(url);
  const kind = validateKind(input.kind);
  const pricing = validatePricing(input.pricing);
  const now = new Date().toISOString();
  const id = input.id && input.id.trim() !== '' ? input.id.trim() : crypto.randomUUID();

  return {
    id,
    title: input.title.trim(),
    description: input.description && input.description.trim() !== '' ? input.description.trim() : null,
    url,
    hostname,
    kind,
    provider: input.provider && input.provider.trim() !== '' ? input.provider.trim() : null,
    category: input.category && input.category.trim() !== '' ? input.category.trim() : null,
    pricing,
    notes: input.notes && input.notes.trim() !== '' ? input.notes : null,
    faviconUrl: input.faviconUrl && input.faviconUrl.trim() !== '' ? input.faviconUrl.trim() : null,
    favorite: Boolean(input.favorite),
    tags: normalizeTags(input.tags),
    createdAt: input.createdAt ?? now,
    updatedAt: input.updatedAt ?? now,
  };
}

export function updateTool(current: Tool, input: UpdateToolInput): Tool {
  const title = input.title !== undefined ? input.title.trim() : current.title;
  if (!title) {
    throw new Error('Title cannot be empty');
  }

  let url = current.url;
  let hostname = current.hostname;
  if (input.url !== undefined) {
    url = normalizeUrl(input.url);
    hostname = extractHostname(url);
  }

  const kind = input.kind !== undefined ? validateKind(input.kind) : current.kind;
  const pricing = input.pricing !== undefined ? validatePricing(input.pricing) : current.pricing;
  const description = input.description !== undefined
    ? (input.description && input.description.trim() !== '' ? input.description.trim() : null)
    : current.description;
  const provider = input.provider !== undefined
    ? (input.provider && input.provider.trim() !== '' ? input.provider.trim() : null)
    : current.provider;
  const category = input.category !== undefined
    ? (input.category && input.category.trim() !== '' ? input.category.trim() : null)
    : current.category;
  const notes = input.notes !== undefined
    ? (input.notes && input.notes.trim() !== '' ? input.notes : null)
    : current.notes;
  const faviconUrl = input.faviconUrl !== undefined
    ? (input.faviconUrl && input.faviconUrl.trim() !== '' ? input.faviconUrl.trim() : null)
    : current.faviconUrl;
  const favorite = input.favorite !== undefined ? Boolean(input.favorite) : current.favorite;
  const tags = input.tags !== undefined ? normalizeTags(input.tags) : current.tags;

  return {
    ...current,
    title,
    description,
    url,
    hostname,
    kind,
    provider,
    category,
    pricing,
    notes,
    faviconUrl,
    favorite,
    tags,
    updatedAt: new Date().toISOString(),
  };
}

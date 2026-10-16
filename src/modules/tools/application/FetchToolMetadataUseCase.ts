import {
  extractHostname,
  normalizeUrl,
  isPrivateOrBlockedHost,
  decodeHtmlEntities,
} from '../domain/Tool';

export interface ToolMetadataResult {
  url: string;
  hostname: string;
  title: string | null;
  description: string | null;
  provider: string | null;
  faviconUrl: string | null;
}

function cleanString(str?: string | null): string | null {
  if (!str) return null;
  const decoded = decodeHtmlEntities(str).replace(/\s+/g, ' ').trim();
  return decoded.length > 0 ? decoded : null;
}

export class FetchToolMetadataUseCase {
  async execute(rawUrl: string): Promise<ToolMetadataResult> {
    const url = normalizeUrl(rawUrl);
    const parsedUrl = new URL(url);
    const hostname = extractHostname(url);

    if (isPrivateOrBlockedHost(parsedUrl.hostname)) {
      throw new Error(`Access to restricted internal/private host is forbidden: ${parsedUrl.hostname}`);
    }

    const defaultFavicon = `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; PilotBot/1.0; +https://pilot.nodbits.com)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.9',
        },
        signal: controller.signal,
        redirect: 'follow',
      });

      clearTimeout(timeoutId);

      const finalUrl = response.url || url;
      const finalHostname = extractHostname(finalUrl) || hostname;

      // Read at most 64KB to capture metadata without exhausting memory
      let html = '';
      if (response.body) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8', { fatal: false, ignoreBOM: true });
        let bytesRead = 0;
        const maxBytes = 65536;

        try {
          while (bytesRead < maxBytes) {
            const { done, value } = await reader.read();
            if (done || !value) break;
            bytesRead += value.byteLength;
            html += decoder.decode(value, { stream: true });
            if (html.includes('</head>') || html.includes('<body') || html.includes('</HEAD>')) {
              break;
            }
          }
        } finally {
          try {
            await reader.cancel();
          } catch {
            // Ignore cancel error
          }
        }
        html += decoder.decode();
      }

      // Extract metadata
      let title: string | null = null;
      let description: string | null = null;
      let provider: string | null = null;
      let faviconUrl: string | null = null;

      // 1. Title: og:title or <title>
      const ogTitleMatch = html.match(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']+)["']/i) ||
                           html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:title["']/i);
      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      if (ogTitleMatch && ogTitleMatch[1]) {
        title = cleanString(ogTitleMatch[1]);
      } else if (titleMatch && titleMatch[1]) {
        title = cleanString(titleMatch[1]);
      }

      // 2. Description: og:description or meta description
      const ogDescMatch = html.match(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']+)["']/i) ||
                          html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:description["']/i);
      const metaDescMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i) ||
                            html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']description["']/i);
      if (ogDescMatch && ogDescMatch[1]) {
        description = cleanString(ogDescMatch[1]);
      } else if (metaDescMatch && metaDescMatch[1]) {
        description = cleanString(metaDescMatch[1]);
      }

      // 3. Provider: og:site_name or fallback
      const siteNameMatch = html.match(/<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']+)["']/i) ||
                            html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:site_name["']/i);
      if (siteNameMatch && siteNameMatch[1]) {
        provider = cleanString(siteNameMatch[1]);
      }

      // 4. Favicon: icon or apple-touch-icon
      const iconMatch = html.match(/<link[^>]+rel=["'](?:shortcut )?icon["'][^>]+href=["']([^"']+)["']/i) ||
                        html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["'](?:shortcut )?icon["']/i) ||
                        html.match(/<link[^>]+rel=["']apple-touch-icon(?:-precomposed)?["'][^>]+href=["']([^"']+)["']/i);
      if (iconMatch && iconMatch[1]) {
        const rawIcon = iconMatch[1].trim();
        try {
          faviconUrl = new URL(rawIcon, finalUrl).toString();
        } catch {
          faviconUrl = defaultFavicon;
        }
      } else {
        faviconUrl = defaultFavicon;
      }

      return {
        url: finalUrl,
        hostname: finalHostname,
        title,
        description,
        provider,
        faviconUrl,
      };
    } catch (err: unknown) {
      // Return gracefully with URL-derived defaults if fetch fails
      const errorMessage = err instanceof Error ? err.message : String(err);
      if (errorMessage.includes('restricted internal/private host')) {
        throw err;
      }
      return {
        url,
        hostname,
        title: null,
        description: null,
        provider: null,
        faviconUrl: defaultFavicon,
      };
    }
  }
}

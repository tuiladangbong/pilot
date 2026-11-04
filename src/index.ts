import { Env } from './platform/cloudflare/env';
import { createCloudflareDependencies } from './platform/cloudflare/bootstrap';
import { handleRequest } from './adapters/http/router';

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function withSecurityAndTrackingHeaders(response: Response, requestId: string): Response {
  const newHeaders = new Headers(response.headers);
  newHeaders.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  newHeaders.set('X-Content-Type-Options', 'nosniff');
  newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  newHeaders.set('X-Frame-Options', 'DENY');
  // Only directives that cannot break the current UI (inline handlers/third-party favicons still in use).
  if (!newHeaders.has('Content-Security-Policy')) {
    newHeaders.set(
      'Content-Security-Policy',
      "frame-ancestors 'none'; base-uri 'self'; object-src 'none'; form-action 'self'"
    );
  }
  if (!newHeaders.has('X-Request-Id')) {
    newHeaders.set('X-Request-Id', requestId);
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
}

/**
 * One structured JSON line per API request; mutations are logged with event "mutation"
 * so operators can answer who/what/when for catalog changes (actor is always the curator token holder).
 */
function logRequest(request: Request, response: Response, requestId: string, durationMs: number): void {
  const url = new URL(request.url);
  if (!url.pathname.startsWith('/api/')) return;
  const method = request.method.toUpperCase();
  const isMutation = method !== 'GET' && method !== 'HEAD' && method !== 'OPTIONS';
  if (!isMutation && response.status < 500) return;
  console.log(
    JSON.stringify({
      event: isMutation ? 'mutation' : 'request_error',
      requestId,
      method,
      path: url.pathname,
      status: response.status,
      durationMs,
    })
  );
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const requestId = request.headers.get('cf-ray') || request.headers.get('x-request-id') || crypto.randomUUID();
    const startedAt = Date.now();
    const res = await this.handleFetch(request, env, ctx);
    const finalResponse = withSecurityAndTrackingHeaders(res, requestId);
    logRequest(request, finalResponse, requestId, Date.now() - startedAt);
    return finalResponse;
  },

  async handleFetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const deps = createCloudflareDependencies(env);

    // Route API endpoints
    if (url.pathname.startsWith('/api/')) {
      return handleRequest(request, deps);
    }

    // Serve static assets if binding exists
    if (env.ASSETS) {
      const assetResponse = await env.ASSETS.fetch(request);
      if (assetResponse.status !== 404) {
        return assetResponse;
      }

      // Single-page navigation fallback for public resource pages & admin
      const isPublicResourceOrAdmin =
        url.pathname === '/admin' ||
        url.pathname.startsWith('/admin/') ||
        url.pathname.startsWith('/tools/') ||
        url.pathname.startsWith('/tool/') ||
        url.pathname.startsWith('/prompt/') ||
        url.pathname.startsWith('/workflow/') ||
        url.pathname.startsWith('/agent/');

      if (isPublicResourceOrAdmin) {
        const indexRequest = new Request(new URL('/', request.url).toString(), request);
        const indexResponse = await env.ASSETS.fetch(indexRequest);

        // Basic SEO metadata injection for crawlers and social previews on tool/website pages
        if (url.pathname.startsWith('/tools/') || url.pathname.startsWith('/tool/')) {
          try {
            const rawIdOrSlug = url.pathname.replace(/^\/(?:tools|tool)\//, '').split('/')[0];
            const idOrSlug = decodeURIComponent(rawIdOrSlug || '');
            if (idOrSlug) {
              const tool = await deps.toolRepo.findByIdOrSlug(idOrSlug);
              if (tool) {
                const originalHtml = await indexResponse.text();
                const pageTitle = `${escapeHtml(tool.title)} - AI Resource Hub | Pilot`;
                const pageDesc = escapeHtml(tool.description || `${tool.title} (${tool.category || 'AI Tool'}) on Pilot AI Resource Hub.`);
                const pageUrl = escapeHtml(request.url);

                const seoTags = `
  <title>${pageTitle}</title>
  <meta name="description" content="${pageDesc}">
  <link rel="canonical" href="${pageUrl}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${pageTitle}">
  <meta property="og:description" content="${pageDesc}">
  <meta property="og:url" content="${pageUrl}">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="${pageTitle}">
  <meta name="twitter:description" content="${pageDesc}">`;

                const updatedHtml = originalHtml.replace(
                  /<title>.*?<\/title>/,
                  seoTags
                );

                return new Response(updatedHtml, {
                  status: 200,
                  headers: {
                    'Content-Type': 'text/html; charset=utf-8',
                    'Cache-Control': 'public, max-age=60',
                  },
                });
              }
            }
          } catch {
            // In case of any lookup or parse error, gracefully fallback to raw indexResponse
          }
        }

        return indexResponse;
      }
    }

    // Fallback handling
    return handleRequest(request, deps);
  },
};

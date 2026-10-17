import { Env } from './platform/cloudflare/env';
import { createCloudflareDependencies } from './platform/cloudflare/bootstrap';
import { handleRequest } from './adapters/http/router';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
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

      // Single-page navigation fallback for /prompt/:id, /tool/:id, and /workflow/:id routes
      if (
        url.pathname.startsWith('/prompt/') ||
        url.pathname.startsWith('/tool/') ||
        url.pathname.startsWith('/workflow/')
      ) {
        const indexRequest = new Request(new URL('/', request.url).toString(), request);
        return env.ASSETS.fetch(indexRequest);
      }
    }

    // Fallback handling
    return handleRequest(request, deps);
  },
};

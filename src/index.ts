import { Env } from './platform/cloudflare/env';
import { handleRequest } from './adapters/http/router';

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Route API endpoints
    if (url.pathname.startsWith('/api/')) {
      return handleRequest(request, env);
    }

    // Serve static assets if binding exists
    if (env.ASSETS) {
      const assetResponse = await env.ASSETS.fetch(request);
      if (assetResponse.status !== 404) {
        return assetResponse;
      }
    }

    // Fallback handling
    return handleRequest(request, env);
  },
};

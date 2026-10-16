import { Env } from '../../platform/cloudflare/env';
import { checkDatabaseHealth } from '../persistence/d1/D1HealthCheck';

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

export async function handleRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const pathname = url.pathname;

  if (request.method !== 'GET') {
    return json({ ok: false, error: 'Method not allowed' }, 405);
  }

  // API Endpoints
  if (pathname === '/api/health') {
    return json({
      ok: true,
      service: 'pilot',
    });
  }

  if (pathname === '/api/db-health') {
    const health = await checkDatabaseHealth(env.DB);
    const status = health.ok ? 200 : 503;
    return json(health, status);
  }

  if (pathname === '/api/architecture') {
    return json({
      application: 'Pilot',
      architecture: 'modular-monolith',
      style: 'hexagonal',
      modules: [
        'prompts',
      ],
    });
  }

  // Root endpoint fallback if not served by static assets
  if (pathname === '/' || pathname === '') {
    return new Response(
      `Pilot\n\nAI Resource Hub\n\nCloudflare foundation is running.\n`,
      {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      }
    );
  }

  return json({ ok: false, error: 'Not found' }, 404);
}

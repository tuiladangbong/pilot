export interface CuratorAuthDependencies {
  readonly curatorToken?: string;
  readonly isCurator?: (request: Request) => boolean;
}

export interface CuratorAuthResult {
  readonly isCurator: boolean;
  readonly email?: string;
}

/**
 * Checks if incoming request has curator/admin privileges via:
 * 1. Custom validator (if provided)
 * 2. Cloudflare Access authenticated email header (cf-access-authenticated-user-email)
 * 3. Secret token via Authorization: Bearer <token> or X-Curator-Key: <token>
 */
export function checkIsCurator(request: Request, deps: CuratorAuthDependencies): CuratorAuthResult {
  if (deps.isCurator) {
    const res = deps.isCurator(request);
    return { isCurator: res };
  }

  // 1. Check Cloudflare Access header
  const cfAccessEmail = request.headers.get('cf-access-authenticated-user-email');
  if (cfAccessEmail && cfAccessEmail.trim() !== '') {
    return { isCurator: true, email: cfAccessEmail.trim() };
  }

  // 2. Check Token header (Authorization: Bearer <token> or X-Curator-Key: <token>)
  const authHeader = request.headers.get('authorization');
  const customHeader = request.headers.get('x-curator-key') || request.headers.get('x-admin-key');
  let providedToken: string | null = null;
  if (authHeader?.startsWith('Bearer ')) {
    providedToken = authHeader.slice(7).trim();
  } else if (customHeader) {
    providedToken = customHeader.trim();
  }

  const expectedToken = deps.curatorToken || 'pilot_curator_secret_2026';
  if (providedToken && providedToken === expectedToken) {
    return { isCurator: true, email: 'curator@pilot' };
  }

  return { isCurator: false };
}

/**
 * Enforces curator authentication on mutating HTTP requests (POST, PUT, PATCH, DELETE).
 * Returns null if allowed, or a 401 Response if unauthorized.
 */
export function enforceCuratorAuth(request: Request, deps: CuratorAuthDependencies): Response | null {
  const method = request.method.toUpperCase();
  if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
    const auth = checkIsCurator(request, deps);
    if (!auth.isCurator) {
      return new Response(
        JSON.stringify(
          {
            ok: false,
            error: {
              code: 'UNAUTHORIZED',
              message: 'Curator authorization required for modifying the catalog.',
            },
          },
          null,
          2
        ),
        {
          status: 401,
          headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Cache-Control': 'no-store',
          },
        }
      );
    }
  }
  return null;
}

export interface CuratorAuthDependencies {
  readonly curatorToken?: string;
  readonly isCurator?: (request: Request) => boolean;
  readonly trustAccessHeader?: boolean;
}

export interface CuratorAuthResult {
  readonly isCurator: boolean;
  readonly email?: string;
}

/**
 * Constant-time string comparison to prevent timing side-channel attacks.
 */
function safeCompareTokens(provided: string, expected: string): boolean {
  if (!provided || !expected) return false;
  const encoder = new TextEncoder();
  const a = encoder.encode(provided);
  const b = encoder.encode(expected);
  if (a.byteLength !== b.byteLength) {
    return false;
  }
  let diff = 0;
  for (let i = 0; i < a.byteLength; i++) {
    diff |= a[i] ^ b[i];
  }
  return diff === 0;
}

/**
 * Checks if incoming request has curator/admin privileges via:
 * 1. Custom validator (if provided)
 * 2. Cloudflare Access authenticated email header (only when trustAccessHeader is explicitly true)
 * 3. Secret token via Authorization: Bearer <token> or X-Curator-Key: <token>
 */
export function checkIsCurator(request: Request, deps: CuratorAuthDependencies): CuratorAuthResult {
  if (deps.isCurator) {
    const res = deps.isCurator(request);
    return { isCurator: res };
  }

  // 1. Check Cloudflare Access header only when explicitly trusted (e.g. verified behind Cloudflare Access Zero Trust)
  if (deps.trustAccessHeader === true) {
    const cfAccessEmail = request.headers.get('cf-access-authenticated-user-email');
    if (cfAccessEmail && cfAccessEmail.trim() !== '') {
      return { isCurator: true, email: cfAccessEmail.trim() };
    }
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

  const expectedToken = deps.curatorToken?.trim();
  // Fail closed if curatorToken is not configured or empty: never fall back to hardcoded secrets!
  if (providedToken && expectedToken && safeCompareTokens(providedToken, expectedToken)) {
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

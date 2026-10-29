/**
 * Domain & URL Health Verification Module.
 * Filters out dead links, parked domains, 404s, and restricted hostnames.
 */

function isPrivateOrBlocked(hostname) {
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
    if (b0 === 0 || b0 === 127 || b0 === 10) return true;
    if (b0 === 172 && b1 >= 16 && b1 <= 31) return true;
    if (b0 === 192 && b1 === 168) return true;
    if (b0 === 169 && b1 === 254) return true;
  }
  return false;
}

export async function verifyDomainHealth(rawUrl) {
  let parsedUrl;
  try {
    parsedUrl = new URL(rawUrl);
  } catch {
    return { ok: false, reason: 'INVALID_URL' };
  }

  if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
    return { ok: false, reason: 'UNSUPPORTED_PROTOCOL' };
  }

  if (isPrivateOrBlocked(parsedUrl.hostname)) {
    return { ok: false, reason: 'RESTRICTED_HOST' };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(rawUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; PilotBot/1.0; +https://pilot.nodbits.com)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
      signal: controller.signal,
      redirect: 'follow',
    });

    clearTimeout(timeout);

    if (response.status >= 400) {
      return { ok: false, reason: `HTTP_${response.status}` };
    }

    // Read initial 8KB to detect parked domain indicators
    let initialText = '';
    if (response.body) {
      const reader = response.body.getReader();
      const { value } = await reader.read();
      if (value) {
        initialText = new TextDecoder('utf-8').decode(value).toLowerCase();
      }
      try {
        await reader.cancel();
      } catch {}
    }

    const parkedIndicators = [
      'domain is for sale',
      'buy this domain',
      'parked free',
      'godaddy parked',
      'hugedomains.com',
      'dan.com',
      'namesilo parked',
      'sedo domain parking',
    ];

    for (const indicator of parkedIndicators) {
      if (initialText.includes(indicator)) {
        return { ok: false, reason: 'PARKED_DOMAIN' };
      }
    }

    return {
      ok: true,
      finalUrl: response.url || rawUrl,
      status: response.status,
    };
  } catch (err) {
    return { ok: false, reason: err.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK_ERROR' };
  }
}

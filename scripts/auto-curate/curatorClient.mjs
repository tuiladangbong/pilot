/**
 * Pilot API Client for Automated Curation.
 * Connects to Pilot HTTP endpoints, fetches existing catalog entries for deduplication,
 * and publishes newly verified tools, workflows, and prompts with curator authentication.
 */

function canonicalizeUrl(url) {
  try {
    const parsed = new URL(url);
    let host = parsed.hostname.toLowerCase();
    if (host.startsWith('www.')) host = host.slice(4);
    let path = parsed.pathname.replace(/\/+$/, '') || '/';
    return `${host}${path}`.toLowerCase();
  } catch {
    return url.toLowerCase().trim();
  }
}

export class PilotCuratorClient {
  constructor(baseUrl = process.env.PILOT_API_URL || 'https://pilot.nodbits.com', token = process.env.CURATOR_TOKEN) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.token = token;
    this.knownCanonicalUrls = new Set();
    this.knownHostnames = new Set();
    this.knownSlugs = new Set();
  }

  get headers() {
    const h = {
      'Content-Type': 'application/json',
      'User-Agent': 'PilotAutoCurator/1.0 (+https://pilot.nodbits.com)',
    };
    if (this.token) {
      h['X-Curator-Key'] = this.token;
      h['Authorization'] = `Bearer ${this.token}`;
    }
    return h;
  }

  async loadExistingCatalog() {
    try {
      const response = await fetch(`${this.baseUrl}/api/tools?limit=500`);
      if (!response.ok) {
        console.warn(`[Pilot Client] Failed fetching existing tools: HTTP ${response.status}`);
        return;
      }
      const data = await response.json();
      const tools = data.data || [];

      for (const t of tools) {
        if (t.url) {
          this.knownCanonicalUrls.add(canonicalizeUrl(t.url));
        }
        if (t.hostname) {
          this.knownHostnames.add(t.hostname.toLowerCase().replace(/^www\./, ''));
        }
        if (t.slug) {
          this.knownSlugs.add(t.slug.toLowerCase());
        }
      }
      console.log(`[Pilot Client] Indexed ${tools.length} existing tools for deduplication.`);
    } catch (err) {
      console.warn('[Pilot Client] Warning: Could not index existing catalog:', err.message);
    }
  }

  isDuplicate(rawUrl) {
    const canonical = canonicalizeUrl(rawUrl);
    if (this.knownCanonicalUrls.has(canonical)) {
      return true;
    }
    try {
      const parsed = new URL(rawUrl);
      const host = parsed.hostname.toLowerCase().replace(/^www\./, '');
      // If path is root or single-page and hostname exists, flag duplicate
      if ((parsed.pathname === '/' || parsed.pathname === '') && this.knownHostnames.has(host)) {
        return true;
      }
    } catch {}
    return false;
  }

  async publishTool(tool) {
    if (!this.token) {
      throw new Error('CURATOR_TOKEN is required to publish tools to Pilot API.');
    }

    const response = await fetch(`${this.baseUrl}/api/tools`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(tool),
    });

    const data = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error(data.error?.message || `Failed to publish tool: HTTP ${response.status}`);
    }

    // Add to known sets to prevent duplicate in-memory publishes
    this.knownCanonicalUrls.add(canonicalizeUrl(tool.url));
    return data.data;
  }

  async publishWorkflow(workflow, linkedResourceId) {
    if (!this.token) return null;

    const payload = {
      ...workflow,
      linkedResourceIds: linkedResourceId ? [linkedResourceId] : [],
    };

    const response = await fetch(`${this.baseUrl}/api/workflows`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    if (!response.ok || !data.ok) {
      console.warn(`[Pilot Client] Workflow publishing skipped: ${data.error?.message}`);
      return null;
    }
    return data.data;
  }

  async publishPrompt(prompt) {
    if (!this.token) return null;

    const response = await fetch(`${this.baseUrl}/api/prompts`, {
      method: 'POST',
      headers: this.headers,
      body: JSON.stringify(prompt),
    });

    const data = await response.json();
    if (!response.ok || !data.ok) {
      console.warn(`[Pilot Client] Prompt publishing skipped: ${data.error?.message}`);
      return null;
    }
    return data.data;
  }
}

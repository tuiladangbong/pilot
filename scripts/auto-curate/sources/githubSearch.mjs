/**
 * GitHub Search Discovery Module.
 * Discovers trending, high-quality open-source AI tools, frameworks, and MCP servers.
 */

export async function fetchGitHubCandidates(options = {}) {
  const minStars = options.minStars ?? 100;
  const limit = options.limit ?? 25;
  const topics = ['mcp-server', 'ai-agent', 'llm-tool', 'prompt-engineering'];
  const candidates = [];
  const seenUrls = new Set();

  for (const topic of topics) {
    const query = `topic:${topic}+stars:>=${minStars}`;
    const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(
      query
    )}&sort=updated&order=desc&per_page=${limit}`;

    try {
      const headers = {
        'User-Agent': 'PilotCurator/1.0 (+https://pilot.nodbits.com)',
        'Accept': 'application/vnd.github+json',
      };
      if (process.env.GITHUB_TOKEN) {
        headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
      }

      const response = await fetch(url, { headers });

      if (!response.ok) {
        console.warn(`[GitHub Source] HTTP ${response.status} for topic "${topic}"`);
        continue;
      }

      const data = await response.json();
      const items = data.items || [];

      for (const item of items) {
        const repoUrl = item.html_url;
        if (seenUrls.has(repoUrl)) continue;
        seenUrls.add(repoUrl);

        // If repository has a dedicated homepage website, consider it
        const primaryUrl = item.homepage && item.homepage.startsWith('http')
          ? item.homepage
          : repoUrl;

        candidates.push({
          source: 'github',
          sourceId: String(item.id),
          title: item.name
            .replace(/[-_]/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase()),
          repoName: item.full_name,
          url: primaryUrl,
          githubUrl: repoUrl,
          author: item.owner?.login || 'Community',
          stars: item.stargazers_count || 0,
          forks: item.forks_count || 0,
          license: item.license?.spdx_id || 'Open Source',
          topics: item.topics || [],
          rawDescription: item.description || `${item.full_name} open-source AI project`,
          pricing: 'Open Source',
          updatedAt: item.updated_at,
        });
      }
    } catch (err) {
      console.warn(`[GitHub Source] Failed fetching for topic "${topic}":`, err.message);
    }
  }

  // Sort descending by stars
  return candidates.sort((a, b) => b.stars - a.stars);
}

/**
 * Hacker News Source Discovery Module.
 * Queries the public Hacker News Algolia Search API for 'Show HN' posts
 * tagged with AI/LLM/agent keywords and filtered by community upvote thresholds.
 */

export async function fetchHackerNewsCandidates(options = {}) {
  const minPoints = options.minPoints ?? 15;
  const limit = options.limit ?? 25;
  const queries = ['ai', 'llm', 'agent', 'mcp'];
  const candidates = [];
  const seenUrls = new Set();

  for (const q of queries) {
    const url = `http://hn.algolia.com/api/v1/search_by_date?query=${encodeURIComponent(
      q
    )}&tags=show_hn&numericFilters=points>=${minPoints}&hitsPerPage=${limit}`;

    try {
      const response = await fetch(url, {
        headers: { 'User-Agent': 'PilotCurator/1.0 (+https://pilot.nodbits.com)' },
      });

      if (!response.ok) {
        console.warn(`[HN Source] HTTP error ${response.status} for query "${q}"`);
        continue;
      }

      const data = await response.json();
      const hits = data.hits || [];

      for (const hit of hits) {
        const targetUrl = hit.url || `https://news.ycombinator.com/item?id=${hit.objectID}`;
        if (seenUrls.has(targetUrl)) continue;
        seenUrls.add(targetUrl);

        // Clean "Show HN: " prefix
        const cleanTitle = (hit.title || '')
          .replace(/^Show\s+HN:\s*/i, '')
          .replace(/^ShowHN:\s*/i, '')
          .trim();

        if (!cleanTitle || cleanTitle.length < 3) continue;

        candidates.push({
          source: 'hackernews',
          sourceId: String(hit.objectID),
          title: cleanTitle,
          url: targetUrl,
          author: hit.author || 'Anonymous',
          points: hit.points || 0,
          commentsCount: hit.num_comments || 0,
          createdAt: hit.created_at,
          hnDiscussionUrl: `https://news.ycombinator.com/item?id=${hit.objectID}`,
          rawDescription: hit.story_text || cleanTitle,
        });
      }
    } catch (err) {
      console.warn(`[HN Source] Failed fetching for query "${q}":`, err.message);
    }
  }

  // Sort descending by points
  return candidates.sort((a, b) => b.points - a.points);
}

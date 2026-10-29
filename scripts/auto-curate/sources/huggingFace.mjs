/**
 * Hugging Face Spaces Discovery Module.
 * Discovers trending, popular AI interactive tools and research playgrounds.
 */

export async function fetchHuggingFaceCandidates(options = {}) {
  const minLikes = options.minLikes ?? 50;
  const limit = options.limit ?? 20;
  const url = `https://huggingface.co/api/spaces?sort=likes&direction=-1&limit=${limit}`;

  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'PilotCurator/1.0 (+https://pilot.nodbits.com)' },
    });

    if (!response.ok) {
      console.warn(`[Hugging Face Source] HTTP error ${response.status}`);
      return [];
    }

    const spaces = await response.json();
    const candidates = [];

    for (const space of spaces) {
      if ((space.likes || 0) < minLikes) continue;

      const [author, spaceName] = space.id.split('/');
      const formattedTitle = (spaceName || space.id)
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());

      candidates.push({
        source: 'huggingface',
        sourceId: space.id,
        title: formattedTitle,
        url: `https://huggingface.co/spaces/${space.id}`,
        author: author || 'Hugging Face Community',
        likes: space.likes || 0,
        rawDescription: `Interactive AI demo and playground for ${formattedTitle} on Hugging Face Spaces.`,
        pricing: 'Free',
        category: 'Image & Media',
        tags: ['huggingface', 'demo', 'playground'],
      });
    }

    return candidates;
  } catch (err) {
    console.warn('[Hugging Face Source] Failed fetching spaces:', err.message);
    return [];
  }
}

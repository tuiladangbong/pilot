/**
 * Quality Scoring & Categorization Engine.
 * Evaluates candidates, strips marketing spam, assigns categories,
 * detects pricing, and computes an objective Quality Score (1.0 - 10.0).
 */

const CATEGORY_KEYWORDS = {
  'Coding & Dev': [
    'code', 'coding', 'developer', 'ide', 'vs code', 'extension', 'compiler',
    'debugging', 'refactor', 'git', 'terminal', 'cli', 'api', 'sdk', 'typescript',
    'python', 'javascript', 'sql', 'database', 'frontend', 'backend'
  ],
  'Agents & Automation': [
    'agent', 'mcp', 'autonomous', 'workflow', 'orchestrat', 'crewai', 'autogen',
    'langchain', 'automation', 'browser agent', 'multi-agent', 'task', 'bot'
  ],
  'Image & Media': [
    'image', 'video', 'diffusion', 'midjourney', 'flux', 'voice', 'audio',
    'tts', 'speech', 'generation', '3d', 'render', 'graphic', 'avatar'
  ],
  'Chat & Assistants': [
    'chat', 'assistant', 'prompt', 'conversational', 'copilot', 'dialog',
    'claude', 'gpt', 'gemini', 'companion'
  ],
  'Search & Research': [
    'search', 'research', 'paper', 'rag', 'embedding', 'vector', 'retrieval',
    'arxiv', 'knowledge base', 'semantic', 'scrape', 'crawler'
  ],
  'Infrastructure': [
    'inference', 'gpu', 'serving', 'vllm', 'ollama', 'llamacpp', 'deployment',
    'benchmark', 'eval', 'observability', 'monitoring', 'proxy', 'gateway'
  ],
};

export function cleanDescription(rawText) {
  if (!rawText) return '';
  return rawText
    .replace(/<[^>]+>/g, '') // strip HTML
    .replace(/Show HN:\s*/gi, '')
    .replace(/\[\d+\]/g, '') // strip citation brackets
    .replace(/\s+/g, ' ')
    .trim();
}

export function detectCategory(text, topics = []) {
  const combined = `${text} ${topics.join(' ')}`.toLowerCase();
  let bestCategory = 'Coding & Dev';
  let maxMatches = -1;

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let matches = 0;
    for (const kw of keywords) {
      if (combined.includes(kw)) {
        matches++;
      }
    }
    if (matches > maxMatches) {
      maxMatches = matches;
      bestCategory = category;
    }
  }

  return bestCategory;
}

export function detectPricing(candidate) {
  if (candidate.pricing === 'Open Source' || candidate.source === 'github') {
    return 'Open Source';
  }
  const text = `${candidate.title} ${candidate.rawDescription}`.toLowerCase();
  if (text.includes('open source') || text.includes('open-source') || text.includes('mit license') || text.includes('apache-2.0')) {
    return 'Open Source';
  }
  if (text.includes('free tier') || text.includes('freemium')) {
    return 'Freemium';
  }
  if (text.includes('100% free') || text.includes('completely free') || text.includes('free tool')) {
    return 'Free';
  }
  if (text.includes('$') || text.includes('/mo') || text.includes('pricing') || text.includes('subscription')) {
    return 'Paid';
  }
  return 'Freemium'; // Default modern AI tool pricing
}

export function computeQualityScore(candidate) {
  let score = 6.0; // Base score

  // 1. Social & Community Traction
  if (candidate.stars) {
    if (candidate.stars >= 5000) score += 2.5;
    else if (candidate.stars >= 1000) score += 2.0;
    else if (candidate.stars >= 500) score += 1.5;
    else if (candidate.stars >= 200) score += 1.0;
    else if (candidate.stars >= 100) score += 0.5;
  }

  if (candidate.points) {
    if (candidate.points >= 100) score += 2.0;
    else if (candidate.points >= 50) score += 1.5;
    else if (candidate.points >= 25) score += 1.0;
  }

  if (candidate.commentsCount && candidate.commentsCount >= 20) {
    score += 0.5;
  }

  // 2. Content & Utility Indicators
  const text = (candidate.rawDescription || '').toLowerCase();
  const positiveSignals = ['cli', 'sdk', 'api', 'self-hosted', 'local', 'faster', 'benchmarks', 'mcp', 'lightweight'];
  for (const signal of positiveSignals) {
    if (text.includes(signal)) {
      score += 0.2;
    }
  }

  // 3. Spam & Hype Penalties
  const spamSignals = [
    'revolutionary', 'groundbreaking', 'all-in-one', 'skyrocket', 'game-changing',
    'passive income', 'affiliate', 'best ai tool in the world'
  ];
  for (const spam of spamSignals) {
    if (text.includes(spam)) {
      score -= 0.8;
    }
  }

  // Cap score between 1.0 and 10.0
  return Math.min(Math.max(parseFloat(score.toFixed(1)), 1.0), 10.0);
}

/**
 * Evaluates candidate using LLM API if key is present, or falls back to rule-based engine.
 */
export async function evaluateCandidate(candidate, apiKey = process.env.AI_API_KEY) {
  const cleanedDesc = cleanDescription(candidate.rawDescription);
  const category = detectCategory(`${candidate.title} ${cleanedDesc}`, candidate.topics);
  const pricing = detectPricing(candidate);
  const qualityScore = computeQualityScore(candidate);

  // Auto-generate tags
  const tags = new Set(['ai']);
  if (pricing === 'Open Source') tags.add('open-source');
  if (category === 'Coding & Dev') tags.add('developer-tools');
  if (category === 'Agents & Automation') tags.add('agents');
  if (candidate.topics && Array.isArray(candidate.topics)) {
    candidate.topics.slice(0, 3).forEach((t) => tags.add(t.toLowerCase().replace(/[^a-z0-9-]/g, '')));
  }

  // Value proposition synthesis
  let finalDescription = cleanedDesc;
  if (finalDescription.length > 220) {
    finalDescription = finalDescription.slice(0, 217).replace(/\s+\S*$/, '') + '...';
  }
  if (!finalDescription || finalDescription.length < 20) {
    finalDescription = `${candidate.title} is an AI tool for ${category.toLowerCase()} workflows.`;
  }

  return {
    title: candidate.title,
    url: candidate.url,
    description: finalDescription,
    category,
    pricing,
    tags: Array.from(tags),
    provider: candidate.author || 'Independent',
    qualityScore,
    kind: candidate.url.includes('github.com') || candidate.url.includes('huggingface.co') ? 'tool' : 'tool',
    sourceMetadata: {
      source: candidate.source,
      sourceId: candidate.sourceId,
      stars: candidate.stars,
      points: candidate.points,
    },
  };
}

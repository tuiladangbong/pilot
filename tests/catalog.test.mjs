import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { canonicalizeUrl, slugify } from '../src/modules/tools/domain/Tool.ts';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const catalogPath = path.resolve(__dirname, '../data/ai-tools-catalog.json');

test('catalog dataset exists and conforms to public seed requirements', () => {
  assert.ok(fs.existsSync(catalogPath), 'ai-tools-catalog.json must exist');
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

  assert.ok(Array.isArray(catalog), 'Catalog must be an array');
  assert.ok(catalog.length >= 150 && catalog.length <= 300, `Catalog count (${catalog.length}) should be between 150 and 300`);

  const featuredCount = catalog.filter((item) => item.featured).length;
  assert.ok(featuredCount >= 25 && featuredCount <= 90, `Featured count (${featuredCount}) should be between 25 and 90`);

  const mandatoryProducts = [
    'Claude',
    'ChatGPT',
    'Gemini',
    'Perplexity',
    'Lovable',
    'v0',
    'Bolt.new',
    'Cursor',
    'Windsurf',
    'Claude Code',
    'Codex',
    'GitHub Copilot',
    'Replit Agent',
    'Midjourney',
    'Runway',
    'Luma',
    'Pika',
    'Kling',
    'Higgsfield',
    'ElevenLabs',
    'Suno',
    'Udio',
    'OpenRouter',
    'Replicate',
    'Together AI',
    'Groq',
    'Fireworks',
    'Hugging Face',
    'Ollama',
    'LM Studio',
    'vLLM',
    'LangChain',
    'LlamaIndex',
    'CrewAI',
    'AutoGen',
    'Phidata',
    'Dify',
    'Flowise',
    'Artificial Analysis',
    "There's An AI For That",
  ];

  const catalogTitles = catalog.map((item) => item.title.toLowerCase());
  for (const product of mandatoryProducts) {
    const found = catalogTitles.some((title) =>
      title.includes(product.toLowerCase()) || product.toLowerCase().includes(title)
    );
    assert.ok(found, `Mandatory product "${product}" must be present in curated catalog`);
  }

  const seenUrls = new Set();
  const seenSlugs = new Set();

  for (const item of catalog) {
    assert.ok(item.title && item.title.trim().length > 0, 'Every item must have a title');
    assert.ok(item.url && item.url.startsWith('https://'), `URL "${item.url}" must use https://`);
    assert.ok(['tool', 'website'].includes(item.kind), `Kind "${item.kind}" must be tool or website`);
    assert.ok(['Free', 'Freemium', 'Paid', 'Open Source', 'Unknown'].includes(item.pricing), `Pricing "${item.pricing}" must be valid`);
    assert.equal(item.origin, 'curated', 'Origin must be curated');
    assert.ok(item.verifiedAt && item.verifiedAt.startsWith('2026-'), 'verifiedAt must be a valid 2026 ISO date');
    assert.ok(Array.isArray(item.tags) && item.tags.length >= 2, `Item "${item.title}" must have at least 2 tags`);

    const cUrl = canonicalizeUrl(item.url);
    assert.ok(!seenUrls.has(cUrl), `Duplicate canonical URL detected: ${cUrl}`);
    seenUrls.add(cUrl);

    const slug = slugify(item.title);
    assert.ok(!seenSlugs.has(slug), `Duplicate slug detected: ${slug} (title: ${item.title})`);
    seenSlugs.add(slug);
  }
});

test('canonicalizeUrl and slugify normalize predictably for deduplication', () => {
  assert.equal(canonicalizeUrl('https://Claude.ai/'), 'https://claude.ai');
  assert.equal(canonicalizeUrl('https://example.com/path/?utm_source=twitter&utm_medium=social'), 'https://example.com/path');
  assert.equal(canonicalizeUrl('https://example.com/path/?ref=pilot&keep=1'), 'https://example.com/path?keep=1');

  assert.equal(slugify('Claude 3.5 Sonnet'), 'claude-35-sonnet');
  assert.equal(slugify("There's An AI For That"), 'theres-an-ai-for-that');
  assert.equal(slugify('Bolt.new'), 'boltnew');
  assert.equal(slugify('  v0 by Vercel  '), 'v0-by-vercel');
});

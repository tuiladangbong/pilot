import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createTool,
  updateTool,
  normalizeUrl,
  extractHostname,
  validateKind,
  validatePricing,
  isPrivateOrBlockedHost,
  decodeHtmlEntities,
} from '../src/modules/tools/domain/Tool.ts';

test('normalizeUrl validates http and https protocols', () => {
  assert.equal(normalizeUrl('https://example.com'), 'https://example.com/');
  assert.equal(normalizeUrl('http://ai.google.dev/docs'), 'http://ai.google.dev/docs');
  assert.equal(normalizeUrl('  https://anthropic.com/claude?ref=pilot#features  '), 'https://anthropic.com/claude?ref=pilot#features');

  assert.throws(() => normalizeUrl(''), /URL is required/);
  assert.throws(() => normalizeUrl('ftp://example.com'), /URL must use http:\/\/ or https:\/\//);
  assert.throws(() => normalizeUrl('javascript:alert(1)'), /URL must use http:\/\/ or https:\/\//);
  assert.throws(() => normalizeUrl('file:///etc/passwd'), /URL must use http:\/\/ or https:\/\//);
});

test('extractHostname parses clean domain names', () => {
  assert.equal(extractHostname('https://www.anthropic.com/claude'), 'anthropic.com');
  assert.equal(extractHostname('https://chatgpt.com/'), 'chatgpt.com');
  assert.equal(extractHostname('http://subdomain.domain.org/path'), 'subdomain.domain.org');
});

test('validateKind and validatePricing use defaults properly', () => {
  assert.equal(validateKind('tool'), 'tool');
  assert.equal(validateKind('website'), 'website');
  assert.equal(validateKind('other'), 'tool');

  assert.equal(validatePricing('Free'), 'Free');
  assert.equal(validatePricing('freemium'), 'Freemium');
  assert.equal(validatePricing('PAID'), 'Paid');
  assert.equal(validatePricing('Open Source'), 'Open Source');
  assert.equal(validatePricing('unknown'), 'Unknown');
  assert.equal(validatePricing(undefined), 'Unknown');
});

test('createTool creates valid tool instance', () => {
  const tool = createTool({
    title: '  Claude 3.5 Sonnet  ',
    url: 'https://claude.ai',
    kind: 'tool',
    provider: 'Anthropic',
    category: 'LLM & Chatbot',
    pricing: 'Freemium',
    notes: 'Great for coding and reasoning',
    tags: ['AI', 'LLM', 'Coding'],
    favorite: true,
  });

  assert.equal(tool.title, 'Claude 3.5 Sonnet');
  assert.equal(tool.url, 'https://claude.ai/');
  assert.equal(tool.hostname, 'claude.ai');
  assert.equal(tool.kind, 'tool');
  assert.equal(tool.provider, 'Anthropic');
  assert.equal(tool.category, 'LLM & Chatbot');
  assert.equal(tool.pricing, 'Freemium');
  assert.equal(tool.favorite, true);
  assert.deepEqual(tool.tags, ['ai', 'llm', 'coding']);
  assert.ok(tool.id);
  assert.ok(tool.createdAt);
});

test('updateTool updates fields accurately', () => {
  const tool = createTool({
    title: 'Original Tool',
    url: 'https://example.com',
    kind: 'tool',
  });

  const updated = updateTool(tool, {
    title: 'Updated Tool Title',
    kind: 'website',
    pricing: 'Paid',
    favorite: true,
    tags: ['new-tag'],
  });

  assert.equal(updated.title, 'Updated Tool Title');
  assert.equal(updated.kind, 'website');
  assert.equal(updated.pricing, 'Paid');
  assert.equal(updated.favorite, true);
  assert.deepEqual(updated.tags, ['new-tag']);
  assert.equal(updated.url, 'https://example.com/');
});

test('isPrivateOrBlockedHost prevents SSRF requests', () => {
  // Loopback / localhost
  assert.equal(isPrivateOrBlockedHost('localhost'), true);
  assert.equal(isPrivateOrBlockedHost('127.0.0.1'), true);
  assert.equal(isPrivateOrBlockedHost('127.1.2.3'), true);
  assert.equal(isPrivateOrBlockedHost('0.0.0.0'), true);
  assert.equal(isPrivateOrBlockedHost('::1'), true);

  // Private IPv4 ranges
  assert.equal(isPrivateOrBlockedHost('10.0.0.1'), true);
  assert.equal(isPrivateOrBlockedHost('192.168.1.1'), true);
  assert.equal(isPrivateOrBlockedHost('172.16.0.1'), true);
  assert.equal(isPrivateOrBlockedHost('172.31.255.254'), true);
  assert.equal(isPrivateOrBlockedHost('169.254.169.254'), true); // Cloud metadata

  // Internal names
  assert.equal(isPrivateOrBlockedHost('server.internal'), true);
  assert.equal(isPrivateOrBlockedHost('printer.local'), true);

  // Allowed public domains
  assert.equal(isPrivateOrBlockedHost('anthropic.com'), false);
  assert.equal(isPrivateOrBlockedHost('github.com'), false);
  assert.equal(isPrivateOrBlockedHost('pilot.nodbits.com'), false);
});

test('decodeHtmlEntities decodes entities correctly', () => {
  assert.equal(decodeHtmlEntities('&amp; &quot; &#39; &lt; &gt;'), '& " \' < >');
  assert.equal(decodeHtmlEntities('Hugging Face &mdash; The AI community'), 'Hugging Face — The AI community');
});

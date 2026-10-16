import test from 'node:test';
import assert from 'node:assert/strict';

// Test Domain Logic directly
import { createPrompt, updatePrompt, normalizeTag, normalizeTags } from '../src/modules/prompts/domain/Prompt.ts';

test('normalizeTag cleans and lowercases', () => {
  assert.equal(normalizeTag('  Claude Code  '), 'claude code');
  assert.equal(normalizeTag('Multi   Space   Tag'), 'multi space tag');
  assert.equal(normalizeTag('PYTHON'), 'python');
});

test('normalizeTags removes duplicates and empties', () => {
  const result = normalizeTags(['  Coding  ', 'coding', 'AI', '  ', 'ai']);
  assert.deepEqual(result, ['coding', 'ai']);
});

test('createPrompt validates required fields', () => {
  assert.throws(() => createPrompt({ title: '', content: 'hello' }), /Title is required/);
  assert.throws(() => createPrompt({ title: 'Test', content: '   ' }), /Prompt content is required/);
});

test('createPrompt sets defaults and preserves formatting', () => {
  const content = 'Line 1\n  Indented Line 2\n\nLine 3';
  const prompt = createPrompt({
    title: '  My Prompt  ',
    content,
    tags: ['Coding', 'claude'],
  });

  assert.equal(prompt.title, 'My Prompt');
  assert.equal(prompt.content, content); // Exact whitespace preserved
  assert.equal(prompt.favorite, false);
  assert.equal(prompt.model, null);
  assert.deepEqual(prompt.tags, ['coding', 'claude']);
  assert.ok(prompt.id);
  assert.ok(prompt.createdAt);
  assert.ok(prompt.updatedAt);
});

test('updatePrompt modifies fields and updates timestamp', () => {
  const original = createPrompt({
    title: 'Original',
    content: 'Original content',
    favorite: false,
    tags: ['v1'],
  });

  const updated = updatePrompt(original, {
    title: 'Updated Title',
    favorite: true,
    tags: ['v1', 'v2'],
  });

  assert.equal(updated.title, 'Updated Title');
  assert.equal(updated.content, 'Original content');
  assert.equal(updated.favorite, true);
  assert.deepEqual(updated.tags, ['v1', 'v2']);
  assert.ok(new Date(updated.updatedAt).getTime() >= new Date(original.updatedAt).getTime());
});

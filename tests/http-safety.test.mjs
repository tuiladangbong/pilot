import test from 'node:test';
import assert from 'node:assert/strict';
import { parseBoundedInt } from '../src/adapters/http/query.ts';
import { resolveResourceId } from '../src/core/domain/Resource.ts';

test('parseBoundedInt is NaN-safe and bounded', () => {
  assert.equal(parseBoundedInt(null, 50, 1, 500), 50);
  assert.equal(parseBoundedInt('abc', 50, 1, 500), 50);
  assert.equal(parseBoundedInt('', 50, 1, 500), 50);
  assert.equal(parseBoundedInt('0', 50, 1, 500), 1);
  assert.equal(parseBoundedInt('99999', 50, 1, 500), 500);
  assert.equal(parseBoundedInt('-5', 0, 0, 1000), 0);
  assert.equal(parseBoundedInt('25', 50, 1, 500), 25);
});

test('resolveResourceId accepts safe ids, generates UUIDs, rejects HTML/URL-hostile ids', () => {
  assert.equal(resolveResourceId('my-tool_1.0'), 'my-tool_1.0');
  assert.match(resolveResourceId(undefined), /^[0-9a-f-]{36}$/);
  assert.match(resolveResourceId('   '), /^[0-9a-f-]{36}$/);
  for (const bad of ['a"b', '<script>', 'a b', '../x', "x'y", 'a'.repeat(129)]) {
    assert.throws(() => resolveResourceId(bad), /Resource id/);
  }
});

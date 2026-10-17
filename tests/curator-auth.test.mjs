import test from 'node:test';
import assert from 'node:assert/strict';
import { checkIsCurator, enforceCuratorAuth } from '../src/adapters/http/curatorAuth.ts';

test('public visitors without tokens or access headers are not curators', () => {
  const req = new Request('https://pilot.nodbits.com/api/curator/status');
  const res = checkIsCurator(req, { curatorToken: 'secret_123' });
  assert.equal(res.isCurator, false);
  assert.equal(res.email, undefined);
});

test('anonymous mutating requests are blocked by enforceCuratorAuth with 401 UNAUTHORIZED', async () => {
  const deps = { curatorToken: 'secret_123' };

  for (const method of ['POST', 'PUT', 'PATCH', 'DELETE']) {
    const req = new Request('https://pilot.nodbits.com/api/tools', { method });
    const response = enforceCuratorAuth(req, deps);
    assert.ok(response, `${method} must return a 401 response`);
    assert.equal(response.status, 401);
    const data = await response.json();
    assert.equal(data.ok, false);
    assert.equal(data.error?.code, 'UNAUTHORIZED');
  }

  // GET requests are unrestricted (returns null = allowed)
  const getReq = new Request('https://pilot.nodbits.com/api/tools');
  assert.equal(enforceCuratorAuth(getReq, deps), null);
});

test('curator authenticated via X-Curator-Key or X-Admin-Key succeeds', () => {
  const deps = { curatorToken: 'secret_123' };

  const req1 = new Request('https://pilot.nodbits.com/api/curator/status', {
    headers: { 'X-Curator-Key': 'secret_123' },
  });
  const res1 = checkIsCurator(req1, deps);
  assert.equal(res1.isCurator, true);
  assert.equal(enforceCuratorAuth(req1, deps), null);

  const req2 = new Request('https://pilot.nodbits.com/api/tools', {
    method: 'POST',
    headers: { 'X-Admin-Key': 'secret_123' },
  });
  assert.equal(enforceCuratorAuth(req2, deps), null);
});

test('curator authenticated via Authorization: Bearer token succeeds', () => {
  const deps = { curatorToken: 'secret_123' };

  const req = new Request('https://pilot.nodbits.com/api/curator/status', {
    headers: { Authorization: 'Bearer secret_123' },
  });
  const res = checkIsCurator(req, deps);
  assert.equal(res.isCurator, true);
  assert.equal(enforceCuratorAuth(req, deps), null);
});

test('curator authenticated via Cloudflare Access header succeeds', () => {
  const deps = { curatorToken: 'secret_123' };

  const req = new Request('https://pilot.nodbits.com/api/curator/status', {
    headers: { 'Cf-Access-Authenticated-User-Email': 'curator@nodbits.com' },
  });
  const res = checkIsCurator(req, deps);
  assert.equal(res.isCurator, true);
  assert.equal(res.email, 'curator@nodbits.com');
  assert.equal(enforceCuratorAuth(req, deps), null);
});

test('invalid or wrong curator token is rejected', () => {
  const deps = { curatorToken: 'secret_123' };

  const req = new Request('https://pilot.nodbits.com/api/tools', {
    method: 'POST',
    headers: { 'X-Curator-Key': 'wrong_password' },
  });
  const res = checkIsCurator(req, deps);
  assert.equal(res.isCurator, false);
  const authResponse = enforceCuratorAuth(req, deps);
  assert.ok(authResponse);
  assert.equal(authResponse.status, 401);
});

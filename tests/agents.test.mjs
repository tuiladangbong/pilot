import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createAgent,
  updateAgent,
  normalizeTag,
  normalizeTags,
  validateStatus,
  validateAutonomyLevel,
  validateRelationshipType,
  formatFullAgentText,
} from '../src/modules/agents/domain/Agent.ts';

test('normalizeTag cleans and lowercases', () => {
  assert.equal(normalizeTag('  Senior Developer  '), 'senior developer');
  assert.equal(normalizeTag('DevOps   Engineer'), 'devops engineer');
  assert.equal(normalizeTag('FULLSTACK'), 'fullstack');
});

test('normalizeTags removes duplicates and empties', () => {
  const result = normalizeTags(['  Coding  ', 'coding', 'AI', '  ', 'ai']);
  assert.deepEqual(result, ['coding', 'ai']);
});

test('validateStatus and validateAutonomyLevel handle defaults and variations', () => {
  assert.equal(validateStatus(), 'Active');
  assert.equal(validateStatus('draft'), 'Draft');
  assert.equal(validateStatus('Archived'), 'Archived');
  assert.equal(validateStatus('unknown'), 'Active');

  assert.equal(validateAutonomyLevel(), 'Manual');
  assert.equal(validateAutonomyLevel('assisted'), 'Assisted');
  assert.equal(validateAutonomyLevel('AUTONOMOUS'), 'Autonomous');
  assert.equal(validateAutonomyLevel('invalid'), 'Manual');

  assert.equal(validateRelationshipType(), 'USES');
  assert.equal(validateRelationshipType('follows'), 'FOLLOWS');
  assert.equal(validateRelationshipType('references'), 'REFERENCES');
  assert.equal(validateRelationshipType('assigns_to'), 'ASSIGNS_TO');
  assert.equal(validateRelationshipType('other'), 'USES');
});

test('createAgent validates required fields', () => {
  assert.throws(() => createAgent({ title: '', role: 'Dev', instructions: 'Inst' }), /Title is required/);
  assert.throws(() => createAgent({ title: 'Agent', role: '', instructions: 'Inst' }), /Role is required/);
  assert.throws(() => createAgent({ title: 'Agent', role: 'Dev', instructions: '   ' }), /Instructions are required/);
});

test('createAgent sets defaults and preserves formatting', () => {
  const instructions = 'You are a senior full-stack developer.\n\nRule 1: Never commit secrets.\n  Rule 2: Keep domain logic pure.';
  const agent = createAgent({
    title: 'Cloudflare App Builder',
    role: 'Senior Full-Stack Developer',
    goal: 'Build and deploy production-ready Cloudflare apps',
    instructions,
    runtime: 'Claude Code',
    model: 'Claude 3.5 Sonnet',
    inputDescription: 'Project brief and spec',
    outputDescription: 'Committed and deployed app',
    notes: 'Works best for infrastructure-heavy tasks',
    tags: ['coding', 'cloudflare', 'deployment'],
    favorite: true,
  });

  assert.ok(agent.id);
  assert.equal(agent.title, 'Cloudflare App Builder');
  assert.equal(agent.role, 'Senior Full-Stack Developer');
  assert.equal(agent.goal, 'Build and deploy production-ready Cloudflare apps');
  assert.equal(agent.instructions, instructions);
  assert.equal(agent.runtime, 'Claude Code');
  assert.equal(agent.model, 'Claude 3.5 Sonnet');
  assert.equal(agent.status, 'Active');
  assert.equal(agent.autonomyLevel, 'Manual');
  assert.equal(agent.inputDescription, 'Project brief and spec');
  assert.equal(agent.outputDescription, 'Committed and deployed app');
  assert.equal(agent.notes, 'Works best for infrastructure-heavy tasks');
  assert.equal(agent.favorite, true);
  assert.deepEqual(agent.tags, ['coding', 'cloudflare', 'deployment']);
  assert.ok(agent.createdAt);
  assert.ok(agent.updatedAt);
});

test('updateAgent modifies fields accurately and prevents empty required fields', () => {
  const original = createAgent({
    title: 'Original Title',
    role: 'Original Role',
    instructions: 'Original instructions',
  });

  const updated = updateAgent(original, {
    title: 'Updated Title',
    role: 'Staff Architect',
    status: 'Archived',
    autonomyLevel: 'Autonomous',
    tags: ['updated', 'tags'],
  });

  assert.equal(updated.title, 'Updated Title');
  assert.equal(updated.role, 'Staff Architect');
  assert.equal(updated.status, 'Archived');
  assert.equal(updated.autonomyLevel, 'Autonomous');
  assert.deepEqual(updated.tags, ['updated', 'tags']);
  assert.equal(updated.instructions, 'Original instructions');

  assert.throws(() => updateAgent(original, { title: '  ' }), /Title cannot be empty/);
  assert.throws(() => updateAgent(original, { role: '  ' }), /Role cannot be empty/);
  assert.throws(() => updateAgent(original, { instructions: '  ' }), /Instructions cannot be empty/);
});

test('formatFullAgentText formats clean plain-text representation', () => {
  const agent = createAgent({
    title: 'Deployment Agent',
    role: 'DevOps Engineer',
    goal: 'Automate release builds and migrations',
    instructions: 'Step 1: Check git status.\nStep 2: Deploy.',
    runtime: 'Claude Code',
    model: 'Auto',
    status: 'Active',
    autonomyLevel: 'Autonomous',
    inputDescription: 'Git commit hash',
    outputDescription: 'Live production URL',
    notes: 'Verify health checks after deploy',
  });

  // Attach sample linked resources
  const agentWithRels = {
    ...agent,
    linkedResources: [
      {
        id: 'rel-1',
        resourceId: 'res-p1',
        relationshipType: 'USES',
        title: 'Deployment Prompt',
        type: 'prompt',
        description: null,
      },
      {
        id: 'rel-2',
        resourceId: 'res-w1',
        relationshipType: 'FOLLOWS',
        title: 'Release Workflow',
        type: 'workflow',
        description: null,
      },
    ],
  };

  const text = formatFullAgentText(agentWithRels);
  assert.ok(text.includes('Title: Deployment Agent'));
  assert.ok(text.includes('Role:\nDevOps Engineer'));
  assert.ok(text.includes('Goal:\nAutomate release builds and migrations'));
  assert.ok(text.includes('Runtime: Claude Code | Model: Auto | Autonomy: Autonomous | Status: Active'));
  assert.ok(text.includes('Instructions:\nStep 1: Check git status.\nStep 2: Deploy.'));
  assert.ok(text.includes('Expected Input:\nGit commit hash'));
  assert.ok(text.includes('Expected Output:\nLive production URL'));
  assert.ok(text.includes('Linked Resources:'));
  assert.ok(text.includes('Uses:\n    - [PROMPT] Deployment Prompt'));
  assert.ok(text.includes('Follows:\n    - [WORKFLOW] Release Workflow'));
  assert.ok(text.includes('Notes:\nVerify health checks after deploy'));
});

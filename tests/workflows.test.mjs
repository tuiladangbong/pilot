import test from 'node:test';
import assert from 'node:assert/strict';

import {
  createWorkflow,
  createWorkflowStep,
  updateWorkflow,
  validateStatus,
  validateDifficulty,
  normalizeTags,
} from '../src/modules/workflows/domain/Workflow.ts';

test('validateStatus and validateDifficulty handle defaults and variations', () => {
  assert.equal(validateStatus('active'), 'Active');
  assert.equal(validateStatus('Draft'), 'Draft');
  assert.equal(validateStatus('archived'), 'Archived');
  assert.equal(validateStatus(undefined), 'Active');
  assert.equal(validateStatus('unknown'), 'Active');

  assert.equal(validateDifficulty('easy'), 'Easy');
  assert.equal(validateDifficulty('Medium'), 'Medium');
  assert.equal(validateDifficulty('advanced'), 'Advanced');
  assert.equal(validateDifficulty(null), 'Medium');
  assert.equal(validateDifficulty('super-hard'), 'Medium');
});

test('normalizeTags handles duplicates and trimming', () => {
  const tags = normalizeTags(['  Coding  ', 'ai', 'CODING', '', '  ']);
  assert.deepEqual(tags, ['coding', 'ai']);
});

test('createWorkflowStep validates required fields and sets defaults', () => {
  const step = createWorkflowStep('wf-1', {
    title: '  Analyze Requirements  ',
    instruction: '  Read client brief and extract key entities.  ',
    notes: 'Keep it concise',
    optional: true,
  }, 1);

  assert.ok(step.id);
  assert.equal(step.workflowId, 'wf-1');
  assert.equal(step.position, 1);
  assert.equal(step.title, 'Analyze Requirements');
  assert.equal(step.instruction, 'Read client brief and extract key entities.');
  assert.equal(step.notes, 'Keep it concise');
  assert.equal(step.optional, true);

  assert.throws(() => createWorkflowStep('wf-1', { title: '', instruction: 'Do work' }, 1), /Step title must be non-empty/);
  assert.throws(() => createWorkflowStep('wf-1', { title: 'Valid Title', instruction: '' }, 1), /Step instruction must be non-empty/);
});

test('createWorkflow creates structured workflow with ordered steps', () => {
  const wf = createWorkflow({
    title: '  Build Website from Client Brief  ',
    description: 'End-to-end process from brief to deployment',
    purpose: 'Streamline full-stack web app delivery',
    status: 'Active',
    difficulty: 'Advanced',
    estimatedTime: '2 hours',
    notes: 'Make sure API keys are configured before starting',
    tags: ['WebDev', 'FullStack', 'AI'],
    steps: [
      {
        title: 'Draft Wireframes',
        instruction: 'Use Claude to produce layout specs',
      },
      {
        title: 'Implement Core Components',
        instruction: 'Code HTML/CSS modules according to specs',
        optional: false,
      },
      {
        title: 'Deploy to Cloudflare Workers',
        instruction: 'Run wrangler deploy and verify production',
        optional: true,
      },
    ],
  });

  assert.ok(wf.id);
  assert.equal(wf.title, 'Build Website from Client Brief');
  assert.equal(wf.status, 'Active');
  assert.equal(wf.difficulty, 'Advanced');
  assert.equal(wf.estimatedTime, '2 hours');
  assert.equal(wf.steps.length, 3);
  assert.equal(wf.steps[0].position, 1);
  assert.equal(wf.steps[0].title, 'Draft Wireframes');
  assert.equal(wf.steps[1].position, 2);
  assert.equal(wf.steps[2].position, 3);
  assert.equal(wf.steps[2].optional, true);
  assert.deepEqual(wf.tags, ['webdev', 'fullstack', 'ai']);

  assert.throws(() => createWorkflow({ title: '' }), /Workflow title must be non-empty/);
});

test('updateWorkflow modifies fields and reindexes steps', () => {
  const initial = createWorkflow({
    title: 'Initial Workflow',
    steps: [
      { title: 'Step 1', instruction: 'Do 1' },
      { title: 'Step 2', instruction: 'Do 2' },
    ],
  });

  const updated = updateWorkflow(initial, {
    title: 'Updated Workflow Title',
    difficulty: 'Easy',
    steps: [
      { title: 'New First Step', instruction: 'Do new 1' },
    ],
  });

  assert.equal(updated.id, initial.id);
  assert.equal(updated.title, 'Updated Workflow Title');
  assert.equal(updated.difficulty, 'Easy');
  assert.equal(updated.steps.length, 1);
  assert.equal(updated.steps[0].position, 1);
  assert.equal(updated.steps[0].title, 'New First Step');
});

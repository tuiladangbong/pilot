import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

function getTsFiles(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...getTsFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.ts')) {
      results.push(fullPath);
    }
  }
  return results;
}

test('Architectural Guard: core and modules must contain zero Cloudflare imports or types', () => {
  const forbiddenPatterns = [
    /@cloudflare\//,
    /cloudflare:/,
    /\bwrangler\b/,
    /\bD1Database\b/,
    /\bExecutionContext\b/,
    /\bKVNamespace\b/,
    /\bR2Bucket\b/,
    /\bDurableObject\b/,
  ];

  const targetDirs = [
    path.join(projectRoot, 'src', 'core'),
    path.join(projectRoot, 'src', 'modules'),
  ];

  const filesToCheck = [];
  for (const dir of targetDirs) {
    filesToCheck.push(...getTsFiles(dir));
  }

  assert.ok(filesToCheck.length > 0, 'Must inspect files in core and modules');

  const violations = [];

  for (const filePath of filesToCheck) {
    const relativePath = path.relative(projectRoot, filePath).replace(/\\/g, '/');
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, lineIdx) => {
      // Ignore comment lines
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) {
        return;
      }

      for (const pattern of forbiddenPatterns) {
        if (pattern.test(line)) {
          violations.push(`${relativePath}:${lineIdx + 1} -> ${trimmed}`);
        }
      }
    });
  }

  assert.deepEqual(
    violations,
    [],
    `Architectural violation: Core/module code cannot depend on Cloudflare!\nViolations:\n${violations.join('\n')}`
  );
});

test('Architectural Guard: HTTP router must not import D1 repositories or Cloudflare Env', () => {
  const routerPath = path.join(projectRoot, 'src', 'adapters', 'http', 'router.ts');
  assert.ok(fs.existsSync(routerPath), 'router.ts must exist');

  const content = fs.readFileSync(routerPath, 'utf-8');
  const lines = content.split('\n');
  const forbiddenInRouter = [
    /\bEnv\b/,
    /\bD1Database\b/,
    /\bD1PromptRepository\b/,
    /\bD1ToolRepository\b/,
    /\bD1WorkflowRepository\b/,
    /\bD1ResourceRepository\b/,
    /\bD1HealthCheck\b/,
    /@cloudflare\//,
  ];

  const violations = [];
  lines.forEach((line, lineIdx) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) {
      return;
    }
    for (const pattern of forbiddenInRouter) {
      if (pattern.test(line)) {
        violations.push(`router.ts:${lineIdx + 1} -> ${trimmed}`);
      }
    }
  });

  assert.deepEqual(
    violations,
    [],
    `Architectural violation: HTTP router must depend only on repository ports and RouterDependencies!\nViolations:\n${violations.join('\n')}`
  );
});

test('Architectural Guard: Ports must define platform-agnostic repository interfaces', () => {
  const portDirs = [
    path.join(projectRoot, 'src', 'core', 'ports'),
    path.join(projectRoot, 'src', 'modules', 'prompts', 'ports'),
    path.join(projectRoot, 'src', 'modules', 'tools', 'ports'),
    path.join(projectRoot, 'src', 'modules', 'workflows', 'ports'),
  ];

  const portFiles = [];
  for (const dir of portDirs) {
    portFiles.push(...getTsFiles(dir));
  }

  assert.ok(portFiles.length >= 4, 'Must have at least 4 port interfaces');

  const forbiddenInPorts = [
    /\bEnv\b/,
    /\bD1\b/,
    /\bResponse\b/,
    /\bRequest\b/,
    /@cloudflare\//,
  ];

  const violations = [];
  for (const filePath of portFiles) {
    const relativePath = path.relative(projectRoot, filePath).replace(/\\/g, '/');
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, lineIdx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) {
        return;
      }
      for (const pattern of forbiddenInPorts) {
        if (pattern.test(line)) {
          violations.push(`${relativePath}:${lineIdx + 1} -> ${trimmed}`);
        }
      }
    });
  }

  assert.deepEqual(
    violations,
    [],
    `Architectural violation: Port interfaces must remain strictly platform-agnostic!\nViolations:\n${violations.join('\n')}`
  );
});

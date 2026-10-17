import { Env } from './env';
import { RouterDependencies } from '../../adapters/http/router';
import { D1PromptRepository } from '../../adapters/persistence/d1/D1PromptRepository';
import { D1ToolRepository } from '../../adapters/persistence/d1/D1ToolRepository';
import { D1WorkflowRepository } from '../../adapters/persistence/d1/D1WorkflowRepository';
import { D1AgentRepository } from '../../adapters/persistence/d1/D1AgentRepository';
import { D1ResourceRepository } from '../../adapters/persistence/d1/D1ResourceRepository';
import { checkDatabaseHealth } from '../../adapters/persistence/d1/D1HealthCheck';

/**
 * Cloudflare Composition Root.
 *
 * Transforms Cloudflare environment bindings (D1Database, ASSETS) into
 * platform-neutral persistence adapters and dependencies for the HTTP router.
 */
export function createCloudflareDependencies(env: Env): RouterDependencies {
  return {
    promptRepo: new D1PromptRepository(env.DB),
    toolRepo: new D1ToolRepository(env.DB),
    workflowRepo: new D1WorkflowRepository(env.DB),
    agentRepo: new D1AgentRepository(env.DB),
    resourceRepo: new D1ResourceRepository(env.DB),
    checkHealth: () => checkDatabaseHealth(env.DB),
    assetHandler: env.ASSETS ? (req: Request) => env.ASSETS!.fetch(req) : undefined,
  };
}

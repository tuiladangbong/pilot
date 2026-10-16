import { Env } from '../../platform/cloudflare/env';
import { checkDatabaseHealth } from '../persistence/d1/D1HealthCheck';
import { D1PromptRepository } from '../persistence/d1/D1PromptRepository';
import { D1ResourceRepository } from '../persistence/d1/D1ResourceRepository';
import { D1ToolRepository } from '../persistence/d1/D1ToolRepository';
import { CreatePromptUseCase } from '../../modules/prompts/application/CreatePromptUseCase';
import { GetPromptUseCase } from '../../modules/prompts/application/GetPromptUseCase';
import { ListPromptsUseCase } from '../../modules/prompts/application/ListPromptsUseCase';
import { UpdatePromptUseCase } from '../../modules/prompts/application/UpdatePromptUseCase';
import { DeletePromptUseCase } from '../../modules/prompts/application/DeletePromptUseCase';
import { DuplicatePromptUseCase } from '../../modules/prompts/application/DuplicatePromptUseCase';
import { TogglePromptFavoriteUseCase } from '../../modules/prompts/application/TogglePromptFavoriteUseCase';
import { CreateToolUseCase } from '../../modules/tools/application/CreateToolUseCase';
import { GetToolUseCase } from '../../modules/tools/application/GetToolUseCase';
import { ListToolsUseCase } from '../../modules/tools/application/ListToolsUseCase';
import { UpdateToolUseCase } from '../../modules/tools/application/UpdateToolUseCase';
import { DeleteToolUseCase } from '../../modules/tools/application/DeleteToolUseCase';
import { DuplicateToolUseCase } from '../../modules/tools/application/DuplicateToolUseCase';
import { ToggleToolFavoriteUseCase } from '../../modules/tools/application/ToggleToolFavoriteUseCase';
import { FetchToolMetadataUseCase } from '../../modules/tools/application/FetchToolMetadataUseCase';
import { ToolKind, ToolPricing } from '../../modules/tools/domain/Tool';
import { toResourceSummaryDto } from '../../core/application/ResourceDto';

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'no-store',
    },
  });
}

function jsonError(code: string, message: string, status = 400): Response {
  return json(
    {
      ok: false,
      error: {
        code,
        message,
      },
    },
    status
  );
}

export async function handleRequest(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const pathname = url.pathname.replace(/\/+$/, '') || '/';
  const method = request.method.toUpperCase();

  // Foundation & Health Endpoints
  if (pathname === '/api/health' && method === 'GET') {
    return json({ ok: true, service: 'pilot' });
  }

  if (pathname === '/api/db-health' && method === 'GET') {
    const health = await checkDatabaseHealth(env.DB);
    return json(health, health.ok ? 200 : 503);
  }

  if (pathname === '/api/architecture' && method === 'GET') {
    return json({
      application: 'Pilot',
      architecture: 'modular-monolith',
      style: 'hexagonal',
      modules: ['prompts', 'tools'],
    });
  }

  const promptRepo = new D1PromptRepository(env.DB);
  const toolRepo = new D1ToolRepository(env.DB);
  const resourceRepo = new D1ResourceRepository(env.DB);

  // GET /api/resources (Generic resource listing across modules)
  if (pathname === '/api/resources' && method === 'GET') {
    const limit = parseInt(url.searchParams.get('limit') ?? '50', 10);
    const offset = parseInt(url.searchParams.get('offset') ?? '0', 10);
    const type = url.searchParams.get('type') ?? undefined;
    const tag = url.searchParams.get('tag') ?? undefined;
    const q = url.searchParams.get('q') ?? undefined;
    const favoriteParam = url.searchParams.get('favorite');
    const favorite = favoriteParam !== null ? favoriteParam === 'true' || favoriteParam === '1' : undefined;

    const sortParam = url.searchParams.get('sort');
    let sort: 'updated_at' | 'created_at' | 'title' = 'updated_at';
    if (sortParam === 'created_at' || sortParam === 'title') {
      sort = sortParam;
    }

    const orderParam = url.searchParams.get('order')?.toLowerCase();
    const order: 'asc' | 'desc' = orderParam === 'asc' ? 'asc' : 'desc';

    const result = await resourceRepo.list({
      type,
      tag,
      favorite,
      q,
      sort,
      order,
      limit,
      offset,
    });

    return json({
      ok: true,
      data: result.resources.map(toResourceSummaryDto),
      meta: {
        total: result.total,
        limit,
        offset,
      },
    });
  }

  // GET /api/tags
  if (pathname === '/api/tags' && method === 'GET') {
    const moduleParam = url.searchParams.get('module')?.toLowerCase();
    let tags;
    if (moduleParam === 'prompts') {
      tags = await promptRepo.getAllTags();
    } else if (moduleParam === 'tools') {
      tags = await toolRepo.getAllTags();
    } else {
      // All tags across all resources
      tags = await promptRepo.getAllTags();
    }
    return json({
      ok: true,
      data: tags,
    });
  }

  // GET /api/models (Autocomplete suggestions for prompts)
  if (pathname === '/api/models' && method === 'GET') {
    const models = await promptRepo.getDistinctModels();
    return json({
      ok: true,
      data: models,
    });
  }

  // GET /api/tools/categories (Autocomplete suggestions for tools)
  if (pathname === '/api/tools/categories' && method === 'GET') {
    const categories = await toolRepo.getDistinctCategories();
    return json({
      ok: true,
      data: categories,
    });
  }

  // GET /api/tools/providers (Autocomplete suggestions for tools)
  if (pathname === '/api/tools/providers' && method === 'GET') {
    const providers = await toolRepo.getDistinctProviders();
    return json({
      ok: true,
      data: providers,
    });
  }

  // POST /api/tools/fetch-metadata (Extract title, description, favicon from URL)
  if (pathname === '/api/tools/fetch-metadata' && method === 'POST') {
    let body: any;
    try {
      body = await request.json();
    } catch {
      return jsonError('INVALID_JSON', 'Request body must be valid JSON', 400);
    }

    if (!body || typeof body.url !== 'string' || body.url.trim() === '') {
      return jsonError('VALIDATION_ERROR', 'A valid URL is required', 400);
    }

    try {
      const fetcher = new FetchToolMetadataUseCase();
      const meta = await fetcher.execute(body.url);
      return json({ ok: true, data: meta });
    } catch (err: any) {
      return jsonError('METADATA_FETCH_ERROR', err.message ?? 'Failed to fetch metadata', 400);
    }
  }

  // GET /api/search?q=...
  if (pathname === '/api/search' && method === 'GET') {
    const q = url.searchParams.get('q') ?? '';
    const moduleParam = url.searchParams.get('module')?.toLowerCase();
    const tag = url.searchParams.get('tag') ?? undefined;
    const favoriteParam = url.searchParams.get('favorite');
    const favorite = favoriteParam !== null ? favoriteParam === 'true' || favoriteParam === '1' : undefined;

    if (moduleParam === 'prompts') {
      const model = url.searchParams.get('model') ?? undefined;
      const useCase = new ListPromptsUseCase(promptRepo);
      const result = await useCase.execute({ q, tag, model, favorite });
      return json({
        ok: true,
        data: result.prompts,
        meta: { total: result.total, q },
      });
    }

    if (moduleParam === 'tools') {
      const kindParam = url.searchParams.get('kind');
      const kind: ToolKind | undefined = kindParam === 'tool' || kindParam === 'website' ? kindParam : undefined;
      const category = url.searchParams.get('category') ?? undefined;
      const provider = url.searchParams.get('provider') ?? undefined;
      const pricing = (url.searchParams.get('pricing') as ToolPricing) ?? undefined;

      const useCase = new ListToolsUseCase(toolRepo);
      const result = await useCase.execute({ q, kind, category, provider, pricing, tag, favorite });
      return json({
        ok: true,
        data: result.tools,
        meta: { total: result.total, q },
      });
    }

    // Unified cross-resource search
    const type = url.searchParams.get('type') ?? undefined;
    const result = await resourceRepo.list({ q, type, tag, favorite, limit: 50 });
    return json({
      ok: true,
      data: result.resources.map(toResourceSummaryDto),
      meta: { total: result.total, q },
    });
  }

  // --- Tools & Websites API ---

  // POST /api/tools/:id/duplicate
  const toolDuplicateMatch = pathname.match(/^\/api\/tools\/([^/]+)\/duplicate$/);
  if (toolDuplicateMatch && method === 'POST') {
    const id = decodeURIComponent(toolDuplicateMatch[1]);
    try {
      const useCase = new DuplicateToolUseCase(toolRepo);
      const duplicate = await useCase.execute(id);
      return json({ ok: true, data: duplicate }, 201);
    } catch (err: any) {
      if (err.message?.includes('not found')) {
        return jsonError('NOT_FOUND', err.message, 404);
      }
      return jsonError('DUPLICATION_ERROR', err.message ?? 'Failed to duplicate tool', 500);
    }
  }

  // PATCH /api/tools/:id/favorite or POST /api/tools/:id/favorite
  const toolFavoriteMatch = pathname.match(/^\/api\/tools\/([^/]+)\/favorite$/);
  if (toolFavoriteMatch && (method === 'PATCH' || method === 'POST')) {
    const id = decodeURIComponent(toolFavoriteMatch[1]);
    let explicitFavorite: boolean | undefined;

    try {
      const body = await request.json().catch(() => null);
      if (body && typeof (body as any).favorite === 'boolean') {
        explicitFavorite = (body as any).favorite;
      }
    } catch {
      // Optional body
    }

    try {
      const useCase = new ToggleToolFavoriteUseCase(toolRepo);
      const result = await useCase.execute(id, explicitFavorite);
      return json({ ok: true, data: result });
    } catch (err: any) {
      if (err.message?.includes('not found')) {
        return jsonError('NOT_FOUND', err.message, 404);
      }
      return jsonError('FAVORITE_ERROR', err.message ?? 'Failed to toggle favorite', 500);
    }
  }

  // GET /api/tools/:id, PUT /api/tools/:id, DELETE /api/tools/:id
  const toolIdMatch = pathname.match(/^\/api\/tools\/([^/]+)$/);
  if (toolIdMatch) {
    const id = decodeURIComponent(toolIdMatch[1]);

    if (method === 'GET') {
      const useCase = new GetToolUseCase(toolRepo);
      const tool = await useCase.execute(id);
      if (!tool) {
        return jsonError('NOT_FOUND', `Tool with id "${id}" not found`, 404);
      }
      return json({ ok: true, data: tool });
    }

    if (method === 'PUT') {
      let body: any;
      try {
        body = await request.json();
      } catch {
        return jsonError('INVALID_JSON', 'Request body must be valid JSON', 400);
      }

      if (!body || typeof body !== 'object') {
        return jsonError('VALIDATION_ERROR', 'Request body must be an object', 400);
      }

      try {
        const useCase = new UpdateToolUseCase(toolRepo);
        const updated = await useCase.execute(id, {
          title: body.title,
          description: body.description,
          url: body.url,
          kind: body.kind,
          provider: body.provider,
          category: body.category,
          pricing: body.pricing,
          notes: body.notes,
          faviconUrl: body.faviconUrl,
          favorite: body.favorite,
          tags: body.tags,
        });
        return json({ ok: true, data: updated });
      } catch (err: any) {
        if (err.message?.includes('not found')) {
          return jsonError('NOT_FOUND', err.message, 404);
        }
        return jsonError('VALIDATION_ERROR', err.message ?? 'Failed to update tool', 400);
      }
    }

    if (method === 'DELETE') {
      try {
        const useCase = new DeleteToolUseCase(toolRepo);
        const deleted = await useCase.execute(id);
        return json({ ok: true, data: { id, deleted } });
      } catch (err: any) {
        return jsonError('DELETE_ERROR', err.message ?? 'Failed to delete tool', 500);
      }
    }

    return jsonError('METHOD_NOT_ALLOWED', `Method ${method} not allowed on /api/tools/:id`, 405);
  }

  // /api/tools (Collection level)
  if (pathname === '/api/tools') {
    if (method === 'GET') {
      const q = url.searchParams.get('q') ?? undefined;
      const kindParam = url.searchParams.get('kind');
      const kind: ToolKind | undefined = kindParam === 'tool' || kindParam === 'website' ? kindParam : undefined;
      const category = url.searchParams.get('category') ?? undefined;
      const provider = url.searchParams.get('provider') ?? undefined;
      const pricing = (url.searchParams.get('pricing') as ToolPricing) ?? undefined;
      const tag = url.searchParams.get('tag') ?? undefined;
      const favoriteParam = url.searchParams.get('favorite');
      const favorite = favoriteParam !== null ? favoriteParam === 'true' || favoriteParam === '1' : undefined;

      const sortParam = url.searchParams.get('sort');
      let sort: 'updated_at' | 'created_at' | 'title' = 'updated_at';
      if (sortParam === 'created_at' || sortParam === 'title') {
        sort = sortParam;
      }

      const orderParam = url.searchParams.get('order')?.toLowerCase();
      const order: 'asc' | 'desc' = orderParam === 'asc' ? 'asc' : 'desc';

      const limit = parseInt(url.searchParams.get('limit') ?? '50', 10);
      const offset = parseInt(url.searchParams.get('offset') ?? '0', 10);

      const useCase = new ListToolsUseCase(toolRepo);
      const result = await useCase.execute({
        q,
        kind,
        category,
        provider,
        pricing,
        tag,
        favorite,
        sort,
        order,
        limit,
        offset,
      });

      return json({
        ok: true,
        data: result.tools,
        meta: {
          total: result.total,
          limit: result.limit,
          offset: result.offset,
        },
      });
    }

    if (method === 'POST') {
      let body: any;
      try {
        body = await request.json();
      } catch {
        return jsonError('INVALID_JSON', 'Request body must be valid JSON', 400);
      }

      if (!body || typeof body !== 'object') {
        return jsonError('VALIDATION_ERROR', 'Request body must be an object', 400);
      }

      if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') {
        return jsonError('VALIDATION_ERROR', 'Title is required', 400);
      }

      if (!body.url || typeof body.url !== 'string' || body.url.trim() === '') {
        return jsonError('VALIDATION_ERROR', 'URL is required', 400);
      }

      try {
        const useCase = new CreateToolUseCase(toolRepo);
        const result = await useCase.execute({
          id: body.id,
          title: body.title,
          description: body.description,
          url: body.url,
          kind: body.kind,
          provider: body.provider,
          category: body.category,
          pricing: body.pricing,
          notes: body.notes,
          faviconUrl: body.faviconUrl,
          favorite: Boolean(body.favorite),
          tags: Array.isArray(body.tags) ? body.tags : [],
        });
        return json({ ok: true, data: result.tool, warning: result.warning }, 201);
      } catch (err: any) {
        return jsonError('CREATION_ERROR', err.message ?? 'Failed to create tool', 400);
      }
    }

    return jsonError('METHOD_NOT_ALLOWED', `Method ${method} not allowed on /api/tools`, 405);
  }

  // --- Prompts API ---

  // POST /api/prompts/:id/duplicate
  const duplicateMatch = pathname.match(/^\/api\/prompts\/([^/]+)\/duplicate$/);
  if (duplicateMatch && method === 'POST') {
    const id = decodeURIComponent(duplicateMatch[1]);
    try {
      const useCase = new DuplicatePromptUseCase(promptRepo);
      const duplicate = await useCase.execute(id);
      return json({ ok: true, data: duplicate }, 201);
    } catch (err: any) {
      if (err.message?.includes('not found')) {
        return jsonError('NOT_FOUND', err.message, 404);
      }
      return jsonError('DUPLICATION_ERROR', err.message ?? 'Failed to duplicate prompt', 500);
    }
  }

  // PATCH /api/prompts/:id/favorite or POST /api/prompts/:id/favorite
  const favoriteMatch = pathname.match(/^\/api\/prompts\/([^/]+)\/favorite$/);
  if (favoriteMatch && (method === 'PATCH' || method === 'POST')) {
    const id = decodeURIComponent(favoriteMatch[1]);
    let explicitFavorite: boolean | undefined;

    try {
      const body = await request.json().catch(() => null);
      if (body && typeof (body as any).favorite === 'boolean') {
        explicitFavorite = (body as any).favorite;
      }
    } catch {
      // Body optional
    }

    try {
      const useCase = new TogglePromptFavoriteUseCase(promptRepo);
      const result = await useCase.execute(id, explicitFavorite);
      return json({ ok: true, data: result });
    } catch (err: any) {
      if (err.message?.includes('not found')) {
        return jsonError('NOT_FOUND', err.message, 404);
      }
      return jsonError('FAVORITE_ERROR', err.message ?? 'Failed to toggle favorite', 500);
    }
  }

  // GET /api/prompts/:id
  const promptIdMatch = pathname.match(/^\/api\/prompts\/([^/]+)$/);
  if (promptIdMatch) {
    const id = decodeURIComponent(promptIdMatch[1]);

    if (method === 'GET') {
      const useCase = new GetPromptUseCase(promptRepo);
      const prompt = await useCase.execute(id);
      if (!prompt) {
        return jsonError('NOT_FOUND', `Prompt with id "${id}" not found`, 404);
      }
      return json({ ok: true, data: prompt });
    }

    if (method === 'PUT') {
      let body: any;
      try {
        body = await request.json();
      } catch {
        return jsonError('INVALID_JSON', 'Request body must be valid JSON', 400);
      }

      if (!body || typeof body !== 'object') {
        return jsonError('VALIDATION_ERROR', 'Request body must be an object', 400);
      }

      try {
        const useCase = new UpdatePromptUseCase(promptRepo);
        const updated = await useCase.execute(id, {
          title: body.title,
          description: body.description,
          content: body.content,
          model: body.model,
          favorite: body.favorite,
          tags: body.tags,
        });
        return json({ ok: true, data: updated });
      } catch (err: any) {
        if (err.message?.includes('not found')) {
          return jsonError('NOT_FOUND', err.message, 404);
        }
        return jsonError('VALIDATION_ERROR', err.message ?? 'Failed to update prompt', 400);
      }
    }

    if (method === 'DELETE') {
      try {
        const useCase = new DeletePromptUseCase(promptRepo);
        const deleted = await useCase.execute(id);
        return json({ ok: true, data: { id, deleted } });
      } catch (err: any) {
        return jsonError('DELETE_ERROR', err.message ?? 'Failed to delete prompt', 500);
      }
    }

    return jsonError('METHOD_NOT_ALLOWED', `Method ${method} not allowed on /api/prompts/:id`, 405);
  }

  // /api/prompts (Collection level)
  if (pathname === '/api/prompts') {
    if (method === 'GET') {
      const q = url.searchParams.get('q') ?? undefined;
      const tag = url.searchParams.get('tag') ?? undefined;
      const model = url.searchParams.get('model') ?? undefined;
      const favoriteParam = url.searchParams.get('favorite');
      const favorite = favoriteParam !== null ? favoriteParam === 'true' || favoriteParam === '1' : undefined;

      const sortParam = url.searchParams.get('sort');
      let sort: 'updated_at' | 'created_at' | 'title' = 'updated_at';
      if (sortParam === 'created_at' || sortParam === 'title') {
        sort = sortParam;
      }

      const orderParam = url.searchParams.get('order')?.toLowerCase();
      const order: 'asc' | 'desc' = orderParam === 'asc' ? 'asc' : 'desc';

      const limit = parseInt(url.searchParams.get('limit') ?? '50', 10);
      const offset = parseInt(url.searchParams.get('offset') ?? '0', 10);

      const useCase = new ListPromptsUseCase(promptRepo);
      const result = await useCase.execute({
        q,
        tag,
        model,
        favorite,
        sort,
        order,
        limit,
        offset,
      });

      return json({
        ok: true,
        data: result.prompts,
        meta: {
          total: result.total,
          limit: result.limit,
          offset: result.offset,
        },
      });
    }

    if (method === 'POST') {
      let body: any;
      try {
        body = await request.json();
      } catch {
        return jsonError('INVALID_JSON', 'Request body must be valid JSON', 400);
      }

      if (!body || typeof body !== 'object') {
        return jsonError('VALIDATION_ERROR', 'Request body must be an object', 400);
      }

      if (!body.title || typeof body.title !== 'string' || body.title.trim() === '') {
        return jsonError('VALIDATION_ERROR', 'Title is required', 400);
      }

      if (!body.content || typeof body.content !== 'string' || body.content.trim() === '') {
        return jsonError('VALIDATION_ERROR', 'Prompt content is required', 400);
      }

      try {
        const useCase = new CreatePromptUseCase(promptRepo);
        const created = await useCase.execute({
          id: body.id,
          title: body.title,
          description: body.description,
          content: body.content,
          model: body.model,
          favorite: Boolean(body.favorite),
          tags: Array.isArray(body.tags) ? body.tags : [],
        });
        return json({ ok: true, data: created }, 201);
      } catch (err: any) {
        return jsonError('CREATION_ERROR', err.message ?? 'Failed to create prompt', 400);
      }
    }

    return jsonError('METHOD_NOT_ALLOWED', `Method ${method} not allowed on /api/prompts`, 405);
  }

  // Fallback for root / prompt / tool routes if not intercepted by static assets
  if (pathname === '/' || pathname.startsWith('/prompt/') || pathname.startsWith('/tool/')) {
    if (env.ASSETS) {
      const assetReq = new Request(new URL('/', request.url).toString(), request);
      return env.ASSETS.fetch(assetReq);
    }
    return new Response('Pilot - AI Resource Hub', {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  }

  return jsonError('NOT_FOUND', 'Route not found', 404);
}

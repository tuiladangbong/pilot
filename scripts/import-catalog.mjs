import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';
import { canonicalizeUrl, slugify, validateCatalog } from './validate-catalog.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const catalogPath = path.join(projectRoot, 'data', 'ai-tools-catalog.json');

function escapeSql(str) {
  if (str === null || str === undefined) return 'NULL';
  return `'${String(str).replace(/'/g, "''")}'`;
}

export function generateImportStatements(catalogItems, existingResources = []) {
  const statements = [];
  const now = new Date().toISOString();

  // Index existing resources by canonical URL and by slug
  const existingByCanonicalUrl = new Map();
  const existingBySlug = new Map();

  for (const res of existingResources) {
    if (res.url) {
      existingByCanonicalUrl.set(canonicalizeUrl(res.url), res);
    }
    if (res.slug) {
      existingBySlug.set(res.slug.toLowerCase(), res);
    }
  }

  let createdCount = 0;
  let updatedCount = 0;

  for (const item of catalogItems) {
    const canonical = canonicalizeUrl(item.url);
    const slug = slugify(item.slug || item.title);
    const existing = existingByCanonicalUrl.get(canonical) || existingBySlug.get(slug);

    const kind = item.kind === 'website' ? 'website' : 'tool';
    const pricing = item.pricing || 'Unknown';
    const featured = item.featured ? 1 : 0;
    const origin = 'curated';
    const verifiedAt = item.verifiedAt || now.split('T')[0];

    let resourceId;

    if (existing) {
      // Existing resource: Update curated fields while preserving curator custom notes & manual changes
      resourceId = existing.id;
      updatedCount++;

      statements.push(`
        UPDATE resources
        SET title = ${escapeSql(item.title)},
            description = COALESCE(NULLIF(${escapeSql(item.description)}, ''), description),
            slug = COALESCE(slug, ${escapeSql(slug)}),
            featured = ${featured},
            origin = ${escapeSql(origin)},
            updated_at = ${escapeSql(now)}
        WHERE id = ${escapeSql(resourceId)};
      `);

      statements.push(`
        UPDATE tools
        SET kind = ${escapeSql(kind)},
            url = ${escapeSql(item.url)},
            hostname = ${escapeSql(new URL(item.url).hostname.replace(/^www\./, ''))},
            provider = ${escapeSql(item.provider || null)},
            category = ${escapeSql(item.category || null)},
            pricing = ${escapeSql(pricing)},
            verified_at = ${escapeSql(verifiedAt)}
        WHERE resource_id = ${escapeSql(resourceId)};
      `);
    } else {
      // New resource: Insert core resource and tool record
      resourceId = crypto.randomUUID();
      createdCount++;

      statements.push(`
        INSERT INTO resources (id, type, title, description, slug, featured, origin, favorite, created_at, updated_at)
        VALUES (
          ${escapeSql(resourceId)},
          ${escapeSql(kind)},
          ${escapeSql(item.title)},
          ${escapeSql(item.description || null)},
          ${escapeSql(slug)},
          ${featured},
          ${escapeSql(origin)},
          0,
          ${escapeSql(now)},
          ${escapeSql(now)}
        );
      `);

      statements.push(`
        INSERT INTO tools (resource_id, kind, url, hostname, provider, category, pricing, notes, favicon_url, verified_at)
        VALUES (
          ${escapeSql(resourceId)},
          ${escapeSql(kind)},
          ${escapeSql(item.url)},
          ${escapeSql(new URL(item.url).hostname.replace(/^www\./, ''))},
          ${escapeSql(item.provider || null)},
          ${escapeSql(item.category || null)},
          ${escapeSql(pricing)},
          NULL,
          NULL,
          ${escapeSql(verifiedAt)}
        );
      `);
    }

    // Tags synchronization
    const tags = Array.isArray(item.tags) ? item.tags : [];
    for (const tag of tags) {
      const cleanTag = tag.trim().toLowerCase();
      if (!cleanTag) continue;

      statements.push(`
        INSERT INTO tags (id, name)
        VALUES (${escapeSql(crypto.randomUUID())}, ${escapeSql(cleanTag)})
        ON CONFLICT(name) DO NOTHING;
      `);

      statements.push(`
        INSERT INTO resource_tags (resource_id, tag_id)
        SELECT ${escapeSql(resourceId)}, id FROM tags WHERE name = ${escapeSql(cleanTag)}
        ON CONFLICT DO NOTHING;
      `);
    }
  }

  return { statements, createdCount, updatedCount };
}

// CLI Execution
async function main() {
  const isRemote = process.argv.includes('--remote');
  const targetName = isRemote ? 'remote' : 'local';

  console.log(`🚀 Starting catalog import to ${targetName.toUpperCase()} D1 database...`);

  if (!fs.existsSync(catalogPath)) {
    console.error(`❌ Catalog file not found: ${catalogPath}`);
    process.exit(1);
  }

  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));
  const validation = validateCatalog(catalog);
  if (!validation.valid) {
    console.error(`❌ Catalog validation failed:`, validation.errors);
    process.exit(1);
  }

  console.log(`📦 Loaded ${catalog.length} validated items from catalog.`);

  // 1. Fetch existing resources from target D1
  console.log(`🔍 Fetching existing resources from ${targetName} D1...`);
  const queryCmd = `npx wrangler d1 execute pilot-db ${isRemote ? '--remote' : '--local'} --command="SELECT r.id, r.slug, tl.url FROM resources r LEFT JOIN tools tl ON tl.resource_id = r.id;"`;
  let existing = [];
  try {
    const rawOutput = execSync(queryCmd, { cwd: projectRoot, encoding: 'utf8' });
    const jsonMatch = rawOutput.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      if (Array.isArray(parsed[0]?.results)) {
        existing = parsed[0].results;
      }
    }
  } catch (err) {
    console.warn(`⚠️ Warning: could not pre-fetch existing records (${err.message}). Proceeding with safe upserts.`);
  }

  console.log(`📋 Found ${existing.length} existing resources in ${targetName} D1.`);

  // 2. Generate statements
  const { statements, createdCount, updatedCount } = generateImportStatements(catalog, existing);
  console.log(`📝 Generated ${statements.length} SQL statements (${createdCount} new, ${updatedCount} existing).`);

  // 3. Execute statements in chunked batches
  const chunks = [];
  let currentChunk = [];

  for (let i = 0; i < statements.length; i++) {
    currentChunk.push(statements[i]);
    if (currentChunk.length >= 60 || i === statements.length - 1) {
      chunks.push(currentChunk.join('\n'));
      currentChunk = [];
    }
  }

  console.log(`⚡ Executing in ${chunks.length} batches...`);
  const tempSqlFile = path.join(projectRoot, '.temp_import.sql');

  for (let i = 0; i < chunks.length; i++) {
    const sql = chunks[i];
    fs.writeFileSync(tempSqlFile, sql, 'utf8');

    // Run batch via wrangler d1 execute with file
    try {
      if (isRemote) {
        execSync(`npx wrangler d1 execute pilot-db --remote --file=./.temp_import.sql -y`, {
          cwd: projectRoot,
          encoding: 'utf8',
          stdio: 'pipe',
        });
      } else {
        execSync(`npx wrangler d1 execute pilot-db --local --file=./.temp_import.sql`, {
          cwd: projectRoot,
          encoding: 'utf8',
          stdio: 'pipe',
        });
      }
      process.stdout.write(`  [${i + 1}/${chunks.length}] Batch succeeded\n`);
    } catch (err) {
      console.error(`\n❌ Error in batch ${i + 1}: ${err.message}`);
      if (fs.existsSync(tempSqlFile)) fs.unlinkSync(tempSqlFile);
      process.exit(1);
    }
  }

  if (fs.existsSync(tempSqlFile)) {
    fs.unlinkSync(tempSqlFile);
  }

  console.log(`\n🎉 Import to ${targetName.toUpperCase()} completed successfully!`);
  console.log(`   - Created: ${createdCount}`);
  console.log(`   - Updated: ${updatedCount}`);
  console.log(`   - Total Processed: ${catalog.length}`);
}

if (process.argv[1] && process.argv[1].endsWith('import-catalog.mjs')) {
  main().catch((err) => {
    console.error('Fatal import error:', err);
    process.exit(1);
  });
}

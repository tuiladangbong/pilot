import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const catalogPath = path.join(projectRoot, 'data', 'ai-tools-catalog.json');

export function canonicalizeUrl(rawUrl) {
  try {
    const url = new URL(rawUrl.trim());
    let host = url.hostname.toLowerCase();
    if (host.startsWith('www.')) {
      host = host.slice(4);
    }
    const protocol = url.protocol.toLowerCase();
    let pathname = url.pathname;
    if (pathname === '/') {
      pathname = '';
    } else if (pathname.endsWith('/')) {
      pathname = pathname.slice(0, -1);
    }
    return `${protocol}//${host}${pathname}${url.search}${url.hash}`;
  } catch {
    return rawUrl.trim();
  }
}

export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function validateCatalog(catalogData) {
  const errors = [];
  const warnings = [];

  if (!Array.isArray(catalogData)) {
    return {
      valid: false,
      errors: ['Catalog data must be an array of tool objects'],
      warnings: [],
      stats: { total: 0 },
    };
  }

  const seenUrls = new Map();
  const seenSlugs = new Map();
  const validPricings = new Set(['Free', 'Freemium', 'Paid', 'Open Source', 'Unknown']);
  const validKinds = new Set(['tool', 'website']);
  let featuredCount = 0;

  catalogData.forEach((item, idx) => {
    const itemPrefix = `Item #${idx + 1} (${item.title || 'Untitled'}):`;

    // 1. Title validation
    if (!item.title || typeof item.title !== 'string' || item.title.trim() === '') {
      errors.push(`${itemPrefix} Title is required and must be a non-empty string.`);
    }

    // 2. URL validation
    if (!item.url || typeof item.url !== 'string') {
      errors.push(`${itemPrefix} URL is required.`);
    } else {
      try {
        const parsed = new URL(item.url.trim());
        if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
          errors.push(`${itemPrefix} URL must use http:// or https:// (found ${parsed.protocol}).`);
        }
      } catch {
        errors.push(`${itemPrefix} URL format is invalid: "${item.url}".`);
      }

      // Check canonical URL duplicates
      const canonical = canonicalizeUrl(item.url);
      if (seenUrls.has(canonical)) {
        errors.push(
          `${itemPrefix} Duplicate URL detected. Already used by "${seenUrls.get(canonical)}": ${canonical}`
        );
      } else {
        seenUrls.set(canonical, item.title);
      }
    }

    // 3. Slug uniqueness
    const slug = slugify(item.slug || item.title || '');
    if (slug) {
      if (seenSlugs.has(slug)) {
        errors.push(`${itemPrefix} Duplicate slug "${slug}". Already used by "${seenSlugs.get(slug)}".`);
      } else {
        seenSlugs.set(slug, item.title);
      }
    }

    // 4. Kind validation
    if (!item.kind || !validKinds.has(item.kind)) {
      errors.push(`${itemPrefix} Kind must be "tool" or "website" (found "${item.kind}").`);
    }

    // 5. Pricing validation
    if (item.pricing && !validPricings.has(item.pricing)) {
      warnings.push(`${itemPrefix} Non-standard pricing "${item.pricing}".`);
    }

    // 6. Category validation
    if (!item.category || typeof item.category !== 'string' || item.category.trim() === '') {
      warnings.push(`${itemPrefix} Category is missing.`);
    }

    // 7. Tags validation
    if (!Array.isArray(item.tags) || item.tags.length === 0) {
      warnings.push(`${itemPrefix} Tags should be a non-empty array of strings.`);
    }

    // 8. Featured count
    if (item.featured) {
      featuredCount++;
    }

    // 9. Verified date
    if (item.verifiedAt && !/^\d{4}-\d{2}-\d{2}$/.test(item.verifiedAt)) {
      warnings.push(`${itemPrefix} verifiedAt should be in YYYY-MM-DD format (found "${item.verifiedAt}").`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    stats: {
      total: catalogData.length,
      featured: featuredCount,
      uniqueUrls: seenUrls.size,
      uniqueSlugs: seenSlugs.size,
    },
  };
}

// CLI Execution
if (process.argv[1] && process.argv[1].endsWith('validate-catalog.mjs')) {
  console.log(`🔍 Validating seed catalog at ${catalogPath}...`);
  if (!fs.existsSync(catalogPath)) {
    console.error(`❌ Catalog file not found: ${catalogPath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(catalogPath, 'utf8');
  let data;
  try {
    data = JSON.parse(raw);
  } catch (err) {
    console.error(`❌ JSON parse error: ${err.message}`);
    process.exit(1);
  }

  const report = validateCatalog(data);
  console.log('--- Catalog Validation Report ---');
  console.log(`Total Resources:   ${report.stats.total}`);
  console.log(`Featured Tools:    ${report.stats.featured}`);
  console.log(`Unique URLs:       ${report.stats.uniqueUrls}`);
  console.log(`Unique Slugs:      ${report.stats.uniqueSlugs}`);
  console.log(`Errors:            ${report.errors.length}`);
  console.log(`Warnings:          ${report.warnings.length}`);

  if (report.warnings.length > 0) {
    console.log('\n⚠️ Warnings:');
    report.warnings.slice(0, 10).forEach((w) => console.log(`  - ${w}`));
    if (report.warnings.length > 10) console.log(`  ... and ${report.warnings.length - 10} more.`);
  }

  if (report.errors.length > 0) {
    console.log('\n❌ Errors:');
    report.errors.forEach((e) => console.log(`  - ${e}`));
    process.exit(1);
  }

  console.log('\n✅ Catalog validation passed with zero errors!');
}

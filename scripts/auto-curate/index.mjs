#!/usr/bin/env node

/**
 * Pilot Autonomous Curation Engine (Master Pipeline).
 *
 * Discovers, sanitizes, evaluates, enriches, and ingests new high-value AI resources
 * into Pilot continuously without creating spam.
 *
 * Usage:
 *   node scripts/auto-curate/index.mjs --dry-run
 *   node scripts/auto-curate/index.mjs --publish --limit=5 --min-score=7.5
 */

import { fetchHackerNewsCandidates } from './sources/hackerNews.mjs';
import { fetchGitHubCandidates } from './sources/githubSearch.mjs';
import { fetchHuggingFaceCandidates } from './sources/huggingFace.mjs';
import { verifyDomainHealth } from './evaluator/domainChecker.mjs';
import { evaluateCandidate } from './evaluator/qualityScorer.mjs';
import { generatePairedWorkflow, generatePairedPrompt } from './evaluator/workflowGenerator.mjs';
import { PilotCuratorClient } from './curatorClient.mjs';
import { TelegramNotifier } from './notifier/telegramBot.mjs';

function parseArgs() {
  const args = process.argv.slice(2);
  const options = {
    dryRun: true,
    publish: false,
    limit: 5,
    minScore: 7.5,
    source: 'all',
  };

  for (const arg of args) {
    if (arg === '--publish') {
      options.publish = true;
      options.dryRun = false;
    } else if (arg === '--dry-run') {
      options.dryRun = true;
      options.publish = false;
    } else if (arg.startsWith('--limit=')) {
      options.limit = parseInt(arg.split('=')[1], 10) || 5;
    } else if (arg.startsWith('--min-score=')) {
      options.minScore = parseFloat(arg.split('=')[1]) || 7.5;
    } else if (arg.startsWith('--source=')) {
      options.source = arg.split('=')[1];
    }
  }

  return options;
}

async function runPipeline() {
  const options = parseArgs();
  console.log('====================================================');
  console.log('🤖 PILOT AUTONOMOUS CURATION ENGINE');
  console.log(`Mode: ${options.publish ? '🚀 LIVE PUBLISH' : '🧪 DRY RUN'}`);
  console.log(`Max Ingest Limit: ${options.limit} | Min Score: ${options.minScore}`);
  console.log('====================================================\n');

  const client = new PilotCuratorClient();
  const notifier = new TelegramNotifier();

  // Step 1: Index existing catalog for deduplication
  console.log('[Phase 1] Indexing existing catalog from Pilot...');
  await client.loadExistingCatalog();

  // Step 2: Source Discovery
  console.log('\n[Phase 2] Gathering candidate resources from verified feeds...');
  const candidates = [];

  if (options.source === 'all' || options.source === 'hn') {
    const hnItems = await fetchHackerNewsCandidates({ minPoints: 15, limit: 15 });
    console.log(`  ✓ Hacker News: Found ${hnItems.length} candidate projects`);
    candidates.push(...hnItems);
  }

  if (options.source === 'all' || options.source === 'github') {
    const ghItems = await fetchGitHubCandidates({ minStars: 100, limit: 15 });
    console.log(`  ✓ GitHub Search: Found ${ghItems.length} candidate repositories`);
    candidates.push(...ghItems);
  }

  if (options.source === 'all' || options.source === 'hf') {
    const hfItems = await fetchHuggingFaceCandidates({ minLikes: 50, limit: 10 });
    console.log(`  ✓ Hugging Face: Found ${hfItems.length} candidate spaces`);
    candidates.push(...hfItems);
  }

  console.log(`\nTotal raw candidates discovered: ${candidates.length}`);

  // Step 3: Filtering & Verification
  console.log('\n[Phase 3] Deduplication & Health Verification...');
  const verifiedCandidates = [];

  for (const candidate of candidates) {
    // 3.1 Check deduplication
    if (client.isDuplicate(candidate.url)) {
      continue;
    }

    // 3.2 Check domain health & parked status
    const health = await verifyDomainHealth(candidate.url);
    if (!health.ok) {
      continue;
    }

    verifiedCandidates.push({
      ...candidate,
      verifiedUrl: health.finalUrl || candidate.url,
    });

    if (verifiedCandidates.length >= options.limit * 3) {
      break; // Sufficient sample size for scoring
    }
  }

  console.log(`Candidates passing deduplication and live domain health: ${verifiedCandidates.length}`);

  // Step 4: Quality Scoring & Enrichment
  console.log('\n[Phase 4] AI Evaluation & Quality Scoring...');
  const evaluatedTools = [];

  for (const item of verifiedCandidates) {
    const evaluated = await evaluateCandidate(item);
    if (evaluated.qualityScore >= options.minScore) {
      evaluatedTools.push(evaluated);
    }
  }

  // Sort by highest quality score first
  evaluatedTools.sort((a, b) => b.qualityScore - a.qualityScore);
  const selectedTools = evaluatedTools.slice(0, options.limit);

  console.log(`High-value resources meeting score threshold (>= ${options.minScore}): ${selectedTools.length}`);

  // Step 5: Publishing or Dry-run Preview
  console.log('\n[Phase 5] Ingestion & Publishing...');
  let publishedCount = 0;

  for (let i = 0; i < selectedTools.length; i++) {
    const tool = selectedTools[i];
    console.log(`\n----------------------------------------------------`);
    console.log(`[Item #${i + 1}] ⭐ ${tool.qualityScore}/10 | ${tool.title}`);
    console.log(`URL:      ${tool.url}`);
    console.log(`Category: ${tool.category} | Pricing: ${tool.pricing}`);
    console.log(`Summary:  ${tool.description}`);
    console.log(`Tags:     ${tool.tags.join(', ')}`);

    const workflow = tool.qualityScore >= 8.0 ? generatePairedWorkflow(tool) : null;
    const prompt = tool.qualityScore >= 8.0 ? generatePairedPrompt(tool) : null;

    if (workflow) {
      console.log(`Workflow: "${workflow.title}" (${workflow.steps.length} steps)`);
    }
    if (prompt) {
      console.log(`Prompt:   "${prompt.title}"`);
    }

    if (options.publish) {
      try {
        console.log(`Publishing tool to Pilot API...`);
        const publishedTool = await client.publishTool({
          title: tool.title,
          url: tool.url,
          description: tool.description,
          category: tool.category,
          pricing: tool.pricing,
          provider: tool.provider,
          tags: tool.tags,
          kind: tool.kind,
          featured: tool.qualityScore >= 9.0,
        });

        let publishedWorkflow = null;
        let publishedPrompt = null;

        if (workflow && publishedTool?.id) {
          publishedWorkflow = await client.publishWorkflow(workflow, publishedTool.id);
        }

        if (prompt) {
          publishedPrompt = await client.publishPrompt(prompt);
        }

        publishedCount++;
        console.log(`✓ Published successfully! ID: ${publishedTool.id}`);

        // Notify Telegram if configured
        const notified = await notifier.notifyPublished(tool, publishedWorkflow, publishedPrompt);
        if (notified) {
          console.log(`📡 Telegram alert dispatched to admin channel.`);
        }
      } catch (err) {
        console.error(`✗ Publishing failed for "${tool.title}":`, err.message);
      }
    } else {
      console.log(`[DRY-RUN] Skipped publishing. Run with --publish to ingest into production.`);
    }
  }

  console.log('\n====================================================');
  console.log('🏁 CURATION PIPELINE COMPLETED');
  console.log(`Processed: ${selectedTools.length} tools`);
  if (options.publish) {
    console.log(`Published: ${publishedCount} new items to Pilot`);
  }
  console.log('====================================================\n');
}

runPipeline().catch((err) => {
  console.error('[FATAL] Pipeline execution failed:', err);
  process.exit(1);
});

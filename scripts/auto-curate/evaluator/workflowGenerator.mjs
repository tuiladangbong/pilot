/**
 * Workflow & Prompt Synthesis Module.
 * Automatically generates practical multi-step workflows and quickstart prompts
 * for top-tier developer tools (Quality Score >= 8.0).
 */

export function generatePairedWorkflow(tool) {
  const isMcp = tool.tags.includes('mcp') || tool.title.toLowerCase().includes('mcp') || tool.description.toLowerCase().includes('mcp');
  const isAgent = tool.category === 'Agents & Automation';

  let title = `Quickstart: Integrating ${tool.title} in Daily Workflows`;
  let purpose = `Set up and effectively leverage ${tool.title} to accelerate ${tool.category.toLowerCase()} tasks.`;
  let estimatedTime = '10-15 mins';
  let difficulty = 'beginner';

  let steps = [];

  if (isMcp) {
    title = `Connecting ${tool.title} via Model Context Protocol (MCP)`;
    purpose = `Wire ${tool.title} into Claude Desktop, Cursor, or Antigravity as an active MCP tool.`;
    difficulty = 'intermediate';
    steps = [
      {
        stepOrder: 1,
        title: 'Review Prerequisites & Clone Repository',
        instruction: `Ensure Node.js 20+ or Python 3.11+ is installed. Inspect ${tool.url} and check the configuration options.`,
        notes: 'Check environment variables such as API keys or connection strings.',
      },
      {
        stepOrder: 2,
        title: 'Add to MCP Configuration File',
        instruction: `Open your MCP configuration (e.g. claude_desktop_config.json) and register "${tool.title.toLowerCase().replace(/\s+/g, '-')}" under the "mcpServers" block.`,
        notes: 'Verify JSON syntax and restart your host client.',
      },
      {
        stepOrder: 3,
        title: 'Verify Tool Invocation',
        instruction: `In your AI chat assistant, ask: "List available tools from ${tool.title}" and perform a trial query.`,
        notes: 'Check logs if the client reports connection refused.',
      },
    ];
  } else if (isAgent) {
    title = `Autonomous Pipeline with ${tool.title}`;
    purpose = `Automate repetitive workflows using ${tool.title} agent specifications.`;
    steps = [
      {
        stepOrder: 1,
        title: 'Define Identity and Objective',
        instruction: `Establish the role, scope, and target boundaries for ${tool.title}. Access the portal at ${tool.url}.`,
        notes: 'Avoid unbounded broad goals; focus on specific input-output pairs.',
      },
      {
        stepOrder: 2,
        title: 'Supply Context & API Credentials',
        instruction: 'Configure the necessary system prompt and connect required tool integrations.',
        notes: 'Test locally with sandbox credentials first.',
      },
      {
        stepOrder: 3,
        title: 'Execute & Evaluate Output',
        instruction: 'Trigger a dry run, inspect intermediate steps, and refine prompt instructions based on execution traces.',
        notes: 'Ensure human-in-the-loop review for mutating operations.',
      },
    ];
  } else {
    steps = [
      {
        stepOrder: 1,
        title: 'Setup & Access',
        instruction: `Navigate to ${tool.url} and configure your local workspace or account credentials.`,
        notes: 'Check whether an open-source or free tier applies.',
      },
      {
        stepOrder: 2,
        title: 'Input Project Context',
        instruction: `Feed your initial requirements or codebase context into ${tool.title} to generate baseline output.`,
        notes: 'Provide clear, structured specifications for best results.',
      },
      {
        stepOrder: 3,
        title: 'Refine & Integrate',
        instruction: 'Review the generated output, run automated tests or formatting checks, and commit into production.',
        notes: 'Keep iterative feedback loops small and verifiable.',
      },
    ];
  }

  return {
    title,
    description: `A battle-tested recipe for getting maximum value out of ${tool.title}.`,
    purpose,
    status: 'active',
    difficulty,
    estimatedTime,
    tags: Array.from(new Set([...tool.tags, 'workflow', 'guide'])),
    steps,
  };
}

export function generatePairedPrompt(tool) {
  return {
    title: `Best-Practice Prompt for ${tool.title}`,
    description: `System prompt template designed to extract high-accuracy outputs using ${tool.title}.`,
    model: 'Universal',
    tags: Array.from(new Set([...tool.tags, 'system-prompt'])),
    content: `You are an expert specialist working with ${tool.title} (${tool.url}).
Your goal is to assist the user with high-leverage ${tool.category.toLowerCase()} tasks.

Guidelines:
1. Provide concise, clean, and production-ready code or output without unnecessary preamble.
2. Follow best practices and standard naming conventions for the target language or framework.
3. If information is ambiguous, ask targeted clarifying questions rather than guessing.
4. Always verify edge cases, error handling, and performance implications.`,
  };
}

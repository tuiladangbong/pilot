/**
 * Platform bindings for Cloudflare Workers.
 * Keeps Cloudflare-specific runtime types at the infrastructure boundary.
 */
export interface Env {
  DB: D1Database;
  ASSETS?: Fetcher;
  CURATOR_TOKEN?: string;
  ADMIN_TOKEN?: string;
  TRUST_CF_ACCESS?: string | boolean;
}

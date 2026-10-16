/**
 * D1 Health Check Adapter
 * Performs a real SQL query against Cloudflare D1 to verify connectivity.
 */
export async function checkDatabaseHealth(db: D1Database): Promise<{ ok: boolean; database: string }> {
  try {
    const result = await db.prepare('SELECT 1 as is_connected').first<{ is_connected: number }>();
    if (result && result.is_connected === 1) {
      return { ok: true, database: 'connected' };
    }
    return { ok: false, database: 'unexpected_result' };
  } catch (error) {
    return { ok: false, database: 'disconnected' };
  }
}

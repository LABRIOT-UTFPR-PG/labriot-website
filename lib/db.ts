import { Pool, type PoolConfig } from 'pg';

let _pool: Pool | null = null;

function resolveSslConfig(connectionString: string): PoolConfig['ssl'] {
  const sslEnv = process.env.DATABASE_SSL?.toLowerCase();
  if (sslEnv === 'false' || sslEnv === '0' || sslEnv === 'disable') {
    return false;
  }

  // Conexões locais/Docker internas geralmente não usam SSL
  const isLocalHost =
    connectionString.includes('@localhost') ||
    connectionString.includes('@127.0.0.1') ||
    connectionString.includes('@postgres:') ||
    connectionString.includes('@db:');

  if (isLocalHost && sslEnv !== 'true' && sslEnv !== 'require') {
    return false;
  }

  const rejectUnauthorized =
    process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false';

  return { rejectUnauthorized };
}

function getPool(): Pool {
  if (!_pool) {
    const connectionString =
      process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED;
    if (!connectionString) {
      throw new Error(
        '[db.ts] DATABASE_URL não definida. Verifique suas variáveis de ambiente.'
      );
    }
    _pool = new Pool({
      connectionString,
      ssl: resolveSslConfig(connectionString),
      max: Number(process.env.DATABASE_POOL_MAX || 10),
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  }
  return _pool;
}

export async function openDb() {
  return {
    all: async (query: string, params?: unknown[]) => {
      const result = await getPool().query(query, params);
      return result.rows;
    },

    get: async (query: string, params?: unknown[]) => {
      const result = await getPool().query(query, params);
      return result.rows[0] || null;
    },

    run: async (query: string, params?: unknown[]) => {
      const result = await getPool().query(query, params);
      return {
        lastID: result.rows[0]?.id || null,
        changes: result.rowCount || 0,
      };
    },

    exec: async (query: string) => {
      return getPool().query(query);
    },
  };
}

export async function closeDb() {
  if (_pool) {
    await _pool.end();
    _pool = null;
  }
}

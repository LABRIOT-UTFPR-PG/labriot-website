import { Pool } from 'pg';

// Pool criado de forma LAZY (na primeira chamada, não na importação do módulo).
// Isso garante que process.env.DATABASE_URL já está disponível, independentemente
// de quando o módulo foi importado (scripts, testes, etc).
let _pool: Pool | null = null;

function getPool(): Pool {
  if (!_pool) {
    const connectionString = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED;
    if (!connectionString) {
      throw new Error(
        '[db.ts] DATABASE_URL não definida. Verifique seu arquivo .env.local.'
      );
    }
    _pool = new Pool({
      connectionString,
      ssl: { rejectUnauthorized: false },
    });
  }
  return _pool;
}

export async function openDb() {
  return {
    all: async (query: string, params?: any[]) => {
      const result = await getPool().query(query, params);
      return result.rows;
    },

    get: async (query: string, params?: any[]) => {
      const result = await getPool().query(query, params);
      return result.rows[0] || null;
    },

    run: async (query: string, params?: any[]) => {
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
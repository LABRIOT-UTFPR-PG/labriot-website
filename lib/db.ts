import { Pool } from 'pg';

// Conexão com Neon usando a Connection String
const pool = new Pool({
  connectionString: process.env.DATABASE_URL_UNPOOLED,
  ssl: {
    rejectUnauthorized: false
  }
});

// Função para simular a API do SQLite usando PostgreSQL
export async function openDb() {
  return {
    // Simula db.all (retorna todas as linhas)
    all: async (query: string, params?: any[]) => {
      const result = await pool.query(query, params);
      return result.rows;
    },
    
    // Simula db.get (retorna apenas a primeira linha)
    get: async (query: string, params?: any[]) => {
      const result = await pool.query(query, params);
      return result.rows[0] || null;
    },

    // Simula db.run (para INSERT, UPDATE, DELETE)
    run: async (query: string, params?: any[]) => {
      const result = await pool.query(query, params);
      
      return {
        lastID: result.rows[0]?.id || null,
        changes: result.rowCount || 0
      };
    },

    // Função para executar scripts SQL puros
    exec: async (query: string) => {
      const result = await pool.query(query);
      return result;
    }
  };
}

// Função para fechar o pool (útil em testes)
export async function closeDb() {
  await pool.end();
}
import "server-only";
import { Pool } from 'pg';

// Criação do Pool de conexões PostgreSQL (mais eficiente que abrir/fechar toda hora)
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// Tratamento de erros do pool
pool.on('error', (err) => {
  console.error('Erro inesperado no pool do PostgreSQL:', err);
});

// Esta função simula a API do SQLite usando PostgreSQL
export async function openDb() {
  return {
    // Simula db.all (retorna todas as linhas)
    all: async <T = any>(query: string, params?: any[]): Promise<T[]> => {
      const result = await pool.query(query, params);
      return result.rows as T[];
    },
    
    // Simula db.get (retorna apenas a primeira linha)
    get: async <T = any>(query: string, params?: any[]): Promise<T | null> => {
      const result = await pool.query(query, params);
      if (result.rows.length > 0) {
        return result.rows[0] as T;
      }
      return null;
    },

    // Simula db.run (para INSERT, UPDATE, DELETE)
    // PostgreSQL precisa de RETURNING id para obter o ID inserido
    run: async (query: string, params?: any[]) => {
      // Se for um INSERT e não tiver RETURNING, adiciona automaticamente
      let finalQuery = query;
      if (query.trim().toUpperCase().startsWith('INSERT') && 
          !query.toUpperCase().includes('RETURNING')) {
        finalQuery = `${query} RETURNING id`;
      }
      
      const result = await pool.query(finalQuery, params);
      
      // Para INSERT com RETURNING id
      if (result.rows.length > 0 && result.rows[0].id) {
        return {
          lastID: result.rows[0].id,
          changes: result.rowCount || 0
        };
      }
      
      // Para UPDATE/DELETE ou INSERT sem id
      return {
        lastID: result.rows?.[0]?.id ?? null,
        changes: result.rowCount ?? 0,
      };
    },

    // Função extra caso precise rodar scripts puros
    exec: async (query: string) => {
      const result = await pool.query(query);
      return result;
    }
  };
}

// Função para fechar o pool (útil para testes ou shutdown graceful)
export async function closeDb() {
  await pool.end();
}
import mysql from 'mysql2/promise';

// Criação do Pool de conexões (mais eficiente que abrir/fechar toda hora)
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: Number(process.env.DB_PORT) || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Esta função simula a API do SQLite usando MySQL
export async function openDb() {
  return {
    // Simula db.all (retorna todas as linhas)
    all: async (query: string, params?: any[]) => {
      const [rows] = await pool.execute(query, params);
      return rows;
    },
    
    // Simula db.get (retorna apenas a primeira linha)
    get: async (query: string, params?: any[]) => {
      const [rows] = await pool.execute(query, params);
      if (Array.isArray(rows) && rows.length > 0) {
        return rows[0];
      }
      return null;
    },

    // Simula db.run (para INSERT, UPDATE, DELETE)
    // O SQLite retorna { lastID }, o MySQL retorna { insertId }. Aqui fazemos a conversão.
    run: async (query: string, params?: any[]) => {
      const [result] = await pool.execute(query, params);
      const header = result as any; // ResultSetHeader do mysql2
      
      return {
        lastID: header.insertId,
        changes: header.affectedRows
      };
    },

    // Função extra caso precise rodar scripts puros
    exec: async (query: string) => {
      const [result] = await pool.query(query);
      return result;
    }
  };
}
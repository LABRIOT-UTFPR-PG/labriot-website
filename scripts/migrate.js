import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED,
  ssl: {
    rejectUnauthorized: false
  }
});

async function migrate() {
  const client = await pool.connect();
  try {
    console.log("Iniciando migração...");
    
    // Adiciona coluna 'url' se não existir
    await client.query(`
      ALTER TABLE projects ADD COLUMN IF NOT EXISTS url TEXT;
    `);
    console.log("Coluna 'url' adicionada ou já existente.");

    // Adiciona coluna 'fullDescription' se não existir
    await client.query(`
      ALTER TABLE projects ADD COLUMN IF NOT EXISTS "fullDescription" TEXT;
    `);
    console.log("Coluna 'fullDescription' adicionada ou já existente.");
    
    console.log("Migração concluída com sucesso!");
  } catch (err) {
    console.error("Erro durante a migração:", err);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();

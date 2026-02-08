import pg from 'pg';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config({ path: '.env.local' });

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

async function initDb() {
  const client = await pool.connect();
  
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS team (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        role TEXT NOT NULL,
        specialization TEXT,
        category TEXT NOT NULL CHECK(category IN ('leadership', 'students')),
        image TEXT,
        linkedin TEXT
      );

      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL CHECK(status IN ('ongoing', 'completed')),
        startDate TEXT,
        endDate TEXT,
        image TEXT
      );

      CREATE TABLE IF NOT EXISTS research (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS publications (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        authors TEXT NOT NULL,
        journal TEXT,
        year INTEGER NOT NULL,
        doi TEXT,
        description TEXT
      );

      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        summary TEXT,
        content TEXT,
        author TEXT,
        date TEXT,
        image TEXT
      );
      
      CREATE TABLE IF NOT EXISTS events (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        date TEXT NOT NULL,
        time TEXT,
        location TEXT,
        status TEXT DEFAULT 'Próximo'
      );
    `);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin', salt);

    await client.query(
      `INSERT INTO users (username, password) 
       VALUES ($1, $2) 
       ON CONFLICT (username) DO NOTHING`,
      ['admin', hashedPassword]
    );

    console.log('✅ Banco de dados PostgreSQL inicializado com sucesso!');
    console.log('📝 Usuário admin criado (senha: admin)');
  } catch (error) {
    console.error('❌ Erro ao inicializar banco:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

initDb();
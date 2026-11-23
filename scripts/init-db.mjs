import pg from 'pg';
import bcrypt from 'bcryptjs';

try {
  const dotenv = await import('dotenv');
  dotenv.default.config({ path: '.env.local' });
  dotenv.default.config();
} catch {
  // Em produção (Docker), as variáveis já vêm injetadas no ambiente
}

const { Pool } = pg;

function resolveSsl(connectionString) {
  const sslEnv = (process.env.DATABASE_SSL || '').toLowerCase();
  if (sslEnv === 'false' || sslEnv === '0' || sslEnv === 'disable') return false;
  const isLocal =
    connectionString.includes('@localhost') ||
    connectionString.includes('@127.0.0.1') ||
    connectionString.includes('@postgres:') ||
    connectionString.includes('@db:');
  if (isLocal && sslEnv !== 'true' && sslEnv !== 'require') return false;
  return { rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false' };
}

const connectionString = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED;
if (!connectionString) {
  console.error('❌ DATABASE_URL não definida.');
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: resolveSsl(connectionString),
});

async function initDb() {
  const client = await pool.connect();
  try {
    console.log('Inicializando tabelas no PostgreSQL...');

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
        category TEXT NOT NULL DEFAULT 'Equipe',
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
        image TEXT,
        url TEXT,
        "fullDescription" TEXT
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

    console.log('✅ Tabelas criadas/verificadas com sucesso!');

    const initialUser = process.env.INITIAL_ADMIN_USER;
    const initialPassword = process.env.INITIAL_ADMIN_PASSWORD;

    if (initialUser && initialPassword) {
      if (initialPassword.length < 12) {
        console.warn('⚠️ INITIAL_ADMIN_PASSWORD deve ter pelo menos 12 caracteres. Usuário inicial não criado.');
      } else {
        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(initialPassword, salt);
        await client.query(
          `INSERT INTO users (username, password)
           VALUES ($1, $2)
           ON CONFLICT (username) DO NOTHING`,
          [initialUser, hashedPassword]
        );
        console.log(`✅ Admin inicial '${initialUser}' verificado/criado.`);
      }
    } else {
      console.log('ℹ️ Nenhum admin criado automaticamente. Use "pnpm admin:register" para criar um administrador com senha forte.');
    }
  } catch (err) {
    console.error('❌ Erro ao inicializar o banco de dados:', err);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
}

initDb();

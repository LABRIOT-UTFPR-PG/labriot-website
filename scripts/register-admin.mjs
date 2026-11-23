import pg from 'pg';
import bcrypt from 'bcryptjs';
import readline from 'readline';

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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function registerAdmin() {
  const client = await pool.connect();

  try {
    const username = (await question('Digite o nome de usuário: ')).trim();
    const password = await question('Digite a senha (mínimo 12 caracteres): ');

    if (!username || !password) {
      console.error('❌ Usuário e senha são obrigatórios.');
      return;
    }

    if (password.length < 12) {
      console.error('❌ A senha deve ter pelo menos 12 caracteres para segurança em produção.');
      return;
    }

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    await client.query(
      'INSERT INTO users (username, password) VALUES ($1, $2)',
      [username, hashedPassword]
    );

    console.log(`✅ Admin '${username}' registrado com sucesso!`);
  } catch (error) {
    if (error.code === '23505') {
      console.error('❌ Erro: Este nome de usuário já existe!');
    } else {
      console.error('❌ Erro ao registrar admin:', error);
    }
  } finally {
    client.release();
    await pool.end();
    rl.close();
  }
}

registerAdmin();

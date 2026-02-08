import pg from 'pg';
import bcrypt from 'bcryptjs';
import readline from 'readline';
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

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function registerAdmin() {
  const client = await pool.connect();
  
  try {
    const username = await question('Digite o nome de usuário: ');
    const password = await question('Digite a senha: ');

    if (!username || !password) {
      console.error('❌ Usuário e senha são obrigatórios.');
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await client.query(
      'INSERT INTO users (username, password) VALUES ($1, $2)',
      [username, hashedPassword]
    );

    console.log(`✅ Admin '${username}' registrado com sucesso!`);
  } catch (error) {
    if (error.code === '23505') { // PostgreSQL unique violation
      console.error(`❌ Erro: O usuário '${username}' já existe!`);
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
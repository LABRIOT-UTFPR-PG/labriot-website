import pg from 'pg';
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

async function removeAdmin() {
  const client = await pool.connect();
  
  try {
    const username = await question('Digite o nome de usuário a ser removido: ');

    if (!username) {
      console.error('❌ Nome de usuário é obrigatório.');
      return;
    }

    // Verifica se o usuário existe
    const result = await client.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    
    if (result.rows.length === 0) {
      console.log(`❌ O usuário '${username}' não foi encontrado.`);
      return;
    }

    // Deleta o usuário
    await client.query(
      'DELETE FROM users WHERE username = $1',
      [username]
    );
    
    console.log(`✅ Usuário '${username}' removido com sucesso!`);
    
  } catch (error) {
    console.error('❌ Erro ao remover usuário:', error);
  } finally {
    client.release();
    await pool.end();
    rl.close();
  }
}

removeAdmin();
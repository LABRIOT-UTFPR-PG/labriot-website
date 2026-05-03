import { readFileSync } from 'fs';
import { resolve } from 'path';
import readline from 'readline';
import { openDb } from '../lib/db.ts';
import bcrypt from 'bcryptjs';

// Carrega o .env.local ANTES de qualquer conexão com o banco.
// Com o pool lazy em lib/db.ts, isso funciona corretamente.
try {
  const envFile = readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8');
  for (const line of envFile.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    const value = trimmed.slice(eqIndex + 1).trim().replace(/^['"]|['"]$/g, '');
    if (!process.env[key]) process.env[key] = value;
  }
} catch {
  console.warn('Aviso: não foi possível carregar .env.local');
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function registerAdmin() {
  rl.question('Digite o nome de usuário: ', async (username) => {
    rl.question('Digite a senha: ', async (password) => {
      if (!username || !password) {
        console.error('Usuário e senha são obrigatórios.');
        rl.close();
        return;
      }

      const db = await openDb();
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      try {
        await db.run('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
        console.log(`Usuário '${username}' criado com sucesso.`);
      } catch (error) {
        if (error.code === '23505') {
          console.error(`Erro: O nome de usuário '${username}' já existe.`);
        } else {
          console.error('Ocorreu um erro:', error.message);
        }
      } finally {
        rl.close();
      }
    });
  });
}

registerAdmin();
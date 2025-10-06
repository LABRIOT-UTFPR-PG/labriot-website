import { openDb } from '../lib/db';
import bcrypt from 'bcryptjs';
import readline from 'readline';

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
        await db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword]);
        console.log(`Usuário '${username}' criado com sucesso.`);
      } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT') {
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
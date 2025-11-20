import { openDb } from '../lib/db';

async function removeAdmin() {
  try {
    const db = await openDb();
    
    // Verifica se o usuário existe antes de tentar deletar
    const user = await db.get("SELECT * FROM users WHERE username = 'admin'");
    
    if (!user) {
      console.log("O usuário 'admin' não foi encontrado.");
      return;
    }

    // Deleta o usuário
    await db.run("DELETE FROM users WHERE username = 'admin'");
    console.log("Usuário 'admin' removido com sucesso!");
    
  } catch (error) {
    console.error("Erro ao remover usuário:", error);
  }
}

removeAdmin();
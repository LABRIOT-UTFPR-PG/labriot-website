import { openDb } from './lib/db.js';
import bcrypt from 'bcryptjs';

async function initDb() {
  try {
    const db = await openDb();
    
    console.log('🔄 Iniciando criação das tabelas...');

    // Tabela de usuários
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Tabela users criada');

    // Tabela de membros da equipe
    await db.exec(`
      CREATE TABLE IF NOT EXISTS team (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        role VARCHAR(100) NOT NULL,
        specialization VARCHAR(300),
        category ENUM('leadership', 'students') NOT NULL,
        image TEXT,
        linkedin VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Tabela team criada');

    // Tabela de projetos
    await db.exec(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        status ENUM('Em andamento', 'Concluído', 'Planejado', 'Pausado') NOT NULL,
        startDate DATE,
        endDate DATE,
        image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Tabela projects criada');

    // Tabela de áreas de pesquisa
    await db.exec(`
      CREATE TABLE IF NOT EXISTS research (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Tabela research criada');

    // Tabela de publicações
    await db.exec(`
      CREATE TABLE IF NOT EXISTS publications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(500) NOT NULL,
        authors VARCHAR(500) NOT NULL,
        journal VARCHAR(200),
        year INT NOT NULL,
        doi VARCHAR(100),
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Tabela publications criada');

    // Tabela de posts do blog
    await db.exec(`
      CREATE TABLE IF NOT EXISTS posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        summary VARCHAR(500),
        content TEXT,
        author VARCHAR(100),
        date DATE,
        image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Tabela posts criada');

    // Tabela de eventos
    await db.exec(`
      CREATE TABLE IF NOT EXISTS events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        description TEXT,
        date DATE NOT NULL,
        time TIME,
        location VARCHAR(300),
        status VARCHAR(50) DEFAULT 'Próximo',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);
    console.log('✅ Tabela events criada');

    console.log('\n🔐 Criando usuário administrador...');

    // Criar usuário admin
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin', salt);

    // Verifica se o usuário admin já existe
    const existingAdmin = await db.get(
      'SELECT id FROM users WHERE username = ?',
      ['admin']
    );

    if (!existingAdmin) {
      await db.run(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        ['admin', hashedPassword]
      );
      console.log('✅ Usuário admin criado com sucesso');
      console.log('   Username: admin');
      console.log('   Password: admin');
      console.log('   ⚠️  IMPORTANTE: Altere a senha após o primeiro login!');
    } else {
      console.log('ℹ️  Usuário admin já existe');
    }

    console.log('\n✨ Banco de dados inicializado com sucesso!\n');

  } catch (error) {
    console.error('❌ Erro ao inicializar banco de dados:', error);
    process.exit(1);
  }
}

initDb();

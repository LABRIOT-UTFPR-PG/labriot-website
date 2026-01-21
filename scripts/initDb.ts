import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

async function initDb() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  await connection.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL
    );
    -- (demais tabelas aqui)
  `);

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash('admin', salt);

  await connection.query(
    'INSERT IGNORE INTO users (username, password) VALUES (?, ?)',
    ['admin', hashedPassword]
  );

  await connection.end();
}

initDb();

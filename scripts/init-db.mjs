import { openDb } from '../lib/db.js';
import bcrypt from 'bcryptjs';

async function initDb() {
  const db = await openDb();
  
  // PostgreSQL usa SERIAL ao invés de INTEGER PRIMARY KEY AUTOINCREMENT
  await db.exec(`
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

  // PostgreSQL usa ON CONFLICT ao invés de INSERT OR IGNORE
  await db.run(
    `INSERT INTO users (username, password) 
     VALUES ($1, $2) 
     ON CONFLICT (username) DO NOTHING`,
    ['admin', hashedPassword]
  );

  console.log('Banco de dados PostgreSQL inicializado com sucesso.');
}

initDb();
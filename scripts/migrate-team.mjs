import { readFileSync } from 'fs';
import { resolve } from 'path';

// Carrega o .env.local
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

import { openDb, closeDb } from '../lib/db.ts';

async function migrate() {
  const db = await openDb();
  try {
    // 1. Encontrar o nome da constraint
    const res = await db.all("SELECT constraint_name FROM information_schema.table_constraints WHERE table_name = 'team' AND constraint_type = 'CHECK'");
    if (res && res.length > 0) {
      for (const row of res) {
        console.log(`Removendo constraint: ${row.constraint_name}`);
        await db.exec(`ALTER TABLE team DROP CONSTRAINT ${row.constraint_name}`);
      }
      console.log('Restrição(ões) removida(s) com sucesso!');
    } else {
      console.log('Nenhuma restrição CHECK encontrada na tabela team.');
    }
  } catch (err) {
    console.error('Erro na migração:', err);
  } finally {
    await closeDb();
    process.exit(0);
  }
}

migrate();

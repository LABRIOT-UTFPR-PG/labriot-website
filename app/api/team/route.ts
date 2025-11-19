import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export async function GET() {
  const db = await openDb();
  const team = await db.all('SELECT * FROM team');
  return NextResponse.json(team);
}

export async function POST(request: Request) {
  const db = await openDb();
  const data = await request.json();
  // Adicionado linkedin na extração
  const { name, specialization, image, linkedin } = data;
  
  const role = "Pesquisador";
  const category = "students";

  const result = await db.run(
    'INSERT INTO team (name, role, specialization, category, image, linkedin) VALUES (?, ?, ?, ?, ?, ?)',
    [name, role, specialization, category, image, linkedin]
  );

  return NextResponse.json({ id: result.lastID, ...data, role, category });
}
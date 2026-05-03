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
  const { name, specialization, image, linkedin, category } = data;

  const role = "Pesquisador";
  // Se não enviarem, manter um fallback
  const finalCategory = category || "students";

  const result = await db.run(
    'INSERT INTO team (name, role, specialization, category, image, linkedin) VALUES ($1, $2, $3, $4, $5, $6)',
    [name, role, specialization, finalCategory, image, linkedin]
  );

  return NextResponse.json({ id: result.lastID, ...data, role, category: finalCategory });
}
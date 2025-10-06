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
  const { name, role, specialization, category, image } = data;

  const result = await db.run(
    'INSERT INTO team (name, role, specialization, category, image) VALUES (?, ?, ?, ?, ?)',
    [name, role, specialization, category, image]
  );

  return NextResponse.json({ id: result.lastID, ...data });
}

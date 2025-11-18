import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export async function GET() {
  const db = await openDb();
  // Ordena por data para mostrar os mais próximos primeiro
  const events = await db.all('SELECT * FROM events ORDER BY date ASC');
  return NextResponse.json(events);
}

export async function POST(request: Request) {
  const db = await openDb();
  const data = await request.json();
  const { title, description, date, time, location } = data;

  const result = await db.run(
    'INSERT INTO events (title, description, date, time, location) VALUES (?, ?, ?, ?, ?)',
    [title, description, date, time, location]
  );

  return NextResponse.json({ id: result.lastID, ...data });
}
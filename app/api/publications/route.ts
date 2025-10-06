import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export async function GET() {
  const db = await openDb();
  const publications = await db.all('SELECT * FROM publications ORDER BY year DESC');
  return NextResponse.json(publications);
}

export async function POST(request: Request) {
  const db = await openDb();
  const data = await request.json();
  const { title, authors, journal, year, doi, description } = data;

  const result = await db.run(
    'INSERT INTO publications (title, authors, journal, year, doi, description) VALUES (?, ?, ?, ?, ?, ?)',
    [title, authors, journal, year, doi, description]
  );

  return NextResponse.json({ id: result.lastID, ...data });
}
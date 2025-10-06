import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export async function GET() {
  const db = await openDb();
  const research = await db.all('SELECT * FROM research');
  return NextResponse.json(research);
}

export async function POST(request: Request) {
  const db = await openDb();
  const data = await request.json();
  const { title, description } = data;

  const result = await db.run(
    'INSERT INTO research (title, description) VALUES (?, ?)',
    [title, description]
  );

  return NextResponse.json({ id: result.lastID, ...data });
}
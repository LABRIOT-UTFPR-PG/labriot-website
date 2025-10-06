import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export async function GET() {
  const db = await openDb();
  const posts = await db.all('SELECT * FROM posts ORDER BY date DESC');
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const db = await openDb();
  const data = await request.json();
  const { title, summary, content, author, date, image } = data;

  const result = await db.run(
    'INSERT INTO posts (title, summary, content, author, date, image) VALUES (?, ?, ?, ?, ?, ?)',
    [title, summary, content, author, date, image]
  );

  return NextResponse.json({ id: result.lastID, ...data });
}
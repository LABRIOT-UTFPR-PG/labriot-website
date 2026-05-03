import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export async function GET() {
  const db = await openDb();
  const projects = await db.all('SELECT * FROM projects');
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const db = await openDb();
  const data = await request.json();
  const { title, description, status, startDate, endDate, image } = data;

  const result = await db.run(
    'INSERT INTO projects (title, description, status, startDate, endDate, image) VALUES ($1, $2, $3, $4, $5, $6)',
    [title, description, status, startDate, endDate, image]
  );

  return NextResponse.json({ id: result.lastID, ...data });
}
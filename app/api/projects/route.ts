import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export async function GET() {
  const db = await openDb();
  const projects = await db.all('SELECT id, title, description, status, startdate AS "startDate", enddate AS "endDate", image, url, "fullDescription" FROM projects');
  return NextResponse.json(projects);
}

export async function POST(request: Request) {
  const db = await openDb();
  const data = await request.json();
  const { title, description, status, startDate, endDate, image, url, fullDescription } = data;

  const result = await db.run(
    'INSERT INTO projects (title, description, status, startDate, endDate, image, url, "fullDescription") VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
    [title, description, status, startDate, endDate, image, url, fullDescription]
  );

  return NextResponse.json({ id: result.lastID, ...data });
}
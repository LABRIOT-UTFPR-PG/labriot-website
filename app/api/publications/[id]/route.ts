import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export async function GET(request: Request, context: { params: { id: string } }) {
  const db = await openDb();
  const publication = await db.get('SELECT * FROM publications WHERE id = $1', [context.params.id]);
  if (!publication) {
    return new Response('Publicação não encontrada', { status: 404 });
  }
  return NextResponse.json(publication);
}

export async function PUT(request: Request, context: { params: { id: string } }) {
  const db = await openDb();
  const data = await request.json();
  const { title, authors, journal, year, doi } = data;

  await db.run(
    'UPDATE publications SET title = $1, authors = $2, journal = $3, year = $4, doi = $5 WHERE id = $6',
    [title, authors, journal, year, doi, context.params.id]
  );

  return NextResponse.json({ id: context.params.id, ...data });
}

export async function DELETE(request: Request, context: { params: { id: string } }) {
  const db = await openDb();
  await db.run('DELETE FROM publications WHERE id = $1', [context.params.id]);
  return new Response(null, { status: 204 });
}
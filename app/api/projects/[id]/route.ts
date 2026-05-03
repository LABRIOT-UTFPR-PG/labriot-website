import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export async function GET(request: Request, context: { params: { id: string } }) {
  const db = await openDb();
  const project = await db.get('SELECT * FROM projects WHERE id = $1', [context.params.id]);
  if (!project) {
    return new Response('Projeto não encontrado', { status: 404 });
  }
  return NextResponse.json(project);
}

export async function PUT(request: Request, context: { params: { id: string } }) {
  const db = await openDb();
  const data = await request.json();
  const { title, description, status, startDate, endDate, image } = data;

  await db.run(
    'UPDATE projects SET title = $1, description = $2, status = $3, startDate = $4, endDate = $5, image = $6 WHERE id = $7',
    [title, description, status, startDate, endDate, image, context.params.id]
  );

  return NextResponse.json({ id: context.params.id, ...data });
}

export async function DELETE(request: Request, context: { params: { id: string } }) {
  const db = await openDb();
  await db.run('DELETE FROM projects WHERE id = $1', [context.params.id]);
  return new Response(null, { status: 204 });
}
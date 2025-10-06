import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export async function GET(request: Request, context: { params: { id: string } }) {
  const db = await openDb();
  const post = await db.get('SELECT * FROM posts WHERE id = ?', [context.params.id]);
  if (!post) {
    return new Response('Post não encontrado', { status: 404 });
  }
  return NextResponse.json(post);
}

export async function PUT(request: Request, context: { params: { id: string } }) {
  const db = await openDb();
  const data = await request.json();
  const { title, summary, content, author, date, image } = data;

  await db.run(
    'UPDATE posts SET title = ?, summary = ?, content = ?, author = ?, date = ?, image = ? WHERE id = ?',
    [title, summary, content, author, date, image, context.params.id]
  );

  return NextResponse.json({ id: context.params.id, ...data });
}

export async function DELETE(request: Request, context: { params: { id: string } }) {
  const db = await openDb();
  await db.run('DELETE FROM posts WHERE id = ?', [context.params.id]);
  return new Response(null, { status: 204 });
}
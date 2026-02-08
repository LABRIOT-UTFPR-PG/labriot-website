import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

// Buscar um evento específico para preencher o formulário de edição
export async function GET(request: Request, context: { params: { id: string } }) {
  const db = await openDb();
  const event = await db.get('SELECT * FROM events WHERE id = $1', [context.params.id]);
  
  if (!event) {
    return new Response('Evento não encontrado', { status: 404 });
  }
  
  return NextResponse.json(event);
}

// Atualizar um evento (PUT)
export async function PUT(request: Request, context: { params: { id: string } }) {
  const db = await openDb();
  const data = await request.json();
  const { title, description, date, time, location } = data;

  await db.run(
    'UPDATE events SET title = $1, description = $2, date = $3, time = $4, location = $5 WHERE id = $6',
    [title, description, date, time, location, context.params.id]
  );

  return NextResponse.json({ id: context.params.id, ...data });
}

// Deletar um evento (DELETE)
export async function DELETE(request: Request, context: { params: { id: string } }) {
  const db = await openDb();
  await db.run('DELETE FROM events WHERE id = $1', [context.params.id]);
  return new Response(null, { status: 204 });
}
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

// GET por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const db = await openDb();

  const event = await db.get(
    'SELECT * FROM events WHERE id = ?',
    [params.id]
  );

  if (!event) {
    return new Response('Evento não encontrado', { status: 404 });
  }

  return NextResponse.json(event);
}

// PUT
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const db = await openDb();
  const data = await request.json();

  const { title, description, date, time, location } = data;

  await db.run(
    `UPDATE events
     SET title = ?, description = ?, date = ?, time = ?, location = ?
     WHERE id = ?`,
    [title, description, date, time, location, params.id]
  );

  return NextResponse.json({
    id: params.id,
    ...data,
  });
}

// DELETE
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const db = await openDb();

  await db.run(
    'DELETE FROM events WHERE id = ?',
    [params.id]
  );

  return new Response(null, { status: 204 });
}

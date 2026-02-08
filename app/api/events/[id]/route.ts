export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

// Interface para o evento
interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
}

// GET por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await openDb();

    const event = await db.get<Event>(
      'SELECT * FROM events WHERE id = ?',
      [params.id]
    );

    if (!event) {
      return NextResponse.json(
        { message: 'Evento não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar evento' },
      { status: 500 }
    );
  }
}

// PUT
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await openDb();
    const data = await request.json();

    const { title, description, date, time, location } = data;

    // Validação básica
    if (!title || !description || !date || !time || !location) {
      return NextResponse.json(
        { message: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    // Verifica se o evento existe antes de atualizar
    const existingEvent = await db.get<Event>(
      'SELECT id FROM events WHERE id = ?',
      [params.id]
    );

    if (!existingEvent) {
      return NextResponse.json(
        { message: 'Evento não encontrado' },
        { status: 404 }
      );
    }

    const result = await db.run(
      `UPDATE events
       SET title = ?, description = ?, date = ?, time = ?, location = ?
       WHERE id = ?`,
      [title, description, date, time, location, params.id]
    );

    return NextResponse.json({
      id: params.id,
      ...data,
      message: 'Evento atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    return NextResponse.json(
      { message: 'Erro ao atualizar evento' },
      { status: 500 }
    );
  }
}

// DELETE
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = await openDb();

    // Verifica se o evento existe antes de deletar
    const existingEvent = await db.get<Event>(
      'SELECT id FROM events WHERE id = ?',
      [params.id]
    );

    if (!existingEvent) {
      return NextResponse.json(
        { message: 'Evento não encontrado' },
        { status: 404 }
      );
    }

    await db.run(
      'DELETE FROM events WHERE id = ?',
      [params.id]
    );

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Erro ao deletar evento:', error);
    return NextResponse.json(
      { message: 'Erro ao deletar evento' },
      { status: 500 }
    );
  }
}
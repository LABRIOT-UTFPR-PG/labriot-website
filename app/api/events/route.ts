export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
}


export async function GET() {
  try {
    const db = await openDb();

    const events = await db.all<Event>(
      'SELECT * FROM events ORDER BY date ASC'
    );

    return NextResponse.json(events);
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar eventos' },
      { status: 500 }
    );
  }
}
export async function POST(request: Request) {
  try {
    const db = await openDb();
    const data = await request.json();

    const { title, description, date, time, location } = data;

    // Validação de campos obrigatórios
    if (!title || !description || !date || !time) {
      return NextResponse.json(
        { message: 'Campos obrigatórios: title, description, date, time' },
        { status: 400 }
      );
    }

    // Validação do formato da data (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { message: 'Formato de data inválido. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Validação do formato do horário (HH:MM)
    const timeRegex = /^\d{2}:\d{2}$/;
    if (!timeRegex.test(time)) {
      return NextResponse.json(
        { message: 'Formato de horário inválido. Use HH:MM' },
        { status: 400 }
      );
    }

    const result = await db.run(
      'INSERT INTO events (title, description, date, time, location) VALUES (?, ?, ?, ?, ?)',
      [title, description, date, time, location || '']
    );

    return NextResponse.json(
      {
        id: result.lastID,
        title,
        description,
        date,
        time,
        location: location || '',
        message: 'Evento criado com sucesso'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    return NextResponse.json(
      { message: 'Erro ao criar evento' },
      { status: 500 }
    );
  }
}
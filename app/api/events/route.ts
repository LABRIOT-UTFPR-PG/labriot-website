import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { eventSchema } from '@/lib/validation';

export async function GET() {
  try {
    const db = await openDb();
    const events = await db.all('SELECT * FROM events ORDER BY date ASC');
    return NextResponse.json(events);
  } catch (error) {
    console.error('[api/events] Erro ao listar eventos:', error);
    return NextResponse.json({ error: 'Erro ao carregar eventos.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    const parsed = eventSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos.', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, description, date, time, location } = parsed.data;
    const db = await openDb();
    const result = await db.run(
      'INSERT INTO events (title, description, date, time, location) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [title, description, date, time, location]
    );

    return NextResponse.json({ id: result.lastID, ...parsed.data }, { status: 201 });
  } catch (error) {
    console.error('[api/events] Erro ao criar evento:', error);
    return NextResponse.json({ error: 'Erro ao criar evento.' }, { status: 500 });
  }
}

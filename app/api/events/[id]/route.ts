import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { eventSchema, parseNumericId } from '@/lib/validation';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id: rawId } = await context.params;
  const id = parseNumericId(rawId);
  if (!id) {
    return NextResponse.json({ error: 'ID inválido.' }, { status: 400 });
  }

  try {
    const db = await openDb();
    const event = await db.get('SELECT * FROM events WHERE id = $1', [id]);
    if (!event) {
      return NextResponse.json({ error: 'Evento não encontrado.' }, { status: 404 });
    }
    return NextResponse.json(event);
  } catch (error) {
    console.error('[api/events/[id]] Erro ao buscar evento:', error);
    return NextResponse.json({ error: 'Erro ao carregar evento.' }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const { id: rawId } = await context.params;
  const id = parseNumericId(rawId);
  if (!id) {
    return NextResponse.json({ error: 'ID inválido.' }, { status: 400 });
  }

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
      'UPDATE events SET title = $1, description = $2, date = $3, time = $4, location = $5 WHERE id = $6',
      [title, description, date, time, location, id]
    );

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Evento não encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ id, ...parsed.data });
  } catch (error) {
    console.error('[api/events/[id]] Erro ao atualizar evento:', error);
    return NextResponse.json({ error: 'Erro ao atualizar evento.' }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  const { id: rawId } = await context.params;
  const id = parseNumericId(rawId);
  if (!id) {
    return NextResponse.json({ error: 'ID inválido.' }, { status: 400 });
  }

  try {
    const db = await openDb();
    await db.run('DELETE FROM events WHERE id = $1', [id]);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('[api/events/[id]] Erro ao excluir evento:', error);
    return NextResponse.json({ error: 'Erro ao excluir evento.' }, { status: 500 });
  }
}

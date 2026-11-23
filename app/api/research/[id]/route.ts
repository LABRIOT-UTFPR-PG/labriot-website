import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { parseNumericId, researchSchema } from '@/lib/validation';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id: rawId } = await context.params;
  const id = parseNumericId(rawId);
  if (!id) {
    return NextResponse.json({ error: 'ID inválido.' }, { status: 400 });
  }

  try {
    const db = await openDb();
    const research = await db.get('SELECT * FROM research WHERE id = $1', [id]);
    if (!research) {
      return NextResponse.json({ error: 'Área de pesquisa não encontrada.' }, { status: 404 });
    }
    return NextResponse.json(research);
  } catch (error) {
    console.error('[api/research/[id]] Erro ao buscar área de pesquisa:', error);
    return NextResponse.json({ error: 'Erro ao carregar área de pesquisa.' }, { status: 500 });
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
    const parsed = researchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos.', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, description } = parsed.data;
    const db = await openDb();
    const result = await db.run(
      'UPDATE research SET title = $1, description = $2 WHERE id = $3',
      [title, description, id]
    );

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Área de pesquisa não encontrada.' }, { status: 404 });
    }

    return NextResponse.json({ id, ...parsed.data });
  } catch (error) {
    console.error('[api/research/[id]] Erro ao atualizar área de pesquisa:', error);
    return NextResponse.json({ error: 'Erro ao atualizar área de pesquisa.' }, { status: 500 });
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
    await db.run('DELETE FROM research WHERE id = $1', [id]);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('[api/research/[id]] Erro ao excluir área de pesquisa:', error);
    return NextResponse.json({ error: 'Erro ao excluir área de pesquisa.' }, { status: 500 });
  }
}

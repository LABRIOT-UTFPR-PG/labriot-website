import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { parseNumericId, publicationSchema } from '@/lib/validation';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id: rawId } = await context.params;
  const id = parseNumericId(rawId);
  if (!id) {
    return NextResponse.json({ error: 'ID inválido.' }, { status: 400 });
  }

  try {
    const db = await openDb();
    const publication = await db.get('SELECT * FROM publications WHERE id = $1', [id]);
    if (!publication) {
      return NextResponse.json({ error: 'Publicação não encontrada.' }, { status: 404 });
    }
    return NextResponse.json(publication);
  } catch (error) {
    console.error('[api/publications/[id]] Erro ao buscar publicação:', error);
    return NextResponse.json({ error: 'Erro ao carregar publicação.' }, { status: 500 });
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
    const parsed = publicationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos.', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, authors, journal, year, doi, description } = parsed.data;
    const db = await openDb();
    const result = await db.run(
      'UPDATE publications SET title = $1, authors = $2, journal = $3, year = $4, doi = $5, description = $6 WHERE id = $7',
      [title, authors, journal, year, doi, description, id]
    );

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Publicação não encontrada.' }, { status: 404 });
    }

    return NextResponse.json({ id, ...parsed.data });
  } catch (error) {
    console.error('[api/publications/[id]] Erro ao atualizar publicação:', error);
    return NextResponse.json({ error: 'Erro ao atualizar publicação.' }, { status: 500 });
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
    await db.run('DELETE FROM publications WHERE id = $1', [id]);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('[api/publications/[id]] Erro ao excluir publicação:', error);
    return NextResponse.json({ error: 'Erro ao excluir publicação.' }, { status: 500 });
  }
}

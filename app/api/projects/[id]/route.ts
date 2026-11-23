import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { parseNumericId, projectSchema } from '@/lib/validation';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id: rawId } = await context.params;
  const id = parseNumericId(rawId);
  if (!id) {
    return NextResponse.json({ error: 'ID inválido.' }, { status: 400 });
  }

  try {
    const db = await openDb();
    const project = await db.get(
      'SELECT id, title, description, status, startdate AS "startDate", enddate AS "endDate", image, url, "fullDescription" FROM projects WHERE id = $1',
      [id]
    );
    if (!project) {
      return NextResponse.json({ error: 'Projeto não encontrado.' }, { status: 404 });
    }
    return NextResponse.json(project);
  } catch (error) {
    console.error('[api/projects/[id]] Erro ao buscar projeto:', error);
    return NextResponse.json({ error: 'Erro ao carregar projeto.' }, { status: 500 });
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
    const parsed = projectSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos.', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, description, status, startDate, endDate, image, url, fullDescription } =
      parsed.data;
    const db = await openDb();
    const result = await db.run(
      'UPDATE projects SET title = $1, description = $2, status = $3, startDate = $4, endDate = $5, image = $6, url = $7, "fullDescription" = $8 WHERE id = $9',
      [title, description, status, startDate, endDate, image, url, fullDescription, id]
    );

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Projeto não encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ id, ...parsed.data });
  } catch (error) {
    console.error('[api/projects/[id]] Erro ao atualizar projeto:', error);
    return NextResponse.json({ error: 'Erro ao atualizar projeto.' }, { status: 500 });
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
    await db.run('DELETE FROM projects WHERE id = $1', [id]);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('[api/projects/[id]] Erro ao excluir projeto:', error);
    return NextResponse.json({ error: 'Erro ao excluir projeto.' }, { status: 500 });
  }
}

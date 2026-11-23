import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { parseNumericId, teamSchema } from '@/lib/validation';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id: rawId } = await context.params;
  const id = parseNumericId(rawId);
  if (!id) {
    return NextResponse.json({ error: 'ID inválido.' }, { status: 400 });
  }

  try {
    const db = await openDb();
    const member = await db.get('SELECT * FROM team WHERE id = $1', [id]);
    if (!member) {
      return NextResponse.json({ error: 'Membro não encontrado.' }, { status: 404 });
    }
    return NextResponse.json(member);
  } catch (error) {
    console.error('[api/team/[id]] Erro ao buscar membro:', error);
    return NextResponse.json({ error: 'Erro ao carregar membro.' }, { status: 500 });
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
    const parsed = teamSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos.', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, specialization, image, linkedin, category } = parsed.data;
    const role = 'Pesquisador';
    const finalCategory = category || 'Equipe';

    const db = await openDb();
    const result = await db.run(
      'UPDATE team SET name = $1, role = $2, specialization = $3, category = $4, image = $5, linkedin = $6 WHERE id = $7',
      [name, role, specialization, finalCategory, image, linkedin, id]
    );

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Membro não encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ id, ...parsed.data, role, category: finalCategory });
  } catch (error) {
    console.error('[api/team/[id]] Erro ao atualizar membro:', error);
    return NextResponse.json({ error: 'Erro ao atualizar membro.' }, { status: 500 });
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
    await db.run('DELETE FROM team WHERE id = $1', [id]);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('[api/team/[id]] Erro ao excluir membro:', error);
    return NextResponse.json({ error: 'Erro ao excluir membro.' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { parseNumericId, postSchema } from '@/lib/validation';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id: rawId } = await context.params;
  const id = parseNumericId(rawId);
  if (!id) {
    return NextResponse.json({ error: 'ID inválido.' }, { status: 400 });
  }

  try {
    const db = await openDb();
    const post = await db.get('SELECT * FROM posts WHERE id = $1', [id]);
    if (!post) {
      return NextResponse.json({ error: 'Post não encontrado.' }, { status: 404 });
    }
    return NextResponse.json(post);
  } catch (error) {
    console.error('[api/posts/[id]] Erro ao buscar post:', error);
    return NextResponse.json({ error: 'Erro ao carregar post.' }, { status: 500 });
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
    const parsed = postSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos.', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, summary, content, author, date, image } = parsed.data;
    const db = await openDb();
    const result = await db.run(
      'UPDATE posts SET title = $1, summary = $2, content = $3, author = $4, date = $5, image = $6 WHERE id = $7',
      [title, summary, content, author, date, image, id]
    );

    if (result.changes === 0) {
      return NextResponse.json({ error: 'Post não encontrado.' }, { status: 404 });
    }

    return NextResponse.json({ id, ...parsed.data });
  } catch (error) {
    console.error('[api/posts/[id]] Erro ao atualizar post:', error);
    return NextResponse.json({ error: 'Erro ao atualizar post.' }, { status: 500 });
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
    await db.run('DELETE FROM posts WHERE id = $1', [id]);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('[api/posts/[id]] Erro ao excluir post:', error);
    return NextResponse.json({ error: 'Erro ao excluir post.' }, { status: 500 });
  }
}

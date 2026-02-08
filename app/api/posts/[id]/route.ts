export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

// Interface para o post
interface Post {
  id: number;
  title: string;
  summary: string;
  content: string;
  author: string;
  date: string;
  image?: string;
}

// Interface para o contexto de params (Next.js 15+)
interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET por ID
export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const db = await openDb();

    const post = await db.get<Post>(
      'SELECT * FROM posts WHERE id = ?',
      [id]
    );

    if (!post) {
      return NextResponse.json(
        { message: 'Post não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(post);
  } catch (error) {
    console.error('Erro ao buscar post:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar post' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar post
export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const db = await openDb();
    const data = await request.json();

    const { title, summary, content, author, date, image } = data;

    // Validação de campos obrigatórios
    if (!title || !summary || !content || !author || !date) {
      return NextResponse.json(
        { message: 'Campos obrigatórios: title, summary, content, author, date' },
        { status: 400 }
      );
    }

    // Verifica se o post existe antes de atualizar
    const existingPost = await db.get<Post>(
      'SELECT id FROM posts WHERE id = ?',
      [id]
    );

    if (!existingPost) {
      return NextResponse.json(
        { message: 'Post não encontrado' },
        { status: 404 }
      );
    }

    await db.run(
      'UPDATE posts SET title = ?, summary = ?, content = ?, author = ?, date = ?, image = ? WHERE id = ?',
      [title, summary, content, author, date, image || null, id]
    );

    return NextResponse.json({
      id,
      ...data,
      message: 'Post atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar post:', error);
    return NextResponse.json(
      { message: 'Erro ao atualizar post' },
      { status: 500 }
    );
  }
}

// DELETE - Deletar post
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const db = await openDb();

    // Verifica se o post existe antes de deletar
    const existingPost = await db.get<Post>(
      'SELECT id FROM posts WHERE id = ?',
      [id]
    );

    if (!existingPost) {
      return NextResponse.json(
        { message: 'Post não encontrado' },
        { status: 404 }
      );
    }

    await db.run('DELETE FROM posts WHERE id = ?', [id]);

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Erro ao deletar post:', error);
    return NextResponse.json(
      { message: 'Erro ao deletar post' },
      { status: 500 }
    );
  }
}
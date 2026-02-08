export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

// Interface para a área de pesquisa
interface Research {
  id: number;
  title: string;
  description: string;
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

    const research = await db.get<Research>(
      'SELECT * FROM research WHERE id = ?',
      [id]
    );

    if (!research) {
      return NextResponse.json(
        { message: 'Área de pesquisa não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(research);
  } catch (error) {
    console.error('Erro ao buscar área de pesquisa:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar área de pesquisa' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar área de pesquisa
export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const db = await openDb();
    const data = await request.json();

    const { title, description } = data;

    // Validação de campos obrigatórios
    if (!title || !description) {
      return NextResponse.json(
        { message: 'Campos obrigatórios: title, description' },
        { status: 400 }
      );
    }

    // Validação de tamanho dos campos
    if (title.length > 200) {
      return NextResponse.json(
        { message: 'O título deve ter no máximo 200 caracteres' },
        { status: 400 }
      );
    }

    if (description.length > 2000) {
      return NextResponse.json(
        { message: 'A descrição deve ter no máximo 2000 caracteres' },
        { status: 400 }
      );
    }

    // Verifica se a área de pesquisa existe antes de atualizar
    const existingResearch = await db.get<Research>(
      'SELECT id FROM research WHERE id = ?',
      [id]
    );

    if (!existingResearch) {
      return NextResponse.json(
        { message: 'Área de pesquisa não encontrada' },
        { status: 404 }
      );
    }

    await db.run(
      'UPDATE research SET title = ?, description = ? WHERE id = ?',
      [title, description, id]
    );

    return NextResponse.json({
      id,
      title,
      description,
      message: 'Área de pesquisa atualizada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar área de pesquisa:', error);
    return NextResponse.json(
      { message: 'Erro ao atualizar área de pesquisa' },
      { status: 500 }
    );
  }
}

// DELETE - Deletar área de pesquisa
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const db = await openDb();

    // Verifica se a área de pesquisa existe antes de deletar
    const existingResearch = await db.get<Research>(
      'SELECT id FROM research WHERE id = ?',
      [id]
    );

    if (!existingResearch) {
      return NextResponse.json(
        { message: 'Área de pesquisa não encontrada' },
        { status: 404 }
      );
    }

    await db.run('DELETE FROM research WHERE id = ?', [id]);

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Erro ao deletar área de pesquisa:', error);
    return NextResponse.json(
      { message: 'Erro ao deletar área de pesquisa' },
      { status: 500 }
    );
  }
}
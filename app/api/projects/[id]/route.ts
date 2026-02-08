export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

// Interface para o projeto
interface Project {
  id: number;
  title: string;
  description: string;
  status: string;
  startDate: string;
  endDate?: string;
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

    const project = await db.get<Project>(
      'SELECT * FROM projects WHERE id = ?',
      [id]
    );

    if (!project) {
      return NextResponse.json(
        { message: 'Projeto não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error('Erro ao buscar projeto:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar projeto' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar projeto
export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const db = await openDb();
    const data = await request.json();

    const { title, description, status, startDate, endDate, image } = data;

    // Validação de campos obrigatórios
    if (!title || !description || !status || !startDate) {
      return NextResponse.json(
        { message: 'Campos obrigatórios: title, description, status, startDate' },
        { status: 400 }
      );
    }

    // Validação dos status permitidos
    const validStatuses = ['Em andamento', 'Concluído', 'Planejado', 'Pausado'];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { message: `Status inválido. Use: ${validStatuses.join(', ')}` },
        { status: 400 }
      );
    }

    // Validação do formato das datas (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(startDate)) {
      return NextResponse.json(
        { message: 'Formato de startDate inválido. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    if (endDate && !dateRegex.test(endDate)) {
      return NextResponse.json(
        { message: 'Formato de endDate inválido. Use YYYY-MM-DD' },
        { status: 400 }
      );
    }

    // Validação: endDate deve ser posterior a startDate
    if (endDate && new Date(endDate) < new Date(startDate)) {
      return NextResponse.json(
        { message: 'A data de término deve ser posterior à data de início' },
        { status: 400 }
      );
    }

    // Verifica se o projeto existe antes de atualizar
    const existingProject = await db.get<Project>(
      'SELECT id FROM projects WHERE id = ?',
      [id]
    );

    if (!existingProject) {
      return NextResponse.json(
        { message: 'Projeto não encontrado' },
        { status: 404 }
      );
    }

    await db.run(
      'UPDATE projects SET title = ?, description = ?, status = ?, startDate = ?, endDate = ?, image = ? WHERE id = ?',
      [title, description, status, startDate, endDate || null, image || null, id]
    );

    return NextResponse.json({
      id,
      ...data,
      message: 'Projeto atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar projeto:', error);
    return NextResponse.json(
      { message: 'Erro ao atualizar projeto' },
      { status: 500 }
    );
  }
}

// DELETE - Deletar projeto
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const db = await openDb();

    // Verifica se o projeto existe antes de deletar
    const existingProject = await db.get<Project>(
      'SELECT id FROM projects WHERE id = ?',
      [id]
    );

    if (!existingProject) {
      return NextResponse.json(
        { message: 'Projeto não encontrado' },
        { status: 404 }
      );
    }

    await db.run('DELETE FROM projects WHERE id = ?', [id]);

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Erro ao deletar projeto:', error);
    return NextResponse.json(
      { message: 'Erro ao deletar projeto' },
      { status: 500 }
    );
  }
}
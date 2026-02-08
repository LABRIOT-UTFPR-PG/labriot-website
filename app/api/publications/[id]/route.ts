export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

// Interface para a publicação
interface Publication {
  id: number;
  title: string;
  authors: string;
  journal: string;
  year: number;
  doi?: string;
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

    const publication = await db.get<Publication>(
      'SELECT * FROM publications WHERE id = ?',
      [id]
    );

    if (!publication) {
      return NextResponse.json(
        { message: 'Publicação não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(publication);
  } catch (error) {
    console.error('Erro ao buscar publicação:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar publicação' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar publicação
export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const db = await openDb();
    const data = await request.json();

    const { title, authors, journal, year, doi } = data;

    // Validação de campos obrigatórios
    if (!title || !authors || !journal || !year) {
      return NextResponse.json(
        { message: 'Campos obrigatórios: title, authors, journal, year' },
        { status: 400 }
      );
    }

    // Validação do ano
    const currentYear = new Date().getFullYear();
    const yearNum = parseInt(year);
    
    if (isNaN(yearNum) || yearNum < 1900 || yearNum > currentYear + 1) {
      return NextResponse.json(
        { message: `O ano deve estar entre 1900 e ${currentYear + 1}` },
        { status: 400 }
      );
    }

    // Validação do formato do DOI (opcional, mas se fornecido deve ser válido)
    if (doi) {
      const doiRegex = /^10\.\d{4,9}\/[-._;()/:A-Z0-9]+$/i;
      if (!doiRegex.test(doi)) {
        return NextResponse.json(
          { message: 'Formato de DOI inválido. Exemplo: 10.1234/example' },
          { status: 400 }
        );
      }
    }

    // Validação de tamanho dos campos
    if (title.length > 500) {
      return NextResponse.json(
        { message: 'O título deve ter no máximo 500 caracteres' },
        { status: 400 }
      );
    }

    if (authors.length > 500) {
      return NextResponse.json(
        { message: 'O campo de autores deve ter no máximo 500 caracteres' },
        { status: 400 }
      );
    }

    // Verifica se a publicação existe antes de atualizar
    const existingPublication = await db.get<Publication>(
      'SELECT id FROM publications WHERE id = ?',
      [id]
    );

    if (!existingPublication) {
      return NextResponse.json(
        { message: 'Publicação não encontrada' },
        { status: 404 }
      );
    }

    await db.run(
      'UPDATE publications SET title = ?, authors = ?, journal = ?, year = ?, doi = ? WHERE id = ?',
      [title, authors, journal, yearNum, doi || null, id]
    );

    return NextResponse.json({
      id,
      title,
      authors,
      journal,
      year: yearNum,
      doi: doi || null,
      message: 'Publicação atualizada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar publicação:', error);
    return NextResponse.json(
      { message: 'Erro ao atualizar publicação' },
      { status: 500 }
    );
  }
}

// DELETE - Deletar publicação
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const db = await openDb();

    // Verifica se a publicação existe antes de deletar
    const existingPublication = await db.get<Publication>(
      'SELECT id FROM publications WHERE id = ?',
      [id]
    );

    if (!existingPublication) {
      return NextResponse.json(
        { message: 'Publicação não encontrada' },
        { status: 404 }
      );
    }

    await db.run('DELETE FROM publications WHERE id = ?', [id]);

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Erro ao deletar publicação:', error);
    return NextResponse.json(
      { message: 'Erro ao deletar publicação' },
      { status: 500 }
    );
  }
}
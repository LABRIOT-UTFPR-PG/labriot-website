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
  description?: string;
}

// GET - Listar todas as publicações
export async function GET() {
  try {
    const db = await openDb();

    const publications = await db.all<Publication>(
      'SELECT * FROM publications ORDER BY year DESC'
    );

    return NextResponse.json(publications);
  } catch (error) {
    console.error('Erro ao buscar publicações:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar publicações' },
      { status: 500 }
    );
  }
}

// POST - Criar nova publicação
export async function POST(request: Request) {
  try {
    const db = await openDb();
    const data = await request.json();

    const { title, authors, journal, year, doi, description } = data;

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
    if (doi && doi.trim()) {
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

    if (journal.length > 200) {
      return NextResponse.json(
        { message: 'O nome do periódico deve ter no máximo 200 caracteres' },
        { status: 400 }
      );
    }

    if (description && description.length > 1000) {
      return NextResponse.json(
        { message: 'A descrição deve ter no máximo 1000 caracteres' },
        { status: 400 }
      );
    }

    const result = await db.run(
      'INSERT INTO publications (title, authors, journal, year, doi, description) VALUES (?, ?, ?, ?, ?, ?)',
      [title, authors, journal, yearNum, doi || null, description || null]
    );

    return NextResponse.json(
      {
        id: result.lastID,
        title,
        authors,
        journal,
        year: yearNum,
        doi: doi || null,
        description: description || null,
        message: 'Publicação criada com sucesso'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao criar publicação:', error);
    return NextResponse.json(
      { message: 'Erro ao criar publicação' },
      { status: 500 }
    );
  }
}
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

// GET - Listar todas as áreas de pesquisa
export async function GET() {
  try {
    const db = await openDb();

    const research = await db.all<Research>(
      'SELECT * FROM research ORDER BY title ASC'
    );

    return NextResponse.json(research);
  } catch (error) {
    console.error('Erro ao buscar áreas de pesquisa:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar áreas de pesquisa' },
      { status: 500 }
    );
  }
}

// POST - Criar nova área de pesquisa
export async function POST(request: Request) {
  try {
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

    // Verifica se já existe uma área de pesquisa com o mesmo título
    const existingResearch = await db.get<Research>(
      'SELECT id FROM research WHERE title = ?',
      [title]
    );

    if (existingResearch) {
      return NextResponse.json(
        { message: 'Já existe uma área de pesquisa com este título' },
        { status: 409 }
      );
    }

    const result = await db.run(
      'INSERT INTO research (title, description) VALUES (?, ?)',
      [title, description]
    );

    return NextResponse.json(
      {
        id: result.lastID,
        title,
        description,
        message: 'Área de pesquisa criada com sucesso'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao criar área de pesquisa:', error);
    return NextResponse.json(
      { message: 'Erro ao criar área de pesquisa' },
      { status: 500 }
    );
  }
}
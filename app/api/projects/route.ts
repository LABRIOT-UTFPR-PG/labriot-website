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

// GET - Listar todos os projetos
export async function GET() {
  try {
    const db = await openDb();

    const projects = await db.all<Project>(
      'SELECT * FROM projects ORDER BY startDate DESC'
    );

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Erro ao buscar projetos:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar projetos' },
      { status: 500 }
    );
  }
}

// POST - Criar novo projeto
export async function POST(request: Request) {
  try {
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

    // Validação de tamanho dos campos
    if (title.length > 200) {
      return NextResponse.json(
        { message: 'O título deve ter no máximo 200 caracteres' },
        { status: 400 }
      );
    }

    if (description.length > 1000) {
      return NextResponse.json(
        { message: 'A descrição deve ter no máximo 1000 caracteres' },
        { status: 400 }
      );
    }

    const result = await db.run(
      'INSERT INTO projects (title, description, status, startDate, endDate, image) VALUES (?, ?, ?, ?, ?, ?)',
      [title, description, status, startDate, endDate || null, image || null]
    );

    return NextResponse.json(
      {
        id: result.lastID,
        title,
        description,
        status,
        startDate,
        endDate: endDate || null,
        image: image || null,
        message: 'Projeto criado com sucesso'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao criar projeto:', error);
    return NextResponse.json(
      { message: 'Erro ao criar projeto' },
      { status: 500 }
    );
  }
}
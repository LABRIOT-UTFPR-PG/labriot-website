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

// GET - Listar todos os posts
export async function GET() {
  try {
    const db = await openDb();

    const posts = await db.all<Post>(
      'SELECT * FROM posts ORDER BY date DESC'
    );

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Erro ao buscar posts:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar posts' },
      { status: 500 }
    );
  }
}

// POST - Criar novo post
export async function POST(request: Request) {
  try {
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

    // Validação do formato da data (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) {
      return NextResponse.json(
        { message: 'Formato de data inválido. Use YYYY-MM-DD' },
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

    if (summary.length > 500) {
      return NextResponse.json(
        { message: 'O resumo deve ter no máximo 500 caracteres' },
        { status: 400 }
      );
    }

    const result = await db.run(
      'INSERT INTO posts (title, summary, content, author, date, image) VALUES (?, ?, ?, ?, ?, ?)',
      [title, summary, content, author, date, image || null]
    );

    return NextResponse.json(
      {
        id: result.lastID,
        title,
        summary,
        content,
        author,
        date,
        image: image || null,
        message: 'Post criado com sucesso'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao criar post:', error);
    return NextResponse.json(
      { message: 'Erro ao criar post' },
      { status: 500 }
    );
  }
}
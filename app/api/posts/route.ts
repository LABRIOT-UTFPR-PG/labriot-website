import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { postSchema } from '@/lib/validation';

export async function GET() {
  try {
    const db = await openDb();
    const posts = await db.all('SELECT * FROM posts ORDER BY date DESC');
    return NextResponse.json(posts);
  } catch (error) {
    console.error('[api/posts] Erro ao listar posts:', error);
    return NextResponse.json({ error: 'Erro ao carregar posts.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

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
      'INSERT INTO posts (title, summary, content, author, date, image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [title, summary, content, author, date, image]
    );

    return NextResponse.json({ id: result.lastID, ...parsed.data }, { status: 201 });
  } catch (error) {
    console.error('[api/posts] Erro ao criar post:', error);
    return NextResponse.json({ error: 'Erro ao criar post.' }, { status: 500 });
  }
}

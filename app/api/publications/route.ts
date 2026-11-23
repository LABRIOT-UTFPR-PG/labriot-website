import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { publicationSchema } from '@/lib/validation';

export async function GET() {
  try {
    const db = await openDb();
    const publications = await db.all('SELECT * FROM publications ORDER BY year DESC');
    return NextResponse.json(publications);
  } catch (error) {
    console.error('[api/publications] Erro ao listar publicações:', error);
    return NextResponse.json({ error: 'Erro ao carregar publicações.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    const parsed = publicationSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos.', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, authors, journal, year, doi, description } = parsed.data;
    const db = await openDb();
    const result = await db.run(
      'INSERT INTO publications (title, authors, journal, year, doi, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [title, authors, journal, year, doi, description]
    );

    return NextResponse.json({ id: result.lastID, ...parsed.data }, { status: 201 });
  } catch (error) {
    console.error('[api/publications] Erro ao criar publicação:', error);
    return NextResponse.json({ error: 'Erro ao criar publicação.' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { researchSchema } from '@/lib/validation';

export async function GET() {
  try {
    const db = await openDb();
    const research = await db.all('SELECT * FROM research ORDER BY id ASC');
    return NextResponse.json(research);
  } catch (error) {
    console.error('[api/research] Erro ao listar pesquisas:', error);
    return NextResponse.json({ error: 'Erro ao carregar áreas de pesquisa.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    const parsed = researchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos.', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, description } = parsed.data;
    const db = await openDb();
    const result = await db.run(
      'INSERT INTO research (title, description) VALUES ($1, $2) RETURNING id',
      [title, description]
    );

    return NextResponse.json({ id: result.lastID, ...parsed.data }, { status: 201 });
  } catch (error) {
    console.error('[api/research] Erro ao criar área de pesquisa:', error);
    return NextResponse.json({ error: 'Erro ao criar área de pesquisa.' }, { status: 500 });
  }
}

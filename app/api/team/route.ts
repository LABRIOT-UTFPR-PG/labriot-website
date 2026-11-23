import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { teamSchema } from '@/lib/validation';

export async function GET() {
  try {
    const db = await openDb();
    const team = await db.all('SELECT * FROM team ORDER BY id ASC');
    return NextResponse.json(team);
  } catch (error) {
    console.error('[api/team] Erro ao listar equipe:', error);
    return NextResponse.json({ error: 'Erro ao carregar equipe.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    const parsed = teamSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos.', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { name, specialization, image, linkedin, category } = parsed.data;
    const role = 'Pesquisador';
    const finalCategory = category || 'Equipe';

    const db = await openDb();
    const result = await db.run(
      'INSERT INTO team (name, role, specialization, category, image, linkedin) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
      [name, role, specialization, finalCategory, image, linkedin]
    );

    return NextResponse.json(
      { id: result.lastID, ...parsed.data, role, category: finalCategory },
      { status: 201 }
    );
  } catch (error) {
    console.error('[api/team] Erro ao adicionar membro:', error);
    return NextResponse.json({ error: 'Erro ao adicionar membro.' }, { status: 500 });
  }
}

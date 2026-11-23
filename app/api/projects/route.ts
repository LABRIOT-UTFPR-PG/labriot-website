import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { projectSchema } from '@/lib/validation';

export async function GET() {
  try {
    const db = await openDb();
    const projects = await db.all(
      'SELECT id, title, description, status, startdate AS "startDate", enddate AS "endDate", image, url, "fullDescription" FROM projects ORDER BY id DESC'
    );
    return NextResponse.json(projects);
  } catch (error) {
    console.error('[api/projects] Erro ao listar projetos:', error);
    return NextResponse.json({ error: 'Erro ao carregar projetos.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireAdmin();
  if (auth.response) return auth.response;

  try {
    const body = await request.json();
    const parsed = projectSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dados inválidos.', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { title, description, status, startDate, endDate, image, url, fullDescription } =
      parsed.data;
    const db = await openDb();
    const result = await db.run(
      'INSERT INTO projects (title, description, status, startDate, endDate, image, url, "fullDescription") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id',
      [title, description, status, startDate, endDate, image, url, fullDescription]
    );

    return NextResponse.json({ id: result.lastID, ...parsed.data }, { status: 201 });
  } catch (error) {
    console.error('[api/projects] Erro ao criar projeto:', error);
    return NextResponse.json({ error: 'Erro ao criar projeto.' }, { status: 500 });
  }
}

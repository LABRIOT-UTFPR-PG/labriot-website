import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export async function GET(request: Request, context: { params: { id: string } }) {
  const db = await openDb();
  const member = await db.get('SELECT * FROM team WHERE id = $1', [context.params.id]);
  if (!member) {
    return new Response('Membro não encontrado', { status: 404 });
  }
  return NextResponse.json(member);
}

export async function PUT(request: Request, context: { params: { id: string } }) {
  const db = await openDb();
  const data = await request.json();
  // Adicionado linkedin na extração
  const { name, specialization, image, linkedin } = data;

  const role = "Pesquisador";
  const category = "students";

  await db.run(
    'UPDATE team SET name = $1, role = $2, specialization = $3, category = $4, image = $5, linkedin = $6 WHERE id = $7',
    [name, role, specialization, category, image, linkedin, context.params.id]
  );

  return NextResponse.json({ id: context.params.id, ...data, role, category });
}

export async function DELETE(request: Request, context: { params: { id: string } }) {
  const db = await openDb();
  await db.run('DELETE FROM team WHERE id = $1', [context.params.id]);
  return new Response(null, { status: 204 });
}
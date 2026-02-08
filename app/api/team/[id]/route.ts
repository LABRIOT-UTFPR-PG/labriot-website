export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

// Interface para o membro da equipe
interface TeamMember {
  id: number;
  name: string;
  role: string;
  specialization: string;
  category: string;
  image?: string;
  linkedin?: string;
}

// Interface para o contexto de params (Next.js 15+)
interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET por ID
export async function GET(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const db = await openDb();

    const member = await db.get<TeamMember>(
      'SELECT * FROM team WHERE id = ?',
      [id]
    );

    if (!member) {
      return NextResponse.json(
        { message: 'Membro não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(member);
  } catch (error) {
    console.error('Erro ao buscar membro:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar membro' },
      { status: 500 }
    );
  }
}

// PUT - Atualizar membro
export async function PUT(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const db = await openDb();
    const data = await request.json();

    const { name, specialization, image, linkedin } = data;

    // Validação de campos obrigatórios
    if (!name || !specialization) {
      return NextResponse.json(
        { message: 'Campos obrigatórios: name, specialization' },
        { status: 400 }
      );
    }

    // Validação de tamanho dos campos
    if (name.length > 200) {
      return NextResponse.json(
        { message: 'O nome deve ter no máximo 200 caracteres' },
        { status: 400 }
      );
    }

    if (specialization.length > 300) {
      return NextResponse.json(
        { message: 'A especialização deve ter no máximo 300 caracteres' },
        { status: 400 }
      );
    }

    // Validação do formato do LinkedIn (opcional, mas se fornecido deve ser válido)
    if (linkedin && linkedin.trim()) {
      const linkedinRegex = /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9_-]+\/?$/i;
      if (!linkedinRegex.test(linkedin)) {
        return NextResponse.json(
          { message: 'URL do LinkedIn inválida. Exemplo: https://linkedin.com/in/usuario' },
          { status: 400 }
        );
      }
    }

    // Verifica se o membro existe antes de atualizar
    const existingMember = await db.get<TeamMember>(
      'SELECT id FROM team WHERE id = ?',
      [id]
    );

    if (!existingMember) {
      return NextResponse.json(
        { message: 'Membro não encontrado' },
        { status: 404 }
      );
    }

    const role = "Pesquisador";
    const category = "students";

    await db.run(
      'UPDATE team SET name = ?, role = ?, specialization = ?, category = ?, image = ?, linkedin = ? WHERE id = ?',
      [name, role, specialization, category, image || null, linkedin || null, id]
    );

    return NextResponse.json({
      id,
      name,
      role,
      specialization,
      category,
      image: image || null,
      linkedin: linkedin || null,
      message: 'Membro atualizado com sucesso'
    });
  } catch (error) {
    console.error('Erro ao atualizar membro:', error);
    return NextResponse.json(
      { message: 'Erro ao atualizar membro' },
      { status: 500 }
    );
  }
}

// DELETE - Deletar membro
export async function DELETE(request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const db = await openDb();

    // Verifica se o membro existe antes de deletar
    const existingMember = await db.get<TeamMember>(
      'SELECT id FROM team WHERE id = ?',
      [id]
    );

    if (!existingMember) {
      return NextResponse.json(
        { message: 'Membro não encontrado' },
        { status: 404 }
      );
    }

    await db.run('DELETE FROM team WHERE id = ?', [id]);

    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Erro ao deletar membro:', error);
    return NextResponse.json(
      { message: 'Erro ao deletar membro' },
      { status: 500 }
    );
  }
}
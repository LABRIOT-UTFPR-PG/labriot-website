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

// GET - Listar todos os membros da equipe
export async function GET() {
  try {
    const db = await openDb();

    const team = await db.all<TeamMember>(
      'SELECT * FROM team ORDER BY name ASC'
    );

    return NextResponse.json(team);
  } catch (error) {
    console.error('Erro ao buscar membros da equipe:', error);
    return NextResponse.json(
      { message: 'Erro ao buscar membros da equipe' },
      { status: 500 }
    );
  }
}

// POST - Criar novo membro da equipe
export async function POST(request: Request) {
  try {
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

    // Verifica se já existe um membro com o mesmo nome
    const existingMember = await db.get<TeamMember>(
      'SELECT id FROM team WHERE name = ?',
      [name]
    );

    if (existingMember) {
      return NextResponse.json(
        { message: 'Já existe um membro com este nome' },
        { status: 409 }
      );
    }

    const role = "Pesquisador";
    const category = "students";

    const result = await db.run(
      'INSERT INTO team (name, role, specialization, category, image, linkedin) VALUES (?, ?, ?, ?, ?, ?)',
      [name, role, specialization, category, image || null, linkedin || null]
    );

    return NextResponse.json(
      {
        id: result.lastID,
        name,
        role,
        specialization,
        category,
        image: image || null,
        linkedin: linkedin || null,
        message: 'Membro adicionado com sucesso'
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erro ao adicionar membro:', error);
    return NextResponse.json(
      { message: 'Erro ao adicionar membro' },
      { status: 500 }
    );
  }
}
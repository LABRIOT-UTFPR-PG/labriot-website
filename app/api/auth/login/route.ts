import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();
    const db = await openDb();

    const user = await db.get('SELECT * FROM users WHERE username = ?', [username]);

    if (!user) {
      return new Response('Credenciais inválidas', { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return new Response('Credenciais inválidas', { status: 401 });
    }

    const token = jwt.sign({ userId: user.id, username: user.username }, SECRET_KEY, {
      expiresIn: '1h',
    });

    // Correção: Adicionado 'await' aqui
    const cookieStore = cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      maxAge: 60 * 60,
      path: '/',
    });

    return NextResponse.json({ message: 'Login bem-sucedido' });
  } catch (error) {
    console.error(error);
    return new Response('Ocorreu um erro ao fazer login.', { status: 500 });
  }
}
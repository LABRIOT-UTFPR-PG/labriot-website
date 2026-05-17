import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { SignJWT } from 'jose';
import { cookies, headers } from 'next/headers';

// Usa fallback em tempo de build para evitar quebrar o deploy do Vercel
const JWT_SECRET = process.env.JWT_SECRET || 'temporary_development_secret_key_123456789';
const SECRET = new TextEncoder().encode(JWT_SECRET);

// Rate limiting simples em memória (5 tentativas / 15 min por IP)
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;
const attempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = attempts.get(ip);

  if (record && now < record.resetAt) {
    if (record.count >= MAX_ATTEMPTS) {
      return { allowed: false, remaining: 0 };
    }
    record.count++;
    return { allowed: true, remaining: MAX_ATTEMPTS - record.count };
  }

  attempts.set(ip, { count: 1, resetAt: now + WINDOW_MS });
  return { allowed: true, remaining: MAX_ATTEMPTS - 1 };
}

export async function POST(request: Request) {
  // Verifica rate limit pelo IP
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown';
  const { allowed } = checkRateLimit(ip);

  if (!allowed) {
    return new Response('Muitas tentativas. Tente novamente em 15 minutos.', {
      status: 429,
    });
  }

  try {
    const { username, password } = await request.json();
    const db = await openDb();

    const user = await db.get('SELECT * FROM users WHERE username = $1', [username]);

    if (!user) {
      return new Response('Credenciais inválidas', { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return new Response('Credenciais inválidas', { status: 401 });
    }

    // Gera token usando jose (mesma lib do middleware.ts)
    const token = await new SignJWT({ userId: user.id, username: user.username })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('1h')
      .sign(SECRET);

    const cookieStore = await cookies();
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

import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { cookies, headers } from 'next/headers';
import { signAdminToken } from '@/lib/auth';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { loginSchema } from '@/lib/validation';

export async function POST(request: Request) {
  const headersList = await headers();
  const ip = getClientIp(headersList);
  const rate = checkRateLimit(ip, {
    namespace: 'auth-login',
    maxRequests: 5,
    windowMs: 15 * 60 * 1000,
  });

  if (!rate.allowed) {
    return NextResponse.json(
      { error: 'Muitas tentativas. Tente novamente em 15 minutos.' },
      {
        status: 429,
        headers: { 'Retry-After': String(rate.retryAfterSeconds) },
      }
    );
  }

  try {
    const body = await request.json();
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Usuário e senha são obrigatórios.' },
        { status: 400 }
      );
    }

    const { username, password } = parsed.data;
    const db = await openDb();
    const user = await db.get(
      'SELECT id, username, password FROM users WHERE username = $1',
      [username]
    );

    if (!user) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    const token = await signAdminToken({
      userId: Number(user.id),
      username: user.username,
    });

    const cookieStore = await cookies();
    cookieStore.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 2,
      path: '/',
    });

    return NextResponse.json({ message: 'Login bem-sucedido' });
  } catch (error) {
    console.error('[auth/login] Erro ao autenticar:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro ao fazer login.' },
      { status: 500 }
    );
  }
}

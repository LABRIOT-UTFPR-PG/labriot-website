import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export interface AdminSession {
  userId: number;
  username: string;
}

const MIN_SECRET_LENGTH = 32;

export function getJwtSecretBytes(): Uint8Array {
  const secret = process.env.JWT_SECRET;

  if (!secret || secret.trim().length < MIN_SECRET_LENGTH) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        `[auth] JWT_SECRET deve estar definida com pelo menos ${MIN_SECRET_LENGTH} caracteres em produção.`
      );
    }
    // Fallback apenas em desenvolvimento local (nunca em produção)
    return new TextEncoder().encode(
      secret && secret.trim().length > 0
        ? secret
        : 'dev_only_insecure_secret_change_in_production_32chars'
    );
  }

  return new TextEncoder().encode(secret);
}

export async function signAdminToken(payload: AdminSession): Promise<string> {
  return new SignJWT({ userId: payload.userId, username: payload.username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(getJwtSecretBytes());
}

export async function verifyAdminToken(token: string): Promise<AdminSession | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecretBytes(), {
      algorithms: ['HS256'],
    });
    if (typeof payload.username !== 'string') {
      return null;
    }
    return {
      userId: Number(payload.userId),
      username: payload.username,
    };
  } catch {
    return null;
  }
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

/**
 * Garante que a requisição pertence a um administrador autenticado.
 * Retorna `{ session }` ou `{ response }` com status 401.
 */
export async function requireAdmin(): Promise<
  { session: AdminSession; response?: never } | { session?: never; response: NextResponse }
> {
  const session = await getAdminSession();
  if (!session) {
    return {
      response: NextResponse.json(
        { error: 'Não autorizado. Faça login como administrador.' },
        { status: 401 }
      ),
    };
  }
  return { session };
}

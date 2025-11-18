import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Uma função de logout para ser usada por ambos os métodos GET e POST
async function performLogout() {
  const cookieStore = await cookies(); // Adicione 'await' aqui também
  cookieStore.set('token', '', { httpOnly: true, path: '/', maxAge: 0 });
  return NextResponse.json({ message: 'Logout bem-sucedido' });
}

export async function GET() {
  return performLogout();
}

export async function POST() {
  return performLogout();
}
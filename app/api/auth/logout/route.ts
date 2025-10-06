import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// Uma função de logout para ser usada por ambos os métodos GET e POST
async function performLogout() {
  const cookieStore = cookies();
  // Define o cookie com uma data de expiração no passado para removê-lo
  cookieStore.set('token', '', { httpOnly: true, path: '/', maxAge: 0 });
  return NextResponse.json({ message: 'Logout bem-sucedido' });
}

export async function GET() {
  return performLogout();
}

export async function POST() {
  return performLogout();
}
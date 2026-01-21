export const runtime = 'nodejs';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';


async function performLogout() {
  const cookieStore = cookies();

  cookieStore.set('token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires: new Date(0),
    path: '/',
  });

  return NextResponse.json({ message: 'Logout bem-sucedido' });
}



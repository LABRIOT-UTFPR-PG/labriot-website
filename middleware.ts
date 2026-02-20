import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose';

const SECRET_KEY = process.env.JWT_SECRET;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value

  console.log('=== MIDDLEWARE ===')
  console.log('PATH:', pathname)
  console.log('JWT_SECRET:', process.env.JWT_SECRET)
  console.log('TOKEN:', token)

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!token) {
      console.log('❌ Sem token — redirecionando para login')
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
      await jose.jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET))
      console.log('✅ Token válido')
      return NextResponse.next()
    } catch (error) {
      console.log('❌ Token inválido:', error)
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
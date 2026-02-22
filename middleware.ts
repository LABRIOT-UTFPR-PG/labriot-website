import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

// Remova o const SECRET daqui de fora

export async function middleware(request: NextRequest) {
  // Inicialize o SECRET aqui DENTRO da função
  const SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
      await jose.jwtVerify(token, SECRET)
      return NextResponse.next()
    } catch {
      // Se houver erro, a página recarregará no login
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
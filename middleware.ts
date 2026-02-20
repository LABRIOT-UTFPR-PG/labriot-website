import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

if (!SECRET) {
  throw new Error("JWT_SECRET não definido")
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value

  // Proteção de rotas admin
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
      // Verificação padronizada
      await jose.jwtVerify(token, SECRET)
      return NextResponse.next()
    } catch (error) {
      // Se o token for inválido ou expirado, redireciona
      console.error("Erro JWT:", error)
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}

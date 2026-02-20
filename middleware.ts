import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!token) {
      console.log("🚫 [Middleware]: Acesso negado. Nenhum token encontrado no cookie.")
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
      await jose.jwtVerify(token, SECRET)
      console.log("✅ [Middleware]: Token válido para:", pathname)
      return NextResponse.next()
    } catch (error: any) {
      console.error("❌ [Middleware]: Erro na verificação do JWT:", error.code || error.message)
      // Se o erro for 'ERR_JWT_EXPIRED', o problema é o tempo do token.
      // Se for 'ERR_JWS_SIGNATURE_VERIFICATION_FAILED', as chaves SECRET não batem.
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'], // Protege /admin e todas as sub-rotas
}

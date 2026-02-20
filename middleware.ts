import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

export async function middleware(request: NextRequest) {
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
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}

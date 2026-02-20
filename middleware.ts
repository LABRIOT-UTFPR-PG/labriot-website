import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

const SECRET = process.env.JWT_SECRET

if (!SECRET) {
  throw new Error("JWT_SECRET não definido")
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value

  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
      //await jose.jwtVerify(token, new TextEncoder().encode(SECRET))
      console.log("PASSOU NO VERIFY")
      return NextResponse.next()
    } catch {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }
  console.log("TOKEN:", token)
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
}

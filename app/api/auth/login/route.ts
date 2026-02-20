import { NextResponse } from 'next/server'
import { openDb } from '@/lib/db'
import bcrypt from 'bcryptjs'
import * as jose from 'jose'

const SECRET_KEY = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json()
    const db = await openDb()

    const user = await db.get(
      'SELECT * FROM users WHERE username = $1',
      [username]
    )

    if (!user) {
      return new NextResponse('Credenciais inválidas', { status: 401 })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      return new NextResponse('Credenciais inválidas', { status: 401 })
    }

    const token = await new jose.SignJWT({ 
        userId: user.id, 
        username: user.username 
      })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(SECRET_KEY)

    const response = NextResponse.json({ message: 'Login bem-sucedido' })

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60,
      path: '/',
      sameSite: 'lax',
    })

    return response
  } catch (error) {
    console.error(error)
    return new NextResponse('Ocorreu um erro ao fazer login.', { status: 500 })
  }
}

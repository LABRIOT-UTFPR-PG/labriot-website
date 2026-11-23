import { NextResponse } from 'next/server';
import { openDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const db = await openDb();
    await db.get('SELECT 1 AS ok');
    return NextResponse.json(
      { status: 'ok', database: 'connected', timestamp: new Date().toISOString() },
      { status: 200, headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('[health] Falha na verificação do banco:', error);
    return NextResponse.json(
      { status: 'error', database: 'disconnected' },
      { status: 503, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}

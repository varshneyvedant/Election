import { NextResponse } from 'next/server';
import { clearSession } from '@/lib/auth';

export async function POST() {
  try {
    await clearSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    await clearSession();
    return NextResponse.redirect(new URL('/login', request.url));
  } catch (error) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

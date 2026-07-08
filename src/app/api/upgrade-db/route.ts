import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Manually add the missing columns to the live Vercel database using Raw SQL
    await prisma.$executeRawUnsafe(`ALTER TABLE "Vote" ADD COLUMN IF NOT EXISTS "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;`);
    
    return NextResponse.json({ success: true, message: 'Database successfully upgraded! You can now visit /admin' });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message });
  }
}

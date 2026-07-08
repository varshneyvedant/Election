import prisma from '@/lib/prisma';
import PublicKioskClient from './PublicKioskClient';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function PublicVotingPage() {
  const election = await prisma.election.findUnique({ where: { id: 1 } });
  
  if (!election || !election.isActive) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none"></div>
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 shadow-2xl p-12 rounded-3xl text-center max-w-md w-full relative z-10">
          <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-700">
            <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2 tracking-tight">Election Closed</h1>
          <p className="text-slate-400 mb-8">The polling booth is currently inactive.</p>
          <Link href="/login" className="text-indigo-400 hover:text-indigo-300 hover:underline text-sm font-medium transition-colors">
            Administrator Access &rarr;
          </Link>
        </div>
      </div>
    );
  }

  const candidates = await prisma.candidate.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none"></div>
      
      {/* Top Header */}
      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700/50 shadow-2xl border-b border-slate-700/50 p-6 relative z-10 flex flex-col items-center">
        <div className="flex items-center justify-center gap-4 mb-2">
          <img src="/amity-logo.png" alt="Amity Logo" className="h-20 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
          <div className="text-left border-l-2 border-slate-700 pl-4">
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-white uppercase leading-none">Amity International School</h2>
            <p className="text-indigo-400 font-bold tracking-widest text-sm uppercase">Mayur Vihar</p>
          </div>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mt-4 border-t border-slate-800 pt-4 w-full text-center max-w-md">
          Official Digital Polling Booth
        </h1>
        <p className="text-slate-400 mt-2 font-medium tracking-wide text-xs uppercase">Secure &bull; Verifiable &bull; Anonymous</p>
      </div>

      <div className="flex-1 flex flex-col items-center py-12 px-4 relative z-10">
        <div className="max-w-3xl w-full">
          <PublicKioskClient candidates={candidates} />
        </div>
      </div>

      <div className="p-6 text-center relative z-10">
        <Link href="/login" className="text-slate-500 hover:text-slate-300 text-xs tracking-wider uppercase font-medium transition-colors">
          Administrator Access
        </Link>
      </div>
    </div>
  );
}

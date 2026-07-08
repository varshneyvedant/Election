import prisma from '@/lib/prisma';
import PublicResultsClient from './PublicResultsClient';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function PublicResultsPage() {
  const election = await prisma.election.findUnique({ where: { id: 1 } });
  
  if (!election || !election.resultsPublished) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none"></div>
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 shadow-2xl p-12 rounded-3xl text-center max-w-md w-full relative z-10 animate-in fade-in zoom-in duration-700">
          <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-500/30 shadow-[0_0_30px_rgba(79,70,229,0.2)]">
            <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight uppercase">Results Locked</h1>
          <p className="text-slate-400 mb-8 font-medium">Awaiting official announcement from the administration.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/" className="px-6 py-3 bg-slate-800 text-slate-300 font-bold rounded-xl hover:bg-slate-700 transition-colors uppercase text-sm tracking-widest">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const candidates = await prisma.candidate.findMany({
    include: {
      _count: {
        select: { votes: true }
      }
    }
  });

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none"></div>
      
      {/* Top Header */}
      <div className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 p-6 relative z-10 flex flex-col items-center shadow-2xl">
        <div className="flex items-center justify-center gap-4 mb-2">
          <img src="https://amityschools.in/mayurvihar/wp-content/uploads/2019/11/cropped-aisn_0001-e1573809503547-1.png" alt="Amity Logo" className="h-16 w-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
          <div className="text-left border-l-2 border-slate-700 pl-4">
            <h2 className="text-lg font-black tracking-tight text-white uppercase leading-none">Amity Elections</h2>
            <p className="text-indigo-400 font-bold tracking-widest text-xs uppercase">Official Results</p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center py-12 px-4 relative z-10 overflow-y-auto">
        <div className="max-w-3xl w-full">
          <PublicResultsClient candidates={candidates} />
        </div>
      </div>
    </div>
  );
}

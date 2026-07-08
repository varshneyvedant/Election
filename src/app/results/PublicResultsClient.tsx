'use client';

import { useState } from 'react';
import confetti from 'canvas-confetti';

export default function PublicResultsClient({ candidates }: { candidates: any[] }) {
  const [resultsRevealed, setResultsRevealed] = useState(false);

  const handleReveal = () => {
    setResultsRevealed(true);
    // Fire confetti explosion
    const duration = 5000;
    const end = Date.now() + duration;
    
    const frame = () => {
      confetti({
        particleCount: 8,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899']
      });
      confetti({
        particleCount: 8,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#4f46e5', '#10b981', '#f59e0b', '#ec4899']
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const sortedCandidates = [...candidates].sort((a:any, b:any) => b._count.votes - a._count.votes);
  const totalVotes = candidates.reduce((a:any, c:any) => a + c._count.votes, 0);

  return (
    <div className="w-full">
      {!resultsRevealed ? (
        <div className="flex flex-col items-center justify-center py-32 bg-slate-900/80 rounded-3xl border border-slate-700 shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors"></div>
          <svg className="w-24 h-24 text-slate-600 mb-8 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z"></path></svg>
          <button 
            onClick={handleReveal}
            className="relative z-10 px-12 py-6 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-black text-2xl tracking-widest uppercase rounded-2xl shadow-[0_0_50px_rgba(79,70,229,0.5)] hover:shadow-[0_0_80px_rgba(79,70,229,0.8)] hover:scale-105 transition-all duration-300"
          >
            Reveal Winner
          </button>
        </div>
      ) : (
        <div className="animate-in slide-in-from-bottom-8 duration-1000 fade-in zoom-in-95">
          <div className="space-y-6 mb-12">
            {sortedCandidates.map((c: any, index: number) => (
              <div key={c.id} className={`flex justify-between items-center p-8 border rounded-3xl transition-all relative overflow-hidden ${index === 0 ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_50px_rgba(245,158,11,0.2)] scale-105' : 'bg-slate-900/50 border-slate-700'}`}>
                {index === 0 && <div className="absolute top-0 left-0 w-3 h-full bg-amber-500 shadow-[0_0_30px_#f59e0b]"></div>}
                
                <div className="relative z-10 flex items-center gap-6">
                  <div className={`w-16 h-16 rounded-full flex items-center justify-center font-bold uppercase text-3xl ${index === 0 ? 'bg-amber-500 text-white shadow-lg' : 'bg-indigo-500/20 text-indigo-400'}`}>
                    {c.name.charAt(0)}
                  </div>
                  <div>
                    <span className="font-black text-white text-3xl block">{c.name}</span>
                    {index === 0 ? (
                      <span className="text-amber-400 text-sm font-bold uppercase tracking-widest animate-pulse">Official Winner</span>
                    ) : (
                      c.slogan && <span className="text-indigo-300 text-sm italic">"{c.slogan}"</span>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-col items-end">
                  <span className={`relative z-10 font-black text-5xl ${index === 0 ? 'text-amber-400' : 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400'}`}>
                    {c._count.votes}
                  </span>
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Votes</span>
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 bg-indigo-600 rounded-2xl flex justify-between items-center font-bold shadow-[0_0_40px_rgba(79,70,229,0.3)] relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.1] mix-blend-overlay"></div>
            <span className="text-indigo-200 uppercase tracking-widest z-10 text-xl">Total Verified Ballots</span>
            <span className="text-5xl text-white z-10 font-black">{totalVotes}</span>
          </div>
        </div>
      )}
    </div>
  );
}

import Link from 'next/link';

export const dynamic = 'force-static';

export default function TeacherManualPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 font-sans selection:bg-indigo-500/30">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none fixed"></div>
      
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="https://amityschools.in/mayurvihar/wp-content/uploads/2019/11/cropped-aisn_0001-e1573809503547-1.png" alt="Amity Logo" className="h-10 w-auto brightness-200 contrast-125 grayscale" />
            <div>
              <h1 className="text-lg font-black text-white leading-tight uppercase tracking-tight">Admin Guide</h1>
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Digital Polling Booth</p>
            </div>
          </div>
          <Link href="/login" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg uppercase tracking-widest transition-colors shadow-lg shadow-indigo-500/20">
            Open App
          </Link>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-6 py-8 space-y-12 relative z-10">
        
        {/* Intro */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Quick Start Guide</h2>
          <p className="text-slate-400 text-sm leading-relaxed max-w-md mx-auto">
            Everything you need to run the Amity Digital Elections securely from your phone or computer.
          </p>
        </div>

        {/* Section 1 */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-rose-500">1.</span> Passwords & Access
          </h3>
          <div className="space-y-4">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Admin Dashboard Login</p>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">Username</p>
                  <p className="font-mono text-white text-lg">amity</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase">Password</p>
                  <p className="font-mono text-white text-lg">aismvschool</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Results & Audit Unlock Key</p>
              <p className="text-sm text-slate-400 mb-2">Used to unlock restricted data inside the dashboard.</p>
              <p className="font-mono text-rose-400 text-lg font-bold bg-rose-500/10 inline-block px-3 py-1 rounded-lg border border-rose-500/20">developer</p>
            </div>
          </div>
        </section>

        {/* Section 2 */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-emerald-500">2.</span> Setup & Distribution
          </h3>
          <ul className="space-y-4 text-sm text-slate-300">
            <li className="flex gap-3">
              <div className="mt-0.5 w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-xs font-bold shrink-0">1</div>
              <p><strong className="text-white block">Add Candidates:</strong> Go to the Candidates tab and add the students running for office.</p>
            </li>
            <li className="flex gap-3">
              <div className="mt-0.5 w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-xs font-bold shrink-0">2</div>
              <p><strong className="text-white block">Initialize Election:</strong> Go to the Election tab and click <span className="bg-slate-800 text-xs px-1.5 py-0.5 rounded text-white">Reset & New Election</span>. This wipes old data and generates 30 fresh student keys.</p>
            </li>
            <li className="flex gap-3">
              <div className="mt-0.5 w-5 h-5 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-xs font-bold shrink-0">3</div>
              <p><strong className="text-white block">Print PDF Tickets:</strong> Click <span className="text-emerald-400 font-semibold">Download Tickets (PDF)</span>. Print the file, cut the slips, and distribute them privately to the 30 voters.</p>
            </li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-amber-500">3.</span> How to Vote
          </h3>
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 mb-4">
            <p className="text-sm text-amber-200">Share your main website link with the students. Do not share the /admin link.</p>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed">
            Students click the polling booth, enter their assigned Roll Number (1-30) and the Secret Key from their printed ticket. 
            Once they cast their vote, the key is permanently burned. They can instantly download or WhatsApp their secure receipt.
          </p>
        </section>

        {/* Section 4 */}
        <section className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500"></div>
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span className="text-cyan-500">4.</span> Monitoring & Results
          </h3>
          <ul className="space-y-5 text-sm text-slate-300">
            <li>
              <strong className="text-white text-base block mb-1">God Mode (Audit Log)</strong>
              Use the <span className="text-rose-400 font-mono text-xs">developer</span> key to unlock the Audit tab. You can silently monitor exactly who everyone voted for and their provided reasons in real-time.
            </li>
            <li>
              <strong className="text-white text-base block mb-1">Ending the Election</strong>
              When all 30 votes are in, click <span className="bg-red-900 text-red-200 text-xs px-2 py-1 rounded">Halt Election</span>. This instantly locks the public polling booth.
            </li>
            <li>
              <strong className="text-white text-base block mb-1">Broadcasting Results</strong>
              Unlock the Results tab and flip the <strong className="text-cyan-400">Broadcast Results</strong> switch. The homepage will instantly update with a massive &quot;View Results&quot; button for all students to see the winner.
            </li>
          </ul>
        </section>

      </main>
      
      <div className="pb-20 text-center">
        <p className="text-slate-600 text-xs font-bold tracking-widest uppercase">Secured by Amity Digital Systems</p>
      </div>
    </div>
  );
}

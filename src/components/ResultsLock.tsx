'use client';

import { useState } from 'react';

export default function ResultsLock({ children }: { children: React.ReactNode }) {
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'developer') {
      setIsLocked(false);
      setError('');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-500">
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 shadow-2xl p-8 rounded-3xl max-w-sm w-full relative z-10">
        <div className="flex justify-center mb-6 text-indigo-400 bg-indigo-500/10 w-20 h-20 rounded-full mx-auto items-center border border-indigo-500/30 shadow-[0_0_20px_rgba(79,70,229,0.2)]">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        </div>
        <h2 className="text-2xl font-bold text-center text-white mb-2 tracking-tight">Access Restricted</h2>
        <p className="text-slate-400 text-center text-sm font-medium tracking-widest uppercase mb-6">Confidential Data</p>
        
        {error && <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm text-center font-medium">{error}</div>}
        
        <form onSubmit={handleUnlock} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
              Security Key
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter decryption password"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-slate-600 text-center tracking-widest"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.2)] hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] tracking-wider uppercase active:scale-[0.98]"
          >
            Decrypt Data
          </button>
        </form>
      </div>
    </div>
  );
}

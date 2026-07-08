'use client';

import { useState } from 'react';

export default function ResultsLock({ children }: { children: React.ReactNode }) {
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'classeightelections') {
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
    <div className="flex flex-col items-center justify-center py-20">
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 max-w-sm w-full">
        <div className="flex justify-center mb-6 text-blue-600">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
        </div>
        <h2 className="text-xl font-bold text-center text-slate-800 mb-6">Results are Locked</h2>
        
        {error && <div className="mb-4 text-red-600 text-sm text-center bg-red-50 p-2 rounded">{error}</div>}
        
        <form onSubmit={handleUnlock} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter Results Password"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg outline-none focus:border-blue-600"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
          >
            Unlock Results
          </button>
        </form>
      </div>
    </div>
  );
}

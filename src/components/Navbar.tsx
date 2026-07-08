'use client';

import { useRouter } from 'next/navigation';

export default function Navbar({ role, name }: { role: string, name?: string }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  };

  const getRoleTitle = () => {
    if (role === 'admin') return 'Administrator Dashboard';
    if (role === 'teacher') return 'Teacher Dashboard';
    if (role === 'student') return 'Student Voting Portal';
    return 'Dashboard';
  };

  return (
    <nav className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 shadow-2xl border-b border-slate-700/50 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 tracking-tighter">Digital Polling Booth</h1>
            <span className="hidden md:inline-flex px-3 py-1 bg-slate-800/50 text-indigo-300 rounded-full text-xs font-bold uppercase tracking-widest border border-indigo-500/30 shadow-inner">
              {getRoleTitle()}
            </span>
          </div>
          <div className="flex items-center space-x-6">
            {name && <span className="text-sm text-slate-300 font-bold uppercase tracking-wider hidden sm:block">Welcome, <span className="text-white">{name}</span></span>}
            <button
              onClick={handleLogout}
              className="text-xs font-bold text-slate-400 hover:text-white transition-all px-4 py-2 rounded-lg bg-slate-800 hover:bg-red-600 hover:shadow-[0_0_20px_rgba(220,38,38,0.4)] border border-slate-700 uppercase tracking-widest"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

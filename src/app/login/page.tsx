'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
        return;
      }

      // Redirect based on role
      if (data.role === 'admin') router.push('/admin');
      else if (data.role === 'teacher') router.push('/teacher');
      else if (data.role === 'student') router.push('/student');
      else router.push('/');

    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden p-4">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none"></div>
      
      <div className="max-w-md w-full bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 shadow-2xl rounded-3xl overflow-hidden relative z-10">
        <div className="bg-slate-800/80 p-8 text-center border-b border-slate-700/50">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">System Admin</h1>
          <p className="text-slate-400 mt-2 text-sm font-medium tracking-widest uppercase">Secure Access Portal</p>
        </div>
        
        <div className="p-8">
          <h2 className="text-xl font-bold text-slate-200 text-center mb-8 tracking-wide">Authenticate to continue</h2>
          
          {error && (
            <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm text-center font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-slate-600"
                placeholder="Enter admin username"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700 text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder-slate-600"
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.2)] hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] disabled:opacity-50 disabled:scale-100 mt-4 tracking-wider uppercase active:scale-[0.98]"
            >
              {isLoading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

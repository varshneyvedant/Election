import { useEffect, useState } from 'react';
import { HashRouter, Routes, Route, Link } from 'react-router-dom';
import { db } from './db';
import AdminTabs from './AdminTabs';
import PublicKioskClient from './PublicKioskClient';
import './index.css';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Kiosk />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </HashRouter>
  );
}

function Kiosk() {
  const [data, setData] = useState(db.read());

  useEffect(() => {
    const handleStorage = () => setData(db.read());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  if (!data.election?.isActive) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden bg-slate-950">
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 shadow-2xl p-12 rounded-3xl text-center max-w-md w-full relative z-10">
          <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-700">
            <svg className="w-10 h-10 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-100 mb-2 tracking-tight">Election Closed</h1>
          <p className="text-slate-400 mb-8">The polling booth is currently inactive.</p>
          <Link to="/admin" className="text-indigo-400 hover:text-indigo-300 hover:underline text-sm font-medium transition-colors">
            Administrator Access &rarr;
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden bg-slate-950">
      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 shadow-2xl border-b border-slate-700/50 p-6 text-center relative z-10">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
          Digital Polling Booth
        </h1>
        <p className="text-slate-400 mt-2 font-medium tracking-wide text-sm uppercase">Secure &bull; Verifiable &bull; Anonymous</p>
      </div>
      <div className="flex-1 flex flex-col items-center py-12 px-4 relative z-10">
        <div className="max-w-3xl w-full">
          <PublicKioskClient candidates={data.candidates} />
        </div>
      </div>
      <div className="p-6 text-center relative z-10">
        <Link to="/admin" className="text-slate-500 hover:text-slate-300 text-xs tracking-wider uppercase font-medium transition-colors">
          Administrator Access
        </Link>
      </div>
    </div>
  );
}

function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState(db.getAdminData());
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const refresh = () => {
    setData(db.getAdminData());
  };

  useEffect(() => {
    const handleStorage = () => refresh();
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Use hardcoded credentials as requested to ensure it always works even if localStorage is stale
    if (username.toLowerCase() === 'amity' && password === 'aismvschool') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Invalid credentials or insufficient permissions.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="bg-slate-900/80 border border-slate-700 p-8 rounded-2xl w-full max-w-md shadow-2xl">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Admin Login</h2>
            <Link to="/" className="text-indigo-400 hover:text-indigo-300 text-sm">Cancel</Link>
          </div>
          {error && <div className="bg-red-500/10 text-red-400 p-3 rounded-lg mb-4 text-sm">{error}</div>}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-slate-400 text-sm mb-1">Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" required />
            </div>
            <div>
              <label className="block text-slate-400 text-sm mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white outline-none focus:border-indigo-500" required />
            </div>
            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-lg mt-4 transition-colors">
              Secure Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white tracking-tight">Admin Dashboard</h1>
          <button onClick={() => setIsAuthenticated(false)} className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg hover:text-white border border-slate-700">Lock Terminal</button>
          <Link to="/" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium ml-4">
            &larr; Back to Kiosk
          </Link>
        </div>
        <AdminTabs data={data} refresh={refresh} />
      </div>
    </div>
  );
}

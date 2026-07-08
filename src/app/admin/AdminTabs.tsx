'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ResultsLock from '@/components/ResultsLock';
import confetti from 'canvas-confetti';
import { 
  addUser, deleteUser, updateUser, 
  addCandidate, deleteCandidate, updateCandidate, 
  toggleElection, resetElection, toggleResults
} from './actions';

export default function AdminTabs({ data }: { data: any }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('election');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});

  // Auto-refresh the page data every 3 seconds for live results
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 3000);
    return () => clearInterval(interval);
  }, [router]);

  const [resultsRevealed, setResultsRevealed] = useState(false);
  const handleReveal = () => {
    setResultsRevealed(true);
    // Fire confetti explosion
    const duration = 3000;
    const end = Date.now() + duration;
    
    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#4f46e5', '#10b981', '#f59e0b']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#4f46e5', '#10b981', '#f59e0b']
      });
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  // Modals / Forms state
  const [showUserModal, setShowUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  
  const [showCandidateModal, setShowCandidateModal] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<any>(null);

  const [formData, setFormData] = useState<any>({});

  const handleToggleElection = async (status: boolean) => {
    if (!confirm(`Are you sure you want to ${status ? 'start' : 'stop'} the election?`)) return;
    setLoading(true);
    await toggleElection(status);
    setLoading(false);
  };

  const handleResetElection = async () => {
    if (!confirm('WARNING: This will delete ALL votes and reset all students. Proceed?')) return;
    setLoading(true);
    await resetElection();
    setLoading(false);
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let res;
    if (editingUser) {
      res = await updateUser(editingUser.id, formData);
    } else {
      res = await addUser(formData);
    }
    setLoading(false);
    if (res?.error) setError(res.error);
    else {
      setShowUserModal(false);
      setEditingUser(null);
      setFormData({});
      setError('');
    }
  };

  const handleCandidateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    let res;
    if (editingCandidate) {
      res = await updateCandidate(editingCandidate.id, formData.name, formData.slogan || '');
    } else {
      res = await addCandidate(formData.name, formData.slogan || '');
    }
    setLoading(false);
    if (res?.error) setError(res.error);
    else {
      setShowCandidateModal(false);
      setEditingCandidate(null);
      setFormData({});
      setError('');
    }
  };

  return (
    <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 shadow-lg rounded-2xl overflow-hidden text-slate-300">
      {/* Tabs Header */}
      <div className="flex border-b border-slate-700/50 overflow-x-auto">
        {['election', 'users', 'candidates', 'results', 'audit'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 text-sm font-bold uppercase tracking-widest whitespace-nowrap outline-none transition-all ${activeTab === tab ? 'text-indigo-400 border-b-2 border-indigo-500 bg-indigo-500/10' : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="p-6 md:p-8">
        {error && <div className="mb-6 bg-red-500/10 text-red-400 p-4 rounded-xl border border-red-500/20 font-medium">{error}</div>}

        {/* ELECTION TAB */}
        {activeTab === 'election' && (
          <div className="space-y-8 animate-in fade-in">
            <div>
              <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">Election Controls</h2>
              <div className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-slate-900/50 rounded-2xl border border-slate-700 shadow-inner gap-6">
                <div>
                  <h3 className="font-bold text-slate-400 uppercase tracking-widest text-xs mb-2">System Status</h3>
                  <div className="flex items-center gap-3">
                    <span className="relative flex h-4 w-4">
                      {data.election?.isActive && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                      <span className={`relative inline-flex rounded-full h-4 w-4 ${data.election?.isActive ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                    </span>
                    <p className={`text-2xl font-black tracking-wider ${data.election?.isActive ? 'text-emerald-400' : 'text-red-400'}`}>
                      {data.election?.isActive ? 'LIVE & ACTIVE' : 'LOCKED'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleToggleElection(!data.election?.isActive)}
                  disabled={loading}
                  className={`px-8 py-4 rounded-xl font-bold text-white transition-all shadow-lg uppercase tracking-widest active:scale-95 ${data.election?.isActive ? 'bg-red-600 hover:bg-red-500 hover:shadow-red-500/30' : 'bg-emerald-600 hover:bg-emerald-500 hover:shadow-emerald-500/30'}`}
                >
                  {data.election?.isActive ? 'Halt Election' : 'Initialize Election'}
                </button>
              </div>
            </div>

            {data.election?.isActive && (
              <div className="p-6 bg-indigo-900/30 border border-indigo-500/30 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 animate-in fade-in slide-in-from-bottom-4">
                <div>
                  <h3 className="font-bold text-indigo-400 text-lg uppercase tracking-wider mb-2">Remote Voter Keys</h3>
                  <p className="text-sm text-indigo-200/70">The system has generated 30 unique, mathematically secure Voter Keys. Distribute these privately to students for remote voting.</p>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => window.open('/admin/tickets', '_blank')}
                    className="px-6 py-3 rounded-xl font-bold text-slate-300 bg-slate-700 hover:bg-slate-600 transition-colors uppercase tracking-widest text-sm whitespace-nowrap shadow-[0_0_20px_rgba(0,0,0,0.4)]"
                  >
                    Print Tickets (PDF)
                  </button>
                  <button
                    onClick={() => {
                      const headers = "Roll Number,Secret Key\n";
                      const rows = data.users.filter((u:any) => u.role === 'student').map((u:any) => `${u.username},${u.password}`).join('\n');
                      const blob = new Blob([headers + rows], { type: 'text/csv' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'Amity_Remote_Voter_Keys.csv';
                      a.click();
                    }}
                    className="px-6 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors uppercase tracking-widest text-sm whitespace-nowrap shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                  >
                    Download Keys (CSV)
                  </button>
                </div>
              </div>
            )}
            
            <div className="p-6 border border-red-500/30 bg-red-950/30 rounded-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-red-500"></div>
              <h3 className="font-bold text-red-400 text-lg uppercase tracking-wider mb-2">Danger Zone</h3>
              <p className="text-sm text-red-300 mb-6">Resetting the election will permanently wipe all votes and VVPAT receipts from the database.</p>
              <button
                onClick={handleResetElection}
                disabled={loading || data.election?.isActive}
                className="px-6 py-3 rounded-lg font-bold text-white bg-red-600 hover:bg-red-500 disabled:opacity-50 transition-colors uppercase tracking-widest text-sm"
              >
                Purge Database
              </button>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="animate-in fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white tracking-tight">Identity Register</h2>
              <button
                onClick={() => { setEditingUser(null); setFormData({ role: 'student' }); setShowUserModal(true); }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors uppercase tracking-wider shadow-lg shadow-indigo-500/20"
              >
                Add Manual Record
              </button>
            </div>
            
            <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900/50">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-800 text-slate-400 uppercase tracking-widest text-xs border-b border-slate-700">
                  <tr>
                    <th className="px-6 py-4 font-bold">Name</th>
                    <th className="px-6 py-4 font-bold">ID / Username</th>
                    <th className="px-6 py-4 font-bold">Clearance</th>
                    <th className="px-6 py-4 font-bold">Secret Key</th>
                    <th className="px-6 py-4 font-bold">Voted</th>
                    <th className="px-6 py-4 font-bold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {data.users.map((u: any) => (
                    <tr key={u.id} className="hover:bg-slate-800/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-white">{u.name}</td>
                      <td className="px-6 py-4 font-mono text-indigo-300">{u.username}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase border ${u.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' : u.role === 'teacher' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' : 'bg-slate-700/50 text-slate-300 border-slate-600'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {u.role === 'student' ? (
                          <div className="flex items-center gap-2">
                            <span className="font-mono bg-slate-800 border border-slate-700 px-2 py-1 rounded text-slate-400">
                              {revealedKeys[u.id] ? u.password : '••••••'}
                            </span>
                            <button 
                              onClick={() => setRevealedKeys(prev => ({...prev, [u.id]: !prev[u.id]}))}
                              className="text-slate-500 hover:text-indigo-400 transition-colors focus:outline-none"
                              title="Reveal Key"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                            </button>
                          </div>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4">
                        {u.role === 'student' ? (
                          u.hasVoted ? <span className="text-emerald-400 font-bold uppercase text-xs tracking-wider">Yes</span> : <span className="text-slate-500 font-bold uppercase text-xs tracking-wider">No</span>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4 text-right space-x-4 font-medium">
                        <button 
                          onClick={() => { setEditingUser(u); setFormData({ username: u.username, name: u.name, role: u.role }); setShowUserModal(true); }}
                          className="text-indigo-400 hover:text-indigo-300 transition-colors"
                        >EDIT</button>
                        <button 
                          onClick={async () => { if(confirm('Delete user?')) { setLoading(true); await deleteUser(u.id); setLoading(false); } }}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >DEL</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* CANDIDATES TAB */}
        {activeTab === 'candidates' && (
          <div className="animate-in fade-in">
            {data.election?.isActive && (
              <div className="mb-8 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-4 animate-pulse">
                <div className="text-red-400">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </div>
                <div>
                  <h4 className="text-red-400 font-bold uppercase tracking-widest text-sm">Election Lockdown Mode Active</h4>
                  <p className="text-red-300/80 text-sm">Modifying candidates is strictly disabled while voting is live to ensure election integrity. Halt the election to make changes.</p>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold text-white tracking-tight">Ballot Configuration</h2>
              <button
                onClick={() => { setEditingCandidate(null); setFormData({}); setShowCandidateModal(true); }}
                disabled={data.election?.isActive}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg font-bold text-sm transition-colors uppercase tracking-wider shadow-lg shadow-indigo-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Candidate
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {data.candidates.map((c: any) => (
                <div key={c.id} className="p-6 border border-slate-700 rounded-2xl bg-slate-900/50 flex flex-col justify-between hover:border-indigo-500/50 transition-colors group">
                  <div className="w-12 h-12 bg-slate-800 text-indigo-400 rounded-full flex items-center justify-center font-bold text-xl mb-4 uppercase">
                    {c.name.charAt(0)}
                  </div>
                  <span className="font-bold text-white text-xl mb-6">{c.name}</span>
                  <div className="flex space-x-4 text-sm font-bold uppercase tracking-wider pt-4 border-t border-slate-700/50">
                    <button 
                      onClick={() => { setEditingCandidate(c); setFormData({ name: c.name, slogan: c.slogan }); setShowCandidateModal(true); }}
                      disabled={data.election?.isActive}
                      className="text-indigo-400 hover:text-indigo-300 disabled:opacity-30 disabled:cursor-not-allowed"
                    >Edit</button>
                    <button 
                      onClick={async () => { if(confirm('Delete candidate?')) { setLoading(true); await deleteCandidate(c.id); setLoading(false); } }}
                      disabled={data.election?.isActive}
                      className="text-red-400 hover:text-red-300 disabled:opacity-30 disabled:cursor-not-allowed"
                    >Remove</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RESULTS TAB */}
        {activeTab === 'results' && (
          <ResultsLock>
            <div className="animate-in fade-in">
               <h2 className="text-2xl font-bold text-white mb-2 tracking-tight">Decrypted Results</h2>
               <p className="text-slate-400 mb-8 uppercase tracking-widest text-xs font-bold">Highly Confidential</p>
               
               <div className="flex items-center justify-between mb-8 p-4 bg-slate-900/50 border border-slate-700 rounded-xl">
                 <div>
                   <h3 className="text-white font-bold tracking-wide">Broadcast Results to Public</h3>
                   <p className="text-slate-400 text-sm">When enabled, students can see the confetti reveal at <span className="font-mono text-indigo-400">/results</span></p>
                 </div>
                 <button
                   onClick={async () => {
                     setLoading(true);
                     await toggleResults(!data.election?.resultsPublished);
                     setLoading(false);
                   }}
                   disabled={loading}
                   className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none ${data.election?.resultsPublished ? 'bg-emerald-500' : 'bg-slate-700'}`}
                 >
                   <span className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${data.election?.resultsPublished ? 'translate-x-7' : 'translate-x-1'}`} />
                 </button>
               </div>
               
               {!resultsRevealed ? (
                 <div className="flex flex-col items-center justify-center py-20 bg-slate-900/80 rounded-3xl border border-slate-700 shadow-2xl relative overflow-hidden group">
                   <div className="absolute inset-0 bg-indigo-500/10 group-hover:bg-indigo-500/20 transition-colors"></div>
                   <svg className="w-24 h-24 text-slate-600 mb-8 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                   <button 
                     onClick={handleReveal}
                     className="relative z-10 px-12 py-6 bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-black text-2xl tracking-widest uppercase rounded-2xl shadow-[0_0_50px_rgba(79,70,229,0.5)] hover:shadow-[0_0_80px_rgba(79,70,229,0.8)] hover:scale-105 transition-all duration-300"
                   >
                     Reveal Winner
                   </button>
                 </div>
               ) : (
                 <div className="animate-in slide-in-from-bottom-8 duration-700 fade-in zoom-in-95">
                   <div className="space-y-4 mb-8">
                     {data.candidates.sort((a:any, b:any) => b._count.votes - a._count.votes).map((c: any, index: number) => (
                       <div key={c.id} className={`flex justify-between items-center p-6 border rounded-2xl transition-all relative overflow-hidden ${index === 0 ? 'bg-amber-500/10 border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.2)]' : 'bg-slate-900/50 border-slate-700'}`}>
                         {index === 0 && <div className="absolute top-0 left-0 w-2 h-full bg-amber-500 shadow-[0_0_20px_#f59e0b]"></div>}
                         <div className="relative z-10 flex items-center gap-4">
                           <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold uppercase text-xl ${index === 0 ? 'bg-amber-500 text-white shadow-lg' : 'bg-indigo-500/20 text-indigo-400'}`}>{c.name.charAt(0)}</div>
                           <div>
                             <span className="font-bold text-white text-xl block">{c.name}</span>
                             {index === 0 && <span className="text-amber-400 text-xs font-bold uppercase tracking-widest">Projected Winner</span>}
                           </div>
                         </div>
                         <div className="flex flex-col items-end">
                           <span className={`relative z-10 font-black text-3xl ${index === 0 ? 'text-amber-400' : 'text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400'}`}>
                             {c._count.votes}
                           </span>
                           <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Votes</span>
                         </div>
                       </div>
                     ))}
                   </div>

                   <div className="p-8 bg-indigo-600 rounded-2xl flex justify-between items-center font-bold shadow-[0_0_40px_rgba(79,70,229,0.3)] relative overflow-hidden">
                     <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.1] mix-blend-overlay"></div>
                     <span className="text-indigo-200 uppercase tracking-widest z-10">Total Verified Ballots</span>
                     <span className="text-4xl text-white z-10 font-black">{data.candidates.reduce((a:any, c:any) => a + c._count.votes, 0)}</span>
                   </div>
                 </div>
               )}
            </div>
          </ResultsLock>
        )}

        {/* AUDIT LOG TAB */}
        {activeTab === 'audit' && (
          <ResultsLock>
            <div className="animate-in fade-in">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white tracking-tight">Election Audit Log</h2>
                <span className="px-3 py-1 bg-red-500/10 text-red-400 border border-red-500/30 rounded-full text-xs font-bold uppercase tracking-widest">
                  Not Anonymous
                </span>
              </div>
              <p className="text-slate-400 mb-8 text-sm">This log reveals the exact voting choice of every student. Treat this data with strict confidentiality.</p>
              
              <div className="overflow-x-auto rounded-xl border border-slate-700 bg-slate-900/50">
                <table className="w-full text-left text-sm text-slate-300">
                  <thead className="bg-slate-800 text-slate-400 uppercase tracking-widest text-xs border-b border-slate-700">
                    <tr>
                      <th className="px-6 py-4 font-bold">Voter ID / Name</th>
                      <th className="px-6 py-4 font-bold">Voted For</th>
                      <th className="px-6 py-4 font-bold text-right">Time Cast</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {data.auditLogs?.map((log: any) => (
                      <tr key={log.id} className="hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-white">
                          <span className="text-indigo-300 font-mono block text-xs">{log.student.username}</span>
                          {log.student.name}
                        </td>
                        <td className="px-6 py-4 font-bold text-emerald-400 uppercase tracking-wider">{log.candidate.name}</td>
                        <td className="px-6 py-4 font-mono text-slate-400 text-right text-xs">
                          {log.createdAt ? new Date(log.createdAt).toLocaleTimeString() : 'N/A'}
                        </td>
                      </tr>
                    ))}
                    {(!data.auditLogs || data.auditLogs.length === 0) && (
                      <tr>
                        <td colSpan={2} className="px-6 py-8 text-center text-slate-500 italic">No votes cast yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </ResultsLock>
        )}
      </div>

      {/* User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-cyan-500"></div>
            <h3 className="text-xl font-bold mb-6 text-white">{editingUser ? 'Edit User' : 'Add User'}</h3>
            <form onSubmit={handleUserSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Name</label>
                <input required type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-indigo-500 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Username</label>
                <input required type="text" value={formData.username || ''} onChange={e => setFormData({...formData, username: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-indigo-500 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Password {editingUser && '(leave blank to keep current)'}</label>
                <input required={!editingUser} type="password" value={formData.password || ''} onChange={e => setFormData({...formData, password: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-indigo-500 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Role</label>
                <select value={formData.role || 'student'} onChange={e => setFormData({...formData, role: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-indigo-500 transition-colors appearance-none">
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-slate-800">
                <button type="button" onClick={() => setShowUserModal(false)} className="px-5 py-2.5 text-slate-400 hover:text-white transition-colors font-bold text-sm">Cancel</button>
                <button type="submit" disabled={loading} className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 disabled:opacity-50 font-bold text-sm shadow-[0_0_15px_rgba(79,70,229,0.3)]">Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Candidate Modal */}
      {showCandidateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-md p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500"></div>
            <h3 className="text-xl font-bold mb-6 text-white">{editingCandidate ? 'Edit Candidate' : 'Add Candidate'}</h3>
            <form onSubmit={handleCandidateSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Candidate Name</label>
                <input required type="text" value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">Slogan / Manifesto (Optional)</label>
                <input type="text" value={formData.slogan || ''} onChange={e => setFormData({...formData, slogan: e.target.value})} placeholder="e.g. Focus on Sports & Tech" className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-emerald-500 transition-colors" />
              </div>
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-slate-800">
                <button type="button" onClick={() => setShowCandidateModal(false)} className="px-5 py-2.5 text-slate-400 hover:text-white transition-colors font-bold text-sm">Cancel</button>
                <button type="submit" disabled={loading} className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-500 disabled:opacity-50 font-bold text-sm shadow-[0_0_15px_rgba(16,185,129,0.3)]">Save Candidate</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

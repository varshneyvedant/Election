'use client';

import { useState } from 'react';
import { castPublicVote } from './actions';
import type { Candidate } from './db';

export default function PublicKioskClient({ candidates }: { candidates: Candidate[] }) {
  const [step, setStep] = useState<'verify' | 'welcome' | 'vote' | 'success'>('verify');
  const [voterId, setVoterId] = useState('');
  const [name, setName] = useState('');
  const [receiptCode, setReceiptCode] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const rollStr = voterId.trim();
    if (!rollStr) {
      setError('Please enter your Roll Number.');
      return;
    }
    const rollNo = parseInt(rollStr, 10);
    if (isNaN(rollNo) || rollNo < 1 || rollNo > 30) {
      setError('Invalid Roll No. Must be a number between 1 and 30.');
      return;
    }
    // Normalize it visually
    setVoterId(rollNo.toString());
    setError('');
    setStep('welcome');
    // Auto transition to ballot after 2.5s
    setTimeout(() => {
      setStep('vote');
    }, 2500);
  };

  const handleVote = async (candidateId: string, _candidateName: string) => {
    setIsSubmitting(true);
    setError('');

    const res = await castPublicVote(voterId, name, candidateId);

    if (res.error) {
      setError(res.error);
      setIsSubmitting(false);
      if (res.error.includes('already cast')) {
        setStep('verify');
      }
    } else {
      // Generate a random 8 char hex receipt
      const code = Math.random().toString(16).substring(2, 10).toUpperCase();
      setReceiptCode(code);
      setStep('success');
      
      // Reset for next voter after 6 seconds
      setTimeout(() => {
        setVoterId('');
        setName('');
        setReceiptCode('');
        setStep('verify');
        setIsSubmitting(false);
      }, 6000);
    }
  };

  if (step === 'welcome') {
    return (
      <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 shadow-lg rounded-2xl p-12 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-500/50">
          <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h2 className="text-3xl font-light text-slate-300 mb-2">Identity Verified</h2>
        <h1 className="text-4xl font-bold text-white mb-6 uppercase tracking-wider">{name || voterId}</h1>
        <p className="text-indigo-400 font-medium animate-pulse">Preparing your secure ballot...</p>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 shadow-lg rounded-2xl p-8 md:p-12 text-center animate-in slide-in-from-bottom-8 duration-500">
        <div className="bg-emerald-500/20 text-emerald-400 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">Vote Cast Successfully</h2>
        <p className="text-slate-400 text-lg mb-8">Your vote has been securely recorded.</p>
        
        {/* VVPAT Receipt Simulation */}
        <div className="bg-[#1e293b] border border-slate-700 rounded-lg p-6 max-w-sm mx-auto mb-8 animate-print relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50"></div>
          <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Digital Receipt</p>
          <p className="text-2xl font-mono text-indigo-300 tracking-[0.25em]">{receiptCode}</p>
        </div>

        <p className="text-slate-500 text-sm font-medium animate-pulse flex items-center justify-center gap-2">
          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          Resetting kiosk for the next voter...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 shadow-lg rounded-2xl overflow-hidden">
      
      {error && (
        <div className="bg-red-500/10 text-red-400 p-4 text-center border-b border-red-500/20 font-medium">
          {error}
        </div>
      )}

      {step === 'verify' && (
        <div className="p-8 md:p-12 animate-in fade-in">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">Voter Authorization</h2>
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                VOTER ID (ROLL NO 1-30) <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                value={voterId}
                onChange={(e) => setVoterId(e.target.value)}
                className="w-full px-4 py-4 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none text-xl uppercase tracking-widest transition-all"
                placeholder="ENTER ROLL NO"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-2">
                FULL NAME (Optional)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-4 rounded-xl bg-slate-900/50 border border-slate-700 text-white placeholder-slate-600 focus:ring-2 focus:ring-indigo-500 outline-none text-lg transition-all"
                placeholder="Enter your name"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] text-lg mt-8 active:scale-[0.98]"
            >
              PROCEED TO BALLOT
            </button>
          </form>
        </div>
      )}

      {step === 'vote' && (
        <div className="p-8 md:p-12 animate-in fade-in duration-500">
          <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-700/50">
            <div>
              <h2 className="text-2xl font-bold text-white">Official Ballot</h2>
              <p className="text-slate-400 mt-1">Voting as: <span className="font-semibold text-indigo-400 uppercase">{voterId}</span></p>
            </div>
            <button 
              onClick={() => setStep('verify')}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-sm font-medium disabled:opacity-50 border border-slate-700"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {candidates.map((candidate) => (
              <button
                key={candidate.id}
                onClick={() => handleVote(candidate.id, candidate.name)}
                disabled={isSubmitting}
                className="group relative bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex flex-col items-center hover:bg-slate-800 hover:border-indigo-500 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:scale-100 disabled:hover:border-slate-700 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/0 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="mb-6 w-20 h-20 bg-slate-900 border border-slate-700 text-slate-300 rounded-full flex items-center justify-center text-3xl font-bold uppercase group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-500 transition-all shadow-inner group-hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] z-10">
                  {candidate.name.charAt(0)}
                </div>
                
                <h3 className="text-2xl font-bold text-white text-center mb-6 z-10">{candidate.name}</h3>
                
                <div className="w-full bg-slate-900/50 border border-slate-700 group-hover:bg-indigo-600 group-hover:border-indigo-500 text-slate-400 group-hover:text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 z-10">
                  <span className="w-3 h-3 rounded-full bg-slate-700 group-hover:bg-white group-hover:shadow-[0_0_10px_#fff]"></span>
                  VOTE
                </div>
              </button>
            ))}
            {candidates.length === 0 && (
              <div className="col-span-full text-center py-12 text-slate-500">
                No candidates available on the ballot.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

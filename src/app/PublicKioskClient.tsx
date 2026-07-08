'use client';

import { useState, useRef, useEffect } from 'react';
import { castPublicVote, getLiveTurnout, verifyVoterKey } from './public-actions';
import { Candidate } from '@prisma/client';
import * as htmlToImage from 'html-to-image';

export default function PublicKioskClient({ candidates }: { candidates: Candidate[] }) {
  const [step, setStep] = useState<'verify' | 'welcome' | 'vote' | 'success'>('verify');
  const [voterId, setVoterId] = useState('');
  const [voterKey, setVoterKey] = useState('');
  const [receiptCode, setReceiptCode] = useState('');
  
  const [turnout, setTurnout] = useState(0);
  const [confirmingCandidate, setConfirmingCandidate] = useState<{id: string, name: string} | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  const receiptRef = useRef<HTMLDivElement>(null);

  // Auto-poll turnout
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (step === 'verify') {
      const fetchTurnout = async () => {
        const t = await getLiveTurnout();
        setTurnout(t);
      };
      fetchTurnout();
      interval = setInterval(fetchTurnout, 3000);
    }
    return () => clearInterval(interval);
  }, [step]);

  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!voterId) {
      setError('Please select your Roll Number.');
      return;
    }
    if (voterKey.trim().length !== 6) {
      setError('Please enter your 6-character Secret Voter Key.');
      return;
    }
    
    // VERIFY WITH SERVER FIRST
    setError('Verifying secure key...');
    const res = await verifyVoterKey(voterId, voterKey.trim().toUpperCase());
    if (res.error) {
      setError(res.error);
      return;
    }

    setError('');
    setStep('welcome');
    // Auto transition to ballot after 2.5s
    setTimeout(() => {
      setStep('vote');
    }, 2500);
  };

  const submitVote = async () => {
    if (!confirmingCandidate) return;
    setIsSubmitting(true);
    setError('');

    const formData = new FormData();
    formData.append('voterId', voterId);
    formData.append('voterKey', voterKey.trim().toUpperCase());
    formData.append('candidateId', confirmingCandidate.id);

    const res = await castPublicVote(formData);

    if (res.error) {
      setError(res.error);
      setIsSubmitting(false);
      setConfirmingCandidate(null);
      if (res.error.includes('already cast') || res.error.includes('already been cast')) {
        setStep('verify');
      }
    } else {
      setReceiptCode(res.receiptCode || Math.random().toString(16).substring(2, 10).toUpperCase());
      setConfirmingCandidate(null);
      setStep('success');
    }
  };

  const handleDownloadReceipt = async () => {
    if (receiptRef.current) {
      setDownloading(true);
      try {
        const dataUrl = await htmlToImage.toPng(receiptRef.current, { backgroundColor: '#1e293b' });
        const link = document.createElement('a');
        link.download = `Amity_Vote_Receipt_${voterId}.png`;
        link.href = dataUrl;
        link.click();
      } catch (err) {
        console.error('Failed to generate receipt', err);
      }
      setDownloading(false);
    }
  };

  const resetKiosk = () => {
    setVoterId('');
    setVoterKey('');
    setReceiptCode('');
    setStep('verify');
    setIsSubmitting(false);
  };

  if (step === 'welcome') {
    return (
      <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 shadow-lg rounded-2xl p-12 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-500/50">
          <svg className="w-12 h-12 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
        </div>
        <h2 className="text-3xl font-light text-slate-300 mb-2">Identity Verified</h2>
        <h1 className="text-4xl font-bold text-white mb-6 uppercase tracking-wider">Roll No. {voterId}</h1>
        <p className="text-indigo-400 font-medium animate-pulse">Preparing your secure ballot...</p>
      </div>
    );
  }

  if (step === 'success') {
    return (
      <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 shadow-lg rounded-2xl p-8 md:p-12 text-center animate-in slide-in-from-bottom-8 duration-500">
        <div className="bg-emerald-500/20 text-emerald-400 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2 tracking-tight">Vote Cast Successfully</h2>
        <p className="text-slate-400 text-lg mb-4">Your vote has been securely recorded on the server.</p>
        
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl mb-6 max-w-sm mx-auto">
          <p className="font-bold uppercase tracking-wider text-sm flex items-center justify-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            STOP! IMPORTANT
          </p>
          <p className="text-xs mt-1">Please download your official VVPAT receipt to your camera roll before closing this page as proof of voting.</p>
        </div>

        {/* Instagram Graphic Receipt Simulation */}
        <div ref={receiptRef} className="w-[300px] h-[533px] mx-auto mb-8 relative rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 flex flex-col justify-between p-6">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
          
          <div className="relative z-10 text-center mt-8">
            <h4 className="text-white font-black tracking-[0.3em] uppercase text-xs mb-1 opacity-80">Amity Elections</h4>
            <div className="h-px w-12 bg-white/30 mx-auto"></div>
            <p className="text-[10px] text-white/50 mt-2 font-bold tracking-widest">2026</p>
          </div>

          <div className="relative z-10 text-center flex-grow flex flex-col justify-center items-center">
            <div className="w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mb-6 border border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.1)]">
              <span className="text-5xl">🗳️</span>
            </div>
            <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70 tracking-tighter mb-2" style={{ textShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
              I VOTED
            </h2>
            <p className="text-indigo-300 font-bold tracking-widest text-sm uppercase">Did you?</p>
          </div>

          <div className="relative z-10 text-center bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/10">
            <p className="text-[8px] text-white/40 uppercase tracking-widest mb-1">Official Verification Hash</p>
            <p className="text-xs font-mono text-white/70 tracking-[0.2em]">{receiptCode}</p>
            <p className="text-[8px] text-white/30 mt-1">ID: {voterId} &bull; {new Date().toLocaleTimeString()}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-2">
          <button 
            onClick={handleDownloadReceipt}
            disabled={downloading}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 px-8 rounded-xl transition-colors disabled:opacity-50 shadow-[0_0_20px_rgba(79,70,229,0.3)] w-full sm:w-auto text-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
            {downloading ? 'Downloading...' : 'DOWNLOAD RECEIPT'}
          </button>
        </div>
        <button 
          onClick={resetKiosk}
          className="mt-6 text-slate-500 hover:text-slate-300 text-sm underline decoration-slate-700 underline-offset-4"
        >
          I have saved my receipt, Log Out
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700/50 shadow-lg rounded-2xl overflow-hidden relative">
      
      {error && (
        <div className="bg-red-500/10 text-red-400 p-4 text-center border-b border-red-500/20 font-medium">
          {error}
        </div>
      )}

      {step === 'verify' && (
        <div className="p-6 md:p-10 animate-in fade-in">
          <div className="flex flex-col items-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Voter Authorization</h2>
            <div className="bg-indigo-900/50 border border-indigo-500/30 text-indigo-300 px-4 py-2 rounded-full text-sm font-bold tracking-widest flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
              </span>
              LIVE TURNOUT: {turnout} / 30 VOTES CAST
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-bold text-slate-400 mb-4 text-center uppercase tracking-widest">
              Tap Your Roll Number
            </label>
            <div className="grid grid-cols-5 gap-2 md:gap-3 max-w-lg mx-auto">
              {Array.from({length: 30}, (_, i) => i + 1).map(num => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setVoterId(num.toString())}
                  className={`py-3 rounded-lg font-bold text-lg transition-all border ${
                    voterId === num.toString() 
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.5)] scale-110 z-10' 
                    : 'bg-slate-900/50 text-slate-400 border-slate-700 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
          
          {voterId && (
            <div className="max-w-lg mx-auto mb-6 animate-in slide-in-from-top-4 fade-in duration-300">
              <label className="block text-sm font-bold text-amber-400 mb-2 text-center uppercase tracking-widest">
                Enter Secret Voter Key for Roll No. {voterId}
              </label>
              <input 
                type="text" 
                value={voterKey}
                onChange={(e) => setVoterKey(e.target.value.toUpperCase())}
                placeholder="6-CHAR KEY"
                maxLength={6}
                className="w-full bg-slate-900/80 border-2 border-amber-500/50 rounded-xl px-4 py-4 text-center text-2xl font-mono text-white placeholder:text-slate-600 focus:outline-none focus:border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
              />
            </div>
          )}

          <div className="max-w-lg mx-auto">
            <button
              onClick={() => handleVerify()}
              disabled={!voterId || voterKey.length !== 6}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)] disabled:shadow-none text-lg active:scale-[0.98]"
            >
              PROCEED TO BALLOT
            </button>
          </div>
        </div>
      )}

      {step === 'vote' && (
        <div className="p-8 md:p-12 animate-in fade-in duration-500 relative">
          
          {confirmingCandidate && (
            <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm z-50 flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="bg-slate-800 border border-slate-600 rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
                <div className="w-20 h-20 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6 border border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                  <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Confirm Your Vote</h3>
                <p className="text-slate-300 text-lg mb-8">
                  You are about to cast your official, permanent vote for <span className="font-black text-white uppercase bg-slate-700 px-2 py-1 rounded">{confirmingCandidate.name}</span>. Are you absolutely sure?
                </p>
                <div className="flex gap-4">
                  <button 
                    onClick={() => setConfirmingCandidate(null)}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-700 text-white font-bold hover:bg-slate-600 transition-colors disabled:opacity-50"
                  >
                    CANCEL
                  </button>
                  <button 
                    onClick={submitVote}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 rounded-xl bg-emerald-600 text-white font-black tracking-widest hover:bg-emerald-500 transition-colors shadow-[0_0_20px_rgba(16,185,129,0.4)] disabled:opacity-50"
                  >
                    {isSubmitting ? 'CASTING...' : 'YES, VOTE'}
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mb-8 pb-6 border-b border-slate-700/50">
            <div>
              <h2 className="text-2xl font-bold text-white">Official Ballot</h2>
              <p className="text-slate-400 mt-1">Voting as: <span className="font-semibold text-indigo-400 uppercase">Roll No. {voterId}</span></p>
            </div>
            <button 
              onClick={() => setStep('verify')}
              disabled={isSubmitting || confirmingCandidate !== null}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors text-sm font-medium disabled:opacity-50 border border-slate-700"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {candidates.map((candidate) => (
              <button
                key={candidate.id}
                onClick={() => setConfirmingCandidate({ id: candidate.id, name: candidate.name })}
                disabled={isSubmitting || confirmingCandidate !== null}
                className="group relative bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex flex-col items-center hover:bg-slate-800 hover:border-indigo-500 transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:scale-100 disabled:hover:border-slate-700 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/0 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div className="mb-6 w-20 h-20 bg-slate-900 border border-slate-700 text-slate-300 rounded-full flex items-center justify-center text-3xl font-bold uppercase group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-500 transition-all shadow-inner group-hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] z-10">
                  {candidate.name.charAt(0)}
                </div>
                
                <h3 className="text-2xl font-bold text-white text-center mb-6 z-10">{candidate.name}</h3>
                
                <div className="w-full bg-slate-900/50 border border-slate-700 group-hover:bg-indigo-600 group-hover:border-indigo-500 text-slate-400 group-hover:text-white font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-2 z-10">
                  <span className="w-3 h-3 rounded-full bg-slate-700 group-hover:bg-white group-hover:shadow-[0_0_10px_#fff]"></span>
                  SELECT
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

'use client';

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()}
      className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-colors print:hidden"
    >
      PRINT TICKETS NOW
    </button>
  );
}

'use client';
import { useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function PrintButton() {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      const element = document.getElementById('ticket-container');
      if (!element) return;
      
      const canvas = await html2canvas(element, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('Amity_Voter_Tickets.pdf');
    } catch (err) {
      console.error('Failed to generate PDF', err);
    }
    setLoading(false);
  };

  return (
    <button 
      onClick={handleDownload}
      disabled={loading}
      className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 transition-colors print:hidden disabled:opacity-50"
    >
      {loading ? 'GENERATING PDF...' : 'DOWNLOAD TICKETS (PDF)'}
    </button>
  );
}

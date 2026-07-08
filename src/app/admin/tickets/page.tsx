import prisma from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyAuth } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export default async function TicketsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('auth_token')?.value;

  if (!token) {
    redirect('/login');
  }

  const payload = await verifyAuth(token);
  if (!payload || payload.role !== 'admin') {
    redirect('/admin'); // Only full admins should print tickets
  }

  const students = await prisma.user.findMany({
    where: { role: 'student' },
    orderBy: { username: 'asc' }
  });

  return (
    <div className="bg-white min-h-screen font-sans text-black">
      <div className="p-8 print:p-0 max-w-5xl mx-auto">
        <div className="mb-8 print:hidden flex justify-between items-center bg-indigo-50 border border-indigo-100 p-6 rounded-2xl">
          <div>
            <h1 className="text-2xl font-bold text-indigo-900">Official Voter Keys</h1>
            <p className="text-indigo-600">Print this page and cut out the individual tickets for distribution.</p>
          </div>
          <button 
            className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:bg-indigo-700 print:hidden"
            id="print-btn"
          >
            PRINT TICKETS NOW
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 print:grid-cols-3 print:gap-4 print:w-[210mm]">
          {students.map((student, index) => (
            <div key={student.id} className="border-2 border-black border-dashed p-4 relative bg-white break-inside-avoid">
              <div className="flex items-center justify-between mb-4 border-b-2 border-black pb-2">
                <img src="https://amityschools.in/mayurvihar/wp-content/uploads/2019/11/cropped-aisn_0001-e1573809503547-1.png" alt="Amity Logo" className="h-8 w-auto grayscale" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Official Ballot Key</span>
              </div>
              <div className="text-center mb-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Student</p>
                <h2 className="text-2xl font-black">{student.name}</h2>
                <p className="text-sm font-mono text-gray-600 mt-1">ID: {student.username}</p>
              </div>
              <div className="bg-gray-100 border-2 border-gray-300 p-3 text-center rounded-lg">
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">Secret Key</p>
                <p className="text-xl font-mono font-bold tracking-[0.2em]">{student.password}</p>
              </div>
              <p className="text-[8px] text-center text-gray-400 mt-3 font-mono">TICKET #{index + 1} • DO NOT SHARE</p>
            </div>
          ))}
        </div>
      </div>
      
      <script dangerouslySetInnerHTML={{__html: `
        document.getElementById('print-btn').addEventListener('click', function() {
          window.print();
        });
      `}} />
    </div>
  );
}

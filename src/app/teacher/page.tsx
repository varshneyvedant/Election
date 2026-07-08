import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import { redirect } from 'next/navigation';
import ResultsLock from '@/components/ResultsLock';

export default async function TeacherDashboard() {
  const session = await getSession();
  
  if (!session || session.role !== 'teacher') {
    redirect('/api/auth/logout');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id }
  });

  if (!user) {
    redirect('/api/auth/logout');
  }

  // Fetch election status
  const election = await prisma.election.findUnique({ where: { id: 1 } });
  
  // Fetch Candidates and their vote counts
  const candidates = await prisma.candidate.findMany({
    include: {
      _count: {
        select: { votes: true }
      }
    },
    orderBy: { name: 'asc' }
  });

  const totalVotes = candidates.reduce((acc, c) => acc + c._count.votes, 0);

  // Fetch Students who have voted
  const votedStudents = await prisma.user.findMany({
    where: { role: 'student', hasVoted: true },
    select: { name: true, username: true },
    orderBy: { name: 'asc' }
  });

  // Fetch total students to show percentage
  const totalStudents = await prisma.user.count({
    where: { role: 'student' }
  });

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar role="teacher" name={user.name || user.username} />
      
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <ResultsLock>
          {/* Top Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center">
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Votes</span>
              <span className="text-4xl font-bold text-blue-600 mt-2">{totalVotes}</span>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center">
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Students Voted</span>
              <span className="text-4xl font-bold text-green-600 mt-2">
                {votedStudents.length} <span className="text-xl text-slate-400">/ {totalStudents}</span>
              </span>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center">
              <span className="text-sm font-medium text-slate-500 uppercase tracking-wider">Election Status</span>
              <span className={`text-2xl font-bold mt-2 ${election?.isActive ? 'text-green-600' : 'text-red-600'}`}>
                {election?.isActive ? 'Active' : 'Closed'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
            {/* Results Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h2 className="text-lg font-semibold text-slate-800">Voting Results</h2>
              </div>
              <div className="divide-y divide-slate-200">
                {candidates.map(candidate => (
                  <div key={candidate.id} className="px-6 py-4 flex justify-between items-center hover:bg-slate-50 transition-colors">
                    <span className="font-medium text-slate-900">{candidate.name}</span>
                    <span className="font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                      {candidate._count.votes} votes
                    </span>
                  </div>
                ))}
                {candidates.length === 0 && (
                  <div className="px-6 py-8 text-center text-slate-500">No candidates available.</div>
                )}
              </div>
            </div>

            {/* Voted Students List */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                <h2 className="text-lg font-semibold text-slate-800">Students Who Voted</h2>
              </div>
              <div className="divide-y divide-slate-200 max-h-[500px] overflow-y-auto">
                {votedStudents.map((student, idx) => (
                  <div key={idx} className="px-6 py-3 flex justify-between items-center hover:bg-slate-50 transition-colors">
                    <span className="text-slate-900 font-medium">{student.name || student.username}</span>
                    <span className="text-sm text-slate-500">@{student.username}</span>
                  </div>
                ))}
                {votedStudents.length === 0 && (
                  <div className="px-6 py-8 text-center text-slate-500">No students have voted yet.</div>
                )}
              </div>
            </div>
          </div>
        </ResultsLock>
      </main>
    </div>
  );
}

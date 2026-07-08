import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import Navbar from '@/components/Navbar';
import { redirect } from 'next/navigation';
import AdminTabs from './AdminTabs';

export default async function AdminDashboard() {
  const session = await getSession();
  
  if (!session || session.role !== 'admin') {
    redirect('/api/auth/logout');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.id }
  });

  if (!user) {
    redirect('/api/auth/logout');
  }

  const [election, users, candidates, votes] = await Promise.all([
    prisma.election.findUnique({ where: { id: 1 } }),
    prisma.user.findMany({ orderBy: { role: 'asc' } }),
    prisma.candidate.findMany({
      include: {
        _count: {
          select: { votes: true }
        }
      },
      orderBy: { name: 'asc' }
    }),
    prisma.vote.findMany({
      include: {
        student: { select: { name: true, username: true } },
        candidate: { select: { name: true } }
      }
    })
  ]);

  const data = {
    election,
    users: users.map(u => ({ id: u.id, username: u.username, name: u.name, role: u.role, hasVoted: u.hasVoted })),
    candidates,
    auditLogs: votes
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] pointer-events-none"></div>
      
      <div className="relative z-10 w-full">
        <Navbar role="admin" name={user.name || user.username} />
      </div>
      
      <main className="max-w-6xl mx-auto px-4 py-8 relative z-10 w-full flex-1">
        <AdminTabs data={data} />
      </main>
    </div>
  );
}

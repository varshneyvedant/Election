export type Role = 'admin' | 'teacher' | 'student';

export interface User {
  id: string;
  username: string;
  password?: string;
  name?: string;
  role: Role;
  hasVoted: boolean;
}

export interface Candidate {
  id: string;
  name: string;
}

export interface Vote {
  id: string;
  studentId: string;
  candidateId: string;
}

export interface Election {
  id: number;
  isActive: boolean;
}

const defaultData = {
  users: [{ id: '1', username: 'amity', password: 'aismvschool', name: 'Admin', role: 'admin', hasVoted: false }] as User[],
  candidates: [] as Candidate[],
  votes: [] as Vote[],
  election: { id: 1, isActive: false } as Election
};

export const db = {
  read: () => {
    const data = localStorage.getItem('polling-booth-data');
    if (!data) return defaultData;
    return JSON.parse(data);
  },
  write: (data: any) => {
    localStorage.setItem('polling-booth-data', JSON.stringify(data));
  },
  
  // Helpers
  getUsers: () => db.read().users,
  getCandidates: () => db.read().candidates,
  getVotes: () => db.read().votes,
  getElection: () => db.read().election,

  getAdminData: () => {
    const data = db.read();
    const candidateVotes = data.candidates.map((c: any) => ({
      ...c,
      _count: { votes: data.votes.filter((v: any) => v.candidateId === c.id).length }
    }));
    const auditLogs = data.votes.map((v: any) => ({
      id: v.id,
      student: data.users.find((u: any) => u.id === v.studentId) || { username: 'unknown', name: 'unknown' },
      candidate: data.candidates.find((c: any) => c.id === v.candidateId) || { name: 'unknown' }
    }));
    return { ...data, candidates: candidateVotes, auditLogs };
  }
};

import { db } from './db';

export const addUser = async (formData: any) => {
  const data = db.read();
  if (data.users.find((u: any) => u.username === formData.username)) {
    return { error: 'Username already exists' };
  }
  data.users.push({
    id: Math.random().toString(),
    ...formData,
    hasVoted: false
  });
  db.write(data);
  return { success: true };
};

export const updateUser = async (id: string, formData: any) => {
  const data = db.read();
  const index = data.users.findIndex((u: any) => u.id === id);
  if (index === -1) return { error: 'User not found' };
  data.users[index] = { ...data.users[index], ...formData };
  db.write(data);
  return { success: true };
};

export const deleteUser = async (id: string) => {
  const data = db.read();
  data.users = data.users.filter((u: any) => u.id !== id);
  db.write(data);
  return { success: true };
};

export const addCandidate = async (name: string) => {
  const data = db.read();
  data.candidates.push({ id: Math.random().toString(), name });
  db.write(data);
  return { success: true };
};

export const updateCandidate = async (id: string, name: string) => {
  const data = db.read();
  const index = data.candidates.findIndex((c: any) => c.id === id);
  if (index === -1) return { error: 'Candidate not found' };
  data.candidates[index].name = name;
  db.write(data);
  return { success: true };
};

export const deleteCandidate = async (id: string) => {
  const data = db.read();
  data.candidates = data.candidates.filter((c: any) => c.id !== id);
  db.write(data);
  return { success: true };
};

export const toggleElection = async (status: boolean) => {
  const data = db.read();
  data.election.isActive = status;
  db.write(data);
  return { success: true };
};

export const resetElection = async () => {
  const data = db.read();
  data.votes = [];
  // Keep only admins/teachers, completely delete all auto-registered students
  data.users = data.users.filter((u: any) => u.role !== 'student');
  db.write(data);
  return { success: true };
};

export const castPublicVote = async (voterIdRaw: string, _name: string, candidateId: string) => {
  const data = db.read();
  if (!data.election.isActive) return { error: 'Election is closed.' };
  
  const rollNo = parseInt(voterIdRaw, 10);
  if (isNaN(rollNo) || rollNo < 1 || rollNo > 30) {
    return { error: 'Invalid Roll No. Must be a number between 1 and 30.' };
  }
  const voterId = rollNo.toString();

  let user = data.users.find((u: any) => u.username === voterId && u.role === 'student');
  
  if (!user) {
    user = {
      id: Math.random().toString(),
      username: voterId,
      name: _name || `Student ${voterId}`,
      role: 'student',
      hasVoted: false
    };
    data.users.push(user);
  }

  if (user.hasVoted) return { error: 'Vote already cast for this Roll No.' };

  user.hasVoted = true;
  data.votes.push({
    id: Math.random().toString(),
    studentId: user.id,
    candidateId
  });
  
  db.write(data);
  return { success: true };
};

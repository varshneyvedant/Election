'use server';

import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { revalidatePath } from 'next/cache';

async function checkAdmin() {
  const session = await getSession();
  if (!session || session.role !== 'admin') {
    throw new Error('Unauthorized');
  }
}

async function checkElectionLock() {
  const election = await prisma.election.findUnique({ where: { id: 1 } });
  if (election?.isActive) {
    throw new Error('ELECTION LOCKDOWN: Cannot modify data while election is live.');
  }
}

// User Management
export async function addUser(data: any) {
  await checkAdmin();
  const hashedPassword = await bcrypt.hash(data.password, 10);
  
  try {
    await prisma.user.create({
      data: {
        username: data.username,
        password: hashedPassword,
        name: data.name,
        role: data.role,
      }
    });
    revalidatePath('/admin');
    return { success: true };
  } catch (e) {
    return { error: 'Failed to add user. Username might exist.' };
  }
}

export async function deleteUser(id: string) {
  await checkAdmin();
  try {
    await prisma.user.delete({ where: { id } });
    revalidatePath('/admin');
    return { success: true };
  } catch (e) {
    return { error: 'Failed to delete user' };
  }
}

export async function updateUser(id: string, data: any) {
  await checkAdmin();
  try {
    const updateData: any = {
      username: data.username,
      name: data.name,
      role: data.role,
    };
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }
    await prisma.user.update({
      where: { id },
      data: updateData,
    });
    revalidatePath('/admin');
    return { success: true };
  } catch (e) {
    return { error: 'Failed to update user' };
  }
}

// Candidate Management
export async function addCandidate(name: string, slogan: string) {
  await checkAdmin();
  await checkElectionLock();
  try {
    await prisma.candidate.create({ data: { name, slogan } });
    revalidatePath('/admin');
    return { success: true };
  } catch (e: any) {
    return { error: e.message || 'Failed to add candidate' };
  }
}

export async function deleteCandidate(id: string) {
  await checkAdmin();
  await checkElectionLock();
  try {
    await prisma.$transaction([
      prisma.vote.deleteMany({ where: { candidateId: id } }),
      prisma.candidate.delete({ where: { id } })
    ]);
    revalidatePath('/admin');
    return { success: true };
  } catch (e: any) {
    return { error: e.message || 'Failed to delete candidate' };
  }
}

export async function updateCandidate(id: string, name: string, slogan: string) {
  await checkAdmin();
  try {
    await prisma.candidate.update({
      where: { id },
      data: { name, slogan },
    });
    revalidatePath('/admin');
    return { success: true };
  } catch (e) {
    return { error: 'Failed to update candidate' };
  }
}

// Election Controls
export async function toggleElection(isActive: boolean) {
  await checkAdmin();
  try {
    if (isActive) {
      // PRE-GENERATE ALL 30 STUDENTS WITH SECRET KEYS
      await prisma.user.deleteMany({ where: { role: 'student' } });
      
      const newStudents = [];
      for (let i = 1; i <= 30; i++) {
        const secretKey = Math.random().toString(36).substring(2, 8).toUpperCase();
        newStudents.push({
          username: i.toString(),
          password: secretKey, // Stored as plain-text because it's a 1-time access code
          name: `Roll No. ${i}`,
          role: 'student',
          hasVoted: false
        });
      }
      await prisma.user.createMany({ data: newStudents });
    }

    await prisma.election.upsert({
      where: { id: 1 },
      update: { isActive },
      create: { id: 1, isActive }
    });
    revalidatePath('/admin');
    return { success: true };
  } catch (e: any) {
    return { error: e.message || 'Failed to toggle election status' };
  }
}

export async function toggleResults(resultsPublished: boolean) {
  await checkAdmin();
  try {
    await prisma.election.upsert({
      where: { id: 1 },
      update: { resultsPublished },
      create: { id: 1, resultsPublished }
    });
    revalidatePath('/admin');
    revalidatePath('/results');
    return { success: true };
  } catch (e: any) {
    return { error: e.message || 'Failed to toggle results status' };
  }
}

export async function resetElection() {
  await checkAdmin();
  await checkElectionLock();
  try {
    await prisma.$transaction([
      prisma.vote.deleteMany({}),
      prisma.user.deleteMany({
        where: { role: 'student' }
      }),
      prisma.election.upsert({
        where: { id: 1 },
        update: { isActive: false },
        create: { id: 1, isActive: false }
      })
    ]);
    revalidatePath('/admin');
    return { success: true };
  } catch (e: any) {
    return { error: e.message || 'Failed to reset election' };
  }
}

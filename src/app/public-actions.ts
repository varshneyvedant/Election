'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function castPublicVote(formData: FormData) {
  try {
    const voterIdRaw = formData.get('voterId') as string;
    const name = formData.get('name') as string || '';
    const candidateId = formData.get('candidateId') as string;

    // Check if election is active
    const election = await prisma.election.findUnique({ where: { id: 1 } });
    if (!election || !election.isActive) {
      return { error: 'Election is currently closed.' };
    }

    // Strict 1-30 Validation
    const rollNo = parseInt(voterIdRaw.trim(), 10);
    if (isNaN(rollNo) || rollNo < 1 || rollNo > 30) {
      return { error: 'Invalid Roll No. Must be a number between 1 and 30.' };
    }
    const username = rollNo.toString();

    // Check if candidate exists
    const candidate = await prisma.candidate.findUnique({ where: { id: candidateId } });
    if (!candidate) {
      return { error: 'Invalid candidate.' };
    }

    // Check if Roll No already voted
    const existingVoter = await prisma.user.findUnique({ where: { username } });
    if (existingVoter) {
      return { error: 'Error: A vote has already been cast for this Roll Number.' };
    }

    // Generate unique VVPAT receipt code
    const receiptCode = Math.random().toString(16).substring(2, 10).toUpperCase();

    // Cast vote and register the voter atomically
    await prisma.user.create({
      data: {
        username: username,
        password: 'public_voter_no_login', // They cannot log in with this
        name: name.trim() || `Roll No. ${username}`,
        role: 'student',
        hasVoted: true,
        votes: {
          create: {
            candidateId: candidateId
          }
        }
      }
    });

    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true, receiptCode };

  } catch (error: any) {
    console.error('Vote Error:', error);
    return { error: 'An unexpected error occurred while casting your vote.' };
  }
}

export async function getLiveTurnout() {
  try {
    const count = await prisma.vote.count();
    return count;
  } catch (err) {
    return 0;
  }
}

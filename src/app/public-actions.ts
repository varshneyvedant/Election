'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function castPublicVote(formData: FormData) {
  try {
    const voterIdRaw = formData.get('voterId') as string;
    const name = formData.get('name') as string || '';
    const candidateId = formData.get('candidateId') as string;

    const voterKey = formData.get('voterKey') as string;

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

    // 1. Fetch the pre-registered user
    const existingVoter = await prisma.user.findUnique({ where: { username } });
    if (!existingVoter) {
      return { error: 'Student record not found. Election might not be initialized properly.' };
    }
    
    // 2. Validate Key
    if (!voterKey || existingVoter.password !== voterKey.trim().toUpperCase()) {
      return { error: 'Invalid Secret Voter Key for this Roll Number.' };
    }

    // Generate unique VVPAT receipt code
    const receiptCode = Math.random().toString(16).substring(2, 10).toUpperCase();

    // 3. ATOMIC UPDATE to prevent race condition (double voting)
    try {
      await prisma.$transaction(async (tx) => {
        // Attempt to mark as voted. If already voted, this will update 0 rows
        const updated = await tx.user.updateMany({
          where: { username, hasVoted: false },
          data: { hasVoted: true }
        });
        
        if (updated.count === 0) {
          throw new Error('A vote has already been securely cast for this Roll Number.');
        }

        await tx.vote.create({
          data: {
            studentId: existingVoter.id,
            candidateId: candidateId
          }
        });
      });
    } catch (txError: any) {
      return { error: txError.message || 'Error processing vote.' };
    }

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

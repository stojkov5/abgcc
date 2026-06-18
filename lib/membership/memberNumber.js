import { prisma } from "@/lib/prisma";

const START = 10014;

/**
 * Assigns the next sequential member number to a user (starting at 10014),
 * unless they already have one. Idempotent — renewing members keep the same
 * number. Returns the member number.
 */
export async function assignMemberNumber(userId) {
  const existing = await prisma.user.findUnique({
    where: { id: userId },
    select: { memberNumber: true },
  });

  if (existing?.memberNumber) return existing.memberNumber;

  // Try a few times in case two activations race for the same next number.
  for (let attempt = 0; attempt < 5; attempt++) {
    const max = await prisma.user.aggregate({ _max: { memberNumber: true } });
    const next = max._max.memberNumber ? max._max.memberNumber + 1 : START;

    try {
      const updated = await prisma.user.update({
        where: { id: userId },
        data: { memberNumber: next },
        select: { memberNumber: true },
      });
      return updated.memberNumber;
    } catch (error) {
      // Unique-constraint clash on a race — recompute and retry
      if (error?.code === "P2002") continue;
      throw error;
    }
  }

  throw new Error("Could not assign a member number.");
}

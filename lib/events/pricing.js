import { prisma } from "@/lib/prisma";

// A requester counts as an ABGCC "member" for pricing only if they have a
// current (ACTIVE, non-expired) membership — matching the bar used when member
// numbers are assigned. We never trust a price sent from the client; every
// route resolves membership and computes the price here.

/**
 * Resolves whether a requester is an active member, from either:
 *   - a logged-in session (userId), or
 *   - a manually-entered member number (e.g. a member who isn't signed in).
 *
 * The session is checked first. A manually-entered number only counts if it
 * maps to a user who currently has an active membership.
 *
 * @returns {Promise<{ isMember: boolean, memberNumber: number|null, source: "session"|"number"|null }>}
 */
export async function resolveMember({ userId = null, memberNumber = null } = {}) {
  // Re-evaluate "now" per call so a long-lived process doesn't use a stale date.
  const now = new Date();

  if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        memberNumber: true,
        memberships: {
          where: { status: "ACTIVE", endDate: { gt: now } },
          select: { id: true },
          take: 1,
        },
      },
    });

    if (user?.memberships?.length) {
      return { isMember: true, memberNumber: user.memberNumber ?? null, source: "session" };
    }
  }

  if (memberNumber != null && String(memberNumber).trim() !== "") {
    const num = Number(memberNumber);

    if (Number.isInteger(num)) {
      const user = await prisma.user.findUnique({
        where: { memberNumber: num },
        select: {
          memberships: {
            where: { status: "ACTIVE", endDate: { gt: now } },
            select: { id: true },
            take: 1,
          },
        },
      });

      if (user?.memberships?.length) {
        return { isMember: true, memberNumber: num, source: "number" };
      }
    }
  }

  return { isMember: false, memberNumber: null, source: null };
}

/**
 * Computes what a given requester pays for an event.
 *
 * The member rate applies only when the event has a memberPrice set AND the
 * requester is an active member; otherwise the non-member (general) rate is used.
 *
 * @param {{ nonMemberPrice: number, memberPrice: number|null }} event
 * @param {boolean} isMember
 */
export function computeEventPrice(event, isMember) {
  const nonMemberPrice = Number(event.nonMemberPrice || 0);
  const hasMemberPrice = event.memberPrice != null;
  const memberPrice = hasMemberPrice ? Number(event.memberPrice) : null;

  const effectivePrice =
    isMember && hasMemberPrice ? memberPrice : nonMemberPrice;

  return {
    nonMemberPrice,
    memberPrice,
    effectivePrice,
    isFree: effectivePrice <= 0,
    isMember: Boolean(isMember),
  };
}

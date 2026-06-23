import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email/sendEmail";
import { membershipRenewalReminderEmail } from "@/lib/email/templates/membershipRenewalReminderEmail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DAY = 24 * 60 * 60 * 1000;

function daysUntil(now, date) {
  return Math.max(1, Math.ceil((date.getTime() - now.getTime()) / DAY));
}

async function sendReminder(membership, now, flagData) {
  if (membership.user?.email) {
    await sendEmail({
      to: membership.user.email,
      subject: "Your ABGCC membership is expiring soon",
      html: membershipRenewalReminderEmail({
        name: membership.user.name,
        tierName: membership.tier?.title,
        renewalDate: membership.endDate.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        daysLeft: daysUntil(now, membership.endDate),
      }),
    });
  }

  await prisma.membership.update({
    where: { id: membership.id },
    data: flagData,
  });
}

// Daily cron (via vercel.json) — emails members 30 and 7 days before their
// membership expires. Idempotent: per-term flags prevent duplicate sends.
export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return Response.json(
      { message: "CRON_SECRET is not configured." },
      { status: 500 }
    );
  }

  // Vercel automatically sends this header on cron invocations when CRON_SECRET
  // is set; the same header lets you trigger the job manually.
  if (request.headers.get("authorization") !== `Bearer ${secret}`) {
    return Response.json({ message: "Unauthorized." }, { status: 401 });
  }

  const now = new Date();
  const in7 = new Date(now.getTime() + 7 * DAY);
  const in30 = new Date(now.getTime() + 30 * DAY);

  const include = {
    user: { select: { email: true, name: true } },
    tier: { select: { title: true } },
  };

  // 7-day window (most urgent), then the 30-day window (8–30 days out).
  const dueSoon = await prisma.membership.findMany({
    where: {
      status: "ACTIVE",
      endDate: { gt: now, lte: in7 },
      reminder7SentAt: null,
    },
    include,
  });

  const upcoming = await prisma.membership.findMany({
    where: {
      status: "ACTIVE",
      endDate: { gt: in7, lte: in30 },
      reminder30SentAt: null,
    },
    include,
  });

  let sent7 = 0;
  let sent30 = 0;
  let failed = 0;

  for (const membership of dueSoon) {
    try {
      // Mark both so the 30-day reminder can't fire afterwards for this term.
      await sendReminder(membership, now, {
        reminder7SentAt: now,
        reminder30SentAt: now,
      });
      sent7++;
    } catch (error) {
      failed++;
      console.error("REMINDER_7_ERROR:", membership.id, error);
    }
  }

  for (const membership of upcoming) {
    try {
      await sendReminder(membership, now, { reminder30SentAt: now });
      sent30++;
    } catch (error) {
      failed++;
      console.error("REMINDER_30_ERROR:", membership.id, error);
    }
  }

  return Response.json({ ok: true, sent7, sent30, failed });
}

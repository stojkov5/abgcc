import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { resolveMember, computeEventPrice } from "@/lib/events/pricing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Returns the price a visitor would pay for an event, given their session
// (auto-detected member) and/or a manually-entered member number. Drives the
// live pricing UI on the event page. The booking routes re-validate this.
export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const memberNumber = body?.memberNumber ?? null;

    const event = await prisma.event.findUnique({
      where: { id },
      select: { id: true, nonMemberPrice: true, memberPrice: true },
    });

    if (!event) {
      return Response.json({ message: "Event not found." }, { status: 404 });
    }

    const session = await getServerSession(authOptions);
    const userId = session?.user?.id || null;

    const { isMember, memberNumber: validNumber, source } = await resolveMember({
      userId,
      memberNumber,
    });

    const pricing = computeEventPrice(event, isMember);

    const providedNumber =
      memberNumber != null && String(memberNumber).trim() !== "";

    // Did the *typed* number specifically check out? (null when none was typed)
    const memberValid = providedNumber ? source === "number" : null;

    return Response.json({
      ...pricing,
      memberNumber: validNumber,
      memberValid,
      autoMember: source === "session",
    });
  } catch (error) {
    console.error("EVENT_QUOTE_ERROR:", error);
    return Response.json(
      { message: error?.message || "Something went wrong." },
      { status: 500 }
    );
  }
}

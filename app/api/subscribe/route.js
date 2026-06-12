import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email/sendEmail";
import { subscribeConfirmEmail } from "@/lib/email/templates/subscribeConfirmEmail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email || !isValidEmail(email.trim())) {
      return Response.json(
        { message: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();

    const existing = await prisma.subscriber.findUnique({
      where: { email: cleanEmail },
    });

    if (existing) {
      // Already subscribed — treat as success (don't reveal duplication)
      return Response.json({ message: "You're already subscribed. Thank you!" });
    }

    await prisma.subscriber.create({ data: { email: cleanEmail } });

    // Confirmation email (non-blocking)
    sendEmail({
      to: cleanEmail,
      subject: "You're subscribed to ABGCC",
      html: subscribeConfirmEmail(),
    }).catch((err) => console.error("SUBSCRIBE_CONFIRM_EMAIL_ERROR:", err));

    return Response.json({
      message: "Thank you for subscribing! Check your inbox to confirm.",
    });
  } catch (error) {
    console.error("SUBSCRIBE_ERROR:", error);
    return Response.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

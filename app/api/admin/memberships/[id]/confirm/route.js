import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { sendEmail } from "@/lib/email/sendEmail";
import { paymentSuccessEmail } from "@/lib/email/templates/paymentSuccessEmail";
import { invoiceReceiptEmail } from "@/lib/email/templates/invoiceReceiptEmail";
import { assignMemberNumber } from "@/lib/membership/memberNumber";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Admin confirms a bank-transfer payment → activates the membership.
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "SUPER_ADMIN") {
      return Response.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;

    const membership = await prisma.membership.findUnique({
      where: { id },
      include: { tier: true, user: true },
    });

    if (!membership) {
      return Response.json({ message: "Membership not found." }, { status: 404 });
    }

    const now = new Date();
    const endDate = new Date(now);
    endDate.setFullYear(endDate.getFullYear() + 1);

    // Activate the membership
    const updated = await prisma.membership.update({
      where: { id },
      data: {
        status: "ACTIVE",
        startDate: now,
        endDate,
      },
    });

    // Give the member their permanent member number (idempotent)
    await assignMemberNumber(membership.userId);

    // Record the payment so it counts toward revenue / payment history
    const amount = membership.amount ?? membership.tier.price;
    const sessionRef = `bank-${membership.invoiceReference || membership.id}`;

    const existingPayment = await prisma.payment.findUnique({
      where: { stripeSessionId: sessionRef },
    });

    if (!existingPayment) {
      await prisma.payment.create({
        data: {
          stripeSessionId: sessionRef,
          amount,
          currency: "usd",
          status: "paid",
          userId: membership.userId,
          tierId: membership.tierId,
        },
      });
    }

    // Confirmation email to the member
    if (membership.user?.email) {
      sendEmail({
        to: membership.user.email,
        subject: "Your ABGCC membership is active",
        html: paymentSuccessEmail({
          name: membership.user.name,
          tierName: membership.tier.title,
          amount: `$${amount}`,
          renewalDate: endDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        }),
      }).catch((err) => console.error("MEMBERSHIP_CONFIRM_EMAIL_ERROR:", err));

      // Receipt / invoice for the completed bank-transfer purchase
      sendEmail({
        to: membership.user.email,
        subject: "Your ABGCC payment receipt",
        html: invoiceReceiptEmail({
          name: membership.user.name,
          email: membership.user.email,
          invoiceNumber: membership.invoiceReference || `ABGCC-${membership.id.slice(-8).toUpperCase()}`,
          date: now,
          description: `${membership.tier.title} — Membership`,
          amount,
          paymentMethod: "Bank Transfer",
        }),
      }).catch((err) => console.error("MEMBERSHIP_RECEIPT_EMAIL_ERROR:", err));
    }

    revalidatePath("/admin/memberships");
    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${membership.userId}`);
    revalidatePath("/portal");

    return Response.json({
      message: "Payment confirmed and membership activated.",
      membership: updated,
    });
  } catch (error) {
    console.error("CONFIRM_BANK_TRANSFER_ERROR:", error);
    return Response.json(
      { message: error?.message || "Something went wrong." },
      { status: 500 }
    );
  }
}

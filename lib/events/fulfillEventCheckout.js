import { prisma } from "@/lib/prisma";
import { generateReference } from "@/lib/events/reference";
import { sendBookingEmails } from "@/lib/events/bookingEmails";
import { sendEmail } from "@/lib/email/sendEmail";
import { invoiceReceiptEmail } from "@/lib/email/templates/invoiceReceiptEmail";

/**
 * Creates the event booking for a paid Stripe checkout session and sends the
 * ticket + admin emails. Idempotent — safe to call from BOTH the webhook and
 * the success-page redirect; only one booking + one email is ever produced.
 *
 * @param {object} checkoutSession  A Stripe Checkout Session object
 * @returns {object|null} the booking, or null if not a valid paid event session
 */
export async function fulfillEventCheckout(checkoutSession) {
  if (!checkoutSession) return null;
  if (checkoutSession.metadata?.type !== "event") return null;
  if (checkoutSession.payment_status !== "paid") return null;

  // Already fulfilled?
  const existing = await prisma.eventBooking.findUnique({
    where: { stripeSessionId: checkoutSession.id },
  });
  if (existing) return existing;

  const { eventId, name, email, company, message, memberNumber } =
    checkoutSession.metadata;

  const eventRecord = await prisma.event.findUnique({
    where: { id: eventId },
  });
  if (!eventRecord) return null;

  let booking;
  try {
    booking = await prisma.eventBooking.create({
      data: {
        eventId,
        name,
        email,
        company: company || null,
        message: message || null,
        reference: generateReference(),
        paid: true,
        amountPaid: Number(checkoutSession.amount_total || 0) / 100,
        memberNumber: memberNumber ? Number(memberNumber) : null,
        stripeSessionId: checkoutSession.id,
        status: "CONFIRMED",
      },
    });
  } catch (error) {
    // Race between webhook and redirect — both passed the existence check.
    // The unique constraint on stripeSessionId rejects the second writer;
    // return the already-created booking WITHOUT sending a duplicate email.
    if (error?.code === "P2002") {
      return prisma.eventBooking.findUnique({
        where: { stripeSessionId: checkoutSession.id },
      });
    }
    throw error;
  }

  await sendBookingEmails(booking, eventRecord, { source: "Website (Paid)" });

  // Receipt / invoice for the completed event purchase
  await sendEmail({
    to: booking.email,
    subject: "Your ABGCC payment receipt",
    html: invoiceReceiptEmail({
      name: booking.name,
      email: booking.email,
      invoiceNumber: booking.reference,
      date: booking.createdAt,
      description: `Event Ticket — ${eventRecord.title}`,
      amount: booking.amountPaid,
      paymentMethod: "Card",
    }),
  }).catch((err) => console.error("EVENT_RECEIPT_EMAIL_ERROR:", err));

  return booking;
}

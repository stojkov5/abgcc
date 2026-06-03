import { sendEmail } from "@/lib/email/sendEmail";
import { eventTicketEmail } from "@/lib/email/templates/eventTicketEmail";
import { eventBookingAdminEmail } from "@/lib/email/templates/eventBookingAdminEmail";
import { qrImageUrl } from "@/lib/events/reference";

/**
 * Sends the attendee ticket (with QR) and, optionally, the admin notification.
 * Fire-and-forget friendly — never throws; logs errors instead.
 *
 * @param {object}  booking  EventBooking record (needs reference, name, email, company, paid, amountPaid)
 * @param {object}  event    Event record (needs title, startDate, location)
 * @param {object}  options  { notifyAdmin?: boolean, source?: string }
 */
export async function sendBookingEmails(booking, event, options = {}) {
  const { notifyAdmin = true, source = "Website" } = options;

  const qrUrl = qrImageUrl(booking.reference);

  // 1. Ticket to the attendee
  await sendEmail({
    to: booking.email,
    subject: `Your ticket — ${event.title}`,
    html: eventTicketEmail({
      name: booking.name,
      eventTitle: event.title,
      eventDate: event.startDate,
      eventLocation: event.location,
      reference: booking.reference,
      qrUrl,
      paid: booking.paid,
      amountPaid: booking.amountPaid,
    }),
  }).catch((err) => console.error("EVENT_TICKET_EMAIL_ERROR:", err));

  // 2. Notify ABGCC admin
  if (notifyAdmin) {
    const adminEmail =
      process.env.CONTACT_EMAIL ||
      process.env.ADMIN_EMAIL ||
      process.env.EMAIL_FROM;

    if (adminEmail) {
      await sendEmail({
        to: adminEmail,
        subject: `New registration: ${event.title}`,
        html: eventBookingAdminEmail({
          name: booking.name,
          email: booking.email,
          company: booking.company,
          eventTitle: event.title,
          reference: booking.reference,
          paid: booking.paid,
          amountPaid: booking.amountPaid,
          source,
        }),
        replyTo: booking.email,
      }).catch((err) => console.error("EVENT_ADMIN_EMAIL_ERROR:", err));
    }
  }
}

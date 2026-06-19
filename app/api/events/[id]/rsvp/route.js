import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateReference } from "@/lib/events/reference";
import { sendBookingEmails } from "@/lib/events/bookingEmails";
import { resolveMember, computeEventPrice } from "@/lib/events/pricing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { name, email, company, message, memberNumber } = body;

    if (!name || !email) {
      return Response.json(
        { message: "Name and email are required." },
        { status: 400 }
      );
    }

    const event = await prisma.event.findUnique({
      where: { id },
      include: { bookings: true },
    });

    if (!event || event.archived || !event.active) {
      return Response.json(
        { message: "Event is not available for RSVP." },
        { status: 404 }
      );
    }

    // Past events cannot be booked
    if (new Date(event.startDate) < new Date()) {
      return Response.json(
        { message: "This event has already taken place." },
        { status: 400 }
      );
    }

    // Resolve membership (logged-in member or a valid member number) and the
    // price this person actually pays. Never trust a price from the client.
    const session = await getServerSession(authOptions);
    const { isMember, memberNumber: validNumber } = await resolveMember({
      userId: session?.user?.id || null,
      memberNumber,
    });
    const { effectivePrice } = computeEventPrice(event, isMember);

    // Anything with a price must go through Stripe checkout, not the free RSVP.
    if (effectivePrice > 0) {
      return Response.json(
        { message: "This event requires payment. Please use the checkout." },
        { status: 400 }
      );
    }

    if (event.capacity && event.bookings.length >= event.capacity) {
      return Response.json(
        { message: "This event is sold out." },
        { status: 400 }
      );
    }

    const existingBooking = await prisma.eventBooking.findFirst({
      where: { eventId: id, email },
    });

    if (existingBooking) {
      return Response.json(
        { message: "You already registered for this event." },
        { status: 409 }
      );
    }

    const booking = await prisma.eventBooking.create({
      data: {
        eventId: id,
        name,
        email,
        company: company || null,
        message: message || null,
        reference: generateReference(),
        paid: false,
        amountPaid: 0,
        memberNumber: validNumber,
        status: "CONFIRMED",
      },
    });

    // Send ticket (with QR) to attendee + notify admin
    await sendBookingEmails(booking, event, { source: "Website RSVP" });

    revalidatePath("/events");
    revalidatePath(`/events/${event.slug}`);
    revalidatePath("/admin/events");

    return Response.json(
      {
        message: "RSVP confirmed! Check your email for your ticket and QR code.",
        booking: { id: booking.id, reference: booking.reference },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("EVENT_RSVP_ERROR:", error);
    return Response.json(
      { message: error?.message || "Something went wrong." },
      { status: 500 }
    );
  }
}

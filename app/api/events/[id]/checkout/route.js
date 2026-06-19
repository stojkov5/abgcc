import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
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
        { message: "Event is not available." },
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

    if (effectivePrice <= 0) {
      return Response.json(
        { message: "This is a free event. Please use RSVP." },
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

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: event.title,
              description: isMember
                ? `Event ticket (member rate) · ${event.location}`
                : `Event ticket · ${event.location}`,
            },
            unit_amount: Math.round(effectivePrice * 100),
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "event",
        eventId: event.id,
        name: name.slice(0, 200),
        email: email.slice(0, 200),
        company: (company || "").slice(0, 200),
        message: (message || "").slice(0, 480),
        memberNumber: validNumber != null ? String(validNumber) : "",
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/events/${event.slug}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/events/${event.slug}?canceled=1`,
    });

    return Response.json({ url: checkoutSession.url });
  } catch (error) {
    console.error("EVENT_CHECKOUT_ERROR:", error);
    return Response.json(
      { message: error?.message || "Something went wrong." },
      { status: 500 }
    );
  }
}

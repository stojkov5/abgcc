import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { name, email, company, message } = body;

    if (!name || !email) {
      return Response.json(
        { message: "Name and email are required." },
        { status: 400 }
      );
    }

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        bookings: true,
      },
    });

    if (!event || event.archived || !event.active) {
      return Response.json(
        { message: "Event is not available for RSVP." },
        { status: 404 }
      );
    }

    if (event.capacity && event.bookings.length >= event.capacity) {
      return Response.json(
        { message: "This event is sold out." },
        { status: 400 }
      );
    }

    const existingBooking = await prisma.eventBooking.findFirst({
      where: {
        eventId: id,
        email,
      },
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
      },
    });

    revalidatePath("/events");
    revalidatePath(`/events/${event.slug}`);
    revalidatePath("/admin/events");

    return Response.json(
      {
        message: "RSVP confirmed successfully.",
        booking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("EVENT_RSVP_ERROR:", error);

    return Response.json(
      {
        message: error?.message || "Something went wrong.",
      },
      { status: 500 }
    );
  }
}
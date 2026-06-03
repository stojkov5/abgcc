import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { generateReference } from "@/lib/events/reference";
import { sendBookingEmails } from "@/lib/events/bookingEmails";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "SUPER_ADMIN") {
      return Response.json({ message: "Unauthorized." }, { status: 401 });
    }

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

    if (!event) {
      return Response.json({ message: "Event not found." }, { status: 404 });
    }

    if (event.capacity && event.bookings.length >= event.capacity) {
      return Response.json(
        { message: "This event is already at full capacity." },
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
        { message: "This email is already registered for this event." },
        { status: 409 }
      );
    }

    const booking = await prisma.eventBooking.create({
      data: {
        eventId: id,
        name,
        email,
        company: company || null,
        message: message || "Added manually by admin.",
        reference: generateReference(),
        paid: false,
        amountPaid: 0,
        status: "CONFIRMED",
      },
    });

    // Email the attendee their ticket + QR (no admin notification — admin added it)
    await sendBookingEmails(booking, event, {
      notifyAdmin: false,
      source: "Admin (Manual)",
    });

    revalidatePath("/admin/events");
    revalidatePath(`/admin/events/${id}/edit`);
    revalidatePath("/events");
    revalidatePath(`/events/${event.slug}`);

    return Response.json(
      {
        message: "Attendee added and ticket emailed successfully.",
        booking,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ADD_EVENT_ATTENDEE_ERROR:", error);

    return Response.json(
      { message: error?.message || "Something went wrong." },
      { status: 500 }
    );
  }
}
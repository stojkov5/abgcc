import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "SUPER_ADMIN") {
      return Response.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const booking = await prisma.eventBooking.update({
      where: { id },
      data: {
        attended: Boolean(body.attended),
      },
      include: {
        event: true,
      },
    });

    revalidatePath("/admin/events");
    revalidatePath(`/admin/events/${booking.eventId}/edit`);
    revalidatePath(`/events/${booking.event.slug}`);

    return Response.json({
      message: "Registration updated.",
      booking,
    });
  } catch (error) {
    console.error("UPDATE_EVENT_BOOKING_ERROR:", error);

    return Response.json(
      { message: error?.message || "Something went wrong." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "SUPER_ADMIN") {
      return Response.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;

    const booking = await prisma.eventBooking.delete({
      where: { id },
      include: {
        event: true,
      },
    });

    revalidatePath("/admin/events");
    revalidatePath(`/admin/events/${booking.eventId}/edit`);
    revalidatePath(`/events/${booking.event.slug}`);

    return Response.json({
      message: "Registration deleted.",
    });
  } catch (error) {
    console.error("DELETE_EVENT_BOOKING_ERROR:", error);

    return Response.json(
      { message: error?.message || "Something went wrong." },
      { status: 500 }
    );
  }
}
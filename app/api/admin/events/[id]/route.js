import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function createSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "SUPER_ADMIN") {
      return Response.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;

    const oldEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!oldEvent) {
      return Response.json(
        { message: "Event not found." },
        { status: 404 }
      );
    }

    const body = await request.json();

    const {
      title,
      description,
      location,
      image,
      price,
      capacity,
     startDate,
      active,
      featured,
    } = body;

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title,
        slug: createSlug(title),
        description,
        location,
        image,
        price: Number(price || 0),
        capacity: capacity ? Number(capacity) : null,
        startDate: new Date(startDate),
        active: Boolean(active),
        featured: Boolean(featured),
        archived: Boolean(body.archived),
      },
    });

    revalidatePath("/events");
    revalidatePath("/admin/events");
    revalidatePath(`/events/${oldEvent.slug}`);
    revalidatePath(`/events/${updatedEvent.slug}`);

    return Response.json({
      message: "Event updated successfully.",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("UPDATE_EVENT_ERROR:", error);

    return Response.json(
      {
        message:
          error?.message || "Something went wrong while updating event.",
      },
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

    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return Response.json({ message: "Event not found." }, { status: 404 });
    }

    // EventImage and EventBooking are set to onDelete: Cascade in the schema,
    // so removing the event also removes its gallery images and registrations.
    await prisma.event.delete({
      where: { id },
    });

    revalidatePath("/events");
    revalidatePath("/admin/events");
    revalidatePath(`/events/${event.slug}`);

    return Response.json({ message: "Event deleted successfully." });
  } catch (error) {
    console.error("DELETE_EVENT_ERROR:", error);

    return Response.json(
      {
        message:
          error?.message || "Something went wrong while deleting event.",
      },
      { status: 500 }
    );
  }
}
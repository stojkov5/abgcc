import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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
      },
    });

    return Response.json({
      message: "Event updated successfully.",
      event: updatedEvent,
    });
  } catch (error) {
    console.error("UPDATE_EVENT_ERROR:", error);

    return Response.json(
      { message: error?.message || "Something went wrong." },
      { status: 500 }
    );
  }
}
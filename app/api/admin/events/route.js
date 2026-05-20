import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function createSlug(title) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "SUPER_ADMIN") {
      return Response.json({ message: "Unauthorized." }, { status: 401 });
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

    if (!title || !description || !location || !image || !startDate) {
      return Response.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    const baseSlug = createSlug(title);

    const existingEvent = await prisma.event.findUnique({
      where: {
        slug: baseSlug,
      },
    });

    const slug = existingEvent
      ? `${baseSlug}-${Date.now()}`
      : baseSlug;

    const event = await prisma.event.create({
      data: {
        title,
        slug,
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

    revalidatePath("/events");
    revalidatePath("/admin/events");
    revalidatePath(`/events/${event.slug}`);

    return Response.json({
      message: "Event created successfully.",
      event,
    });
  } catch (error) {
    console.error("CREATE_EVENT_ERROR:", error);

    return Response.json(
      {
        message:
          error?.message || "Something went wrong while creating event.",
      },
      { status: 500 }
    );
  }
}
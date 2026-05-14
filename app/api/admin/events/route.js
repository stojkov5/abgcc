import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
        { message: "Title, description, location, image, and date are required." },
        { status: 400 }
      );
    }

    const slug = createSlug(title);

    const existingEvent = await prisma.event.findUnique({
      where: { slug },
    });

    if (existingEvent) {
      return Response.json(
        { message: "An event with this title already exists." },
        { status: 409 }
      );
    }

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

    return Response.json(
      {
        message: "Event created successfully.",
        event,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE_EVENT_ERROR", error);

    return Response.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}
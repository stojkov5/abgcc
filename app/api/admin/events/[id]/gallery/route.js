import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadImageFromRequest } from "@/lib/cloudinaryUpload";

export const runtime = "nodejs";

// Adds a gallery image to an event — from a file upload OR a remote URL.
// Either way the image is stored in Cloudinary before being saved.
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "SUPER_ADMIN") {
      return Response.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;

    const secureUrl = await uploadImageFromRequest(
      request,
      "abgcc/events/gallery"
    );

    const image = await prisma.eventImage.create({
      data: {
        url: secureUrl,
        eventId: id,
      },
    });

    return Response.json({
      message: "Gallery image added.",
      image,
    });
  } catch (error) {
    console.error("UPLOAD_GALLERY_ERROR:", error);

    return Response.json(
      { message: error?.message || "Something went wrong." },
      { status: 500 }
    );
  }
}

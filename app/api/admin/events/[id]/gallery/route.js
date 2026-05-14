import { prisma } from "@/lib/prisma";
import cloudinary from "@/lib/cloudinary";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "SUPER_ADMIN") {
      return Response.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({ message: "No image uploaded." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploaded = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "abgcc/events/gallery",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(result);
        }
      );

      uploadStream.end(buffer);
    });

    const image = await prisma.eventImage.create({
      data: {
        url: uploaded.secure_url,
        eventId: id,
      },
    });

    return Response.json({
      message: "Gallery image uploaded.",
      image,
    });
  } catch (error) {
    console.error("UPLOAD_GALLERY_ERROR:", error);

    return Response.json(
      {
        message: error?.message || "Something went wrong.",
      },
      { status: 500 }
    );
  }
}
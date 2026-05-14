import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import cloudinary from "@/lib/cloudinary";

export const runtime = "nodejs";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "SUPER_ADMIN") {
      return Response.json({ message: "Unauthorized." }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return Response.json({ message: "No file uploaded." }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "abgcc/events",
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

    return Response.json({
      message: "Image uploaded successfully.",
      url: result.secure_url,
    });
  } catch (error) {
    console.error("UPLOAD_ERROR:", error);

    return Response.json(
      {
        message: error?.message || "Image upload failed.",
      },
      { status: 500 }
    );
  }
}
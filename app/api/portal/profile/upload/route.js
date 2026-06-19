import { getServerSession } from "next-auth";
import cloudinary from "@/lib/cloudinary";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Generic image upload for directory profile assets (company logo, banner).
// Returns the Cloudinary URL; the profile form persists it on save.
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
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
          folder: "abgcc/members/company",
          resource_type: "image",
          transformation: [
            { width: 1600, height: 1600, crop: "limit", quality: "auto:good" },
          ],
        },
        (error, uploaded) => {
          if (error) reject(error);
          else resolve(uploaded);
        }
      );

      uploadStream.end(buffer);
    });

    return Response.json({ url: result.secure_url });
  } catch (error) {
    console.error("PORTAL_UPLOAD_ERROR:", error);

    return Response.json(
      { message: error?.message || "Upload failed." },
      { status: 500 }
    );
  }
}

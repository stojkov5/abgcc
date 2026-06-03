import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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
          folder: "abgcc/members",
          resource_type: "image",
          // Cap & optimise on upload so even very large photos are handled
          transformation: [
            { width: 1000, height: 1000, crop: "limit", quality: "auto:good" },
          ],
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(buffer);
    });

    // Persist immediately so the photo updates without needing a full save
    await prisma.user.update({
      where: { email: session.user.email },
      data: { photo: result.secure_url },
    });

    revalidatePath("/portal");
    revalidatePath("/portal/profile");

    return Response.json({
      message: "Profile photo updated.",
      url: result.secure_url,
    });
  } catch (error) {
    console.error("PROFILE_PHOTO_UPLOAD_ERROR:", error);

    return Response.json(
      { message: error?.message || "Photo upload failed." },
      { status: 500 }
    );
  }
}

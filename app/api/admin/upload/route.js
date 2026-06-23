import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadImageFromRequest } from "@/lib/cloudinaryUpload";

export const runtime = "nodejs";

// Accepts either a multipart `file` upload or a JSON `{ url }` (remote image),
// stores it in Cloudinary, and returns the secure URL.
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "SUPER_ADMIN") {
      return Response.json({ message: "Unauthorized." }, { status: 401 });
    }

    const url = await uploadImageFromRequest(request, "abgcc/events");

    return Response.json({
      message: "Image uploaded successfully.",
      url,
    });
  } catch (error) {
    console.error("UPLOAD_ERROR:", error);

    return Response.json(
      { message: error?.message || "Image upload failed." },
      { status: 500 }
    );
  }
}

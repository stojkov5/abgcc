import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "SUPER_ADMIN") {
      return Response.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { imageId } = await params;

    await prisma.eventImage.delete({
      where: {
        id: imageId,
      },
    });

    return Response.json({
      message: "Gallery image removed.",
    });
  } catch (error) {
    console.error("DELETE_GALLERY_IMAGE_ERROR", error);

    return Response.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "SUPER_ADMIN") {
      return Response.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await params;

    const body = await request.json();

    const updatedMessage = await prisma.contactMessage.update({
      where: {
        id,
      },
      data: {
        read: body.read,
      },
    });

    revalidatePath("/admin/contact-messages");

    return Response.json({
      message: "Message updated.",
      contactMessage: updatedMessage,
    });
  } catch (error) {
    console.error("UPDATE_CONTACT_MESSAGE_ERROR:", error);

    return Response.json(
      {
        message: error?.message || "Something went wrong.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "SUPER_ADMIN") {
      return Response.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const { id } = await params;

    await prisma.contactMessage.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/contact-messages");

    return Response.json({
      message: "Message deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE_CONTACT_MESSAGE_ERROR:", error);

    return Response.json(
      {
        message: error?.message || "Something went wrong.",
      },
      { status: 500 }
    );
  }
}
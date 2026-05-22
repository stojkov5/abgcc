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
      return Response.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const { status, startDate, endDate } = body;

    const membership = await prisma.membership.update({
      where: { id },
      data: {
        status,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
      include: {
        user: true,
      },
    });

    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${membership.userId}`);
    revalidatePath("/portal");

    return Response.json({
      message: "Membership updated successfully.",
      membership,
    });
  } catch (error) {
    console.error("UPDATE_USER_MEMBERSHIP_ERROR:", error);

    return Response.json(
      { message: error?.message || "Something went wrong." },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "SUPER_ADMIN") {
      return Response.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;

    const membership = await prisma.membership.delete({
      where: { id },
    });

    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${membership.userId}`);
    revalidatePath("/portal");

    return Response.json({
      message: "Membership deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE_USER_MEMBERSHIP_ERROR:", error);

    return Response.json(
      { message: error?.message || "Something went wrong." },
      { status: 500 }
    );
  }
}
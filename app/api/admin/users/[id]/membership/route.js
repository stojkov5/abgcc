import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "SUPER_ADMIN") {
      return Response.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const { tierId, status, startDate, endDate } = body;

    if (!tierId || !status) {
      return Response.json(
        { message: "Membership tier and status are required." },
        { status: 400 }
      );
    }

    const membership = await prisma.membership.create({
      data: {
        userId: id,
        tierId,
        status,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
      },
      include: {
        tier: true,
      },
    });

    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${id}`);
    revalidatePath("/portal");

    return Response.json(
      {
        message: "Membership assigned successfully.",
        membership,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ASSIGN_MEMBERSHIP_ERROR:", error);

    return Response.json(
      { message: error?.message || "Something went wrong." },
      { status: 500 }
    );
  }
}
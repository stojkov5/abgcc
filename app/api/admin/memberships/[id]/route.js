import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "SUPER_ADMIN") {
      return Response.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { id } = await params;

    const body = await request.json();
    const { title, description, price, period, active } = body;

    if (!title || !description || !price || !period) {
      return Response.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    const tier = await prisma.membershipTier.update({
      where: { id },
      data: {
        title,
        description,
        price: Number(price),
        period,
        active: Boolean(active),
      },
    });

    return Response.json({
      message: "Membership tier updated successfully.",
      tier,
    });
  } catch (error) {
    console.error("UPDATE_MEMBERSHIP_TIER_ERROR", error);

    return Response.json(
      { message: "Something went wrong." },
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

    const tier = await prisma.membershipTier.update({
      where: { id },
      data: {
        active: false,
      },
    });

    return Response.json({
      message: "Membership tier deactivated successfully.",
      tier,
    });
  } catch (error) {
    console.error("DELETE_MEMBERSHIP_TIER_ERROR", error);

    return Response.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}
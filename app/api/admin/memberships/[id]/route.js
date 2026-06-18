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

    // A tier can't be deleted if members or payments reference it (it would
    // orphan their records). Ask the admin to deactivate it instead.
    const [membershipCount, paymentCount] = await Promise.all([
      prisma.membership.count({ where: { tierId: id } }),
      prisma.payment.count({ where: { tierId: id } }),
    ]);

    if (membershipCount > 0 || paymentCount > 0) {
      return Response.json(
        {
          message:
            "This tier is in use by members or payments and can't be deleted. Set it inactive instead.",
        },
        { status: 400 }
      );
    }

    await prisma.membershipTier.delete({ where: { id } });

    return Response.json({
      message: "Membership tier deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE_MEMBERSHIP_TIER_ERROR", error);

    return Response.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}
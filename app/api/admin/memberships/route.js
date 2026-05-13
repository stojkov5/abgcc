import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user?.role !== "SUPER_ADMIN") {
      return Response.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { title, description, price, period, active } = body;

    if (!title || !description || !price || !period) {
      return Response.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    const tier = await prisma.membershipTier.create({
      data: {
        title,
        description,
        price: Number(price),
        period,
        active: Boolean(active),
      },
    });

    return Response.json(
      {
        message: "Membership tier created successfully.",
        tier,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE_MEMBERSHIP_TIER_ERROR", error);

    return Response.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}
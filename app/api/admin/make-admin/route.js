import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return Response.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }

    const user = await prisma.user.update({
      where: { email },
      data: { role: "SUPER_ADMIN" },
    });

    return Response.json({
      message: "User promoted to SUPER_ADMIN.",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("MAKE_ADMIN_ERROR", error);

    return Response.json(
      { message: "Could not promote user." },
      { status: 500 }
    );
  }
}
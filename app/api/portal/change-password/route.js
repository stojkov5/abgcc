import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return Response.json({ message: "Unauthorized." }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return Response.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return Response.json(
        { message: "New password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user || !user.password) {
      return Response.json({ message: "User not found." }, { status: 404 });
    }

    const isValid = await bcrypt.compare(currentPassword, user.password);

    if (!isValid) {
      return Response.json(
        { message: "Current password is incorrect." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });

    return Response.json({ message: "Password changed successfully." });
  } catch (error) {
    console.error("CHANGE_PASSWORD_ERROR", error);
    return Response.json({ message: "Something went wrong." }, { status: 500 });
  }
}

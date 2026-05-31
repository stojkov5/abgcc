import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return Response.json(
        { message: "Token and password are required." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return Response.json(
        { message: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { resetToken: token },
    });

    if (!user || user.resetTokenExpiry < new Date()) {
      return Response.json(
        { message: "Invalid or expired reset link." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return Response.json({ message: "Password reset successfully." });
  } catch (error) {
    console.error("RESET_PASSWORD_ERROR", error);
    return Response.json({ message: "Something went wrong." }, { status: 500 });
  }
}

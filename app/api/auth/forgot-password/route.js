import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email/sendEmail";
import { passwordResetEmail } from "@/lib/email/templates/passwordResetEmail";

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json({ message: "Email is required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    // Always return success to avoid user enumeration
    if (!user) {
      return Response.json({
        message: "If that email exists, a reset link has been sent.",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: token, resetTokenExpiry: expiry },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    await sendEmail({
      to: user.email,
      subject: "Reset your ABGCC password",
      html: passwordResetEmail({ name: user.name, resetUrl }),
    });

    return Response.json({
      message: "If that email exists, a reset link has been sent.",
    });
  } catch (error) {
    console.error("FORGOT_PASSWORD_ERROR", error);
    return Response.json({ message: "Something went wrong." }, { status: 500 });
  }
}

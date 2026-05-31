import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email/sendEmail";
import { welcomeEmail } from "@/lib/email/templates/welcomeEmail";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return Response.json({ message: "Invalid token." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
    });

    if (!user) {
      return Response.json(
        { message: "Invalid or expired verification link." },
        { status: 400 }
      );
    }

    if (user.verificationTokenExpiry < new Date()) {
      return Response.json(
        { message: "Verification link has expired. Please request a new one." },
        { status: 400 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null,
      },
    });

    sendEmail({
      to: user.email,
      subject: "Welcome to ABGCC",
      html: welcomeEmail({ name: user.name }),
    }).catch((err) => console.error("WELCOME_EMAIL_ERROR", err));

    return Response.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?success=1`
    );
  } catch (error) {
    console.error("VERIFY_EMAIL_ERROR", error);
    return Response.json({ message: "Something went wrong." }, { status: 500 });
  }
}

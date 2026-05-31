import crypto from "crypto";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email/sendEmail";
import { verificationEmail } from "@/lib/email/templates/verificationEmail";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return Response.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return Response.json(
        { message: "User already exists." },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(Date.now() + 1000 * 60 * 60 * 24); // 24 hours

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "MEMBER",
        verificationToken,
        verificationTokenExpiry,
      },
    });

    const verificationUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/verify-email?token=${verificationToken}`;

    sendEmail({
      to: user.email,
      subject: "Verify your ABGCC email address",
      html: verificationEmail({ name: user.name, verificationUrl }),
    }).catch((err) => console.error("VERIFICATION_EMAIL_ERROR", err));

    return Response.json(
      {
        message:
          "Account created. Please check your email to verify your address.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("REGISTER_ERROR", error);
    return Response.json({ message: "Something went wrong." }, { status: 500 });
  }
}

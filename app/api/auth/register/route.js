import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email/sendEmail";
import { welcomeEmail } from "@/lib/email/templates/welcomeEmail";
export async function POST(request) {
  try {
    const body = await request.json();

    const { name, email, password } = body;

    if (!name || !email || !password) {
      return Response.json(
        { message: "All fields are required." },
        { status: 400 },
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return Response.json(
        { message: "User already exists." },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "MEMBER",
      },
    });

    sendEmail({
  to: user.email,
  subject: "Welcome to ABGCC",
  html: welcomeEmail({
    name: user.name,
  }),
}).catch((error) => {
  console.error("WELCOME_EMAIL_ERROR", error);
});

    return Response.json(
      {
        message: "User registered successfully.",
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("REGISTER_ERROR", error);

    return Response.json({ message: "Something went wrong." }, { status: 500 });
  }
}

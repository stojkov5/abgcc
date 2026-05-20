import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const body = await request.json();

    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
      return Response.json(
        { message: "All fields are required." },
        { status: 400 }
      );
    }

    await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject,
        message,
      },
    });

    revalidatePath("/admin/contact-messages");

    return Response.json(
      {
        message: "Message sent successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CONTACT_FORM_ERROR:", error);

    return Response.json(
      {
        message: error?.message || "Something went wrong.",
      },
      { status: 500 }
    );
  }
}
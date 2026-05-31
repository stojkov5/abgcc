import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { sendEmail } from "@/lib/email/sendEmail";
import { contactConfirmationEmail } from "@/lib/email/templates/contactConfirmationEmail";
import { contactNotificationEmail } from "@/lib/email/templates/contactNotificationEmail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// ── Helpers ────────────────────────────────────────────────────────────────

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function verifyRecaptcha(token) {
  const secret = process.env.RECAPTCHA_SECRET_KEY;

  // If no secret is configured, skip verification (dev mode)
  if (!secret) {
    console.warn("RECAPTCHA_SECRET_KEY not set — skipping verification.");
    return true;
  }

  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${secret}&response=${token}`,
  });

  const data = await res.json();

  // Require score >= 0.5 (0 = bot, 1 = human)
  return data.success && data.score >= 0.5;
}

// ── Route ──────────────────────────────────────────────────────────────────

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, subject, message, recaptchaToken } = body;

    // ── Server-side validation ──────────────────────────────────────────

    const errors = {};

    if (!name?.trim())                        errors.name    = "Name is required.";
    else if (name.trim().length < 2)          errors.name    = "Name must be at least 2 characters.";
    else if (name.trim().length > 100)        errors.name    = "Name is too long.";

    if (!email?.trim())                       errors.email   = "Email is required.";
    else if (!isValidEmail(email.trim()))     errors.email   = "Please enter a valid email address.";

    if (!subject?.trim())                     errors.subject = "Subject is required.";
    else if (subject.trim().length < 3)       errors.subject = "Subject must be at least 3 characters.";
    else if (subject.trim().length > 200)     errors.subject = "Subject is too long.";

    if (!message?.trim())                     errors.message = "Message is required.";
    else if (message.trim().length < 10)      errors.message = "Message must be at least 10 characters.";
    else if (message.trim().length > 5000)    errors.message = "Message is too long (max 5000 characters).";

    if (Object.keys(errors).length > 0) {
      return Response.json({ message: "Please fix the errors below.", errors }, { status: 400 });
    }

    // ── reCAPTCHA v3 verification ───────────────────────────────────────

    if (recaptchaToken) {
      const isHuman = await verifyRecaptcha(recaptchaToken);
      if (!isHuman) {
        return Response.json(
          { message: "Spam protection check failed. Please try again." },
          { status: 400 }
        );
      }
    }

    // ── Save to database ────────────────────────────────────────────────

    const cleanData = {
      name:    name.trim(),
      email:   email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
    };

    await prisma.contactMessage.create({ data: cleanData });

    revalidatePath("/admin/contact-messages");

    // ── Send emails (non-blocking — don't fail the request if email fails) ─

    const adminEmail = process.env.CONTACT_EMAIL || process.env.EMAIL_FROM;

    // 1. Notify ABGCC admin
    sendEmail({
      to: adminEmail,
      subject: `New Contact: ${cleanData.subject}`,
      html: contactNotificationEmail(cleanData),
      replyTo: cleanData.email,
    }).catch((err) => console.error("CONTACT_NOTIFY_EMAIL_ERROR:", err));

    // 2. Confirm to sender
    sendEmail({
      to: cleanData.email,
      subject: "We received your message — ABGCC",
      html: contactConfirmationEmail({ name: cleanData.name, subject: cleanData.subject }),
    }).catch((err) => console.error("CONTACT_CONFIRM_EMAIL_ERROR:", err));

    return Response.json(
      { message: "Your message has been sent. We'll be in touch shortly." },
      { status: 201 }
    );
  } catch (error) {
    console.error("CONTACT_FORM_ERROR:", error);
    return Response.json({ message: "Something went wrong. Please try again." }, { status: 500 });
  }
}

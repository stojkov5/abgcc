import { sendEmail } from "@/lib/email/sendEmail";
import { joinTeamEmail } from "@/lib/email/templates/joinTeamEmail";
import { joinTeamConfirmEmail } from "@/lib/email/templates/joinTeamConfirmEmail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_EXT = ["pdf", "docx", "txt"];

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request) {
  try {
    const form = await request.formData();

    const name = (form.get("name") || "").toString().trim();
    const email = (form.get("email") || "").toString().trim();
    const location = (form.get("location") || "").toString().trim();
    const expertise = (form.get("expertise") || "").toString().trim();
    const role = (form.get("role") || "").toString().trim();
    const message = (form.get("message") || "").toString().trim();
    const file = form.get("resume");

    // ── Validation ──────────────────────────────────────────────
    if (!name || !email) {
      return Response.json(
        { message: "Name and email are required." },
        { status: 400 }
      );
    }
    if (!isValidEmail(email)) {
      return Response.json(
        { message: "Please enter a valid email address." },
        { status: 400 }
      );
    }
    if (!file || typeof file === "string") {
      return Response.json(
        { message: "Please attach your resume." },
        { status: 400 }
      );
    }

    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!ALLOWED_EXT.includes(ext)) {
      return Response.json(
        { message: "Resume must be a PDF, DOCX, or TXT file." },
        { status: 400 }
      );
    }
    if (file.size > MAX_SIZE) {
      return Response.json(
        { message: "Resume is too large (max 5 MB)." },
        { status: 400 }
      );
    }

    // Resend's API expects attachment content base64-encoded — a raw Buffer
    // would be JSON-serialized incorrectly and rejected.
    const base64Content = Buffer.from(await file.arrayBuffer()).toString("base64");

    const recipient =
      process.env.JOIN_TEAM_EMAIL ||
      process.env.CONTACT_EMAIL ||
      process.env.ADMIN_EMAIL;

    // ── Send application to ABGCC (resume attached) ─────────────
    const sent = await sendEmail({
      to: recipient,
      subject: `Join Our Team: ${name}`,
      html: joinTeamEmail({ name, email, location, expertise, role, message }),
      replyTo: email,
      attachments: [{ filename: file.name, content: base64Content }],
    });

    if (!sent.success) {
      return Response.json(
        { message: "Could not send your application. Please try again." },
        { status: 500 }
      );
    }

    // ── Confirmation to the applicant (non-blocking) ────────────
    sendEmail({
      to: email,
      subject: "We received your submission — ABGCC",
      html: joinTeamConfirmEmail({ name }),
    }).catch((err) => console.error("JOIN_TEAM_CONFIRM_EMAIL_ERROR:", err));

    return Response.json({
      message: "Thank you! Your submission has been received.",
    });
  } catch (error) {
    console.error("JOIN_TEAM_ERROR:", error);
    return Response.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

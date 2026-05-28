import { resend } from "./resend";

export async function sendEmail({
  to,
  subject,
  html,
  replyTo,
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
      replyTo,
    });

    if (error) {
      console.error("RESEND_EMAIL_ERROR:", error);
      return {
        success: false,
        error,
      };
    }

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("EMAIL_SEND_EXCEPTION:", error);

    return {
      success: false,
      error,
    };
  }
}
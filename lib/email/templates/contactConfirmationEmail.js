import { baseTemplate } from "./baseTemplate";

export function contactConfirmationEmail({ name, subject }) {
  return baseTemplate({
    title: "We received your message — ABGCC",
    preview: "Thank you for reaching out to ABGCC. We will be in touch shortly.",
    content: `
      <h2 style="margin:0 0 16px;font-size:26px;color:#10243f;">
        Thank you, ${name || "there"}
      </h2>

      <p style="font-size:16px;line-height:1.7;color:#334155;margin:0 0 16px;">
        We have received your message regarding <strong>${subject || "your inquiry"}</strong>
        and will get back to you as soon as possible.
      </p>

      <p style="font-size:16px;line-height:1.7;color:#334155;margin:0 0 24px;">
        In the meantime, feel free to explore our membership options and upcoming events.
      </p>

      <div style="display:flex;gap:12px;flex-wrap:wrap;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/membership"
           style="display:inline-block;background:#d7b46a;color:#10243f;text-decoration:none;padding:12px 20px;border-radius:999px;font-weight:700;font-size:14px;">
          View Membership
        </a>
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/events"
           style="display:inline-block;background:#10243f;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:999px;font-weight:700;font-size:14px;">
          View Events
        </a>
      </div>

      <p style="font-size:13px;line-height:1.6;color:#94a3b8;margin:28px 0 0;">
        If you did not submit this form, please ignore this email.
      </p>
    `,
  });
}

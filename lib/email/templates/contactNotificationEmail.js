import { baseTemplate } from "./baseTemplate";

export function contactNotificationEmail({ name, email, subject, message }) {
  return baseTemplate({
    title: "New Contact Form Submission — ABGCC",
    preview: `New message from ${name}: ${subject}`,
    content: `
      <h2 style="margin:0 0 20px;font-size:22px;color:#10243f;">
        New Contact Form Submission
      </h2>

      <table width="100%" cellpadding="0" cellspacing="0"
             style="border:1px solid #e5eaf2;border-radius:12px;overflow:hidden;margin-bottom:24px;">
        <tr style="background:#f8fafc;">
          <td style="padding:12px 16px;font-size:13px;font-weight:700;color:#64748b;
                     text-transform:uppercase;letter-spacing:0.08em;width:110px;">
            Name
          </td>
          <td style="padding:12px 16px;font-size:15px;color:#10243f;font-weight:600;">
            ${name}
          </td>
        </tr>
        <tr>
          <td style="padding:12px 16px;font-size:13px;font-weight:700;color:#64748b;
                     text-transform:uppercase;letter-spacing:0.08em;border-top:1px solid #e5eaf2;">
            Email
          </td>
          <td style="padding:12px 16px;font-size:15px;color:#10243f;border-top:1px solid #e5eaf2;">
            <a href="mailto:${email}" style="color:#1f5f93;text-decoration:none;">${email}</a>
          </td>
        </tr>
        <tr style="background:#f8fafc;">
          <td style="padding:12px 16px;font-size:13px;font-weight:700;color:#64748b;
                     text-transform:uppercase;letter-spacing:0.08em;border-top:1px solid #e5eaf2;">
            Subject
          </td>
          <td style="padding:12px 16px;font-size:15px;color:#10243f;font-weight:600;border-top:1px solid #e5eaf2;">
            ${subject}
          </td>
        </tr>
      </table>

      <div style="background:#f8fafc;border:1px solid #e5eaf2;border-radius:12px;padding:20px;margin-bottom:24px;">
        <p style="font-size:13px;font-weight:700;color:#64748b;text-transform:uppercase;
                  letter-spacing:0.08em;margin:0 0 10px;">Message</p>
        <p style="font-size:15px;line-height:1.75;color:#334155;margin:0;white-space:pre-wrap;">${message}</p>
      </div>

      <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/contact-messages"
         style="display:inline-block;background:#10243f;color:#ffffff;text-decoration:none;
                padding:12px 22px;border-radius:999px;font-weight:700;font-size:14px;">
        View in Admin Panel
      </a>
    `,
  });
}

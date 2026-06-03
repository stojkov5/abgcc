import { baseTemplate } from "./baseTemplate";

export function eventBookingAdminEmail({
  name,
  email,
  company,
  eventTitle,
  reference,
  paid,
  amountPaid,
  source,
}) {
  return baseTemplate({
    title: `New registration — ${eventTitle}`,
    preview: `${name} registered for ${eventTitle}`,
    content: `
      <h2 style="margin:0 0 20px;font-size:22px;color:#10243f;">
        New Event Registration
      </h2>

      <p style="font-size:15px;line-height:1.7;color:#334155;margin:0 0 20px;">
        <strong>${name}</strong> just registered for <strong>${eventTitle}</strong>.
      </p>

      <table width="100%" cellpadding="0" cellspacing="0"
             style="border:1px solid #e5eaf2;border-radius:12px;overflow:hidden;margin-bottom:24px;">
        <tr style="background:#f8fafc;">
          <td style="padding:12px 16px;font-size:13px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;width:120px;">Name</td>
          <td style="padding:12px 16px;font-size:15px;color:#10243f;font-weight:600;">${name}</td>
        </tr>
        <tr>
          <td style="padding:12px 16px;font-size:13px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;border-top:1px solid #e5eaf2;">Email</td>
          <td style="padding:12px 16px;font-size:15px;color:#10243f;border-top:1px solid #e5eaf2;">
            <a href="mailto:${email}" style="color:#1f5f93;text-decoration:none;">${email}</a>
          </td>
        </tr>
        <tr style="background:#f8fafc;">
          <td style="padding:12px 16px;font-size:13px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;border-top:1px solid #e5eaf2;">Company</td>
          <td style="padding:12px 16px;font-size:15px;color:#10243f;border-top:1px solid #e5eaf2;">${company || "—"}</td>
        </tr>
        <tr>
          <td style="padding:12px 16px;font-size:13px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;border-top:1px solid #e5eaf2;">Reference</td>
          <td style="padding:12px 16px;font-size:15px;color:#10243f;font-weight:700;border-top:1px solid #e5eaf2;">${reference}</td>
        </tr>
        <tr style="background:#f8fafc;">
          <td style="padding:12px 16px;font-size:13px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;border-top:1px solid #e5eaf2;">Payment</td>
          <td style="padding:12px 16px;font-size:15px;color:#10243f;font-weight:600;border-top:1px solid #e5eaf2;">
            ${paid ? `Paid — $${amountPaid}` : "Free RSVP"}
          </td>
        </tr>
        <tr>
          <td style="padding:12px 16px;font-size:13px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;border-top:1px solid #e5eaf2;">Source</td>
          <td style="padding:12px 16px;font-size:15px;color:#10243f;border-top:1px solid #e5eaf2;">${source || "Website"}</td>
        </tr>
      </table>

      <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/events"
         style="display:inline-block;background:#10243f;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:700;font-size:14px;">
        View in Admin Panel
      </a>
    `,
  });
}

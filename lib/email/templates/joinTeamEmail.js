import { baseTemplate } from "./baseTemplate";

export function joinTeamEmail({
  name,
  email,
  location,
  expertise,
  role,
  message,
}) {
  return baseTemplate({
    title: "New 'Join Our Team' submission — ABGCC",
    preview: `${name} is interested in joining the ABGCC team.`,
    content: `
      <h2 style="margin:0 0 20px;font-size:22px;color:#10243f;">
        New Join Our Team Submission
      </h2>

      <table width="100%" cellpadding="0" cellspacing="0"
             style="border:1px solid #e5eaf2;border-radius:12px;overflow:hidden;margin-bottom:24px;">
        <tr style="background:#f8fafc;">
          <td style="padding:12px 16px;font-size:13px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;width:150px;">Name</td>
          <td style="padding:12px 16px;font-size:15px;color:#10243f;font-weight:600;">${name}</td>
        </tr>
        <tr>
          <td style="padding:12px 16px;font-size:13px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;border-top:1px solid #e5eaf2;">Email</td>
          <td style="padding:12px 16px;font-size:15px;color:#10243f;border-top:1px solid #e5eaf2;">
            <a href="mailto:${email}" style="color:#1f5f93;text-decoration:none;">${email}</a>
          </td>
        </tr>
        <tr style="background:#f8fafc;">
          <td style="padding:12px 16px;font-size:13px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;border-top:1px solid #e5eaf2;">Location</td>
          <td style="padding:12px 16px;font-size:15px;color:#10243f;border-top:1px solid #e5eaf2;">${location || "—"}</td>
        </tr>
        <tr>
          <td style="padding:12px 16px;font-size:13px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;border-top:1px solid #e5eaf2;">Area of Expertise</td>
          <td style="padding:12px 16px;font-size:15px;color:#10243f;border-top:1px solid #e5eaf2;">${expertise || "—"}</td>
        </tr>
        <tr style="background:#f8fafc;">
          <td style="padding:12px 16px;font-size:13px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;border-top:1px solid #e5eaf2;">Desired Role / Internship</td>
          <td style="padding:12px 16px;font-size:15px;color:#10243f;border-top:1px solid #e5eaf2;">${role || "—"}</td>
        </tr>
      </table>

      ${
        message
          ? `<div style="background:#f8fafc;border:1px solid #e5eaf2;border-radius:12px;padding:20px;margin-bottom:24px;">
              <p style="font-size:13px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;margin:0 0 10px;">Message</p>
              <p style="font-size:15px;line-height:1.75;color:#334155;margin:0;white-space:pre-wrap;">${message}</p>
             </div>`
          : ""
      }

      <p style="font-size:14px;line-height:1.7;color:#64748b;margin:0;">
        The applicant's resume is attached to this email.
      </p>
    `,
  });
}

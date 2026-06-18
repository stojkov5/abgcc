import { baseTemplate } from "./baseTemplate";

export function joinTeamConfirmEmail({ name }) {
  return baseTemplate({
    title: "We received your submission — ABGCC",
    preview: "Thank you for your interest in joining the ABGCC team.",
    content: `
      <h2 style="margin:0 0 16px;font-size:26px;color:#10243f;">
        Thank you${name ? `, ${name}` : ""}
      </h2>

      <p style="font-size:16px;line-height:1.7;color:#334155;margin:0 0 16px;">
        We've received your interest in joining the American Balkan Global Chamber
        of Commerce, along with your resume.
      </p>

      <p style="font-size:16px;line-height:1.7;color:#334155;margin:0 0 24px;">
        We'll keep your details on file and reach out when a relevant opportunity
        becomes available. Thank you for your interest in our mission.
      </p>

      <p style="font-size:13px;line-height:1.6;color:#94a3b8;margin:0;">
        If you did not submit this, you can safely ignore this email.
      </p>
    `,
  });
}

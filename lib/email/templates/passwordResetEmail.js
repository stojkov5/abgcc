import { baseTemplate } from "./baseTemplate";

export function passwordResetEmail({ name, resetUrl }) {
  return baseTemplate({
    title: "Reset your password – ABGCC",
    preview: "You requested a password reset for your ABGCC account.",
    content: `
      <h2 style="margin:0 0 16px;font-size:26px;color:#10243f;">
        Reset your password${name ? `, ${name}` : ""}
      </h2>

      <p style="font-size:16px;line-height:1.7;color:#334155;margin:0 0 16px;">
        We received a request to reset the password for your ABGCC account.
        Click the button below to choose a new password.
      </p>

      <p style="font-size:16px;line-height:1.7;color:#334155;margin:0 0 24px;">
        This link expires in <strong>1 hour</strong>.
      </p>

      <a href="${resetUrl}"
         style="display:inline-block;background:#d7b46a;color:#10243f;text-decoration:none;padding:14px 20px;border-radius:999px;font-weight:700;">
        Reset Password
      </a>

      <p style="font-size:13px;line-height:1.6;color:#94a3b8;margin:24px 0 0;">
        If you did not request a password reset, you can safely ignore this email.
        Your password will not be changed.
      </p>
    `,
  });
}

import { baseTemplate } from "./baseTemplate";

export function verificationEmail({ name, verificationUrl }) {
  return baseTemplate({
    title: "Verify your email – ABGCC",
    preview: "Please verify your email address to activate your ABGCC account.",
    content: `
      <h2 style="margin:0 0 16px;font-size:26px;color:#10243f;">
        Verify your email${name ? `, ${name}` : ""}
      </h2>

      <p style="font-size:16px;line-height:1.7;color:#334155;margin:0 0 16px;">
        Thank you for registering with the American Balkan Global Chamber of Commerce.
        Please verify your email address to unlock all member features.
      </p>

      <p style="font-size:16px;line-height:1.7;color:#334155;margin:0 0 24px;">
        This link expires in <strong>24 hours</strong>.
      </p>

      <a href="${verificationUrl}"
         style="display:inline-block;background:#d7b46a;color:#10243f;text-decoration:none;padding:14px 20px;border-radius:999px;font-weight:700;">
        Verify Email Address
      </a>

      <p style="font-size:13px;line-height:1.6;color:#94a3b8;margin:24px 0 0;">
        If you did not create an account, you can safely ignore this email.
      </p>
    `,
  });
}

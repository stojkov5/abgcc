import { baseTemplate } from "./baseTemplate";

export function welcomeEmail({ name }) {
  return baseTemplate({
    title: "Welcome to ABGCC",
    preview: "Welcome to the American Balkan Global Chamber of Commerce.",
    content: `
      <h2 style="margin:0 0 16px;font-size:26px;color:#10243f;">
        Welcome${name ? `, ${name}` : ""}
      </h2>

      <p style="font-size:16px;line-height:1.7;color:#334155;margin:0 0 16px;">
        Thank you for joining the American Balkan Global Chamber of Commerce.
      </p>

      <p style="font-size:16px;line-height:1.7;color:#334155;margin:0 0 24px;">
        Your member account has been created successfully. You can now access your portal,
        manage your profile, and view your membership status.
      </p>

      <a href="${process.env.NEXT_PUBLIC_APP_URL}/portal"
         style="display:inline-block;background:#d7b46a;color:#10243f;text-decoration:none;padding:14px 20px;border-radius:999px;font-weight:700;">
        Open Member Portal
      </a>
    `,
  });
}
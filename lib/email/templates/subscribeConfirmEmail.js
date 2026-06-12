import { baseTemplate } from "./baseTemplate";

export function subscribeConfirmEmail() {
  return baseTemplate({
    title: "You're subscribed — ABGCC",
    preview: "Thanks for subscribing to ABGCC updates.",
    content: `
      <h2 style="margin:0 0 16px;font-size:26px;color:#10243f;">
        You're on the list
      </h2>

      <p style="font-size:16px;line-height:1.7;color:#334155;margin:0 0 16px;">
        Thank you for subscribing to the American Balkan Global Chamber of Commerce.
        You'll now receive our latest news, events, and opportunities directly in your inbox.
      </p>

      <a href="${process.env.NEXT_PUBLIC_APP_URL}/events"
         style="display:inline-block;background:#d7b46a;color:#10243f;text-decoration:none;padding:14px 20px;border-radius:999px;font-weight:700;">
        Explore Upcoming Events
      </a>

      <p style="font-size:13px;line-height:1.6;color:#94a3b8;margin:24px 0 0;">
        If you didn't subscribe, you can safely ignore this email.
      </p>
    `,
  });
}

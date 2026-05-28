import { baseTemplate } from "./baseTemplate";

export function paymentSuccessEmail({
  name,
  tierName,
  amount,
  renewalDate,
}) {
  return baseTemplate({
    title: "ABGCC Payment Successful",
    preview: "Your ABGCC membership payment was successful.",
    content: `
      <h2 style="margin:0 0 16px;font-size:26px;color:#10243f;">
        Payment successful
      </h2>

      <p style="font-size:16px;line-height:1.7;color:#334155;margin:0 0 16px;">
        Hi ${name || "there"}, your ABGCC membership payment has been completed successfully.
      </p>

      <div style="margin:24px 0;padding:20px;border-radius:16px;background:#f8fafc;border:1px solid #e2e8f0;">
        <p style="margin:0 0 8px;color:#334155;">
          <strong>Membership:</strong> ${tierName || "ABGCC Membership"}
        </p>

        <p style="margin:0 0 8px;color:#334155;">
          <strong>Amount:</strong> ${amount || "Paid"}
        </p>

        <p style="margin:0;color:#334155;">
          <strong>Valid until:</strong> ${renewalDate || "Updated in your portal"}
        </p>
      </div>

      <p style="font-size:16px;line-height:1.7;color:#334155;margin:0 0 24px;">
        You can view your membership status and payment history inside your member portal.
      </p>

      <a href="${process.env.NEXT_PUBLIC_APP_URL}/portal"
         style="display:inline-block;background:#d7b46a;color:#10243f;text-decoration:none;padding:14px 20px;border-radius:999px;font-weight:700;">
        Open Member Portal
      </a>
    `,
  });
}
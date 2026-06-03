import { baseTemplate } from "./baseTemplate";

export function adminBankTransferRequestEmail({
  userName,
  userEmail,
  tierName,
  amount,
  reference,
}) {
  return baseTemplate({
    title: "New bank-transfer membership request",
    preview: `${userName || userEmail} requested ${tierName} via bank transfer`,
    content: `
      <h2 style="margin:0 0 20px;font-size:22px;color:#10243f;">
        New Bank-Transfer Request
      </h2>

      <p style="font-size:15px;line-height:1.7;color:#334155;margin:0 0 20px;">
        A member has requested to pay for their membership by bank transfer.
        Confirm the payment in the admin panel once funds are received.
      </p>

      <table width="100%" cellpadding="0" cellspacing="0"
             style="border:1px solid #e5eaf2;border-radius:12px;overflow:hidden;margin-bottom:24px;">
        <tr style="background:#f8fafc;"><td style="padding:12px 16px;font-size:13px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;width:130px;">Member</td><td style="padding:12px 16px;font-size:15px;color:#10243f;font-weight:600;">${userName || "—"}</td></tr>
        <tr><td style="padding:12px 16px;font-size:13px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;border-top:1px solid #e5eaf2;">Email</td><td style="padding:12px 16px;font-size:15px;color:#10243f;border-top:1px solid #e5eaf2;"><a href="mailto:${userEmail}" style="color:#1f5f93;text-decoration:none;">${userEmail}</a></td></tr>
        <tr style="background:#f8fafc;"><td style="padding:12px 16px;font-size:13px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;border-top:1px solid #e5eaf2;">Tier</td><td style="padding:12px 16px;font-size:15px;color:#10243f;font-weight:600;border-top:1px solid #e5eaf2;">${tierName}</td></tr>
        <tr><td style="padding:12px 16px;font-size:13px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;border-top:1px solid #e5eaf2;">Amount</td><td style="padding:12px 16px;font-size:15px;color:#10243f;font-weight:700;border-top:1px solid #e5eaf2;">$${amount}</td></tr>
        <tr style="background:#f8fafc;"><td style="padding:12px 16px;font-size:13px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;border-top:1px solid #e5eaf2;">Reference</td><td style="padding:12px 16px;font-size:15px;color:#10243f;font-weight:700;border-top:1px solid #e5eaf2;">${reference}</td></tr>
      </table>

      <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/memberships"
         style="display:inline-block;background:#10243f;color:#ffffff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:700;font-size:14px;">
        Review in Admin Panel
      </a>
    `,
  });
}

import { baseTemplate } from "./baseTemplate";

export function adminMembershipActivatedEmail({
  userName,
  userEmail,
  tierName,
  amount,
  renewalDate,
}) {
  return baseTemplate({
    title: "New ABGCC Membership Activated",
    preview: "A user membership has been activated.",
    content: `
      <h2 style="margin:0 0 16px;font-size:26px;color:#10243f;">
        New membership activated
      </h2>

      <p style="font-size:16px;line-height:1.7;color:#334155;margin:0 0 16px;">
        A user has completed payment and their ABGCC membership is now active.
      </p>

      <div style="margin:24px 0;padding:20px;border-radius:16px;background:#f8fafc;border:1px solid #e2e8f0;">
        <p style="margin:0 0 8px;color:#334155;">
          <strong>Name:</strong> ${userName || "Unknown"}
        </p>

        <p style="margin:0 0 8px;color:#334155;">
          <strong>Email:</strong> ${userEmail || "Unknown"}
        </p>

        <p style="margin:0 0 8px;color:#334155;">
          <strong>Membership:</strong> ${tierName || "ABGCC Membership"}
        </p>

        <p style="margin:0 0 8px;color:#334155;">
          <strong>Amount:</strong> ${amount || "Paid"}
        </p>

        <p style="margin:0;color:#334155;">
          <strong>Valid until:</strong> ${renewalDate || "Updated in portal"}
        </p>
      </div>

      <a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/users"
         style="display:inline-block;background:#10243f;color:#ffffff;text-decoration:none;padding:14px 20px;border-radius:999px;font-weight:700;">
        View Admin Users
      </a>
    `,
  });
}
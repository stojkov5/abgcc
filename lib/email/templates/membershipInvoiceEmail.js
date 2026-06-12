import { baseTemplate } from "./baseTemplate";
import { bankDetailRows } from "@/lib/bankDetails";

export function membershipInvoiceEmail({
  name,
  tierName,
  amount,
  reference,
  bank,
}) {
  const bankRows = bankDetailRows(bank)
    .map(
      (row) =>
        `<tr><td style="padding:6px 0;font-size:14px;color:#64748b;width:140px;">${row.label}</td><td style="padding:6px 0;font-size:15px;color:#10243f;font-weight:600;">${row.value}</td></tr>`
    )
    .join("");

  return baseTemplate({
    title: `Your ABGCC membership invoice — ${reference}`,
    preview: `Bank transfer instructions for your ${tierName} membership.`,
    content: `
      <h2 style="margin:0 0 8px;font-size:26px;color:#10243f;">
        Membership Invoice
      </h2>

      <p style="font-size:16px;line-height:1.7;color:#334155;margin:0 0 20px;">
        Thank you${name ? `, ${name}` : ""}, for choosing the <strong>${tierName}</strong>
        membership. To complete your registration, please transfer the amount below
        to the ABGCC account. Your membership is activated once payment is received.
      </p>

      <!-- Amount + reference -->
      <table width="100%" cellpadding="0" cellspacing="0"
             style="border:1px solid #e5eaf2;border-radius:14px;overflow:hidden;margin-bottom:20px;">
        <tr>
          <td style="padding:20px 24px;background:#10243f;color:#ffffff;">
            <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#d7b46a;">
              Amount Due
            </p>
            <p style="margin:0;font-size:28px;font-weight:700;color:#ffffff;">$${amount}</p>
            <p style="margin:10px 0 0;font-size:13px;color:#cbd5e1;">
              Reference: <strong style="color:#ffffff;">${reference}</strong>
            </p>
          </td>
        </tr>
      </table>

      <!-- Bank details -->
      <div style="background:#f8fafc;border:1px solid #e5eaf2;border-radius:14px;padding:20px 24px;margin-bottom:24px;">
        <p style="margin:0 0 14px;font-size:13px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;">
          Bank Transfer Details
        </p>

        <table width="100%" cellpadding="0" cellspacing="0">
          ${bankRows}
        </table>
      </div>

      <p style="font-size:14px;line-height:1.7;color:#64748b;margin:0;">
        ${bank.note} Once we confirm your payment, you'll receive a confirmation email
        and your membership will be active in your member portal.
      </p>
    `,
  });
}

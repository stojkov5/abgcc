import { baseTemplate } from "./baseTemplate";

// A clean "paid" receipt / invoice, sent in addition to the confirmation email.
export function invoiceReceiptEmail({
  name,
  email,
  invoiceNumber,
  date,
  description,
  amount,
  paymentMethod,
}) {
  const dateStr = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return baseTemplate({
    title: `Receipt ${invoiceNumber} — ABGCC`,
    preview: `Your ABGCC receipt for ${description}.`,
    content: `
      <table width="100%" cellpadding="0" cellspacing="0">
        <tr>
          <td>
            <h2 style="margin:0 0 4px;font-size:24px;color:#10243f;">Receipt</h2>
            <p style="margin:0;font-size:13px;color:#94a3b8;">${invoiceNumber}</p>
          </td>
          <td align="right">
            <span style="display:inline-block;padding:6px 14px;border-radius:999px;background:rgba(39,174,96,0.14);color:#1f8f52;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">Paid</span>
          </td>
        </tr>
      </table>

      <table width="100%" cellpadding="0" cellspacing="0" style="margin:22px 0;">
        <tr>
          <td style="font-size:13px;color:#64748b;padding-bottom:4px;">Billed To</td>
          <td style="font-size:13px;color:#64748b;padding-bottom:4px;" align="right">Date</td>
        </tr>
        <tr>
          <td style="font-size:15px;color:#10243f;font-weight:600;">
            ${name || "ABGCC Member"}<br />
            <span style="font-weight:400;color:#64748b;font-size:13px;">${email}</span>
          </td>
          <td style="font-size:15px;color:#10243f;font-weight:600;" align="right" valign="top">${dateStr}</td>
        </tr>
      </table>

      <!-- Line items -->
      <table width="100%" cellpadding="0" cellspacing="0"
             style="border:1px solid #e5eaf2;border-radius:12px;overflow:hidden;">
        <tr style="background:#f8fafc;">
          <td style="padding:12px 16px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;">Description</td>
          <td style="padding:12px 16px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;" align="right">Amount</td>
        </tr>
        <tr>
          <td style="padding:14px 16px;font-size:15px;color:#10243f;border-top:1px solid #e5eaf2;">${description}</td>
          <td style="padding:14px 16px;font-size:15px;color:#10243f;font-weight:600;border-top:1px solid #e5eaf2;" align="right">$${amount}</td>
        </tr>
        <tr>
          <td style="padding:14px 16px;font-size:15px;color:#10243f;font-weight:700;border-top:1px solid #e5eaf2;background:#f8fafc;">Total Paid</td>
          <td style="padding:14px 16px;font-size:18px;color:#10243f;font-weight:700;border-top:1px solid #e5eaf2;background:#f8fafc;" align="right">$${amount}</td>
        </tr>
      </table>

      <p style="font-size:14px;line-height:1.7;color:#64748b;margin:20px 0 0;">
        Payment method: <strong style="color:#10243f;">${paymentMethod}</strong><br />
        Thank you for your support of the American Balkan Global Chamber of Commerce.
      </p>
    `,
  });
}

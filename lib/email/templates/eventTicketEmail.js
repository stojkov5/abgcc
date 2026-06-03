import { baseTemplate } from "./baseTemplate";

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function eventTicketEmail({
  name,
  eventTitle,
  eventDate,
  eventLocation,
  reference,
  qrUrl,
  paid,
  amountPaid,
}) {
  return baseTemplate({
    title: `Your ticket — ${eventTitle}`,
    preview: `You're confirmed for ${eventTitle}. Your entry QR code is inside.`,
    content: `
      <h2 style="margin:0 0 8px;font-size:26px;color:#10243f;">
        You're confirmed${name ? `, ${name}` : ""}!
      </h2>

      <p style="font-size:16px;line-height:1.7;color:#334155;margin:0 0 24px;">
        Thank you for your booking. Your place at <strong>${eventTitle}</strong> is reserved.
        Present the QR code below at the entrance for check-in.
      </p>

      <!-- Ticket card -->
      <table width="100%" cellpadding="0" cellspacing="0"
             style="border:1px solid #e5eaf2;border-radius:16px;overflow:hidden;margin-bottom:24px;">
        <tr>
          <td style="padding:24px;background:#10243f;color:#ffffff;">
            <p style="margin:0 0 4px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#d7b46a;">
              ABGCC Event Ticket
            </p>
            <h3 style="margin:0;font-size:20px;color:#ffffff;">${eventTitle}</h3>
          </td>
        </tr>

        <tr>
          <td style="padding:24px;background:#ffffff;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="padding:0 0 14px;font-size:13px;color:#64748b;width:90px;">Date</td>
                <td style="padding:0 0 14px;font-size:15px;color:#10243f;font-weight:600;">${formatDate(eventDate)}</td>
              </tr>
              <tr>
                <td style="padding:0 0 14px;font-size:13px;color:#64748b;">Location</td>
                <td style="padding:0 0 14px;font-size:15px;color:#10243f;font-weight:600;">${eventLocation}</td>
              </tr>
              <tr>
                <td style="font-size:13px;color:#64748b;">Reference</td>
                <td style="font-size:15px;color:#10243f;font-weight:700;letter-spacing:0.04em;">${reference}</td>
              </tr>
              ${
                paid
                  ? `<tr>
                      <td style="padding:14px 0 0;font-size:13px;color:#64748b;">Paid</td>
                      <td style="padding:14px 0 0;font-size:15px;color:#1f8f52;font-weight:700;">$${amountPaid}</td>
                     </tr>`
                  : ""
              }
            </table>
          </td>
        </tr>

        <!-- QR -->
        <tr>
          <td align="center" style="padding:8px 24px 28px;background:#ffffff;">
            <div style="display:inline-block;padding:16px;background:#ffffff;border:1px solid #e5eaf2;border-radius:14px;">
              <img src="${qrUrl}" width="200" height="200" alt="Entry QR code"
                   style="display:block;width:200px;height:200px;" />
            </div>
            <p style="margin:14px 0 0;font-size:13px;color:#94a3b8;">
              Scan at the entrance for check-in
            </p>
          </td>
        </tr>
      </table>

      <p style="font-size:14px;line-height:1.7;color:#64748b;margin:0;">
        Please keep this email handy — you'll need the QR code to enter.
        We look forward to seeing you there.
      </p>
    `,
  });
}

export function baseTemplate({ preview = "", title = "", content = "" }) {
  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>

  <body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,sans-serif;color:#10243f;">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0;">
      ${preview}
    </div>

    <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:32px 16px;">
      <tr>
        <td align="center">
          <table width="100%" cellpadding="0" cellspacing="0" style="max-width:640px;background:#ffffff;border-radius:20px;overflow:hidden;border:1px solid #e5eaf2;">
            <tr>
              <td style="padding:28px 32px;background:#10243f;color:#ffffff;">
                <h1 style="margin:0;font-size:22px;letter-spacing:-0.02em;">
                  ABGCC
                </h1>
                <p style="margin:8px 0 0;color:#d7b46a;font-size:13px;">
                  American Balkan Global Chamber of Commerce
                </p>
              </td>
            </tr>

            <tr>
              <td style="padding:32px;">
                ${content}
              </td>
            </tr>

            <tr>
              <td style="padding:22px 32px;background:#f8fafc;color:#64748b;font-size:12px;line-height:1.6;">
                © ${new Date().getFullYear()} American Balkan Global Chamber of Commerce.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
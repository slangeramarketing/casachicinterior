/***************************************************
 * File: lib/mail/templates/reply-to-client.ts
 *
 * Purpose:
 * - Build HTML email when admin replies to client
 * - Matches latest approved email design
 ***************************************************/

type ReplyToClientEmailInput = {
  clientName: string;
  adminReply: string;
  originalMessage: string;
};

export function buildReplyToClientEmail(
  data: ReplyToClientEmailInput
): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>CasaChic Interior – Reply</title>
</head>

<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0"
          style="background:#ffffff;border-radius:8px;overflow:hidden">

          <!-- BANNER IMAGE -->
          <tr>
            <td>
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
                alt="Interior Design"
                width="600"
                height="200"
                style="display:block;width:100%;object-fit:cover;"
              />
            </td>
          </tr>

          <!-- HEADER -->
          <tr>
            <td style="background:#f97316;padding:18px 22px;color:#ffffff">
              <h2 style="margin:0;font-size:18px">CasaChic Interior</h2>
              <p style="margin:6px 0 0;font-size:13px">
                Response to your enquiry
              </p>
            </td>
          </tr>

          <!-- GREETING -->
          <tr>
            <td style="padding:22px">
              <p style="font-size:14px;color:#374151;margin:0">
                Hi <strong>${data.clientName}</strong>,
              </p>
              <p style="font-size:14px;color:#374151;margin-top:10px">
                Thank you for reaching out to CasaChic Interior.
                Our team has reviewed your enquiry and replied below.
              </p>
            </td>
          </tr>

          <!-- ADMIN REPLY -->
          <tr>
            <td style="padding:0 22px 22px">
              <h4 style="margin-bottom:8px;font-size:15px;color:#111827">
                Our Response
              </h4>

              <div
                style="
                  background:#f9fafb;
                  border-left:4px solid #f97316;
                  padding:14px;
                  font-size:14px;
                  color:#374151;
                  line-height:1.6;
                "
              >
                ${data.adminReply}
              </div>
            </td>
          </tr>

          <!-- ORIGINAL MESSAGE -->
          <tr>
            <td style="padding:0 22px 22px">
              <h4 style="margin-bottom:6px;font-size:14px;color:#6b7280">
                Your Original Message
              </h4>

              <div
                style="
                  background:#ffffff;
                  border:1px solid #e5e7eb;
                  padding:12px;
                  font-size:13px;
                  color:#4b5563;
                  line-height:1.5;
                "
              >
                ${data.originalMessage}
              </div>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td
              style="
                background:#f3f4f6;
                padding:16px 22px;
                font-size:12px;
                color:#6b7280;
                text-align:center;
              "
            >
              You can simply reply to this email if you have any further
              questions.<br /><br />
              <strong>CasaChic Interior Team</strong>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;
}

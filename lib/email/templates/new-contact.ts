/***************************************************
 * File: lib/mail/templates/new-contact.ts
 *
 * Purpose:
 * - Build HTML email for new contact enquiry
 ***************************************************/

type NewContactEmailInput = {
  name: string;
  email: string;
  phone: string;
  city: string;
  message: string;
};

export function buildNewContactEmail(
  data: NewContactEmailInput
): string {
  return `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px">
    <tr>
      <td align="center">
        <table width="600" style="background:#ffffff;border-radius:8px;overflow:hidden">
          <tr>
            <td>
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c"
                width="600"
                style="display:block;width:100%"
              />
            </td>
          </tr>

          <tr>
            <td style="padding:20px">
              <h2 style="margin:0">New Enquiry Received</h2>
              <p style="color:#666;font-size:14px">
                A new client has contacted CasaChic Interior.
              </p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 20px 20px">
              <p><strong>Name:</strong> ${data.name}</p>
              <p><strong>Email:</strong> ${data.email}</p>
              <p><strong>Phone:</strong> ${data.phone}</p>
              <p><strong>City:</strong> ${data.city}</p>
            </td>
          </tr>

          <tr>
            <td style="padding:0 20px 20px">
              <div style="background:#f9fafb;border-left:4px solid #f97316;padding:12px">
                ${data.message}
              </div>
            </td>
          </tr>

          <tr>
            <td style="background:#f97316;color:#fff;padding:14px;text-align:center;font-size:13px">
              CasaChic Interior • New Client Enquiry
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

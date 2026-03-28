// src/emails/applicationReceived.js
export function applicationReceivedEmail({ applicantName, jobTitle, company, isPriority, amount }) {
  const priorityBadge = isPriority
    ? `<span style="background:#fef3c7;color:#92400e;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:bold;">⭐ PRIORITY APPLICATION</span>`
    : `<span style="background:#e0e7ff;color:#3730a3;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:bold;">📋 STANDARD APPLICATION</span>`;

  const feeSection = isPriority
    ? `
      <div style="background:#fffbeb;border:1px solid #fcd34d;border-radius:12px;padding:16px;margin:20px 0;">
        <p style="margin:0;color:#92400e;font-size:14px;">
          💰 <strong>Challenge Fee: ₹${amount}</strong><br>
          <span style="font-size:13px;">Your application will be reviewed with priority. Fee is refundable as per our policy.</span>
        </p>
      </div>
    `
    : '';

  return {
    subject: `Application Submitted — ${jobTitle} at ${company}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial,sans-serif;">
        <div style="max-width:600px;margin:0 auto;padding:20px;">
          <div style="background:linear-gradient(135deg,#4F46E5,#7C3AED);border-radius:16px 16px 0 0;padding:40px 30px;text-align:center;">
            <h1 style="color:#ffffff;margin:0;font-size:28px;">⚡ TrustHire</h1>
          </div>
          <div style="background:#ffffff;padding:40px 30px;border-radius:0 0 16px 16px;">
            <h2 style="color:#1f2937;margin-top:0;">Application Submitted! 📋</h2>
            <p style="color:#4b5563;font-size:16px;line-height:1.6;">
              Hi <strong>${applicantName}</strong>, your application has been successfully submitted.
            </p>
            <div style="background:#f9fafb;border-radius:12px;padding:20px;margin:20px 0;">
              <table style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="padding:8px 0;color:#6b7280;font-size:14px;">Job Title</td>
                  <td style="padding:8px 0;color:#1f2937;font-size:14px;font-weight:bold;text-align:right;">${jobTitle}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#6b7280;font-size:14px;">Company</td>
                  <td style="padding:8px 0;color:#1f2937;font-size:14px;font-weight:bold;text-align:right;">${company}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#6b7280;font-size:14px;">Type</td>
                  <td style="padding:8px 0;text-align:right;">${priorityBadge}</td>
                </tr>
              </table>
            </div>
            ${feeSection}
            <p style="color:#4b5563;font-size:14px;line-height:1.6;">
              The recruiter will review your application soon. You'll receive an email when there's an update.
            </p>
            <div style="text-align:center;margin:30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/applicant/applications" style="background:#4F46E5;color:#ffffff;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">
                Track Application →
              </a>
            </div>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:30px 0;">
            <p style="color:#9ca3af;font-size:12px;text-align:center;">
              © ${new Date().getFullYear()} TrustHire. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}
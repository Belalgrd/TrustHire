// src/emails/interviewInvite.js
export function interviewInviteEmail({ applicantName, jobTitle, company, message }) {
  const messageSection = message
    ? `
      <div style="background:#eff6ff;border-left:4px solid #3b82f6;padding:16px;border-radius:0 8px 8px 0;margin:20px 0;">
        <p style="margin:0 0 4px 0;color:#1e40af;font-size:12px;font-weight:bold;">MESSAGE FROM RECRUITER:</p>
        <p style="margin:0;color:#1e3a5f;font-size:14px;line-height:1.6;">${message}</p>
      </div>
    `
    : '';

  return {
    subject: `🎉 Interview Invitation — ${jobTitle} at ${company}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial,sans-serif;">
        <div style="max-width:600px;margin:0 auto;padding:20px;">
          <div style="background:linear-gradient(135deg,#059669,#10b981);border-radius:16px 16px 0 0;padding:40px 30px;text-align:center;">
            <h1 style="color:#ffffff;margin:0;font-size:28px;">🎉 Interview Invitation!</h1>
            <p style="color:#d1fae5;margin-top:8px;font-size:14px;">You've been shortlisted</p>
          </div>
          <div style="background:#ffffff;padding:40px 30px;border-radius:0 0 16px 16px;">
            <h2 style="color:#1f2937;margin-top:0;">Congratulations, ${applicantName}! 🥳</h2>
            <p style="color:#4b5563;font-size:16px;line-height:1.6;">
              Great news! <strong>${company}</strong> has reviewed your application and wants to invite you for an interview.
            </p>
            <div style="background:#f9fafb;border-radius:12px;padding:20px;margin:20px 0;">
              <table style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="padding:8px 0;color:#6b7280;font-size:14px;">Position</td>
                  <td style="padding:8px 0;color:#1f2937;font-size:14px;font-weight:bold;text-align:right;">${jobTitle}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#6b7280;font-size:14px;">Company</td>
                  <td style="padding:8px 0;color:#1f2937;font-size:14px;font-weight:bold;text-align:right;">${company}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#6b7280;font-size:14px;">Status</td>
                  <td style="padding:8px 0;text-align:right;">
                    <span style="background:#d1fae5;color:#065f46;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:bold;">INTERVIEW INVITED</span>
                  </td>
                </tr>
              </table>
            </div>
            ${messageSection}
            <div style="background:#fefce8;border-left:4px solid #eab308;padding:16px;border-radius:0 8px 8px 0;margin:20px 0;">
              <p style="margin:0;color:#854d0e;font-size:14px;">
                <strong>⚠️ Important:</strong> If you have a Challenge Fee deposit, it will be <strong>automatically refunded</strong> when you attend the interview. Not attending will result in fee forfeiture.
              </p>
            </div>
            <div style="text-align:center;margin:30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/applicant/applications" style="background:#059669;color:#ffffff;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">
                View Application →
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
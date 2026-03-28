// src/emails/feeForfeited.js
export function feeForfeitedEmail({ applicantName, jobTitle, company, amount }) {
  return {
    subject: `Challenge Fee Forfeited — ${jobTitle} at ${company}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial,sans-serif;">
        <div style="max-width:600px;margin:0 auto;padding:20px;">
          <div style="background:linear-gradient(135deg,#dc2626,#ef4444);border-radius:16px 16px 0 0;padding:40px 30px;text-align:center;">
            <h1 style="color:#ffffff;margin:0;font-size:28px;">⚠️ Fee Forfeited</h1>
          </div>
          <div style="background:#ffffff;padding:40px 30px;border-radius:0 0 16px 16px;">
            <h2 style="color:#1f2937;margin-top:0;">Hi ${applicantName},</h2>
            <p style="color:#4b5563;font-size:16px;line-height:1.6;">
              Unfortunately, your Challenge Fee for the following job has been <strong style="color:#dc2626;">forfeited</strong> because you did not attend the scheduled interview.
            </p>
            <div style="background:#f9fafb;border-radius:12px;padding:20px;margin:20px 0;">
              <table style="width:100%;border-collapse:collapse;">
                <tr>
                  <td style="padding:8px 0;color:#6b7280;font-size:14px;">Job</td>
                  <td style="padding:8px 0;color:#1f2937;font-size:14px;font-weight:bold;text-align:right;">${jobTitle}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#6b7280;font-size:14px;">Company</td>
                  <td style="padding:8px 0;color:#1f2937;font-size:14px;font-weight:bold;text-align:right;">${company}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#6b7280;font-size:14px;">Forfeited Amount</td>
                  <td style="padding:8px 0;color:#dc2626;font-size:18px;font-weight:bold;text-align:right;">₹${amount}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#6b7280;font-size:14px;">Reason</td>
                  <td style="padding:8px 0;text-align:right;">
                    <span style="background:#fee2e2;color:#991b1b;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:bold;">NO-SHOW</span>
                  </td>
                </tr>
              </table>
            </div>
            <div style="background:#fef2f2;border-left:4px solid #ef4444;padding:16px;border-radius:0 8px 8px 0;margin:20px 0;">
              <p style="margin:0;color:#991b1b;font-size:14px;">
                <strong>Why was my fee forfeited?</strong><br>
                As per TrustHire's policy, the Challenge Fee is forfeited only when a candidate is invited to an interview but fails to attend. This is the only scenario where the fee is not refunded.
              </p>
            </div>
            <p style="color:#4b5563;font-size:14px;line-height:1.6;">
              We encourage you to always attend scheduled interviews. Your commitment matters! Keep applying to new opportunities. 💪
            </p>
            <div style="text-align:center;margin:30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/jobs" style="background:#4F46E5;color:#ffffff;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">
                Browse More Jobs →
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
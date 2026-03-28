// src/emails/applicationRejected.js
export function applicationRejectedEmail({ applicantName, jobTitle, company, hadChallengeFee, amount }) {
  const refundSection = hadChallengeFee
    ? `
      <div style="background:#f0fdf4;border-left:4px solid #22c55e;padding:16px;border-radius:0 8px 8px 0;margin:20px 0;">
        <p style="margin:0;color:#166534;font-size:14px;">
          <strong>💰 Refund Initiated:</strong> Your Challenge Fee of <strong>₹${amount}</strong> will be refunded to your original payment method within 5-7 business days.
        </p>
      </div>
    `
    : '';

  return {
    subject: `Application Update — ${jobTitle} at ${company}`,
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
            <h2 style="color:#1f2937;margin-top:0;">Application Update</h2>
            <p style="color:#4b5563;font-size:16px;line-height:1.6;">
              Hi <strong>${applicantName}</strong>, thank you for your interest in the <strong>${jobTitle}</strong> position at <strong>${company}</strong>.
            </p>
            <p style="color:#4b5563;font-size:16px;line-height:1.6;">
              After careful review, the recruiter has decided to move forward with other candidates at this time.
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
                    <span style="background:#fee2e2;color:#991b1b;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:bold;">REJECTED</span>
                  </td>
                </tr>
              </table>
            </div>
            ${refundSection}
            <p style="color:#4b5563;font-size:14px;line-height:1.6;">
              Don't be discouraged! There are many more opportunities waiting for you on TrustHire. Keep applying! 💪
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
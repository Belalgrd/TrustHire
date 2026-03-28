// src/emails/refundProcessed.js
export function refundProcessedEmail({ applicantName, jobTitle, company, amount, reason }) {
  const reasonText = {
    rejected: 'Your application was rejected by the recruiter.',
    hired: 'You were hired for this position! 🎉',
    attended: 'You attended the scheduled interview.',
    expired: 'The application was not reviewed within the review window.',
  };

  return {
    subject: `💰 Refund Processed — ₹${amount} for ${jobTitle}`,
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
            <h1 style="color:#ffffff;margin:0;font-size:28px;">💰 Refund Processed!</h1>
            <p style="color:#d1fae5;margin-top:8px;font-size:14px;">Your money is on its way back</p>
          </div>
          <div style="background:#ffffff;padding:40px 30px;border-radius:0 0 16px 16px;">
            <h2 style="color:#1f2937;margin-top:0;">Hi ${applicantName},</h2>
            <p style="color:#4b5563;font-size:16px;line-height:1.6;">
              Your Challenge Fee has been refunded successfully.
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
                  <td style="padding:8px 0;color:#6b7280;font-size:14px;">Refund Amount</td>
                  <td style="padding:8px 0;color:#16a34a;font-size:18px;font-weight:bold;text-align:right;">₹${amount}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#6b7280;font-size:14px;">Reason</td>
                  <td style="padding:8px 0;color:#1f2937;font-size:14px;text-align:right;">${reasonText[reason] || reason}</td>
                </tr>
              </table>
            </div>
            <div style="background:#eff6ff;border-left:4px solid #3b82f6;padding:16px;border-radius:0 8px 8px 0;margin:20px 0;">
              <p style="margin:0;color:#1e40af;font-size:14px;">
                💡 Refund will reflect in your account within <strong>5-7 business days</strong> depending on your bank/payment provider.
              </p>
            </div>
            <div style="text-align:center;margin:30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/applicant/deposits" style="background:#059669;color:#ffffff;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">
                View Deposits →
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
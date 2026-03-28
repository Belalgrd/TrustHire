// src/emails/priorityConfirmation.js
export function priorityConfirmationEmail({ applicantName, jobTitle, company, amount, paymentId }) {
  return {
    subject: `⭐ Priority Application Confirmed — ${jobTitle}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial,sans-serif;">
        <div style="max-width:600px;margin:0 auto;padding:20px;">
          <div style="background:linear-gradient(135deg,#f59e0b,#d97706);border-radius:16px 16px 0 0;padding:40px 30px;text-align:center;">
            <h1 style="color:#ffffff;margin:0;font-size:28px;">⭐ Priority Confirmed!</h1>
            <p style="color:#fef3c7;margin-top:8px;font-size:14px;">Your application will be reviewed first</p>
          </div>
          <div style="background:#ffffff;padding:40px 30px;border-radius:0 0 16px 16px;">
            <h2 style="color:#1f2937;margin-top:0;">Great move, ${applicantName}! 🚀</h2>
            <p style="color:#4b5563;font-size:16px;line-height:1.6;">
              Your Challenge Fee payment has been confirmed. Your application will now appear at the <strong>top of the recruiter's list</strong>.
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
                  <td style="padding:8px 0;color:#6b7280;font-size:14px;">Amount Paid</td>
                  <td style="padding:8px 0;color:#16a34a;font-size:14px;font-weight:bold;text-align:right;">₹${amount}</td>
                </tr>
                <tr>
                  <td style="padding:8px 0;color:#6b7280;font-size:14px;">Payment ID</td>
                  <td style="padding:8px 0;color:#1f2937;font-size:12px;text-align:right;">${paymentId}</td>
                </tr>
              </table>
            </div>
            <div style="background:#f0fdf4;border-left:4px solid #22c55e;padding:16px;border-radius:0 8px 8px 0;margin:20px 0;">
              <p style="margin:0;color:#166534;font-size:14px;">
                <strong>🔒 Refund Policy:</strong><br>
                ✅ Refunded if rejected, not reviewed, or hired<br>
                ✅ Refunded if you attend the interview<br>
                ❌ Forfeited only if you skip a scheduled interview
              </p>
            </div>
            <div style="text-align:center;margin:30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}/applicant/deposits" style="background:#f59e0b;color:#ffffff;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">
                View Deposit Details →
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
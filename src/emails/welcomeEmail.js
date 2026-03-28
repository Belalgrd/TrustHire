// src/emails/welcomeEmail.js
export function welcomeEmail({ name, role }) {
  const dashboardUrl =
    role === 'recruiter'
      ? `${process.env.NEXT_PUBLIC_APP_URL}/recruiter/dashboard`
      : `${process.env.NEXT_PUBLIC_APP_URL}/jobs`;

  const roleText =
    role === 'recruiter'
      ? 'Start posting jobs and find committed candidates.'
      : 'Start browsing jobs and apply with confidence.';

  return {
    subject: `Welcome to TrustHire, ${name}! 🎉`,
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
            <p style="color:#c7d2fe;margin-top:8px;font-size:14px;">Where Commitment Meets Opportunity</p>
          </div>
          <div style="background:#ffffff;padding:40px 30px;border-radius:0 0 16px 16px;">
            <h2 style="color:#1f2937;margin-top:0;">Welcome aboard, ${name}! 👋</h2>
            <p style="color:#4b5563;font-size:16px;line-height:1.6;">
              Your account has been successfully created as a <strong style="color:#4F46E5;text-transform:capitalize;">${role}</strong>.
            </p>
            <p style="color:#4b5563;font-size:16px;line-height:1.6;">
              ${roleText}
            </p>
            <div style="margin:30px 0;">
              <div style="background:#f0fdf4;border-left:4px solid #22c55e;padding:16px;border-radius:0 8px 8px 0;">
                <p style="margin:0;color:#166534;font-size:14px;">
                  ✅ Email verified successfully<br>
                  ✅ Account is active and ready to use
                </p>
              </div>
            </div>
            <div style="text-align:center;margin:30px 0;">
              <a href="${dashboardUrl}" style="background:#4F46E5;color:#ffffff;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:bold;font-size:16px;display:inline-block;">
                Go to Dashboard →
              </a>
            </div>
            <hr style="border:none;border-top:1px solid #e5e7eb;margin:30px 0;">
            <p style="color:#9ca3af;font-size:12px;text-align:center;">
              You're receiving this because you signed up on TrustHire.<br>
              © ${new Date().getFullYear()} TrustHire. All rights reserved.
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}
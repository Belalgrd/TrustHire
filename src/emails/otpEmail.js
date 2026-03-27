export function generateOtpEmail(name, otp) {
  return {
    subject: `${otp} is your TrustHire verification code`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px; background: #ffffff;">
        
        <div style="text-align: center; margin-bottom: 32px;">
          <span style="font-size: 28px;">⚡</span>
          <span style="font-size: 22px; font-weight: 700; color: #111827;">
            Trust<span style="color: #4f46e5;">Hire</span>
          </span>
        </div>

        <h2 style="color: #111827; font-size: 20px; margin-bottom: 8px; text-align: center;">
          Verify your email
        </h2>
        
        <p style="color: #6b7280; font-size: 15px; text-align: center; margin-bottom: 32px;">
          Hi <strong>${name}</strong>, use this code to complete your registration:
        </p>

        <div style="background: #f3f4f6; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 32px;">
          <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #4f46e5;">
            ${otp}
          </span>
        </div>

        <p style="color: #9ca3af; font-size: 13px; text-align: center; margin-bottom: 8px;">
          This code expires in <strong>10 minutes</strong>.
        </p>
        
        <p style="color: #9ca3af; font-size: 13px; text-align: center;">
          If you didn't request this, you can safely ignore this email.
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0 16px;" />
        
        <p style="color: #d1d5db; font-size: 11px; text-align: center;">
          © ${new Date().getFullYear()} TrustHire. Where commitment meets opportunity.
        </p>
      </div>
    `,
  };
}
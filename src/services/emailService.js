import resend from '@/lib/resend';

async function sendEmail(to, subject, html) {
  try {
    const result = await resend.emails.send({
      from: 'TrustHire <onboarding@resend.dev>',
      to,
      subject,
      html,
    });

    if (result.error) {
      console.error('❌ Email error:', result.error);
      return false;
    }

    console.log('✅ Email sent to:', to);
    return true;
  } catch (error) {
    console.error('❌ Email failed:', error.message);
    return false;
  }
}

export async function sendApplicationReceivedEmail(applicantEmail, applicantName, jobTitle, company) {
  return sendEmail(
    applicantEmail,
    `Application received — ${jobTitle}`,
    `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
      <h2 style="color: #111;">Application Submitted! ✅</h2>
      <p>Hi <strong>${applicantName}</strong>,</p>
      <p>Your application for <strong>${jobTitle}</strong> at <strong>${company}</strong> has been received.</p>
      <p>The recruiter will review it soon. You can track the status on your dashboard.</p>
      <p style="color: #6b7280; font-size: 13px; margin-top: 32px;">— TrustHire Team</p>
    </div>
    `
  );
}

export async function sendInterviewInviteEmail(applicantEmail, applicantName, jobTitle, company) {
  return sendEmail(
    applicantEmail,
    `🎉 Interview Invite — ${jobTitle}`,
    `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
      <h2 style="color: #111;">You've Been Invited! 🎉</h2>
      <p>Hi <strong>${applicantName}</strong>,</p>
      <p>Great news! <strong>${company}</strong> wants to interview you for <strong>${jobTitle}</strong>.</p>
      <p>Please check your dashboard for details and make sure to attend.</p>
      <div style="background: #fef3c7; padding: 16px; border-radius: 12px; margin: 16px 0;">
        <p style="color: #92400e; margin: 0; font-size: 14px;">⚠️ If you have a challenge fee, it will be forfeited if you don't attend.</p>
      </div>
      <p style="color: #6b7280; font-size: 13px; margin-top: 32px;">— TrustHire Team</p>
    </div>
    `
  );
}

export async function sendRefundEmail(applicantEmail, applicantName, amount, reason) {
  return sendEmail(
    applicantEmail,
    `💰 Refund Processed — ₹${amount}`,
    `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
      <h2 style="color: #111;">Refund Processed! 💰</h2>
      <p>Hi <strong>${applicantName}</strong>,</p>
      <p>Your challenge fee of <strong>₹${amount}</strong> has been refunded.</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p>The amount will appear in your account within 5-7 business days.</p>
      <p style="color: #6b7280; font-size: 13px; margin-top: 32px;">— TrustHire Team</p>
    </div>
    `
  );
}

export async function sendForfeitEmail(applicantEmail, applicantName, amount, reason) {
  return sendEmail(
    applicantEmail,
    `Challenge Fee Forfeited — ₹${amount}`,
    `
    <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 24px;">
      <h2 style="color: #111;">Fee Forfeited ❌</h2>
      <p>Hi <strong>${applicantName}</strong>,</p>
      <p>Your challenge fee of <strong>₹${amount}</strong> has been forfeited.</p>
      <p><strong>Reason:</strong> ${reason}</p>
      <p style="color: #6b7280; font-size: 13px; margin-top: 32px;">— TrustHire Team</p>
    </div>
    `
  );
}
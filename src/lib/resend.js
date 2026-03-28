// src/lib/resend.js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail({ to, subject, html }) {
  try {
    const data = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'TrustHire <onboarding@resend.dev>',
      to,
      subject,
      html,
    });
    console.log('Email sent:', data);
    return { success: true, data };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error };
  }
}

export default resend;
// src/lib/notifications.js
import Notification from '@/models/Notification';

export async function createNotification({ userId, type, title, message, link }) {
  try {
    const notification = await Notification.create({
      userId,
      type,
      title,
      message,
      link: link || '',
    });
    console.log(`🔔 Notification created: ${type} → ${userId}`);
    return notification;
  } catch (error) {
    console.error('🔔 Notification creation failed:', error);
    return null;
  }
}
import webpush from 'web-push';
import { PushNotificationPayload, PushSubscriptionPayload } from '@/types/push';
import { ensureWebPushConfigured } from './config';
import { readPushSubscriptions, removePushSubscription } from './store';

const DEFAULT_PAYLOAD: PushNotificationPayload = {
  title: '오늘의샵 알림',
  body: '웹 푸시 알림이 정상적으로 연결되었습니다.',
  url: '/',
  tag: 'todayshop-general',
};

function normalizePayload(payload?: Partial<PushNotificationPayload>) {
  return {
    title: payload?.title?.trim() || DEFAULT_PAYLOAD.title,
    body: payload?.body?.trim() || DEFAULT_PAYLOAD.body,
    url: payload?.url?.trim() || DEFAULT_PAYLOAD.url,
    tag: payload?.tag?.trim() || DEFAULT_PAYLOAD.tag,
  };
}

function isExpiredSubscriptionError(error: unknown) {
  const candidate = error as { statusCode?: number };
  return candidate.statusCode === 404 || candidate.statusCode === 410;
}

export async function sendPushNotification(
  subscription: PushSubscriptionPayload,
  payload?: Partial<PushNotificationPayload>
) {
  ensureWebPushConfigured();

  try {
    await webpush.sendNotification(subscription, JSON.stringify(normalizePayload(payload)));
  } catch (error) {
    if (isExpiredSubscriptionError(error)) {
      await removePushSubscription(subscription.endpoint);
    }

    throw error;
  }
}

export async function broadcastPushNotification(payload?: Partial<PushNotificationPayload>) {
  const subscriptions = await readPushSubscriptions();
  const results = await Promise.allSettled(
    subscriptions.map((subscription) => sendPushNotification(subscription, payload))
  );

  return {
    total: subscriptions.length,
    sent: results.filter((result) => result.status === 'fulfilled').length,
    failed: results.filter((result) => result.status === 'rejected').length,
  };
}

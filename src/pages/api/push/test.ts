import type { NextApiRequest, NextApiResponse } from 'next';
import { hasPushConfiguration } from '@/server/push/config';
import { sendPushNotification } from '@/server/push/service';
import { upsertPushSubscription } from '@/server/push/store';
import { PushNotificationPayload, isPushSubscriptionPayload } from '@/types/push';

function extractPayload(value: unknown): Partial<PushNotificationPayload> | undefined {
  if (!value || typeof value !== 'object') {
    return undefined;
  }

  const candidate = value as Partial<PushNotificationPayload>;

  return {
    title: typeof candidate.title === 'string' ? candidate.title : undefined,
    body: typeof candidate.body === 'string' ? candidate.body : undefined,
    url: typeof candidate.url === 'string' ? candidate.url : undefined,
    tag: typeof candidate.tag === 'string' ? candidate.tag : undefined,
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed.' });
  }

  if (!hasPushConfiguration()) {
    return res.status(503).json({ message: 'Push notifications are not configured.' });
  }

  const subscription = req.body?.subscription;

  if (!isPushSubscriptionPayload(subscription)) {
    return res.status(400).json({ message: 'Invalid push subscription payload.' });
  }

  const payload = extractPayload(req.body?.payload);

  await upsertPushSubscription(subscription);
  await sendPushNotification(subscription, payload);

  return res.status(200).json({ ok: true });
}

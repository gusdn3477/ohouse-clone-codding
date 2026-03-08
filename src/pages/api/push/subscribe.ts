import type { NextApiRequest, NextApiResponse } from 'next';
import { upsertPushSubscription } from '@/server/push/store';
import { isPushSubscriptionPayload } from '@/types/push';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed.' });
  }

  const subscription = req.body?.subscription;

  if (!isPushSubscriptionPayload(subscription)) {
    return res.status(400).json({ message: 'Invalid push subscription payload.' });
  }

  await upsertPushSubscription(subscription);

  return res.status(200).json({ ok: true });
}

import type { NextApiRequest, NextApiResponse } from 'next';
import { removePushSubscription } from '@/server/push/store';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method not allowed.' });
  }

  const endpoint = req.body?.endpoint;

  if (typeof endpoint !== 'string' || endpoint.length === 0) {
    return res.status(400).json({ message: 'Endpoint is required.' });
  }

  await removePushSubscription(endpoint);

  return res.status(200).json({ ok: true });
}

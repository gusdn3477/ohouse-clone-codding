import type { NextApiRequest, NextApiResponse } from 'next';
import { getPublicVapidKey } from '@/server/push/config';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ message: 'Method not allowed.' });
  }

  const publicKey = getPublicVapidKey();

  if (!publicKey) {
    return res.status(503).json({ message: 'Push notifications are not configured.' });
  }

  return res.status(200).json({ publicKey });
}

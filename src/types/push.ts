export interface PushSubscriptionPayload {
  endpoint: string;
  expirationTime: number | null;
  keys: {
    auth: string;
    p256dh: string;
  };
}

export interface PushNotificationPayload {
  body: string;
  tag?: string;
  title: string;
  url: string;
}

export function isPushSubscriptionPayload(value: unknown): value is PushSubscriptionPayload {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<PushSubscriptionPayload>;

  return (
    typeof candidate.endpoint === 'string' &&
    candidate.endpoint.length > 0 &&
    !!candidate.keys &&
    typeof candidate.keys.auth === 'string' &&
    candidate.keys.auth.length > 0 &&
    typeof candidate.keys.p256dh === 'string' &&
    candidate.keys.p256dh.length > 0
  );
}

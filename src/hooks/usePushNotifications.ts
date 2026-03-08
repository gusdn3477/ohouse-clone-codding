import { useCallback, useEffect, useState } from 'react';
import { PushNotificationPayload, PushSubscriptionPayload, isPushSubscriptionPayload } from '@/types/push';

function isPushSupported() {
  return (
    typeof window !== 'undefined' &&
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'PushManager' in window
  );
}

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const normalized = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(normalized);
  const output = new Uint8Array(rawData.length);

  for (let index = 0; index < rawData.length; index += 1) {
    output[index] = rawData.charCodeAt(index);
  }

  return output;
}

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = (await response.json().catch(() => ({}))) as { message?: string } & T;

  if (!response.ok) {
    throw new Error(payload.message || 'Request failed.');
  }

  return payload;
}

function serializeSubscription(subscription: PushSubscription) {
  const serialized = subscription.toJSON() as PushSubscriptionPayload;

  if (!isPushSubscriptionPayload(serialized)) {
    throw new Error('Push subscription could not be serialized.');
  }

  return serialized;
}

async function getReadyRegistration() {
  return navigator.serviceWorker.ready;
}

type PermissionState = NotificationPermission | 'unsupported';

export function usePushNotifications() {
  const [permission, setPermission] = useState<PermissionState>('default');
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const syncSubscription = useCallback(async () => {
    if (!isPushSupported()) {
      setPermission('unsupported');
      setSubscription(null);
      return;
    }

    setPermission(Notification.permission);

    const registration = await getReadyRegistration();
    const currentSubscription = await registration.pushManager.getSubscription();

    setSubscription(currentSubscription);
  }, []);

  useEffect(() => {
    void syncSubscription();
  }, [syncSubscription]);

  const subscribe = useCallback(async () => {
    if (!isPushSupported()) {
      setPermission('unsupported');
      setError('이 브라우저는 웹 푸시 알림을 지원하지 않습니다.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const requestedPermission =
        Notification.permission === 'granted'
          ? 'granted'
          : await Notification.requestPermission();

      setPermission(requestedPermission);

      if (requestedPermission !== 'granted') {
        throw new Error('알림 권한이 허용되지 않았습니다.');
      }

      const registration = await getReadyRegistration();
      const existingSubscription = await registration.pushManager.getSubscription();

      const nextSubscription =
        existingSubscription ||
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(
            (
              await parseResponse<{ publicKey: string }>(await fetch('/api/push/public-key'))
            ).publicKey
          ),
        }));

      await parseResponse(
        await fetch('/api/push/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            subscription: serializeSubscription(nextSubscription),
          }),
        })
      );

      setSubscription(nextSubscription);
    } catch (candidate) {
      const nextError = candidate instanceof Error ? candidate.message : '알림 설정 중 문제가 발생했습니다.';
      setError(nextError);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const unsubscribe = useCallback(async () => {
    if (!subscription) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await parseResponse(
        await fetch('/api/push/unsubscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            endpoint: subscription.endpoint,
          }),
        })
      );

      await subscription.unsubscribe();
      setSubscription(null);
      setPermission(Notification.permission);
    } catch (candidate) {
      const nextError = candidate instanceof Error ? candidate.message : '알림 해제 중 문제가 발생했습니다.';
      setError(nextError);
    } finally {
      setIsLoading(false);
    }
  }, [subscription]);

  const sendTestNotification = useCallback(
    async (payload?: Partial<PushNotificationPayload>) => {
      if (!subscription) {
        setError('먼저 알림 구독을 활성화해야 합니다.');
        return;
      }

      setIsSending(true);
      setError(null);

      try {
        await parseResponse(
          await fetch('/api/push/test', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              subscription: serializeSubscription(subscription),
              payload,
            }),
          })
        );
      } catch (candidate) {
        const nextError =
          candidate instanceof Error ? candidate.message : '테스트 알림 전송에 실패했습니다.';
        setError(nextError);
      } finally {
        setIsSending(false);
      }
    },
    [subscription]
  );

  return {
    error,
    isLoading,
    isSending,
    isSubscribed: !!subscription,
    isSupported: permission !== 'unsupported',
    permission,
    sendTestNotification,
    subscribe,
    unsubscribe,
  };
}

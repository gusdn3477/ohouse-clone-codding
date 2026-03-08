declare module 'web-push' {
  interface PushSubscription {
    endpoint: string;
    expirationTime?: number | null;
    keys: {
      auth: string;
      p256dh: string;
    };
  }

  interface WebPush {
    sendNotification(subscription: PushSubscription, payload?: string): Promise<unknown>;
    setVapidDetails(subject: string, publicKey: string, privateKey: string): void;
  }

  const webpush: WebPush;

  export default webpush;
}

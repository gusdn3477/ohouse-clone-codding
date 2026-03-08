import { useEffect } from 'react';

export function useRegisterServiceWorker() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      return;
    }

    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return;
    }

    let cancelled = false;

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js');

        if (!cancelled) {
          registration.update().catch(() => undefined);
        }
      } catch (error) {
        console.error('Failed to register service worker:', error);
      }
    };

    if (document.readyState === 'complete') {
      register();
      return () => {
        cancelled = true;
      };
    }

    window.addEventListener('load', register, { once: true });

    return () => {
      cancelled = true;
      window.removeEventListener('load', register);
    };
  }, []);
}

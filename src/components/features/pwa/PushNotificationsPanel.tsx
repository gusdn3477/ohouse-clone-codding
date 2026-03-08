import { FormEvent, useState } from 'react';
import Button from '@/components/common/Button';
import { usePushNotifications } from '@/hooks/usePushNotifications';

const DEFAULT_TITLE = '오늘의샵 알림';
const DEFAULT_BODY = '새로운 상품 소식과 장바구니 업데이트를 가장 먼저 받아보세요.';

export default function PushNotificationsPanel() {
  const {
    error,
    isLoading,
    isSending,
    isSubscribed,
    isSupported,
    permission,
    sendTestNotification,
    subscribe,
    unsubscribe,
  } = usePushNotifications();
  const [title, setTitle] = useState(DEFAULT_TITLE);
  const [body, setBody] = useState(DEFAULT_BODY);

  const handleTestSend = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await sendTestNotification({
      title,
      body,
      url: '/products',
      tag: 'todayshop-test',
    });
  };

  const permissionLabel = {
    default: '권한 요청 전',
    denied: '권한 차단됨',
    granted: '권한 허용됨',
    unsupported: '지원하지 않음',
  }[permission];

  return (
    <section className="py-12 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card overflow-hidden border border-border">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="bg-gradient-to-br from-sky-50 via-white to-cyan-50 px-6 py-8 lg:px-10 lg:py-10">
              <span className="inline-flex rounded-full bg-white px-3 py-1 text-xs font-bold text-primary shadow-sm">
                PWA Push
              </span>
              <h2 className="mt-4 text-2xl font-bold text-text lg:text-3xl">
                웹 푸시 알림을 켜고 새 소식을 바로 받아보세요
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-7 text-text-secondary lg:text-base">
                설치 가능한 앱 구성 위에 푸시 구독과 테스트 발송까지 붙였습니다. 브라우저 권한을 허용하면
                서비스워커가 알림을 수신하고, 클릭 시 다시 오늘의샵으로 복귀합니다.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-white px-3 py-2 text-sm font-medium text-text shadow-sm">
                  상태: {isSubscribed ? '구독됨' : '미구독'}
                </span>
                <span className="rounded-full bg-white px-3 py-2 text-sm font-medium text-text shadow-sm">
                  권한: {permissionLabel}
                </span>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {!isSubscribed && (
                  <Button onClick={subscribe} disabled={!isSupported || isLoading}>
                    {isLoading ? '구독 설정 중...' : '알림 구독 켜기'}
                  </Button>
                )}
                {isSubscribed && (
                  <Button variant="secondary" onClick={unsubscribe} disabled={isLoading}>
                    {isLoading ? '해제 중...' : '알림 구독 해제'}
                  </Button>
                )}
              </div>

              {!isSupported && (
                <p className="mt-4 text-sm text-accent">
                  현재 브라우저에서는 푸시 알림을 사용할 수 없습니다.
                </p>
              )}

              {permission === 'denied' && (
                <p className="mt-4 text-sm text-accent">
                  브라우저 설정에서 알림 권한을 다시 허용해야 구독할 수 있습니다.
                </p>
              )}

              {error && <p className="mt-4 text-sm text-accent">{error}</p>}
            </div>

            <div className="px-6 py-8 lg:px-10 lg:py-10">
              <div className="mb-5">
                <h3 className="text-lg font-bold text-text">테스트 알림 보내기</h3>
                <p className="mt-2 text-sm leading-6 text-text-secondary">
                  현재 기기에 등록된 구독으로 즉시 테스트 푸시를 보냅니다. 서버에서는 VAPID 키로 서명하고,
                  서비스워커는 수신한 payload로 알림을 표시합니다.
                </p>
              </div>

              <form className="space-y-4" onSubmit={handleTestSend}>
                <div>
                  <label className="mb-2 block text-sm font-medium text-text" htmlFor="push-title">
                    알림 제목
                  </label>
                  <input
                    id="push-title"
                    className="input"
                    value={title}
                    maxLength={60}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder={DEFAULT_TITLE}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-text" htmlFor="push-body">
                    알림 본문
                  </label>
                  <textarea
                    id="push-body"
                    className="input min-h-[120px] resize-y"
                    value={body}
                    maxLength={120}
                    onChange={(event) => setBody(event.target.value)}
                    placeholder={DEFAULT_BODY}
                  />
                </div>

                <Button type="submit" variant="secondary" fullWidth disabled={!isSubscribed || isSending}>
                  {isSending ? '테스트 알림 전송 중...' : '이 기기로 테스트 알림 보내기'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

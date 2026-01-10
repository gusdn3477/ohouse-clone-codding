// 공통 유틸리티

// Throttle 함수
export function throttle<T extends (...args: unknown[]) => void>(fn: T, delay: number): T {
    let lastCall = 0;
    let timeoutId: NodeJS.Timeout | null = null;

    return ((...args: unknown[]) => {
        const now = Date.now();
        const remaining = delay - (now - lastCall);

        if (remaining <= 0) {
            if (timeoutId) {
                clearTimeout(timeoutId);
                timeoutId = null;
            }
            lastCall = now;
            fn(...args);
        } else if (!timeoutId) {
            timeoutId = setTimeout(() => {
                lastCall = Date.now();
                timeoutId = null;
                fn(...args);
            }, remaining);
        }
    }) as T;
}

// Debounce 함수
export function debounce<T extends (...args: unknown[]) => void>(fn: T, delay: number): T {
    let timeoutId: NodeJS.Timeout | null = null;

    return ((...args: unknown[]) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
            fn(...args);
        }, delay);
    }) as T;
}

// 가격 포맷팅
export function formatPrice(price: number, currency = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
    }).format(price);
}

// 할인가 계산
export function calculateDiscountedPrice(price: number, discountPercentage: number): number {
    return price * (1 - discountPercentage / 100);
}

// 클래스네임 병합 (cn 유틸리티)
export function cn(...classes: (string | boolean | undefined | null)[]): string {
    return classes.filter(Boolean).join(' ');
}

import { memo } from 'react';

interface BadgeProps {
    count?: number;
    variant?: 'default' | 'primary' | 'accent' | 'discount' | 'new' | 'soldout';
    position?: 'absolute' | 'static';
    className?: string;
    children?: React.ReactNode;
}

const Badge = memo(function Badge({
    count,
    variant = 'default',
    position = 'static',
    className = '',
    children,
}: BadgeProps) {
    // 숫자가 0이거나 없으면 렌더링하지 않음
    if (count !== undefined && count <= 0) {
        return null;
    }

    // variant별 스타일
    const variantStyles = {
        default: 'badge',
        primary: 'badge badge-new',
        accent: 'bg-accent text-white',
        discount: 'badge badge-discount',
        new: 'badge badge-new',
        soldout: 'badge badge-soldout',
    };

    // position별 스타일
    const positionStyles = position === 'absolute'
        ? 'absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 min-w-5 h-5 flex items-center justify-center px-1.5 text-xs font-bold rounded-full'
        : '';

    const baseStyle = variantStyles[variant];
    const combinedClassName = `${baseStyle} ${positionStyles} ${className}`.trim();

    // 숫자 포맷팅 (99+ 처리)
    const displayContent = count !== undefined
        ? count > 99 ? '99+' : count
        : children;

    return (
        <span className={combinedClassName}>
            {displayContent}
        </span>
    );
});

export default Badge;

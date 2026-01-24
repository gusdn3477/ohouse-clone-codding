import { HTMLAttributes } from 'react';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
    children: React.ReactNode;
}

export default function CardRoot({
    hover = true,
    className = '',
    children,
    ...props
}: CardProps) {
    const baseStyles = 'card';
    const hoverStyles = hover ? '' : 'hover:shadow-card';

    return (
        <div className={`${baseStyles} ${hoverStyles} ${className}`.trim()} {...props}>
            {children}
        </div>
    );
}

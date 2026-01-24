import { HTMLAttributes } from 'react';

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export default function CardHeader({
    className = '',
    children,
    ...props
}: CardHeaderProps) {
    return (
        <div className={`px-6 py-4 border-b border-border ${className}`.trim()} {...props}>
            {children}
        </div>
    );
}

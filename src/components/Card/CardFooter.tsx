import { HTMLAttributes } from 'react';

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export default function CardFooter({
    className = '',
    children,
    ...props
}: CardFooterProps) {
    return (
        <div className={`px-6 py-4 border-t border-border ${className}`.trim()} {...props}>
            {children}
        </div>
    );
}

import { HTMLAttributes } from 'react';

export interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function CardFooter({ className = '', children, ...props }: CardFooterProps) {
  return (
    <div className={`border-t border-border px-6 py-4 ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

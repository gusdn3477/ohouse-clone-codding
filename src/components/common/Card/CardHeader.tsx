import { HTMLAttributes } from 'react';

export interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function CardHeader({ className = '', children, ...props }: CardHeaderProps) {
  return (
    <div className={`border-b border-border px-6 py-4 ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

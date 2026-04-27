import { HTMLAttributes } from 'react';

export interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function CardBody({ className = '', children, ...props }: CardBodyProps) {
  return (
    <div className={`p-6 ${className}`.trim()} {...props}>
      {children}
    </div>
  );
}

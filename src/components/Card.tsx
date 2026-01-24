import { HTMLAttributes } from 'react';

// 메인 Card 컴포넌트
interface CardProps extends HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
    children: React.ReactNode;
}

function CardRoot({
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

// Card.Header
interface CardHeaderProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

function CardHeader({
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

// Card.Body
interface CardBodyProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

function CardBody({
    className = '',
    children,
    ...props
}: CardBodyProps) {
    return (
        <div className={`p-6 ${className}`.trim()} {...props}>
            {children}
        </div>
    );
}

// Card.Footer
interface CardFooterProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

function CardFooter({
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

// Compound Component 패턴 - Object.assign으로 타입 안전하게 구성
const Card = Object.assign(CardRoot, {
    Header: CardHeader,
    Body: CardBody,
    Footer: CardFooter,
});

export default Card;

import { HTMLAttributes } from 'react';

type DrawerPosition = 'left' | 'right' | 'bottom' | 'full';

export interface DrawerContentProps extends HTMLAttributes<HTMLDivElement> {
    position?: DrawerPosition;
    children: React.ReactNode;
}

export default function DrawerContent({
    position = 'full',
    className = '',
    children,
    ...props
}: DrawerContentProps) {
    const positionStyles = {
        full: 'inset-0',
        left: 'inset-y-0 left-0 w-80',
        right: 'inset-y-0 right-0 w-80',
        bottom: 'inset-x-0 bottom-0 h-96',
    };

    return (
        <div
            className={`absolute bg-white flex flex-col animate-in fade-in duration-200 ${positionStyles[position]} ${className}`.trim()}
            {...props}
        >
            {children}
        </div>
    );
}

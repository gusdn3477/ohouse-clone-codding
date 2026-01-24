import { HTMLAttributes } from 'react';
import { useDrawer } from './DrawerContext';

export default function DrawerOverlay({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
    const { onClose } = useDrawer();

    return (
        <div
            className={`absolute inset-0 bg-black/50 animate-in fade-in ${className}`.trim()}
            onClick={onClose}
            {...props}
        />
    );
}

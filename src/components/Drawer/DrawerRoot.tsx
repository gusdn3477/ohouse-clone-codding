import { useEffect, useState, useRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { DrawerContext } from './DrawerContext';

export interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    className?: string; // Container className
}

export default function DrawerRoot({
    isOpen,
    onClose,
    children,
    className = '',
}: DrawerProps) {
    const [mounted, setMounted] = useState(false);
    const isBackRef = useRef(false);

    // Body scroll lock & Back button handling
    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';

            // Push history state
            window.history.pushState({ drawerOpen: true }, '', window.location.href);

            const handlePopState = () => {
                isBackRef.current = true;
                onClose();
            };

            window.addEventListener('popstate', handlePopState);

            return () => {
                document.body.style.overflow = '';
                window.removeEventListener('popstate', handlePopState);

                // If closing manually (not by back button), revert history
                if (!isBackRef.current) {
                    window.history.back();
                }
                isBackRef.current = false;
            };
        } else {
            document.body.style.overflow = '';
        }
    }, [isOpen, onClose]);

    if (!mounted || !isOpen) return null;

    return createPortal(
        <DrawerContext.Provider value={{ isOpen, onClose }}>
            <div className={`fixed inset-0 z-[100] ${className}`}>
                {children}
            </div>
        </DrawerContext.Provider>,
        document.body
    );
}

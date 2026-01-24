import { useEffect, useState, useRef, ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    className?: string;
    position?: 'left' | 'right' | 'bottom' | 'full'; // 확장성을 위해 준비
}

export default function Drawer({
    isOpen,
    onClose,
    children,
    className = '',
    position = 'full', // 현재는 full screen 기본
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

    // Position styles mapping
    const positionStyles = {
        full: 'inset-0', // Full Screen
        left: 'inset-y-0 left-0 w-80', // Left sidebar (example)
        right: 'inset-y-0 right-0 w-80', // Right sidebar (example)
        bottom: 'inset-x-0 bottom-0 h-96', // Bottom sheet (example)
    };

    return createPortal(
        <div className="fixed inset-0 z-[100]">
            {/* Backdrop (Only for non-full screen, but here we cover everything) */}
            {position !== 'full' && (
                <div
                    className="absolute inset-0 bg-black/50 animate-in fade-in"
                    onClick={onClose}
                />
            )}

            {/* Content Container */}
            <div
                className={`absolute bg-white flex flex-col animate-in fade-in duration-200 ${positionStyles[position]} ${className}`}
            >
                {children}
            </div>
        </div>,
        document.body
    );
}

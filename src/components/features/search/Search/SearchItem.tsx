import { ReactNode, HTMLAttributes, forwardRef } from 'react';

interface SearchItemProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    rightContent?: ReactNode;
    active?: boolean;
}

export const SearchItem = forwardRef<HTMLDivElement, SearchItemProps>(
    ({ children, rightContent, active, className = '', onClick, ...props }, ref) => {
        return (
            <div
                ref={ref}
                role="button"
                tabIndex={0}
                onClick={onClick}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.currentTarget.click();
                    }
                }}
                className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-background-secondary transition-colors cursor-pointer ${active ? 'bg-background-secondary' : ''
                    } ${className}`}
                {...props}
            >
                <div className="flex items-center gap-2 text-sm text-text truncate pointer-events-none">
                    {children}
                </div>
                {rightContent && <div className="ml-2 flex-shrink-0 text-text-secondary">{rightContent}</div>}
            </div>
        );
    }
);

SearchItem.displayName = 'SearchItem';

import { ReactNode, ButtonHTMLAttributes, forwardRef } from 'react';

interface SearchItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    rightContent?: ReactNode;
    active?: boolean;
}

export const SearchItem = forwardRef<HTMLButtonElement, SearchItemProps>(
    ({ children, rightContent, active, className = '', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={`w-full flex items-center justify-between px-4 py-3 text-left hover:bg-background-secondary transition-colors ${
                    active ? 'bg-background-secondary' : ''
                } ${className}`}
                {...props}
            >
                <div className="flex items-center gap-2 text-sm text-text truncate">
                    {children}
                </div>
                {rightContent && <div className="ml-2 flex-shrink-0 text-text-secondary">{rightContent}</div>}
            </button>
        );
    }
);

SearchItem.displayName = 'SearchItem';

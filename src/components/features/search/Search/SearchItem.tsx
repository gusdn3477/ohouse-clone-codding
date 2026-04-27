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
        className={`flex w-full cursor-pointer items-center justify-between px-4 py-3 text-left transition-colors hover:bg-background-secondary ${
          active ? 'bg-background-secondary' : ''
        } ${className}`}
        {...props}
      >
        <div className="pointer-events-none flex items-center gap-2 truncate text-sm text-text">
          {children}
        </div>
        {rightContent && (
          <div className="ml-2 flex-shrink-0 text-text-secondary">{rightContent}</div>
        )}
      </div>
    );
  }
);

SearchItem.displayName = 'SearchItem';

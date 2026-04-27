import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';

export interface SearchBarProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onSearch: (value: string) => void;
  onChange: (value: string) => void;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  containerClassName?: string;
  inputClassName?: string;
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      value,
      onSearch,
      onChange,
      leftIcon,
      rightIcon,
      containerClassName = '',
      inputClassName = '',
      placeholder = '검색어를 입력하세요',
      ...props
    },
    ref
  ) => {
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      onSearch(value);
    };

    return (
      <form
        onSubmit={handleSubmit}
        className={`relative flex w-full items-center ${containerClassName}`}
      >
        {leftIcon && (
          <div className="pointer-events-none absolute left-3 text-text-secondary">{leftIcon}</div>
        )}
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full rounded-md bg-background-secondary py-2.5 transition-colors focus:outline-none ${
            leftIcon ? 'pl-10' : 'pl-4'
          } ${rightIcon ? 'pr-10' : 'pr-4'} ${inputClassName}`}
          {...props}
        />
        {rightIcon ? (
          <div className="absolute right-3">{rightIcon}</div>
        ) : (
          <button
            type="submit"
            className="absolute right-3 p-1 text-text-secondary transition-colors hover:text-primary"
            aria-label="검색"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        )}
      </form>
    );
  }
);

SearchBar.displayName = 'SearchBar';

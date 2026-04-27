import { memo, InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  clearable?: boolean;
  onClear?: () => void;
}

const Input = memo(
  forwardRef<HTMLInputElement, InputProps>(function Input(
    {
      label,
      error,
      helperText,
      fullWidth = false,
      leftIcon,
      rightIcon,
      clearable = false,
      onClear,
      className = '',
      id,
      value,
      ...props
    },
    ref
  ) {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    const widthStyle = fullWidth ? 'w-full' : '';
    const errorStyle = error ? 'border-accent focus:border-accent' : '';
    const hasLeftIcon = !!leftIcon;
    const hasRightIcon = !!rightIcon || (clearable && value);

    const paddingLeft = hasLeftIcon ? 'pl-10' : 'pl-4';
    const paddingRight = hasRightIcon ? 'pr-10' : 'pr-4';

    const showClearButton = clearable && value && String(value).length > 0;

    return (
      <div className={`${widthStyle}`}>
        {label && (
          <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-text">
            {label}
          </label>
        )}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
              {leftIcon}
            </div>
          )}

          {/* Input */}
          <input
            ref={ref}
            id={inputId}
            value={value}
            className={`input ${errorStyle} ${paddingLeft} ${paddingRight} ${className}`.trim()}
            aria-invalid={error ? 'true' : 'false'}
            aria-describedby={
              error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />

          {/* Right Icons */}
          <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-1">
            {showClearButton && (
              <button
                type="button"
                onClick={onClear}
                className="p-0.5 text-text-secondary transition-colors hover:text-text"
                aria-label="Clear input"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            )}
            {rightIcon && !showClearButton && (
              <div className="pointer-events-none text-text-secondary">{rightIcon}</div>
            )}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <p id={`${inputId}-error`} className="mt-1 text-sm text-accent" role="alert">
            {error}
          </p>
        )}

        {/* Helper Text */}
        {helperText && !error && (
          <p id={`${inputId}-helper`} className="mt-1 text-sm text-text-secondary">
            {helperText}
          </p>
        )}
      </div>
    );
  })
);

export default Input;

import { memo, ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
}

const Button = memo(
  forwardRef<HTMLButtonElement, ButtonProps>(function Button(
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      className = '',
      children,
      disabled,
      ...props
    },
    ref
  ) {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200';

    const variantStyles = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      accent: 'btn-accent',
    };

    const sizeStyles = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-3 text-base',
      lg: 'px-8 py-4 text-lg',
    };

    const widthStyle = fullWidth ? 'w-full' : '';
    const disabledStyle = disabled ? 'opacity-50 cursor-not-allowed' : '';

    const combinedClassName = `
    ${baseStyles}
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    ${widthStyle}
    ${disabledStyle}
    ${className}
  `
      .trim()
      .replace(/\s+/g, ' ');

    return (
      <button ref={ref} className={combinedClassName} disabled={disabled} {...props}>
        {children}
      </button>
    );
  })
);

export default Button;

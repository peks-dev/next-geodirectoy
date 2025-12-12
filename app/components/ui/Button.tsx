'use client';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { getIconSizeClass, type IconSize } from '@/lib/utils/getIconSize';

const buttonStyles = {
  base: 'items-center text-center cursor-pointer focus:outline-none transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed font-bold uppercase font-heading border-none',
  variants: {
    primary:
      'text-dark-primary px-4 py-2 bg-background-accent w-full text-sm font-bold uppercase hover-neon hover:-translate-y-0.5 active:scale-105',
    secondary: 'text-foreground-accent text-sm hover-neon-text px-4 py-2',
    tertiary:
      'text-xs text-accent-primary hover:text-accent-primary text-foreground-accent',
    delete:
      'bg-error text-white px-2 hover:shadow-[0_0_5px_var(--color-error),0_0_10px_var(--color-error)] active:scale-105',
    icon: 'self-center p-1 hover:text-foreground-accent text-accent-primary hover-neon-text',
  },
};

type ButtonVariant = keyof typeof buttonStyles.variants;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: IconSize;
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      loading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Classes para el botón
    const buttonClasses = [
      buttonStyles.base,
      buttonStyles.variants[variant],
      loading ? 'animate-pulse opacity-50' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        data-loading={loading}
        type={props.type || 'button'}
        {...props}
      >
        {variant === 'icon' || variant === 'delete' ? (
          <figure className={getIconSizeClass(size)}>{children}</figure>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

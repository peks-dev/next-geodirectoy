'use client';

import { ButtonHTMLAttributes, forwardRef } from 'react';

const buttonStyles = {
  base: 'items-center text-center cursor-pointer focus:outline-none transition-all duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed font-bold uppercase font-heading border-none',
  variants: {
    primary:
      'bg-background-accent w-full text-foreground-on-accent text-sm font-bold uppercase hover-neon hover:-translate-y-0.5 active:scale-105',
    secondary: 'bg-transparent text-foreground-accent text-xs hover-neon-text',
    tertiary:
      'text-xs text-accent-primary hover:text-accent-primary text-foreground-accent',
    delete:
      'bg-error text-white p-0 flex-grow-0 relative z-10 w-12 hover:shadow-error hover:shadow-lg',
    icon: 'self-center p-1 hover:text-foreground-accent w-[4rem] h-[4rem]',
  },
  sizes: {
    default: 'px-4 py-2',
    sm: 'px-3 py-1.5',
    lg: 'px-6 py-3',
    icon: 'p-1',
  },
};

type ButtonVariant = keyof typeof buttonStyles.variants;
type ButtonSize = keyof typeof buttonStyles.sizes;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'default',
      loading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    // Si la variante es 'icon' y no se especifica un tamaño, se usa el tamaño 'icon' por defecto.
    const buttonSize = variant === 'icon' && size === 'default' ? 'icon' : size;

    const classes = [
      buttonStyles.base,
      buttonStyles.variants[variant],
      buttonStyles.sizes[buttonSize],
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
        className={classes}
        disabled={disabled || loading}
        data-loading={loading}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

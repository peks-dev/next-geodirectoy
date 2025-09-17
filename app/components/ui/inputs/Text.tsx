import { InputHTMLAttributes, forwardRef } from 'react';
import Corner from '@/app/components/ui/svgs/Corner';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => {
    const wrapperClasses = [
      'group',
      'relative',
      'h-[clamp(4rem,10vh,5.5rem)]',
      'w-full',
      'border-2',
      'border-dashed',
      'border-[var(--color-border)]',
      'p-[0.2rem]',
      'transition-all',
      'duration-200',
      'ease-in-out',
      'focus-within:border-[var(--color-foreground)]',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const inputClasses = [
      'h-full',
      'w-full',
      'px-4',
      'text-sm',
      'outline-none',
      'border-none',
      'bg-transparent',
      'text-foreground',
      'text-inherit',
      'placeholder:text-[var(--color-border)]',
    ].join(' ');

    return (
      <div className={wrapperClasses}>
        <input ref={ref} className={inputClasses} {...props} />
        <Corner position="top-left" size="small" variant="interactive" />
        <Corner position="top-right" size="small" variant="interactive" />
        <Corner position="bottom-left" size="small" variant="interactive" />
        <Corner position="bottom-right" size="small" variant="interactive" />
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;

import { TextareaHTMLAttributes, forwardRef } from 'react';
import { CornerIcon } from '@/app/components/ui/svgs/';

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className = '', ...props }, ref) => {
    const wrapperClasses = [
      'group',
      'relative',
      'min-h-[clamp(4rem,10vh,5.5rem)]', // Minimum height, allows expansion
      'w-full',
      'border-2',
      'border-dashed',
      'border-(--color-border)',
      'p-[0.2rem]',
      'transition-all',
      'duration-200',
      'ease-in-out',
      'focus-within:border-(--color-foreground)',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    const textareaClasses = [
      'h-full',
      'w-full',
      'px-4',
      'py-2', // Added padding for better text spacing in textarea
      'text-sm',
      'outline-none',
      'border-none',
      'bg-transparent',
      'text-foreground',
      'text-inherit',
      'placeholder:text-[--color-border]',
      'resize-none', // Prevent resizing
    ].join(' ');

    return (
      <div className={wrapperClasses}>
        <textarea ref={ref} className={textareaClasses} {...props} />
        <CornerIcon position="top-left" size="small" variant="interactive" />
        <CornerIcon position="top-right" size="small" variant="interactive" />
        <CornerIcon position="bottom-left" size="small" variant="interactive" />
        <CornerIcon
          position="bottom-right"
          size="small"
          variant="interactive"
        />
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export default Textarea;

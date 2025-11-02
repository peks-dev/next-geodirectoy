'use client';

import Button from '../Button';
import CloseIcon from '../svgs/CloseIcon';

interface CloseButtonProps {
  onClick?: () => void;
  'aria-label'?: string;
  className?: string; // Add className prop
}

export default function CloseButton({
  onClick,
  'aria-label': ariaLabel,
  className, // Destructure className
}: CloseButtonProps) {
  return (
    <Button
      variant="delete"
      onClick={onClick}
      aria-label={ariaLabel}
      className={className}
    >
      <CloseIcon />
    </Button>
  );
}

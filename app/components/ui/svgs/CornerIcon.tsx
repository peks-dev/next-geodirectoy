interface CornerProps {
  position: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  size: 'small' | 'medium' | 'large';
  variant?: 'static' | 'interactive';
  className?: string;
}

const CornerIcon = ({
  position,
  size,
  variant = 'static',
  className = '',
}: CornerProps) => {
  // Base classes
  const baseClasses =
    'absolute text-[var(--color-border-interactive)] transition-all duration-300 ease-in-out pointer-events-none';

  // Position classes
  const positionClasses = {
    'top-left': 'left-xs top-xs',
    'top-right': 'right-xs top-xs rotate-90',
    'bottom-left': 'left-xs bottom-xs -rotate-90',
    'bottom-right': 'right-xs bottom-xs rotate-180',
  };

  // Size classes
  const sizeClasses = {
    small: 'size-[clamp(1rem,1.2vw,1.2rem)]',
    medium: 'size-[clamp(1.2rem,1.7vw,1.5rem)]',
    large: 'size-12',
  };

  // Variant classes for the SVG
  const variantClasses = {
    static:
      '[filter:drop-shadow(0_0_2px_currentColor)_drop-shadow(0_0_4px_currentColor)]',
    interactive:
      '[filter:none] group-hover:[filter:drop-shadow(0_0_2px_currentColor)_drop-shadow(0_0_4px_currentColor)] group-focus-within:[filter:drop-shadow(0_0_2px_currentColor)_drop-shadow(0_0_4px_currentColor)]',
  };

  const combinedClasses =
    `${baseClasses} ${positionClasses[position]} ${sizeClasses[size]} ${className}`.trim();

  return (
    <div className={combinedClasses}>
      <svg
        viewBox="0 0 8 7.935"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={variantClasses[variant]}
      >
        <path
          id="Path Union"
          d="M1 1.00006L1 7.93469L0 7.93469L0 0L1 0L1 6.10352e-05L8 6.10352e-05L8 1.00006L1 1.00006Z"
          fill="currentColor"
          fillRule="evenodd"
        />
      </svg>
    </div>
  );
};

export default CornerIcon;

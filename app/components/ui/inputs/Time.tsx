import { forwardRef, InputHTMLAttributes } from 'react';

interface TimeInputProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'type' | 'onChange'
> {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  wrapperClass?: string;
  labelClass?: string;
  inputClass?: string;
}

const TimeInput = forwardRef<HTMLInputElement, TimeInputProps>(
  (
    {
      label,
      value,
      onChange,
      wrapperClass = '',
      labelClass = '',
      inputClass = '',
      className = '', // Para compatibilidad con otros className
      ...props
    },
    ref
  ) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    };

    return (
      <div
        className={`flex w-full flex-col items-center overflow-hidden ${wrapperClass}`.trim()}
      >
        {label && (
          <label htmlFor={props.id} className={`mb-lg ${labelClass}`.trim()}>
            {label}
          </label>
        )}
        <input
          ref={ref}
          type="time"
          value={value}
          onChange={handleChange}
          className={`bg-background-interactive text-md text-accent-primary w-full border-none text-center ${inputClass} ${className}`.trim()}
          style={{ textAlign: 'center' }}
          {...props}
        />
      </div>
    );
  }
);

TimeInput.displayName = 'TimeInput';

export default TimeInput;

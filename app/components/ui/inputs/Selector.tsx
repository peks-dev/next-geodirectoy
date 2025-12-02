'use client';

interface Option {
  value: string | number;
  label: string;
}

interface InputSelectorProps {
  label?: string;
  options: Option[];
  value?: string;
  onChange: (value: string | number) => void;
  placeholder?: string;
  className?: string;
}

export function InputSelector({
  label,
  options,
  value,
  onChange,
  placeholder = 'Selecciona una opción',
  className = '',
}: InputSelectorProps) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {label && (
        <label className="text-border text-3xl font-medium">{label}</label>
      )}

      <select
        value={value ?? 'none'}
        onChange={(e) => onChange(e.target.value)}
        className="focus-visible:ring-ring text-2x1 border-accent-primary hover-neon-effect flex w-full border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="none" disabled className="text-2xl">
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="text-4x1">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

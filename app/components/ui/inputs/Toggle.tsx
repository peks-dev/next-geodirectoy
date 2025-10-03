interface Props {
  type: 'radio' | 'checkbox';
  id: string;
  text: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checked?: boolean;
  wrapperClass?: string; // Clases adicionales para el div wrapper
  labelClass?: string; // Clases adicionales para el label
}

const ToggleInput = ({
  type,
  text,
  name,
  id,
  value,
  onChange,
  checked,
  wrapperClass = '',
  labelClass = '',
}: Props) => (
  <label
    htmlFor={id}
    className={`border-accent-primary flex h-min cursor-pointer border-2 border-solid p-1.5 ${wrapperClass} ${checked ? 'neon-shadow bg-accent-primary' : ''} `.trim()}
  >
    <input
      type={type}
      name={name}
      value={value}
      id={id}
      checked={checked}
      onChange={onChange}
      className="hidden"
    />
    <span
      className={`h-full w-full px-2 py-1 font-bold ${labelClass} ${checked ? 'text-dark-primary bg-accent-primary' : 'text-accent-primary bg-background-interactive'} `.trim()}
    >
      {text}
    </span>
  </label>
);

export default ToggleInput;

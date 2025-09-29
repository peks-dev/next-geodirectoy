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
    className={`
       p-1.5 flex cursor-pointer border-accent-primary border-2 border-solid h-min
       ${wrapperClass}
       ${checked ? 'neon-shadow bg-accent-primary' : ''}
     `.trim()}
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
      className={`
         px-2 py-1 font-bold w-full h-full
         ${labelClass}
         ${checked ? 'text-dark-primary bg-accent-primary' : 'text-accent-primary bg-background-interactive'}
       `.trim()}
    >
      {text}
    </span>
  </label>
);

export default ToggleInput;

import IconBox from '../ui/IconBox';

interface Props {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}

export default function OptionMenu({ label, icon, onClick, disabled }: Props) {
  return (
    <li className="w-[90%]">
      <button
        className={`text-accent-primary gap-md hover-neon-text flex w-full items-center justify-around transition-opacity active:scale-105 ${
          disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
        }`}
        onClick={onClick}
        disabled={disabled}
      >
        <span className="text-sm font-bold">{label}</span>
        <div className="divider bg-accent-primary m-auto h-0.5 w-auto grow"></div>
        <IconBox icon={icon} size="md" className="text-accent-primary" />
      </button>
    </li>
  );
}

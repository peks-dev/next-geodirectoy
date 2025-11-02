import CloseButton from '../Buttons/CloseButton';
interface Props {
  deleteFn?: () => void;
  children?: React.ReactNode;
  className?: string;
}
export default function ItemContainer({
  deleteFn,
  children,
  className,
}: Props) {
  return (
    <li
      className={`border-border gap-sm flex items-stretch justify-between border-2 p-2.5 ${className}`}
    >
      <div className="bg-border p-sm text-dark-primary grow">{children}</div>
      {deleteFn ? <CloseButton onClick={deleteFn} /> : null}
    </li>
  );
}

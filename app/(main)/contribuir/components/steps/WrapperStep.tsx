interface WrapperProps {
  children: React.ReactNode;
  className?: string;
}

export default function WrapperStep({
  children,
  className = '',
}: WrapperProps) {
  return <div className={`w-full h-full ${className}`}>{children}</div>;
}

import type { ReactNode } from 'react';

interface TransparentContainerProps {
  children: ReactNode;
  className?: string;
}
const baseStyles =
  'backdrop-blur-sm shadow-[inset_0_0_100px_rgba(255,255,255,0.2)] p-md transition-all duration-200 ease-in-out';

export default function TransparentContainer({
  children,
  className = '',
}: TransparentContainerProps) {
  // Combinamos los estilos base con cualquier clase adicional que se pase
  const containerStyle = `${baseStyles} ${className}`;

  return <div className={containerStyle}>{children}</div>;
}

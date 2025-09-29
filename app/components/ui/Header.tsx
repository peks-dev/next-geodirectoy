import type { ReactNode } from 'react';

interface HeaderProps {
  children: ReactNode;
}

export default function HeaderContainer({ children }: HeaderProps) {
  const headerStyles = `bg-dark-primary p-sm mb-md`;
  return <header className={headerStyles}>{children}</header>;
}

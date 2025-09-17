import type { ReactNode } from 'react';

interface HeaderProps {
  children: ReactNode;
}

export default function HeaderContainer({ children }: HeaderProps) {
  const headerStyles = `bg-background-secondary p-sm mb-md`;
  return <header className={headerStyles}>{children}</header>;
}

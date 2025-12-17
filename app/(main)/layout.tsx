import React from 'react';

interface MainLayoutProps {
  children: React.ReactNode;
  panel: React.ReactNode;
}

export default function MainLayout({ children, panel }: MainLayoutProps) {
  return (
    <>
      {children}
      {panel}
    </>
  );
}

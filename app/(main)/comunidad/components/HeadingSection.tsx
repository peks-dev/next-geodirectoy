import React from 'react';
interface Props {
  children?: React.ReactNode;
  text: string;
}

export default function HeadingSection({ text, children }: Props) {
  return (
    <div className="border-border-secondary mb-4 flex flex-shrink-0 justify-between border-b-2 p-2">
      <h2 className="text-md text-border uppercase">{text}</h2>
      {children}
    </div>
  );
}
